import type { RateLimitState, RateLimitSnapshot } from './types';

class RateLimitTracker {
  private state: RateLimitState = {
    posts: {
      lastPostTime: 0,
      cooldownSeconds: 1800, // 30 min
    },
    comments: {
      lastCommentTime: 0,
      cooldownSeconds: 20,
      dailyUsed: 0,
      dailyLimit: 50,
      dailyResetTime: this.getNextMidnight(),
    },
    requests: {
      timestamps: [],
      perMinuteLimit: 100,
    },
  };

  private getNextMidnight(): number {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime();
  }

  private pruneRequestTimestamps(): void {
    const oneMinuteAgo = Date.now() - 60_000;
    this.state.requests.timestamps = this.state.requests.timestamps.filter(
      (t) => t > oneMinuteAgo
    );
  }

  recordRequest(): void {
    this.state.requests.timestamps.push(Date.now());
    this.pruneRequestTimestamps();
  }

  recordPost(): void {
    this.state.posts.lastPostTime = Date.now();
  }

  recordComment(): void {
    this.state.comments.lastCommentTime = Date.now();
    this.state.comments.dailyUsed++;
  }

  /** Update from 429 response fields */
  updateFromRateLimitResponse(fields: {
    retry_after_minutes?: number;
    retry_after_seconds?: number;
    daily_remaining?: number;
  }): void {
    if (fields.retry_after_minutes !== undefined) {
      this.state.posts.lastPostTime = Date.now();
      this.state.posts.cooldownSeconds = fields.retry_after_minutes * 60;
    }
    if (fields.retry_after_seconds !== undefined) {
      this.state.comments.lastCommentTime = Date.now();
      this.state.comments.cooldownSeconds = fields.retry_after_seconds;
    }
    if (fields.daily_remaining !== undefined) {
      this.state.comments.dailyUsed =
        this.state.comments.dailyLimit - fields.daily_remaining;
    }
  }

  canPost(): boolean {
    const elapsed = (Date.now() - this.state.posts.lastPostTime) / 1000;
    return elapsed >= this.state.posts.cooldownSeconds;
  }

  canComment(): boolean {
    this.resetDailyIfNeeded();
    const elapsed = (Date.now() - this.state.comments.lastCommentTime) / 1000;
    return (
      elapsed >= this.state.comments.cooldownSeconds &&
      this.state.comments.dailyUsed < this.state.comments.dailyLimit
    );
  }

  canMakeRequest(): boolean {
    this.pruneRequestTimestamps();
    return this.state.requests.timestamps.length < this.state.requests.perMinuteLimit;
  }

  private resetDailyIfNeeded(): void {
    if (Date.now() >= this.state.comments.dailyResetTime) {
      this.state.comments.dailyUsed = 0;
      this.state.comments.dailyResetTime = this.getNextMidnight();
    }
  }

  getSnapshot(): RateLimitSnapshot {
    this.pruneRequestTimestamps();
    this.resetDailyIfNeeded();

    const now = Date.now();
    const postElapsed = (now - this.state.posts.lastPostTime) / 1000;
    const commentElapsed = (now - this.state.comments.lastCommentTime) / 1000;

    return {
      canPost: postElapsed >= this.state.posts.cooldownSeconds,
      postCooldownRemaining: Math.max(
        0,
        this.state.posts.cooldownSeconds - postElapsed
      ),
      canComment:
        commentElapsed >= this.state.comments.cooldownSeconds &&
        this.state.comments.dailyUsed < this.state.comments.dailyLimit,
      commentCooldownRemaining: Math.max(
        0,
        this.state.comments.cooldownSeconds - commentElapsed
      ),
      commentsRemainingToday:
        this.state.comments.dailyLimit - this.state.comments.dailyUsed,
      requestsUsedThisMinute: this.state.requests.timestamps.length,
      requestsPerMinuteLimit: this.state.requests.perMinuteLimit,
    };
  }

  /** Format for inclusion in LLM prompt */
  toPromptString(): string {
    const s = this.getSnapshot();
    const lines: string[] = ['Rate Limits:'];
    if (s.canPost) {
      lines.push('- Posts: AVAILABLE');
    } else {
      lines.push(
        `- Posts: COOLDOWN (${Math.ceil(s.postCooldownRemaining / 60)} min remaining)`
      );
    }
    if (s.canComment) {
      lines.push(`- Comments: AVAILABLE (${s.commentsRemainingToday}/day remaining)`);
    } else {
      lines.push(
        `- Comments: COOLDOWN (${Math.ceil(s.commentCooldownRemaining)}s remaining, ${s.commentsRemainingToday}/day remaining)`
      );
    }
    lines.push(
      `- Requests: ${s.requestsUsedThisMinute}/${s.requestsPerMinuteLimit} this minute`
    );
    return lines.join('\n');
  }
}

// Singleton
export const rateLimitTracker = new RateLimitTracker();
