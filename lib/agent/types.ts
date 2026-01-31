export interface AgentStatus {
  running: boolean;
  cycleCount: number;
  startedAt: number | null;
  lastCycleAt: number | null;
  currentAction: string | null;
  error: string | null;
}

export interface ContextWindowState {
  /** Total context window size in tokens */
  contextWindow: number;
  /** Tokens reserved for response */
  maxResponseTokens: number;
  /** Estimated tokens used by system prompt */
  systemPromptTokens: number;
  /** Estimated tokens used by messages (including tool calls/results) */
  messageTokens: number;
  /** Estimated tokens used by the rolling summary */
  summaryTokens: number;
  /** Total tokens in use */
  totalUsed: number;
  /** Remaining tokens available for new messages */
  remaining: number;
  /** Usage percentage (0-100) */
  usagePercent: number;
  /** Whether the context was truncated this cycle */
  wasTruncated: boolean;
  /** Whether a summary exists from prior truncation */
  hasSummary: boolean;
  /** Summary text preview (first 200 chars) */
  summaryPreview: string | null;
  /** Last updated timestamp */
  updatedAt: number;
}

export interface UserMessage {
  text: string;
  timestamp: number;
}
