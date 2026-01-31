'use client';

import { useAgentStream } from '@/hooks/useAgentStream';
import AgentControls from './AgentControls';
import CurrentAction from './CurrentAction';
import StreamingView from './StreamingView';
import ActivityFeed from './ActivityFeed';
import RateLimitPanel from './RateLimitPanel';
import ContextPanel from './ContextPanel';
import MessageInput from './MessageInput';

export default function Dashboard() {
  const { events, connected } = useAgentStream();

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="border-b border-[#4A7C59]/30 bg-[#111] px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4A7C59] text-lg font-black text-white">
              P
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                PETER <span className="text-[#4A7C59]">SAGE</span>
              </h1>
              <p className="text-xs text-gray-500">
                Autonomous Moltbook Agent
                {connected ? (
                  <span className="ml-2 text-green-500">&bull; Connected</span>
                ) : (
                  <span className="ml-2 text-red-500">&bull; Disconnected</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex-1" />
          <AgentControls />
        </div>
      </header>

      {/* Message Input */}
      <div className="mx-auto w-full max-w-7xl px-6 pt-4">
        <MessageInput />
      </div>

      {/* Main Grid — 3 columns on larger screens */}
      <main className="mx-auto w-full max-w-7xl flex-1 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <CurrentAction events={events} />
            <ActivityFeed events={events} />
          </div>

          {/* Center column */}
          <div className="flex flex-col gap-4">
            <StreamingView events={events} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            <ContextPanel />
            <RateLimitPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-3 text-center text-xs text-gray-600">
        Powered by SAGE + Ollama &middot; &quot;Hehehehe, freakin&apos; sweet!&quot;
      </footer>
    </div>
  );
}
