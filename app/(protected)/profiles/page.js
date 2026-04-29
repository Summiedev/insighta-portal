"use client";

import { useState } from 'react';
import Link from 'next/link';
import { backendJson } from '../../../lib/backend';

function encodeParams(params) {
  const q = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const v = params[key];
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      q.set(key, String(v));
    }
  });
  return q.toString();
}

export default function ProfilesPage() {
  const [role] = useState(() => {
    if (typeof document === 'undefined') return 'analyst';
    const cookie = document.cookie
      .split(';')
      .map((v) => v.trim())
      .find((v) => v.startsWith('portal_role='));
    return cookie ? cookie.split('=')[1] || 'analyst' : 'analyst';
  });

  const [mode, setMode] = useState('filters');
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nlQuery, setNlQuery] = useState('young males from nigeria');
  const [filters, setFilters] = useState({
    gender: '',
    country_id: '',
    min_age: '',
    max_age: '',
    sort_by: 'created_at',
    order: 'asc',
    page: '1',
    limit: '10',
  });

  async function runFilters(e) {
    e.preventDefault();
    setLoading(true);

    const query = encodeParams(filters);
    const { res, data: payload } = await backendJson(`/api/profiles?${query}`, { method: 'GET', credentials: 'include' });
    setLoading(false);

    if (res.ok && payload.status === 'success') {
      setRows(payload.data || []);
      setMeta(payload);
      return;
    }

    alert(payload.message || 'Unable to load profiles');
  }

  async function runSearch(e) {
    e.preventDefault();
    setLoading(true);

    const query = encodeParams({ q: nlQuery, page: filters.page, limit: filters.limit });
    const { res, data: payload } = await backendJson(`/api/profiles/search?${query}`, { method: 'GET', credentials: 'include' });
    setLoading(false);

    if (res.ok && payload.status === 'success') {
      setRows(payload.data || []);
      setMeta(payload);
      return;
    }

    alert(payload.message || 'Unable to run search');
  }

  return (
    <>
      <section className="card">
        <h1>Profiles</h1>
        <p className="small">Use either advanced filters or natural language search (same backend parser).</p>

        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button type="button" className="button" onClick={() => setMode('filters')}>Advanced Filters</button>
          <button type="button" className="button secondary" onClick={() => setMode('search')}>Natural Language Search</button>
        </div>
      </section>

      {mode === 'filters' ? (
        <form className="card grid two" onSubmit={runFilters} style={{ marginTop: 14 }}>
          <label>Gender
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
              <option value="">Any</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </label>

          <label>Country ID
            <input value={filters.country_id} onChange={(e) => setFilters({ ...filters, country_id: e.target.value.toUpperCase() })} placeholder="NG" />
          </label>

          <label>Min Age
            <input value={filters.min_age} onChange={(e) => setFilters({ ...filters, min_age: e.target.value })} placeholder="18" />
          </label>

          <label>Max Age
            <input value={filters.max_age} onChange={(e) => setFilters({ ...filters, max_age: e.target.value })} placeholder="65" />
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

          <label>Page
            <input value={filters.page} onChange={(e) => setFilters({ ...filters, page: e.target.value })} />
          </label>

          <label>Limit
            <input value={filters.limit} onChange={(e) => setFilters({ ...filters, limit: e.target.value })} />
          </label>

          <div>
            <button className="button" type="submit">{loading ? 'Loading...' : 'Apply Filters'}</button>
          </div>
        </form>
      ) : (
        <form className="card grid" onSubmit={runSearch} style={{ marginTop: 14 }}>
          <label>Search Query
            <input value={nlQuery} onChange={(e) => setNlQuery(e.target.value)} />
          </label>
          <div>
            <button className="button" type="submit">{loading ? 'Searching...' : 'Run Search'}</button>
          </div>
        </form>
      )}

      <section className="card" style={{ marginTop: 14 }}>
        <h2>Results</h2>
        {meta ? (
          <p className="small">
            page={meta.page} limit={meta.limit} total={meta.total} total_pages={meta.total_pages} has_next={String(meta.has_next)} has_prev={String(meta.has_prev)}
          </p>
        ) : null}

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Country</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><Link href={`/profiles/${row.id}`}>{row.name}</Link></td>
                <td>{row.gender}</td>
                <td>{row.age}</td>
                <td>{row.country_id}</td>
                <td>{row.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}