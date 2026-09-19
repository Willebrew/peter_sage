import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const checkDMActivity: Tool = {
  name: 'check_dm_activity',
  description: 'Check for DM activity - pending requests and unread messages. Use in heartbeat.',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'agents/dm/check');
    activityStore.push('tool_result', `Checked DM activity: ${result.has_activity ? 'Activity detected' : 'No activity'}`, 'check_dm_activity');
    return result;
  },
};

export const viewDMRequests: Tool = {
  name: 'view_dm_requests',
  description: 'View pending DM requests from other agents',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'agents/dm/requests');
    activityStore.push('tool_result', 'Viewed DM requests', 'view_dm_requests');
    return result;
  },
};

export const approveDMRequest: Tool = {
  name: 'approve_dm_request',
  description: 'Approve a pending DM request from another agent',
  parameters: {
    type: 'object',
    properties: {
      conversation_id: { type: 'string', description: 'The conversation ID to approve' },
    },
    required: ['conversation_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `agents/dm/requests/${args.conversation_id}/approve`);
    activityStore.push('tool_result', `Approved DM request ${args.conversation_id}`, 'approve_dm_request');
    return result;
  },
};

export const rejectDMRequest: Tool = {
  name: 'reject_dm_request',
  description: 'Reject a pending DM request. Optionally block future requests.',
  parameters: {
    type: 'object',
    properties: {
      conversation_id: { type: 'string', description: 'The conversation ID to reject' },
      block: { type: 'boolean', description: 'If true, block future requests from this agent' },
    },
    required: ['conversation_id'],
  },
  async execute(args) {
    const body: Record<string, unknown> = {};
    if (args.block) body.block = true;
    const result = await moltbookRequest('POST', `agents/dm/requests/${args.conversation_id}/reject`, body);
    activityStore.push('tool_result', `Rejected DM request ${args.conversation_id}${args.block ? ' (blocked)' : ''}`, 'reject_dm_request');
    return result;
  },
};

export const sendDMRequest: Tool = {
  name: 'send_dm_request',
  description: 'Send a DM request to another agent. Use bot name OR owner X handle.',
  parameters: {
    type: 'object',
    properties: {
      to: { type: 'string', description: 'Bot name to message (if not using to_owner)' },
      to_owner: { type: 'string', description: 'X handle of owner (with or without @) (if not using to)' },
      message: { type: 'string', description: 'Why you want to chat (10-1000 chars)' },
    },
    required: ['message'],
  },
  async execute(args) {
    const body: Record<string, unknown> = { message: args.message };
    if (args.to) body.to = args.to;
    if (args.to_owner) body.to_owner = args.to_owner;
    const result = await moltbookRequest('POST', 'agents/dm/request', body);
    activityStore.push('tool_result', `Sent DM request to ${args.to || args.to_owner}`, 'send_dm_request');
    return result;
  },
};

export const listConversations: Tool = {
  name: 'list_conversations',
  description: 'List all active DM conversations',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'agents/dm/conversations');
    activityStore.push('tool_result', 'Listed DM conversations', 'list_conversations');
    return result;
  },
};

export const readConversation: Tool = {
  name: 'read_conversation',
  description: 'Read messages in a conversation. Marks messages as read.',
  parameters: {
    type: 'object',
    properties: {
      conversation_id: { type: 'string', description: 'Conversation ID to read' },
    },
    required: ['conversation_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('GET', `agents/dm/conversations/${args.conversation_id}`);
    activityStore.push('tool_result', `Read conversation ${args.conversation_id}`, 'read_conversation');
    return result;
  },
};

export const sendDM: Tool = {
  name: 'send_dm',
  description: 'Send a message in an existing conversation. Set needs_human_input to escalate to the other human.',
  parameters: {
    type: 'object',
    properties: {
      conversation_id: { type: 'string', description: 'Conversation ID' },
      message: { type: 'string', description: 'Message content' },
      needs_human_input: { type: 'boolean', description: 'If true, flags that the other human should respond' },
    },
    required: ['conversation_id', 'message'],
  },
  async execute(args) {
    const body: Record<string, unknown> = { message: args.message };
    if (args.needs_human_input) body.needs_human_input = true;
    const result = await moltbookRequest('POST', `agents/dm/conversations/${args.conversation_id}/send`, body);
    activityStore.push('tool_result', `Sent DM in ${args.conversation_id}${args.needs_human_input ? ' (needs human)' : ''}`, 'send_dm');
    return result;
  },
};

export const messagingTools = [
  checkDMActivity,
  viewDMRequests,
  approveDMRequest,
  rejectDMRequest,
  sendDMRequest,
  listConversations,
  readConversation,
  sendDM,
];
