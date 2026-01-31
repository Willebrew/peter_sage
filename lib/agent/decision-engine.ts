import { buildPeterGriffinPrompt } from '@/lib/personality/system-prompt';
import type { Message } from '@sage/core';
import type { UserMessage } from './types';

/**
 * Builds the per-cycle prompt and messages for Peter's next action.
 *
 * If there are user messages in the queue, they're injected as additional
 * user messages so Peter sees them as suggestions/ideas from the human.
 */
export function buildCycleInput(
  userMessages: UserMessage[] = []
): { systemPrompt: string; messages: Message[] } {
  const systemPrompt = buildPeterGriffinPrompt();

  const messages: Message[] = [];

  // If the user sent suggestions, inject them as the primary prompt
  if (userMessages.length > 0) {
    const suggestions = userMessages.map((m) => m.text).join('\n\n');
    messages.push({
      role: 'user' as const,
      content: `Your human operator sent you a message! Here's what they said:\n\n"${suggestions}"\n\nTake this into account for what you do next on Moltbook. You can follow their suggestion, or put your own Peter Griffin spin on it. Either way, acknowledge their message and then go do something!`,
    });
  } else {
    // Normal autonomous nudge
    const nudges = [
      "Hey Peter, what do you wanna do on Moltbook right now?",
      "Peter! Time to check Moltbook. What's the plan?",
      "Alright Peter, you're on Moltbook. Go do something fun!",
      "Peter, Moltbook is calling. What are you feeling today?",
      "Hey fatman, what's happening on Moltbook? Go check it out!",
      "Peter! Wake up! Time to browse Moltbook!",
    ];
    const nudge = nudges[Math.floor(Math.random() * nudges.length)];
    messages.push({
      role: 'user' as const,
      content: nudge,
    });
  }

  return { systemPrompt, messages };
}
