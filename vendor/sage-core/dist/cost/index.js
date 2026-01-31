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

// src/cost/index.ts
var cost_exports = {};
__export(cost_exports, {
  InMemoryCostStore: () => InMemoryCostStore,
  calculateCacheSavings: () => calculateCacheSavings,
  calculateCost: () => calculateCost,
  calculateTotalCost: () => calculateTotalCost,
  compareCosts: () => compareCosts,
  createCostTracker: () => createCostTracker,
  createSAGECostTracker: () => createSAGECostTracker,
  estimateCost: () => estimateCost,
  formatCost: () => formatCost,
  getAllPricings: () => getAllPricings,
  getCheapestModel: () => getCheapestModel,
  getModelPricing: () => getModelPricing,
  getPricingsByProvider: () => getPricingsByProvider,
  isModelFree: () => isModelFree,
  registerModelPricing: () => registerModelPricing,
  registerModelPricings: () => registerModelPricings,
  resetPricingRegistry: () => resetPricingRegistry,
  setPricingRegistry: () => setPricingRegistry
});
module.exports = __toCommonJS(cost_exports);

// src/cost/pricing.ts
var DEFAULT_PRICING = [
  // OpenAI
  {
    model: "gpt-4o",
    provider: "openai",
    inputCostPer1M: 2.5,
    outputCostPer1M: 10,
    cachedInputCostPer1M: 1.25,
    contextWindow: 128e3,
    maxOutputTokens: 16384
  },
  {
    model: "gpt-4o-mini",
    provider: "openai",
    inputCostPer1M: 0.15,
    outputCostPer1M: 0.6,
    cachedInputCostPer1M: 0.075,
    contextWindow: 128e3,
    maxOutputTokens: 16384
  },
  {
    model: "gpt-4-turbo",
    provider: "openai",
    inputCostPer1M: 10,
    outputCostPer1M: 30,
    contextWindow: 128e3,
    maxOutputTokens: 4096
  },
  {
    model: "gpt-4",
    provider: "openai",
    inputCostPer1M: 30,
    outputCostPer1M: 60,
    contextWindow: 8192,
    maxOutputTokens: 8192
  },
  {
    model: "gpt-3.5-turbo",
    provider: "openai",
    inputCostPer1M: 0.5,
    outputCostPer1M: 1.5,
    contextWindow: 16385,
    maxOutputTokens: 4096
  },
  {
    model: "o1",
    provider: "openai",
    inputCostPer1M: 15,
    outputCostPer1M: 60,
    cachedInputCostPer1M: 7.5,
    contextWindow: 2e5,
    maxOutputTokens: 1e5
  },
  {
    model: "o1-mini",
    provider: "openai",
    inputCostPer1M: 3,
    outputCostPer1M: 12,
    cachedInputCostPer1M: 1.5,
    contextWindow: 128e3,
    maxOutputTokens: 65536
  },
  {
    model: "o1-pro",
    provider: "openai",
    inputCostPer1M: 150,
    outputCostPer1M: 600,
    contextWindow: 2e5,
    maxOutputTokens: 1e5
  },
  // Anthropic
  {
    model: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    cachedInputCostPer1M: 0.3,
    contextWindow: 2e5,
    maxOutputTokens: 8192
  },
  {
    model: "claude-3-5-haiku-20241022",
    provider: "anthropic",
    inputCostPer1M: 0.8,
    outputCostPer1M: 4,
    cachedInputCostPer1M: 0.08,
    contextWindow: 2e5,
    maxOutputTokens: 8192
  },
  {
    model: "claude-3-opus-20240229",
    provider: "anthropic",
    inputCostPer1M: 15,
    outputCostPer1M: 75,
    cachedInputCostPer1M: 1.5,
    contextWindow: 2e5,
    maxOutputTokens: 4096
  },
  {
    model: "claude-3-sonnet-20240229",
    provider: "anthropic",
    inputCostPer1M: 3,
    outputCostPer1M: 15,
    contextWindow: 2e5,
    maxOutputTokens: 4096
  },
  {
    model: "claude-3-haiku-20240307",
    provider: "anthropic",
    inputCostPer1M: 0.25,
    outputCostPer1M: 1.25,
    cachedInputCostPer1M: 0.03,
    contextWindow: 2e5,
    maxOutputTokens: 4096
  },
  // Google
  {
    model: "gemini-2.0-flash",
    provider: "google",
    inputCostPer1M: 0.1,
    outputCostPer1M: 0.4,
    contextWindow: 1e6,
    maxOutputTokens: 8192
  },
  {
    model: "gemini-1.5-pro",
    provider: "google",
    inputCostPer1M: 1.25,
    outputCostPer1M: 5,
    contextWindow: 2e6,
    maxOutputTokens: 8192
  },
  {
    model: "gemini-1.5-flash",
    provider: "google",
    inputCostPer1M: 0.075,
    outputCostPer1M: 0.3,
    contextWindow: 1e6,
    maxOutputTokens: 8192
  },
  // Mistral
  {
    model: "mistral-large-latest",
    provider: "mistral",
    inputCostPer1M: 2,
    outputCostPer1M: 6,
    contextWindow: 128e3
  },
  {
    model: "mistral-small-latest",
    provider: "mistral",
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.6,
    contextWindow: 128e3
  },
  {
    model: "codestral-latest",
    provider: "mistral",
    inputCostPer1M: 0.2,
    outputCostPer1M: 0.6,
    contextWindow: 256e3
  },
  // DeepSeek
  {
    model: "deepseek-chat",
    provider: "deepseek",
    inputCostPer1M: 0.14,
    outputCostPer1M: 0.28,
    cachedInputCostPer1M: 0.014,
    contextWindow: 64e3
  },
  {
    model: "deepseek-reasoner",
    provider: "deepseek",
    inputCostPer1M: 0.55,
    outputCostPer1M: 2.19,
    cachedInputCostPer1M: 0.14,
    contextWindow: 64e3
  },
  // Groq (hosting open models)
  {
    model: "llama-3.3-70b-versatile",
    provider: "groq",
    inputCostPer1M: 0.59,
    outputCostPer1M: 0.79,
    contextWindow: 128e3
  },
  {
    model: "llama-3.1-8b-instant",
    provider: "groq",
    inputCostPer1M: 0.05,
    outputCostPer1M: 0.08,
    contextWindow: 128e3
  },
  {
    model: "mixtral-8x7b-32768",
    provider: "groq",
    inputCostPer1M: 0.24,
    outputCostPer1M: 0.24,
    contextWindow: 32768
  },
  // Free models (OpenRouter, SIR, etc.)
  {
    model: "nvidia/nemotron-3-nano-30b-a3b:free",
    provider: "openrouter",
    inputCostPer1M: 0,
    outputCostPer1M: 0,
    contextWindow: 32e3
  },
  {
    model: "meta-llama/llama-3.2-3b-instruct:free",
    provider: "openrouter",
    inputCostPer1M: 0,
    outputCostPer1M: 0,
    contextWindow: 128e3
  }
];
var pricingRegistry = /* @__PURE__ */ new Map();
for (const pricing of DEFAULT_PRICING) {
  pricingRegistry.set(pricing.model, pricing);
}
function getModelPricing(model) {
  if (pricingRegistry.has(model)) {
    return pricingRegistry.get(model);
  }
  for (const [key, pricing] of pricingRegistry) {
    if (model.includes(key) || key.includes(model)) {
      return pricing;
    }
  }
  const baseModel = model.replace(/-\d{8}$/, "").replace(/-latest$/, "");
  if (pricingRegistry.has(baseModel)) {
    return pricingRegistry.get(baseModel);
  }
  return void 0;
}
function registerModelPricing(pricing) {
  pricingRegistry.set(pricing.model, pricing);
}
function registerModelPricings(pricings) {
  for (const pricing of pricings) {
    pricingRegistry.set(pricing.model, pricing);
  }
}
function setPricingRegistry(pricings) {
  pricingRegistry = /* @__PURE__ */ new Map();
  for (const pricing of pricings) {
    pricingRegistry.set(pricing.model, pricing);
  }
}
function getAllPricings() {
  return Array.from(pricingRegistry.values());
}
function getPricingsByProvider(provider) {
  return Array.from(pricingRegistry.values()).filter(
    (p) => p.provider?.toLowerCase() === provider.toLowerCase()
  );
}
function resetPricingRegistry() {
  pricingRegistry = /* @__PURE__ */ new Map();
  for (const pricing of DEFAULT_PRICING) {
    pricingRegistry.set(pricing.model, pricing);
  }
}
function isModelFree(model) {
  const pricing = getModelPricing(model);
  if (!pricing) return false;
  return pricing.inputCostPer1M === 0 && pricing.outputCostPer1M === 0;
}
function getCheapestModel(provider) {
  let models = Array.from(pricingRegistry.values());
  if (provider) {
    models = models.filter((m) => m.provider?.toLowerCase() === provider.toLowerCase());
  }
  if (models.length === 0) return void 0;
  return models.reduce((cheapest, current) => {
    const cheapestAvg = (cheapest.inputCostPer1M + cheapest.outputCostPer1M) / 2;
    const currentAvg = (current.inputCostPer1M + current.outputCostPer1M) / 2;
    return currentAvg < cheapestAvg ? current : cheapest;
  });
}

// src/cost/calculator.ts
function calculateCost(model, usage, pricingOverride) {
  const basePricing = getModelPricing(model);
  if (!basePricing && !pricingOverride) {
    console.warn(`[CostCalculator] Unknown model: ${model}. Returning zero cost.`);
    return {
      totalCost: 0,
      inputCost: 0,
      outputCost: 0,
      model,
      usage,
      breakdown: `Unknown model: ${model}`
    };
  }
  const pricing = {
    inputCostPer1M: 0,
    outputCostPer1M: 0,
    cachedInputCostPer1M: 0,
    ...basePricing,
    ...pricingOverride
  };
  const inputCost = usage.inputTokens / 1e6 * pricing.inputCostPer1M;
  const outputCost = usage.outputTokens / 1e6 * pricing.outputCostPer1M;
  let cachedCost;
  if (usage.cachedInputTokens && pricing.cachedInputCostPer1M) {
    cachedCost = usage.cachedInputTokens / 1e6 * pricing.cachedInputCostPer1M;
  }
  const totalCost = inputCost + outputCost + (cachedCost ?? 0);
  const parts = [
    `Input: ${usage.inputTokens.toLocaleString()} tokens \xD7 $${pricing.inputCostPer1M}/1M = $${inputCost.toFixed(6)}`,
    `Output: ${usage.outputTokens.toLocaleString()} tokens \xD7 $${pricing.outputCostPer1M}/1M = $${outputCost.toFixed(6)}`
  ];
  if (cachedCost !== void 0) {
    parts.push(
      `Cached: ${usage.cachedInputTokens.toLocaleString()} tokens \xD7 $${pricing.cachedInputCostPer1M}/1M = $${cachedCost.toFixed(6)}`
    );
  }
  parts.push(`Total: $${totalCost.toFixed(6)}`);
  return {
    totalCost,
    inputCost,
    outputCost,
    cachedCost,
    model,
    usage,
    breakdown: parts.join("\n")
  };
}
function calculateTotalCost(usages) {
  const details = [];
  const costByModel = {};
  let totalCost = 0;
  for (const { model, usage } of usages) {
    const result = calculateCost(model, usage);
    details.push(result);
    totalCost += result.totalCost;
    costByModel[model] = (costByModel[model] ?? 0) + result.totalCost;
  }
  return { totalCost, costByModel, details };
}
function estimateCost(model, estimatedInputTokens, estimatedOutputTokens) {
  return calculateCost(model, {
    inputTokens: estimatedInputTokens,
    outputTokens: estimatedOutputTokens
  });
}
function formatCost(cost, currency = "USD") {
  if (cost < 0.01) {
    return `$${cost.toFixed(6)}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 4
  }).format(cost);
}
function compareCosts(usage, models) {
  const results = models.map((model) => ({
    model,
    cost: calculateCost(model, usage)
  }));
  results.sort((a, b) => a.cost.totalCost - b.cost.totalCost);
  return results.map((r, index) => ({
    ...r,
    rank: index + 1
  }));
}
function calculateCacheSavings(model, cachedTokens) {
  const pricing = getModelPricing(model);
  if (!pricing || !pricing.cachedInputCostPer1M) {
    return { savings: 0, percentage: 0 };
  }
  const regularCost = cachedTokens / 1e6 * pricing.inputCostPer1M;
  const cachedCost = cachedTokens / 1e6 * pricing.cachedInputCostPer1M;
  const savings = regularCost - cachedCost;
  const percentage = savings / regularCost * 100;
  return { savings, percentage };
}

// src/cost/tracker.ts
var InMemoryCostStore = class {
  sessions = /* @__PURE__ */ new Map();
  async get(sessionId) {
    return this.sessions.get(sessionId) ?? null;
  }
  async set(sessionId, data) {
    this.sessions.set(sessionId, data);
  }
  async delete(sessionId) {
    this.sessions.delete(sessionId);
  }
  async listByUser(userId) {
    return Array.from(this.sessions.values()).filter((s) => s.userId === userId);
  }
};
function createCostTracker(config) {
  const store = config?.store ?? new InMemoryCostStore();
  const defaultLimit = config?.defaultCostLimit;
  const warningThreshold = config?.warningThreshold ?? 0.8;
  async function getOrCreateSession(sessionId, userId) {
    let session = await store.get(sessionId);
    if (!session) {
      session = {
        sessionId,
        userId,
        totalCost: 0,
        totalInputTokens: 0,
        totalOutputTokens: 0,
        requestCount: 0,
        costByModel: {},
        startedAt: Date.now(),
        updatedAt: Date.now(),
        costLimit: defaultLimit,
        warningThreshold: defaultLimit ? defaultLimit * warningThreshold : void 0
      };
      await store.set(sessionId, session);
    }
    return session;
  }
  return {
    /**
     * Track a request's cost
     */
    async track(sessionId, model, usage, options) {
      const pricingOverride = config?.pricingOverrides?.[model];
      const cost = calculateCost(model, usage, pricingOverride);
      const session = await getOrCreateSession(sessionId, options?.userId);
      session.totalCost += cost.totalCost;
      session.totalInputTokens += usage.inputTokens;
      session.totalOutputTokens += usage.outputTokens;
      session.requestCount++;
      session.costByModel[model] = (session.costByModel[model] ?? 0) + cost.totalCost;
      session.updatedAt = Date.now();
      await store.set(sessionId, session);
      const event = {
        timestamp: Date.now(),
        sessionId,
        model,
        usage,
        cost,
        metadata: options?.metadata
      };
      let limitExceeded = false;
      let warningTriggered = false;
      if (session.costLimit && session.totalCost >= session.costLimit) {
        limitExceeded = true;
        config?.onLimitExceeded?.(session, event);
      } else if (session.warningThreshold && session.totalCost >= session.warningThreshold) {
        warningTriggered = true;
        config?.onWarning?.(session, event);
      }
      return { cost, session, limitExceeded, warningTriggered };
    },
    /**
     * Get session cost data
     */
    async getSession(sessionId) {
      return store.get(sessionId);
    },
    /**
     * Set cost limit for a session
     */
    async setLimit(sessionId, limit, options) {
      const session = await getOrCreateSession(sessionId, options?.userId);
      session.costLimit = limit;
      session.warningThreshold = limit * warningThreshold;
      await store.set(sessionId, session);
    },
    /**
     * Check if session is within budget
     */
    async checkBudget(sessionId) {
      const session = await store.get(sessionId);
      if (!session) {
        return {
          withinBudget: true,
          remaining: null,
          used: 0,
          limit: null,
          percentUsed: null
        };
      }
      const limit = session.costLimit ?? null;
      const remaining = limit !== null ? Math.max(0, limit - session.totalCost) : null;
      const percentUsed = limit !== null ? session.totalCost / limit * 100 : null;
      return {
        withinBudget: limit === null || session.totalCost < limit,
        remaining,
        used: session.totalCost,
        limit,
        percentUsed
      };
    },
    /**
     * Reset session costs
     */
    async resetSession(sessionId) {
      const session = await store.get(sessionId);
      if (session) {
        session.totalCost = 0;
        session.totalInputTokens = 0;
        session.totalOutputTokens = 0;
        session.requestCount = 0;
        session.costByModel = {};
        session.updatedAt = Date.now();
        await store.set(sessionId, session);
      }
    },
    /**
     * Delete session
     */
    async deleteSession(sessionId) {
      await store.delete(sessionId);
    },
    /**
     * Get all sessions for a user
     */
    async getUserSessions(userId) {
      return store.listByUser(userId);
    },
    /**
     * Get total cost across all user sessions
     */
    async getUserTotalCost(userId) {
      const sessions = await store.listByUser(userId);
      return sessions.reduce((total, s) => total + s.totalCost, 0);
    },
    /**
     * Get the store instance
     */
    getStore() {
      return store;
    }
  };
}
function createSAGECostTracker(config) {
  const tracker = createCostTracker(config);
  return {
    ...tracker,
    /**
     * Create a hook function for afterLLMCall
     */
    createAfterLLMCallHook() {
      return async (context, response) => {
        console.log("[CostTracker] Request tracked:", {
          sessionId: context.sessionId,
          inputTokens: response.inputTokens,
          outputTokens: response.outputTokens
        });
      };
    }
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCostStore,
  calculateCacheSavings,
  calculateCost,
  calculateTotalCost,
  compareCosts,
  createCostTracker,
  createSAGECostTracker,
  estimateCost,
  formatCost,
  getAllPricings,
  getCheapestModel,
  getModelPricing,
  getPricingsByProvider,
  isModelFree,
  registerModelPricing,
  registerModelPricings,
  resetPricingRegistry,
  setPricingRegistry
});
//# sourceMappingURL=index.js.map