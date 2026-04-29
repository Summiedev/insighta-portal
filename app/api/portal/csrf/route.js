import { NextResponse } from 'next/server';
import { createCsrfToken } from '../../../../lib/csrf';

export async function GET() {
  const token = createCsrfToken();
  const response = NextResponse.json({ status: 'success', token });

  response.cookies.set('portal_csrf', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60,
  });

  return response;
}