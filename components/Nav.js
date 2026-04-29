"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/profiles', label: 'Profiles' },
  { href: '/profiles/search', label: 'Search' },
  { href: '/account', label: 'Account' },
  { href: '/export', label: 'CSV Export', adminOnly: true },
];

export default function Nav({ role = 'analyst' }) {
  const pathname = usePathname();

  return (
    <nav className="nav">
      {items
        .filter((item) => !item.adminOnly || role === 'admin')
        .map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href} className={active ? 'nav-link active' : 'nav-link'}>
              {item.label}
            </Link>
          );
        })}
    </nav>
  );
}