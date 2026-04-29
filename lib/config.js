function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

export { getBackendBaseUrl };