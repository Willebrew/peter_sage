"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/db/index.ts
var db_exports = {};
__export(db_exports, {
  ConvexConversationRepository: () => ConvexConversationRepository,
  ConvexMessageRepository: () => ConvexMessageRepository,
  ConvexSessionRepository: () => ConvexSessionRepository,
  MemoryConversationRepository: () => MemoryConversationRepository,
  MemoryMessageRepository: () => MemoryMessageRepository,
  MemorySessionRepository: () => MemorySessionRepository,
  createConvexRepositories: () => createConvexRepositories,
  createMemoryRepositories: () => createMemoryRepositories
});
module.exports = __toCommonJS(db_exports);

// src/db/convex.ts
var ConvexConversationRepository = class {
  constructor(client) {
    this.client = client;
  }
  async list(userId) {
    return this.client.query("conversations:list", { userId });
  }
  async getById(id) {
    return this.client.query("conversations:getById", { id });
  }
  async create(data) {
    return this.client.mutation("conversations:create", data);
  }
  async update(id, data) {
    await this.client.mutation("conversations:update", { id, ...data });
  }
  async updateTitle(id, title) {
    await this.client.mutation("conversations:updateTitle", { id, title });
  }
  async delete(id) {
    await this.client.mutation("conversations:delete", { id });
  }
};
var ConvexMessageRepository = class {
  constructor(client) {
    this.client = client;
  }
  async getByConversation(conversationId) {
    return this.client.query("messages:getByConversation", { conversationId });
  }
  async getById(id) {
    return this.client.query("messages:getById", { id });
  }
  async create(data) {
    return this.client.mutation("messages:create", data);
  }
  async saveAssistantMessage(data) {
    return this.client.mutation("messages:saveAssistant", data);
  }
  async saveToolMessage(data) {
    return this.client.mutation("messages:saveTool", data);
  }
};
var ConvexSessionRepository = class {
  constructor(client) {
    this.client = client;
  }
  async getById(id) {
    return this.client.query("sessions:getById", { id });
  }
  async getByStreamId(streamId) {
    return this.client.query("sessions:getByStreamId", { streamId });
  }
  async getActive(conversationId) {
    return this.client.query("sessions:getActive", { conversationId });
  }
  async create(data) {
    return this.client.mutation("sessions:create", data);
  }
  async updateStatus(id, status, extra) {
    await this.client.mutation("sessions:updateStatus", { id, status, ...extra });
  }
  async complete(id, data) {
    await this.client.mutation("sessions:complete", { id, ...data });
  }
};
function createConvexRepositories(client) {
  return {
    conversations: new ConvexConversationRepository(client),
    messages: new ConvexMessageRepository(client),
    sessions: new ConvexSessionRepository(client)
  };
}

// src/db/memory.ts
var import_crypto = require("crypto");
var MemoryConversationRepository = class {
  conversations = /* @__PURE__ */ new Map();
  async list(userId) {
    return Array.from(this.conversations.values()).filter((c) => c.userId === userId).sort((a, b) => b.updatedAt - a.updatedAt);
  }
  async getById(id) {
    return this.conversations.get(id) || null;
  }
  async create(data) {
    const now = Date.now();
    const conversation = {
      id: (0, import_crypto.randomUUID)(),
      userId: data.userId,
      title: data.title,
      projectId: data.projectId,
      isPinned: false,
      createdAt: now,
      updatedAt: now
    };
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }
  async update(id, data) {
    const existing = this.conversations.get(id);
    if (existing) {
      this.conversations.set(id, {
        ...existing,
        ...data,
        updatedAt: Date.now()
      });
    }
  }
  async updateTitle(id, title) {
    await this.update(id, { title });
  }
  async delete(id) {
    this.conversations.delete(id);
  }
  clear() {
    this.conversations.clear();
  }
};
var MemoryMessageRepository = class {
  messages = /* @__PURE__ */ new Map();
  async getByConversation(conversationId) {
    return Array.from(this.messages.values()).filter((m) => m.conversationId === conversationId).sort((a, b) => a.createdAt - b.createdAt);
  }
  async getById(id) {
    return this.messages.get(id) || null;
  }
  async create(data) {
    const message = {
      id: (0, import_crypto.randomUUID)(),
      conversationId: data.conversationId,
      role: data.role,
      content: data.content,
      reasoning: data.reasoning,
      toolCalls: data.toolCalls,
      toolCallId: data.toolCallId,
      createdAt: Date.now(),
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens,
      sources: data.sources,
      attachments: data.attachments
    };
    this.messages.set(message.id, message);
    return message;
  }
  async saveAssistantMessage(data) {
    return this.create({
      conversationId: data.conversationId,
      role: "assistant",
      content: data.content,
      reasoning: data.reasoning,
      toolCalls: data.toolCalls,
      inputTokens: data.inputTokens,
      outputTokens: data.outputTokens
    });
  }
  async saveToolMessage(data) {
    return this.create({
      conversationId: data.conversationId,
      role: "tool",
      content: data.content,
      toolCallId: data.toolCallId
    });
  }
  clear() {
    this.messages.clear();
  }
};
var MemorySessionRepository = class {
  sessions = /* @__PURE__ */ new Map();
  async getById(id) {
    return this.sessions.get(id) || null;
  }
  async getByStreamId(streamId) {
    return Array.from(this.sessions.values()).find((s) => s.streamId === streamId) || null;
  }
  async getActive(conversationId) {
    return Array.from(this.sessions.values()).find(
      (s) => s.conversationId === conversationId && (s.status === "pending" || s.status === "running" || s.status === "tool_loop")
    ) || null;
  }
  async create(data) {
    const now = Date.now();
    const session = {
      id: (0, import_crypto.randomUUID)(),
      conversationId: data.conversationId,
      userId: data.userId,
      streamId: data.streamId,
      status: "pending",
      toolLoopDepth: 0,
      createdAt: now,
      lastActivityAt: now
    };
    this.sessions.set(session.id, session);
    return session;
  }
  async updateStatus(id, status, extra) {
    const existing = this.sessions.get(id);
    if (existing) {
      this.sessions.set(id, {
        ...existing,
        ...extra,
        status,
        lastActivityAt: Date.now()
      });
    }
  }
  async complete(id, data) {
    const existing = this.sessions.get(id);
    if (existing) {
      this.sessions.set(id, {
        ...existing,
        ...data,
        status: "completed",
        completedAt: Date.now(),
        lastActivityAt: Date.now()
      });
    }
  }
  clear() {
    this.sessions.clear();
  }
};
function createMemoryRepositories() {
  return {
    conversations: new MemoryConversationRepository(),
    messages: new MemoryMessageRepository(),
    sessions: new MemorySessionRepository()
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ConvexConversationRepository,
  ConvexMessageRepository,
  ConvexSessionRepository,
  MemoryConversationRepository,
  MemoryMessageRepository,
  MemorySessionRepository,
  createConvexRepositories,
  createMemoryRepositories
});
//# sourceMappingURL=index.js.map