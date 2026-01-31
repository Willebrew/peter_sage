// src/tools/registry.ts
function createToolRegistry() {
  const tools = /* @__PURE__ */ new Map();
  return {
    /**
     * Register a tool directly
     */
    register(tool) {
      if (tools.has(tool.name)) {
        console.warn(`[ToolRegistry] Overwriting existing tool: ${tool.name}`);
      }
      tools.set(tool.name, tool);
    },
    /**
     * Register tools from an MCP server
     */
    async registerMCP(serverUrl, options) {
      try {
        const response = await fetch(`${serverUrl}/tools`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...options?.headers
          },
          signal: options?.timeout ? AbortSignal.timeout(options.timeout) : void 0
        });
        if (!response.ok) {
          throw new Error(`MCP server error: ${response.status}`);
        }
        const data = await response.json();
        const mcpTools = Array.isArray(data) ? data : data.tools || [];
        for (const mcpTool of mcpTools) {
          const tool = {
            name: mcpTool.name,
            description: mcpTool.description,
            parameters: mcpTool.parameters || mcpTool.inputSchema || { type: "object", properties: {} },
            execute: createMCPExecutor(serverUrl, mcpTool.name, options)
          };
          tools.set(tool.name, tool);
        }
        console.log(`[ToolRegistry] Registered ${mcpTools.length} tools from MCP server`);
      } catch (error) {
        console.error(`[ToolRegistry] Failed to register MCP tools:`, error);
        throw error;
      }
    },
    /**
     * List all registered tools
     */
    list() {
      return Array.from(tools.values());
    },
    /**
     * Get a tool by name
     */
    get(name) {
      return tools.get(name);
    },
    /**
     * Execute a tool by name
     */
    async execute(name, args, context) {
      const tool = tools.get(name);
      if (!tool) {
        throw new Error(`Tool not found: ${name}`);
      }
      return tool.execute(args, context);
    },
    /**
     * Get tools in API format (for LLM)
     */
    toAPIFormat() {
      return Array.from(tools.values()).map((tool) => ({
        type: "function",
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters
      }));
    }
  };
}
function createMCPExecutor(serverUrl, toolName, options) {
  return async (args, context) => {
    const payload = {
      tool: toolName,
      parameters: { ...args }
    };
    if (options?.credentials) {
      for (const [key, value] of Object.entries(options.credentials)) {
        payload[key] = value;
      }
    }
    const response = await fetch(`${serverUrl}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers
      },
      body: JSON.stringify(payload),
      signal: options?.timeout ? AbortSignal.timeout(options.timeout) : void 0
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`MCP tool execution failed: ${response.status} - ${errorBody}`);
    }
    const result = await response.json();
    return result.result !== void 0 ? result.result : result;
  };
}

// src/tools/executor.ts
var DEFAULT_TOOL_TIMEOUT = 3e4;
var DEFAULT_MAX_RESULT_SIZE = 5e4;
async function executeWithTimeout(fn, timeoutMs, timeoutMessage) {
  return Promise.race([
    fn(),
    new Promise(
      (_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
    )
  ]);
}
function truncateResult(result, maxSize) {
  if (result.length <= maxSize) {
    return result;
  }
  const truncated = result.slice(0, maxSize);
  const notice = `

[TRUNCATED: Result was ${result.length} characters, showing first ${maxSize}. Consider using more specific queries or pagination.]`;
  return truncated + notice;
}
function validateToolArgs(tool, args) {
  const errors = [];
  const schema = tool.parameters;
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in args) || args[field] === void 0 || args[field] === null) {
        errors.push(`Missing required field: ${field}`);
      }
    }
  }
  if (schema.properties) {
    for (const [key, value] of Object.entries(args)) {
      const propSchema = schema.properties[key];
      if (propSchema) {
        const expectedType = propSchema.type;
        const actualType = Array.isArray(value) ? "array" : typeof value;
        if (expectedType && expectedType !== actualType) {
          errors.push(`Field ${key}: expected ${expectedType}, got ${actualType}`);
        }
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
function generateRecoverySuggestion(error, toolName, args) {
  const errorMsg = error.message.toLowerCase();
  if (errorMsg.includes("timed out") || errorMsg.includes("timeout")) {
    return `The tool "${toolName}" timed out. Consider: (1) breaking the task into smaller pieces, (2) using more specific parameters to reduce processing time, or (3) trying an alternative approach.`;
  }
  if (errorMsg.includes("not found") || errorMsg.includes("404") || errorMsg.includes("does not exist")) {
    return `Resource not found. Try: (1) verifying the identifier/path is correct, (2) listing available resources first, or (3) checking if the resource was created.`;
  }
  if (errorMsg.includes("permission") || errorMsg.includes("unauthorized") || errorMsg.includes("forbidden") || errorMsg.includes("403") || errorMsg.includes("401")) {
    return `Access denied. The current user may not have permission for this operation. Consider: (1) checking if different credentials are needed, or (2) trying a different approach that doesn't require elevated permissions.`;
  }
  if (errorMsg.includes("rate limit") || errorMsg.includes("too many requests") || errorMsg.includes("429")) {
    return `Rate limited. Wait a moment before retrying, or consider batching multiple operations together.`;
  }
  if (errorMsg.includes("invalid") || errorMsg.includes("validation") || errorMsg.includes("schema")) {
    const argKeys = Object.keys(args).join(", ");
    return `Invalid parameters provided (${argKeys}). Check the tool's parameter requirements and try with corrected values.`;
  }
  if (errorMsg.includes("network") || errorMsg.includes("connection") || errorMsg.includes("econnrefused") || errorMsg.includes("fetch")) {
    return `Network error occurred. The service may be temporarily unavailable. Consider retrying or using cached/local data if available.`;
  }
  if (errorMsg.includes("too large") || errorMsg.includes("size") || errorMsg.includes("limit") || errorMsg.includes("exceeded")) {
    return `The request or data was too large. Try: (1) processing in smaller chunks, (2) filtering to reduce data size, or (3) using pagination.`;
  }
  return `Tool "${toolName}" failed: ${error.message}. Consider: (1) trying with different parameters, (2) breaking the task into smaller steps, or (3) using an alternative tool if available.`;
}
async function executeTool(tool, args, context, options) {
  const timeoutMs = options?.timeout ?? tool.timeout ?? DEFAULT_TOOL_TIMEOUT;
  const maxResultSize = options?.maxResultSize ?? tool.maxResultSize ?? DEFAULT_MAX_RESULT_SIZE;
  const result = await executeWithTimeout(
    () => tool.execute(args, context),
    timeoutMs,
    `Tool "${tool.name}" timed out after ${timeoutMs}ms`
  );
  const resultStr = typeof result === "string" ? result : JSON.stringify(result);
  const truncated = resultStr.length > maxResultSize;
  const finalResult = truncated ? truncateResult(resultStr, maxResultSize) : resultStr;
  return {
    result: finalResult,
    truncated
  };
}
function formatToolError(error, toolName, args) {
  const suggestion = generateRecoverySuggestion(error, toolName, args);
  return JSON.stringify({
    error: true,
    message: error.message,
    toolName,
    suggestion
  });
}
function formatValidationError(errors, toolName) {
  return JSON.stringify({
    error: true,
    message: `Validation failed: ${errors.join("; ")}`,
    toolName,
    suggestion: `Fix the parameter errors and retry: ${errors.join("; ")}`
  });
}
export {
  DEFAULT_MAX_RESULT_SIZE,
  DEFAULT_TOOL_TIMEOUT,
  createToolRegistry,
  executeTool,
  executeWithTimeout,
  formatToolError,
  formatValidationError,
  generateRecoverySuggestion,
  truncateResult,
  validateToolArgs
};
//# sourceMappingURL=index.mjs.map