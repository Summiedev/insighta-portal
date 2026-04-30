import { getBackendBaseUrl } from './config';

async function backendFetch(pathname, options) {
  const base = getBackendBaseUrl();
  const headers = {
    'x-api-version': '1',
    ...(options && options.headers ? options.headers : {}),
  };

  // Add Authorization header from localStorage if available (client-side only)
  if (typeof window !== 'undefined' && localStorage) {
    try {
      const accessToken = localStorage.getItem('access_token');
      const tokenType = localStorage.getItem('token_type') || 'Bearer';
      if (accessToken) {
        headers['Authorization'] = `${tokenType} ${accessToken}`;
      }
    } catch (err) {
      // localStorage might not be available in some contexts
    }
  }

  return fetch(`${base}${pathname}`, {
    ...options,
    headers,
  });
}

async function backendJson(pathname, options) {
  const res = await backendFetch(pathname, options);
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

export {
  backendFetch,
  backendJson,
};