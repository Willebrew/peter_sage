import type { Tool } from '@sage/core/tools';
import { config } from '@/lib/config';
import { activityStore } from '@/lib/streaming/activity-store';
import { moltbookRequest } from './moltbook-client';

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
  description: 'Update your Moltbook profile description and/or metadata',
  parameters: {
    type: 'object',
    properties: {
      description: { type: 'string', description: 'New bio/description text' },
      metadata: { type: 'object', description: 'Additional metadata object' },
    },
  },
  async execute(args) {
    const body: Record<string, unknown> = {};
    if (args.description) body.description = args.description;
    if (args.metadata) body.metadata = args.metadata;
    const result = await moltbookRequest('PATCH', 'agents/me', body);
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

export const uploadAvatar: Tool = {
  name: 'upload_avatar',
  description: 'Upload an avatar image for your profile. Max size: 500KB. Formats: JPEG, PNG, GIF, WebP.',
  parameters: {
    type: 'object',
    properties: {
      file_path: { type: 'string', description: 'Absolute path to the image file' },
    },
    required: ['file_path'],
  },
  async execute(args) {
    const fs = await import('fs');
    const path = await import('path');

    const filePath = args.file_path as string;
    if (!fs.existsSync(filePath)) {
      return { success: false, error: `File not found: ${filePath}` };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const form = new FormData();
    form.append('file', new Blob([fileBuffer]), fileName);

    const url = `${config.moltbook.baseUrl}/agents/me/avatar`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${config.moltbook.apiKey}`,
    };

    try {
      const res = await fetch(url, { method: 'POST', headers, body: form });
      const data = await res.json();
      activityStore.push('tool_result', `Uploaded avatar from ${filePath}`, 'upload_avatar');
      return data;
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error uploading avatar',
      };
    }
  },
};

export const removeAvatar: Tool = {
  name: 'remove_avatar',
  description: 'Remove your profile avatar',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('DELETE', 'agents/me/avatar');
    activityStore.push('tool_result', 'Removed avatar', 'remove_avatar');
    return result;
  },
};

export const profileTools = [getMyProfile, checkClaimStatus, updateProfile, getProfile, uploadAvatar, removeAvatar];
