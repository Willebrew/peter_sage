'use client';

import { useMemo } from 'react';
import type { ActivityEvent } from '@/lib/streaming/activity-store';

export default function CurrentAction({ events }: { events: ActivityEvent[] }) {
  const current = useMemo(() => {
    // Find the most recent status/tool_call event
    for (let i = events.length - 1; i >= 0; i--) {
      const e = events[i];
      if (e.type === 'status' || e.type === 'tool_call') return e;
    }
    return null;
  }, [events]);

  const lastTool = useMemo(() => {
    for (let i = events.length - 1; i >= 0; i--) {
      if (events[i].type === 'tool_call') return events[i];
    }
    return null;
  }, [events]);

  return (
    <div className="flex h-full flex-col rounded-xl border border-[#4A7C59]/30 bg-[#1a1f1a] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[#4A7C59]">
        Current Action
      </h2>
      <div className="flex-1">
        {current ? (
          <>
            <p className="text-lg font-semibold text-white">
              {current.content}
            </p>
            {lastTool && lastTool.toolName && (
              <div className="mt-2 inline-block rounded-md bg-[#4A7C59]/20 px-2 py-1">
                <span className="font-mono text-xs text-[#7dba93]">
                  {lastTool.toolName}
                </span>
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">
            Peter is idle. Hit Start to wake him up!
          </p>
        )}
      </div>
      {current && (
        <p className="mt-2 text-xs text-gray-600">
          {new Date(current.timestamp).toLocaleTimeString()}
        </p>
      )}
    </div>
  );
}
