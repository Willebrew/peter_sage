'use client';

import { useState, useRef } from 'react';

export default function MessageInput() {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = await res.json();
      if (data.ok) {
        setText('');
        setFlash('Sent! Peter will see this next cycle.');
        setTimeout(() => setFlash(null), 3000);
      } else {
        setFlash(data.error || 'Failed to send');
        setTimeout(() => setFlash(null), 3000);
      }
    } catch {
      setFlash('Network error');
      setTimeout(() => setFlash(null), 3000);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="rounded-xl border border-[#4A7C59]/30 bg-[#111] px-4 py-3">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Send Peter a suggestion or idea..."
          maxLength={1000}
          className="flex-1 rounded-lg border border-gray-700 bg-[#0d0d0d] px-3 py-2 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-[#4A7C59]"
        />
        <button
          onClick={send}
          disabled={!text.trim() || sending}
          className="rounded-lg bg-[#4A7C59] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#5a9469] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? '...' : 'Send'}
        </button>
      </div>
      {flash && (
        <p className="mt-2 text-xs text-[#7dba93] animate-pulse">{flash}</p>
      )}
    </div>
  );
}
