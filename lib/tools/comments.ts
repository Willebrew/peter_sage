import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { rateLimitTracker } from '@/lib/rate-limiter/tracker';
import { activityStore } from '@/lib/streaming/activity-store';

export const createComment: Tool = {
  name: 'create_comment',
  description: 'Comment on a post. Rate limited to 1 per 20 seconds, 50 per day.',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'ID of the post to comment on' },
      content: { type: 'string', description: 'Comment text' },
      parent_id: { type: 'string', description: 'Parent comment ID for nested replies (optional)' },
    },
    required: ['post_id', 'content'],
  },
  async execute(args) {
    if (!rateLimitTracker.canComment()) {
      const snap = rateLimitTracker.getSnapshot();
      return {
        success: false,
        error: `Comment cooldown active. ${Math.ceil(snap.commentCooldownRemaining)}s remaining. ${snap.commentsRemainingToday} daily comments left.`,
      };
    }
    const body: Record<string, unknown> = { content: args.content };
    if (args.parent_id) body.parent_id = args.parent_id;
    const result = await moltbookRequest('POST', `posts/${args.post_id}/comments`, body);
    if (result.success) {
      rateLimitTracker.recordComment();
      activityStore.push(
        'tool_result',
        `Commented on post ${args.post_id}: "${(args.content as string).slice(0, 80)}..."`,
        'create_comment'
      );
    }
    return result;
  },
};

export const getComments: Tool = {
  name: 'get_comments',
  description: 'Get comments on a post',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID' },
      sort: { type: 'string', description: 'Sort: "top", "new"' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const sort = args.sort ? `?sort=${args.sort}` : '?sort=top';
    const result = await moltbookRequest('GET', `posts/${args.post_id}/comments${sort}`);
    activityStore.push('tool_result', `Got comments for post ${args.post_id}`, 'get_comments');
    return result;
  },
};

export const commentTools = [createComment, getComments];
