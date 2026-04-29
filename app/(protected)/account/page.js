"use client";

import { useEffect, useState } from 'react';
import { backendJson } from '../../../lib/backend';

export default function AccountPage() {
  const [role, setRole] = useState('analyst');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentRole = document.cookie
      .split(';')
      .map((v) => v.trim())
      .find((v) => v.startsWith('portal_role='));
    if (currentRole) setRole(currentRole.split('=')[1] || 'analyst');

    backendJson('/api/auth/me', { method: 'GET', credentials: 'include' })
      .then(({ res, data }) => {
        if (res.ok && data.status === 'success') {
          setUser(data.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="card">
        <h1>Account</h1>
        {user ? (
          <div className="grid">
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email || '—'}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>GitHub ID:</strong> {user.github_id}</p>
            <p><strong>Last Login:</strong> {user.last_login_at || '—'}</p>
          </div>
        ) : (
          <p className="small">Loading account details...</p>
        )}
    </section>
  );
}