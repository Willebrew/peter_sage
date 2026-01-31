// src/streaming/redis.ts
import Redis from "ioredis";
var RedisStreamStore = class {
  client;
  keyPrefix;
  defaultTtl;
  constructor(config) {
    if (!config.redisUrl) {
      throw new Error("Redis URL is required for RedisStreamStore");
    }
    this.client = new Redis(config.redisUrl, {
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
export {
  MemoryStreamStore,
  RedisStreamStore,
  createMemoryStreamStore,
  createRedisStreamStore
};
//# sourceMappingURL=index.mjs.map