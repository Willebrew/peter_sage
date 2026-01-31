import { e as Tokenizer, b as ContextWindowOptions, W as WindowResult, I as IntegrityResult, d as SummaryState, S as SummarizerConfig, f as WorkingMemoryConfig, g as WorkingMemoryManager, C as ContextConfig, a as ContextResult, c as MemoryStore, V as VectorStore, E as EmbeddingsAdapter, M as MemoryEntry } from '../types-CMD9oqF0.js';
export { T as TokenBudget } from '../types-CMD9oqF0.js';
import { M as Message } from '../types-in3oy7jN.js';
import { T as Tool } from '../types-BpZ5RLfX.js';
import 'zod';
import '../utils/index.js';

/**
 * Token Counter
 *
 * Estimates token counts for messages and text.
 * Default uses a character heuristic (~90% accurate, no WASM/native deps).
 * Apps can plug in tiktoken or any custom tokenizer.
 */

/**
 * Default tokenizer using character heuristic.
 * ~4 characters per token with a 10% safety buffer.
 * Avoids tiktoken WASM issues in Next.js/edge environments.
 */
declare class CharacterTokenizer implements Tokenizer {
    count(text: string): number;
}
/**
 * Get the tokenizer to use (custom or default)
 */
declare function getTokenizer(custom?: Tokenizer): Tokenizer;
/**
 * Estimate tokens for a plain string
 */
declare function estimateTokens(text: string, tokenizer?: Tokenizer): number;
/**
 * Estimate tokens for a single message, including structural overhead.
 *
 * Accounts for:
 * - Role tokens (4 per message for role + structure)
 * - String content
 * - Multimodal content arrays (text parts, images ~170 tokens each)
 * - Tool calls (function name + arguments + 10 overhead per call)
 * - Tool result messages (content + toolCallId overhead)
 */
declare function estimateMessageTokens(message: Message, tokenizer?: Tokenizer): number;
/**
 * Estimate total tokens for an array of messages
 */
declare function estimateTotalTokens(messages: Message[], tokenizer?: Tokenizer): number;
/**
 * Quick pre-check: will the messages need truncation?
 * Used to show "compacting..." UI before async summarization.
 */
declare function willNeedTruncation(options: {
    messages: Message[];
    systemPromptTokens: number;
    contextWindow: number;
    maxResponseTokens: number;
    summaryTokens?: number;
    memoryTokens?: number;
    tokenizer?: Tokenizer;
}): boolean;

/**
 * Context Window Registry
 *
 * Maps model names to their context window sizes (in tokens).
 * Runtime-editable: apps can add/override models per project.
 */

/**
 * Register a single model's context window size.
 * Overwrites existing entries.
 *
 * @example
 * ```typescript
 * registerContextWindow('my-custom-model', 64_000);
 * ```
 */
declare function registerContextWindow(model: string, tokens: number): void;
/**
 * Register multiple model context windows at once.
 * Overwrites existing entries for matching models.
 *
 * @example
 * ```typescript
 * setContextWindows({
 *   'my-model': 64_000,
 *   'gpt-4o': 256_000, // override default
 * });
 * ```
 */
declare function setContextWindows(windows: Record<string, number>): void;
/**
 * Get all registered context windows (for inspection/debugging)
 */
declare function getContextWindows(): Record<string, number>;
/**
 * Look up the context window size for a model.
 *
 * Uses fuzzy matching: "gpt-4o-2024-08-06" matches "gpt-4o".
 * Falls back to the default (128k) if no match is found.
 *
 * @param model - Model name (e.g., "gpt-4o", "claude-3.5-sonnet")
 * @param options - Override or default size options
 */
declare function getContextWindow(model: string, options?: ContextWindowOptions): number;

/**
 * Sliding Window
 *
 * Applies a backwards sliding window to fit conversation messages
 * within the available token budget. Preserves tool call integrity.
 */

/**
 * Options for applying the sliding window
 */
interface WindowOptions {
    /** Messages to window */
    messages: Message[];
    /** System prompt text (for budget calculation) */
    systemPrompt: string;
    /** Total context window size */
    contextWindow: number;
    /** Max tokens reserved for response */
    maxResponseTokens: number;
    /** Tokens used by existing summary (default: 0) */
    summaryTokens?: number;
    /** Tokens used by working memory injection (default: 0) */
    memoryTokens?: number;
    /** Custom tokenizer */
    tokenizer?: Tokenizer;
}
/**
 * Apply a backwards sliding window to messages.
 *
 * Starts from the most recent message and works backwards,
 * including as many messages as fit in the available token budget.
 * Preserves tool call/result pair integrity.
 *
 * @returns WindowResult with recent messages, old messages, and budget info
 */
declare function applyWindow(options: WindowOptions): WindowResult;

/**
 * Tool Call Integrity
 *
 * Ensures tool call/result pairs are never orphaned when truncating
 * conversation history. Ported from stratus-workspace's proven algorithms.
 *
 * Rules enforced:
 * - Every assistant message with tool_calls MUST have ALL corresponding tool results
 * - No orphaned tool results (results without their parent assistant message)
 * - Recursive adjustment if initial fix creates new integrity issues
 */

/**
 * Validate and repair tool call integrity in a message array.
 *
 * After sliding window truncation, some messages may be orphaned:
 * - An assistant message with tool_calls but missing the corresponding tool results
 * - A tool result message whose parent assistant message was truncated
 *
 * This function adjusts the message array to fix these issues.
 */
declare function validateToolCallIntegrity(messages: Message[]): IntegrityResult;
/**
 * Adjust a split index to maintain tool call integrity.
 *
 * When splitting messages into "old" and "recent" at a given index,
 * this adjusts the split point so that tool call/result pairs stay together.
 *
 * @param messages - Full message array
 * @param splitIndex - Initial split index (everything >= splitIndex is "recent")
 * @returns Adjusted split index
 */
declare function adjustSplitForToolIntegrity(messages: Message[], splitIndex: number): number;

/**
 * Summarizer
 *
 * LLM-powered incremental conversation summarization.
 * Generates concise summaries of older messages that were truncated
 * from the context window. Supports incremental re-summarization
 * with watermarking.
 */

/**
 * Summarize a set of messages using an LLM.
 *
 * If an existing summary is provided, it's prepended as context
 * for incremental summarization (watermarking pattern).
 *
 * @param messages - Messages to summarize (the "old" messages)
 * @param existingSummary - Previous summary to build upon (optional)
 * @param config - Summarizer configuration
 * @returns New summary state
 */
declare function summarizeMessages(messages: Message[], existingSummary?: SummaryState, config?: SummarizerConfig): Promise<SummaryState>;
/**
 * Create a fallback summary without LLM (used when LLM is unavailable)
 */
declare function createFallbackSummary(messages: Message[], existingSummary?: SummaryState, tokenizer?: Tokenizer): SummaryState;

/**
 * Working Memory Manager
 *
 * Cross-conversation persistent memory for SAGE agents.
 * Learns facts, preferences, and context from conversations
 * and injects relevant memories into future interactions.
 *
 * Supports:
 * - Automatic memory extraction after each turn
 * - Semantic search (with embeddings + vector store)
 * - Keyword fallback search (without embeddings)
 * - Memory decay (unused memories lose confidence)
 * - remember/recall tools for explicit agent memory
 */

/**
 * Create a working memory manager.
 *
 * @example
 * ```typescript
 * const memory = createWorkingMemory({
 *   enabled: true,
 *   autoExtract: true,
 *   store: new InMemoryStore(),
 *   embeddings: myEmbeddingsAdapter,
 *   vectorStore: new QdrantVectorStore({ ... }),
 *   provider: { apiKey: '...', baseUrl: '...' },
 * });
 * ```
 */
declare function createWorkingMemory(config: WorkingMemoryConfig): WorkingMemoryManager;

/**
 * Context Manager
 *
 * Orchestrates the full context management pipeline:
 * 1. Calculate token budget
 * 2. Inject working memory into system prompt
 * 3. Apply sliding window with tool integrity
 * 4. Summarize truncated messages
 * 5. Return managed messages + enriched system prompt
 */

/**
 * Options for the context management pipeline
 */
interface ManageContextOptions {
    /** Messages to manage */
    messages: Message[];
    /** Base system prompt */
    systemPrompt: string;
    /** User ID (for working memory) */
    userId: string;
    /** Context configuration */
    config: ContextConfig;
    /** Existing summary from previous truncation */
    existingSummary?: SummaryState;
}
/**
 * Run the full context management pipeline.
 *
 * This is the main entry point. Call it before each LLM request
 * to ensure messages fit within the context window while preserving
 * the most relevant context.
 *
 * @example
 * ```typescript
 * const result = await manageContext({
 *   messages,
 *   systemPrompt,
 *   userId: 'user-123',
 *   config: {
 *     model: 'gpt-4o',
 *     maxResponseTokens: 4096,
 *     summary: { provider: { apiKey: '...', baseUrl: '...' } },
 *     workingMemory: myWorkingMemoryManager,
 *   },
 *   existingSummary: previousSummary,
 * });
 *
 * // Use result.messages and result.systemPrompt for the LLM call
 * ```
 */
declare function manageContext(options: ManageContextOptions): Promise<ContextResult>;

/**
 * Agent Memory Tools
 *
 * Tools that the LLM can call during conversation to explicitly
 * manage persistent memory: remember, recall, update, forget.
 */

/**
 * Create memory tools for the agent to use during conversation.
 *
 * @param workingMemory - The working memory manager instance
 * @param stores - Optional direct store references for delete/update operations
 * @returns Array of Tool definitions
 */
declare function createMemoryTools(workingMemory: WorkingMemoryManager, stores?: {
    memory: MemoryStore;
    vector?: VectorStore;
}): Tool[];

/**
 * Entity Extraction Utilities
 *
 * Simple regex-based entity extraction as a fallback when
 * LLM-based extraction isn't available. Extracts people, places,
 * organizations, dates, and concepts from text.
 */
/**
 * Entity type classification
 */
type EntityType = 'person' | 'place' | 'org' | 'date' | 'concept';
/**
 * Extract entities from text using heuristic patterns.
 * This is a lightweight fallback — LLM extraction is preferred.
 */
declare function extractEntities(text: string): string[];
/**
 * Classify an entity into a type using heuristics
 */
declare function classifyEntity(entity: string): EntityType;
/**
 * Find entities shared between two entity lists
 */
declare function findSharedEntities(a: string[], b: string[]): string[];

/**
 * Advanced Retrieval Pipeline
 *
 * Multi-stage retrieval with entity boosting, temporal queries,
 * configurable scoring weights, and diversity filtering.
 */

interface RetrievalConfig {
    /** Number of initial candidates from vector search (default: 50) */
    broadSearchLimit?: number;
    /** Final number of memories to return (default: 15) */
    finalLimit?: number;
    /** Scoring weights */
    weights?: {
        semantic?: number;
        recency?: number;
        confidence?: number;
        accessCount?: number;
        entity?: number;
        importance?: number;
        persistence?: number;
    };
}
interface TemporalDetection {
    isTemporalQuery: boolean;
    timeRange?: {
        start: number;
        end: number;
    };
    field: 'eventTime' | 'createdAt';
}
/**
 * Detect temporal intent in a query string.
 * Returns time ranges for filtering memories.
 */
declare function detectTemporalQuery(query: string): TemporalDetection;
/**
 * Multi-stage retrieval pipeline.
 *
 * 1. Broad semantic search (vector store) or keyword fallback
 * 2. Entity boosting
 * 3. Temporal filtering
 * 4. Composite scoring
 * 5. Diversity filter
 * 6. Return top N
 */
declare function retrieveMemories(query: string, userId: string, config: RetrievalConfig, stores: {
    memory: MemoryStore;
    embeddings?: EmbeddingsAdapter;
    vector?: VectorStore;
}): Promise<MemoryEntry[]>;

/**
 * Memory Consolidation Engine
 *
 * Merges similar memories, detects conflicts, promotes persistence levels,
 * and compresses old episodic memories into semantic summaries.
 */

interface ConsolidationConfig {
    /** Cosine similarity threshold for merging (default: 0.85) */
    similarityThreshold?: number;
    /** Access count threshold for persistence promotion (default: 3) */
    promotionAccessThreshold?: number;
    /** Conversation count threshold for promotion (default: 2) */
    promotionConversationThreshold?: number;
    /** Provider config for LLM-based conflict detection */
    provider?: {
        apiKey: string;
        baseUrl: string;
    };
    /** Model for consolidation LLM calls */
    model?: string;
}
interface ConsolidationResult {
    /** Number of memories merged */
    merged: number;
    /** Number of conflicts detected */
    conflicts: number;
    /** Number of persistence promotions */
    promoted: number;
    /** Number of memories compressed */
    compressed: number;
    /** Details of actions taken */
    details: string[];
}
/**
 * Run memory consolidation for a user.
 *
 * - Finds highly similar memories and merges them
 * - Detects conflicting memories
 * - Promotes persistence levels based on access patterns
 */
declare function consolidateMemories(userId: string, stores: {
    memory: MemoryStore;
    embeddings?: EmbeddingsAdapter;
    vector?: VectorStore;
}, config?: ConsolidationConfig): Promise<ConsolidationResult>;
/**
 * Compress old episodic memories into semantic summaries.
 * Groups related episodic memories and merges them via LLM.
 */
declare function compressMemories(userId: string, stores: {
    memory: MemoryStore;
    embeddings?: EmbeddingsAdapter;
    vector?: VectorStore;
}, config?: ConsolidationConfig & {
    maxAgeDays?: number;
}): Promise<{
    compressed: number;
    details: string[];
}>;

/**
 * Active Forgetting & Decay Engine
 *
 * Implements exponential decay, confidence-based pruning,
 * expiration handling, and access reinforcement.
 */

interface DecayConfig {
    /** Half-life in days for confidence decay (default: 180) */
    halfLifeDays?: number;
    /** Minimum confidence before pruning (default: 0.3) */
    minConfidence?: number;
    /** Grace period after expiration before deletion, in hours (default: 24) */
    expirationGracePeriodHours?: number;
}
interface PruneResult {
    /** Number of memories pruned (deleted) */
    pruned: number;
    /** Number of expired memories removed */
    expired: number;
    /** Details of pruning actions */
    details: string[];
}
/**
 * Calculate the decay-adjusted score for a memory entry.
 * Uses exponential decay based on time since last access.
 *
 * Formula: score *= exp(-ageDays / (halfLife * 1.44))
 * The 1.44 factor converts half-life to the exponential decay constant.
 */
declare function calculateDecayScore(entry: MemoryEntry, config?: DecayConfig): number;
/**
 * Prune low-confidence and expired memories for a user.
 *
 * Rules:
 * - Never prune `longTerm` memories (unless expired)
 * - Prune `shortTerm` if confidence < minConfidence AND age > 90 days
 * - Aggressively prune `ephemeral` if confidence < 0.5 OR age > 30 days
 * - Always delete expired memories past grace period
 */
declare function pruneMemories(userId: string, stores: {
    memory: MemoryStore;
    vector?: VectorStore;
}, config?: DecayConfig): Promise<PruneResult>;
/**
 * Check and remove expired memories.
 * Returns the number of memories removed.
 */
declare function checkExpirations(userId: string, stores: {
    memory: MemoryStore;
    vector?: VectorStore;
}, config?: DecayConfig): Promise<number>;

/**
 * Memory Analytics
 *
 * Calculate statistics and insights about a user's memory store.
 */

interface MemoryStats {
    /** Total number of active memories */
    total: number;
    /** Count by memory type */
    byType: Record<string, number>;
    /** Count by category */
    byCategory: Record<string, number>;
    /** Count by persistence level */
    byPersistence: Record<string, number>;
    /** Average confidence score */
    averageConfidence: number;
    /** Average age in days */
    averageAge: number;
    /** Number of memories expiring within 7 days */
    expiringSoon: number;
    /** Number of memories accessed in the last 7 days */
    recentlyAccessed: number;
    /** Count by source */
    bySource: Record<string, number>;
    /** Total superseded (version history) */
    superseded: number;
}
/**
 * Calculate comprehensive memory statistics.
 */
declare function calculateMemoryStats(memories: MemoryEntry[]): MemoryStats;

interface MemoryAPIConfig {
    workingMemory: WorkingMemoryManager;
    memoryStore: MemoryStore;
    vectorStore?: VectorStore;
    embeddings?: EmbeddingsAdapter;
}
interface HealthStatus {
    status: 'healthy' | 'degraded';
    memoryStore: boolean;
    vectorStore: boolean;
}
/**
 * Create a memory API handler with all CRUD operations.
 */
declare function createMemoryAPIHandler(config: MemoryAPIConfig): {
    /** List memories with optional filtering */
    list(userId: string, filters?: {
        category?: MemoryEntry["category"];
        memoryType?: MemoryEntry["memoryType"];
        persistenceLevel?: MemoryEntry["persistenceLevel"];
        limit?: number;
    }): Promise<MemoryEntry[]>;
    /** Get a single memory by ID */
    get(id: string): Promise<MemoryEntry | null>;
    /** Update a memory entry */
    update(id: string, updates: Partial<MemoryEntry>): Promise<MemoryEntry | null>;
    /** Delete a memory */
    delete(id: string): Promise<void>;
    /** Export all memories for a user */
    export(userId: string): Promise<MemoryEntry[]>;
    /** Import memories for a user with deduplication */
    import(userId: string, entries: MemoryEntry[]): Promise<number>;
    /** Get memory statistics */
    stats(userId: string): Promise<MemoryStats>;
    /** Health check */
    health(): Promise<HealthStatus>;
    /** Run consolidation */
    consolidate(userId: string, consolidationConfig?: ConsolidationConfig): Promise<ConsolidationResult>;
    /** Run pruning */
    prune(userId: string, decayConfig?: DecayConfig): Promise<PruneResult>;
};

/**
 * Knowledge Graph
 *
 * Build and query an entity-relation graph from memories.
 * Enables multi-hop reasoning: "What does the user know about X?"
 */

interface KnowledgeNode {
    /** Unique node ID (derived from entity text) */
    id: string;
    /** Display label */
    label: string;
    /** Entity type */
    type: string;
    /** Memory IDs that reference this entity */
    memoryIds: string[];
}
interface KnowledgeEdge {
    /** Source node ID */
    source: string;
    /** Target node ID */
    target: string;
    /** Relationship type */
    relation: string;
    /** Edge weight (number of shared memories) */
    weight: number;
}
interface KnowledgeGraph {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
}
/**
 * Build a knowledge graph from memory entries.
 *
 * Nodes are entities extracted from memories.
 * Edges connect entities that co-occur in the same memory.
 */
declare function buildKnowledgeGraph(memories: MemoryEntry[]): KnowledgeGraph;
/**
 * Query the knowledge graph starting from an entity.
 * Returns nodes reachable within `hops` edges.
 */
declare function queryGraph(graph: KnowledgeGraph, entity: string, hops?: number): KnowledgeNode[];

/**
 * In-Memory Store
 *
 * In-memory implementations of MemoryStore and VectorStore.
 * For development and testing. Data does not persist across restarts.
 */

/**
 * In-memory implementation of MemoryStore.
 * Stores entries in a Map. Supports keyword-based search.
 */
declare class InMemoryStore implements MemoryStore {
    private entries;
    save(entry: MemoryEntry): Promise<void>;
    get(id: string): Promise<MemoryEntry | null>;
    delete(id: string): Promise<void>;
    listByUser(userId: string, options?: {
        category?: MemoryEntry['category'];
        limit?: number;
    }): Promise<MemoryEntry[]>;
    search(userId: string, query: string, limit?: number): Promise<MemoryEntry[]>;
    /** Clear all entries (for testing) */
    clear(): void;
    /** Get total entry count */
    get size(): number;
}
/**
 * In-memory vector store using cosine similarity.
 * For development and testing only.
 */
declare class InMemoryVectorStore implements VectorStore {
    private vectors;
    upsert(entries: Array<{
        id: string;
        vector: number[];
        metadata: Record<string, unknown>;
    }>): Promise<void>;
    query(vector: number[], topK: number, filter?: Record<string, unknown>): Promise<Array<{
        id: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>>;
    delete(ids: string[]): Promise<void>;
    /** Clear all vectors (for testing) */
    clear(): void;
    /** Get total vector count */
    get size(): number;
}

/**
 * Qdrant Vector Store Adapter
 *
 * Connects SAGE working memory to Qdrant for production-grade
 * semantic similarity search. Uses Qdrant's REST API (no SDK dependency).
 *
 * @example
 * ```typescript
 * const vectorStore = new QdrantVectorStore({
 *   url: 'http://localhost:6333',
 *   collectionName: 'sage_memories',
 * });
 * ```
 */

/**
 * Qdrant configuration
 */
interface QdrantConfig {
    /** Qdrant server URL (e.g., 'http://localhost:6333') */
    url: string;
    /** API key for Qdrant Cloud (optional for local) */
    apiKey?: string;
    /** Collection name to use */
    collectionName: string;
    /** Vector dimensions (auto-detected from first upsert if not set) */
    dimensions?: number;
    /** Distance metric (default: 'Cosine') */
    distance?: 'Cosine' | 'Euclid' | 'Dot';
    /** Request timeout in ms (default: 10000) */
    timeout?: number;
}
/**
 * Qdrant vector store implementation.
 * Uses REST API directly — no @qdrant/js-client-rest dependency needed.
 */
declare class QdrantVectorStore implements VectorStore {
    private config;
    private collectionInitialized;
    constructor(config: QdrantConfig);
    /**
     * Ensure the collection exists, creating it if necessary
     */
    private ensureCollection;
    upsert(entries: Array<{
        id: string;
        vector: number[];
        metadata: Record<string, unknown>;
    }>): Promise<void>;
    query(vector: number[], topK: number, filter?: Record<string, unknown>): Promise<Array<{
        id: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>>;
    delete(ids: string[]): Promise<void>;
    /**
     * Internal fetch with auth headers and timeout
     */
    private fetch;
}

export { CharacterTokenizer, type ConsolidationConfig, type ConsolidationResult, ContextConfig, ContextResult, ContextWindowOptions, type DecayConfig, EmbeddingsAdapter, type EntityType, type HealthStatus, InMemoryStore, InMemoryVectorStore, IntegrityResult, type KnowledgeEdge, type KnowledgeGraph, type KnowledgeNode, type ManageContextOptions, type MemoryAPIConfig, MemoryEntry, type MemoryStats, MemoryStore, type PruneResult, type QdrantConfig, QdrantVectorStore, type RetrievalConfig, SummarizerConfig, SummaryState, type TemporalDetection, Tokenizer, VectorStore, type WindowOptions, WindowResult, WorkingMemoryConfig, WorkingMemoryManager, adjustSplitForToolIntegrity, applyWindow, buildKnowledgeGraph, calculateDecayScore, calculateMemoryStats, checkExpirations, classifyEntity, compressMemories, consolidateMemories, createFallbackSummary, createMemoryAPIHandler, createMemoryTools, createWorkingMemory, detectTemporalQuery, estimateMessageTokens, estimateTokens, estimateTotalTokens, extractEntities, findSharedEntities, getContextWindow, getContextWindows, getTokenizer, manageContext, pruneMemories, queryGraph, registerContextWindow, retrieveMemories, setContextWindows, summarizeMessages, validateToolCallIntegrity, willNeedTruncation };
