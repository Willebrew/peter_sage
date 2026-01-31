"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/mcp/index.ts
var mcp_exports = {};
__export(mcp_exports, {
  BaseTransport: () => BaseTransport,
  JSONRPC_ERROR_CODES: () => JSONRPC_ERROR_CODES,
  MCPClient: () => MCPClient,
  MCPManager: () => MCPManager,
  MCP_METHODS: () => MCP_METHODS,
  MCP_VERSION: () => MCP_VERSION,
  SSETransport: () => SSETransport,
  StdioTransport: () => StdioTransport,
  createMCPClient: () => createMCPClient,
  createMCPManager: () => createMCPManager,
  createSSETransport: () => createSSETransport,
  createStdioTransport: () => createStdioTransport
});
module.exports = __toCommonJS(mcp_exports);

// src/mcp/types.ts
var JSONRPC_ERROR_CODES = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603
};
var MCP_VERSION = "2024-11-05";
var MCP_METHODS = {
  // Lifecycle
  INITIALIZE: "initialize",
  INITIALIZED: "notifications/initialized",
  SHUTDOWN: "shutdown",
  // Tools
  TOOLS_LIST: "tools/list",
  TOOLS_CALL: "tools/call",
  // Resources
  RESOURCES_LIST: "resources/list",
  RESOURCES_READ: "resources/read",
  RESOURCES_SUBSCRIBE: "resources/subscribe",
  RESOURCES_UNSUBSCRIBE: "resources/unsubscribe",
  // Prompts
  PROMPTS_LIST: "prompts/list",
  PROMPTS_GET: "prompts/get",
  // Notifications
  PROGRESS: "notifications/progress",
  LOG_MESSAGE: "notifications/message",
  TOOLS_LIST_CHANGED: "notifications/tools/list_changed",
  RESOURCES_LIST_CHANGED: "notifications/resources/list_changed",
  PROMPTS_LIST_CHANGED: "notifications/prompts/list_changed"
};

// src/mcp/transports/stdio.ts
var import_child_process = require("child_process");

// src/mcp/transports/base.ts
var BaseTransport = class {
  messageHandler = null;
  errorHandler = null;
  closeHandler = null;
  connected = false;
  onMessage(handler) {
    this.messageHandler = handler;
  }
  onError(handler) {
    this.errorHandler = handler;
  }
  onClose(handler) {
    this.closeHandler = handler;
  }
  isConnected() {
    return this.connected;
  }
  handleMessage(data) {
    if (!this.messageHandler) return;
    try {
      const message = JSON.parse(data);
      this.messageHandler(message);
    } catch (error) {
      this.handleError(new Error(`Failed to parse message: ${error}`));
    }
  }
  handleError(error) {
    if (this.errorHandler) {
      this.errorHandler(error);
    } else {
      console.error("[MCP Transport] Unhandled error:", error);
    }
  }
  handleClose() {
    this.connected = false;
    if (this.closeHandler) {
      this.closeHandler();
    }
  }
};

// src/mcp/transports/stdio.ts
var StdioTransport = class extends BaseTransport {
  process = null;
  buffer = "";
  config;
  constructor(config) {
    super();
    this.config = config;
  }
  async connect() {
    if (this.connected) {
      throw new Error("Already connected");
    }
    return new Promise((resolve, reject) => {
      const timeout = this.config.timeout ?? 3e4;
      const timeoutId = setTimeout(() => {
        reject(new Error(`Connection timeout after ${timeout}ms`));
        this.disconnect();
      }, timeout);
      try {
        this.process = (0, import_child_process.spawn)(this.config.command, this.config.args ?? [], {
          cwd: this.config.cwd,
          env: { ...process.env, ...this.config.env },
          stdio: ["pipe", "pipe", "pipe"]
        });
        this.process.stdout?.on("data", (data) => {
          this.handleData(data.toString());
        });
        this.process.stderr?.on("data", (data) => {
          console.error(`[MCP ${this.config.command}] stderr:`, data.toString());
        });
        this.process.on("error", (error) => {
          clearTimeout(timeoutId);
          this.handleError(error);
          reject(error);
        });
        this.process.on("exit", (code, signal) => {
          this.handleClose();
          if (code !== 0 && code !== null) {
            this.handleError(new Error(`Process exited with code ${code}`));
          }
        });
        this.process.on("spawn", () => {
          clearTimeout(timeoutId);
          this.connected = true;
          resolve();
        });
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }
  async disconnect() {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
    this.connected = false;
    this.buffer = "";
  }
  async send(message) {
    if (!this.process || !this.connected) {
      throw new Error("Not connected");
    }
    const data = JSON.stringify(message) + "\n";
    return new Promise((resolve, reject) => {
      this.process.stdin?.write(data, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * Handle incoming data from stdout
   *
   * MCP uses newline-delimited JSON for messages.
   */
  handleData(data) {
    this.buffer += data;
    let newlineIndex;
    while ((newlineIndex = this.buffer.indexOf("\n")) !== -1) {
      const line = this.buffer.slice(0, newlineIndex).trim();
      this.buffer = this.buffer.slice(newlineIndex + 1);
      if (line) {
        this.handleMessage(line);
      }
    }
  }
};
function createStdioTransport(config) {
  return new StdioTransport(config);
}

// src/mcp/transports/sse.ts
var SSETransport = class extends BaseTransport {
  config;
  eventSource = null;
  abortController = null;
  messageEndpoint = null;
  constructor(config) {
    super();
    this.config = config;
  }
  async connect() {
    if (this.connected) {
      throw new Error("Already connected");
    }
    return new Promise((resolve, reject) => {
      const timeout = this.config.timeout ?? 3e4;
      const timeoutId = setTimeout(() => {
        reject(new Error(`Connection timeout after ${timeout}ms`));
        this.disconnect();
      }, timeout);
      try {
        this.abortController = new AbortController();
        this.eventSource = new EventSource(this.config.url);
        this.eventSource.onopen = () => {
          clearTimeout(timeoutId);
          this.connected = true;
          resolve();
        };
        this.eventSource.onerror = (event) => {
          if (!this.connected) {
            clearTimeout(timeoutId);
            reject(new Error("SSE connection failed"));
          } else {
            this.handleError(new Error("SSE connection error"));
          }
        };
        this.eventSource.onmessage = (event) => {
          this.handleSSEMessage(event);
        };
        this.eventSource.addEventListener("endpoint", (event) => {
          const data = event;
          this.messageEndpoint = data.data;
        });
      } catch (error) {
        clearTimeout(timeoutId);
        reject(error);
      }
    });
  }
  async disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
    this.connected = false;
    this.messageEndpoint = null;
  }
  async send(message) {
    if (!this.connected) {
      throw new Error("Not connected");
    }
    const endpoint = this.messageEndpoint || this.config.url;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.config.headers
      },
      body: JSON.stringify(message),
      signal: this.abortController?.signal
    });
    if (!response.ok) {
      throw new Error(`SSE POST failed: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    if (text && this.messageHandler) {
      try {
        const responseMessage = JSON.parse(text);
        this.messageHandler(responseMessage);
      } catch {
      }
    }
  }
  /**
   * Handle SSE message event
   */
  handleSSEMessage(event) {
    const data = event.data;
    if (typeof data === "string" && data.trim()) {
      this.handleMessage(data);
    }
  }
};
function createSSETransport(config) {
  return new SSETransport(config);
}

// src/mcp/client.ts
var DEFAULT_CLIENT_INFO = {
  name: "sage-mcp-client",
  version: "1.0.0"
};
var MCPClient = class {
  transport = null;
  config;
  options;
  pendingRequests = /* @__PURE__ */ new Map();
  requestId = 0;
  initialized = false;
  serverCapabilities = null;
  reconnectAttempts = 0;
  isReconnecting = false;
  // Cached data
  cachedTools = [];
  cachedResources = [];
  cachedPrompts = [];
  constructor(config, options = {}) {
    this.config = config;
    this.options = {
      name: DEFAULT_CLIENT_INFO.name,
      version: DEFAULT_CLIENT_INFO.version,
      requestTimeout: 3e4,
      ...options
    };
  }
  /**
   * Connect to the MCP server
   */
  async connect() {
    if (this.transport?.isConnected()) {
      return;
    }
    this.transport = this.createTransport(this.config.transport);
    this.transport.onMessage((message) => this.handleMessage(message));
    this.transport.onError((error) => this.handleError(error));
    this.transport.onClose(() => this.handleClose());
    await this.transport.connect();
    await this.initialize();
    this.options.events?.onConnect?.();
  }
  /**
   * Disconnect from the MCP server
   */
  async disconnect() {
    if (!this.transport) return;
    for (const [id, pending] of this.pendingRequests) {
      clearTimeout(pending.timeout);
      pending.reject(new Error("Client disconnecting"));
    }
    this.pendingRequests.clear();
    await this.transport.disconnect();
    this.transport = null;
    this.initialized = false;
    this.serverCapabilities = null;
  }
  /**
   * Check if connected and initialized
   */
  isConnected() {
    return this.transport?.isConnected() === true && this.initialized;
  }
  /**
   * Get server capabilities
   */
  getCapabilities() {
    return this.serverCapabilities;
  }
  /**
   * Get server name
   */
  getServerName() {
    return this.config.name;
  }
  // ============================================
  // Tools
  // ============================================
  /**
   * List available tools
   */
  async listTools() {
    const result = await this.request(MCP_METHODS.TOOLS_LIST, {});
    this.cachedTools = result.tools;
    return result.tools;
  }
  /**
   * Get cached tools
   */
  getCachedTools() {
    return this.cachedTools;
  }
  /**
   * Call a tool
   */
  async callTool(name, args) {
    const params = { name, arguments: args };
    return this.request(MCP_METHODS.TOOLS_CALL, params);
  }
  // ============================================
  // Resources
  // ============================================
  /**
   * List available resources
   */
  async listResources() {
    const result = await this.request(MCP_METHODS.RESOURCES_LIST, {});
    this.cachedResources = result.resources;
    return result.resources;
  }
  /**
   * Get cached resources
   */
  getCachedResources() {
    return this.cachedResources;
  }
  /**
   * Read a resource
   */
  async readResource(uri) {
    const params = { uri };
    return this.request(MCP_METHODS.RESOURCES_READ, params);
  }
  // ============================================
  // Prompts
  // ============================================
  /**
   * List available prompts
   */
  async listPrompts() {
    const result = await this.request(MCP_METHODS.PROMPTS_LIST, {});
    this.cachedPrompts = result.prompts;
    return result.prompts;
  }
  /**
   * Get cached prompts
   */
  getCachedPrompts() {
    return this.cachedPrompts;
  }
  /**
   * Get a prompt
   */
  async getPrompt(name, args) {
    const params = { name, arguments: args };
    return this.request(MCP_METHODS.PROMPTS_GET, params);
  }
  // ============================================
  // Private Methods
  // ============================================
  /**
   * Create transport based on config
   */
  createTransport(config) {
    switch (config.type) {
      case "stdio":
        return createStdioTransport(config);
      case "sse":
        return createSSETransport(config);
      default:
        throw new Error(`Unknown transport type: ${config.type}`);
    }
  }
  /**
   * Initialize MCP protocol
   */
  async initialize() {
    const clientCapabilities = {
      roots: { listChanged: true }
    };
    const params = {
      protocolVersion: MCP_VERSION,
      capabilities: clientCapabilities,
      clientInfo: {
        name: this.options.name,
        version: this.options.version
      }
    };
    const result = await this.request(MCP_METHODS.INITIALIZE, params);
    this.serverCapabilities = result.capabilities;
    this.initialized = true;
    await this.notify(MCP_METHODS.INITIALIZED, {});
    if (this.serverCapabilities.tools) {
      try {
        await this.listTools();
      } catch (error) {
        console.warn("[MCP] Failed to pre-fetch tools:", error);
      }
    }
  }
  /**
   * Send a request and wait for response
   */
  async request(method, params) {
    if (!this.transport?.isConnected()) {
      throw new Error("Not connected");
    }
    const id = ++this.requestId;
    const request = {
      jsonrpc: "2.0",
      id,
      method,
      params
    };
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request timeout: ${method}`));
      }, this.options.requestTimeout);
      this.pendingRequests.set(id, { resolve, reject, timeout });
      this.transport.send(request).catch((error) => {
        this.pendingRequests.delete(id);
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
  /**
   * Send a notification (no response expected)
   */
  async notify(method, params) {
    if (!this.transport?.isConnected()) {
      throw new Error("Not connected");
    }
    await this.transport.send({
      jsonrpc: "2.0",
      method,
      params
    });
  }
  /**
   * Handle incoming message
   */
  handleMessage(message) {
    if ("id" in message && message.id !== void 0) {
      this.handleResponse(message);
    } else if ("method" in message) {
      this.handleNotification(message.method, message.params);
    }
  }
  /**
   * Handle response to our request
   */
  handleResponse(response) {
    const pending = this.pendingRequests.get(response.id);
    if (!pending) {
      console.warn("[MCP] Received response for unknown request:", response.id);
      return;
    }
    this.pendingRequests.delete(response.id);
    clearTimeout(pending.timeout);
    if ("error" in response) {
      const errorResponse = response;
      pending.reject(new Error(`MCP Error ${errorResponse.error.code}: ${errorResponse.error.message}`));
    } else {
      const successResponse = response;
      pending.resolve(successResponse.result);
    }
  }
  /**
   * Handle notification from server
   */
  handleNotification(method, params) {
    switch (method) {
      case MCP_METHODS.TOOLS_LIST_CHANGED:
        this.listTools().then((tools) => this.options.events?.onToolsChanged?.(tools)).catch((error) => console.warn("[MCP] Failed to refresh tools:", error));
        break;
      case MCP_METHODS.RESOURCES_LIST_CHANGED:
        this.listResources().then((resources) => this.options.events?.onResourcesChanged?.(resources)).catch((error) => console.warn("[MCP] Failed to refresh resources:", error));
        break;
      case MCP_METHODS.PROMPTS_LIST_CHANGED:
        this.listPrompts().then((prompts) => this.options.events?.onPromptsChanged?.(prompts)).catch((error) => console.warn("[MCP] Failed to refresh prompts:", error));
        break;
      case MCP_METHODS.LOG_MESSAGE:
        const logParams = params;
        this.options.events?.onLog?.(logParams.level, logParams.data);
        break;
      default:
        console.debug("[MCP] Unknown notification:", method);
    }
  }
  /**
   * Handle transport error
   */
  handleError(error) {
    console.error("[MCP] Transport error:", error);
    this.options.events?.onError?.(error);
  }
  /**
   * Handle transport close
   */
  handleClose() {
    this.initialized = false;
    this.options.events?.onDisconnect?.();
    if (this.config.reconnect && !this.isReconnecting) {
      this.attemptReconnect();
    }
  }
  /**
   * Attempt to reconnect
   */
  async attemptReconnect() {
    const maxAttempts = this.config.maxReconnectAttempts ?? 5;
    if (this.reconnectAttempts >= maxAttempts) {
      console.error("[MCP] Max reconnect attempts reached");
      return;
    }
    this.isReconnecting = true;
    this.reconnectAttempts++;
    const delay = this.config.reconnectDelay ?? 1e3;
    await new Promise((resolve) => setTimeout(resolve, delay * this.reconnectAttempts));
    try {
      await this.connect();
      this.reconnectAttempts = 0;
      console.log("[MCP] Reconnected successfully");
    } catch (error) {
      console.warn(`[MCP] Reconnect attempt ${this.reconnectAttempts} failed:`, error);
      this.attemptReconnect();
    } finally {
      this.isReconnecting = false;
    }
  }
};
function createMCPClient(config, options) {
  return new MCPClient(config, options);
}

// src/mcp/manager.ts
var MCPManager = class {
  clients = /* @__PURE__ */ new Map();
  options;
  constructor(options = {}) {
    this.options = options;
  }
  /**
   * Add an MCP server
   */
  addServer(config) {
    if (this.clients.has(config.name)) {
      throw new Error(`Server '${config.name}' already exists`);
    }
    const client = createMCPClient(config, {
      ...this.options.clientOptions,
      events: {
        ...this.options.clientOptions?.events,
        onToolsChanged: (tools) => {
          this.options.onToolsChanged?.(config.name, tools);
        }
      }
    });
    this.clients.set(config.name, client);
  }
  /**
   * Remove an MCP server
   */
  async removeServer(name) {
    const client = this.clients.get(name);
    if (client) {
      await client.disconnect();
      this.clients.delete(name);
    }
  }
  /**
   * Get an MCP client by name
   */
  getClient(name) {
    return this.clients.get(name);
  }
  /**
   * Get all client names
   */
  getServerNames() {
    return Array.from(this.clients.keys());
  }
  /**
   * Connect to all servers
   */
  async connectAll() {
    const promises = Array.from(this.clients.values()).map(async (client) => {
      try {
        await client.connect();
      } catch (error) {
        console.error(`[MCP] Failed to connect to ${client.getServerName()}:`, error);
      }
    });
    await Promise.all(promises);
  }
  /**
   * Disconnect from all servers
   */
  async disconnectAll() {
    const promises = Array.from(this.clients.values()).map((client) => client.disconnect());
    await Promise.all(promises);
  }
  /**
   * Get all tools from all connected servers
   */
  async getAllTools() {
    const allTools = [];
    for (const [name, client] of this.clients) {
      if (!client.isConnected()) continue;
      try {
        const tools = await client.listTools();
        for (const tool of tools) {
          allTools.push({ ...tool, serverName: name });
        }
      } catch (error) {
        console.warn(`[MCP] Failed to list tools from ${name}:`, error);
      }
    }
    return allTools;
  }
  /**
   * Call a tool on a specific server
   */
  async callTool(serverName, toolName, args) {
    const client = this.clients.get(serverName);
    if (!client) {
      throw new Error(`Server '${serverName}' not found`);
    }
    if (!client.isConnected()) {
      throw new Error(`Server '${serverName}' is not connected`);
    }
    return client.callTool(toolName, args);
  }
  /**
   * Register all MCP tools with a SAGE tool registry
   *
   * Creates wrapper tools that delegate to MCP servers.
   */
  async registerToolsWithRegistry(registry) {
    const allTools = await this.getAllTools();
    for (const tool of allTools) {
      const toolDef = this.createToolDefinition(tool.serverName, tool);
      registry.register(toolDef);
    }
  }
  /**
   * Create a SAGE tool definition from an MCP tool
   */
  createToolDefinition(serverName, mcpTool) {
    const toolName = `${serverName}__${mcpTool.name}`;
    return {
      name: toolName,
      description: mcpTool.description || `Tool from MCP server: ${serverName}`,
      // MCP schema is compatible with our JSONSchema, cast for type safety
      parameters: mcpTool.inputSchema,
      execute: async (args, context) => {
        const result = await this.callTool(serverName, mcpTool.name, args);
        return this.formatToolResult(result);
      }
    };
  }
  /**
   * Format MCP tool result for SAGE
   */
  formatToolResult(result) {
    if (result.isError) {
      const errorContent = result.content.find((c) => c.type === "text");
      throw new Error(errorContent?.type === "text" ? errorContent.text : "Tool execution failed");
    }
    const textParts = [];
    for (const content of result.content) {
      if (content.type === "text") {
        textParts.push(content.text);
      } else if (content.type === "image") {
        textParts.push(`[Image: ${content.mimeType}]`);
      } else if (content.type === "resource") {
        if (content.resource.text) {
          textParts.push(content.resource.text);
        } else {
          textParts.push(`[Resource: ${content.resource.uri}]`);
        }
      }
    }
    return textParts.join("\n");
  }
};
function createMCPManager(options) {
  return new MCPManager(options);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseTransport,
  JSONRPC_ERROR_CODES,
  MCPClient,
  MCPManager,
  MCP_METHODS,
  MCP_VERSION,
  SSETransport,
  StdioTransport,
  createMCPClient,
  createMCPManager,
  createSSETransport,
  createStdioTransport
});
//# sourceMappingURL=index.js.map