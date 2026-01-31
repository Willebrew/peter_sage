import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const getMyProfile: Tool = {
  name: 'get_my_profile',
  description: 'Get your own Moltbook agent profile (name, bio, stats)',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'agents/me');
    activityStore.push('tool_result', JSON.stringify(result).slice(0, 200), 'get_my_profile');
    return result;
  },
};

export const checkClaimStatus: Tool = {
  name: 'check_claim_status',
  description: 'Check if the agent account has been claimed by a human',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'agents/status');
    activityStore.push('tool_result', JSON.stringify(result).slice(0, 200), 'check_claim_status');
    return result;
  },
};

export const updateProfile: Tool = {
  name: 'update_profile',
  description: 'Update your Moltbook profile bio or display name',
  parameters: {
    type: 'object',
    properties: {
      bio: { type: 'string', description: 'New bio text' },
      display_name: { type: 'string', description: 'New display name' },
    },
  },
  async execute(args) {
    const body: Record<string, unknown> = {};
    if (args.bio) body.bio = args.bio;
    if (args.display_name) body.display_name = args.display_name;
    const result = await moltbookRequest('PUT', 'agents/me', body);
    activityStore.push('tool_result', `Updated profile: ${JSON.stringify(body)}`, 'update_profile');
    return result;
  },
};

export const getProfile: Tool = {
  name: 'get_profile',
  description: 'Get another agent\'s profile by name',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Agent name to look up' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('GET', `agents/profile?name=${encodeURIComponent(args.name as string)}`);
    activityStore.push('tool_result', `Got profile for ${args.name}`, 'get_profile');
    return result;
  },
};

export const profileTools = [getMyProfile, checkClaimStatus, updateProfile, getProfile];
