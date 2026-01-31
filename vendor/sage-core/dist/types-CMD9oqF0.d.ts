import { M as Message } from './types-in3oy7jN.js';

/**
 * Context Engine Types
 *
 * Types for the context management system including token counting,
 * sliding window, summarization, and working memory.
 */

/**
 * Pluggable tokenizer interface.
 * Default implementation uses character heuristic.
 * Apps can plug in tiktoken or any custom tokenizer.
 */
interface Tokenizer {
    /** Count tokens in a string */
    count(text: string): number;
}
/**
 * Options for looking up context window size
 */
interface ContextWindowOptions {
    /** Override the context window size (ignores model lookup) */
    override?: number;
    /** Default fallback if model is not found (default: 128000) */
    defaultSize?: number;
}
/**
 * Budget breakdown for the context window
 */
interface TokenBudget {
    /** Total context window size */
    contextWindow: number;
    /** Tokens used by system prompt */
    systemPrompt: number;
    /** Tokens used by working memory injection */
    workingMemory: number;
    /** Tokens used by existing summary */
    existingSummary: number;
    /** Tokens reserved for max response */
    maxResponse: number;
    /** Tokens available for message history */
    availableForHistory: number;
}
/**
 * Result of applying the sliding window
 */
interface WindowResult {
    /** Messages that fit in the window (most recent) */
    recentMessages: Message[];
    /** Messages that were cut (oldest, need summarization) */
    oldMessages: Message[];
    /** Whether truncation was needed */
    wasTruncated: boolean;
    /** Token budget breakdown */
    budget: TokenBudget;
    /** Estimated tokens used by recent messages */
    recentTokens: number;
}
/**
 * Result of tool call integrity validation
 */
interface IntegrityResult {
    /** Whether the messages are valid (no orphans) */
    valid: boolean;
    /** Adjusted messages with integrity preserved */
    messages: Message[];
    /** Number of adjustments made */
    adjustments: number;
    /** Description of adjustments */
    details: string[];
}
/**
 * State of a conversation summary
 */
interface SummaryState {
    /** The summary text */
    text: string;
    /** ID of the last message included in this summary */
    upToMessageId?: string;
    /** Estimated token count of the summary */
    tokenCount: number;
}
/**
 * Configuration for the summarizer
 */
interface SummarizerConfig {
    /** Model to use for summarization (defaults to main model) */
    model?: string;
    /** Target summary length in tokens */
    targetTokens?: number;
    /** Provider config */
    provider: {
        apiKey: string;
        baseUrl: string;
    };
    /** Custom tokenizer */
    tokenizer?: Tokenizer;
    /** Temperature for summarization (default: 0.3) */
    temperature?: number;
}
/**
 * A single memory entry (fact, preference, instruction, etc.)
 */
interface MemoryEntry {
    /** Unique ID */
    id: string;
    /** User this memory belongs to */
    userId: string;
    /** The memory content */
    content: string;
    /** Category of memory */
    category: 'fact' | 'preference' | 'instruction' | 'context';
    /** Source of the memory */
    source: 'user' | 'agent' | 'system';
    /** Confidence score 0-1 */
    confidence: number;
    /** When the memory was created */
    createdAt: number;
    /** When the memory was last accessed/used */
    lastAccessedAt: number;
    /** Conversation where this was learned (optional) */
    conversationId?: string;
    /** Embedding vector (if embeddings adapter is configured) */
    embedding?: number[];
    /** Memory type classification */
    memoryType?: 'episodic' | 'semantic' | 'procedural' | 'working';
    /** Importance score 0-1 */
    importance?: number;
    /** Persistence level */
    persistenceLevel?: 'ephemeral' | 'shortTerm' | 'longTerm';
    /** When the event/fact occurred (vs createdAt = when stored) */
    eventTime?: number;
    /** Auto-expiration timestamp */
    expiresAt?: number;
    /** Tags for categorization */
    tags?: string[];
    /** Extracted entities (people, places, orgs, concepts) */
    entities?: string[];
    /** Relations to other memories */
    relations?: Array<{
        targetId: string;
        type: string;
    }>;
    /** Version number for conflict resolution */
    version?: number;
    /** Access count for reinforcement */
    accessCount?: number;
    /** ID of memory that supersedes this one */
    supersededBy?: string;
    /** IDs of memories this was derived from (consolidation) */
    derivedFrom?: string[];
}
/**
 * Memory store adapter — CRUD operations for memory persistence.
 * Apps plug in their own backend (Redis, Postgres, Convex, etc.)
 */
interface MemoryStore {
    /** Save a memory entry */
    save(entry: MemoryEntry): Promise<void>;
    /** Retrieve by ID */
    get(id: string): Promise<MemoryEntry | null>;
    /** Delete by ID */
    delete(id: string): Promise<void>;
    /** List all memories for a user */
    listByUser(userId: string, options?: {
        category?: MemoryEntry['category'];
        limit?: number;
    }): Promise<MemoryEntry[]>;
    /** Search memories by text (keyword/fuzzy match) */
    search(userId: string, query: string, limit?: number): Promise<MemoryEntry[]>;
}
/**
 * Embeddings adapter — generate vector embeddings from text.
 * Apps plug in their embedding provider (OpenAI, Cohere, local, etc.)
 */
interface EmbeddingsAdapter {
    /** Generate embedding for a single text */
    embed(text: string): Promise<number[]>;
    /** Generate embeddings for multiple texts */
    embedBatch(texts: string[]): Promise<number[][]>;
    /** Dimension of the embedding vectors */
    dimensions: number;
}
/**
 * Vector store adapter — semantic similarity search.
 * Apps plug in their vector DB (Qdrant, Pinecone, pgvector, etc.)
 */
interface VectorStore {
    /** Upsert vectors with metadata */
    upsert(entries: Array<{
        id: string;
        vector: number[];
        metadata: Record<string, unknown>;
    }>): Promise<void>;
    /** Search by vector similarity */
    query(vector: number[], topK: number, filter?: Record<string, unknown>): Promise<Array<{
        id: string;
        score: number;
        metadata?: Record<string, unknown>;
    }>>;
    /** Delete by IDs */
    delete(ids: string[]): Promise<void>;
}
/**
 * Working memory manager interface
 */
interface WorkingMemoryManager {
    /** Get relevant memories formatted for system prompt injection */
    getContextForPrompt(userId: string, currentMessages: Message[]): Promise<string>;
    /** Extract new memories from a conversation turn */
    extractMemories(userId: string, messages: Message[], assistantResponse: string, conversationId?: string): Promise<MemoryEntry[]>;
    /** Explicit save (for "remember" tool) */
    remember(userId: string, content: string, category?: MemoryEntry['category'], conversationId?: string): Promise<MemoryEntry>;
    /** Explicit recall (for "recall" tool) */
    recall(userId: string, query: string, limit?: number): Promise<MemoryEntry[]>;
    /** Prune low-confidence or stale entries */
    prune(userId: string, options?: {
        maxAge?: number;
        minConfidence?: number;
    }): Promise<number>;
}
/**
 * Working memory configuration
 */
interface WorkingMemoryConfig {
    /** Enable working memory */
    enabled: boolean;
    /** Auto-extract memories after each turn */
    autoExtract?: boolean;
    /** Model for memory extraction (defaults to main model) */
    extractionModel?: string;
    /** Max memories to inject into prompt */
    maxMemoriesInPrompt?: number;
    /** Memory store adapter */
    store: MemoryStore;
    /** Embeddings adapter (optional — enables semantic search) */
    embeddings?: EmbeddingsAdapter;
    /** Vector store adapter (optional — enables semantic search) */
    vectorStore?: VectorStore;
    /** Provider config for extraction LLM calls */
    provider?: {
        apiKey: string;
        baseUrl: string;
    };
}
/**
 * Full context engine configuration
 */
interface ContextConfig {
    /** Model name for context window lookup */
    model: string;
    /** Override context window size */
    contextWindow?: number;
    /** Max tokens reserved for response */
    maxResponseTokens: number;
    /** Summarizer configuration */
    summary?: SummarizerConfig;
    /** Working memory manager */
    workingMemory?: WorkingMemoryManager;
    /** Custom tokenizer */
    tokenizer?: Tokenizer;
}
/**
 * Result of the context management pipeline
 */
interface ContextResult {
    /** Messages to send to LLM (windowed, integrity-checked) */
    messages: Message[];
    /** Enriched system prompt (with summary + memory) */
    systemPrompt: string;
    /** Estimated total tokens (system + messages) */
    estimatedTokens: number;
    /** Whether truncation was needed */
    wasTruncated: boolean;
    /** New summary state (if summarization happened) */
    newSummary?: SummaryState;
    /** Number of messages that were summarized */
    summarizedMessageCount: number;
    /** Token budget breakdown */
    budget: TokenBudget;
}

export type { ContextConfig as C, EmbeddingsAdapter as E, IntegrityResult as I, MemoryEntry as M, SummarizerConfig as S, TokenBudget as T, VectorStore as V, WindowResult as W, ContextResult as a, ContextWindowOptions as b, MemoryStore as c, SummaryState as d, Tokenizer as e, WorkingMemoryConfig as f, WorkingMemoryManager as g };
