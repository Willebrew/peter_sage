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

// src/providers/index.ts
var providers_exports = {};
__export(providers_exports, {
  createResponsesAPIProvider: () => createResponsesAPIProvider,
  detectProvider: () => detectProvider,
  getDefaultBaseUrl: () => getDefaultBaseUrl,
  loadProviderConfig: () => loadProviderConfig,
  responsesAPIProvider: () => responsesAPIProvider,
  validateProviderConfig: () => validateProviderConfig
});
module.exports = __toCommonJS(providers_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createResponsesAPIProvider,
  detectProvider,
  getDefaultBaseUrl,
  loadProviderConfig,
  responsesAPIProvider,
  validateProviderConfig
});
//# sourceMappingURL=index.js.map