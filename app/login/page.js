"use client";

import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [baseUrl, setBaseUrl] = useState(process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000');
  const [status, setStatus] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function bootstrapSession() {
      const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';

      try {
        const response = await fetch(`${backend}/api/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'x-api-version': '1',
          },
        });

        if (!response.ok) {
          if (!cancelled) {
            setStatus('Sign in with GitHub to access the portal.');
          }
          return;
        }

        const payload = await response.json().catch(() => ({}));
        const role = payload && payload.data && payload.data.role ? payload.data.role : 'analyst';
        document.cookie = `portal_session=1; Path=/; SameSite=Strict`;
        document.cookie = `portal_role=${role}; Path=/; SameSite=Strict`;
        if (!cancelled) {
          window.location.href = '/dashboard';
        }
      } catch (_err) {
        if (!cancelled) {
          setStatus('Sign in with GitHub to access the portal.');
        }
      }
    }

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, []);

  async function probeSession() {
    const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${backend}/api/auth/me`, {
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
        <p className="small">If you are already signed in, you will be taken to the dashboard automatically.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
          <a className="button primary" style={{ minWidth: 200 }} href={`${baseUrl}/api/auth/github?client=browser`}>
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