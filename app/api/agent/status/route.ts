import { NextResponse } from 'next/server';
import { autonomousAgent } from '@/lib/agent/autonomous';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(autonomousAgent.getStatus());
}
