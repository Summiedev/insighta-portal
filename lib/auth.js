import { backendJson } from './backend';

async function probeSession() {
  const { res } = await backendJson('/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  return res.status !== 401;
}

async function detectRole() {
  const { res, data } = await backendJson('/auth/me', {
    method: 'GET',
    credentials: 'include',
  });

  if (res.status === 200 && data && data.data && data.data.role) return data.data.role;
  if (res.status === 403) return 'analyst';
  return 'unknown';
}

export {
  detectRole,
  probeSession,
};