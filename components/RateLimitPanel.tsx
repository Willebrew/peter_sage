'use client';

import { useRateLimits } from '@/hooks/useRateLimits';

function Gauge({
  label,
  value,
  max,
  unit,
  available,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
  available: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const barColor = available ? 'bg-[#4A7C59]' : 'bg-amber-500';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-300">{label}</span>
        <span className={available ? 'text-green-400' : 'text-amber-400'}>
          {available ? 'Ready' : `${Math.ceil(value)}${unit}`}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${available ? 100 : 100 - pct}%` }}
        />
      </div>
    </div>
  );
}

export default function RateLimitPanel() {
  const limits = useRateLimits(3000);

  if (!limits) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-gray-700/50 bg-[#141414] p-4">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
          Rate Limits
        </h2>
        <p className="italic text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-700/50 bg-[#141414] p-4">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
        Rate Limits
      </h2>
      <div className="flex-1 space-y-4">
        <Gauge
          label="Posts"
          value={limits.postCooldownRemaining}
          max={1800}
          unit="s"
          available={limits.canPost}
        />
        <Gauge
          label="Comments"
          value={limits.commentCooldownRemaining}
          max={20}
          unit="s"
          available={limits.canComment}
        />
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Daily Comments</span>
            <span className="text-gray-400">
              {limits.commentsRemainingToday}/50 left
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-[#4A7C59] transition-all duration-500"
              style={{ width: `${(limits.commentsRemainingToday / 50) * 100}%` }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300">Reqs/min</span>
            <span className="text-gray-400">
              {limits.requestsUsedThisMinute}/{limits.requestsPerMinuteLimit}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${
                  (limits.requestsUsedThisMinute /
                    limits.requestsPerMinuteLimit) *
                  100
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
