import { getBackendBaseUrl } from './config';

async function backendFetch(pathname, options) {
  const base = getBackendBaseUrl();
  const headers = {
    'x-api-version': '1',
    ...(options && options.headers ? options.headers : {}),
  };

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