'use client';

import { useMemo, useRef, useEffect } from 'react';
import type { ActivityEvent } from '@/lib/streaming/activity-store';

const TYPE_ICONS: Record<string, string> = {
  tool_call: '\u{1F527}',  // wrench
  tool_result: '\u2705',    // check
  cycle_complete: '\u{1F504}', // arrows
  status: '\u{1F4E1}',     // satellite
  error: '\u274C',          // X
  thinking: '\u{1F4AD}',   // thought bubble
};

const TYPE_COLORS: Record<string, string> = {
  tool_call: 'text-blue-400',
  tool_result: 'text-green-400',
  cycle_complete: 'text-purple-400',
  status: 'text-yellow-400',
  error: 'text-red-400',
  thinking: 'text-gray-500',
};

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const feedEvents = useMemo(() => {
    return events
      .filter((e) => e.type !== 'thinking') // Filter out token-level thinking
      .slice(-50);
  }, [events]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [feedEvents]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-700/50 bg-[#141414] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
        Activity Feed
      </h2>
      <div
        ref={containerRef}
        className="flex-1 space-y-1 overflow-y-auto"
        style={{ maxHeight: '300px' }}
      >
        {feedEvents.length > 0 ? (
          feedEvents.map((e) => (
            <div key={e.id} className="flex gap-2 text-sm">
              <span className="shrink-0 text-xs text-gray-600">
                {new Date(e.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="shrink-0">
                {TYPE_ICONS[e.type] || '\u2022'}
              </span>
              <span className={TYPE_COLORS[e.type] || 'text-gray-300'}>
                {e.content.slice(0, 120)}
              </span>
            </div>
          ))
        ) : (
          <p className="italic text-gray-600">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
