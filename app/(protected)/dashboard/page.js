"use client";

import { useEffect, useState } from 'react';
import { backendJson } from '../../../lib/backend';

export default function DashboardPage() {
  const [role, setRole] = useState('analyst');
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const roleCookie = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('portal_role='));
    if (roleCookie) {
      setRole(roleCookie.split('=')[1] || 'analyst');
    }

    backendJson('/api/profiles?limit=1&page=1', { method: 'GET', credentials: 'include' })
      .then(({ data: payload }) => {
        if (payload && payload.status === 'success') {
          setTotal(payload.total);
        }
      })
      .catch(() => {
        setTotal(null);
      });
  }, []);

  return (
    <section className="card">
        <h1>Dashboard</h1>
        <p className="small">Role: <span className={`badge ${role}`}>{role}</span></p>
        <p>
          Profiles indexed: <strong>{total === null ? '...' : total}</strong>
        </p>
        <p className="small">
          Analyst can query and search profiles. Admin can also export CSV and run admin actions.
        </p>
    </section>
  );
}