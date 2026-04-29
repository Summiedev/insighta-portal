import Link from 'next/link';

const links = [
  { href: '/login', label: 'Login', note: 'Start GitHub OAuth and session check.' },
  { href: '/dashboard', label: 'Dashboard', note: 'Overview and quick metrics.' },
  { href: '/profiles', label: 'Profiles', note: 'Filters, pagination, and list view.' },
  { href: '/profiles/search', label: 'Search', note: 'Natural language profile search.' },
  { href: '/account', label: 'Account', note: 'Current user details and role.' },
  { href: '/export', label: 'CSV Export', note: 'Admin export workflow.' },
];

export default function HomePage() {
  return (
    <main className="container">
      <section className="card portal-hero">
        <div>
          <p className="eyebrow">Insighta Portal</p>
          <h1>Welcome</h1>
          <p className="small">Use this page as your central navigation hub.</p>
        </div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h2>Quick Navigation</h2>
        <div className="grid two" style={{ marginTop: 10 }}>
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" style={{ display: 'block' }}>
              <strong>{item.label}</strong>
              <p className="small" style={{ margin: '6px 0 0' }}>{item.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
