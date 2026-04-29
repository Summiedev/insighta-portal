import { NextResponse } from 'next/server';

const PROTECTED_PREFIXES = ['/dashboard', '/profiles', '/export', '/account'];

function isProtected(pathname) {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get('portal_session');
  if (!sessionCookie || sessionCookie.value !== '1') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/profiles/:path*', '/export/:path*', '/account/:path*'],
};