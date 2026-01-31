import { processWithToolLoop } from '@sage/core/agent';
import { createToolRegistry } from '@sage/core/tools';
import { MemoryStreamStore } from '@sage/core/streaming';
import { setContextWindows, estimateTokens, estimateTotalTokens } from '@sage/core/context';
import type { AgentContext, AgentCallbacks } from '@sage/core/agent';
import type { ContextConfig, SummaryState } from '@sage/core/context';
import type { SageConfig, SAGEHooks } from '@sage/core';
import { config } from '@/lib/config';
import { allMoltbookTools } from '@/lib/tools';
import { buildCycleInput } from './decision-engine';
import { activityStore } from '@/lib/streaming/activity-store';
import type { AgentStatus, ContextWindowState, UserMessage } from './types';

const MIN_SLEEP_MS = 2 * 60 * 1000; // 2 min
const MAX_SLEEP_MS = 5 * 60 * 1000; // 5 min

/** Context window sizes for common Ollama models */
const OLLAMA_CONTEXT_WINDOWS: Record<string, number> = {
  'gpt-oss:20b': 32_768,
  'llama3': 8_192,
  'llama3:70b': 8_192,
  'mistral': 32_768,
  'mixtral': 32_768,
  'qwen2': 32_768,
  'deepseek-coder': 16_384,
  'phi3': 4_096,
  'gemma2': 8_192,
};

class AutonomousAgent {
  private running = false;
  private cycleCount = 0;
  private startedAt: number | null = null;
  private lastCycleAt: number | null = null;
  private currentAction: string | null = null;
  private error: string | null = null;
  private abortController: AbortController | null = null;

  private streamStore = new MemoryStreamStore();
  private toolRegistry = createToolRegistry();
  private initialized = false;

  /** Persisted across cycles so the summarizer can build incrementally */
  private existingSummary: SummaryState | undefined;

  /** Context window usage — updated each cycle for the dashboard */
  private contextState: ContextWindowState = {
    contextWindow: 32_768,
    maxResponseTokens: 1024,
    systemPromptTokens: 0,
    messageTokens: 0,
    summaryTokens: 0,
    totalUsed: 0,
    remaining: 32_768,
    usagePercent: 0,
    wasTruncated: false,
    hasSummary: false,
    summaryPreview: null,
    updatedAt: Date.now(),
  };

  /** Queue of user messages to inject into next cycle */
  private messageQueue: UserMessage[] = [];

  private initialize(): void {
    if (this.initialized) return;
    for (const tool of allMoltbookTools) {
      this.toolRegistry.register(tool);
    }
    // Register Ollama model context windows so SAGE knows the budget
    setContextWindows(OLLAMA_CONTEXT_WINDOWS);
    this.initialized = true;
  }

  getStatus(): AgentStatus {
    return {
      running: this.running,
      cycleCount: this.cycleCount,
      startedAt: this.startedAt,
      lastCycleAt: this.lastCycleAt,
      currentAction: this.currentAction,
      error: this.error,
    };
  }

  getContextState(): ContextWindowState {
    return { ...this.contextState };
  }

  /** Enqueue a user message/suggestion for the next cycle */
  pushMessage(text: string): void {
    this.messageQueue.push({ text, timestamp: Date.now() });
    activityStore.push('status', `User message queued: "${text.slice(0, 80)}"`);
  }

  /** Peek at pending messages */
  getPendingMessages(): UserMessage[] {
    return [...this.messageQueue];
  }

  async start(): Promise<void> {
    if (this.running) return;
    this.initialize();
    this.running = true;
    this.startedAt = Date.now();
    this.cycleCount = 0;
    this.error = null;
    this.existingSummary = undefined;
    this.abortController = new AbortController();

    activityStore.push('status', 'Agent started');

    this.loop().catch((err) => {
      this.error = err instanceof Error ? err.message : String(err);
      activityStore.push('error', `Loop crashed: ${this.error}`);
      this.running = false;
    });
  }

  stop(): void {
    this.running = false;
    this.abortController?.abort();
    activityStore.push('status', 'Agent stopping (will finish current cycle)');
  }

  private async loop(): Promise<void> {
    while (this.running) {
      try {
        await this.runCycle();
        this.cycleCount++;
        this.lastCycleAt = Date.now();
        activityStore.push('cycle_complete', `Cycle ${this.cycleCount} complete`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        this.error = msg;
        activityStore.push('error', `Cycle error: ${msg}`);
      }

      if (!this.running) break;

      // If there are pending user messages, skip the sleep and act immediately
      if (this.messageQueue.length > 0) {
        activityStore.push('status', 'User message pending — starting next cycle immediately');
        continue;
      }

      const sleepMs =
        MIN_SLEEP_MS + Math.random() * (MAX_SLEEP_MS - MIN_SLEEP_MS);
      activityStore.push(
        'status',
        `Sleeping for ${Math.round(sleepMs / 1000)}s before next cycle`
      );
      await this.sleep(sleepMs);
    }

    activityStore.push('status', 'Agent stopped');
  }

  private async runCycle(): Promise<unknown> {
    // Drain the message queue — combine into the cycle input
    const userMessages = this.messageQueue.splice(0);
    const { systemPrompt, messages } = buildCycleInput(userMessages);

    this.currentAction = 'Deciding what to do...';
    activityStore.push('status', 'Starting new cycle — Peter is thinking...');

    const sessionId = `cycle-${this.cycleCount}-${Date.now()}`;
    const streamId = `stream-${sessionId}`;
    const ctxWindow = OLLAMA_CONTEXT_WINDOWS[config.ollama.model] ?? 32_768;

    // Build SAGE lifecycle hooks for observability + context tracking
    const hooks: SAGEHooks = {
      beforeLLMCall: async (hookCtx) => {
        // Update context window state from the messages about to be sent
        const sysTokens = estimateTokens(systemPrompt);
        const msgTokens = estimateTotalTokens(hookCtx.messages);
        const summaryTokens = this.existingSummary
          ? estimateTokens(this.existingSummary.text ?? '')
          : 0;
        const totalUsed = sysTokens + msgTokens + summaryTokens + 1024; // +response budget
        this.contextState = {
          contextWindow: ctxWindow,
          maxResponseTokens: 1024,
          systemPromptTokens: sysTokens,
          messageTokens: msgTokens,
          summaryTokens,
          totalUsed,
          remaining: Math.max(0, ctxWindow - totalUsed),
          usagePercent: Math.min(100, Math.round((totalUsed / ctxWindow) * 100)),
          wasTruncated: this.contextState.wasTruncated,
          hasSummary: !!this.existingSummary,
          summaryPreview: this.existingSummary?.text?.slice(0, 200) ?? null,
          updatedAt: Date.now(),
        };
      },
      afterToolExecution: async (tool, _args, _result, error) => {
        if (error) {
          activityStore.push('error', `Tool ${tool.name} failed: ${error.message}`, tool.name);
        }
      },
      onError: async (error) => {
        activityStore.push('error', `SAGE error: ${error.message}`);
      },
    };

    const sageConfig: SageConfig = {
      agent: {
        name: 'PeterGriffin',
        systemPrompt,
        maxDepth: 15,
        toolTimeout: 180000,
      },
      provider: {
        apiKey: 'ollama',
        baseUrl: config.ollama.baseUrl,
      },
      model: config.ollama.model,
      temperature: 0.9,
      maxTokens: 1024,
      hooks,
      retry: {
        maxAttempts: 3,
        initialDelay: 2000,
        maxDelay: 30000,
        backoffMultiplier: 2,
        jitter: 0.2,
      },
    };

    const callbacks: AgentCallbacks = {
      onToken: (token) => {
        activityStore.push('thinking', token);
      },
      onToolCall: (tc) => {
        this.currentAction = `Calling ${tc.function.name}...`;
        activityStore.push('tool_call', `Calling ${tc.function.name}(${tc.function.arguments.slice(0, 100)})`, tc.function.name);
      },
      onToolResult: (id, result) => {
        activityStore.push('tool_result', result.slice(0, 200), id);
      },
      onComplete: (result) => {
        this.currentAction = null;
        if (result.content) {
          activityStore.push('thinking', `[Final] ${result.content.slice(0, 300)}`);
        }
      },
      onError: (err) => {
        activityStore.push('error', err.message);
      },
    };

    const contextConfig: ContextConfig = {
      model: config.ollama.model,
      contextWindow: ctxWindow,
      maxResponseTokens: 1024,
      summary: {
        model: config.ollama.model,
        targetTokens: 400,
        temperature: 0.3,
        provider: {
          apiKey: 'ollama',
          baseUrl: config.ollama.baseUrl,
        },
      },
    };

    const agentContext: AgentContext = {
      sessionId,
      conversationId: 'peter-autonomous',
      userId: 'peter-griffin',
      streamId,
      systemPrompt,
      messages,
      tools: this.toolRegistry,
      streamStore: this.streamStore,
      config: sageConfig,
      callbacks,
      agentId: 'peter',
      agentDepth: 0,
      contextConfig,
      existingSummary: this.existingSummary,
    };

    const result = await processWithToolLoop(agentContext);

    // Persist summary for next cycle
    if (agentContext.existingSummary) {
      this.existingSummary = agentContext.existingSummary;
      this.contextState.hasSummary = true;
      this.contextState.summaryPreview =
        agentContext.existingSummary.text?.slice(0, 200) ?? null;
      this.contextState.wasTruncated = true;
    }

    // Final context state update
    this.contextState.updatedAt = Date.now();

    await this.streamStore.delete(streamId);
    return result;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      // Also resolve if a user message arrives (wake up early)
      const checkQueue = setInterval(() => {
        if (this.messageQueue.length > 0) {
          clearTimeout(timer);
          clearInterval(checkQueue);
          resolve();
        }
      }, 1000);
      this.abortController?.signal.addEventListener(
        'abort',
        () => {
          clearTimeout(timer);
          clearInterval(checkQueue);
          resolve();
        },
        { once: true },
      );
    });
  }
}

// Singleton
export const autonomousAgent = new AutonomousAgent();
