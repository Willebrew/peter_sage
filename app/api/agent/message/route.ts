import { NextResponse } from 'next/server';
import { autonomousAgent } from '@/lib/agent/autonomous';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = body?.message;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty "message" field' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long (max 1000 chars)' },
        { status: 400 }
      );
    }

    autonomousAgent.pushMessage(text.trim());

    return NextResponse.json({
      ok: true,
      message: 'Message queued for next cycle',
      pending: autonomousAgent.getPendingMessages().length,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
}
