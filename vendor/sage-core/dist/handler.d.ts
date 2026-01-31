import { g as WorkingMemoryManager, c as MemoryStore, V as VectorStore, C as ContextConfig, E as EmbeddingsAdapter } from './types-CMD9oqF0.js';
import { a as SageConfig } from './types-in3oy7jN.js';
import { a as StreamStore } from './types-CKoo0gcf.js';
import { b as ToolRegistry } from './types-BpZ5RLfX.js';
import { R as Repositories } from './types-EuCqmFOB.js';
import { C as ConvexClient } from './convex-Crs7d0R-.js';
import 'zod';
import './utils/index.js';

/**
 * Handler context with initialized components
 */
interface HandlerContext {
    config: SageConfig;
    streamStore: StreamStore;
    tools: ToolRegistry;
    repositories: Repositories;
    workingMemory?: WorkingMemoryManager;
    memoryStore?: MemoryStore;
    vectorStore?: VectorStore;
    contextConfig?: ContextConfig;
}
/**
 * Options for initializing SAGE
 */
interface InitializeOptions {
    convexClient?: ConvexClient;
    /** Custom memory store (default: InMemoryStore) */
    memoryStore?: MemoryStore;
    /** Custom vector store for semantic search */
    vectorStore?: VectorStore;
    /** Custom embeddings adapter for semantic search */
    embeddings?: EmbeddingsAdapter;
}
/**
 * Initialize SAGE components from config
 */
declare function initializeSage(config: SageConfig, options?: InitializeOptions): Promise<HandlerContext>;
/**
 * Chat request body
 */
interface ChatRequest {
    conversationId: string;
    message: string;
    userId: string;
    attachments?: Array<{
        type: 'image' | 'pdf' | 'file';
        url: string;
        name?: string;
    }>;
}
/**
 * Chat response
 */
interface ChatResponse {
    sessionId: string;
    streamId: string;
    conversationId: string;
}
/**
 * Handler options
 */
interface HandlerOptions {
    convexClient?: ConvexClient;
}
/**
 * Create a chat handler for Next.js API routes
 *
 * @example
 * ```typescript
 * // app/api/chat/route.ts
 * import { createChatHandler } from '@sage/core';
 * import config from '@/sage.config';
 *
 * export const POST = createChatHandler(config);
 *
 * // With Convex client:
 * import { ConvexHttpClient } from 'convex/browser';
 * const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
 * export const POST = createChatHandler(config, { convexClient: convex });
 * ```
 */
declare function createChatHandler(config: SageConfig, options?: HandlerOptions): (request: Request) => Promise<Response>;
/**
 * Create a stream reader handler for Next.js API routes
 *
 * @example
 * ```typescript
 * // app/api/chat/stream/route.ts
 * import { createStreamHandler } from '@sage/core';
 * import config from '@/sage.config';
 *
 * export const GET = createStreamHandler(config);
 * ```
 */
declare function createStreamHandler(config: SageConfig, options?: HandlerOptions): (request: Request) => Promise<Response>;

export { type ChatRequest, type ChatResponse, type HandlerContext, type HandlerOptions, type InitializeOptions, createChatHandler, createStreamHandler, initializeSage };
