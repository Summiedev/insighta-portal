import crypto from 'crypto';

function createCsrfToken() {
  return crypto.randomBytes(24).toString('base64url');
}

function verifyCsrf(req) {
  const cookieToken = req.cookies.get('portal_csrf')?.value || '';
  const headerToken = req.headers.get('x-csrf-token') || '';
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

export {
  createCsrfToken,
  verifyCsrf,
};