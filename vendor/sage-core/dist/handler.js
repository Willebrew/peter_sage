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

// src/handler.ts
var handler_exports = {};
__export(handler_exports, {
  createChatHandler: () => createChatHandler,
  createStreamHandler: () => createStreamHandler,
  initializeSage: () => initializeSage
});
module.exports = __toCommonJS(handler_exports);

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
var LLM_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1e3,
  maxDelay: 6e4,
  backoffMultiplier: 2,
  jitter: 0.2,
  isRetryable: isRetryableError
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createChatHandler,
  createStreamHandler,
  initializeSage
});
//# sourceMappingURL=handler.js.map