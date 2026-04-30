"use client";

import { useState } from 'react';
import { backendJson } from '../../../../lib/backend';

function readRole() {
  if (typeof document === 'undefined') return 'analyst';
  const cookie = document.cookie
    .split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith('portal_role='));
  return cookie ? cookie.split('=')[1] || 'analyst' : 'analyst';
}

export default function ProfilesSearchPage() {
  const [role] = useState(readRole);
  const [query, setQuery] = useState('young males from nigeria');
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runSearch(e) {
    e.preventDefault();
    setLoading(true);

    const params = new URLSearchParams({ q: query, page: '1', limit: '10' });
    const { res, data: payload } = await backendJson(`/api/v1/profiles/search?${params.toString()}`, {
      method: 'GET',
      credentials: 'include',
    });

    setLoading(false);
    if (res.ok && payload.status === 'success') {
      setRows(payload.data || []);
      setMeta(payload);
      return;
    }

    alert(payload.message || 'Search failed');
  }

  return (
    <section className="card">
        <h1>Profile Search</h1>
        <p className="small">Natural language search powered by your existing backend parser endpoint.</p>

        <form className="grid" onSubmit={runSearch}>
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
          <div>
            <button className="button" type="submit">{loading ? 'Searching...' : 'Search'}</button>
          </div>
        </form>

        {meta ? (
          <p className="small" style={{ marginTop: 12 }}>
            page={meta.page} limit={meta.limit} total={meta.total} total_pages={meta.total_pages}
          </p>
        ) : null}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.gender}</td>
                <td>{row.age}</td>
                <td>{row.country_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </section>
  );
}