import { e as StreamChunk, g as StreamEntry, d as SessionStatus } from './types-CJxL2WlO.mjs';

/**
 * Streaming Types
 */

/**
 * Stream store interface - abstraction over Redis/memory
 */
interface StreamStore {
    /**
     * Append a chunk to the stream
     * @returns The entry ID
     */
    append(streamId: string, chunk: StreamChunk): Promise<string>;
    /**
     * Read chunks from the stream
     * @param streamId Stream identifier
     * @param fromId Read entries after this ID (exclusive)
     * @param count Maximum number of entries to read
     */
    read(streamId: string, fromId: string, count?: number): Promise<StreamEntry[]>;
    /**
     * Get stream metadata
     */
    getMeta(streamId: string): Promise<StreamMeta | null>;
    /**
     * Set stream metadata
     */
    setMeta(streamId: string, meta: StreamMeta): Promise<void>;
    /**
     * Delete a stream
     */
    delete(streamId: string): Promise<void>;
    /**
     * Check if a stream exists
     */
    exists(streamId: string): Promise<boolean>;
    /**
     * Close the connection (for Redis)
     */
    close(): Promise<void>;
}
/**
 * Stream metadata
 */
interface StreamMeta {
    sessionId: string;
    conversationId: string;
    userId: string;
    status: SessionStatus;
    createdAt: number;
    completedAt?: number;
    error?: string;
}
/**
 * Configuration for stream stores
 */
interface StreamStoreConfig {
    provider: 'redis' | 'memory';
    redisUrl?: string;
    keyPrefix?: string;
    defaultTtl?: number;
}
/**
 * Factory function type for creating stream stores
 */
type CreateStreamStore = (config: StreamStoreConfig) => StreamStore;

export type { CreateStreamStore as C, StreamMeta as S, StreamStore as a, StreamStoreConfig as b };
