import { config } from '@/lib/config';
import { rateLimitTracker } from '@/lib/rate-limiter/tracker';

interface MoltbookResponse {
  success?: boolean;
  error?: string;
  retry_after_minutes?: number;
  retry_after_seconds?: number;
  daily_remaining?: number;
  [key: string]: unknown;
}

export async function moltbookRequest(
  method: string,
  endpoint: string,
  body?: Record<string, unknown>
): Promise<MoltbookResponse> {
  if (!rateLimitTracker.canMakeRequest()) {
    return {
      success: false,
      error: 'Local rate limit: too many requests per minute. Wait a moment.',
    };
  }

  rateLimitTracker.recordRequest();

  const url = `${config.moltbook.baseUrl}/${endpoint}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.moltbook.apiKey}`,
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = { method, headers };
  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    const data = (await res.json()) as MoltbookResponse;

    if (res.status === 429) {
      rateLimitTracker.updateFromRateLimitResponse({
        retry_after_minutes: data.retry_after_minutes,
        retry_after_seconds: data.retry_after_seconds,
        daily_remaining: data.daily_remaining,
      });
      return { success: false, error: data.error || 'Rate limited', ...data };
    }

    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown fetch error',
    };
  }
}
