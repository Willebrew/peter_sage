/**
 * Tools Types
 */
/**
 * JSON Schema for tool parameters
 */
interface JSONSchema {
    type: 'object' | 'string' | 'number' | 'boolean' | 'array';
    properties?: Record<string, JSONSchema & {
        description?: string;
    }>;
    required?: string[];
    items?: JSONSchema;
    description?: string;
    enum?: string[];
}
/**
 * Tool definition
 */
interface Tool {
    /** Unique tool name */
    name: string;
    /** Human-readable description */
    description: string;
    /** JSON Schema for parameters */
    parameters: JSONSchema;
    /** Execute the tool */
    execute: (args: Record<string, unknown>, context: ToolContext) => Promise<unknown>;
    /** Optional per-tool timeout in ms (overrides config.agent.toolTimeout) */
    timeout?: number;
    /** Optional per-tool max result size in chars (overrides config.agent.maxToolResultSize) */
    maxResultSize?: number;
}
/**
 * Context passed to tool execution
 */
interface ToolContext {
    /** User ID making the request */
    userId: string;
    /** Conversation ID */
    conversationId: string;
    /** Session ID */
    sessionId: string;
    /** Additional context from the agent */
    metadata?: Record<string, unknown>;
}
/**
 * Tool registry interface
 */
interface ToolRegistry {
    /**
     * Register a tool directly
     */
    register(tool: Tool): void;
    /**
     * Register tools from an MCP server
     */
    registerMCP(serverUrl: string, options?: MCPOptions): Promise<void>;
    /**
     * List all registered tools
     */
    list(): Tool[];
    /**
     * Get a tool by name
     */
    get(name: string): Tool | undefined;
    /**
     * Execute a tool by name
     */
    execute(name: string, args: Record<string, unknown>, context: ToolContext): Promise<unknown>;
    /**
     * Get tools in API format (for LLM)
     */
    toAPIFormat(): APITool[];
}
/**
 * MCP server options
 */
interface MCPOptions {
    /** Headers to include in requests */
    headers?: Record<string, string>;
    /** Credentials to inject (e.g., API keys) */
    credentials?: Record<string, string>;
    /** Timeout for MCP requests */
    timeout?: number;
}
/**
 * Tool in API format (for sending to LLM)
 */
interface APITool {
    type: 'function';
    name: string;
    description: string;
    parameters: JSONSchema;
}
/**
 * Tool call result
 */
interface ToolResult {
    toolCallId: string;
    name: string;
    result: unknown;
    error?: string;
}

export type { APITool as A, JSONSchema as J, MCPOptions as M, Tool as T, ToolContext as a, ToolRegistry as b, ToolResult as c };
