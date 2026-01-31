import { a as ConversationRepository, C as Conversation, b as CreateConversation, f as MessageRepository, D as DBMessage, c as CreateMessage, S as SessionRepository, e as DBSession, d as CreateSession, R as Repositories } from '../types-EuCqmFOB.js';
export { A as ActiveToolCall, M as MessageAttachment, g as MessageSource } from '../types-EuCqmFOB.js';
export { C as ConvexClient, a as ConvexConversationRepository, b as ConvexMessageRepository, c as ConvexSessionRepository, d as createConvexRepositories } from '../convex-Crs7d0R-.js';
import { T as ToolCall, d as SessionStatus } from '../types-in3oy7jN.js';
import 'zod';
import '../utils/index.js';

/**
 * Memory Database
 *
 * In-memory implementation of database repositories.
 * Useful for testing and development.
 */

/**
 * In-memory conversation repository
 */
declare class MemoryConversationRepository implements ConversationRepository {
    private conversations;
    list(userId: string): Promise<Conversation[]>;
    getById(id: string): Promise<Conversation | null>;
    create(data: CreateConversation): Promise<Conversation>;
    update(id: string, data: Partial<Conversation>): Promise<void>;
    updateTitle(id: string, title: string): Promise<void>;
    delete(id: string): Promise<void>;
    clear(): void;
}
/**
 * In-memory message repository
 */
declare class MemoryMessageRepository implements MessageRepository {
    private messages;
    getByConversation(conversationId: string): Promise<DBMessage[]>;
    getById(id: string): Promise<DBMessage | null>;
    create(data: CreateMessage): Promise<DBMessage>;
    saveAssistantMessage(data: {
        conversationId: string;
        content: string;
        reasoning?: string;
        toolCalls?: ToolCall[];
        inputTokens?: number;
        outputTokens?: number;
    }): Promise<DBMessage>;
    saveToolMessage(data: {
        conversationId: string;
        toolCallId: string;
        toolName: string;
        content: string;
    }): Promise<DBMessage>;
    clear(): void;
}
/**
 * In-memory session repository
 */
declare class MemorySessionRepository implements SessionRepository {
    private sessions;
    getById(id: string): Promise<DBSession | null>;
    getByStreamId(streamId: string): Promise<DBSession | null>;
    getActive(conversationId: string): Promise<DBSession | null>;
    create(data: CreateSession): Promise<DBSession>;
    updateStatus(id: string, status: SessionStatus, extra?: Partial<DBSession>): Promise<void>;
    complete(id: string, data: {
        assistantMessageId?: string;
        accumulatedContent?: string;
        accumulatedReasoning?: string;
        inputTokens?: number;
        outputTokens?: number;
    }): Promise<void>;
    clear(): void;
}
/**
 * Create in-memory repositories bundle
 */
declare function createMemoryRepositories(): Repositories;

export { Conversation, ConversationRepository, CreateConversation, CreateMessage, CreateSession, DBMessage, DBSession, MemoryConversationRepository, MemoryMessageRepository, MemorySessionRepository, MessageRepository, Repositories, SessionRepository, createMemoryRepositories };
