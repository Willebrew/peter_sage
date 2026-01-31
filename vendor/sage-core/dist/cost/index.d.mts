/**
 * Cost Types
 *
 * Type definitions for cost tracking and calculation.
 */
/**
 * Model pricing information
 */
interface ModelPricing {
    /** Model identifier */
    model: string;
    /** Provider name */
    provider?: string;
    /** Input cost per 1M tokens (in USD) */
    inputCostPer1M: number;
    /** Output cost per 1M tokens (in USD) */
    outputCostPer1M: number;
    /** Cached input cost per 1M tokens (optional) */
    cachedInputCostPer1M?: number;
    /** Image input cost (per image, optional) */
    imageCostPerUnit?: number;
    /** Audio input cost per minute (optional) */
    audioCostPerMinute?: number;
    /** Context window size */
    contextWindow?: number;
    /** Maximum output tokens */
    maxOutputTokens?: number;
}
/**
 * Token usage from a request
 */
interface TokenUsage {
    /** Input tokens used */
    inputTokens: number;
    /** Output tokens generated */
    outputTokens: number;
    /** Cached input tokens (if applicable) */
    cachedInputTokens?: number;
    /** Total tokens */
    totalTokens?: number;
}
/**
 * Cost calculation result
 */
interface CostResult {
    /** Total cost in USD */
    totalCost: number;
    /** Input cost in USD */
    inputCost: number;
    /** Output cost in USD */
    outputCost: number;
    /** Cached input cost in USD */
    cachedCost?: number;
    /** Model used */
    model: string;
    /** Token usage */
    usage: TokenUsage;
    /** Cost breakdown as formatted string */
    breakdown: string;
}
/**
 * Session cost tracking data
 */
interface SessionCostData {
    /** Session ID */
    sessionId: string;
    /** User ID */
    userId?: string;
    /** Total cost so far */
    totalCost: number;
    /** Total input tokens */
    totalInputTokens: number;
    /** Total output tokens */
    totalOutputTokens: number;
    /** Number of requests */
    requestCount: number;
    /** Cost per model */
    costByModel: Record<string, number>;
    /** Session start time */
    startedAt: number;
    /** Last updated time */
    updatedAt: number;
    /** Cost limit (optional) */
    costLimit?: number;
    /** Warning threshold (optional) */
    warningThreshold?: number;
}
/**
 * Cost event for tracking
 */
interface CostEvent {
    /** Timestamp */
    timestamp: number;
    /** Session ID */
    sessionId: string;
    /** Model used */
    model: string;
    /** Token usage */
    usage: TokenUsage;
    /** Calculated cost */
    cost: CostResult;
    /** Request metadata */
    metadata?: Record<string, unknown>;
}
/**
 * Cost tracker configuration
 */
interface CostTrackerConfig {
    /** Default cost limit per session (USD) */
    defaultCostLimit?: number;
    /** Warning threshold (percentage of limit, 0-1) */
    warningThreshold?: number;
    /** Callback when limit is exceeded */
    onLimitExceeded?: (session: SessionCostData, event: CostEvent) => void;
    /** Callback when warning threshold is reached */
    onWarning?: (session: SessionCostData, event: CostEvent) => void;
    /** Custom pricing overrides */
    pricingOverrides?: Record<string, Partial<ModelPricing>>;
    /** Storage backend for persistence */
    store?: CostStore;
}
/**
 * Cost storage interface
 */
interface CostStore {
    /** Get session cost data */
    get(sessionId: string): Promise<SessionCostData | null>;
    /** Set session cost data */
    set(sessionId: string, data: SessionCostData): Promise<void>;
    /** Delete session cost data */
    delete(sessionId: string): Promise<void>;
    /** List all sessions for a user */
    listByUser(userId: string): Promise<SessionCostData[]>;
}

/**
 * Model Pricing Registry
 *
 * Runtime-editable pricing table for LLM models.
 * Prices are per 1 million tokens in USD.
 */

/**
 * Get pricing for a model
 */
declare function getModelPricing(model: string): ModelPricing | undefined;
/**
 * Register a new model pricing or update existing
 */
declare function registerModelPricing(pricing: ModelPricing): void;
/**
 * Register multiple model pricings
 */
declare function registerModelPricings(pricings: ModelPricing[]): void;
/**
 * Set the entire pricing registry (replaces all)
 */
declare function setPricingRegistry(pricings: ModelPricing[]): void;
/**
 * Get all registered pricings
 */
declare function getAllPricings(): ModelPricing[];
/**
 * Get pricings by provider
 */
declare function getPricingsByProvider(provider: string): ModelPricing[];
/**
 * Reset pricing registry to defaults
 */
declare function resetPricingRegistry(): void;
/**
 * Check if a model is free
 */
declare function isModelFree(model: string): boolean;
/**
 * Get cheapest model for a provider
 */
declare function getCheapestModel(provider?: string): ModelPricing | undefined;

/**
 * Cost Calculator
 *
 * Calculates costs based on token usage and model pricing.
 */

/**
 * Calculate cost from token usage
 */
declare function calculateCost(model: string, usage: TokenUsage, pricingOverride?: Partial<ModelPricing>): CostResult;
/**
 * Calculate cost for multiple usages
 */
declare function calculateTotalCost(usages: Array<{
    model: string;
    usage: TokenUsage;
}>): {
    totalCost: number;
    costByModel: Record<string, number>;
    details: CostResult[];
};
/**
 * Estimate cost before making a request
 */
declare function estimateCost(model: string, estimatedInputTokens: number, estimatedOutputTokens: number): CostResult;
/**
 * Format cost as currency string
 */
declare function formatCost(cost: number, currency?: string): string;
/**
 * Compare costs between models
 */
declare function compareCosts(usage: TokenUsage, models: string[]): Array<{
    model: string;
    cost: CostResult;
    rank: number;
}>;
/**
 * Calculate savings from caching
 */
declare function calculateCacheSavings(model: string, cachedTokens: number): {
    savings: number;
    percentage: number;
};

/**
 * Session Cost Tracker
 *
 * Tracks costs across a session with limits and warnings.
 */

/**
 * In-memory cost store
 */
declare class InMemoryCostStore implements CostStore {
    private sessions;
    get(sessionId: string): Promise<SessionCostData | null>;
    set(sessionId: string, data: SessionCostData): Promise<void>;
    delete(sessionId: string): Promise<void>;
    listByUser(userId: string): Promise<SessionCostData[]>;
}
/**
 * Create a session cost tracker
 */
declare function createCostTracker(config?: CostTrackerConfig): {
    /**
     * Track a request's cost
     */
    track(sessionId: string, model: string, usage: TokenUsage, options?: {
        userId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        cost: CostResult;
        session: SessionCostData;
        limitExceeded: boolean;
        warningTriggered: boolean;
    }>;
    /**
     * Get session cost data
     */
    getSession(sessionId: string): Promise<SessionCostData | null>;
    /**
     * Set cost limit for a session
     */
    setLimit(sessionId: string, limit: number, options?: {
        userId?: string;
    }): Promise<void>;
    /**
     * Check if session is within budget
     */
    checkBudget(sessionId: string): Promise<{
        withinBudget: boolean;
        remaining: number | null;
        used: number;
        limit: number | null;
        percentUsed: number | null;
    }>;
    /**
     * Reset session costs
     */
    resetSession(sessionId: string): Promise<void>;
    /**
     * Delete session
     */
    deleteSession(sessionId: string): Promise<void>;
    /**
     * Get all sessions for a user
     */
    getUserSessions(userId: string): Promise<SessionCostData[]>;
    /**
     * Get total cost across all user sessions
     */
    getUserTotalCost(userId: string): Promise<number>;
    /**
     * Get the store instance
     */
    getStore(): CostStore;
};
/**
 * Create a cost tracker with hooks for SAGE lifecycle
 */
declare function createSAGECostTracker(config?: CostTrackerConfig): {
    /**
     * Create a hook function for afterLLMCall
     */
    createAfterLLMCallHook(): (context: {
        sessionId: string;
        userId?: string;
    }, response: {
        inputTokens: number;
        outputTokens: number;
    }) => Promise<void>;
    /**
     * Track a request's cost
     */
    track(sessionId: string, model: string, usage: TokenUsage, options?: {
        userId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        cost: CostResult;
        session: SessionCostData;
        limitExceeded: boolean;
        warningTriggered: boolean;
    }>;
    /**
     * Get session cost data
     */
    getSession(sessionId: string): Promise<SessionCostData | null>;
    /**
     * Set cost limit for a session
     */
    setLimit(sessionId: string, limit: number, options?: {
        userId?: string;
    }): Promise<void>;
    /**
     * Check if session is within budget
     */
    checkBudget(sessionId: string): Promise<{
        withinBudget: boolean;
        remaining: number | null;
        used: number;
        limit: number | null;
        percentUsed: number | null;
    }>;
    /**
     * Reset session costs
     */
    resetSession(sessionId: string): Promise<void>;
    /**
     * Delete session
     */
    deleteSession(sessionId: string): Promise<void>;
    /**
     * Get all sessions for a user
     */
    getUserSessions(userId: string): Promise<SessionCostData[]>;
    /**
     * Get total cost across all user sessions
     */
    getUserTotalCost(userId: string): Promise<number>;
    /**
     * Get the store instance
     */
    getStore(): CostStore;
};

export { type CostEvent, type CostResult, type CostStore, type CostTrackerConfig, InMemoryCostStore, type ModelPricing, type SessionCostData, type TokenUsage, calculateCacheSavings, calculateCost, calculateTotalCost, compareCosts, createCostTracker, createSAGECostTracker, estimateCost, formatCost, getAllPricings, getCheapestModel, getModelPricing, getPricingsByProvider, isModelFree, registerModelPricing, registerModelPricings, resetPricingRegistry, setPricingRegistry };
