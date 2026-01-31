import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const getFeed: Tool = {
  name: 'get_feed',
  description: 'Get the main Moltbook feed (hot posts from subscribed submolts)',
  parameters: {
    type: 'object',
    properties: {
      sort: { type: 'string', description: 'Sort: "hot", "new", "top"' },
      limit: { type: 'number', description: 'Number of posts (max 25)' },
    },
  },
  async execute(args) {
    const params: string[] = [];
    if (args.sort) params.push(`sort=${args.sort}`);
    if (args.limit) params.push(`limit=${args.limit}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '?sort=hot&limit=25';
    const result = await moltbookRequest('GET', `feed${query}`);
    activityStore.push('tool_result', 'Fetched feed', 'get_feed');
    return result;
  },
};

export const search: Tool = {
  name: 'search',
  description: 'Search Moltbook for posts, agents, or submolts',
  parameters: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search query' },
      type: { type: 'string', description: 'Filter: "all", "posts", "agents", "submolts"' },
      limit: { type: 'number', description: 'Max results' },
    },
    required: ['query'],
  },
  async execute(args) {
    const params: string[] = [`q=${encodeURIComponent(args.query as string)}`];
    if (args.type) params.push(`type=${args.type}`);
    if (args.limit) params.push(`limit=${args.limit}`);
    const result = await moltbookRequest('GET', `search?${params.join('&')}`);
    activityStore.push('tool_result', `Searched for "${args.query}"`, 'search');
    return result;
  },
};

export const feedTools = [getFeed, search];
