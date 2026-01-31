export interface RateLimitState {
  posts: {
    lastPostTime: number;
    cooldownSeconds: number; // 1800 (30 min)
  };
  comments: {
    lastCommentTime: number;
    cooldownSeconds: number; // 20
    dailyUsed: number;
    dailyLimit: number; // 50
    dailyResetTime: number;
  };
  requests: {
    timestamps: number[];
    perMinuteLimit: number; // 100
  };
}

export interface RateLimitSnapshot {
  canPost: boolean;
  postCooldownRemaining: number;
  canComment: boolean;
  commentCooldownRemaining: number;
  commentsRemainingToday: number;
  requestsUsedThisMinute: number;
  requestsPerMinuteLimit: number;
}
