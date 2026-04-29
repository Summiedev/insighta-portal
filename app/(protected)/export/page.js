"use client";

import { useEffect, useState } from 'react';
import { backendFetch } from '../../../lib/backend';

function readCookie(name) {
  const item = document.cookie
    .split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${name}=`));
  if (!item) return '';
  return decodeURIComponent(item.split('=')[1] || '');
}

export default function ExportPage() {
  const [role, setRole] = useState('analyst');
  const [csrfToken, setCsrfToken] = useState('');
  const [status, setStatus] = useState('');

  const [filters, setFilters] = useState({
    country: '',
    gender: '',
    sort_by: 'created_at',
    order: 'asc',
    export_limit: '1000',
  });

  useEffect(() => {
    const currentRole = readCookie('portal_role') || 'analyst';
    setRole(currentRole);

    fetch('/api/portal/csrf')
      .then((res) => res.json())
      .then((payload) => {
        if (payload && payload.token) {
          setCsrfToken(payload.token);
        }
      })
      .catch(() => {});
  }, []);

  async function exportCsv() {
    if (role !== 'admin') {
      setStatus('Only admin users can export CSV.');
      return;
    }

    const params = new URLSearchParams();
    params.set('format', 'csv');
    if (filters.country) params.set('country_id', filters.country);
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.sort_by) params.set('sort_by', filters.sort_by);
    if (filters.order) params.set('order', filters.order);
    if (filters.export_limit) params.set('export_limit', filters.export_limit);

    const res = await backendFetch(`/api/profiles/export?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setStatus(payload.message || 'CSV export failed');
      return;
    }

    const csv = await res.text();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profiles-export.csv';
    a.click();
    URL.revokeObjectURL(url);
    setStatus('CSV exported successfully.');
  }

  async function logout() {
    const res = await fetch('/api/portal/logout', {
      method: 'POST',
      headers: {
        'x-csrf-token': csrfToken,
      },
    });

    if (res.ok) {
      window.location.href = '/login';
      return;
    }

    setStatus('Logout failed due to CSRF or session issue.');
  }

  return (
    <section className="card">
        <h1>CSV Export</h1>
        <p className="small">Role: <span className={`badge ${role}`}>{role}</span></p>

        <div className="grid two">
          <label>Country
            <input value={filters.country} onChange={(e) => setFilters({ ...filters, country: e.target.value.toUpperCase() })} />
          </label>
          <label>Gender
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
              <option value="">Any</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </label>
          <label>Sort By
            <select value={filters.sort_by} onChange={(e) => setFilters({ ...filters, sort_by: e.target.value })}>
              <option value="created_at">created_at</option>
              <option value="age">age</option>
              <option value="gender_probability">gender_probability</option>
            </select>
          </label>
          <label>Order
            <select value={filters.order} onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
              <option value="asc">asc</option>
              <option value="desc">desc</option>
            </select>
          </label>
          <label>Export Limit
            <input value={filters.export_limit} onChange={(e) => setFilters({ ...filters, export_limit: e.target.value })} />
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="button" type="button" onClick={exportCsv}>Export CSV</button>
          <button className="button warn" type="button" onClick={logout}>Logout (CSRF Protected)</button>
        </div>

        {status ? <p className="small" style={{ marginTop: 10 }}>{status}</p> : null}
    </section>
  );
}