import { T as ToolCall, A as AgentResult, M as Message, a as SageConfig } from '../types-in3oy7jN.js';
import { a as StreamStore } from '../types-CKoo0gcf.js';
import { b as ToolRegistry, T as Tool } from '../types-BpZ5RLfX.js';
import { d as SummaryState, g as WorkingMemoryManager, C as ContextConfig } from '../types-CMD9oqF0.js';
import { S as SessionRepository, f as MessageRepository } from '../types-EuCqmFOB.js';
import 'zod';
import '../utils/index.js';

/**
 * Agent Types
 */

/**
 * Context passed to the agentic loop
 */
interface AgentContext {
    /** Session ID */
    sessionId: string;
    /** Conversation ID */
    conversationId: string;
    /** User ID */
    userId: string;
    /** Stream ID for Redis/memory streams */
    streamId: string;
    /** System prompt for the agent */
    systemPrompt: string;
    /** Conversation messages */
    messages: Message[];
    /** Available tools */
    tools: ToolRegistry;
    /** Stream store for real-time updates */
    streamStore: StreamStore;
    /** SAGE configuration */
    config: SageConfig;
    /** Callbacks */
    callbacks?: AgentCallbacks;
    /** Agent identifier (e.g. 'root' or subagent name) */
    agentId: string;
    /** Nesting depth (0 = root agent) */
    agentDepth: number;
    /** Context management state (summary from previous truncation) */
    existingSummary?: SummaryState;
    /** Working memory manager instance */
    workingMemory?: WorkingMemoryManager;
    /** Context engine configuration */
    contextConfig?: ContextConfig;
}
/**
 * Callbacks for agent events
 */
interface AgentCallbacks {
    /** Called when a token is streamed */
    onToken?: (token: string) => void;
    /** Called when reasoning is streamed */
    onReasoning?: (reasoning: string) => void;
    /** Called when a tool is called */
    onToolCall?: (toolCall: ToolCall) => void;
    /** Called when a tool returns a result */
    onToolResult?: (toolCallId: string, result: string) => void;
    /** Called when the agent completes */
    onComplete?: (result: AgentResult) => void;
    /** Called on error */
    onError?: (error: Error) => void;
    /** Called when session status changes */
    onStatusChange?: (status: string) => void;
    /** Called when a subagent starts */
    onSubagentStart?: (agentId: string, task: string) => void;
    /** Called when a subagent ends */
    onSubagentEnd?: (agentId: string, result: string) => void;
}
/**
 * Options for the agentic loop
 */
interface AgentLoopOptions {
    /** Maximum tool loop depth (default: 10) */
    maxDepth?: number;
    /** Tool execution timeout in ms (default: 30000) */
    toolTimeout?: number;
}
/**
 * Accumulated result during streaming
 */
interface StreamAccumulator {
    content: string;
    reasoning: string;
    toolCalls: ToolCall[];
    inputTokens: number;
    outputTokens: number;
}

/**
 * Agentic Loop
 *
 * The core recursive loop that processes messages, handles tool calls,
 * and streams responses using the OpenAI Responses API.
 *
 * PARALLEL TOOL EXECUTION:
 * When the LLM returns multiple tool calls in a single response, they are
 * executed in parallel using Promise.all(). This enables:
 * - Multiple subagents running simultaneously
 * - Faster execution of independent tools
 * - The LLM controls parallelism by choosing how many tools to call per turn
 *
 * Error handling: Each tool's errors are captured individually. If one tool
 * fails, others continue running. All results (success or error) are collected
 * and passed back to the LLM for the next iteration.
 *
 * LIFECYCLE HOOKS:
 * The loop calls optional hooks at key points for observability and interception:
 * - beforeLLMCall: Before sending request to LLM
 * - afterLLMCall: After receiving LLM response
 * - beforeToolExecution: Before executing each tool (can modify args)
 * - afterToolExecution: After tool completes (success or failure)
 * - onError: When any error occurs
 * - onComplete: When agent completes successfully
 */

/**
 * Process a message with tool loop support
 *
 * This is the core agentic loop that:
 * 1. Sends messages to the LLM via Responses API
 * 2. Streams the response
 * 3. If tool calls are returned, executes them and recurses
 * 4. If no tool calls, returns the final result
 *
 * @param context - Agent context with messages, tools, config, etc.
 * @param depth - Current recursion depth (for safety)
 * @returns The final agent result
 */
declare function processWithToolLoop(context: AgentContext, depth?: number): Promise<AgentResult>;

/**
 * Session Management
 *
 * Handles creating and managing agentic sessions.
 */

/**
 * Options for creating a session
 */
interface CreateSessionOptions {
    conversationId: string;
    userId: string;
    systemPrompt: string;
    messages: AgentContext['messages'];
    tools: ToolRegistry;
    streamStore: StreamStore;
    config: SageConfig;
    sessionRepository?: SessionRepository;
    messageRepository?: MessageRepository;
    callbacks?: AgentCallbacks;
    workingMemory?: WorkingMemoryManager;
    contextConfig?: ContextConfig;
}
/**
 * Create and start a new agentic session
 */
declare function createSession(options: CreateSessionOptions): Promise<{
    sessionId: string;
    streamId: string;
    result: Promise<void>;
}>;
/**
 * Build a system prompt for the agent
 */
declare function buildSystemPrompt(options: {
    agentName?: string;
    basePrompt?: string;
    projectInstructions?: string;
    timezone?: string;
    hasMemoryTools?: boolean;
}): string;
/**
 * Generate a unique stream ID
 */
declare function generateStreamId(): string;

/**
 * Stream Handler
 *
 * Processes SSE events from the OpenAI Responses API,
 * updating the accumulator and stream store.
 */

/**
 * Context for stream event handling
 */
interface StreamHandlerContext {
    streamStore: StreamStore;
    streamId: string;
    accumulator: StreamAccumulator;
    callbacks?: AgentCallbacks;
    agentId?: string;
    agentDepth?: number;
}
/**
 * Handle a single SSE event from the Responses API
 */
declare function handleStreamEvent(event: ResponsesAPIEvent, context: StreamHandlerContext): Promise<void>;
/**
 * Responses API event types
 */
interface ResponsesAPIEvent {
    type: string;
    item?: {
        type?: string;
        id?: string;
        call_id?: string;
        name?: string;
    };
    item_id?: string;
    output_index?: number;
    delta?: string;
    call_id?: string;
    name?: string;
    arguments?: string;
    response?: {
        usage?: {
            input_tokens?: number;
            output_tokens?: number;
        };
    };
}

/**
 * Subagent Module
 *
 * Enables parent agents to delegate tasks to child agents.
 * Each subagent runs its own processWithToolLoop with isolated
 * tools, system prompt, and message history but writes to the
 * same stream with agentId/agentDepth attribution.
 */

/**
 * Subagent definition — mirrors SubagentConfig but kept as a
 * plain interface for use in non-Zod contexts.
 */
interface SubagentDefinition {
    name: string;
    description: string;
    systemPrompt: string;
    toolNames?: string[];
    mcpServers?: string[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
    maxDepth?: number;
}
/**
 * Create a delegation tool for a single subagent definition.
 *
 * The returned Tool, when executed, spins up a child agent loop
 * that writes to the same stream as the parent.
 */
declare function createSubagentTool(definition: SubagentDefinition, parentContext: AgentContext, allTools: Tool[], maxAgentDepth: number, allDefinitions: SubagentDefinition[]): Tool;
/**
 * Register delegation tools for all subagent definitions on a registry.
 *
 * If the parent is already at or beyond maxAgentDepth, no tools are
 * registered (preventing further nesting).
 */
declare function registerSubagentTools(registry: ToolRegistry, definitions: SubagentDefinition[], parentContext: AgentContext, allTools: Tool[], maxAgentDepth: number): void;

export { type AgentCallbacks, type AgentContext, type AgentLoopOptions, type CreateSessionOptions, type StreamAccumulator, type StreamHandlerContext, type SubagentDefinition, buildSystemPrompt, createSession, createSubagentTool, generateStreamId, handleStreamEvent, processWithToolLoop, registerSubagentTools };
