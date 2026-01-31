import { M as Message, T as ToolCall, c as Session, d as SessionStatus } from './types-CJxL2WlO.mjs';

/**
 * Database Types
 */

/**
 * Conversation entity
 */
interface Conversation {
    id: string;
    userId: string;
    title?: string;
    projectId?: string;
    isPinned: boolean;
    createdAt: number;
    updatedAt: number;
    contextSummary?: string;
}
/**
 * Create conversation input
 */
interface CreateConversation {
    userId: string;
    title?: string;
    projectId?: string;
}
/**
 * Message entity (extends core Message)
 */
interface DBMessage extends Message {
    id: string;
    conversationId: string;
    createdAt: number;
    inputTokens?: number;
    outputTokens?: number;
    sources?: MessageSource[];
    attachments?: MessageAttachment[];
}
/**
 * Message source (for citations)
 */
interface MessageSource {
    title: string;
    url: string;
    snippet: string;
    domain: string;
}
/**
 * Message attachment
 */
interface MessageAttachment {
    type: 'image' | 'pdf' | 'file';
    url: string;
    name?: string;
    mimeType?: string;
}
/**
 * Create message input
 */
interface CreateMessage {
    conversationId: string;
    role: Message['role'];
    content: string;
    reasoning?: string;
    toolCalls?: ToolCall[];
    toolCallId?: string;
    inputTokens?: number;
    outputTokens?: number;
    sources?: MessageSource[];
    attachments?: MessageAttachment[];
}
/**
 * Session entity (extends core Session)
 */
interface DBSession extends Session {
    assistantMessageId?: string;
    accumulatedContent?: string;
    accumulatedReasoning?: string;
    inputTokens?: number;
    outputTokens?: number;
    activeToolCalls?: ActiveToolCall[];
    lastActivityAt: number;
}
/**
 * Active tool call in session
 */
interface ActiveToolCall {
    id: string;
    name: string;
    arguments: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
}
/**
 * Create session input
 */
interface CreateSession {
    conversationId: string;
    userId: string;
    streamId: string;
}
/**
 * Conversation repository interface
 */
interface ConversationRepository {
    list(userId: string): Promise<Conversation[]>;
    getById(id: string): Promise<Conversation | null>;
    create(data: CreateConversation): Promise<Conversation>;
    update(id: string, data: Partial<Conversation>): Promise<void>;
    updateTitle(id: string, title: string): Promise<void>;
    delete(id: string): Promise<void>;
}
/**
 * Message repository interface
 */
interface MessageRepository {
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
 * Session repository interface
 */
interface SessionRepository {
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
 * Database repositories bundle
 */
interface Repositories {
    conversations: ConversationRepository;
    messages: MessageRepository;
    sessions: SessionRepository;
}

export type { ActiveToolCall as A, Conversation as C, DBMessage as D, MessageAttachment as M, Repositories as R, SessionRepository as S, ConversationRepository as a, CreateConversation as b, CreateMessage as c, CreateSession as d, DBSession as e, MessageRepository as f, MessageSource as g };
