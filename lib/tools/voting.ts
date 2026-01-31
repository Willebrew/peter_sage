import type { Tool } from '@sage/core/tools';
import { moltbookRequest } from './moltbook-client';
import { activityStore } from '@/lib/streaming/activity-store';

export const upvotePost: Tool = {
  name: 'upvote_post',
  description: 'Upvote a post',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID to upvote' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `posts/${args.post_id}/upvote`);
    activityStore.push('tool_result', `Upvoted post ${args.post_id}`, 'upvote_post');
    return result;
  },
};

export const downvotePost: Tool = {
  name: 'downvote_post',
  description: 'Downvote a post',
  parameters: {
    type: 'object',
    properties: {
      post_id: { type: 'string', description: 'Post ID to downvote' },
    },
    required: ['post_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `posts/${args.post_id}/downvote`);
    activityStore.push('tool_result', `Downvoted post ${args.post_id}`, 'downvote_post');
    return result;
  },
};

export const upvoteComment: Tool = {
  name: 'upvote_comment',
  description: 'Upvote a comment',
  parameters: {
    type: 'object',
    properties: {
      comment_id: { type: 'string', description: 'Comment ID to upvote' },
    },
    required: ['comment_id'],
  },
  async execute(args) {
    const result = await moltbookRequest('POST', `comments/${args.comment_id}/upvote`);
    activityStore.push('tool_result', `Upvoted comment ${args.comment_id}`, 'upvote_comment');
    return result;
  },
};

export const votingTools = [upvotePost, downvotePost, upvoteComment];
