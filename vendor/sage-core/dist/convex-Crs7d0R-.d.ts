import { a as ConversationRepository, C as Conversation, b as CreateConversation, f as MessageRepository, D as DBMessage, c as CreateMessage, S as SessionRepository, e as DBSession, d as CreateSession, R as Repositories } from './types-EuCqmFOB.js';
import { T as ToolCall, d as SessionStatus } from './types-in3oy7jN.js';

/**
 * Convex Database Implementation
 *
 * Repository implementations using Convex as the backend.
 * Requires the Convex client to be set up in the consuming app.
 */

/**
 * Convex client interface
 * The actual client is provided by the consuming app
 */
interface ConvexClient {
    query<T>(name: string, args: Record<string, unknown>): Promise<T>;
    mutation<T>(name: string, args: Record<string, unknown>): Promise<T>;
    action<T>(name: string, args: Record<string, unknown>): Promise<T>;
}
/**
 * Convex conversation repository
 */
declare class ConvexConversationRepository implements ConversationRepository {
    private client;
    constructor(client: ConvexClient);
    list(userId: string): Promise<Conversation[]>;
    getById(id: string): Promise<Conversation | null>;
    create(data: CreateConversation): Promise<Conversation>;
    update(id: string, data: Partial<Conversation>): Promise<void>;
    updateTitle(id: string, title: string): Promise<void>;
    delete(id: string): Promise<void>;
}
/**
 * Convex message repository
 */
declare class ConvexMessageRepository implements MessageRepository {
    private client;
    constructor(client: ConvexClient);
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
}
/**
 * Convex session repository
 */
declare class ConvexSessionRepository implements SessionRepository {
    private client;
    constructor(client: ConvexClient);
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
}
/**
 * Create Convex repositories bundle
 */
declare function createConvexRepositories(client: ConvexClient): Repositories;

export { type ConvexClient as C, ConvexConversationRepository as a, ConvexMessageRepository as b, ConvexSessionRepository as c, createConvexRepositories as d };
