'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const tokenType = searchParams.get('token_type') || 'Bearer';

    if (!accessToken || !refreshToken) {
      setError('Missing tokens in callback');
      console.error('❌ Auth callback: Missing tokens');
      return;
    }

    try {
      // Store tokens in localStorage
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('token_type', tokenType);
      console.log('✅ Tokens stored in localStorage');

      // Fetch user info to validate token and get role
      const backend = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000';
      fetch(`${backend}/api/auth/me`, {
        headers: {
          'Authorization': `${tokenType} ${accessToken}`,
          'x-api-version': '1',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error(`${res.status}`);
          return res.json();
        })
        .then(payload => {
          if (payload.status === 'success' && payload.data) {
            const role = payload.data.role || 'analyst';
            // Store portal-specific session markers
            document.cookie = `portal_session=1; Path=/; SameSite=Strict`;
            document.cookie = `portal_role=${role}; Path=/; SameSite=Strict`;
            console.log(`✅ Session initialized, role: ${role}`);
          }
          // Redirect to dashboard regardless (tokens are now stored)
          router.push('/dashboard');
        })
        .catch(err => {
          console.warn('Could not fetch user info, but tokens are stored:', err.message);
          // Still redirect to dashboard with stored tokens
          router.push('/dashboard');
        });
    } catch (err) {
      console.error('❌ Auth callback error:', err);
      setError(`Error processing login: ${err.message}`);
    }
  }, [searchParams, router]);

  if (error) {
    return (
      <main className="container">
        <section className="card" style={{ maxWidth: 640, margin: '48px auto', textAlign: 'center' }}>
          <h1>Login Error</h1>
          <p className="error">{error}</p>
          <a className="button primary" href="/login">
            Return to Login
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 640, margin: '48px auto', textAlign: 'center' }}>
        <h1>Completing Login...</h1>
        <p>Please wait while we finalize your session.</p>
      </section>
    </main>
  );
}
