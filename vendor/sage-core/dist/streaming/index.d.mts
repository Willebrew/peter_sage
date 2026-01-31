import { a as StreamStore, b as StreamStoreConfig, S as StreamMeta } from '../types-DIKLxiR9.mjs';
export { C as CreateStreamStore } from '../types-DIKLxiR9.mjs';
import { e as StreamChunk, g as StreamEntry } from '../types-CJxL2WlO.mjs';
import 'zod';
import '../utils/index.mjs';

/**
 * Redis Stream Store
 *
 * Uses Redis Streams for reliable, ordered token streaming.
 * Extracted from Stratus redis-store.ts.
 */

/**
 * Redis-backed stream store implementation
 */
declare class RedisStreamStore implements StreamStore {
    private client;
    private keyPrefix;
    private defaultTtl;
    constructor(config: StreamStoreConfig);
    /**
     * Get the stream key for a given stream ID
     */
    private streamKey;
    /**
     * Get the metadata key for a given stream ID
     */
    private metaKey;
    /**
     * Append a chunk to the stream
     */
    append(streamId: string, chunk: StreamChunk): Promise<string>;
    /**
     * Read chunks from the stream
     */
    read(streamId: string, fromId?: string, count?: number): Promise<StreamEntry[]>;
    /**
     * Get stream metadata
     */
    getMeta(streamId: string): Promise<StreamMeta | null>;
    /**
     * Set stream metadata
     */
    setMeta(streamId: string, meta: StreamMeta): Promise<void>;
    /**
     * Delete a stream and its metadata
     */
    delete(streamId: string): Promise<void>;
    /**
     * Check if a stream exists
     */
    exists(streamId: string): Promise<boolean>;
    /**
     * Close the connection
     */
    close(): Promise<void>;
}
/**
 * Create a Redis stream store instance
 */
declare function createRedisStreamStore(redisUrl: string, options?: Partial<StreamStoreConfig>): StreamStore;

/**
 * Memory Stream Store
 *
 * In-memory stream store for local development and testing.
 * Does not persist across restarts.
 */

/**
 * In-memory stream store implementation
 */
declare class MemoryStreamStore implements StreamStore {
    private streams;
    private metadata;
    private counter;
    /**
     * Generate a unique entry ID (similar to Redis format)
     */
    private generateId;
    /**
     * Append a chunk to the stream
     */
    append(streamId: string, chunk: StreamChunk): Promise<string>;
    /**
     * Read chunks from the stream
     */
    read(streamId: string, fromId?: string, count?: number): Promise<StreamEntry[]>;
    /**
     * Get stream metadata
     */
    getMeta(streamId: string): Promise<StreamMeta | null>;
    /**
     * Set stream metadata
     */
    setMeta(streamId: string, meta: StreamMeta): Promise<void>;
    /**
     * Delete a stream and its metadata
     */
    delete(streamId: string): Promise<void>;
    /**
     * Check if a stream exists
     */
    exists(streamId: string): Promise<boolean>;
    /**
     * Close the connection (no-op for memory store)
     */
    close(): Promise<void>;
    /**
     * Clear all streams (useful for testing)
     */
    clear(): void;
    /**
     * Get the number of streams
     */
    get size(): number;
}
/**
 * Create a memory stream store instance
 */
declare function createMemoryStreamStore(): StreamStore;

export { MemoryStreamStore, RedisStreamStore, StreamMeta, StreamStore, StreamStoreConfig, createMemoryStreamStore, createRedisStreamStore };
