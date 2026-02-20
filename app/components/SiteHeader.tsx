'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Data Explorer', href: '/' },
  { label: 'Proteomics', href: '/proteomics' },
  { label: 'MRI Phenotypes', href: '/mri-phenotypes' },
  { label: 'Disease Outcomes', href: '/disease-outcomes' },
  { label: 'Download', href: '/download' },
  { label: 'About', href: '/about' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">

          {/* Brand */}
          <a href="/" className="shrink-0">
            <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              Proteomics in Heart-Brain Connection
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-slate-100 space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                item.href === '/' ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
