import { z } from 'zod';
import { RetryConfig } from './utils/index.mjs';

/**
 * Core types shared across SAGE modules
 */

declare const SubagentSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    systemPrompt: z.ZodString;
    toolNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    mcpServers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    maxDepth: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    systemPrompt: string;
    toolNames?: string[] | undefined;
    mcpServers?: string[] | undefined;
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    maxDepth?: number | undefined;
}, {
    name: string;
    description: string;
    systemPrompt: string;
    toolNames?: string[] | undefined;
    mcpServers?: string[] | undefined;
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    maxDepth?: number | undefined;
}>;
type SubagentConfig = z.infer<typeof SubagentSchema>;
declare const SageConfigSchema: z.ZodObject<{
    agent: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        systemPrompt: z.ZodOptional<z.ZodString>;
        maxDepth: z.ZodOptional<z.ZodNumber>;
        toolTimeout: z.ZodOptional<z.ZodNumber>;
        maxToolResultSize: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        systemPrompt?: string | undefined;
        maxDepth?: number | undefined;
        toolTimeout?: number | undefined;
        maxToolResultSize?: number | undefined;
    }, {
        name?: string | undefined;
        systemPrompt?: string | undefined;
        maxDepth?: number | undefined;
        toolTimeout?: number | undefined;
        maxToolResultSize?: number | undefined;
    }>>;
    provider: z.ZodOptional<z.ZodObject<{
        apiKey: z.ZodOptional<z.ZodString>;
        baseUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
    }, {
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
    }>>;
    model: z.ZodOptional<z.ZodString>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodOptional<z.ZodNumber>;
    parallelToolCalls: z.ZodOptional<z.ZodBoolean>;
    streaming: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"redis">;
        url: z.ZodString;
        keyPrefix: z.ZodOptional<z.ZodString>;
        ttl: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "redis";
        url: string;
        keyPrefix?: string | undefined;
        ttl?: number | undefined;
    }, {
        type: "redis";
        url: string;
        keyPrefix?: string | undefined;
        ttl?: number | undefined;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"memory">;
    }, "strip", z.ZodTypeAny, {
        type: "memory";
    }, {
        type: "memory";
    }>]>>;
    database: z.ZodOptional<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        type: z.ZodLiteral<"convex">;
        url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "convex";
        url: string;
    }, {
        type: "convex";
        url: string;
    }>, z.ZodObject<{
        type: z.ZodLiteral<"memory">;
    }, "strip", z.ZodTypeAny, {
        type: "memory";
    }, {
        type: "memory";
    }>]>>;
    auth: z.ZodOptional<z.ZodObject<{
        databaseUrl: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        databaseUrl: string;
    }, {
        databaseUrl: string;
    }>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodAny, "many">>;
    subagents: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        systemPrompt: z.ZodString;
        toolNames: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        mcpServers: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        model: z.ZodOptional<z.ZodString>;
        temperature: z.ZodOptional<z.ZodNumber>;
        maxTokens: z.ZodOptional<z.ZodNumber>;
        maxDepth: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        systemPrompt: string;
        toolNames?: string[] | undefined;
        mcpServers?: string[] | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        maxDepth?: number | undefined;
    }, {
        name: string;
        description: string;
        systemPrompt: string;
        toolNames?: string[] | undefined;
        mcpServers?: string[] | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        maxDepth?: number | undefined;
    }>, "many">>;
    maxAgentDepth: z.ZodOptional<z.ZodNumber>;
    context: z.ZodOptional<z.ZodObject<{
        enabled: z.ZodOptional<z.ZodBoolean>;
        model: z.ZodOptional<z.ZodString>;
        contextWindow: z.ZodOptional<z.ZodNumber>;
        maxResponseTokens: z.ZodOptional<z.ZodNumber>;
        summary: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            model: z.ZodOptional<z.ZodString>;
            targetTokens: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        }, {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        }>>;
        workingMemory: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            autoExtract: z.ZodOptional<z.ZodBoolean>;
            extractionModel: z.ZodOptional<z.ZodString>;
            maxMemoriesInPrompt: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        }>>;
        decay: z.ZodOptional<z.ZodObject<{
            enabled: z.ZodOptional<z.ZodBoolean>;
            halfLifeDays: z.ZodOptional<z.ZodNumber>;
            minConfidence: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        }, {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        model?: string | undefined;
        enabled?: boolean | undefined;
        contextWindow?: number | undefined;
        maxResponseTokens?: number | undefined;
        summary?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        } | undefined;
        workingMemory?: {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        } | undefined;
        decay?: {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        } | undefined;
    }, {
        model?: string | undefined;
        enabled?: boolean | undefined;
        contextWindow?: number | undefined;
        maxResponseTokens?: number | undefined;
        summary?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        } | undefined;
        workingMemory?: {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        } | undefined;
        decay?: {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        } | undefined;
    }>>;
    hooks: z.ZodOptional<z.ZodAny>;
    retry: z.ZodOptional<z.ZodAny>;
}, "strip", z.ZodTypeAny, {
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    agent?: {
        name?: string | undefined;
        systemPrompt?: string | undefined;
        maxDepth?: number | undefined;
        toolTimeout?: number | undefined;
        maxToolResultSize?: number | undefined;
    } | undefined;
    provider?: {
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    parallelToolCalls?: boolean | undefined;
    streaming?: {
        type: "redis";
        url: string;
        keyPrefix?: string | undefined;
        ttl?: number | undefined;
    } | {
        type: "memory";
    } | undefined;
    database?: {
        type: "convex";
        url: string;
    } | {
        type: "memory";
    } | undefined;
    auth?: {
        databaseUrl: string;
    } | undefined;
    tools?: any[] | undefined;
    subagents?: {
        name: string;
        description: string;
        systemPrompt: string;
        toolNames?: string[] | undefined;
        mcpServers?: string[] | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        maxDepth?: number | undefined;
    }[] | undefined;
    maxAgentDepth?: number | undefined;
    context?: {
        model?: string | undefined;
        enabled?: boolean | undefined;
        contextWindow?: number | undefined;
        maxResponseTokens?: number | undefined;
        summary?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        } | undefined;
        workingMemory?: {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        } | undefined;
        decay?: {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        } | undefined;
    } | undefined;
    hooks?: any;
    retry?: any;
}, {
    model?: string | undefined;
    temperature?: number | undefined;
    maxTokens?: number | undefined;
    agent?: {
        name?: string | undefined;
        systemPrompt?: string | undefined;
        maxDepth?: number | undefined;
        toolTimeout?: number | undefined;
        maxToolResultSize?: number | undefined;
    } | undefined;
    provider?: {
        apiKey?: string | undefined;
        baseUrl?: string | undefined;
    } | undefined;
    parallelToolCalls?: boolean | undefined;
    streaming?: {
        type: "redis";
        url: string;
        keyPrefix?: string | undefined;
        ttl?: number | undefined;
    } | {
        type: "memory";
    } | undefined;
    database?: {
        type: "convex";
        url: string;
    } | {
        type: "memory";
    } | undefined;
    auth?: {
        databaseUrl: string;
    } | undefined;
    tools?: any[] | undefined;
    subagents?: {
        name: string;
        description: string;
        systemPrompt: string;
        toolNames?: string[] | undefined;
        mcpServers?: string[] | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        maxTokens?: number | undefined;
        maxDepth?: number | undefined;
    }[] | undefined;
    maxAgentDepth?: number | undefined;
    context?: {
        model?: string | undefined;
        enabled?: boolean | undefined;
        contextWindow?: number | undefined;
        maxResponseTokens?: number | undefined;
        summary?: {
            model?: string | undefined;
            enabled?: boolean | undefined;
            targetTokens?: number | undefined;
        } | undefined;
        workingMemory?: {
            enabled?: boolean | undefined;
            autoExtract?: boolean | undefined;
            extractionModel?: string | undefined;
            maxMemoriesInPrompt?: number | undefined;
        } | undefined;
        decay?: {
            enabled?: boolean | undefined;
            halfLifeDays?: number | undefined;
            minConfidence?: number | undefined;
        } | undefined;
    } | undefined;
    hooks?: any;
    retry?: any;
}>;

type SageConfig = z.infer<typeof SageConfigSchema> & {
    /** Lifecycle hooks for observing and intercepting the agentic loop */
    hooks?: SAGEHooks;
    /** Retry configuration for LLM API calls */
    retry?: RetryConfig;
};
declare const DEFAULT_CONFIG: {
    readonly agent: {
        readonly maxDepth: 10;
        readonly toolTimeout: 30000;
        readonly maxToolResultSize: 50000;
    };
    readonly model: "gpt-4o";
    readonly temperature: 0.7;
    readonly maxTokens: 4096;
    readonly streaming: {
        readonly keyPrefix: "sage:stream:";
        readonly ttl: 3600;
    };
};
interface Message {
    role: 'user' | 'assistant' | 'tool' | 'system';
    content: string | ContentPart[];
    toolCalls?: ToolCall[];
    toolCallId?: string;
    reasoning?: string;
}
interface ContentPart {
    type: 'text' | 'image' | 'file';
    text?: string;
    imageUrl?: string;
    fileUrl?: string;
}
interface ToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
    status?: 'pending' | 'running' | 'completed' | 'failed';
    result?: string;
}
type SessionStatus = 'pending' | 'running' | 'tool_loop' | 'completed' | 'failed' | 'cancelled';
interface Session {
    id: string;
    conversationId: string;
    userId: string;
    streamId: string;
    status: SessionStatus;
    toolLoopDepth: number;
    createdAt: number;
    completedAt?: number;
    error?: string;
}
type StreamChunkType = 'token' | 'reasoning' | 'tool_call' | 'tool_result' | 'status' | 'error' | 'subagent_start' | 'subagent_end';
interface StreamChunk {
    type: StreamChunkType;
    content: string;
    timestamp: number;
    toolCallId?: string;
    toolName?: string;
    toolArguments?: string;
    status?: SessionStatus;
    agentId?: string;
    agentDepth?: number;
}
interface StreamEntry {
    id: string;
    data: StreamChunk;
}
interface AgentResult {
    content: string;
    reasoning?: string;
    toolCalls: ToolCall[];
    inputTokens: number;
    outputTokens: number;
}
/**
 * Context passed to lifecycle hooks
 */
interface HookContext {
    /** Session ID */
    sessionId: string;
    /** Conversation ID */
    conversationId: string;
    /** User ID */
    userId: string;
    /** Stream ID */
    streamId: string;
    /** Agent ID (root or subagent name) */
    agentId: string;
    /** Agent nesting depth */
    agentDepth: number;
    /** Current messages */
    messages: Message[];
}
/**
 * LLM response information passed to afterLLMCall hook
 */
interface LLMResponse {
    /** Response content */
    content: string;
    /** Reasoning content if any */
    reasoning?: string;
    /** Tool calls if any */
    toolCalls: ToolCall[];
    /** Input tokens used */
    inputTokens: number;
    /** Output tokens used */
    outputTokens: number;
}
/**
 * Tool information for hooks
 */
interface ToolInfo {
    /** Tool name */
    name: string;
    /** Tool description */
    description: string;
}
/**
 * Lifecycle hooks for observing and intercepting the agentic loop.
 * All hooks are optional and async.
 */
interface SAGEHooks {
    /**
     * Called before sending a request to the LLM.
     * Use for logging, metrics, or request modification.
     */
    beforeLLMCall?: (context: HookContext) => Promise<void>;
    /**
     * Called after receiving a response from the LLM.
     * Use for logging, metrics, or response analysis.
     */
    afterLLMCall?: (context: HookContext, response: LLMResponse) => Promise<void>;
    /**
     * Called before executing a tool.
     * Return modified args to change the input, or throw to prevent execution.
     * @returns Modified arguments (or original if unchanged)
     */
    beforeToolExecution?: (tool: ToolInfo, args: Record<string, unknown>, context: HookContext) => Promise<Record<string, unknown>>;
    /**
     * Called after a tool execution completes (success or failure).
     * Use for logging, metrics, or result analysis.
     */
    afterToolExecution?: (tool: ToolInfo, args: Record<string, unknown>, result: unknown, error: Error | null, context: HookContext) => Promise<void>;
    /**
     * Called when any error occurs in the agentic loop.
     * Use for error reporting (e.g., Sentry).
     */
    onError?: (error: Error, context: HookContext) => Promise<void>;
    /**
     * Called when the agent completes successfully.
     * Use for final logging, metrics, or cleanup.
     */
    onComplete?: (result: AgentResult, context: HookContext) => Promise<void>;
    /**
     * Called when a subagent starts execution.
     */
    onSubagentStart?: (agentId: string, task: string, context: HookContext) => Promise<void>;
    /**
     * Called when a subagent completes execution.
     */
    onSubagentEnd?: (agentId: string, result: string, context: HookContext) => Promise<void>;
}
/**
 * Define a SAGE configuration.
 * Validation is deferred to runtime to support build-time imports.
 */
declare function defineConfig(config: SageConfig): SageConfig;
/**
 * Validate and apply defaults to a SAGE configuration.
 * Call this at runtime before using the config.
 */
declare function validateConfig(config: SageConfig): SageConfig;

export { type AgentResult as A, type ContentPart as C, DEFAULT_CONFIG as D, type HookContext as H, type LLMResponse as L, type Message as M, type SAGEHooks as S, type ToolCall as T, type SageConfig as a, SageConfigSchema as b, type Session as c, type SessionStatus as d, type StreamChunk as e, type StreamChunkType as f, type StreamEntry as g, type SubagentConfig as h, SubagentSchema as i, type ToolInfo as j, defineConfig as k, validateConfig as v };
