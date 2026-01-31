// src/utils/retry.ts
var DEFAULT_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1e3,
  maxDelay: 3e4,
  backoffMultiplier: 2,
  jitter: 0.1
};
var RETRYABLE_STATUS_CODES = [
  408,
  // Request Timeout
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
];
function isRetryableError(error) {
  const message = error.message.toLowerCase();
  if (message.includes("network") || message.includes("timeout") || message.includes("econnreset") || message.includes("econnrefused") || message.includes("socket hang up")) {
    return true;
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return true;
  }
  for (const code of RETRYABLE_STATUS_CODES) {
    if (message.includes(`${code}`)) {
      return true;
    }
  }
  if (message.includes("overloaded") || message.includes("capacity") || message.includes("temporarily unavailable")) {
    return true;
  }
  return false;
}
function calculateBackoffDelay(attempt, config) {
  const { initialDelay, maxDelay, backoffMultiplier, jitter } = config;
  const exponentialDelay = initialDelay * Math.pow(backoffMultiplier, attempt - 1);
  const cappedDelay = Math.min(exponentialDelay, maxDelay);
  const jitterRange = cappedDelay * jitter;
  const jitterValue = Math.random() * jitterRange * 2 - jitterRange;
  return Math.max(0, Math.round(cappedDelay + jitterValue));
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withRetry(fn, config = {}) {
  const {
    maxAttempts = DEFAULT_RETRY_CONFIG.maxAttempts,
    initialDelay = DEFAULT_RETRY_CONFIG.initialDelay,
    maxDelay = DEFAULT_RETRY_CONFIG.maxDelay,
    backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
    jitter = DEFAULT_RETRY_CONFIG.jitter,
    isRetryable = isRetryableError,
    onRetry
  } = config;
  const fullConfig = { maxAttempts, initialDelay, maxDelay, backoffMultiplier, jitter };
  let lastError = null;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      const shouldRetry = attempt < maxAttempts && isRetryable(lastError);
      if (!shouldRetry) {
        throw lastError;
      }
      const delay = calculateBackoffDelay(attempt, fullConfig);
      onRetry?.(attempt, lastError, delay);
      await sleep(delay);
    }
  }
  throw lastError || new Error("Retry failed");
}
function createRetryWrapper(defaultConfig) {
  return (fn, overrides) => {
    return withRetry(fn, { ...defaultConfig, ...overrides });
  };
}
var LLM_RETRY_CONFIG = {
  maxAttempts: 3,
  initialDelay: 1e3,
  maxDelay: 6e4,
  backoffMultiplier: 2,
  jitter: 0.2,
  isRetryable: isRetryableError
};
var TOOL_RETRY_CONFIG = {
  maxAttempts: 2,
  initialDelay: 500,
  maxDelay: 5e3,
  backoffMultiplier: 2,
  jitter: 0.1,
  isRetryable: (error) => {
    const message = error.message.toLowerCase();
    return message.includes("network") || message.includes("timeout") || message.includes("econnreset");
  }
};
export {
  DEFAULT_RETRY_CONFIG,
  LLM_RETRY_CONFIG,
  TOOL_RETRY_CONFIG,
  calculateBackoffDelay,
  createRetryWrapper,
  isRetryableError,
  sleep,
  withRetry
};
//# sourceMappingURL=index.mjs.map