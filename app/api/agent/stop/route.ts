import { NextResponse } from 'next/server';
import { autonomousAgent } from '@/lib/agent/autonomous';

export async function POST() {
  const status = autonomousAgent.getStatus();
  if (!status.running) {
    return NextResponse.json({ error: 'Agent is not running' }, { status: 409 });
  }

  autonomousAgent.stop();
  return NextResponse.json({ ok: true, message: 'Agent stopping' });
}
