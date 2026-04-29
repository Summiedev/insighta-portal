import Nav from '../../components/Nav';

export default function ProtectedLayout({ children }) {
  return (
    <main className="container portal-shell">
      <header className="portal-hero card">
        <div>
          <p className="eyebrow">Insighta Portal</p>
          <h1>Navigate your workspace</h1>
          <p className="small">
            Use the same backend as the CLI to explore dashboards, profiles, search, account details, and export tools.
          </p>
        </div>
      </header>

      <Nav />

      <div className="portal-content">{children}</div>
    </main>
  );
}