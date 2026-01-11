'use client';

import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Data Explorer', href: '/' },
  { label: 'Proteomics', href: '/proteomics' },
  { label: 'MRI Phenotypes', href: '/mri-phenotypes' },
  { label: 'Disease Outcomes', href: '/disease-outcomes' },
  { label: 'About', href: '/about' },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Proteomics in Heart-Brain Connection
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Proteomics in Heart-Brain Connection
            </h1>
          </div>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-full border transition ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-transparent hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
