function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://insighta-backend-mauve.vercel.app').replace(/\/+$/, '');
}

export { getBackendBaseUrl };