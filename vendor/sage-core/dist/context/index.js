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

// src/context/index.ts
var context_exports = {};
__export(context_exports, {
  CharacterTokenizer: () => CharacterTokenizer,
  InMemoryStore: () => InMemoryStore,
  InMemoryVectorStore: () => InMemoryVectorStore,
  QdrantVectorStore: () => QdrantVectorStore,
  adjustSplitForToolIntegrity: () => adjustSplitForToolIntegrity,
  applyWindow: () => applyWindow,
  buildKnowledgeGraph: () => buildKnowledgeGraph,
  calculateDecayScore: () => calculateDecayScore,
  calculateMemoryStats: () => calculateMemoryStats,
  checkExpirations: () => checkExpirations,
  classifyEntity: () => classifyEntity,
  compressMemories: () => compressMemories,
  consolidateMemories: () => consolidateMemories,
  createFallbackSummary: () => createFallbackSummary,
  createMemoryAPIHandler: () => createMemoryAPIHandler,
  createMemoryTools: () => createMemoryTools,
  createWorkingMemory: () => createWorkingMemory,
  detectTemporalQuery: () => detectTemporalQuery,
  estimateMessageTokens: () => estimateMessageTokens,
  estimateTokens: () => estimateTokens,
  estimateTotalTokens: () => estimateTotalTokens,
  extractEntities: () => extractEntities,
  findSharedEntities: () => findSharedEntities,
  getContextWindow: () => getContextWindow,
  getContextWindows: () => getContextWindows,
  getTokenizer: () => getTokenizer,
  manageContext: () => manageContext,
  pruneMemories: () => pruneMemories,
  queryGraph: () => queryGraph,
  registerContextWindow: () => registerContextWindow,
  retrieveMemories: () => retrieveMemories,
  setContextWindows: () => setContextWindows,
  summarizeMessages: () => summarizeMessages,
  validateToolCallIntegrity: () => validateToolCallIntegrity,
  willNeedTruncation: () => willNeedTruncation
});
module.exports = __toCommonJS(context_exports);

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

// src/context/working-memory.ts
var import_crypto = require("crypto");

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
            id: (0, import_crypto.randomUUID)(),
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
        id: (0, import_crypto.randomUUID)(),
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

// src/context/consolidation.ts
var import_crypto2 = require("crypto");
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
        id: (0, import_crypto2.randomUUID)(),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CharacterTokenizer,
  InMemoryStore,
  InMemoryVectorStore,
  QdrantVectorStore,
  adjustSplitForToolIntegrity,
  applyWindow,
  buildKnowledgeGraph,
  calculateDecayScore,
  calculateMemoryStats,
  checkExpirations,
  classifyEntity,
  compressMemories,
  consolidateMemories,
  createFallbackSummary,
  createMemoryAPIHandler,
  createMemoryTools,
  createWorkingMemory,
  detectTemporalQuery,
  estimateMessageTokens,
  estimateTokens,
  estimateTotalTokens,
  extractEntities,
  findSharedEntities,
  getContextWindow,
  getContextWindows,
  getTokenizer,
  manageContext,
  pruneMemories,
  queryGraph,
  registerContextWindow,
  retrieveMemories,
  setContextWindows,
  summarizeMessages,
  validateToolCallIntegrity,
  willNeedTruncation
});
//# sourceMappingURL=index.js.map