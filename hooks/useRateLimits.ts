'use client';

import { useEffect, useState } from 'react';
import type { RateLimitSnapshot } from '@/lib/rate-limiter/types';

export function useRateLimits(pollIntervalMs = 5000) {
  const [limits, setLimits] = useState<RateLimitSnapshot | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const res = await fetch('/api/rate-limits');
        if (res.ok && active) {
          setLimits(await res.json());
        }
      } catch {
        // ignore
      }
    }

    poll();
    const interval = setInterval(poll, pollIntervalMs);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [pollIntervalMs]);

  return limits;
}
