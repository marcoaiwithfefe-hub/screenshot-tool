import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE, safeEqual } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/api/login', '/api/health'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next();
  }

  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) {
    // Server misconfiguration — deny all
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const cookie = req.cookies.get(AUTH_COOKIE)?.value ?? '';

  if (!safeEqual(cookie, secret)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
