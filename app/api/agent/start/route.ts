import { NextResponse } from 'next/server';
import { autonomousAgent } from '@/lib/agent/autonomous';

export async function POST() {
  const status = autonomousAgent.getStatus();
  if (status.running) {
    return NextResponse.json({ error: 'Agent is already running' }, { status: 409 });
  }

  await autonomousAgent.start();
  return NextResponse.json({ ok: true, message: 'Agent started' });
}
