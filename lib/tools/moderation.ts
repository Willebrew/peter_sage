import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

// Post moderation

export const pinPost: Tool = {
  name: 'pin_post',
  description: 'Pin a post (max 3 pins per submolt). Requires moderator/owner role.',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID to pin' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `posts/${args.post_id}/pin`);
    activityStore.push('tool_result', `Pinned post ${args.post_id}`, 'pin_post');
    return result;
  },
};

export const unpinPost: Tool = {
  name: 'unpin_post',
  description: 'Unpin a post. Requires moderator/owner role.',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID to unpin' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('DELETE', `posts/${args.post_id}/pin`);
    activityStore.push('tool_result', `Unpinned post ${args.post_id}`, 'unpin_post');
    return result;
  },
};

// Submolt moderation

export const updateSubmoltSettings: Tool = {
  name: 'update_submolt_settings',
  description: 'Update submolt description, colors, or other settings. Requires owner/mod role.',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Submolt name' },
      description: { type: 'string', description: 'New description' },
      banner_color: { type: 'string', description: 'Banner color hex (e.g. #1a1a2e)' },
      theme_color: { type: 'string', description: 'Theme color hex (e.g. #ff4500)' },
      display_name: { type: 'string', description: 'New display name' },
    },
    required: ['name'],
  },
  async execute(args) {
    const body: Record<string, unknown> = {};
    if (args.description) body.description = args.description;
    if (args.banner_color) body.banner_color = args.banner_color;
    if (args.theme_color) body.theme_color = args.theme_color;
    if (args.display_name) body.display_name = args.display_name;
    const result = await moltbookRequest('PATCH', `submolts/${encodeURIComponent(args.name as string)}/settings`, body);
    activityStore.push('tool_result', `Updated settings for m/${args.name}`, 'update_submolt_settings');
    return result;
  },
};

export const addModerator: Tool = {
  name: 'add_moderator',
  description: 'Add a moderator to a submolt. Owner only.',
  parameters: {
    type: 'object',
    properties: {
      submolt_name: { type: 'string', description: 'Submolt name' },
      agent_name: { type: 'string', description: 'Agent name to add as moderator' },
      role: { type: 'string', description: 'Role: "moderator" (default)' },
    },
    required: ['submolt_name', 'agent_name'],
  },
  async execute(args) {
    const body: Record<string, unknown> = { agent_name: args.agent_name };
    if (args.role) body.role = args.role;
    const result = await moltbookRequest('POST', `submolts/${encodeURIComponent(args.submolt_name as string)}/moderators`, body);
    activityStore.push('tool_result', `Added ${args.agent_name} as mod to m/${args.submolt_name}`, 'add_moderator');
    return result;
  },
};

export const removeModerator: Tool = {
  name: 'remove_moderator',
  description: 'Remove a moderator from a submolt. Owner only.',
  parameters: {
    type: 'object',
    properties: {
      submolt_name: { type: 'string', description: 'Submolt name' },
      agent_name: { type: 'string', description: 'Agent name to remove as moderator' },
    },
    required: ['submolt_name', 'agent_name'],
  },
  async execute(args) {
    const body: Record<string, unknown> = { agent_name: args.agent_name };
    const result = await moltbookRequest('DELETE', `submolts/${encodeURIComponent(args.submolt_name as string)}/moderators`, body);
    activityStore.push('tool_result', `Removed ${args.agent_name} as mod from m/${args.submolt_name}`, 'remove_moderator');
    return result;
  },
};

export const listModerators: Tool = {
  name: 'list_moderators',
  description: 'List all moderators for a submolt.',
  parameters: {
    type: 'object',
    properties: {
      submolt_name: { type: 'string', description: 'Submolt name' },
    },
    required: ['submolt_name'],
  },
  async execute(args) {
    const result = await moltbookRequest('GET', `submolts/${encodeURIComponent(args.submolt_name as string)}/moderators`);
    activityStore.push('tool_result', `Listed mods for m/${args.submolt_name}`, 'list_moderators');
    return result;
  },
};

export const moderationTools = [
  pinPost,
  unpinPost,
  updateSubmoltSettings,
  addModerator,
  removeModerator,
  listModerators,
];
