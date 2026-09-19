import { moltbookRequest } from './moltbook-client';

interface AgentIdentity {
  name: string;
  id?: string;
}

/**
 * Tracks the agent's own posts/comments and identity to prevent self-reply loops.
 * Uses both ID tracking (within-session) and author-name filtering (cross-session).
 */
class SelfReplyGuard {
  private ownPostIds = new Set<string>();
  private ownCommentIds = new Set<string>();
  private identity: AgentIdentity | null = null;
  private identityFetched = false;

  /** Lazily fetch and cache our own agent identity from the API */
  async getIdentity(): Promise<AgentIdentity | null> {
    if (this.identityFetched) return this.identity;
    try {
      const result = await moltbookRequest('GET', 'agents/me');
      if (result.name) {
        this.identity = {
          name: result.name as string,
          id: (result.id ?? result.agent_id) as string | undefined,
        };
      }
    } catch {
      // Silently fail — we'll rely on ID tracking instead
    }
    this.identityFetched = true;
    return this.identity;
  }

  trackPost(id: string): void {
    this.ownPostIds.add(id);
  }

  trackComment(id: string): void {
    this.ownCommentIds.add(id);
  }

  isOwnPost(id: string): boolean {
    return this.ownPostIds.has(id);
  }

  isOwnComment(id: string): boolean {
    return this.ownCommentIds.has(id);
  }

  /** Extract an ID from an API response using common field names */
  extractId(result: Record<string, unknown>): string | null {
    const id = result.id ?? result.post_id ?? result.comment_id;
    if (id != null) return String(id);
    if (result.data && typeof result.data === 'object') {
      const data = result.data as Record<string, unknown>;
      const nestedId = data.id ?? data.post_id ?? data.comment_id;
      if (nestedId != null) return String(nestedId);
    }
    return null;
  }

  /** Check if an item was authored by this agent (by name or tracked ID) */
  private isOwnItem(item: Record<string, unknown>): boolean {
    // Check by tracked IDs
    const itemId = String(item.id ?? item.post_id ?? item.comment_id ?? '');
    if (itemId && (this.ownPostIds.has(itemId) || this.ownCommentIds.has(itemId))) {
      return true;
    }

    // Check by author name
    if (this.identity?.name) {
      const author = String(item.author ?? item.author_name ?? item.username ?? '');
      if (author && author.toLowerCase() === this.identity.name.toLowerCase()) {
        return true;
      }
    }

    // Check by author ID
    if (this.identity?.id) {
      const authorId = String(item.author_id ?? item.agent_id ?? '');
      if (authorId && authorId === this.identity.id) {
        return true;
      }
    }

    return false;
  }

  /** Filter an array of items, removing ones authored by this agent */
  async filterOwnContent<T extends Record<string, unknown>>(items: T[]): Promise<T[]> {
    await this.getIdentity();
    return items.filter((item) => !this.isOwnItem(item));
  }

  /** Filter own content from an API response (handles common response shapes) */
  async filterResponse(result: Record<string, unknown>): Promise<void> {
    const arrayFields = ['posts', 'comments', 'data', 'results', 'items'];
    for (const field of arrayFields) {
      if (Array.isArray(result[field])) {
        result[field] = await this.filterOwnContent(
          result[field] as Record<string, unknown>[]
        );
        return;
      }
    }
  }
}

export const selfReplyGuard = new SelfReplyGuard();
