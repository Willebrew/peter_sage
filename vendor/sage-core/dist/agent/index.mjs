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

// src/agent/session.ts
import { randomUUID } from "crypto";

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
  const sessionId = randomUUID();
  const streamId = randomUUID();
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
  return randomUUID();
}
export {
  buildSystemPrompt,
  createSession,
  createSubagentTool,
  generateStreamId,
  handleStreamEvent,
  processWithToolLoop,
  registerSubagentTools
};
//# sourceMappingURL=index.mjs.map