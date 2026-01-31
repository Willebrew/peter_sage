export type ActivityEventType =
  | 'thinking'
  | 'tool_call'
  | 'tool_result'
  | 'cycle_complete'
  | 'status'
  | 'error';

export interface ActivityEvent {
  id: number;
  type: ActivityEventType;
  content: string;
  toolName?: string;
  timestamp: number;
}

type Subscriber = (event: ActivityEvent) => void;

const MAX_EVENTS = 500;

class ActivityStore {
  private events: ActivityEvent[] = [];
  private subscribers: Set<Subscriber> = new Set();
  private nextId = 1;

  push(type: ActivityEventType, content: string, toolName?: string): void {
    const event: ActivityEvent = {
      id: this.nextId++,
      type,
      content,
      toolName,
      timestamp: Date.now(),
    };
    this.events.push(event);
    if (this.events.length > MAX_EVENTS) {
      this.events = this.events.slice(-MAX_EVENTS);
    }
    for (const sub of this.subscribers) {
      try {
        sub(event);
      } catch {
        // subscriber error, ignore
      }
    }
  }

  subscribe(fn: Subscriber): () => void {
    this.subscribers.add(fn);
    return () => {
      this.subscribers.delete(fn);
    };
  }

  getRecent(count: number = 50): ActivityEvent[] {
    return this.events.slice(-count);
  }

  getAll(): ActivityEvent[] {
    return [...this.events];
  }
}

// Singleton
export const activityStore = new ActivityStore();
