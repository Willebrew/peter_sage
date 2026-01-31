"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AUTH_ENV_VARS: () => AUTH_ENV_VARS,
  AuthorizationError: () => AuthorizationError,
  BaseTransport: () => BaseTransport,
  CharacterTokenizer: () => CharacterTokenizer,
  ConvexConversationRepository: () => ConvexConversationRepository,
  ConvexMessageRepository: () => ConvexMessageRepository,
  ConvexSessionRepository: () => ConvexSessionRepository,
  DEFAULT_CONFIG: () => DEFAULT_CONFIG,
  DEFAULT_MAX_RESULT_SIZE: () => DEFAULT_MAX_RESULT_SIZE,
  DEFAULT_RETRY_CONFIG: () => DEFAULT_RETRY_CONFIG,
  DEFAULT_TOOL_TIMEOUT: () => DEFAULT_TOOL_TIMEOUT,
  InMemoryAPIKeyStore: () => InMemoryAPIKeyStore,
  InMemoryRateLimitStore: () => InMemoryRateLimitStore,
  InMemoryStore: () => InMemoryStore,
  InMemoryVectorStore: () => InMemoryVectorStore,
  JSONRPC_ERROR_CODES: () => JSONRPC_ERROR_CODES,
  LLM_RETRY_CONFIG: () => LLM_RETRY_CONFIG,
  MCPClient: () => MCPClient,
  MCPManager: () => MCPManager,
  MCP_METHODS: () => MCP_METHODS,
  MCP_VERSION: () => MCP_VERSION,
  MemoryConversationRepository: () => MemoryConversationRepository,
  MemoryMessageRepository: () => MemoryMessageRepository,
  MemorySessionRepository: () => MemorySessionRepository,
  MemoryStreamStore: () => MemoryStreamStore,
  Permissions: () => Permissions,
  QdrantVectorStore: () => QdrantVectorStore,
  RateLimitPresets: () => RateLimitPresets,
  RedisStreamStore: () => RedisStreamStore,
  SSETransport: () => SSETransport,
  SageConfigSchema: () => SageConfigSchema,
  StdioTransport: () => StdioTransport,
  SubagentSchema: () => SubagentSchema,
  TOOL_RETRY_CONFIG: () => TOOL_RETRY_CONFIG,
  adjustSplitForToolIntegrity: () => adjustSplitForToolIntegrity,
  applyWindow: () => applyWindow,
  buildKnowledgeGraph: () => buildKnowledgeGraph,
  buildSystemPrompt: () => buildSystemPrompt,
  calculateBackoffDelay: () => calculateBackoffDelay,
  calculateDecayScore: () => calculateDecayScore,
  calculateMemoryStats: () => calculateMemoryStats,
  checkExpirations: () => checkExpirations,
  classifyEntity: () => classifyEntity,
  compressMemories: () => compressMemories,
  consolidateMemories: () => consolidateMemories,
  createAPIKeyAuth: () => createAPIKeyAuth,
  createAPIKeyMiddleware: () => createAPIKeyMiddleware,
  createAuthClientConfig: () => createAuthClientConfig,
  createAuthConfig: () => createAuthConfig,
  createBetterAuthMiddleware: () => createBetterAuthMiddleware,
  createChatHandler: () => createChatHandler,
  createCommonRoles: () => createCommonRoles,
  createConvexRepositories: () => createConvexRepositories,
  createFallbackSummary: () => createFallbackSummary,
  createJWKSVerifier: () => createJWKSVerifier,
  createJWTMiddleware: () => createJWTMiddleware,
  createJWTSigner: () => createJWTSigner,
  createJWTVerifier: () => createJWTVerifier,
  createMCPClient: () => createMCPClient,
  createMCPManager: () => createMCPManager,
  createMemoryAPIHandler: () => createMemoryAPIHandler,
  createMemoryRepositories: () => createMemoryRepositories,
  createMemoryStreamStore: () => createMemoryStreamStore,
  createMemoryTools: () => createMemoryTools,
  createNoopAuthMiddleware: () => createNoopAuthMiddleware,
  createRBAC: () => createRBAC,
  createRateLimitMiddleware: () => createRateLimitMiddleware,
  createRateLimiter: () => createRateLimiter,
  createRedisStreamStore: () => createRedisStreamStore,
  createResponsesAPIProvider: () => createResponsesAPIProvider,
  createRetryWrapper: () => createRetryWrapper,
  createSSETransport: () => createSSETransport,
  createSession: () => createSession,
  createStdioTransport: () => createStdioTransport,
  createStreamHandler: () => createStreamHandler,
  createSubagentTool: () => createSubagentTool,
  createToolRegistry: () => createToolRegistry,
  createWorkingMemory: () => createWorkingMemory,
  decodeJWT: () => decodeJWT,
  defineConfig: () => defineConfig,
  defineRole: () => defineRole,
  detectProvider: () => detectProvider,
  detectTemporalQuery: () => detectTemporalQuery,
  estimateMessageTokens: () => estimateMessageTokens,
  estimateTokens: () => estimateTokens,
  estimateTotalTokens: () => estimateTotalTokens,
  executeTool: () => executeTool,
  executeWithTimeout: () => executeWithTimeout,
  extractBearerToken: () => extractBearerToken,
  extractEntities: () => extractEntities,
  extractSessionCookie: () => extractSessionCookie,
  findSharedEntities: () => findSharedEntities,
  formatToolError: () => formatToolError,
  formatValidationError: () => formatValidationError,
  generateAPIKey: () => generateAPIKey,
  generateRecoverySuggestion: () => generateRecoverySuggestion,
  generateStreamId: () => generateStreamId,
  getContextWindow: () => getContextWindow,
  getContextWindows: () => getContextWindows,
  getCurrentUser: () => getCurrentUser,
  getDefaultBaseUrl: () => getDefaultBaseUrl,
  getTokenizer: () => getTokenizer,
  getUserFromToken: () => getUserFromToken,
  handleStreamEvent: () => handleStreamEvent,
  hashAPIKey: () => hashAPIKey,
  initializeSage: () => initializeSage,
  isRetryableError: () => isRetryableError,
  loadProviderConfig: () => loadProviderConfig,
  manageContext: () => manageContext,
  processWithToolLoop: () => processWithToolLoop,
  pruneMemories: () => pruneMemories,
  queryGraph: () => queryGraph,
  registerContextWindow: () => registerContextWindow,
  registerSubagentTools: () => registerSubagentTools,
  requireAuth: () => requireAuth,
  requireUser: () => requireUser,
  responsesAPIProvider: () => responsesAPIProvider,
  retrieveMemories: () => retrieveMemories,
  setContextWindows: () => setContextWindows,
  signJWT: () => signJWT,
  sleep: () => sleep,
  summarizeMessages: () => summarizeMessages,
  truncateResult: () => truncateResult,
  validateAPIKey: () => validateAPIKey,
  validateAuthEnv: () => validateAuthEnv,
  validateConfig: () => validateConfig,
  validateProviderConfig: () => validateProviderConfig,
  validateToolArgs: () => validateToolArgs,
  validateToolCallIntegrity: () => validateToolCallIntegrity,
  verifyJWT: () => verifyJWT,
  willNeedTruncation: () => willNeedTruncation,
  withAuth: () => withAuth,
  withRetry: () => withRetry
});
module.exports = __toCommonJS(src_exports);

// src/types.ts
var import_zod = require("zod");
var SubagentSchema = import_zod.z.object({
  name: import_zod.z.string(),
  description: import_zod.z.string(),
  systemPrompt: import_zod.z.string(),
  toolNames: import_zod.z.array(import_zod.z.string()).optional(),
  mcpServers: import_zod.z.array(import_zod.z.string()).optional(),
  model: import_zod.z.string().optional(),
  temperature: import_zod.z.number().optional(),
  maxTokens: import_zod.z.number().optional(),
  maxDepth: import_zod.z.number().optional()
});
var SageConfigSchema = import_zod.z.object({
  // Agent configuration
  agent: import_zod.z.object({
    name: import_zod.z.string().optional(),
    systemPrompt: import_zod.z.string().optional(),
    maxDepth: import_zod.z.number().optional(),
    toolTimeout: import_zod.z.number().optional(),
    maxToolResultSize: import_zod.z.number().optional()
  }).optional(),
  // Provider configuration
  provider: import_zod.z.object({
    apiKey: import_zod.z.string().optional(),
    baseUrl: import_zod.z.string().optional()
  }).optional(),
  // Model configuration
  model: import_zod.z.string().optional(),
  temperature: import_zod.z.number().optional(),
  maxTokens: import_zod.z.number().optional(),
  parallelToolCalls: import_zod.z.boolean().optional(),
  // Enable parallel tool calling (default: true)
  // Streaming configuration
  streaming: import_zod.z.discriminatedUnion("type", [
    import_zod.z.object({
      type: import_zod.z.literal("redis"),
      url: import_zod.z.string(),
      keyPrefix: import_zod.z.string().optional(),
      ttl: import_zod.z.number().optional()
    }),
    import_zod.z.object({
      type: import_zod.z.literal("memory")
    })
  ]).optional(),
  // Database configuration
  database: import_zod.z.discriminatedUnion("type", [
    import_zod.z.object({
      type: import_zod.z.literal("convex"),
      url: import_zod.z.string()
    }),
    import_zod.z.object({
      type: import_zod.z.literal("memory")
    })
  ]).optional(),
  // Auth configuration
  auth: import_zod.z.object({
    databaseUrl: import_zod.z.string()
  }).optional(),
  // Tools
  tools: import_zod.z.array(import_zod.z.any()).optional(),
  // Subagent configuration
  subagents: import_zod.z.array(SubagentSchema).optional(),
  maxAgentDepth: import_zod.z.number().optional(),
  // Context/memory configuration
  context: import_zod.z.object({
    enabled: import_zod.z.boolean().optional(),
    model: import_zod.z.string().optional(),
    contextWindow: import_zod.z.number().optional(),
    maxResponseTokens: import_zod.z.number().optional(),
    summary: import_zod.z.object({
      enabled: import_zod.z.boolean().optional(),
      model: import_zod.z.string().optional(),
      targetTokens: import_zod.z.number().optional()
    }).optional(),
    workingMemory: import_zod.z.object({
      enabled: import_zod.z.boolean().optional(),
      autoExtract: import_zod.z.boolean().optional(),
      extractionModel: import_zod.z.string().optional(),
      maxMemoriesInPrompt: import_zod.z.number().optional()
    }).optional(),
    decay: import_zod.z.object({
      enabled: import_zod.z.boolean().optional(),
      halfLifeDays: import_zod.z.number().optional(),
      minConfidence: import_zod.z.number().optional()
    }).optional()
  }).optional(),
  // Lifecycle hooks (not validated by Zod - just type-checked)
  hooks: import_zod.z.any().optional(),
  // Retry configuration (not validated by Zod - just type-checked)
  retry: import_zod.z.any().optional()
});
var DEFAULT_CONFIG = {
  agent: {
    maxDepth: 10,
    toolTimeout: 3e4,
    maxToolResultSize: 5e4
  },
  model: "gpt-4o",
  temperature: 0.7,
  maxTokens: 4096,
  streaming: {
    keyPrefix: "sage:stream:",
    ttl: 3600
  }
};
function defineConfig(config) {
  return config;
}
function validateConfig(config) {
  return SageConfigSchema.parse(config);
}

// src/agent/session.ts
var import_crypto = require("crypto");

// src/agent/stream-handler.ts
async function handleStreamEvent(event, context) {
  const { streamStore, streamId, accumulator, callbacks, agentId, agentDepth } = context;
  switch (event.type) {
    case "response.output_item.added": {
      if (event.item?.type === "function_call") {
        const item = event.item;
        const itemId = item.id || event.item_id || item.call_id;
        if (item.name) {
          const id = itemId || `output-${event.output_index}`;
          const existing = accumulator.toolCalls.find((tc) => tc.id === id);
          if (!existing) {
            const toolCall = {
              id,
              type: "function",
              function: { name: item.name, arguments: "" }
            };
            toolCall._outputIndex = event.output_index;
            toolCall._callId = item.call_id;
            accumulator.toolCalls.push(toolCall);
          }
        }
      }
      break;
    }
    case "response.output_text.delta": {
      const delta = event.delta || "";
      if (delta) {
        accumulator.content += delta;
        callbacks?.onToken?.(delta);
        await streamStore.append(streamId, {
          type: "token",
          content: delta,
          timestamp: Date.now(),
          agentId,
          agentDepth
        });
      }
      break;
    }
    case "response.reasoning.delta":
    case "response.reasoning_summary_text.delta": {
      const delta = event.delta || "";
      if (delta) {
        accumulator.reasoning += delta;
        callbacks?.onReasoning?.(delta);
        await streamStore.append(streamId, {
          type: "reasoning",
          content: delta,
          timestamp: Date.now(),
          agentId,
          agentDepth
        });
      }
      break;
    }
    case "response.function_call_arguments.delta": {
      const callId = event.call_id || event.item_id;
      const delta = event.delta || "";
      let existing = accumulator.toolCalls.find((tc) => tc.id === callId);
      if (!existing && event.output_index !== void 0) {
        existing = accumulator.toolCalls.find(
          (tc) => tc._outputIndex === event.output_index
        );
        if (existing && callId) {
          existing.id = callId;
        }
      }
      if (!existing) {
        existing = {
          id: callId || `output-${event.output_index}`,
          type: "function",
          function: { name: event.name || "", arguments: "" }
        };
        existing._outputIndex = event.output_index;
        accumulator.toolCalls.push(existing);
      }
      if (event.name && !existing.function.name) {
        existing.function.name = event.name;
      }
      existing.function.arguments += delta;
      break;
    }
    case "response.function_call_arguments.done": {
      const callId = event.call_id || event.item_id;
      let existing = accumulator.toolCalls.find((tc) => tc.id === callId);
      if (!existing && event.output_index !== void 0) {
        existing = accumulator.toolCalls.find(
          (tc) => tc._outputIndex === event.output_index
        );
      }
      if (!existing && (event.name || event.arguments)) {
        existing = {
          id: callId || `output-${event.output_index}`,
          type: "function",
          function: { name: event.name || "", arguments: "" }
        };
        existing._outputIndex = event.output_index;
        accumulator.toolCalls.push(existing);
      }
      if (existing) {
        if (event.name && !existing.function.name) {
          existing.function.name = event.name;
        }
        if (event.arguments) {
          if (!existing.function.arguments || existing.function.arguments === "{}") {
            existing.function.arguments = event.arguments;
          }
        }
      }
      break;
    }
    case "response.completed": {
      if (event.response?.usage) {
        accumulator.inputTokens = event.response.usage.input_tokens || 0;
        accumulator.outputTokens = event.response.usage.output_tokens || 0;
      }
      break;
    }
    default:
      break;
  }
}

// src/utils/retry.ts
var DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1e3,
  maxDelay: 3e4,
  backoffMultiplier: 2,
  jitter: 0.1
};
var RETRYABLE_STATUS_CODES = [
  408,
  // Request Timeout
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
];
function isRetryableError(error) {
  const message = error.message.toLowerCase();
  if (message.includes("network") || message.includes("timeout") || message.includes("econnreset") || message.includes("econnrefused") || message.includes("socket hang up")) {
    return true;
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return true;
  }
  for (const code of RETRYABLE_STATUS_CODES) {
    if (message.includes(`${code}`)) {
      return true;
    }
  }
  if (message.includes("overloaded") || message.includes("capacity") || message.includes("temporarily unavailable")) {
    return true;
  }
  return false;
}
function calculateBackoffDelay(attempt, config) {
  const { initialDelay, maxDelay, backoffMultiplier, jitter } = config;
  const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  const jitterRange = cappedDelay * jitter;
  const jitterValue = Math.random() * jitterRange * 2 - jitterRange;
  return Math.max(0, Math.round(cappedDelay + jitterValue));
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withRetry(fn, config = {}) {
  const {
    maxAttempts = DEFAULT_RETRY_CONFIG.maxAttempts,
    initialDelay = DEFAULT_RETRY_CONFIG.initialDelay,
    maxDelay = DEFAULT_RETRY_CONFIG.maxDelay,
    backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
    jitter = DEFAULT_RETRY_CONFIG.jitter,
    isRetryable = isRetryableError,
    onRetry
  } = config;
  const fullConfig = { maxAttempts, initialDelay, maxDelay, backoffMultiplier, jitter };
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const shouldRetry = attempt < maxAttempts && isRetryable(lastError);
      if (!shouldRetry) {
        throw lastError;
      }
      const delay = calculateBackoffDelay(attempt, fullConfig);
      onRetry?.(attempt, lastError, delay);
      await sleep(delay);
    }
  }
  throw lastError || new Error("Retry failed");
}
function createRetryWrapper(defaultConfig) {
  return (fn, overrides) => {
    return withRetry(fn, { ...defaultConfig, ...overrides });
  };
}
var LLM_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1e3,
  maxDelay: 6e4,
  backoffMultiplier: 2,
  jitter: 0.2,
  isRetryable: isRetryableError
};
var TOOL_RETRY_CONFIG = {
  maxAttempts: 2,
  initialDelay: 500,
  maxDelay: 5e3,
  backoffMultiplier: 2,
  jitter: 0.1,
  isRetryable: (error) => {
    const message = error.message.toLowerCase();
    return message.includes("network") || message.includes("timeout") || message.includes("econnreset");
  }
};

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
  const errors2 = [];
  const schema = tool.parameters;
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in args) || args[field] === void 0 || args[field] === null) {
        errors2.push(`Missing required field: ${field}`);
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
          errors2.push(`Field ${key}: expected ${expectedType}, got ${actualType}`);
        }
      }
    }
  }
  return {
    valid: errors2.length === 0,
    errors: errors2
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
function formatValidationError(errors2, toolName) {
  return JSON.stringify({
    error: true,
    message: `Validation failed: ${errors2.join("; ")}`,
    toolName,
    suggestion: `Fix the parameter errors and retry: ${errors2.join("; ")}`
  });
}

// src/context/token-counter.ts
var CharacterTokenizer = class {
  count(text) {
    if (!text) return 0;
    return Math.ceil(text.length / 4 * 1.1);
  }
};
var defaultTokenizer = new CharacterTokenizer();
function getTokenizer(custom) {
  return custom || defaultTokenizer;
}
function estimateTokens(text, tokenizer) {
  return getTokenizer(tokenizer).count(text);
}
function estimateMessageTokens(message, tokenizer) {
  const tok = getTokenizer(tokenizer);
  const overhead = 4;
  let contentTokens = 0;
  if (typeof message.content === "string") {
    contentTokens = tok.count(message.content);
  } else if (Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part.type === "text" && part.text) {
        contentTokens += tok.count(part.text);
      } else if (part.type === "image") {
        contentTokens += 170;
      } else if (part.type === "file") {
        contentTokens += 50;
      }
    }
  }
  let toolCallTokens = 0;
  if (message.toolCalls && message.toolCalls.length > 0) {
    for (const tc of message.toolCalls) {
      toolCallTokens += 10;
      if (tc.function?.name) {
        toolCallTokens += tok.count(tc.function.name);
      }
      if (tc.function?.arguments) {
        toolCallTokens += tok.count(tc.function.arguments);
      }
    }
  }
  let toolResultOverhead = 0;
  if (message.toolCallId) {
    toolResultOverhead = 5;
  }
  let reasoningTokens = 0;
  if (message.reasoning) {
    reasoningTokens = tok.count(message.reasoning);
  }
  return overhead + contentTokens + toolCallTokens + toolResultOverhead + reasoningTokens;
}
function estimateTotalTokens(messages, tokenizer) {
  let total = 0;
  for (const msg of messages) {
    total += estimateMessageTokens(msg, tokenizer);
  }
  return total;
}
function willNeedTruncation(options) {
  const {
    messages,
    systemPromptTokens,
    contextWindow,
    maxResponseTokens,
    summaryTokens = 0,
    memoryTokens = 0,
    tokenizer
  } = options;
  const available = contextWindow - systemPromptTokens - summaryTokens - memoryTokens - maxResponseTokens;
  const totalMessageTokens = estimateTotalTokens(messages, tokenizer);
  return totalMessageTokens > available;
}

// src/context/context-window.ts
var MODEL_CONTEXT_WINDOWS = /* @__PURE__ */ new Map([
  // OpenAI
  ["gpt-4o", 128e3],
  ["gpt-4o-mini", 128e3],
  ["gpt-4-turbo", 128e3],
  ["gpt-4", 8192],
  ["gpt-3.5-turbo", 16385],
  ["gpt-5", 1e6],
  ["gpt-5-mini", 1e6],
  ["o1", 2e5],
  ["o1-mini", 128e3],
  ["o1-pro", 2e5],
  ["o3", 2e5],
  ["o3-mini", 2e5],
  ["o4-mini", 2e5],
  // Anthropic
  ["claude-3-opus", 2e5],
  ["claude-3-sonnet", 2e5],
  ["claude-3-haiku", 2e5],
  ["claude-3.5-sonnet", 2e5],
  ["claude-3.5-haiku", 2e5],
  ["claude-4-sonnet", 2e5],
  ["claude-4-opus", 2e5],
  // Google
  ["gemini-1.5-pro", 2e6],
  ["gemini-1.5-flash", 1e6],
  ["gemini-2.0-flash", 1e6],
  ["gemini-3-pro", 1e6],
  // xAI
  ["grok-2", 131072],
  ["grok-3", 131072],
  ["grok-4", 131072],
  // Meta
  ["llama-3.1-8b", 128e3],
  ["llama-3.1-70b", 128e3],
  ["llama-3.1-405b", 128e3],
  ["llama-3.2", 128e3],
  ["llama-3.3", 128e3],
  ["llama-4", 128e3],
  // Mistral
  ["mistral-large", 128e3],
  ["mistral-small", 128e3],
  ["mixtral-8x7b", 32768],
  // NVIDIA
  ["nemotron", 128e3],
  // DeepSeek
  ["deepseek-r1", 128e3],
  ["deepseek-v3", 128e3],
  // Qwen
  ["qwen-2.5", 128e3],
  ["qwen-3", 128e3]
]);
var DEFAULT_CONTEXT_WINDOW = 128e3;
function registerContextWindow(model, tokens) {
  MODEL_CONTEXT_WINDOWS.set(model.toLowerCase(), tokens);
}
function setContextWindows(windows) {
  for (const [model, tokens] of Object.entries(windows)) {
    MODEL_CONTEXT_WINDOWS.set(model.toLowerCase(), tokens);
  }
}
function getContextWindows() {
  const result = {};
  for (const [model, tokens] of MODEL_CONTEXT_WINDOWS) {
    result[model] = tokens;
  }
  return result;
}
function getContextWindow(model, options) {
  if (options?.override) {
    return options.override;
  }
  const normalized = model.toLowerCase();
  const defaultSize = options?.defaultSize ?? DEFAULT_CONTEXT_WINDOW;
  if (MODEL_CONTEXT_WINDOWS.has(normalized)) {
    return MODEL_CONTEXT_WINDOWS.get(normalized);
  }
  const parts = normalized.split("-");
  for (let len = parts.length - 1; len >= 1; len--) {
    const prefix = parts.slice(0, len).join("-");
    if (MODEL_CONTEXT_WINDOWS.has(prefix)) {
      return MODEL_CONTEXT_WINDOWS.get(prefix);
    }
  }
  for (const [registeredModel, tokens] of MODEL_CONTEXT_WINDOWS) {
    if (normalized.includes(registeredModel)) {
      return tokens;
    }
  }
  return defaultSize;
}

// src/context/tool-integrity.ts
function validateToolCallIntegrity(messages) {
  const details = [];
  let adjustments = 0;
  let result = [...messages];
  for (let pass = 0; pass < 10; pass++) {
    const { adjusted, changes } = fixIntegrityPass(result);
    if (changes === 0) break;
    result = adjusted;
    adjustments += changes;
    details.push(`Pass ${pass + 1}: ${changes} adjustment(s)`);
  }
  return {
    valid: adjustments === 0,
    messages: result,
    adjustments,
    details
  };
}
function fixIntegrityPass(messages) {
  let changes = 0;
  const toRemove = /* @__PURE__ */ new Set();
  const toolCallOwners = /* @__PURE__ */ new Map();
  const toolResultIndex = /* @__PURE__ */ new Map();
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role === "assistant" && msg.toolCalls) {
      for (const tc of msg.toolCalls) {
        if (tc.id) {
          toolCallOwners.set(tc.id, i);
        }
      }
    }
    if (msg.role === "tool" && msg.toolCallId) {
      toolResultIndex.set(msg.toolCallId, i);
    }
  }
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== "assistant" || !msg.toolCalls || msg.toolCalls.length === 0) continue;
    const allResultsPresent = msg.toolCalls.every(
      (tc) => tc.id && toolResultIndex.has(tc.id)
    );
    if (!allResultsPresent) {
      toRemove.add(i);
      changes++;
      for (const tc of msg.toolCalls) {
        if (tc.id && toolResultIndex.has(tc.id)) {
          toRemove.add(toolResultIndex.get(tc.id));
        }
      }
    }
  }
  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    if (msg.role !== "tool" || !msg.toolCallId) continue;
    if (!toolCallOwners.has(msg.toolCallId)) {
      toRemove.add(i);
      changes++;
    }
  }
  if (changes === 0) {
    return { adjusted: messages, changes: 0 };
  }
  const adjusted = messages.filter((_, i) => !toRemove.has(i));
  return { adjusted, changes };
}
function adjustSplitForToolIntegrity(messages, splitIndex) {
  if (splitIndex <= 0 || splitIndex >= messages.length) return splitIndex;
  let adjusted = splitIndex;
  for (let pass = 0; pass < 5; pass++) {
    let changed = false;
    for (let i = adjusted; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.role !== "tool" || !msg.toolCallId) break;
      let parentIndex = -1;
      for (let j = i - 1; j >= 0; j--) {
        if (messages[j].role === "assistant" && messages[j].toolCalls) {
          const hasCall = messages[j].toolCalls.some((tc) => tc.id === msg.toolCallId);
          if (hasCall) {
            parentIndex = j;
            break;
          }
        }
      }
      if (parentIndex >= 0 && parentIndex < adjusted) {
        adjusted = parentIndex;
        changed = true;
        break;
      }
    }
    if (adjusted > 0) {
      const lastOld = messages[adjusted - 1];
      if (lastOld.role === "assistant" && lastOld.toolCalls) {
        const hasResultsInRecent = lastOld.toolCalls.some((tc) => {
          for (let j = adjusted; j < messages.length; j++) {
            if (messages[j].role === "tool" && messages[j].toolCallId === tc.id) {
              return true;
            }
          }
          return false;
        });
        if (hasResultsInRecent) {
          adjusted = adjusted - 1;
          changed = true;
        }
      }
    }
    if (!changed) break;
  }
  return Math.max(0, adjusted);
}

// src/context/sliding-window.ts
function applyWindow(options) {
  const {
    messages,
    systemPrompt,
    contextWindow,
    maxResponseTokens,
    summaryTokens = 0,
    memoryTokens = 0,
    tokenizer
  } = options;
  const tok = getTokenizer(tokenizer);
  const systemPromptTokens = estimateTokens(systemPrompt, tok);
  const availableForHistory = Math.max(
    0,
    contextWindow - systemPromptTokens - summaryTokens - memoryTokens - maxResponseTokens
  );
  const budget = {
    contextWindow,
    systemPrompt: systemPromptTokens,
    workingMemory: memoryTokens,
    existingSummary: summaryTokens,
    maxResponse: maxResponseTokens,
    availableForHistory
  };
  let totalTokens = 0;
  const messageTokens = [];
  for (const msg of messages) {
    const tokens = estimateMessageTokens(msg, tok);
    messageTokens.push(tokens);
    totalTokens += tokens;
  }
  if (totalTokens <= availableForHistory) {
    return {
      recentMessages: [...messages],
      oldMessages: [],
      wasTruncated: false,
      budget,
      recentTokens: totalTokens
    };
  }
  let recentTokens = 0;
  let splitIndex = messages.length;
  for (let i = messages.length - 1; i >= 0; i--) {
    const msgTokens = messageTokens[i];
    if (recentTokens + msgTokens > availableForHistory) {
      splitIndex = i + 1;
      break;
    }
    recentTokens += msgTokens;
    if (i === 0) {
      splitIndex = 0;
    }
  }
  splitIndex = adjustSplitForToolIntegrity(messages, splitIndex);
  const oldMessages = messages.slice(0, splitIndex);
  let recentMessages = messages.slice(splitIndex);
  const integrityResult = validateToolCallIntegrity(recentMessages);
  if (!integrityResult.valid) {
    recentMessages = integrityResult.messages;
  }
  recentTokens = 0;
  for (const msg of recentMessages) {
    recentTokens += estimateMessageTokens(msg, tok);
  }
  return {
    recentMessages,
    oldMessages,
    wasTruncated: true,
    budget,
    recentTokens
  };
}

// src/context/summarizer.ts
var DEFAULT_TARGET_TOKENS = 500;
var DEFAULT_TEMPERATURE = 0.3;
async function summarizeMessages(messages, existingSummary, config) {
  if (!config?.provider) {
    return createFallbackSummary(messages, existingSummary, config?.tokenizer);
  }
  const targetTokens = config.targetTokens ?? DEFAULT_TARGET_TOKENS;
  const temperature = config.temperature ?? DEFAULT_TEMPERATURE;
  const model = config.model || "gpt-4o";
  const messagesText = formatMessagesForSummary(messages);
  let prompt;
  if (existingSummary) {
    prompt = `You are summarizing a conversation that has been ongoing. Here is the existing summary of earlier parts:

---
${existingSummary.text}
---

And here are the new messages to incorporate into the summary:

---
${messagesText}
---

Create an updated, comprehensive summary that combines the existing summary with the new messages. Preserve:
- Key decisions and conclusions
- Important facts and context established
- Any commitments, tasks, or action items
- Technical details that may be referenced later
- User preferences and patterns observed

Keep the summary under ${targetTokens} tokens. Write in third person past tense.`;
  } else {
    prompt = `Summarize the following conversation history concisely. Preserve:
- Key decisions and conclusions
- Important facts and context established
- Any commitments, tasks, or action items
- Technical details that may be referenced later
- User preferences and patterns observed

---
${messagesText}
---

Keep the summary under ${targetTokens} tokens. Write in third person past tense.`;
  }
  try {
    const response = await fetch(`${config.provider.baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.provider.apiKey}`,
        "OpenAI-Beta": "responses=v1"
      },
      body: JSON.stringify({
        model,
        input: [{ role: "user", content: prompt }],
        max_output_tokens: targetTokens + 200,
        // Buffer for model variance
        temperature,
        stream: false
      })
    });
    if (!response.ok) {
      console.warn(`[Summarizer] LLM call failed: ${response.status}, using fallback`);
      return createFallbackSummary(messages, existingSummary, config.tokenizer);
    }
    const data = await response.json();
    let summaryText = data.output_text || "";
    if (!summaryText && data.output) {
      for (const item of data.output) {
        if (item.type === "message" && item.content) {
          for (const part of item.content) {
            if (part.type === "output_text" && part.text) {
              summaryText += part.text;
            }
          }
        }
      }
    }
    if (!summaryText) {
      console.warn("[Summarizer] Empty LLM response, using fallback");
      return createFallbackSummary(messages, existingSummary, config.tokenizer);
    }
    const lastMessageId = findLastMessageId(messages);
    return {
      text: summaryText.trim(),
      upToMessageId: lastMessageId,
      tokenCount: estimateTokens(summaryText, config.tokenizer)
    };
  } catch (error) {
    console.warn("[Summarizer] LLM call error:", error);
    return createFallbackSummary(messages, existingSummary, config.tokenizer);
  }
}
function createFallbackSummary(messages, existingSummary, tokenizer) {
  const tok = getTokenizer(tokenizer);
  const userMessages = messages.filter((m) => m.role === "user").map((m) => {
    const content = typeof m.content === "string" ? m.content : "[multimodal message]";
    return content.slice(0, 150);
  });
  const topics = userMessages.slice(0, 5);
  let text;
  if (existingSummary) {
    text = `${existingSummary.text}

Subsequent discussion covered: ${topics.join("; ")}`;
  } else {
    text = `Previous conversation covered: ${topics.join("; ")}`;
  }
  if (text.length > 2e3) {
    text = text.slice(0, 2e3) + "...";
  }
  const lastMessageId = findLastMessageId(messages);
  return {
    text,
    upToMessageId: lastMessageId,
    tokenCount: tok.count(text)
  };
}
function formatMessagesForSummary(messages) {
  const lines = [];
  for (const msg of messages) {
    const role = msg.role.charAt(0).toUpperCase() + msg.role.slice(1);
    let content;
    if (typeof msg.content === "string") {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content.map((part) => {
        if (part.type === "text" && part.text) return part.text;
        if (part.type === "image") return "[image]";
        if (part.type === "file") return "[file]";
        return "";
      }).filter(Boolean).join(" ");
    } else {
      content = "[empty]";
    }
    if (content.length > 1e3) {
      content = content.slice(0, 1e3) + "... [truncated]";
    }
    lines.push(`${role}: ${content}`);
    if (msg.toolCalls && msg.toolCalls.length > 0) {
      const toolNames = msg.toolCalls.map((tc) => tc.function?.name).filter(Boolean);
      lines.push(`  [Used tools: ${toolNames.join(", ")}]`);
    }
  }
  return lines.join("\n");
}
function findLastMessageId(messages) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.id) return msg.id;
    if (msg.toolCallId) return `tool:${msg.toolCallId}`;
  }
  return `count:${messages.length}`;
}

// src/context/context-manager.ts
async function manageContext(options) {
  const { messages, systemPrompt, userId, config, existingSummary } = options;
  const tokenizer = config.tokenizer;
  const tok = getTokenizer(tokenizer);
  const contextWindow = getContextWindow(config.model, {
    override: config.contextWindow
  });
  let memoryContext = "";
  let memoryTokens = 0;
  if (config.workingMemory) {
    try {
      memoryContext = await config.workingMemory.getContextForPrompt(userId, messages);
      memoryTokens = memoryContext ? tok.count(memoryContext) : 0;
    } catch (err) {
      console.warn("[ContextManager] Working memory retrieval failed:", err);
    }
  }
  const summaryTokens = existingSummary ? existingSummary.tokenCount : 0;
  let enrichedPrompt = systemPrompt;
  if (memoryContext) {
    enrichedPrompt = `${memoryContext}

${enrichedPrompt}`;
  }
  if (existingSummary) {
    enrichedPrompt = `## Previous Conversation Summary
${existingSummary.text}

${enrichedPrompt}`;
  }
  const windowResult = applyWindow({
    messages,
    systemPrompt: enrichedPrompt,
    contextWindow,
    maxResponseTokens: config.maxResponseTokens,
    summaryTokens: 0,
    // Already included in enrichedPrompt
    memoryTokens: 0,
    // Already included in enrichedPrompt
    tokenizer
  });
  let newSummary;
  if (windowResult.wasTruncated && windowResult.oldMessages.length > 0 && config.summary) {
    try {
      newSummary = await summarizeMessages(
        windowResult.oldMessages,
        existingSummary,
        config.summary
      );
      if (existingSummary) {
        enrichedPrompt = enrichedPrompt.replace(
          `## Previous Conversation Summary
${existingSummary.text}`,
          `## Previous Conversation Summary
${newSummary.text}`
        );
      } else {
        const baseIndex = enrichedPrompt.indexOf(systemPrompt);
        if (baseIndex > 0) {
          enrichedPrompt = enrichedPrompt.slice(0, baseIndex) + `## Previous Conversation Summary
${newSummary.text}

` + enrichedPrompt.slice(baseIndex);
        } else {
          enrichedPrompt = `## Previous Conversation Summary
${newSummary.text}

${enrichedPrompt}`;
        }
      }
    } catch (err) {
      console.warn("[ContextManager] Summarization failed:", err);
    }
  }
  const promptTokens = estimateTokens(enrichedPrompt, tokenizer);
  const estimatedTokens = promptTokens + windowResult.recentTokens;
  return {
    messages: windowResult.recentMessages,
    systemPrompt: enrichedPrompt,
    estimatedTokens,
    wasTruncated: windowResult.wasTruncated,
    newSummary,
    summarizedMessageCount: windowResult.oldMessages.length,
    budget: windowResult.budget
  };
}

// src/agent/loop.ts
var DEFAULT_MAX_DEPTH = 30;
function createHookContext(context) {
  return {
    sessionId: context.sessionId,
    conversationId: context.conversationId,
    userId: context.userId,
    streamId: context.streamId,
    agentId: context.agentId,
    agentDepth: context.agentDepth,
    messages: context.messages
  };
}
async function processWithToolLoop(context, depth = 0) {
  const maxDepth = context.config.agent?.maxDepth ?? DEFAULT_MAX_DEPTH;
  const hooks = context.config.hooks;
  const hookContext = createHookContext(context);
  if (depth >= maxDepth) {
    const error = new Error(`Tool loop exceeded max depth of ${maxDepth}`);
    await hooks?.onError?.(error, hookContext);
    throw error;
  }
  const { sessionId, streamId, systemPrompt, messages, tools, streamStore, config, callbacks, agentId, agentDepth } = context;
  callbacks?.onStatusChange?.("running");
  await streamStore.append(streamId, {
    type: "status",
    content: "running",
    timestamp: Date.now(),
    status: "running",
    agentId,
    agentDepth
  });
  if (!config.provider?.apiKey) {
    const error = new Error("SAGE: provider.apiKey is required. Set OPENAI_API_KEY or configure provider.apiKey.");
    await hooks?.onError?.(error, hookContext);
    throw error;
  }
  const providerConfig = {
    apiKey: config.provider.apiKey,
    baseUrl: config.provider.baseUrl || "https://api.openai.com/v1",
    model: config.model ?? "gpt-4o",
    temperature: config.temperature,
    maxTokens: config.maxTokens,
    parallelToolCalls: config.parallelToolCalls ?? true
  };
  let finalSystemPrompt = systemPrompt;
  let finalMessages = messages;
  if (context.contextConfig) {
    try {
      const contextResult = await manageContext({
        messages,
        systemPrompt,
        userId: context.userId,
        config: context.contextConfig,
        existingSummary: context.existingSummary
      });
      finalMessages = contextResult.messages;
      finalSystemPrompt = contextResult.systemPrompt;
      if (contextResult.newSummary) {
        context.existingSummary = contextResult.newSummary;
      }
    } catch (err) {
      console.warn("[SAGE] Context management failed, using raw messages:", err);
    }
  }
  const apiTools = tools.toAPIFormat();
  const apiMessages = normalizeMessagesToResponsesAPI(finalMessages);
  try {
    await hooks?.beforeLLMCall?.(hookContext);
  } catch (hookError) {
    console.warn("[SAGE] beforeLLMCall hook error:", hookError);
  }
  const retryConfig = config.retry;
  const makeRequest = async () => {
    const res = await fetch(`${providerConfig.baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${providerConfig.apiKey}`,
        "OpenAI-Beta": "responses=v1"
      },
      body: JSON.stringify({
        model: providerConfig.model,
        instructions: finalSystemPrompt,
        input: apiMessages,
        tools: apiTools.length > 0 ? apiTools : void 0,
        parallel_tool_calls: providerConfig.parallelToolCalls,
        stream: true,
        temperature: providerConfig.temperature,
        max_output_tokens: providerConfig.maxTokens
      })
    });
    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Responses API error: ${res.status} - ${errorBody}`);
    }
    return res;
  };
  let response;
  try {
    if (retryConfig) {
      response = await withRetry(makeRequest, {
        ...LLM_RETRY_CONFIG,
        ...retryConfig,
        onRetry: (attempt, error, delay) => {
          console.warn(`[SAGE] LLM request retry ${attempt} after ${delay}ms: ${error.message}`);
          retryConfig.onRetry?.(attempt, error, delay);
        }
      });
    } else {
      response = await makeRequest();
    }
  } catch (fetchError) {
    const error = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
    await hooks?.onError?.(error, hookContext);
    throw error;
  }
  const reader = response.body?.getReader();
  if (!reader) {
    const error = new Error("No response body");
    await hooks?.onError?.(error, hookContext);
    throw error;
  }
  const accumulator = {
    content: "",
    reasoning: "",
    toolCalls: [],
    inputTokens: 0,
    outputTokens: 0
  };
  const decoder = new TextDecoder();
  let buffer = "";
  const handlerContext = {
    streamStore,
    streamId,
    accumulator,
    callbacks,
    agentId,
    agentDepth
  };
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const data = line.slice(6).trim();
        if (data === "[DONE]") continue;
        if (!data) continue;
        try {
          const event = JSON.parse(data);
          await handleStreamEvent(event, handlerContext);
        } catch {
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
  try {
    await hooks?.afterLLMCall?.(hookContext, {
      content: accumulator.content,
      reasoning: accumulator.reasoning || void 0,
      toolCalls: accumulator.toolCalls,
      inputTokens: accumulator.inputTokens,
      outputTokens: accumulator.outputTokens
    });
  } catch (hookError) {
    console.warn("[SAGE] afterLLMCall hook error:", hookError);
  }
  const validToolCalls = accumulator.toolCalls.filter(
    (tc) => tc.function?.name && tc.function.name.trim() !== ""
  );
  if (validToolCalls.length > 0) {
    callbacks?.onStatusChange?.("tool_loop");
    await streamStore.append(streamId, {
      type: "status",
      content: "tool_loop",
      timestamp: Date.now(),
      status: "tool_loop",
      agentId,
      agentDepth
    });
    const toolResults = await Promise.all(
      validToolCalls.map(async (toolCall) => {
        const toolName = toolCall.function.name;
        const toolDef = tools.get(toolName);
        const toolInfo = {
          name: toolName,
          description: toolDef?.description || ""
        };
        callbacks?.onToolCall?.(toolCall);
        await streamStore.append(streamId, {
          type: "tool_call",
          content: "",
          timestamp: Date.now(),
          toolCallId: toolCall.id,
          toolName,
          toolArguments: toolCall.function.arguments,
          agentId,
          agentDepth
        });
        let args;
        try {
          args = JSON.parse(toolCall.function.arguments || "{}");
        } catch (parseError) {
          const error = new Error(`Failed to parse tool arguments: ${parseError}`);
          await hooks?.onError?.(error, hookContext);
          const errorResponse = JSON.stringify({
            error: true,
            message: error.message,
            toolName,
            suggestion: "Invalid JSON arguments provided."
          });
          callbacks?.onToolResult?.(toolCall.id, errorResponse);
          await streamStore.append(streamId, {
            type: "tool_result",
            content: errorResponse,
            timestamp: Date.now(),
            toolCallId: toolCall.id,
            toolName,
            agentId,
            agentDepth
          });
          return {
            role: "tool",
            content: errorResponse,
            toolCallId: toolCall.id
          };
        }
        try {
          const modifiedArgs = await hooks?.beforeToolExecution?.(toolInfo, args, hookContext);
          if (modifiedArgs !== void 0) {
            args = modifiedArgs;
          }
        } catch (hookError) {
          const error = hookError instanceof Error ? hookError : new Error(String(hookError));
          console.warn("[SAGE] beforeToolExecution hook error:", error);
          try {
            await hooks?.afterToolExecution?.(toolInfo, args, null, error, hookContext);
          } catch {
          }
          const errorResponse = JSON.stringify({
            error: true,
            message: `Tool execution blocked: ${error.message}`,
            toolName
          });
          callbacks?.onToolResult?.(toolCall.id, errorResponse);
          await streamStore.append(streamId, {
            type: "tool_result",
            content: errorResponse,
            timestamp: Date.now(),
            toolCallId: toolCall.id,
            toolName,
            agentId,
            agentDepth
          });
          return {
            role: "tool",
            content: errorResponse,
            toolCallId: toolCall.id
          };
        }
        try {
          const toolDef2 = tools.get(toolName);
          if (toolDef2) {
            const validation = validateToolArgs(toolDef2, args);
            if (!validation.valid) {
              const errorResponse = formatValidationError(validation.errors, toolName);
              callbacks?.onToolResult?.(toolCall.id, errorResponse);
              await streamStore.append(streamId, {
                type: "tool_result",
                content: errorResponse,
                timestamp: Date.now(),
                toolCallId: toolCall.id,
                toolName,
                agentId,
                agentDepth
              });
              return {
                role: "tool",
                content: errorResponse,
                toolCallId: toolCall.id
              };
            }
          }
          const toolTimeout = toolDef2?.timeout ?? context.config.agent?.toolTimeout ?? DEFAULT_TOOL_TIMEOUT;
          const maxResultSize = toolDef2?.maxResultSize ?? context.config.agent?.maxToolResultSize ?? DEFAULT_MAX_RESULT_SIZE;
          const result2 = await executeWithTimeout(
            () => tools.execute(toolName, args, {
              userId: context.userId,
              conversationId: context.conversationId,
              sessionId: context.sessionId
            }),
            toolTimeout,
            `Tool "${toolName}" timed out after ${toolTimeout}ms`
          );
          let resultStr = typeof result2 === "string" ? result2 : JSON.stringify(result2);
          if (resultStr.length > maxResultSize) {
            resultStr = truncateResult(resultStr, maxResultSize);
          }
          try {
            await hooks?.afterToolExecution?.(toolInfo, args, result2, null, hookContext);
          } catch (hookError) {
            console.warn("[SAGE] afterToolExecution hook error:", hookError);
          }
          callbacks?.onToolResult?.(toolCall.id, resultStr);
          await streamStore.append(streamId, {
            type: "tool_result",
            content: resultStr,
            timestamp: Date.now(),
            toolCallId: toolCall.id,
            toolName,
            agentId,
            agentDepth
          });
          return {
            role: "tool",
            content: resultStr,
            toolCallId: toolCall.id
          };
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          try {
            await hooks?.afterToolExecution?.(toolInfo, args, null, errorObj, hookContext);
          } catch (hookError) {
            console.warn("[SAGE] afterToolExecution hook error:", hookError);
          }
          await hooks?.onError?.(errorObj, hookContext);
          const errorResponse = formatToolError(errorObj, toolName, args);
          callbacks?.onToolResult?.(toolCall.id, errorResponse);
          await streamStore.append(streamId, {
            type: "tool_result",
            content: errorResponse,
            timestamp: Date.now(),
            toolCallId: toolCall.id,
            toolName,
            agentId,
            agentDepth
          });
          return {
            role: "tool",
            content: errorResponse,
            toolCallId: toolCall.id
          };
        }
      })
    );
    const newMessages = [
      ...messages,
      {
        role: "assistant",
        content: accumulator.content,
        toolCalls: validToolCalls,
        reasoning: accumulator.reasoning || void 0
      },
      ...toolResults
    ];
    return processWithToolLoop(
      { ...context, messages: newMessages },
      depth + 1
    );
  }
  const result = {
    content: accumulator.content,
    reasoning: accumulator.reasoning || void 0,
    toolCalls: [],
    inputTokens: accumulator.inputTokens,
    outputTokens: accumulator.outputTokens
  };
  try {
    await hooks?.onComplete?.(result, hookContext);
  } catch (hookError) {
    console.warn("[SAGE] onComplete hook error:", hookError);
  }
  callbacks?.onComplete?.(result);
  callbacks?.onStatusChange?.("completed");
  await streamStore.append(streamId, {
    type: "status",
    content: "completed",
    timestamp: Date.now(),
    status: "completed",
    agentId,
    agentDepth
  });
  return result;
}
function normalizeMessagesToResponsesAPI(messages) {
  const result = [];
  for (const m of messages) {
    if (m.role === "tool") {
      result.push({
        type: "function_call_output",
        call_id: m.toolCallId,
        output: typeof m.content === "string" ? m.content : JSON.stringify(m.content)
      });
    } else if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      if (m.content) {
        result.push({
          role: "assistant",
          content: typeof m.content === "string" ? m.content : m.content
        });
      }
      for (const tc of m.toolCalls) {
        result.push({
          type: "function_call",
          call_id: tc.id,
          name: tc.function.name,
          arguments: tc.function.arguments
        });
      }
    } else if (m.role === "user" && Array.isArray(m.content)) {
      const contentParts = m.content.map((part) => {
        if (part.type === "text") {
          return { type: "input_text", text: part.text };
        } else if (part.type === "image") {
          return { type: "input_image", image_url: part.imageUrl };
        } else if (part.type === "file") {
          return { type: "input_file", file_url: part.fileUrl };
        }
        return { type: "input_text", text: "" };
      });
      result.push({ role: m.role, content: contentParts });
    } else {
      result.push({
        role: m.role,
        content: m.content
      });
    }
  }
  return result;
}

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

// src/agent/subagent.ts
function createSubagentTool(definition, parentContext, allTools, maxAgentDepth, allDefinitions) {
  return {
    name: `delegate_to_${definition.name}`,
    description: definition.description,
    parameters: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "The task to delegate to this agent"
        }
      },
      required: ["task"]
    },
    execute: async (args) => {
      const task = args.task;
      const childDepth = parentContext.agentDepth + 1;
      await parentContext.streamStore.append(parentContext.streamId, {
        type: "subagent_start",
        content: task,
        timestamp: Date.now(),
        agentId: definition.name,
        agentDepth: childDepth
      });
      parentContext.callbacks?.onSubagentStart?.(definition.name, task);
      try {
        const childRegistry = createToolRegistry();
        if (definition.toolNames && definition.toolNames.length > 0) {
          for (const toolName of definition.toolNames) {
            const tool = allTools.find((t) => t.name === toolName);
            if (tool) {
              childRegistry.register(tool);
            }
          }
        }
        if (definition.mcpServers) {
          for (const serverUrl of definition.mcpServers) {
            await childRegistry.registerMCP(serverUrl);
          }
        }
        const childConfig = {
          ...parentContext.config,
          ...definition.model && { model: definition.model },
          ...definition.temperature !== void 0 && { temperature: definition.temperature },
          ...definition.maxTokens !== void 0 && { maxTokens: definition.maxTokens },
          ...definition.maxDepth !== void 0 && { agent: { ...parentContext.config.agent, maxDepth: definition.maxDepth } }
        };
        const childContext = {
          sessionId: parentContext.sessionId,
          conversationId: parentContext.conversationId,
          userId: parentContext.userId,
          streamId: parentContext.streamId,
          systemPrompt: definition.systemPrompt,
          messages: [{ role: "user", content: task }],
          tools: childRegistry,
          streamStore: parentContext.streamStore,
          config: childConfig,
          callbacks: parentContext.callbacks,
          agentId: definition.name,
          agentDepth: childDepth
        };
        registerSubagentTools(
          childRegistry,
          allDefinitions,
          childContext,
          allTools,
          maxAgentDepth
        );
        const result = await processWithToolLoop(childContext);
        await parentContext.streamStore.append(parentContext.streamId, {
          type: "subagent_end",
          content: result.content,
          timestamp: Date.now(),
          agentId: definition.name,
          agentDepth: childDepth
        });
        parentContext.callbacks?.onSubagentEnd?.(definition.name, result.content);
        return result.content;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        await parentContext.streamStore.append(parentContext.streamId, {
          type: "subagent_end",
          content: JSON.stringify({ error: true, message: errorMsg }),
          timestamp: Date.now(),
          agentId: definition.name,
          agentDepth: childDepth
        });
        parentContext.callbacks?.onSubagentEnd?.(
          definition.name,
          JSON.stringify({ error: true, message: errorMsg })
        );
        throw error;
      }
    }
  };
}
function registerSubagentTools(registry, definitions, parentContext, allTools, maxAgentDepth) {
  if (parentContext.agentDepth >= maxAgentDepth) {
    return;
  }
  for (const def of definitions) {
    const tool = createSubagentTool(def, parentContext, allTools, maxAgentDepth, definitions);
    registry.register(tool);
  }
}

// src/agent/session.ts
async function createSession(options) {
  const {
    conversationId,
    userId,
    systemPrompt,
    messages,
    tools,
    streamStore,
    config,
    sessionRepository,
    messageRepository,
    callbacks,
    workingMemory,
    contextConfig
  } = options;
  const sessionId = (0, import_crypto.randomUUID)();
  const streamId = (0, import_crypto.randomUUID)();
  if (sessionRepository) {
    await sessionRepository.create({
      conversationId,
      userId,
      streamId
    });
  }
  await streamStore.setMeta(streamId, {
    sessionId,
    conversationId,
    userId,
    status: "pending",
    createdAt: Date.now()
  });
  const context = {
    sessionId,
    conversationId,
    userId,
    streamId,
    systemPrompt,
    messages,
    tools,
    streamStore,
    config,
    callbacks,
    agentId: config.agent?.name || "root",
    agentDepth: 0,
    workingMemory,
    contextConfig
  };
  if (config.subagents && config.subagents.length > 0) {
    const allTools = tools.list();
    const definitions = config.subagents;
    const maxAgentDepth = config.maxAgentDepth ?? 1;
    registerSubagentTools(tools, definitions, context, allTools, maxAgentDepth);
  }
  const result = processWithToolLoop(context).then(async (agentResult) => {
    if (workingMemory && config.context?.workingMemory?.autoExtract && agentResult.content) {
      try {
        await workingMemory.extractMemories(
          userId,
          messages,
          agentResult.content,
          conversationId
        );
      } catch (err) {
        console.warn("[SAGE] Memory extraction failed:", err);
      }
    }
    if (messageRepository && agentResult.content) {
      await messageRepository.saveAssistantMessage({
        conversationId,
        content: agentResult.content,
        reasoning: agentResult.reasoning,
        toolCalls: agentResult.toolCalls.length > 0 ? agentResult.toolCalls : void 0,
        inputTokens: agentResult.inputTokens,
        outputTokens: agentResult.outputTokens
      });
    }
    if (sessionRepository) {
      await sessionRepository.complete(sessionId, {
        accumulatedContent: agentResult.content,
        accumulatedReasoning: agentResult.reasoning,
        inputTokens: agentResult.inputTokens,
        outputTokens: agentResult.outputTokens
      });
    }
  }).catch(async (error) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    callbacks?.onError?.(error instanceof Error ? error : new Error(errorMsg));
    callbacks?.onStatusChange?.("failed");
    await streamStore.append(streamId, {
      type: "error",
      content: errorMsg,
      timestamp: Date.now(),
      status: "failed"
    });
    if (sessionRepository) {
      await sessionRepository.updateStatus(sessionId, "failed", {
        error: errorMsg,
        completedAt: Date.now()
      });
    }
    throw error;
  });
  return { sessionId, streamId, result };
}
function buildSystemPrompt(options) {
  const { agentName = "SAGE Agent", basePrompt, projectInstructions, timezone } = options;
  const now = /* @__PURE__ */ new Date();
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone
  });
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: timezone
  });
  let prompt = basePrompt || `You are ${agentName}, an intelligent AI assistant.

Current time: ${timeStr}
Current date: ${dateStr}

You have access to various tools to help users. Be helpful, accurate, and concise.

## IMPORTANT: Be Proactive with Tools

When a user asks for information you can look up, USE the appropriate tool immediately.
Don't ask clarifying questions when you can use tools to get the information.

Take action first, then ask questions only if the tools don't provide enough info.

## Tool Error Handling
- When a tool call returns an error, DO NOT retry the same tool with the same arguments.
- If a tool fails, explain briefly and suggest alternatives.

## Citations
When you use tools that return sources, cite them in your response using [1], [2], etc.`;
  if (projectInstructions) {
    prompt += `

## Project Context
${projectInstructions}`;
  }
  if (options.hasMemoryTools) {
    prompt += `

## Memory Tools
You have persistent memory across conversations. Use these tools proactively:
- **remember**: Store important facts, preferences, or instructions when the user shares them
- **recall**: Search your memories about the user before answering questions that might depend on context
- **update_memory**: Correct or update existing memories when information changes
- **forget**: Delete memories when the user asks you to forget something
Always confirm memory operations to the user.`;
  }
  return prompt;
}
function generateStreamId() {
  return (0, import_crypto.randomUUID)();
}

// src/streaming/redis.ts
var import_ioredis = __toESM(require("ioredis"));
var RedisStreamStore = class {
  client;
  keyPrefix;
  defaultTtl;
  constructor(config) {
    if (!config.redisUrl) {
      throw new Error("Redis URL is required for RedisStreamStore");
    }
    this.client = new import_ioredis.default(config.redisUrl, {
      maxRetriesPerRequest: 3,
      lazyConnect: true
    });
    this.keyPrefix = config.keyPrefix || "sage:stream:";
    this.defaultTtl = config.defaultTtl || 3600;
    this.client.on("error", (err) => {
      console.error("[RedisStreamStore] Connection error:", err);
    });
  }
  /**
   * Get the stream key for a given stream ID
   */
  streamKey(streamId) {
    return `${this.keyPrefix}${streamId}`;
  }
  /**
   * Get the metadata key for a given stream ID
   */
  metaKey(streamId) {
    return `${this.keyPrefix}${streamId}:meta`;
  }
  /**
   * Append a chunk to the stream
   */
  async append(streamId, chunk) {
    const key = this.streamKey(streamId);
    const fields = [
      "type",
      chunk.type,
      "content",
      chunk.content,
      "timestamp",
      chunk.timestamp.toString()
    ];
    if (chunk.toolCallId) {
      fields.push("toolCallId", chunk.toolCallId);
    }
    if (chunk.toolName) {
      fields.push("toolName", chunk.toolName);
    }
    if (chunk.toolArguments) {
      fields.push("toolArguments", chunk.toolArguments);
    }
    if (chunk.status) {
      fields.push("status", chunk.status);
    }
    const id = await this.client.xadd(key, "*", ...fields);
    if (!id) {
      throw new Error("Failed to append to stream");
    }
    const ttl = await this.client.ttl(key);
    if (ttl === -1) {
      await this.client.expire(key, this.defaultTtl);
    }
    return id;
  }
  /**
   * Read chunks from the stream
   */
  async read(streamId, fromId = "0", count = 100) {
    const key = this.streamKey(streamId);
    const results = await this.client.xrange(
      key,
      fromId === "0" ? "-" : `(${fromId}`,
      "+",
      "COUNT",
      count.toString()
    );
    if (!results || results.length === 0) {
      return [];
    }
    return results.map(([id, fields]) => {
      const data = {};
      for (let i = 0; i < fields.length; i += 2) {
        data[fields[i]] = fields[i + 1];
      }
      return {
        id,
        data: {
          type: data.type,
          content: data.content,
          timestamp: parseInt(data.timestamp, 10),
          toolCallId: data.toolCallId,
          toolName: data.toolName,
          toolArguments: data.toolArguments,
          status: data.status
        }
      };
    });
  }
  /**
   * Get stream metadata
   */
  async getMeta(streamId) {
    const key = this.metaKey(streamId);
    const data = await this.client.get(key);
    if (!data) {
      return null;
    }
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  /**
   * Set stream metadata
   */
  async setMeta(streamId, meta) {
    const key = this.metaKey(streamId);
    await this.client.setex(key, this.defaultTtl, JSON.stringify(meta));
  }
  /**
   * Delete a stream and its metadata
   */
  async delete(streamId) {
    const streamKey = this.streamKey(streamId);
    const metaKey = this.metaKey(streamId);
    await this.client.del(streamKey, metaKey);
  }
  /**
   * Check if a stream exists
   */
  async exists(streamId) {
    const key = this.streamKey(streamId);
    const exists = await this.client.exists(key);
    return exists === 1;
  }
  /**
   * Close the connection
   */
  async close() {
    await this.client.quit();
  }
};
function createRedisStreamStore(redisUrl, options) {
  return new RedisStreamStore({
    provider: "redis",
    redisUrl,
    ...options
  });
}

// src/streaming/memory.ts
var MemoryStreamStore = class {
  streams = /* @__PURE__ */ new Map();
  metadata = /* @__PURE__ */ new Map();
  counter = 0;
  /**
   * Generate a unique entry ID (similar to Redis format)
   */
  generateId() {
    const timestamp = Date.now();
    const sequence = this.counter++;
    return `${timestamp}-${sequence}`;
  }
  /**
   * Append a chunk to the stream
   */
  async append(streamId, chunk) {
    const id = this.generateId();
    if (!this.streams.has(streamId)) {
      this.streams.set(streamId, []);
    }
    const entries = this.streams.get(streamId);
    entries.push({ id, data: chunk });
    return id;
  }
  /**
   * Read chunks from the stream
   */
  async read(streamId, fromId = "0", count = 100) {
    const entries = this.streams.get(streamId);
    if (!entries || entries.length === 0) {
      return [];
    }
    let startIndex = 0;
    if (fromId !== "0") {
      const foundIndex = entries.findIndex((e) => e.id === fromId);
      if (foundIndex !== -1) {
        startIndex = foundIndex + 1;
      }
    }
    return entries.slice(startIndex, startIndex + count);
  }
  /**
   * Get stream metadata
   */
  async getMeta(streamId) {
    return this.metadata.get(streamId) || null;
  }
  /**
   * Set stream metadata
   */
  async setMeta(streamId, meta) {
    this.metadata.set(streamId, meta);
  }
  /**
   * Delete a stream and its metadata
   */
  async delete(streamId) {
    this.streams.delete(streamId);
    this.metadata.delete(streamId);
  }
  /**
   * Check if a stream exists
   */
  async exists(streamId) {
    return this.streams.has(streamId);
  }
  /**
   * Close the connection (no-op for memory store)
   */
  async close() {
  }
  /**
   * Clear all streams (useful for testing)
   */
  clear() {
    this.streams.clear();
    this.metadata.clear();
    this.counter = 0;
  }
  /**
   * Get the number of streams
   */
  get size() {
    return this.streams.size;
  }
};
function createMemoryStreamStore() {
  return new MemoryStreamStore();
}

// src/db/memory.ts
var import_crypto2 = require("crypto");
var MemoryConversationRepository = class {
  conversations = /* @__PURE__ */ new Map();
  async list(userId) {
    return Array.from(this.conversations.values()).filter((c) => c.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  async getById(id) {
    return this.conversations.get(id) || null;
  }
  async create(data) {
    const now = Date.now();
    const conversation = {
      id: (0, import_crypto2.randomUUID)(),
      userId: data.userId,
      title: data.title,
      projectId: data.projectId,
      isPinned: false,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }
  async update(id, data) {
    const existing = this.conversations.get(id);
    if (existing) {
      this.conversations.set(id, {
        ...existing,
        ...data,
        updatedAt: Date.now()
      });
    }
  }
  async updateTitle(id, title) {
    await this.update(id, { title });
  }
  async delete(id) {
    this.conversations.delete(id);
  }
  clear() {
    this.conversations.clear();
  }
};
var MemoryMessageRepository = class {
  messages = /* @__PURE__ */ new Map();
  async getByConversation(conversationId) {
    return Array.from(this.messages.values()).filter((m) => m.conversationId === conversationId).sort((a, b) => a.createdAt - b.createdAt);
  }
  async getById(id) {
    return this.messages.get(id) || null;
  }
  async create(data) {
    const message = {
      id: (0, import_crypto2.randomUUID)(),
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      reasoning: data.reasoning,
      toolCalls: data.toolCalls,
      toolCallId: data.toolCallId,
      createdAt: Date.now(),
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      sources: data.sources,
      attachments: data.attachments
    };
    this.messages.set(message.id, message);
    return message;
  }
  async saveAssistantMessage(data) {
    return this.create({
      conversationId: data.conversationId,
      role: "assistant",
      content: data.content,
      reasoning: data.reasoning,
      toolCalls: data.toolCalls,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens
    });
  }
  async saveToolMessage(data) {
    return this.create({
      conversationId: data.conversationId,
      role: "tool",
      content: data.content,
      toolCallId: data.toolCallId
    });
  }
  clear() {
    this.messages.clear();
  }
};
var MemorySessionRepository = class {
  sessions = /* @__PURE__ */ new Map();
  async getById(id) {
    return this.sessions.get(id) || null;
  }
  async getByStreamId(streamId) {
    return Array.from(this.sessions.values()).find((s) => s.streamId === streamId) || null;
  }
  async getActive(conversationId) {
    return Array.from(this.sessions.values()).find(
      (s) => s.conversationId === conversationId && (s.status === "pending" || s.status === "running" || s.status === "tool_loop")
    ) || null;
  }
  async create(data) {
    const now = Date.now();
    const session = {
      id: (0, import_crypto2.randomUUID)(),
      conversationId: data.conversationId,
      userId: data.userId,
      streamId: data.streamId,
      status: "pending",
      toolLoopDepth: 0,
      createdAt: now,
      lastActivityAt: now
    };
    this.sessions.set(session.id, session);
    return session;
  }
  async updateStatus(id, status, extra) {
    const existing = this.sessions.get(id);
    if (existing) {
      this.sessions.set(id, {
        ...existing,
        ...extra,
        status,
        lastActivityAt: Date.now()
      });
    }
  }
  async complete(id, data) {
    const existing = this.sessions.get(id);
    if (existing) {
      this.sessions.set(id, {
        ...existing,
        ...data,
        status: "completed",
        completedAt: Date.now(),
        lastActivityAt: Date.now()
      });
    }
  }
  clear() {
    this.sessions.clear();
  }
};
function createMemoryRepositories() {
  return {
    conversations: new MemoryConversationRepository(),
    messages: new MemoryMessageRepository(),
    sessions: new MemorySessionRepository()
  };
}

// src/db/convex.ts
var ConvexConversationRepository = class {
  constructor(client) {
    this.client = client;
  }
  async list(userId) {
    return this.client.query("conversations:list", { userId });
  }
  async getById(id) {
    return this.client.query("conversations:getById", { id });
  }
  async create(data) {
    return this.client.mutation("conversations:create", data);
  }
  async update(id, data) {
    await this.client.mutation("conversations:update", { id, ...data });
  }
  async updateTitle(id, title) {
    await this.client.mutation("conversations:updateTitle", { id, title });
  }
  async delete(id) {
    await this.client.mutation("conversations:delete", { id });
  }
};
var ConvexMessageRepository = class {
  constructor(client) {
    this.client = client;
  }
  async getByConversation(conversationId) {
    return this.client.query("messages:getByConversation", { conversationId });
  }
  async getById(id) {
    return this.client.query("messages:getById", { id });
  }
  async create(data) {
    return this.client.mutation("messages:create", data);
  }
  async saveAssistantMessage(data) {
    return this.client.mutation("messages:saveAssistant", data);
  }
  async saveToolMessage(data) {
    return this.client.mutation("messages:saveTool", data);
  }
};
var ConvexSessionRepository = class {
  constructor(client) {
    this.client = client;
  }
  async getById(id) {
    return this.client.query("sessions:getById", { id });
  }
  async getByStreamId(streamId) {
    return this.client.query("sessions:getByStreamId", { streamId });
  }
  async getActive(conversationId) {
    return this.client.query("sessions:getActive", { conversationId });
  }
  async create(data) {
    return this.client.mutation("sessions:create", data);
  }
  async updateStatus(id, status, extra) {
    await this.client.mutation("sessions:updateStatus", { id, status, ...extra });
  }
  async complete(id, data) {
    await this.client.mutation("sessions:complete", { id, ...data });
  }
};
function createConvexRepositories(client) {
  return {
    conversations: new ConvexConversationRepository(client),
    messages: new ConvexMessageRepository(client),
    sessions: new ConvexSessionRepository(client)
  };
}

// src/context/working-memory.ts
var import_crypto3 = require("crypto");

// src/context/entities.ts
function extractEntities(text) {
  const entities = /* @__PURE__ */ new Set();
  const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b/g;
  let match;
  while ((match = capitalizedPattern.exec(text)) !== null) {
    const candidate = match[1];
    if (!COMMON_STARTERS.has(candidate.split(" ")[0])) {
      entities.add(candidate);
    }
  }
  const singleCapPattern = /(?<=[a-z.!?]\s)([A-Z][a-z]{2,})\b/g;
  while ((match = singleCapPattern.exec(text)) !== null) {
    const word = match[1];
    if (!COMMON_WORDS.has(word) && !COMMON_STARTERS.has(word)) {
      entities.add(word);
    }
  }
  const datePatterns = [
    /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s+\d{4})?\b/gi,
    /\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/g,
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi,
    /\bnext\s+(?:week|month|year|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi
  ];
  for (const pattern of datePatterns) {
    while ((match = pattern.exec(text)) !== null) {
      entities.add(match[0]);
    }
  }
  const emailPattern = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;
  while ((match = emailPattern.exec(text)) !== null) {
    entities.add(match[0]);
  }
  return Array.from(entities);
}
function classifyEntity(entity) {
  const lower = entity.toLowerCase();
  if (/\b(?:january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}\/\d{1,2}|\d{4}-\d{2}|next\s+(?:week|month|year))\b/i.test(entity)) {
    return "date";
  }
  if (/\b(?:Inc|Corp|LLC|Ltd|Company|University|Institute|Foundation|Association|Group|Team)\b/i.test(entity)) {
    return "org";
  }
  if (/\b(?:Street|Avenue|Blvd|Road|City|State|Country|Park|Lake|River|Mountain|Island)\b/i.test(entity)) {
    return "place";
  }
  if (entity.includes("@")) {
    return "person";
  }
  const words = entity.split(/\s+/);
  if (words.length === 2 && words.every((w) => /^[A-Z]/.test(w))) {
    return "person";
  }
  return "concept";
}
function findSharedEntities(a, b) {
  const setB = new Set(b.map((e) => e.toLowerCase()));
  return a.filter((e) => setB.has(e.toLowerCase()));
}
var COMMON_WORDS = /* @__PURE__ */ new Set([
  "The",
  "This",
  "That",
  "These",
  "Those",
  "What",
  "When",
  "Where",
  "Which",
  "Who",
  "How",
  "Why",
  "Yes",
  "No",
  "Not",
  "But",
  "And",
  "Or",
  "So",
  "Just",
  "Also",
  "Very",
  "Really",
  "Actually",
  "Here",
  "There",
  "Now",
  "Then",
  "Always",
  "Never",
  "Sometimes",
  "Maybe",
  "Please",
  "Thanks",
  "Sure",
  "Okay",
  "Right",
  "Well",
  "However",
  "Although",
  "Because"
]);
var COMMON_STARTERS = /* @__PURE__ */ new Set([
  "I",
  "We",
  "He",
  "She",
  "It",
  "They",
  "You",
  "My",
  "Your",
  "Our",
  "His",
  "Her",
  "Its",
  "Their",
  "The",
  "This",
  "That",
  "If",
  "Do",
  "Can",
  "Could",
  "Would",
  "Should",
  "Will",
  "Have",
  "Has",
  "Had",
  "Are",
  "Is",
  "Was",
  "Were",
  "Be",
  "Been",
  "Being",
  "Let",
  "For"
]);

// src/context/retrieval.ts
var DEFAULT_WEIGHTS = {
  semantic: 1,
  recency: 0.8,
  confidence: 1,
  accessCount: 0.3,
  entity: 0.8,
  importance: 0.7,
  persistence: 0.3
};
function detectTemporalQuery(query) {
  const lower = query.toLowerCase();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1e3;
  if (/\byesterday\b/.test(lower)) {
    const start = now - 2 * DAY;
    return { isTemporalQuery: true, timeRange: { start, end: now }, field: "eventTime" };
  }
  if (/\btoday\b/.test(lower)) {
    const start = now - DAY;
    return { isTemporalQuery: true, timeRange: { start, end: now }, field: "eventTime" };
  }
  if (/\blast\s+week\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now - 7 * DAY, end: now }, field: "eventTime" };
  }
  if (/\blast\s+month\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now - 30 * DAY, end: now }, field: "eventTime" };
  }
  if (/\brecently\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now - 7 * DAY, end: now }, field: "createdAt" };
  }
  if (/\bthis\s+week\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now - 7 * DAY, end: now }, field: "eventTime" };
  }
  if (/\bthis\s+month\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now - 30 * DAY, end: now }, field: "eventTime" };
  }
  const monthMatch = lower.match(/\bin\s+(january|february|march|april|may|june|july|august|september|october|november|december)\b/);
  if (monthMatch) {
    const monthNames = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
    const monthIndex = monthNames.indexOf(monthMatch[1]);
    const year = (/* @__PURE__ */ new Date()).getFullYear();
    const start = new Date(year, monthIndex, 1).getTime();
    const end = new Date(year, monthIndex + 1, 0, 23, 59, 59).getTime();
    return { isTemporalQuery: true, timeRange: { start, end }, field: "eventTime" };
  }
  if (/\b(?:upcoming|next\s+week)\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now, end: now + 7 * DAY }, field: "eventTime" };
  }
  if (/\bnext\s+month\b/.test(lower)) {
    return { isTemporalQuery: true, timeRange: { start: now, end: now + 30 * DAY }, field: "eventTime" };
  }
  return { isTemporalQuery: false, field: "createdAt" };
}
async function retrieveMemories(query, userId, config, stores) {
  const broadLimit = config.broadSearchLimit ?? 50;
  const finalLimit = config.finalLimit ?? 15;
  const weights = { ...DEFAULT_WEIGHTS, ...config.weights };
  let candidates = [];
  if (stores.embeddings && stores.vector) {
    try {
      const queryVector = await stores.embeddings.embed(query);
      const results = await stores.vector.query(queryVector, broadLimit, { userId });
      const fetchPromises = results.map(async (r) => {
        const entry = await stores.memory.get(r.id);
        if (!entry || entry.supersededBy) return null;
        return { entry, semanticScore: r.score, compositeScore: 0 };
      });
      const fetched = await Promise.all(fetchPromises);
      candidates = fetched.filter((e) => e !== null);
    } catch {
      const entries = await stores.memory.search(userId, query, broadLimit);
      candidates = entries.filter((e) => !e.supersededBy).map((entry) => ({ entry, semanticScore: 0.5, compositeScore: 0 }));
    }
  } else {
    const entries = await stores.memory.search(userId, query, broadLimit);
    candidates = entries.filter((e) => !e.supersededBy).map((entry) => ({ entry, semanticScore: 0.5, compositeScore: 0 }));
  }
  if (candidates.length === 0) return [];
  const queryEntities = extractEntities(query);
  const temporal = detectTemporalQuery(query);
  if (temporal.isTemporalQuery && temporal.timeRange) {
    const { start, end } = temporal.timeRange;
    const filtered = candidates.filter((c) => {
      const time = temporal.field === "eventTime" ? c.entry.eventTime ?? c.entry.createdAt : c.entry.createdAt;
      return time >= start && time <= end;
    });
    if (filtered.length > 0) {
      candidates = filtered;
    }
  }
  const now = Date.now();
  candidates = candidates.filter((c) => {
    if (c.entry.expiresAt && c.entry.expiresAt < now) return false;
    return true;
  });
  const maxAge = Math.max(...candidates.map((c) => now - c.entry.createdAt), 1);
  const maxAccessCount = Math.max(...candidates.map((c) => c.entry.accessCount ?? 0), 1);
  for (const c of candidates) {
    const { entry } = c;
    const age = now - entry.createdAt;
    const recencyScore = 1 - age / maxAge;
    const confidenceScore = entry.confidence;
    const accessScore = (entry.accessCount ?? 0) / maxAccessCount;
    let entityScore = 0;
    if (queryEntities.length > 0 && entry.entities && entry.entities.length > 0) {
      const shared = findSharedEntities(queryEntities, entry.entities);
      entityScore = shared.length / Math.max(queryEntities.length, 1);
    }
    const importanceScore = entry.importance ?? 0.5;
    let persistenceScore = 0.5;
    if (entry.persistenceLevel === "longTerm") persistenceScore = 1;
    else if (entry.persistenceLevel === "shortTerm") persistenceScore = 0.5;
    else if (entry.persistenceLevel === "ephemeral") persistenceScore = 0.2;
    c.compositeScore = c.semanticScore * weights.semantic + recencyScore * weights.recency + confidenceScore * weights.confidence + accessScore * weights.accessCount + entityScore * weights.entity + importanceScore * weights.importance + persistenceScore * weights.persistence;
  }
  candidates.sort((a, b) => b.compositeScore - a.compositeScore);
  const selected = [];
  const seenContentHashes = /* @__PURE__ */ new Set();
  for (const c of candidates) {
    if (selected.length >= finalLimit) break;
    const hash = c.entry.content.slice(0, 50).toLowerCase();
    if (seenContentHashes.has(hash)) continue;
    seenContentHashes.add(hash);
    selected.push(c);
  }
  return selected.map((s) => s.entry);
}

// src/context/working-memory.ts
function createWorkingMemory(config) {
  const {
    store,
    embeddings,
    vectorStore,
    maxMemoriesInPrompt = 20,
    provider,
    extractionModel
  } = config;
  const hasSemanticSearch = !!(embeddings && vectorStore);
  return {
    /**
     * Get relevant memories formatted for system prompt injection.
     */
    async getContextForPrompt(userId, currentMessages) {
      const queryText = extractQueryContext(currentMessages);
      if (!queryText) {
        const recent = await store.listByUser(userId, { limit: maxMemoriesInPrompt });
        if (recent.length === 0) return "";
        return formatMemoriesForPrompt(recent);
      }
      const memories = await retrieveMemories(queryText, userId, {
        finalLimit: maxMemoriesInPrompt
      }, {
        memory: store,
        embeddings,
        vector: vectorStore
      });
      if (memories.length === 0) return "";
      const now = Date.now();
      for (const mem of memories) {
        mem.lastAccessedAt = now;
        mem.accessCount = (mem.accessCount ?? 0) + 1;
        mem.confidence = Math.min(1, mem.confidence + 0.05);
        store.save(mem).catch(() => {
        });
      }
      return formatMemoriesForPrompt(memories);
    },
    /**
     * Extract new memories from a conversation turn using LLM.
     */
    async extractMemories(userId, messages, assistantResponse, conversationId) {
      if (!provider) return [];
      const model = extractionModel || "gpt-4o";
      const recentMessages = messages.slice(-6);
      const conversationSnippet = recentMessages.map((m) => {
        const role = m.role;
        const content = typeof m.content === "string" ? m.content : "[multimodal]";
        return `${role}: ${content.slice(0, 300)}`;
      }).join("\n");
      const prompt = `Analyze this conversation snippet and extract any facts, preferences, or important context worth remembering long-term.

Conversation:
---
${conversationSnippet}
assistant: ${assistantResponse.slice(0, 500)}
---

Return a JSON array of memories to save. Each memory should have:
- "content": string \u2014 the fact/preference/context to remember
- "category": "fact" | "preference" | "instruction" | "context"
- "confidence": number 0.0-1.0 \u2014 how certain this information is
- "memoryType": "episodic" (event/experience) | "semantic" (general fact) | "procedural" (how-to/instruction)
- "importance": number 0.0-1.0 \u2014 how important this is to the user
- "persistenceLevel": "ephemeral" (temporary, low confidence) | "shortTerm" (moderate) | "longTerm" (user-stated, high confidence)
- "entities": string[] \u2014 people, places, organizations, dates, or concepts mentioned
- "eventTime": number | null \u2014 Unix timestamp if the memory references a specific date/time, null otherwise
- "expiresAt": number | null \u2014 Unix timestamp if the memory is time-sensitive (e.g. "quiz next Wednesday"), null otherwise

Rules:
- Only extract genuinely useful long-term information
- Don't extract transient information (timestamps, temporary states)
- Prefer user-stated facts over inferred ones
- User-explicit info \u2192 "longTerm", inferred \u2192 "shortTerm", uncertain \u2192 "ephemeral"
- Return [] if nothing worth remembering

Return ONLY the JSON array, no explanation.`;
      try {
        const response = await fetch(`${provider.baseUrl}/responses`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${provider.apiKey}`,
            "OpenAI-Beta": "responses=v1"
          },
          body: JSON.stringify({
            model,
            input: [{ role: "user", content: prompt }],
            max_output_tokens: 500,
            temperature: 0.2,
            stream: false
          })
        });
        if (!response.ok) return [];
        const data = await response.json();
        if (!data.output_text) return [];
        const raw = parseJSONFromLLM(data.output_text);
        if (!Array.isArray(raw)) return [];
        const now = Date.now();
        const entries = [];
        for (const item of raw) {
          if (!item.content || typeof item.content !== "string") continue;
          const entry = {
            id: (0, import_crypto3.randomUUID)(),
            userId,
            content: item.content,
            category: validateCategory(item.category),
            source: "agent",
            confidence: Math.max(0, Math.min(1, Number(item.confidence) || 0.7)),
            createdAt: now,
            lastAccessedAt: now,
            conversationId,
            // Hierarchical fields
            memoryType: validateMemoryType(item.memoryType),
            importance: typeof item.importance === "number" ? Math.max(0, Math.min(1, item.importance)) : void 0,
            persistenceLevel: validatePersistenceLevel(item.persistenceLevel),
            entities: Array.isArray(item.entities) ? item.entities.filter((e) => typeof e === "string") : void 0,
            eventTime: typeof item.eventTime === "number" ? item.eventTime : void 0,
            expiresAt: typeof item.expiresAt === "number" ? item.expiresAt : void 0,
            version: 1,
            accessCount: 0
          };
          if (embeddings) {
            try {
              entry.embedding = await embeddings.embed(entry.content);
            } catch {
            }
          }
          await store.save(entry);
          if (vectorStore && entry.embedding) {
            try {
              await vectorStore.upsert([{
                id: entry.id,
                vector: entry.embedding,
                metadata: {
                  userId: entry.userId,
                  category: entry.category,
                  confidence: entry.confidence,
                  content: entry.content
                }
              }]);
            } catch {
            }
          }
          entries.push(entry);
        }
        return entries;
      } catch (error) {
        console.warn("[WorkingMemory] Extraction failed:", error);
        return [];
      }
    },
    /**
     * Explicit save — for "remember" tool
     */
    async remember(userId, content, category, conversationId) {
      const now = Date.now();
      const entry = {
        id: (0, import_crypto3.randomUUID)(),
        userId,
        content,
        category: category || "fact",
        source: "user",
        confidence: 1,
        // User-stated = maximum confidence
        createdAt: now,
        lastAccessedAt: now,
        conversationId,
        // User-explicit memories get longTerm persistence
        memoryType: "semantic",
        importance: 1,
        persistenceLevel: "longTerm",
        version: 1,
        accessCount: 0
      };
      if (embeddings) {
        try {
          entry.embedding = await embeddings.embed(content);
        } catch {
        }
      }
      await store.save(entry);
      if (vectorStore && entry.embedding) {
        try {
          await vectorStore.upsert([{
            id: entry.id,
            vector: entry.embedding,
            metadata: {
              userId,
              category: entry.category,
              confidence: entry.confidence,
              content
            }
          }]);
        } catch {
        }
      }
      return entry;
    },
    /**
     * Explicit recall — for "recall" tool
     */
    async recall(userId, query, limit = 10) {
      const memories = await retrieveMemories(query, userId, {
        finalLimit: limit
      }, {
        memory: store,
        embeddings,
        vector: vectorStore
      });
      const now = Date.now();
      for (const mem of memories) {
        mem.lastAccessedAt = now;
        mem.accessCount = (mem.accessCount ?? 0) + 1;
        mem.confidence = Math.min(1, mem.confidence + 0.05);
        store.save(mem).catch(() => {
        });
      }
      return memories;
    },
    /**
     * Prune old or low-confidence memories
     */
    async prune(userId, options) {
      const maxAge = options?.maxAge ?? 90 * 24 * 60 * 60 * 1e3;
      const minConfidence = options?.minConfidence ?? 0.3;
      const now = Date.now();
      const allMemories = await store.listByUser(userId);
      const toDelete = [];
      for (const mem of allMemories) {
        const age = now - mem.lastAccessedAt;
        const isStale = age > maxAge;
        const isLowConfidence = mem.confidence < minConfidence;
        if (isStale && isLowConfidence || age > maxAge * 3) {
          toDelete.push(mem.id);
        }
      }
      for (const id of toDelete) {
        await store.delete(id);
      }
      if (vectorStore && toDelete.length > 0) {
        try {
          await vectorStore.delete(toDelete);
        } catch {
        }
      }
      return toDelete.length;
    }
  };
}
function extractQueryContext(messages) {
  const recent = messages.slice(-3);
  const parts = [];
  for (const msg of recent) {
    if (msg.role === "user") {
      const content = typeof msg.content === "string" ? msg.content : msg.content?.map((p) => p.type === "text" ? p.text : "").join(" ") || "";
      if (content) parts.push(content.slice(0, 200));
    }
  }
  return parts.join(" ").trim();
}
function formatMemoriesForPrompt(memories) {
  if (memories.length === 0) return "";
  const lines = memories.map((m) => {
    const prefix = m.source === "user" ? "" : "(inferred) ";
    return `- ${prefix}${m.content}`;
  });
  return `## User Context (from memory)
${lines.join("\n")}`;
}
function validateCategory(cat) {
  const valid = ["fact", "preference", "instruction", "context"];
  if (typeof cat === "string" && valid.includes(cat)) {
    return cat;
  }
  return "fact";
}
function validateMemoryType(type) {
  const valid = ["episodic", "semantic", "procedural", "working"];
  if (typeof type === "string" && valid.includes(type)) {
    return type;
  }
  return void 0;
}
function validatePersistenceLevel(level) {
  const valid = ["ephemeral", "shortTerm", "longTerm"];
  if (typeof level === "string" && valid.includes(level)) {
    return level;
  }
  return void 0;
}
function parseJSONFromLLM(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
      }
    }
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {
      }
    }
    return null;
  }
}

// src/context/adapters/in-memory-store.ts
var InMemoryStore = class {
  entries = /* @__PURE__ */ new Map();
  async save(entry) {
    this.entries.set(entry.id, { ...entry });
  }
  async get(id) {
    return this.entries.get(id) ?? null;
  }
  async delete(id) {
    this.entries.delete(id);
  }
  async listByUser(userId, options) {
    let results = Array.from(this.entries.values()).filter((e) => e.userId === userId);
    if (options?.category) {
      results = results.filter((e) => e.category === options.category);
    }
    results.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
    if (options?.limit) {
      results = results.slice(0, options.limit);
    }
    return results;
  }
  async search(userId, query, limit = 10) {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);
    const scored = Array.from(this.entries.values()).filter((e) => e.userId === userId).map((entry) => {
      const contentLower = entry.content.toLowerCase();
      let score = 0;
      if (contentLower.includes(queryLower)) {
        score += 10;
      }
      for (const word of queryWords) {
        if (contentLower.includes(word)) {
          score += 2;
        }
      }
      score *= entry.confidence;
      const ageMs = Date.now() - entry.lastAccessedAt;
      const ageDays = ageMs / (1e3 * 60 * 60 * 24);
      score *= Math.max(0.5, 1 - ageDays / 365);
      return { entry, score };
    }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, limit);
    return scored.map(({ entry }) => entry);
  }
  /** Clear all entries (for testing) */
  clear() {
    this.entries.clear();
  }
  /** Get total entry count */
  get size() {
    return this.entries.size;
  }
};
var InMemoryVectorStore = class {
  vectors = /* @__PURE__ */ new Map();
  async upsert(entries) {
    for (const entry of entries) {
      this.vectors.set(entry.id, {
        vector: entry.vector,
        metadata: entry.metadata
      });
    }
  }
  async query(vector, topK, filter) {
    const results = [];
    for (const [id, stored] of this.vectors) {
      if (filter) {
        let matches = true;
        for (const [key, value] of Object.entries(filter)) {
          if (stored.metadata[key] !== value) {
            matches = false;
            break;
          }
        }
        if (!matches) continue;
      }
      const score = cosineSimilarity(vector, stored.vector);
      results.push({ id, score, metadata: stored.metadata });
    }
    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }
  async delete(ids) {
    for (const id of ids) {
      this.vectors.delete(id);
    }
  }
  /** Clear all vectors (for testing) */
  clear() {
    this.vectors.clear();
  }
  /** Get total vector count */
  get size() {
    return this.vectors.size;
  }
};
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

// src/context/memory-tools.ts
function createMemoryTools(workingMemory, stores) {
  return [
    {
      name: "remember",
      description: "Store an important fact, preference, or instruction about the user for future conversations. Use this proactively when the user shares personal information, preferences, or important context.",
      parameters: {
        type: "object",
        properties: {
          content: {
            type: "string",
            description: "The information to remember"
          },
          category: {
            type: "string",
            enum: ["fact", "preference", "instruction", "context"],
            description: "Category of memory: fact (personal info), preference (likes/dislikes), instruction (how-to), context (situational)"
          }
        },
        required: ["content"]
      },
      execute: async (args, ctx) => {
        const entry = await workingMemory.remember(
          ctx.userId,
          args.content,
          args.category || void 0,
          ctx.conversationId
        );
        return { success: true, id: entry.id, content: entry.content, category: entry.category };
      }
    },
    {
      name: "recall",
      description: "Search your memories about the user. Use this to retrieve previously stored information before answering questions that might depend on user context.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find relevant memories"
          },
          limit: {
            type: "number",
            description: "Maximum number of memories to return (default: 10)"
          }
        },
        required: ["query"]
      },
      execute: async (args, ctx) => {
        const memories = await workingMemory.recall(
          ctx.userId,
          args.query,
          args.limit || 10
        );
        return {
          success: true,
          count: memories.length,
          memories: memories.map((m) => ({
            id: m.id,
            content: m.content,
            category: m.category,
            confidence: m.confidence,
            createdAt: m.createdAt
          }))
        };
      }
    },
    {
      name: "update_memory",
      description: "Update an existing memory with corrected or updated information. Finds the closest matching memory and replaces it.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find the memory to update"
          },
          newContent: {
            type: "string",
            description: "The updated memory content"
          },
          category: {
            type: "string",
            enum: ["fact", "preference", "instruction", "context"],
            description: "Updated category (optional)"
          }
        },
        required: ["query", "newContent"]
      },
      execute: async (args, ctx) => {
        const matches = await workingMemory.recall(ctx.userId, args.query, 1);
        if (matches.length === 0) {
          const entry2 = await workingMemory.remember(
            ctx.userId,
            args.newContent,
            args.category || void 0,
            ctx.conversationId
          );
          return { success: true, action: "created", id: entry2.id, content: entry2.content };
        }
        const old = matches[0];
        if (stores?.memory) {
          await stores.memory.delete(old.id);
        }
        if (stores?.vector) {
          try {
            await stores.vector.delete([old.id]);
          } catch {
          }
        }
        const entry = await workingMemory.remember(
          ctx.userId,
          args.newContent,
          args.category || old.category,
          ctx.conversationId
        );
        return {
          success: true,
          action: "updated",
          oldId: old.id,
          newId: entry.id,
          oldContent: old.content,
          newContent: entry.content
        };
      }
    },
    {
      name: "forget",
      description: "Delete a specific memory. Use this when the user asks you to forget something or when information is no longer relevant.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query to find the memory to delete"
          }
        },
        required: ["query"]
      },
      execute: async (args, ctx) => {
        const matches = await workingMemory.recall(ctx.userId, args.query, 1);
        if (matches.length === 0) {
          return { success: false, message: "No matching memory found" };
        }
        const target = matches[0];
        if (stores?.memory) {
          await stores.memory.delete(target.id);
        }
        if (stores?.vector) {
          try {
            await stores.vector.delete([target.id]);
          } catch {
          }
        }
        return { success: true, deletedId: target.id, deletedContent: target.content };
      }
    }
  ];
}

// src/handler.ts
async function initializeSage(config, options = {}) {
  let streamStore;
  if (config.streaming?.type === "redis") {
    streamStore = createRedisStreamStore(config.streaming.url, {
      keyPrefix: config.streaming.keyPrefix,
      defaultTtl: config.streaming.ttl
    });
  } else {
    streamStore = createMemoryStreamStore();
  }
  const tools = createToolRegistry();
  if (config.tools) {
    for (const tool of config.tools) {
      if (typeof tool === "object" && "name" in tool) {
        tools.register(tool);
      }
    }
  }
  let repositories;
  if (config.database?.type === "convex" && options.convexClient) {
    repositories = createConvexRepositories(options.convexClient);
  } else {
    repositories = createMemoryRepositories();
  }
  let workingMemory;
  let memoryStore;
  let vectorStore;
  let contextConfig;
  if (config.context?.workingMemory?.enabled) {
    memoryStore = options.memoryStore ?? new InMemoryStore();
    vectorStore = options.vectorStore;
    workingMemory = createWorkingMemory({
      enabled: true,
      autoExtract: config.context.workingMemory.autoExtract ?? true,
      extractionModel: config.context.workingMemory.extractionModel,
      maxMemoriesInPrompt: config.context.workingMemory.maxMemoriesInPrompt,
      store: memoryStore,
      embeddings: options.embeddings,
      vectorStore,
      provider: config.provider?.apiKey ? {
        apiKey: config.provider.apiKey,
        baseUrl: config.provider.baseUrl || "https://api.openai.com/v1"
      } : void 0
    });
    const memTools = createMemoryTools(workingMemory, {
      memory: memoryStore,
      vector: vectorStore
    });
    for (const tool of memTools) {
      tools.register(tool);
    }
  }
  if (config.context?.enabled) {
    contextConfig = {
      model: config.model ?? "gpt-4o",
      contextWindow: config.context.contextWindow,
      maxResponseTokens: config.context.maxResponseTokens ?? config.maxTokens ?? 4096,
      workingMemory,
      summary: config.context.summary?.enabled && config.provider?.apiKey ? {
        model: config.context.summary.model,
        targetTokens: config.context.summary.targetTokens,
        provider: {
          apiKey: config.provider.apiKey,
          baseUrl: config.provider.baseUrl || "https://api.openai.com/v1"
        }
      } : void 0
    };
  }
  return {
    config,
    streamStore,
    tools,
    repositories,
    workingMemory,
    memoryStore,
    vectorStore,
    contextConfig
  };
}
function createChatHandler(config, options = {}) {
  let context = null;
  return async function handler(request) {
    if (!context) {
      context = await initializeSage(config, options);
    }
    try {
      const body = await request.json();
      const { conversationId, message, userId, attachments } = body;
      if (!conversationId || !message || !userId) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: conversationId, message, userId" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const existingMessages = await context.repositories.messages.getByConversation(conversationId);
      const userMessage = {
        role: "user",
        content: message
      };
      if (attachments && attachments.length > 0) {
        userMessage.content = [
          { type: "text", text: message },
          ...attachments.map((a) => ({
            type: a.type,
            imageUrl: a.type === "image" ? a.url : void 0,
            fileUrl: a.type !== "image" ? a.url : void 0
          }))
        ];
      }
      await context.repositories.messages.create({
        conversationId,
        role: "user",
        content: message,
        attachments: attachments?.map((a) => ({
          type: a.type,
          url: a.url,
          name: a.name
        }))
      });
      const messages = [
        ...existingMessages.map((m) => ({
          role: m.role,
          content: m.content,
          toolCalls: m.toolCalls,
          toolCallId: m.toolCallId,
          reasoning: m.reasoning
        })),
        userMessage
      ];
      const systemPrompt = buildSystemPrompt({
        agentName: config.agent?.name,
        basePrompt: config.agent?.systemPrompt,
        hasMemoryTools: !!context.workingMemory
      });
      const { sessionId, streamId, result } = await createSession({
        conversationId,
        userId,
        systemPrompt,
        messages,
        tools: context.tools,
        streamStore: context.streamStore,
        config: context.config,
        sessionRepository: context.repositories.sessions,
        messageRepository: context.repositories.messages,
        workingMemory: context.workingMemory,
        contextConfig: context.contextConfig
      });
      result.catch((err) => {
        console.error("[SAGE] Session error:", err);
      });
      return new Response(
        JSON.stringify({
          sessionId,
          streamId,
          conversationId
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("[SAGE] Handler error:", error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}
function createStreamHandler(config, options = {}) {
  let context = null;
  return async function handler(request) {
    if (!context) {
      context = await initializeSage(config, options);
    }
    try {
      const url = new URL(request.url);
      const streamId = url.searchParams.get("streamId");
      const cursor = url.searchParams.get("cursor") || "0";
      const count = parseInt(url.searchParams.get("count") || "100", 10);
      if (!streamId) {
        return new Response(
          JSON.stringify({ error: "Missing streamId parameter" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
      const entries = await context.streamStore.read(streamId, cursor, count);
      const meta = await context.streamStore.getMeta(streamId);
      const lastEntry = entries[entries.length - 1];
      const isDone = lastEntry?.data.type === "status" && ["completed", "failed", "cancelled"].includes(lastEntry.data.status || "");
      return new Response(
        JSON.stringify({
          chunks: entries.map((e) => ({
            id: e.id,
            ...e.data
          })),
          cursor: lastEntry?.id || cursor,
          done: isDone,
          status: meta?.status || "unknown"
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("[SAGE] Stream handler error:", error);
      return new Response(
        JSON.stringify({ error: error instanceof Error ? error.message : "Internal error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
  };
}

// src/providers/config.ts
var ENV_KEYS = {
  API_KEY: ["OPENAI_API_KEY", "SAGE_API_KEY", "LLM_API_KEY"],
  API_BASE: ["OPENAI_API_BASE", "OPENAI_BASE_URL", "SAGE_API_BASE", "LLM_API_BASE"],
  MODEL: ["DEFAULT_MODEL", "SAGE_MODEL", "LLM_MODEL"],
  TEMPERATURE: ["DEFAULT_TEMPERATURE", "SAGE_TEMPERATURE"],
  MAX_TOKENS: ["DEFAULT_MAX_TOKENS", "SAGE_MAX_TOKENS"],
  REASONING_EFFORT: ["DEFAULT_EFFORT_LEVEL", "SAGE_REASONING_EFFORT"],
  ENABLE_REASONING: ["ENABLE_REASONING_EFFORT"]
};
function getEnv(keys, defaultValue = "") {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return defaultValue;
}
function loadProviderConfig(overrides) {
  const config = {
    apiKey: getEnv(ENV_KEYS.API_KEY),
    baseUrl: getEnv(ENV_KEYS.API_BASE) || void 0,
    model: getEnv(ENV_KEYS.MODEL, "gpt-4o"),
    temperature: parseFloat(getEnv(ENV_KEYS.TEMPERATURE, "0.7")),
    maxTokens: parseInt(getEnv(ENV_KEYS.MAX_TOKENS, "4096"), 10),
    enableReasoningEffort: getEnv(ENV_KEYS.ENABLE_REASONING) !== "false",
    reasoningEffort: getEnv(ENV_KEYS.REASONING_EFFORT, "medium")
  };
  if (overrides) {
    return { ...config, ...overrides };
  }
  return config;
}
function validateProviderConfig(config) {
  if (!config.apiKey) {
    throw new Error("Provider API key is required. Set OPENAI_API_KEY or SAGE_API_KEY environment variable.");
  }
  if (config.temperature !== void 0 && (config.temperature < 0 || config.temperature > 2)) {
    throw new Error("Temperature must be between 0 and 2");
  }
  if (config.maxTokens !== void 0 && config.maxTokens < 1) {
    throw new Error("Max tokens must be at least 1");
  }
}
function getDefaultBaseUrl(provider) {
  const providers = {
    openai: "https://api.openai.com/v1",
    anthropic: "https://api.anthropic.com",
    ollama: "http://localhost:11434/v1",
    "lm-studio": "http://localhost:1234/v1",
    openrouter: "https://openrouter.ai/api/v1",
    together: "https://api.together.xyz/v1",
    groq: "https://api.groq.com/openai/v1"
  };
  return providers[provider.toLowerCase()] || "https://api.openai.com/v1";
}
function detectProvider(config) {
  const key = config.apiKey;
  if (key.startsWith("sk-ant-")) return "anthropic";
  if (key.startsWith("sk-")) return "openai";
  if (key === "ollama") return "ollama";
  if (key === "lm-studio") return "lm-studio";
  const baseUrl = config.baseUrl?.toLowerCase() || "";
  if (baseUrl.includes("anthropic")) return "anthropic";
  if (baseUrl.includes("ollama") || baseUrl.includes("11434")) return "ollama";
  if (baseUrl.includes("1234")) return "lm-studio";
  if (baseUrl.includes("openrouter")) return "openrouter";
  if (baseUrl.includes("together")) return "together";
  if (baseUrl.includes("groq")) return "groq";
  return "openai";
}

// src/providers/responses-api.ts
function createResponsesAPIProvider() {
  return {
    name: "responses-api",
    async stream(messages, tools, config) {
      const baseUrl = config.baseUrl || "https://api.openai.com/v1";
      const input = normalizeMessages(messages);
      const body = {
        model: config.model,
        input,
        stream: true,
        temperature: config.temperature,
        max_output_tokens: config.maxTokens
      };
      if (tools.length > 0) {
        body.tools = tools.map((t) => ({
          type: "function",
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }));
      }
      if (config.enableReasoningEffort && config.reasoningEffort) {
        body.reasoning = {
          effort: config.reasoningEffort,
          summary: "auto"
        };
      }
      const response = await fetch(`${baseUrl}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
          "OpenAI-Beta": "responses=v1"
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Responses API error: ${response.status} - ${errorBody}`);
      }
      if (!response.body) {
        throw new Error("No response body");
      }
      return response.body;
    },
    async complete(messages, tools, config) {
      const baseUrl = config.baseUrl || "https://api.openai.com/v1";
      const input = normalizeMessages(messages);
      const body = {
        model: config.model,
        input,
        stream: false,
        temperature: config.temperature,
        max_output_tokens: config.maxTokens
      };
      if (tools.length > 0) {
        body.tools = tools.map((t) => ({
          type: "function",
          name: t.name,
          description: t.description,
          parameters: t.parameters
        }));
      }
      if (config.enableReasoningEffort && config.reasoningEffort) {
        body.reasoning = {
          effort: config.reasoningEffort,
          summary: "auto"
        };
      }
      const response = await fetch(`${baseUrl}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${config.apiKey}`,
          "OpenAI-Beta": "responses=v1"
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Responses API error: ${response.status} - ${errorBody}`);
      }
      const data = await response.json();
      return parseResponse(data);
    }
  };
}
function normalizeMessages(messages) {
  const result = [];
  for (const m of messages) {
    if (m.role === "tool") {
      result.push({
        type: "function_call_output",
        call_id: m.toolCallId || "",
        output: typeof m.content === "string" ? m.content : JSON.stringify(m.content)
      });
    } else if (m.role === "assistant" && m.toolCalls && m.toolCalls.length > 0) {
      if (m.content) {
        result.push({
          role: "assistant",
          content: normalizeContent(m.content)
        });
      }
      for (const tc of m.toolCalls) {
        result.push({
          type: "function_call",
          call_id: tc.id,
          name: tc.function.name,
          arguments: tc.function.arguments
        });
      }
    } else if (m.role === "system") {
    } else {
      result.push({
        role: m.role,
        content: normalizeContent(m.content)
      });
    }
  }
  return result;
}
function normalizeContent(content) {
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map((part) => {
      if (part.type === "text") {
        return { type: "input_text", text: part.text };
      } else if (part.type === "image") {
        return { type: "input_image", image_url: part.imageUrl };
      } else if (part.type === "file") {
        return { type: "input_file", file_url: part.fileUrl };
      }
      return { type: "input_text", text: "" };
    });
  }
  return "";
}
function parseResponse(data) {
  let content = "";
  let reasoning = "";
  const toolCalls = [];
  for (const item of data.output || []) {
    if (item.type === "message" && item.role === "assistant") {
      for (const part of item.content || []) {
        if (part.type === "output_text") {
          content += part.text;
        }
      }
    } else if (item.type === "function_call") {
      toolCalls.push({
        id: item.call_id,
        name: item.name,
        arguments: item.arguments
      });
    } else if (item.type === "reasoning") {
      for (const part of item.content || []) {
        if (part.type === "text") {
          reasoning += part.text;
        }
      }
    }
  }
  const hasToolCalls = toolCalls.length > 0;
  return {
    content,
    reasoning: reasoning || void 0,
    toolCalls,
    usage: {
      inputTokens: data.usage?.input_tokens || 0,
      outputTokens: data.usage?.output_tokens || 0
    },
    finishReason: hasToolCalls ? "tool_calls" : "stop"
  };
}
var responsesAPIProvider = createResponsesAPIProvider();

// src/auth/jwt.ts
var jose = __toESM(require("jose"));
function createJWTVerifier(key, options) {
  const opts = {
    algorithms: ["RS256", "ES256", "HS256"],
    clockTolerance: 60,
    ...options
  };
  return {
    /**
     * Verify a JWT token
     */
    async verify(token) {
      try {
        let verifyKey;
        switch (key.type) {
          case "secret":
            verifyKey = typeof key.value === "string" ? new TextEncoder().encode(key.value) : key.value;
            break;
          case "jwks": {
            const JWKS = jose.createRemoteJWKSet(new URL(key.url));
            const { payload: payload2 } = await jose.jwtVerify(token, JWKS, {
              issuer: opts.issuer,
              audience: opts.audience,
              clockTolerance: opts.clockTolerance,
              maxTokenAge: opts.maxTokenAge ? `${opts.maxTokenAge}s` : void 0
            });
            return { valid: true, payload: payload2 };
          }
          case "publicKey":
            verifyKey = await jose.importSPKI(key.value, opts.algorithms[0] || "RS256");
            break;
          case "privateKey":
            verifyKey = await jose.importPKCS8(key.value, opts.algorithms[0] || "RS256");
            break;
          default:
            return { valid: false, error: "Invalid key type" };
        }
        const { payload } = await jose.jwtVerify(token, verifyKey, {
          issuer: opts.issuer,
          audience: opts.audience,
          clockTolerance: opts.clockTolerance,
          maxTokenAge: opts.maxTokenAge ? `${opts.maxTokenAge}s` : void 0
        });
        return { valid: true, payload };
      } catch (error) {
        if (error instanceof jose.errors.JWTExpired) {
          return { valid: false, error: "Token expired" };
        }
        if (error instanceof jose.errors.JWTClaimValidationFailed) {
          return { valid: false, error: `Claim validation failed: ${error.message}` };
        }
        if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
          return { valid: false, error: "Invalid signature" };
        }
        return {
          valid: false,
          error: error instanceof Error ? error.message : "Token verification failed"
        };
      }
    }
  };
}
function createJWTSigner(key, algorithm = "HS256") {
  return {
    /**
     * Sign a payload to create a JWT
     */
    async sign(payload, options) {
      let signKey;
      switch (key.type) {
        case "secret":
          signKey = typeof key.value === "string" ? new TextEncoder().encode(key.value) : key.value;
          break;
        case "privateKey":
          signKey = await jose.importPKCS8(key.value, algorithm);
          break;
        default:
          throw new Error("Cannot sign with JWKS or public key");
      }
      const jwt = new jose.SignJWT(payload).setProtectedHeader({ alg: algorithm });
      if (options?.issuer) {
        jwt.setIssuer(options.issuer);
      }
      if (options?.audience) {
        jwt.setAudience(options.audience);
      }
      if (options?.expiresIn) {
        if (options.expiresIn < 0) {
          const expTime = Math.floor(Date.now() / 1e3) + options.expiresIn;
          jwt.setExpirationTime(expTime);
        } else {
          jwt.setExpirationTime(`${options.expiresIn}s`);
        }
      }
      if (options?.notBefore) {
        jwt.setNotBefore(`${options.notBefore}s`);
      }
      if (options?.jti) {
        jwt.setJti(options.jti);
      }
      jwt.setIssuedAt();
      return jwt.sign(signKey);
    }
  };
}
function decodeJWT(token) {
  try {
    const decoded = jose.decodeJwt(token);
    return decoded;
  } catch {
    return null;
  }
}
async function verifyJWT(token, secret, options) {
  const verifier = createJWTVerifier({ type: "secret", value: secret }, options);
  return verifier.verify(token);
}
async function signJWT(payload, secret, options) {
  const signer = createJWTSigner({ type: "secret", value: secret });
  return signer.sign(payload, options);
}
function createJWKSVerifier(jwksUrl, options) {
  return createJWTVerifier({ type: "jwks", url: jwksUrl }, options);
}

// src/auth/api-key.ts
var import_crypto4 = require("crypto");
var InMemoryAPIKeyStore = class {
  keys = /* @__PURE__ */ new Map();
  hashIndex = /* @__PURE__ */ new Map();
  async store(key) {
    this.keys.set(key.id, key);
    this.hashIndex.set(key.hash, key.id);
  }
  async findByHash(hash) {
    const id = this.hashIndex.get(hash);
    if (!id) return null;
    return this.keys.get(id) ?? null;
  }
  async findById(id) {
    return this.keys.get(id) ?? null;
  }
  async update(id, updates) {
    const key = this.keys.get(id);
    if (key) {
      this.keys.set(id, { ...key, ...updates });
    }
  }
  async revoke(id) {
    const key = this.keys.get(id);
    if (key) {
      key.revoked = true;
      this.keys.set(id, key);
    }
  }
  async listByUser(userId) {
    return Array.from(this.keys.values()).filter((k) => k.userId === userId && !k.revoked);
  }
};
var DEFAULT_CONFIG2 = {
  hashAlgorithm: "sha256",
  prefix: "sk_",
  keyLength: 32
};
function generateAPIKey(userId, name, permissions = [], options) {
  const config = { ...DEFAULT_CONFIG2, ...options };
  const keyBytes = (0, import_crypto4.randomBytes)(config.keyLength);
  const keyBase64 = keyBytes.toString("base64url");
  const fullKey = `${config.prefix}${keyBase64}`;
  const hash = hashAPIKey(fullKey, config.hashAlgorithm);
  const id = (0, import_crypto4.randomBytes)(16).toString("hex");
  const expiresAt = options?.expiresIn ? Date.now() + options.expiresIn * 1e3 : void 0;
  const record = {
    id,
    prefix: `${config.prefix}${keyBase64.slice(0, 8)}...`,
    hash,
    userId,
    name,
    permissions,
    expiresAt,
    createdAt: Date.now()
  };
  return { key: fullKey, record };
}
function hashAPIKey(key, algorithm = "sha256") {
  return (0, import_crypto4.createHash)(algorithm).update(key).digest("hex");
}
async function validateAPIKey(key, store, algorithm = "sha256") {
  const hash = hashAPIKey(key, algorithm);
  const record = await store.findByHash(hash);
  if (!record) {
    return { valid: false, error: "Invalid API key" };
  }
  if (record.revoked) {
    return { valid: false, error: "API key has been revoked" };
  }
  if (record.expiresAt && record.expiresAt < Date.now()) {
    return { valid: false, error: "API key has expired" };
  }
  await store.update(record.id, { lastUsedAt: Date.now() });
  return { valid: true, key: record };
}
function createAPIKeyAuth(store, config) {
  const hashAlgorithm = config?.hashAlgorithm ?? "sha256";
  return {
    /**
     * Generate a new API key
     */
    generate(userId, name, permissions = [], options) {
      const result = generateAPIKey(userId, name, permissions, { ...config, ...options });
      return store.store(result.record).then(() => result);
    },
    /**
     * Validate an API key from request
     */
    async validate(key) {
      return validateAPIKey(key, store, hashAlgorithm);
    },
    /**
     * Extract API key from request headers
     */
    extractFromRequest(request) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        if (token.startsWith(config?.prefix ?? "sk_")) {
          return token;
        }
      }
      const apiKeyHeader = request.headers.get("X-API-Key");
      if (apiKeyHeader) {
        return apiKeyHeader;
      }
      return null;
    },
    /**
     * Revoke an API key
     */
    revoke(keyId) {
      return store.revoke(keyId);
    },
    /**
     * List keys for a user
     */
    listKeys(userId) {
      return store.listByUser(userId);
    }
  };
}
function createAPIKeyMiddleware(store, config) {
  const auth = createAPIKeyAuth(store, config);
  return async (request) => {
    const key = auth.extractFromRequest(request);
    if (!key) {
      return { authenticated: false, error: "No API key provided" };
    }
    const result = await auth.validate(key);
    if (!result.valid || !result.key) {
      return { authenticated: false, error: result.error };
    }
    return {
      authenticated: true,
      userId: result.key.userId,
      permissions: result.key.permissions
    };
  };
}

// src/auth/rbac.ts
function createRBAC(config) {
  const roleMap = /* @__PURE__ */ new Map();
  const permissionCache = /* @__PURE__ */ new Map();
  for (const role of config.roles) {
    roleMap.set(role.name, role);
  }
  function getRolePermissions(roleName, visited = /* @__PURE__ */ new Set()) {
    const cached = permissionCache.get(roleName);
    if (cached) return cached;
    if (visited.has(roleName)) {
      return /* @__PURE__ */ new Set();
    }
    visited.add(roleName);
    const role = roleMap.get(roleName);
    if (!role) {
      return /* @__PURE__ */ new Set();
    }
    const permissions = new Set(role.permissions);
    if (role.inherits) {
      for (const inheritedRole of role.inherits) {
        const inheritedPerms = getRolePermissions(inheritedRole, visited);
        for (const perm of inheritedPerms) {
          permissions.add(perm);
        }
      }
    }
    permissionCache.set(roleName, permissions);
    return permissions;
  }
  function getUserPermissions(user) {
    const permissions = /* @__PURE__ */ new Set();
    if (config.superAdminRole && user.roles.includes(config.superAdminRole)) {
      permissions.add("*");
      return permissions;
    }
    for (const roleName of user.roles) {
      const rolePerms = getRolePermissions(roleName);
      for (const perm of rolePerms) {
        permissions.add(perm);
      }
    }
    if (user.permissions) {
      for (const perm of user.permissions) {
        permissions.add(perm);
      }
    }
    return permissions;
  }
  function hasPermission(user, permission) {
    const permissions = getUserPermissions(user);
    if (permissions.has("*")) {
      return true;
    }
    if (permissions.has(permission)) {
      return true;
    }
    const parts = permission.split(":");
    for (let i = parts.length - 1; i > 0; i--) {
      const wildcard = parts.slice(0, i).join(":") + ":*";
      if (permissions.has(wildcard)) {
        return true;
      }
    }
    return false;
  }
  function hasAllPermissions(user, permissions) {
    return permissions.every((p) => hasPermission(user, p));
  }
  function hasAnyPermission(user, permissions) {
    return permissions.some((p) => hasPermission(user, p));
  }
  function hasRole(user, roleName) {
    return user.roles.includes(roleName);
  }
  function hasAnyRole(user, roleNames) {
    return roleNames.some((r) => hasRole(user, r));
  }
  return {
    /**
     * Get all roles
     */
    getRoles() {
      return config.roles;
    },
    /**
     * Get a role by name
     */
    getRole(name) {
      return roleMap.get(name);
    },
    /**
     * Get the default role
     */
    getDefaultRole() {
      return config.defaultRole ? roleMap.get(config.defaultRole) : void 0;
    },
    /**
     * Get all permissions for a role
     */
    getRolePermissions,
    /**
     * Get all permissions for a user
     */
    getUserPermissions,
    /**
     * Check if user has permission
     */
    hasPermission,
    /**
     * Check if user has all permissions
     */
    hasAllPermissions,
    /**
     * Check if user has any permission
     */
    hasAnyPermission,
    /**
     * Check if user has role
     */
    hasRole,
    /**
     * Check if user has any role
     */
    hasAnyRole,
    /**
     * Require a permission (throws if denied)
     */
    requirePermission(user, permission) {
      if (!hasPermission(user, permission)) {
        throw new AuthorizationError(`Missing permission: ${permission}`, [permission]);
      }
    },
    /**
     * Require all permissions (throws if any denied)
     */
    requireAllPermissions(user, permissions) {
      const missing = permissions.filter((p) => !hasPermission(user, p));
      if (missing.length > 0) {
        throw new AuthorizationError(`Missing permissions: ${missing.join(", ")}`, missing);
      }
    },
    /**
     * Require any permission (throws if all denied)
     */
    requireAnyPermission(user, permissions) {
      if (!hasAnyPermission(user, permissions)) {
        throw new AuthorizationError(
          `Missing at least one of: ${permissions.join(", ")}`,
          permissions
        );
      }
    },
    /**
     * Require a role (throws if denied)
     */
    requireRole(user, roleName) {
      if (!hasRole(user, roleName)) {
        throw new AuthorizationError(`Missing role: ${roleName}`);
      }
    },
    /**
     * Require any role (throws if all denied)
     */
    requireAnyRole(user, roleNames) {
      if (!hasAnyRole(user, roleNames)) {
        throw new AuthorizationError(`Missing at least one role: ${roleNames.join(", ")}`);
      }
    },
    /**
     * Authorize with detailed result
     */
    authorize(user, permission) {
      if (hasPermission(user, permission)) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Permission denied",
        missingPermissions: [permission]
      };
    },
    /**
     * Clear the permission cache (call after role changes)
     */
    clearCache() {
      permissionCache.clear();
    }
  };
}
var AuthorizationError = class extends Error {
  missingPermissions;
  constructor(message, missingPermissions) {
    super(message);
    this.name = "AuthorizationError";
    this.missingPermissions = missingPermissions;
  }
};
var Permissions = {
  // Resource CRUD pattern
  create: (resource) => `${resource}:create`,
  read: (resource) => `${resource}:read`,
  update: (resource) => `${resource}:update`,
  delete: (resource) => `${resource}:delete`,
  list: (resource) => `${resource}:list`,
  all: (resource) => `${resource}:*`,
  // Common permissions
  ADMIN: "admin",
  SUPER_ADMIN: "*"
};
function defineRole(name, permissions, options) {
  return {
    name,
    permissions,
    description: options?.description,
    inherits: options?.inherits
  };
}
function createCommonRoles() {
  return {
    viewer: defineRole("viewer", [
      Permissions.read("*"),
      Permissions.list("*")
    ], { description: "Can view all resources" }),
    editor: defineRole("editor", [
      Permissions.create("*"),
      Permissions.update("*")
    ], {
      description: "Can create and edit resources",
      inherits: ["viewer"]
    }),
    admin: defineRole("admin", [
      Permissions.delete("*"),
      "admin"
    ], {
      description: "Full access to all resources",
      inherits: ["editor"]
    }),
    superAdmin: defineRole("super_admin", ["*"], {
      description: "Super administrator with all permissions"
    })
  };
}

// src/auth/rate-limiter.ts
var InMemoryRateLimitStore = class {
  windows = /* @__PURE__ */ new Map();
  cleanupInterval = null;
  constructor(cleanupIntervalMs = 6e4) {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, window] of this.windows) {
        if (window.resetAt < now) {
          this.windows.delete(key);
        }
      }
    }, cleanupIntervalMs);
  }
  async increment(key, windowMs) {
    const now = Date.now();
    const existing = this.windows.get(key);
    if (existing && existing.resetAt > now) {
      existing.count++;
      return { count: existing.count, resetAt: existing.resetAt };
    }
    const newWindow = { count: 1, resetAt: now + windowMs };
    this.windows.set(key, newWindow);
    return newWindow;
  }
  async get(key) {
    const window = this.windows.get(key);
    if (!window || window.resetAt < Date.now()) {
      return null;
    }
    return window;
  }
  async reset(key) {
    this.windows.delete(key);
  }
  /**
   * Stop the cleanup interval
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
};
function defaultKeyGenerator(context) {
  if (context.userId) {
    return `user:${context.userId}`;
  }
  if (context.apiKeyId) {
    return `apikey:${context.apiKeyId}`;
  }
  if (context.ip) {
    return `ip:${context.ip}`;
  }
  return "global";
}
function createRateLimiter(config) {
  const store = config.store ?? new InMemoryRateLimitStore();
  const keyGenerator = config.keyGenerator ?? defaultKeyGenerator;
  return {
    /**
     * Check and consume a request
     */
    async check(context) {
      if (config.skip) {
        const shouldSkip = await config.skip(context);
        if (shouldSkip) {
          return {
            allowed: true,
            remaining: config.maxRequests,
            limit: config.maxRequests,
            resetIn: config.windowMs,
            resetAt: Date.now() + config.windowMs,
            current: 0
          };
        }
      }
      const key = keyGenerator(context);
      const { count, resetAt } = await store.increment(key, config.windowMs);
      const result = {
        allowed: count <= config.maxRequests,
        remaining: Math.max(0, config.maxRequests - count),
        limit: config.maxRequests,
        resetIn: Math.max(0, resetAt - Date.now()),
        resetAt,
        current: count
      };
      if (!result.allowed && config.onRateLimitExceeded) {
        config.onRateLimitExceeded(context, result);
      }
      return result;
    },
    /**
     * Get current state without consuming
     */
    async peek(context) {
      const key = keyGenerator(context);
      const state = await store.get(key);
      if (!state) {
        return {
          allowed: true,
          remaining: config.maxRequests,
          limit: config.maxRequests,
          resetIn: config.windowMs,
          resetAt: Date.now() + config.windowMs,
          current: 0
        };
      }
      return {
        allowed: state.count < config.maxRequests,
        remaining: Math.max(0, config.maxRequests - state.count),
        limit: config.maxRequests,
        resetIn: Math.max(0, state.resetAt - Date.now()),
        resetAt: state.resetAt,
        current: state.count
      };
    },
    /**
     * Reset rate limit for a context
     */
    async reset(context) {
      const key = keyGenerator(context);
      await store.reset(key);
    },
    /**
     * Get the underlying store
     */
    getStore() {
      return store;
    }
  };
}
function createRateLimitMiddleware(config) {
  const limiter = createRateLimiter(config);
  return async (request, context) => {
    const fullContext = {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? void 0,
      path: new URL(request.url).pathname,
      method: request.method,
      ...context
    };
    const result = await limiter.check(fullContext);
    const headers = {
      "X-RateLimit-Limit": String(result.limit),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1e3))
    };
    if (!result.allowed) {
      headers["Retry-After"] = String(Math.ceil(result.resetIn / 1e3));
      return {
        allowed: false,
        headers,
        response: new Response(
          JSON.stringify({
            error: "Rate limit exceeded",
            retryAfter: Math.ceil(result.resetIn / 1e3)
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              ...headers
            }
          }
        )
      };
    }
    return { allowed: true, headers };
  };
}
var RateLimitPresets = {
  /** Standard API rate limit: 100 requests per minute */
  standard: {
    maxRequests: 100,
    windowMs: 60 * 1e3
  },
  /** Strict rate limit: 10 requests per minute */
  strict: {
    maxRequests: 10,
    windowMs: 60 * 1e3
  },
  /** Lenient rate limit: 1000 requests per minute */
  lenient: {
    maxRequests: 1e3,
    windowMs: 60 * 1e3
  },
  /** Auth endpoints: 5 requests per minute */
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1e3
  },
  /** Chat/AI endpoints: 20 requests per minute */
  chat: {
    maxRequests: 20,
    windowMs: 60 * 1e3
  }
};

// src/auth/server.ts
function createAuthConfig(config) {
  const {
    databaseUrl,
    siteUrl,
    audience = "sage",
    sessionExpiry = 60 * 60 * 24 * 7,
    // 7 days
    emailPassword = true,
    google
  } = config;
  const authConfig = {
    database: {
      type: "postgres",
      url: databaseUrl
    },
    emailAndPassword: {
      enabled: emailPassword,
      requireEmailVerification: true
    },
    session: {
      expiresIn: sessionExpiry,
      updateAge: 60 * 60 * 24,
      // Refresh daily
      freshAge: 60 * 5
      // 5 min sensitive age
    },
    plugins: [],
    advanced: {
      cookiePrefix: "sage-auth"
    }
  };
  const jwtConfig = {
    audience,
    issuer: siteUrl || process.env.SITE_URL || "http://localhost:3000",
    expiresIn: 60 * 15
    // 15 min JWT expiry
  };
  authConfig.jwt = jwtConfig;
  if (google) {
    authConfig.socialProviders = {
      google: {
        clientId: google.clientId,
        clientSecret: google.clientSecret
      }
    };
  }
  return authConfig;
}
async function getUserFromToken(auth, headers) {
  try {
    const result = await auth.api.getSession({ headers });
    return result;
  } catch {
    return null;
  }
}
function requireAuth(result) {
  if (!result) {
    throw new Error("Unauthorized");
  }
  return result;
}
var AUTH_ENV_VARS = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "SITE_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET"
];
function validateAuthEnv() {
  const missing = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL");
  if (!process.env.BETTER_AUTH_SECRET) missing.push("BETTER_AUTH_SECRET");
  return {
    valid: missing.length === 0,
    missing
  };
}

// src/auth/client.ts
function createAuthClientConfig(config) {
  return {
    baseURL: config?.baseUrl || ""
  };
}

// src/auth/middleware.ts
function defaultAuthErrorResponse(error) {
  return new Response(
    JSON.stringify({ error: "Unauthorized", message: error }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}
function withAuth(handler, options) {
  const { middleware, optional = false, onAuthError = defaultAuthErrorResponse } = options;
  return async function authHandler(request) {
    const authResult = await middleware(request);
    if (!authResult.authenticated || !authResult.user) {
      if (optional) {
        return handler(request, { id: "anonymous" });
      }
      return onAuthError(authResult.error || "Authentication required");
    }
    return handler(request, authResult.user);
  };
}
function extractBearerToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}
function extractSessionCookie(request, cookieName = "sage-auth.session_token") {
  const cookieHeader = request.headers.get("Cookie");
  if (!cookieHeader) {
    return null;
  }
  const cookies = parseCookies(cookieHeader);
  return cookies[cookieName] || null;
}
function parseCookies(cookieHeader) {
  const cookies = {};
  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split("=");
    if (name && rest.length > 0) {
      cookies[name] = rest.join("=");
    }
  }
  return cookies;
}
function createJWTMiddleware(options) {
  const { secret, issuer, audience } = options;
  return async (request) => {
    const token = extractBearerToken(request);
    if (!token) {
      return { authenticated: false, error: "No authorization token provided" };
    }
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        return { authenticated: false, error: "Invalid token format" };
      }
      const payloadStr = Buffer.from(parts[1], "base64url").toString("utf-8");
      const payload = JSON.parse(payloadStr);
      if (payload.exp && payload.exp < Date.now() / 1e3) {
        return { authenticated: false, error: "Token expired" };
      }
      if (issuer && payload.iss !== issuer) {
        return { authenticated: false, error: "Invalid issuer" };
      }
      if (audience && payload.aud !== audience) {
        return { authenticated: false, error: "Invalid audience" };
      }
      console.warn("[SAGE] JWT middleware: Signature verification not implemented. Use Better Auth adapter for production.");
      return {
        authenticated: true,
        user: {
          id: payload.sub,
          email: payload.email,
          name: payload.name
        }
      };
    } catch (error) {
      return {
        authenticated: false,
        error: `Token validation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  };
}
function createNoopAuthMiddleware(mockUser) {
  return async () => {
    return {
      authenticated: true,
      user: mockUser
    };
  };
}

// src/auth/better-auth.ts
function createBetterAuthMiddleware(auth, options = {}) {
  const {
    cookieName = "sage-auth.session_token",
    allowBearerToken = true
  } = options;
  return async (request) => {
    try {
      const headers = new Headers();
      const sessionCookie = extractSessionCookie(request, cookieName);
      if (sessionCookie) {
        headers.set("Cookie", request.headers.get("Cookie") || "");
      }
      if (allowBearerToken && !sessionCookie) {
        const authHeader = request.headers.get("Authorization");
        if (authHeader) {
          headers.set("Authorization", authHeader);
        }
      }
      const result = await auth.api.getSession({ headers });
      if (!result || !result.user) {
        return {
          authenticated: false,
          error: "Invalid or expired session"
        };
      }
      const user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      };
      return {
        authenticated: true,
        user,
        session: result.session
      };
    } catch (error) {
      return {
        authenticated: false,
        error: `Auth validation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      };
    }
  };
}
async function getCurrentUser(auth, request) {
  const middleware = createBetterAuthMiddleware(auth);
  const result = await middleware(request);
  return result.authenticated ? result.user || null : null;
}
async function requireUser(auth, request) {
  const user = await getCurrentUser(auth, request);
  if (!user) {
    throw new Error("Unauthorized: Authentication required");
  }
  return user;
}

// src/context/consolidation.ts
var import_crypto5 = require("crypto");
async function consolidateMemories(userId, stores, config) {
  const threshold = config?.similarityThreshold ?? 0.85;
  const promotionAccess = config?.promotionAccessThreshold ?? 3;
  const result = {
    merged: 0,
    conflicts: 0,
    promoted: 0,
    compressed: 0,
    details: []
  };
  const allMemories = await stores.memory.listByUser(userId);
  const active = allMemories.filter((m) => !m.supersededBy);
  for (const mem of active) {
    if (mem.persistenceLevel === "longTerm") continue;
    const shouldPromote = (mem.accessCount ?? 0) >= promotionAccess || mem.source === "user" || (mem.importance ?? 0) >= 0.9;
    if (shouldPromote) {
      const oldLevel = mem.persistenceLevel;
      mem.persistenceLevel = "longTerm";
      await stores.memory.save(mem);
      result.promoted++;
      result.details.push(`Promoted "${mem.content.slice(0, 40)}..." from ${oldLevel ?? "unset"} to longTerm`);
    } else if (mem.persistenceLevel === "ephemeral" && (mem.accessCount ?? 0) >= 1) {
      mem.persistenceLevel = "shortTerm";
      await stores.memory.save(mem);
      result.promoted++;
      result.details.push(`Promoted "${mem.content.slice(0, 40)}..." from ephemeral to shortTerm`);
    }
  }
  if (stores.embeddings && stores.vector) {
    const processed = /* @__PURE__ */ new Set();
    for (const mem of active) {
      if (processed.has(mem.id)) continue;
      if (!mem.embedding) continue;
      const similar = await stores.vector.query(mem.embedding, 5, { userId });
      const candidates = similar.filter(
        (s) => s.id !== mem.id && s.score >= threshold && !processed.has(s.id)
      );
      for (const candidate of candidates) {
        const other = await stores.memory.get(candidate.id);
        if (!other || other.supersededBy) continue;
        const [keep, discard] = selectKeepDiscard(mem, other);
        discard.supersededBy = keep.id;
        await stores.memory.save(discard);
        keep.accessCount = (keep.accessCount ?? 0) + (discard.accessCount ?? 0);
        keep.confidence = Math.max(keep.confidence, discard.confidence);
        keep.importance = Math.max(keep.importance ?? 0, discard.importance ?? 0);
        if (!keep.derivedFrom) keep.derivedFrom = [];
        keep.derivedFrom.push(discard.id);
        if (discard.entities && discard.entities.length > 0) {
          const entitySet = /* @__PURE__ */ new Set([...keep.entities ?? [], ...discard.entities]);
          keep.entities = Array.from(entitySet);
        }
        if (discard.tags && discard.tags.length > 0) {
          const tagSet = /* @__PURE__ */ new Set([...keep.tags ?? [], ...discard.tags]);
          keep.tags = Array.from(tagSet);
        }
        await stores.memory.save(keep);
        processed.add(discard.id);
        result.merged++;
        result.details.push(
          `Merged "${discard.content.slice(0, 30)}..." into "${keep.content.slice(0, 30)}..."`
        );
      }
      processed.add(mem.id);
    }
  }
  return result;
}
async function compressMemories(userId, stores, config) {
  const maxAgeDays = config?.maxAgeDays ?? 30;
  const provider = config?.provider;
  const model = config?.model ?? "gpt-4o";
  const now = Date.now();
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1e3;
  const result = { compressed: 0, details: [] };
  if (!provider) return result;
  const allMemories = await stores.memory.listByUser(userId);
  const episodic = allMemories.filter(
    (m) => !m.supersededBy && m.memoryType === "episodic" && m.persistenceLevel !== "longTerm" && now - m.createdAt > maxAgeMs
  );
  if (episodic.length < 3) return result;
  const groups = /* @__PURE__ */ new Map();
  for (const mem of episodic) {
    const key = mem.entities?.[0] ?? "general";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(mem);
  }
  for (const [key, group] of groups) {
    if (group.length < 2) continue;
    const memoriesList = group.map((m) => `- ${m.content}`).join("\n");
    const prompt = `Summarize these related memories into a single concise fact or semantic memory. Preserve key details.

Memories:
${memoriesList}

Return ONLY the summarized memory text, nothing else.`;
    try {
      const response = await fetch(`${provider.baseUrl}/responses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.apiKey}`,
          "OpenAI-Beta": "responses=v1"
        },
        body: JSON.stringify({
          model,
          input: [{ role: "user", content: prompt }],
          max_output_tokens: 200,
          temperature: 0.2,
          stream: false
        })
      });
      if (!response.ok) continue;
      const data = await response.json();
      if (!data.output_text) continue;
      const compressed = {
        id: (0, import_crypto5.randomUUID)(),
        userId,
        content: data.output_text.trim(),
        category: group[0].category,
        source: "system",
        confidence: Math.max(...group.map((m) => m.confidence)),
        createdAt: now,
        lastAccessedAt: now,
        memoryType: "semantic",
        importance: Math.max(...group.map((m) => m.importance ?? 0.5)),
        persistenceLevel: "shortTerm",
        entities: Array.from(new Set(group.flatMap((m) => m.entities ?? []))),
        derivedFrom: group.map((m) => m.id),
        version: 1,
        accessCount: 0
      };
      if (stores.embeddings) {
        try {
          compressed.embedding = await stores.embeddings.embed(compressed.content);
        } catch {
        }
      }
      await stores.memory.save(compressed);
      if (stores.vector && compressed.embedding) {
        try {
          await stores.vector.upsert([{
            id: compressed.id,
            vector: compressed.embedding,
            metadata: { userId, category: compressed.category, content: compressed.content }
          }]);
        } catch {
        }
      }
      for (const mem of group) {
        mem.supersededBy = compressed.id;
        await stores.memory.save(mem);
      }
      result.compressed += group.length;
      result.details.push(
        `Compressed ${group.length} memories about "${key}" into: "${compressed.content.slice(0, 50)}..."`
      );
    } catch {
    }
  }
  return result;
}
function selectKeepDiscard(a, b) {
  const scoreA = a.confidence + (a.importance ?? 0.5) + (a.accessCount ?? 0) * 0.1;
  const scoreB = b.confidence + (b.importance ?? 0.5) + (b.accessCount ?? 0) * 0.1;
  const userBoostA = a.source === "user" ? 1 : 0;
  const userBoostB = b.source === "user" ? 1 : 0;
  return scoreA + userBoostA >= scoreB + userBoostB ? [a, b] : [b, a];
}

// src/context/decay.ts
function calculateDecayScore(entry, config) {
  const halfLifeDays = config?.halfLifeDays ?? 180;
  const now = Date.now();
  const ageDays = (now - entry.lastAccessedAt) / (1e3 * 60 * 60 * 24);
  const decayFactor = Math.exp(-ageDays / (halfLifeDays * 1.44));
  let score = entry.confidence * decayFactor;
  if (entry.persistenceLevel === "longTerm") {
    score = entry.confidence * Math.exp(-ageDays / (halfLifeDays * 4 * 1.44));
  } else if (entry.persistenceLevel === "ephemeral") {
    score = entry.confidence * Math.exp(-ageDays / (halfLifeDays * 0.25 * 1.44));
  }
  const accessBoost = Math.min(0.2, (entry.accessCount ?? 0) * 0.02);
  score += accessBoost;
  return Math.max(0, Math.min(1, score));
}
async function pruneMemories(userId, stores, config) {
  const minConfidence = config?.minConfidence ?? 0.3;
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1e3;
  const result = { pruned: 0, expired: 0, details: [] };
  const toDelete = [];
  const allMemories = await stores.memory.listByUser(userId);
  for (const mem of allMemories) {
    if (mem.supersededBy) continue;
    const decayScore = calculateDecayScore(mem, config);
    const ageDays = (now - mem.lastAccessedAt) / DAY;
    let shouldPrune = false;
    let reason = "";
    if (mem.expiresAt) {
      const graceMs = (config?.expirationGracePeriodHours ?? 24) * 60 * 60 * 1e3;
      if (now > mem.expiresAt + graceMs) {
        shouldPrune = true;
        reason = "expired";
        result.expired++;
      }
    }
    if (!shouldPrune) {
      switch (mem.persistenceLevel) {
        case "longTerm":
          break;
        case "shortTerm":
          if (decayScore < minConfidence && ageDays > 90) {
            shouldPrune = true;
            reason = `shortTerm decay (score=${decayScore.toFixed(2)}, age=${ageDays.toFixed(0)}d)`;
          }
          break;
        case "ephemeral":
          if (decayScore < 0.5 || ageDays > 30) {
            shouldPrune = true;
            reason = `ephemeral decay (score=${decayScore.toFixed(2)}, age=${ageDays.toFixed(0)}d)`;
          }
          break;
        default:
          if (decayScore < minConfidence && ageDays > 90) {
            shouldPrune = true;
            reason = `unclassified decay (score=${decayScore.toFixed(2)}, age=${ageDays.toFixed(0)}d)`;
          }
          break;
      }
    }
    if (shouldPrune) {
      toDelete.push(mem.id);
      result.details.push(`Pruned "${mem.content.slice(0, 40)}..." \u2014 ${reason}`);
    }
  }
  for (const id of toDelete) {
    await stores.memory.delete(id);
  }
  if (stores.vector && toDelete.length > 0) {
    try {
      await stores.vector.delete(toDelete);
    } catch {
    }
  }
  result.pruned = toDelete.length;
  return result;
}
async function checkExpirations(userId, stores, config) {
  const graceMs = (config?.expirationGracePeriodHours ?? 24) * 60 * 60 * 1e3;
  const now = Date.now();
  const allMemories = await stores.memory.listByUser(userId);
  const expired = allMemories.filter(
    (m) => m.expiresAt && now > m.expiresAt + graceMs && !m.supersededBy
  );
  for (const mem of expired) {
    await stores.memory.delete(mem.id);
  }
  if (stores.vector && expired.length > 0) {
    try {
      await stores.vector.delete(expired.map((m) => m.id));
    } catch {
    }
  }
  return expired.length;
}

// src/context/analytics.ts
function calculateMemoryStats(memories) {
  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1e3;
  const active = memories.filter((m) => !m.supersededBy);
  const superseded = memories.length - active.length;
  const byType = {};
  const byCategory = {};
  const byPersistence = {};
  const bySource = {};
  let totalConfidence = 0;
  let totalAge = 0;
  let expiringSoon = 0;
  let recentlyAccessed = 0;
  for (const mem of active) {
    const type = mem.memoryType ?? "unclassified";
    byType[type] = (byType[type] ?? 0) + 1;
    byCategory[mem.category] = (byCategory[mem.category] ?? 0) + 1;
    const persistence = mem.persistenceLevel ?? "unclassified";
    byPersistence[persistence] = (byPersistence[persistence] ?? 0) + 1;
    bySource[mem.source] = (bySource[mem.source] ?? 0) + 1;
    totalConfidence += mem.confidence;
    totalAge += now - mem.createdAt;
    if (mem.expiresAt && mem.expiresAt - now < WEEK && mem.expiresAt > now) {
      expiringSoon++;
    }
    if (now - mem.lastAccessedAt < WEEK) {
      recentlyAccessed++;
    }
  }
  const total = active.length;
  const avgAgeDays = total > 0 ? totalAge / total / (24 * 60 * 60 * 1e3) : 0;
  return {
    total,
    byType,
    byCategory,
    byPersistence,
    averageConfidence: total > 0 ? totalConfidence / total : 0,
    averageAge: avgAgeDays,
    expiringSoon,
    recentlyAccessed,
    bySource,
    superseded
  };
}

// src/context/memory-api.ts
function createMemoryAPIHandler(config) {
  const { workingMemory, memoryStore, vectorStore, embeddings } = config;
  return {
    /** List memories with optional filtering */
    async list(userId, filters) {
      let memories = await memoryStore.listByUser(userId, {
        category: filters?.category,
        limit: filters?.limit
      });
      if (filters?.memoryType) {
        memories = memories.filter((m) => m.memoryType === filters.memoryType);
      }
      if (filters?.persistenceLevel) {
        memories = memories.filter((m) => m.persistenceLevel === filters.persistenceLevel);
      }
      memories = memories.filter((m) => !m.supersededBy);
      return memories;
    },
    /** Get a single memory by ID */
    async get(id) {
      return memoryStore.get(id);
    },
    /** Update a memory entry */
    async update(id, updates) {
      const existing = await memoryStore.get(id);
      if (!existing) return null;
      const updated = {
        ...existing,
        ...updates,
        id: existing.id,
        // Prevent ID override
        userId: existing.userId,
        // Prevent userId override
        version: (existing.version ?? 1) + 1
      };
      await memoryStore.save(updated);
      if (updates.content && updates.content !== existing.content && embeddings && vectorStore) {
        try {
          const embedding = await embeddings.embed(updated.content);
          updated.embedding = embedding;
          await memoryStore.save(updated);
          await vectorStore.upsert([{
            id: updated.id,
            vector: embedding,
            metadata: {
              userId: updated.userId,
              category: updated.category,
              content: updated.content
            }
          }]);
        } catch {
        }
      }
      return updated;
    },
    /** Delete a memory */
    async delete(id) {
      await memoryStore.delete(id);
      if (vectorStore) {
        try {
          await vectorStore.delete([id]);
        } catch {
        }
      }
    },
    /** Export all memories for a user */
    async export(userId) {
      return memoryStore.listByUser(userId);
    },
    /** Import memories for a user with deduplication */
    async import(userId, entries) {
      let imported = 0;
      const existing = await memoryStore.listByUser(userId);
      const existingContents = new Set(existing.map((e) => e.content.toLowerCase()));
      for (const entry of entries) {
        if (existingContents.has(entry.content.toLowerCase())) continue;
        const safe = {
          ...entry,
          userId,
          lastAccessedAt: Date.now()
        };
        await memoryStore.save(safe);
        if (embeddings && vectorStore) {
          try {
            const embedding = await embeddings.embed(safe.content);
            safe.embedding = embedding;
            await memoryStore.save(safe);
            await vectorStore.upsert([{
              id: safe.id,
              vector: embedding,
              metadata: { userId, category: safe.category, content: safe.content }
            }]);
          } catch {
          }
        }
        imported++;
      }
      return imported;
    },
    /** Get memory statistics */
    async stats(userId) {
      const memories = await memoryStore.listByUser(userId);
      return calculateMemoryStats(memories);
    },
    /** Health check */
    async health() {
      let memoryOk = true;
      let vectorOk = true;
      try {
        await memoryStore.listByUser("__health_check__", { limit: 1 });
      } catch {
        memoryOk = false;
      }
      if (vectorStore) {
        try {
          await vectorStore.query([], 1);
        } catch {
          vectorOk = false;
        }
      }
      return {
        status: memoryOk ? "healthy" : "degraded",
        memoryStore: memoryOk,
        vectorStore: vectorOk
      };
    },
    /** Run consolidation */
    async consolidate(userId, consolidationConfig) {
      return consolidateMemories(userId, {
        memory: memoryStore,
        embeddings,
        vector: vectorStore
      }, consolidationConfig);
    },
    /** Run pruning */
    async prune(userId, decayConfig) {
      return pruneMemories(userId, {
        memory: memoryStore,
        vector: vectorStore
      }, decayConfig);
    }
  };
}

// src/context/knowledge-graph.ts
function buildKnowledgeGraph(memories) {
  const nodeMap = /* @__PURE__ */ new Map();
  const edgeMap = /* @__PURE__ */ new Map();
  for (const mem of memories) {
    if (mem.supersededBy) continue;
    const entities = mem.entities ?? [];
    if (entities.length === 0) continue;
    for (const entity of entities) {
      const nodeId = entityToId(entity);
      const existing = nodeMap.get(nodeId);
      if (existing) {
        if (!existing.memoryIds.includes(mem.id)) {
          existing.memoryIds.push(mem.id);
        }
      } else {
        nodeMap.set(nodeId, {
          id: nodeId,
          label: entity,
          type: classifyEntity(entity),
          memoryIds: [mem.id]
        });
      }
    }
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const sourceId = entityToId(entities[i]);
        const targetId = entityToId(entities[j]);
        const edgeKey = [sourceId, targetId].sort().join("::");
        const existing = edgeMap.get(edgeKey);
        if (existing) {
          existing.weight++;
        } else {
          edgeMap.set(edgeKey, {
            source: sourceId,
            target: targetId,
            relation: "co-occurs",
            weight: 1
          });
        }
      }
    }
    if (mem.relations) {
      for (const rel of mem.relations) {
        const sourceId = mem.entities?.[0] ? entityToId(mem.entities[0]) : mem.id;
        const targetId = rel.targetId;
        const edgeKey = `${sourceId}::${targetId}::${rel.type}`;
        if (!edgeMap.has(edgeKey)) {
          edgeMap.set(edgeKey, {
            source: sourceId,
            target: targetId,
            relation: rel.type,
            weight: 1
          });
        }
      }
    }
  }
  return {
    nodes: Array.from(nodeMap.values()),
    edges: Array.from(edgeMap.values())
  };
}
function queryGraph(graph, entity, hops = 2) {
  const startId = entityToId(entity);
  const startNode = graph.nodes.find((n) => n.id === startId);
  if (!startNode) return [];
  const visited = /* @__PURE__ */ new Set();
  const result = [];
  let frontier = [startId];
  for (let depth = 0; depth <= hops; depth++) {
    const nextFrontier = [];
    for (const nodeId of frontier) {
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      const node = graph.nodes.find((n) => n.id === nodeId);
      if (node) result.push(node);
      for (const edge of graph.edges) {
        if (edge.source === nodeId && !visited.has(edge.target)) {
          nextFrontier.push(edge.target);
        }
        if (edge.target === nodeId && !visited.has(edge.source)) {
          nextFrontier.push(edge.source);
        }
      }
    }
    frontier = nextFrontier;
  }
  return result;
}
function entityToId(entity) {
  return entity.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
}

// src/context/adapters/qdrant.ts
var QdrantVectorStore = class {
  config;
  collectionInitialized = false;
  constructor(config) {
    this.config = {
      url: config.url.replace(/\/$/, ""),
      // Remove trailing slash
      apiKey: config.apiKey,
      collectionName: config.collectionName,
      dimensions: config.dimensions,
      distance: config.distance ?? "Cosine",
      timeout: config.timeout ?? 1e4
    };
  }
  /**
   * Ensure the collection exists, creating it if necessary
   */
  async ensureCollection(dimensions) {
    if (this.collectionInitialized) return;
    const { url, collectionName, distance } = this.config;
    try {
      const checkRes = await this.fetch(`${url}/collections/${collectionName}`);
      if (checkRes.ok) {
        this.collectionInitialized = true;
        return;
      }
    } catch {
    }
    const createRes = await this.fetch(`${url}/collections/${collectionName}`, {
      method: "PUT",
      body: JSON.stringify({
        vectors: {
          size: dimensions,
          distance
        }
      })
    });
    if (!createRes.ok) {
      const error = await createRes.text();
      throw new Error(`Failed to create Qdrant collection: ${createRes.status} - ${error}`);
    }
    this.collectionInitialized = true;
  }
  async upsert(entries) {
    if (entries.length === 0) return;
    const dimensions = this.config.dimensions ?? entries[0].vector.length;
    await this.ensureCollection(dimensions);
    const { url, collectionName } = this.config;
    const points = entries.map((entry) => ({
      id: stringToUUID(entry.id),
      vector: entry.vector,
      payload: {
        ...entry.metadata,
        _sage_id: entry.id
        // Preserve original string ID
      }
    }));
    const res = await this.fetch(`${url}/collections/${collectionName}/points`, {
      method: "PUT",
      body: JSON.stringify({
        points,
        wait: true
      })
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Qdrant upsert failed: ${res.status} - ${error}`);
    }
  }
  async query(vector, topK, filter) {
    const dimensions = this.config.dimensions ?? vector.length;
    await this.ensureCollection(dimensions);
    const { url, collectionName } = this.config;
    const body = {
      vector,
      limit: topK,
      with_payload: true
    };
    if (filter && Object.keys(filter).length > 0) {
      body.filter = {
        must: Object.entries(filter).map(([key, value]) => ({
          key,
          match: { value }
        }))
      };
    }
    const res = await this.fetch(`${url}/collections/${collectionName}/points/search`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Qdrant search failed: ${res.status} - ${error}`);
    }
    const data = await res.json();
    return (data.result || []).map((point) => ({
      id: point.payload?._sage_id || String(point.id),
      score: point.score,
      metadata: point.payload
    }));
  }
  async delete(ids) {
    if (ids.length === 0) return;
    const { url, collectionName } = this.config;
    const res = await this.fetch(`${url}/collections/${collectionName}/points/delete`, {
      method: "POST",
      body: JSON.stringify({
        points: ids.map((id) => stringToUUID(id)),
        wait: true
      })
    });
    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Qdrant delete failed: ${res.status} - ${error}`);
    }
  }
  /**
   * Internal fetch with auth headers and timeout
   */
  fetch(url, init) {
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.config.apiKey) {
      headers["api-key"] = this.config.apiKey;
    }
    return fetch(url, {
      ...init,
      headers: {
        ...headers,
        ...init?.headers
      },
      signal: AbortSignal.timeout(this.config.timeout)
    });
  }
};
function stringToUUID(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const hex2 = simpleHash(str + "_2").toString(16).padStart(8, "0");
  const hex3 = simpleHash(str + "_3").toString(16).padStart(4, "0");
  const hex4 = simpleHash(str + "_4").toString(16).padStart(4, "0");
  const hex5 = simpleHash(str + "_5").toString(16).padStart(12, "0");
  return `${hex.slice(0, 8)}-${hex2.slice(0, 4)}-4${hex3.slice(0, 3)}-${hex4.slice(0, 4)}-${hex5.slice(0, 12)}`;
}
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & 2147483647;
  }
  return hash;
}

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
  AUTH_ENV_VARS,
  AuthorizationError,
  BaseTransport,
  CharacterTokenizer,
  ConvexConversationRepository,
  ConvexMessageRepository,
  ConvexSessionRepository,
  DEFAULT_CONFIG,
  DEFAULT_MAX_RESULT_SIZE,
  DEFAULT_RETRY_CONFIG,
  DEFAULT_TOOL_TIMEOUT,
  InMemoryAPIKeyStore,
  InMemoryRateLimitStore,
  InMemoryStore,
  InMemoryVectorStore,
  JSONRPC_ERROR_CODES,
  LLM_RETRY_CONFIG,
  MCPClient,
  MCPManager,
  MCP_METHODS,
  MCP_VERSION,
  MemoryConversationRepository,
  MemoryMessageRepository,
  MemorySessionRepository,
  MemoryStreamStore,
  Permissions,
  QdrantVectorStore,
  RateLimitPresets,
  RedisStreamStore,
  SSETransport,
  SageConfigSchema,
  StdioTransport,
  SubagentSchema,
  TOOL_RETRY_CONFIG,
  adjustSplitForToolIntegrity,
  applyWindow,
  buildKnowledgeGraph,
  buildSystemPrompt,
  calculateBackoffDelay,
  calculateDecayScore,
  calculateMemoryStats,
  checkExpirations,
  classifyEntity,
  compressMemories,
  consolidateMemories,
  createAPIKeyAuth,
  createAPIKeyMiddleware,
  createAuthClientConfig,
  createAuthConfig,
  createBetterAuthMiddleware,
  createChatHandler,
  createCommonRoles,
  createConvexRepositories,
  createFallbackSummary,
  createJWKSVerifier,
  createJWTMiddleware,
  createJWTSigner,
  createJWTVerifier,
  createMCPClient,
  createMCPManager,
  createMemoryAPIHandler,
  createMemoryRepositories,
  createMemoryStreamStore,
  createMemoryTools,
  createNoopAuthMiddleware,
  createRBAC,
  createRateLimitMiddleware,
  createRateLimiter,
  createRedisStreamStore,
  createResponsesAPIProvider,
  createRetryWrapper,
  createSSETransport,
  createSession,
  createStdioTransport,
  createStreamHandler,
  createSubagentTool,
  createToolRegistry,
  createWorkingMemory,
  decodeJWT,
  defineConfig,
  defineRole,
  detectProvider,
  detectTemporalQuery,
  estimateMessageTokens,
  estimateTokens,
  estimateTotalTokens,
  executeTool,
  executeWithTimeout,
  extractBearerToken,
  extractEntities,
  extractSessionCookie,
  findSharedEntities,
  formatToolError,
  formatValidationError,
  generateAPIKey,
  generateRecoverySuggestion,
  generateStreamId,
  getContextWindow,
  getContextWindows,
  getCurrentUser,
  getDefaultBaseUrl,
  getTokenizer,
  getUserFromToken,
  handleStreamEvent,
  hashAPIKey,
  initializeSage,
  isRetryableError,
  loadProviderConfig,
  manageContext,
  processWithToolLoop,
  pruneMemories,
  queryGraph,
  registerContextWindow,
  registerSubagentTools,
  requireAuth,
  requireUser,
  responsesAPIProvider,
  retrieveMemories,
  setContextWindows,
  signJWT,
  sleep,
  summarizeMessages,
  truncateResult,
  validateAPIKey,
  validateAuthEnv,
  validateConfig,
  validateProviderConfig,
  validateToolArgs,
  validateToolCallIntegrity,
  verifyJWT,
  willNeedTruncation,
  withAuth,
  withRetry
});
//# sourceMappingURL=index.js.map