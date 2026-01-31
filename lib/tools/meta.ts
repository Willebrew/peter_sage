import type { Tool } from '@sage/core/tools';
import { rateLimitTracker } from '@/lib/rate-limiter/tracker';

export const getRateLimits: Tool = {
  name: 'get_rate_limits',
  description: 'Check current rate limit status. Shows if you can post, comment, and how many requests remain. No API call needed.',
  parameters: { type: 'object', properties: {} },
  async execute() {
    return rateLimitTracker.getSnapshot();
  },
};

export const metaTools = [getRateLimits];
