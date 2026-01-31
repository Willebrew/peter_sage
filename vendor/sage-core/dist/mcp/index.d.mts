import { b as ToolRegistry } from '../types-BpZ5RLfX.mjs';

/**
 * MCP Types
 *
 * Type definitions for the Model Context Protocol (MCP).
 * Based on the MCP specification.
 */
/**
 * JSON-RPC 2.0 request
 */
interface JSONRPCRequest<T = unknown> {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: T;
}
/**
 * JSON-RPC 2.0 notification (no id, no response expected)
 */
interface JSONRPCNotification<T = unknown> {
    jsonrpc: '2.0';
    method: string;
    params?: T;
}
/**
 * JSON-RPC 2.0 success response
 */
interface JSONRPCSuccessResponse<T = unknown> {
    jsonrpc: '2.0';
    id: string | number;
    result: T;
}
/**
 * JSON-RPC 2.0 error response
 */
interface JSONRPCErrorResponse {
    jsonrpc: '2.0';
    id: string | number | null;
    error: {
        code: number;
        message: string;
        data?: unknown;
    };
}
type JSONRPCResponse<T = unknown> = JSONRPCSuccessResponse<T> | JSONRPCErrorResponse;
type JSONRPCMessage = JSONRPCRequest | JSONRPCNotification | JSONRPCResponse;
/**
 * Standard JSON-RPC error codes
 */
declare const JSONRPC_ERROR_CODES: {
    readonly PARSE_ERROR: -32700;
    readonly INVALID_REQUEST: -32600;
    readonly METHOD_NOT_FOUND: -32601;
    readonly INVALID_PARAMS: -32602;
    readonly INTERNAL_ERROR: -32603;
};
/**
 * MCP protocol version
 */
declare const MCP_VERSION = "2024-11-05";
/**
 * Server capabilities
 */
interface MCPServerCapabilities {
    /** Tools the server can execute */
    tools?: {
        /** Whether the server supports tool listing change notifications */
        listChanged?: boolean;
    };
    /** Resources the server can provide */
    resources?: {
        /** Whether the server supports subscribing to resource changes */
        subscribe?: boolean;
        /** Whether the server supports resource listing change notifications */
        listChanged?: boolean;
    };
    /** Prompts the server can provide */
    prompts?: {
        /** Whether the server supports prompt listing change notifications */
        listChanged?: boolean;
    };
    /** Logging capabilities */
    logging?: Record<string, never>;
    /** Experimental capabilities */
    experimental?: Record<string, unknown>;
}
/**
 * Client capabilities
 */
interface MCPClientCapabilities {
    /** Root capabilities */
    roots?: {
        /** Whether the client supports root listing changes */
        listChanged?: boolean;
    };
    /** Sampling capabilities */
    sampling?: Record<string, never>;
    /** Experimental capabilities */
    experimental?: Record<string, unknown>;
}
/**
 * Server info
 */
interface MCPServerInfo {
    name: string;
    version: string;
}
/**
 * Client info
 */
interface MCPClientInfo {
    name: string;
    version: string;
}
/**
 * Initialize request params
 */
interface MCPInitializeParams {
    protocolVersion: string;
    capabilities: MCPClientCapabilities;
    clientInfo: MCPClientInfo;
}
/**
 * Initialize response result
 */
interface MCPInitializeResult {
    protocolVersion: string;
    capabilities: MCPServerCapabilities;
    serverInfo: MCPServerInfo;
    instructions?: string;
}
/**
 * JSON Schema for tool parameters
 */
interface MCPToolInputSchema {
    type: 'object';
    properties?: Record<string, {
        type: string;
        description?: string;
        enum?: string[];
        items?: {
            type: string;
        };
        default?: unknown;
        [key: string]: unknown;
    }>;
    required?: string[];
    additionalProperties?: boolean;
}
/**
 * Tool definition from MCP server
 */
interface MCPTool {
    name: string;
    description?: string;
    inputSchema: MCPToolInputSchema;
}
/**
 * Tool list response
 */
interface MCPToolListResult {
    tools: MCPTool[];
    nextCursor?: string;
}
/**
 * Tool call request params
 */
interface MCPToolCallParams {
    name: string;
    arguments?: Record<string, unknown>;
}
/**
 * Content types for tool results
 */
interface MCPTextContent {
    type: 'text';
    text: string;
}
interface MCPImageContent {
    type: 'image';
    data: string;
    mimeType: string;
}
interface MCPResourceContent {
    type: 'resource';
    resource: {
        uri: string;
        mimeType?: string;
        text?: string;
        blob?: string;
    };
}
type MCPContent = MCPTextContent | MCPImageContent | MCPResourceContent;
/**
 * Tool call result
 */
interface MCPToolCallResult {
    content: MCPContent[];
    isError?: boolean;
}
/**
 * Resource definition
 */
interface MCPResource {
    uri: string;
    name: string;
    description?: string;
    mimeType?: string;
}
/**
 * Resource list result
 */
interface MCPResourceListResult {
    resources: MCPResource[];
    nextCursor?: string;
}
/**
 * Resource read params
 */
interface MCPResourceReadParams {
    uri: string;
}
/**
 * Resource read result
 */
interface MCPResourceReadResult {
    contents: Array<{
        uri: string;
        mimeType?: string;
        text?: string;
        blob?: string;
    }>;
}
/**
 * Prompt argument definition
 */
interface MCPPromptArgument {
    name: string;
    description?: string;
    required?: boolean;
}
/**
 * Prompt definition
 */
interface MCPPrompt {
    name: string;
    description?: string;
    arguments?: MCPPromptArgument[];
}
/**
 * Prompt list result
 */
interface MCPPromptListResult {
    prompts: MCPPrompt[];
    nextCursor?: string;
}
/**
 * Prompt get params
 */
interface MCPPromptGetParams {
    name: string;
    arguments?: Record<string, string>;
}
/**
 * Prompt message role
 */
type MCPPromptRole = 'user' | 'assistant';
/**
 * Prompt message
 */
interface MCPPromptMessage {
    role: MCPPromptRole;
    content: MCPTextContent | MCPImageContent | MCPResourceContent;
}
/**
 * Prompt get result
 */
interface MCPPromptGetResult {
    description?: string;
    messages: MCPPromptMessage[];
}
/**
 * Progress notification params
 */
interface MCPProgressParams {
    progressToken: string | number;
    progress: number;
    total?: number;
}
/**
 * Log level
 */
type MCPLogLevel = 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency';
/**
 * Log message params
 */
interface MCPLogMessageParams {
    level: MCPLogLevel;
    logger?: string;
    data: unknown;
}
/**
 * MCP method names
 */
declare const MCP_METHODS: {
    readonly INITIALIZE: "initialize";
    readonly INITIALIZED: "notifications/initialized";
    readonly SHUTDOWN: "shutdown";
    readonly TOOLS_LIST: "tools/list";
    readonly TOOLS_CALL: "tools/call";
    readonly RESOURCES_LIST: "resources/list";
    readonly RESOURCES_READ: "resources/read";
    readonly RESOURCES_SUBSCRIBE: "resources/subscribe";
    readonly RESOURCES_UNSUBSCRIBE: "resources/unsubscribe";
    readonly PROMPTS_LIST: "prompts/list";
    readonly PROMPTS_GET: "prompts/get";
    readonly PROGRESS: "notifications/progress";
    readonly LOG_MESSAGE: "notifications/message";
    readonly TOOLS_LIST_CHANGED: "notifications/tools/list_changed";
    readonly RESOURCES_LIST_CHANGED: "notifications/resources/list_changed";
    readonly PROMPTS_LIST_CHANGED: "notifications/prompts/list_changed";
};
/**
 * MCP Transport interface
 */
interface MCPTransport {
    /** Connect to the server */
    connect(): Promise<void>;
    /** Disconnect from the server */
    disconnect(): Promise<void>;
    /** Send a JSON-RPC message */
    send(message: JSONRPCRequest | JSONRPCNotification): Promise<void>;
    /** Set message handler */
    onMessage(handler: (message: JSONRPCMessage) => void): void;
    /** Set error handler */
    onError(handler: (error: Error) => void): void;
    /** Set close handler */
    onClose(handler: () => void): void;
    /** Check if connected */
    isConnected(): boolean;
}
/**
 * Transport configuration base
 */
interface MCPTransportConfig {
    /** Connection timeout in ms */
    timeout?: number;
}
/**
 * Stdio transport configuration
 */
interface MCPStdioConfig extends MCPTransportConfig {
    type: 'stdio';
    /** Command to spawn */
    command: string;
    /** Command arguments */
    args?: string[];
    /** Environment variables */
    env?: Record<string, string>;
    /** Working directory */
    cwd?: string;
}
/**
 * SSE transport configuration
 */
interface MCPSSEConfig extends MCPTransportConfig {
    type: 'sse';
    /** SSE endpoint URL */
    url: string;
    /** HTTP headers */
    headers?: Record<string, string>;
}
type MCPTransportType = MCPStdioConfig | MCPSSEConfig;
/**
 * MCP server configuration for SAGE
 */
interface MCPServerConfig {
    /** Unique name for this server */
    name: string;
    /** Transport configuration */
    transport: MCPTransportType;
    /** Auto-connect on startup */
    autoConnect?: boolean;
    /** Reconnect on disconnect */
    reconnect?: boolean;
    /** Reconnect delay in ms */
    reconnectDelay?: number;
    /** Max reconnect attempts */
    maxReconnectAttempts?: number;
}

/**
 * MCP Client
 *
 * Client for communicating with MCP servers.
 * Handles the MCP protocol over configured transports.
 */

/**
 * MCP Client events
 */
interface MCPClientEvents {
    /** Called when connection is established */
    onConnect?: () => void;
    /** Called when connection is lost */
    onDisconnect?: () => void;
    /** Called when an error occurs */
    onError?: (error: Error) => void;
    /** Called when tools list changes */
    onToolsChanged?: (tools: MCPTool[]) => void;
    /** Called when resources list changes */
    onResourcesChanged?: (resources: MCPResource[]) => void;
    /** Called when prompts list changes */
    onPromptsChanged?: (prompts: MCPPrompt[]) => void;
    /** Called for log messages */
    onLog?: (level: string, data: unknown) => void;
}
/**
 * MCP Client options
 */
interface MCPClientOptions {
    /** Client name */
    name?: string;
    /** Client version */
    version?: string;
    /** Request timeout in ms */
    requestTimeout?: number;
    /** Event handlers */
    events?: MCPClientEvents;
}
/**
 * MCP Client
 *
 * Manages connection to an MCP server and provides
 * methods for tools, resources, and prompts.
 */
declare class MCPClient {
    private transport;
    private config;
    private options;
    private pendingRequests;
    private requestId;
    private initialized;
    private serverCapabilities;
    private reconnectAttempts;
    private isReconnecting;
    private cachedTools;
    private cachedResources;
    private cachedPrompts;
    constructor(config: MCPServerConfig, options?: MCPClientOptions);
    /**
     * Connect to the MCP server
     */
    connect(): Promise<void>;
    /**
     * Disconnect from the MCP server
     */
    disconnect(): Promise<void>;
    /**
     * Check if connected and initialized
     */
    isConnected(): boolean;
    /**
     * Get server capabilities
     */
    getCapabilities(): MCPServerCapabilities | null;
    /**
     * Get server name
     */
    getServerName(): string;
    /**
     * List available tools
     */
    listTools(): Promise<MCPTool[]>;
    /**
     * Get cached tools
     */
    getCachedTools(): MCPTool[];
    /**
     * Call a tool
     */
    callTool(name: string, args?: Record<string, unknown>): Promise<MCPToolCallResult>;
    /**
     * List available resources
     */
    listResources(): Promise<MCPResource[]>;
    /**
     * Get cached resources
     */
    getCachedResources(): MCPResource[];
    /**
     * Read a resource
     */
    readResource(uri: string): Promise<MCPResourceReadResult>;
    /**
     * List available prompts
     */
    listPrompts(): Promise<MCPPrompt[]>;
    /**
     * Get cached prompts
     */
    getCachedPrompts(): MCPPrompt[];
    /**
     * Get a prompt
     */
    getPrompt(name: string, args?: Record<string, string>): Promise<MCPPromptGetResult>;
    /**
     * Create transport based on config
     */
    private createTransport;
    /**
     * Initialize MCP protocol
     */
    private initialize;
    /**
     * Send a request and wait for response
     */
    private request;
    /**
     * Send a notification (no response expected)
     */
    private notify;
    /**
     * Handle incoming message
     */
    private handleMessage;
    /**
     * Handle response to our request
     */
    private handleResponse;
    /**
     * Handle notification from server
     */
    private handleNotification;
    /**
     * Handle transport error
     */
    private handleError;
    /**
     * Handle transport close
     */
    private handleClose;
    /**
     * Attempt to reconnect
     */
    private attemptReconnect;
}
/**
 * Create an MCP client
 */
declare function createMCPClient(config: MCPServerConfig, options?: MCPClientOptions): MCPClient;

/**
 * MCP Manager
 *
 * Manages multiple MCP server connections and provides
 * integration with SAGE's tool registry.
 */

/**
 * MCP Manager options
 */
interface MCPManagerOptions {
    /** Client options passed to all MCP clients */
    clientOptions?: MCPClientOptions;
    /** Auto-connect to all servers on start */
    autoConnect?: boolean;
    /** Called when tools change on any server */
    onToolsChanged?: (serverName: string, tools: MCPTool[]) => void;
}
/**
 * MCP Manager
 *
 * Coordinates multiple MCP server connections and
 * integrates their tools with SAGE.
 */
declare class MCPManager {
    private clients;
    private options;
    constructor(options?: MCPManagerOptions);
    /**
     * Add an MCP server
     */
    addServer(config: MCPServerConfig): void;
    /**
     * Remove an MCP server
     */
    removeServer(name: string): Promise<void>;
    /**
     * Get an MCP client by name
     */
    getClient(name: string): MCPClient | undefined;
    /**
     * Get all client names
     */
    getServerNames(): string[];
    /**
     * Connect to all servers
     */
    connectAll(): Promise<void>;
    /**
     * Disconnect from all servers
     */
    disconnectAll(): Promise<void>;
    /**
     * Get all tools from all connected servers
     */
    getAllTools(): Promise<Array<MCPTool & {
        serverName: string;
    }>>;
    /**
     * Call a tool on a specific server
     */
    callTool(serverName: string, toolName: string, args?: Record<string, unknown>): Promise<MCPToolCallResult>;
    /**
     * Register all MCP tools with a SAGE tool registry
     *
     * Creates wrapper tools that delegate to MCP servers.
     */
    registerToolsWithRegistry(registry: ToolRegistry): Promise<void>;
    /**
     * Create a SAGE tool definition from an MCP tool
     */
    private createToolDefinition;
    /**
     * Format MCP tool result for SAGE
     */
    private formatToolResult;
}
/**
 * Create an MCP manager
 */
declare function createMCPManager(options?: MCPManagerOptions): MCPManager;

/**
 * Base Transport
 *
 * Abstract base class for MCP transports.
 */

/**
 * Abstract base transport with common functionality
 */
declare abstract class BaseTransport implements MCPTransport {
    protected messageHandler: ((message: JSONRPCMessage) => void) | null;
    protected errorHandler: ((error: Error) => void) | null;
    protected closeHandler: (() => void) | null;
    protected connected: boolean;
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract send(message: JSONRPCRequest | JSONRPCNotification): Promise<void>;
    onMessage(handler: (message: JSONRPCMessage) => void): void;
    onError(handler: (error: Error) => void): void;
    onClose(handler: () => void): void;
    isConnected(): boolean;
    protected handleMessage(data: string): void;
    protected handleError(error: Error): void;
    protected handleClose(): void;
}

/**
 * Stdio Transport
 *
 * MCP transport using stdio (spawned process).
 * This is the standard transport for local MCP servers.
 */

/**
 * Stdio transport for MCP
 *
 * Spawns a child process and communicates via stdin/stdout.
 */
declare class StdioTransport extends BaseTransport {
    private process;
    private buffer;
    private config;
    constructor(config: MCPStdioConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: JSONRPCRequest | JSONRPCNotification): Promise<void>;
    /**
     * Handle incoming data from stdout
     *
     * MCP uses newline-delimited JSON for messages.
     */
    private handleData;
}
/**
 * Create a stdio transport
 */
declare function createStdioTransport(config: MCPStdioConfig): StdioTransport;

/**
 * SSE Transport
 *
 * MCP transport using Server-Sent Events (SSE).
 * This is used for remote MCP servers over HTTP.
 */

/**
 * SSE transport for MCP
 *
 * Connects to an SSE endpoint for receiving messages
 * and uses HTTP POST for sending messages.
 */
declare class SSETransport extends BaseTransport {
    private config;
    private eventSource;
    private abortController;
    private messageEndpoint;
    constructor(config: MCPSSEConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    send(message: JSONRPCRequest | JSONRPCNotification): Promise<void>;
    /**
     * Handle SSE message event
     */
    private handleSSEMessage;
}
/**
 * Create an SSE transport
 */
declare function createSSETransport(config: MCPSSEConfig): SSETransport;

export { BaseTransport, type JSONRPCErrorResponse, type JSONRPCMessage, type JSONRPCNotification, type JSONRPCRequest, type JSONRPCResponse, type JSONRPCSuccessResponse, JSONRPC_ERROR_CODES, MCPClient, type MCPClientCapabilities, type MCPClientEvents, type MCPClientInfo, type MCPClientOptions, type MCPContent, type MCPImageContent, type MCPInitializeParams, type MCPInitializeResult, type MCPLogLevel, type MCPLogMessageParams, MCPManager, type MCPManagerOptions, type MCPProgressParams, type MCPPrompt, type MCPPromptArgument, type MCPPromptGetParams, type MCPPromptGetResult, type MCPPromptListResult, type MCPPromptMessage, type MCPPromptRole, type MCPResource, type MCPResourceContent, type MCPResourceListResult, type MCPResourceReadParams, type MCPResourceReadResult, type MCPSSEConfig, type MCPServerCapabilities, type MCPServerConfig, type MCPServerInfo, type MCPStdioConfig, type MCPTextContent, type MCPTool, type MCPToolCallParams, type MCPToolCallResult, type MCPToolInputSchema, type MCPToolListResult, type MCPTransport, type MCPTransportConfig, type MCPTransportType, MCP_METHODS, MCP_VERSION, SSETransport, StdioTransport, createMCPClient, createMCPManager, createSSETransport, createStdioTransport };
