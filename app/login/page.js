"use client";

import { useEffect, useState } from 'react';
import { getBackendBaseUrl } from '../../lib/config';

export default function LoginPage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const backend = getBackendBaseUrl();
    setBaseUrl(backend);

    // Auto-bootstrap: if already logged in, redirect to dashboard
    let cancelled = false;
    const bootstrapSession = async () => {
      try {
        const response = await fetch(`${backend}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: { 'x-api-version': '1' },
        });
        if (response.ok && !cancelled) {
          const payload = await response.json().catch(() => ({}));
          const role = payload?.data?.role || 'analyst';
          document.cookie = `portal_session=1; Path=/; SameSite=Strict`;
          document.cookie = `portal_role=${role}; Path=/; SameSite=Strict`;
          window.location.href = '/dashboard';
        }
      } catch (_err) {
        // Ignore errors, stay on login page
      }
    };
    
    bootstrapSession();
    return () => { cancelled = true; };
  }, []);

  async function probeSession() {
    const backend = getBackendBaseUrl();
    const response = await fetch(`${backend}/auth/me`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'x-api-version': '1',
      },
    });

    if (response.status === 200) {
      const payload = await response.json().catch(() => ({}));
      const role = payload && payload.data && payload.data.role ? payload.data.role : 'analyst';
      document.cookie = `portal_session=1; Path=/; SameSite=Strict`;
      document.cookie = `portal_role=${role}; Path=/; SameSite=Strict`;
      window.location.href = '/dashboard';
      return;
    }

    setStatus('Session not detected yet. Complete GitHub auth and then click Continue.');
  }

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 640, margin: '48px auto', textAlign: 'center' }}>
        <h1>Insighta Portal</h1>
        <p className="small">Sign in with GitHub to access the portal.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
          <a className="button primary" style={{ minWidth: 200 }} href={`${baseUrl}/auth/github?client=browser`}>
            Continue with GitHub
          </a>
        </div>

        <div style={{ marginTop: 16 }}>
          <button className="button secondary" type="button" onClick={probeSession}>
            Check Session
          </button>
        </div>

        {status ? <p className="small" style={{ marginTop: 12 }}>{status}</p> : null}
      </section>
    </main>
  );
}