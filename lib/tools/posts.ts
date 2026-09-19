import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { rateLimitTracker } from '@/lib/rate-limiter/tracker';
import { activityStore } from '@/lib/streaming/activity-store';
import { selfReplyGuard } from './self-reply-guard';

export const createPost: Tool = {
  name: 'create_post',
  description: 'Create a new post on Moltbook. Requires a submolt, title, and optionally content or url. Rate limited to 1 per 30 minutes.',
  parameters: {
    type: 'object',
    properties: {
      submolt: { type: 'string', description: 'The submolt to post in (e.g. "general", "aithoughts")' },
      title: { type: 'string', description: 'Post title' },
      content: { type: 'string', description: 'Post body text (optional)' },
      url: { type: 'string', description: 'URL to share (optional)' },
    },
    required: ['submolt', 'title'],
  },
  async execute(args) {
    if (!rateLimitTracker.canPost()) {
      const snap = rateLimitTracker.getSnapshot();
      return { success: false, error: `Post cooldown active. ${Math.ceil(snap.postCooldownRemaining / 60)} minutes remaining.` };
    }
    const body: Record<string, unknown> = { submolt: args.submolt, title: args.title };
    if (args.content) body.content = args.content;
    if (args.url) body.url = args.url;
    const result = await moltbookRequest('POST', 'posts', body);
    if (result.success) {
      const postId = selfReplyGuard.extractId(result);
      if (postId) selfReplyGuard.trackPost(postId);
      rateLimitTracker.recordPost();
      activityStore.push('tool_result', `Posted "${args.title}" to m/${args.submolt}`, 'create_post');
    }
    return result;
  },
};

export const getPosts: Tool = {
  name: 'get_posts',
  description: 'Get posts from Moltbook, optionally filtered by submolt',
  parameters: {
    type: 'object',
    properties: {
      sort: { type: 'string', description: 'Sort order: "hot", "new", "top"' },
      limit: { type: 'number', description: 'Number of posts (max 25)' },
      submolt: { type: 'string', description: 'Filter by submolt name' },
    },
  },
  async execute(args) {
    const params: string[] = [];
    if (args.sort) params.push(`sort=${args.sort}`);
    if (args.limit) params.push(`limit=${args.limit}`);
    if (args.submolt) params.push(`submolt=${encodeURIComponent(args.submolt as string)}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';
    const result = await moltbookRequest('GET', `posts${query}`);
    await selfReplyGuard.filterResponse(result);
    activityStore.push('tool_result', `Fetched posts${args.submolt ? ` from m/${args.submolt}` : ''}`, 'get_posts');
    return result;
  },
};

export const getPost: Tool = {
  name: 'get_post',
  description: 'Get a single post by ID with full details',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('GET', `posts/${args.post_id}`);
    activityStore.push('tool_result', `Got post ${args.post_id}`, 'get_post');
    return result;
  },
};

export const deletePost: Tool = {
  name: 'delete_post',
  description: 'Delete one of your own posts by ID',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID to delete' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('DELETE', `posts/${args.post_id}`);
    activityStore.push('tool_result', `Deleted post ${args.post_id}`, 'delete_post');
    return result;
  },
};

export const postTools = [createPost, getPosts, getPost, deletePost];
