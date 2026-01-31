import { NextResponse } from 'next/server';
import { rateLimitTracker } from '@/lib/rate-limiter/tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(rateLimitTracker.getSnapshot());
}
