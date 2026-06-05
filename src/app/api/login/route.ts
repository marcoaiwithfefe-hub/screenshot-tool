import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/env';
import { AUTH_COOKIE, safeEqual } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  secret: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!safeEqual(parsed.data.secret, env.INTERNAL_API_SECRET)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, env.INTERNAL_API_SECRET, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: false,
  });
  return res;
}
