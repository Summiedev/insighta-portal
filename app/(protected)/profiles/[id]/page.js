"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { backendJson } from '../../../../lib/backend';

export default function ProfileDetailPage() {
  const params = useParams();
  const [role] = useState(() => {
    if (typeof document === 'undefined') return 'analyst';
    const cookie = document.cookie
      .split(';')
      .map((v) => v.trim())
      .find((v) => v.startsWith('portal_role='));
    return cookie ? cookie.split('=')[1] || 'analyst' : 'analyst';
  });
  const [profile, setProfile] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const id = params && params.id ? String(params.id) : '';
    if (!id) return;

    backendJson(`/api/profiles/${encodeURIComponent(id)}`, { method: 'GET', credentials: 'include' })
      .then(({ res, data }) => {
        if (res.ok && data.status === 'success') {
          setProfile(data.data);
          return;
        }
        setStatus(data.message || 'Unable to load profile');
      })
      .catch(() => setStatus('Unable to load profile'));
  }, [params]);

  return (
    <section className="card">
        <h1>Profile Detail</h1>
        {status ? <p className="small">{status}</p> : null}
        {profile ? (
          <div className="grid">
            <p><strong>Name:</strong> {profile.name}</p>
            <p><strong>Gender:</strong> {profile.gender}</p>
            <p><strong>Age:</strong> {profile.age}</p>
            <p><strong>Country:</strong> {profile.country_name}</p>
            <p><strong>Created:</strong> {profile.created_at}</p>
          </div>
        ) : null}
    </section>
  );
}