'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { ActivityEvent } from '@/lib/streaming/activity-store';

export function useAgentStream() {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource('/api/stream');
    eventSourceRef.current = es;

    es.onopen = () => setConnected(true);

    es.onmessage = (e) => {
      try {
        const event: ActivityEvent = JSON.parse(e.data);
        setEvents((prev) => {
          // Deduplicate by id
          if (prev.some((p) => p.id === event.id)) return prev;
          const next = [...prev, event];
          // Keep last 200 events in state
          return next.length > 200 ? next.slice(-200) : next;
        });
      } catch {
        // ignore malformed
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      // Reconnect after 3s
      setTimeout(connect, 3000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
    };
  }, [connect]);

  return { events, connected };
}
