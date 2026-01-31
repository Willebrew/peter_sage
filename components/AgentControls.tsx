'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AgentStatus } from '@/lib/agent/types';

export default function AgentControls() {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/agent/status');
      if (res.ok) setStatus(await res.json());
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const i = setInterval(fetchStatus, 3000);
    return () => clearInterval(i);
  }, [fetchStatus]);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch('/api/agent/start', { method: 'POST' });
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await fetch('/api/agent/stop', { method: 'POST' });
      await fetchStatus();
    } finally {
      setLoading(false);
    }
  };

  const running = status?.running ?? false;
  const uptime = status?.startedAt
    ? Math.floor((Date.now() - status.startedAt) / 1000)
    : 0;
  const uptimeStr = uptime > 0
    ? `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`
    : '--';

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${
            running
              ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)] animate-pulse'
              : 'bg-gray-500'
          }`}
        />
        <span className="text-sm font-bold text-gray-300">
          {running ? 'RUNNING' : 'STOPPED'}
        </span>
      </div>

      {running && (
        <span className="text-xs text-gray-500">
          {status?.cycleCount ?? 0} cycles &middot; {uptimeStr}
        </span>
      )}

      <div className="ml-auto flex gap-2">
        <button
          onClick={handleStart}
          disabled={loading || running}
          className="rounded-lg bg-[#4A7C59] px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-[#5a9469] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Start
        </button>
        <button
          onClick={handleStop}
          disabled={loading || !running}
          className="rounded-lg bg-red-600 px-4 py-1.5 text-sm font-bold text-white transition-all hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
