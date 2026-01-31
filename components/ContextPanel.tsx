'use client';

import { useEffect, useState } from 'react';
import type { ContextWindowState } from '@/lib/agent/types';

function formatTokens(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function UsageRing({ percent }: { percent: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;
  const color =
    percent > 85 ? '#ef4444' : percent > 60 ? '#f59e0b' : '#4A7C59';

  return (
    <svg width="88" height="88" className="shrink-0">
      {/* Background ring */}
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke="#1f1f1f"
        strokeWidth="7"
      />
      {/* Usage ring */}
      <circle
        cx="44"
        cy="44"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-all duration-700"
        transform="rotate(-90 44 44)"
      />
      {/* Center text */}
      <text
        x="44"
        y="41"
        textAnchor="middle"
        className="text-lg font-black"
        fill={color}
      >
        {percent}%
      </text>
      <text
        x="44"
        y="55"
        textAnchor="middle"
        className="text-[9px]"
        fill="#666"
      >
        used
      </text>
    </svg>
  );
}

export default function ContextPanel() {
  const [ctx, setCtx] = useState<ContextWindowState | null>(null);

  useEffect(() => {
    let active = true;
    async function poll() {
      try {
        const res = await fetch('/api/context');
        if (res.ok && active) setCtx(await res.json());
      } catch {
        /* ignore */
      }
    }
    poll();
    const i = setInterval(poll, 3000);
    return () => {
      active = false;
      clearInterval(i);
    };
  }, []);

  if (!ctx) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-gray-700/50 bg-[#141414] p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
          Context Window
        </h2>
        <p className="italic text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-700/50 bg-[#141414] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
        Context Window
      </h2>

      <div className="flex items-start gap-4">
        <UsageRing percent={ctx.usagePercent} />

        <div className="flex-1 space-y-2 text-xs">
          {/* Token breakdown */}
          <div className="flex justify-between text-gray-400">
            <span>System prompt</span>
            <span className="font-mono text-gray-300">
              {formatTokens(ctx.systemPromptTokens)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Messages + tools</span>
            <span className="font-mono text-gray-300">
              {formatTokens(ctx.messageTokens)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Summary</span>
            <span className="font-mono text-gray-300">
              {formatTokens(ctx.summaryTokens)}
            </span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Response budget</span>
            <span className="font-mono text-gray-300">
              {formatTokens(ctx.maxResponseTokens)}
            </span>
          </div>

          <div className="my-1 border-t border-gray-800" />

          <div className="flex justify-between font-semibold text-gray-300">
            <span>Total / Window</span>
            <span className="font-mono">
              {formatTokens(ctx.totalUsed)} / {formatTokens(ctx.contextWindow)}
            </span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Remaining</span>
            <span className="font-mono text-gray-400">
              {formatTokens(ctx.remaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Status badges */}
      <div className="mt-3 flex flex-wrap gap-2">
        {ctx.wasTruncated && (
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
            TRUNCATED
          </span>
        )}
        {ctx.hasSummary && (
          <span className="rounded-md bg-[#4A7C59]/20 px-2 py-0.5 text-[10px] font-semibold text-[#7dba93]">
            SUMMARY ACTIVE
          </span>
        )}
        {!ctx.wasTruncated && !ctx.hasSummary && (
          <span className="rounded-md bg-gray-800 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
            WITHIN BUDGET
          </span>
        )}
      </div>

      {/* Summary preview */}
      {ctx.summaryPreview && (
        <div className="mt-3 rounded-lg bg-[#0d0d0d] p-2">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-gray-600">
            Rolling Summary
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            {ctx.summaryPreview}
            {ctx.summaryPreview.length >= 200 && '...'}
          </p>
        </div>
      )}
    </div>
  );
}
