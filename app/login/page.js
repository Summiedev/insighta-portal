"use client";

import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:3000');
  }, []);

  return (
    <main className="container">
      <section className="card" style={{ maxWidth: 640, margin: '48px auto', textAlign: 'center' }}>
        <h1>Insighta Portal</h1>
        <p className="small">Sign in with GitHub to access the portal.</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 18 }}>
          <a className="button primary" style={{ minWidth: 200 }} href={`${baseUrl}/api/auth/github?client=browser`}>
            Continue with GitHub
          </a>
        </div>

        <p className="small" style={{ marginTop: 24, color: '#666' }}>
          You will be redirected to GitHub to authorize access.
        </p>
      </section>
    </main>
  );
}
        </div>

        {status ? <p className="small" style={{ marginTop: 12 }}>{status}</p> : null}
      </section>
    </main>
  );
}