/**
 * Retry Utility
 *
 * Provides retry functionality with exponential backoff for handling
 * transient failures in LLM API calls and tool executions.
 */
/**
 * Retry configuration
 */
interface RetryConfig {
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts?: number;
    /** Initial delay in milliseconds (default: 1000) */
    initialDelay?: number;
    /** Maximum delay in milliseconds (default: 30000) */
    maxDelay?: number;
    /** Backoff multiplier (default: 2) */
    backoffMultiplier?: number;
    /** Jitter factor 0-1 to randomize delays (default: 0.1) */
    jitter?: number;
    /** Function to determine if error is retryable (default: retries all errors) */
    isRetryable?: (error: Error) => boolean;
    /** Called before each retry attempt */
    onRetry?: (attempt: number, error: Error, delay: number) => void;
}
/**
 * Default retry configuration
 */
declare const DEFAULT_RETRY_CONFIG: Required<Omit<RetryConfig, 'onRetry' | 'isRetryable'>>;
/**
 * Default function to check if an error is retryable
 */
declare function isRetryableError(error: Error): boolean;
/**
 * Calculate delay with exponential backoff and jitter
 */
declare function calculateBackoffDelay(attempt: number, config: Required<Omit<RetryConfig, 'onRetry' | 'isRetryable'>>): number;
/**
 * Sleep for a specified duration
 */
declare function sleep(ms: number): Promise<void>;
/**
 * Execute a function with retry logic
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   async () => await fetch('https://api.openai.com/v1/chat/completions', ...),
 *   {
 *     maxAttempts: 3,
 *     onRetry: (attempt, error, delay) => {
 *       console.log(`Retry attempt ${attempt} after ${delay}ms: ${error.message}`);
 *     },
 *   }
 * );
 * ```
 */
declare function withRetry<T>(fn: () => Promise<T>, config?: RetryConfig): Promise<T>;
/**
 * Create a retry wrapper with preset configuration
 *
 * @example
 * ```typescript
 * const retryFetch = createRetryWrapper({
 *   maxAttempts: 5,
 *   onRetry: (attempt) => console.log(`Retry ${attempt}`),
 * });
 *
 * const result = await retryFetch(async () => {
 *   return await fetch(url);
 * });
 * ```
 */
declare function createRetryWrapper(defaultConfig: RetryConfig): <T>(fn: () => Promise<T>, overrides?: RetryConfig) => Promise<T>;
/**
 * Retry configuration for LLM API calls
 *
 * More aggressive retry for transient API errors
 */
declare const LLM_RETRY_CONFIG: RetryConfig;
/**
 * Retry configuration for tool executions
 *
 * Less aggressive retry, only for network issues
 */
declare const TOOL_RETRY_CONFIG: RetryConfig;

export { DEFAULT_RETRY_CONFIG, LLM_RETRY_CONFIG, type RetryConfig, TOOL_RETRY_CONFIG, calculateBackoffDelay, createRetryWrapper, isRetryableError, sleep, withRetry };
