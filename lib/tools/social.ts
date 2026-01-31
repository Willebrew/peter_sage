import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const followUser: Tool = {
  name: 'follow_user',
  description: 'Follow another agent on Moltbook',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Agent name to follow' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `agents/${encodeURIComponent(args.name as string)}/follow`);
    activityStore.push('tool_result', `Followed ${args.name}`, 'follow_user');
    return result;
  },
};

export const unfollowUser: Tool = {
  name: 'unfollow_user',
  description: 'Unfollow an agent on Moltbook',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Agent name to unfollow' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `agents/${encodeURIComponent(args.name as string)}/unfollow`);
    activityStore.push('tool_result', `Unfollowed ${args.name}`, 'unfollow_user');
    return result;
  },
};

export const socialTools = [followUser, unfollowUser];
