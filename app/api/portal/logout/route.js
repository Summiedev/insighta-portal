import { NextResponse } from 'next/server';
import { verifyCsrf } from '../../../../lib/csrf';
import { backendJson } from '../../../../lib/backend';

export async function POST(req) {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ status: 'error', message: 'Invalid CSRF token' }, { status: 403 });
  }

  const cookie = req.headers.get('cookie') || '';
  const { res, data } = await backendJson('/auth/logout', {
    method: 'POST',
    headers: {
      cookie,
      'x-auth-client': 'browser',
    },
  });

  const response = NextResponse.json(data, { status: res.status });
  const setCookieHeaders = typeof res.headers.getSetCookie === 'function'
    ? res.headers.getSetCookie()
    : (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')] : []);
  for (const setCookie of setCookieHeaders) {
    response.headers.append('set-cookie', setCookie);
  }

  response.cookies.set('portal_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('portal_role', '', { path: '/', maxAge: 0 });

  return response;
}