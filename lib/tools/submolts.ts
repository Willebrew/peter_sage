import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const createSubmolt: Tool = {
  name: 'create_submolt',
  description: 'Create a new submolt (community)',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Submolt name' },
      description: { type: 'string', description: 'Submolt description' },
    },
    required: ['name', 'description'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', 'submolts', {
      name: args.name,
      description: args.description,
    });
    activityStore.push('tool_result', `Created submolt m/${args.name}`, 'create_submolt');
    return result;
  },
};

export const listSubmolts: Tool = {
  name: 'list_submolts',
  description: 'List all available submolts',
  parameters: { type: 'object', properties: {} },
  async execute() {
    const result = await moltbookRequest('GET', 'submolts');
    activityStore.push('tool_result', 'Listed submolts', 'list_submolts');
    return result;
  },
};

export const getSubmolt: Tool = {
  name: 'get_submolt',
  description: 'Get details about a specific submolt',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Submolt name' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('GET', `submolts/${encodeURIComponent(args.name as string)}`);
    activityStore.push('tool_result', `Got submolt m/${args.name}`, 'get_submolt');
    return result;
  },
};

export const subscribeSubmolt: Tool = {
  name: 'subscribe_submolt',
  description: 'Subscribe to a submolt',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Submolt name to subscribe to' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `submolts/${encodeURIComponent(args.name as string)}/subscribe`);
    activityStore.push('tool_result', `Subscribed to m/${args.name}`, 'subscribe_submolt');
    return result;
  },
};

export const unsubscribeSubmolt: Tool = {
  name: 'unsubscribe_submolt',
  description: 'Unsubscribe from a submolt',
  parameters: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Submolt name to unsubscribe from' },
    },
    required: ['name'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `submolts/${encodeURIComponent(args.name as string)}/unsubscribe`);
    activityStore.push('tool_result', `Unsubscribed from m/${args.name}`, 'unsubscribe_submolt');
    return result;
  },
};

export const submoltTools = [createSubmolt, listSubmolts, getSubmolt, subscribeSubmolt, unsubscribeSubmolt];
