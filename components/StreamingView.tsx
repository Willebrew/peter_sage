'use client';

import { useMemo, useRef, useEffect } from 'react';
import type { ActivityEvent } from '@/lib/streaming/activity-store';

export default function StreamingView({ events }: { events: ActivityEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const thinkingTokens = useMemo(() => {
    // Collect recent thinking tokens to show live streaming
    const tokens = events
      .filter((e) => e.type === 'thinking')
      .slice(-50);
    return tokens;
  }, [events]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [thinkingTokens]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#F5C6A0]/20 bg-[#1a1710] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#F5C6A0]">
        Live Thoughts
      </h2>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto font-mono text-sm leading-relaxed text-[#F5C6A0]/80"
        style={{ maxHeight: '300px' }}
      >
        {thinkingTokens.length > 0 ? (
          thinkingTokens.map((t) => (
            <span key={t.id}>{t.content}</span>
          ))
        ) : (
          <span className="italic text-gray-600">
            Waiting for Peter to start thinking...
          </span>
        )}
        <span className="inline-block h-4 w-1 animate-pulse bg-[#F5C6A0]/60 align-middle" />
      </div>
    </div>
  );
}
