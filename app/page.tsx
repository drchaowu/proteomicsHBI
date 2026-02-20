'use client';

import { useEffect, useState } from 'react';
import SearchBar, { SearchFilters } from './components/SearchBar';
import ResultsTable from './components/ResultsTable';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import { CSVData } from '@/lib/csvParser';

const featureCards = [
  {
    href: '/proteomics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.659.293m-2.016-8.066A24.3 24.3 0 0119.5 3.186M5 14.5l-.688.344a2.25 2.25 0 000 4.024l9.188 4.594a2.25 2.25 0 002 0l9.188-4.594a2.25 2.25 0 000-4.024L19.5 14.5" />
      </svg>
    ),
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    dot: 'bg-blue-500',
    title: 'Proteomics',
    desc: 'Search plasma proteins and their associations with MRI traits and diseases.',
  },
  {
    href: '/mri-phenotypes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292M6.115 5.19A9 9 0 1017.18 4.64M6.115 5.19A8.965 8.965 0 0112 3c1.929 0 3.716.607 5.18 1.64" />
      </svg>
    ),
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    dot: 'bg-violet-500',
    title: 'MRI Phenotypes',
    desc: 'Explore cardiac and brain imaging-derived phenotype associations.',
  },
  {
    href: '/disease-outcomes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    dot: 'bg-rose-500',
    title: 'Disease Outcomes',
    desc: 'Discover proteomics associations with cardiovascular and neurological diseases.',
  },
  {
    href: '/disease-causality',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    ),
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    dot: 'bg-emerald-500',
    title: 'Disease Causality',
    desc: 'Mendelian randomization results evaluating causal protein–disease links.',
  },
];

export default function Home() {
  const [searchResults, setSearchResults] = useState<CSVData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('all');

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => setAvailableFiles(data.files || []))
      .catch((err) => console.error('Error loading files:', err));
  }, []);

  const handleSearch = async ({ query, type, files, filter, filterType }: SearchFilters) => {
    const trimmed = query.trim();
    setHasSearched(true);
    setIsLoading(true);
    setLastQuery(trimmed);
    setLastType(type);

    try {
      const params = new URLSearchParams({ q: trimmed, type });
      if (files.length > 0) params.set('files', files.join(','));
      if (filter) params.set('filter', filter);
      if (filterType) params.set('filterType', filterType);

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.error) {
        setSearchResults([]);
        setTotalResults(0);
      } else {
        setSearchResults(data.results || []);
        setTotalResults(data.totalResults || 0);
      }
    } catch {
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <SiteHeader />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        {/* Decorative radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl translate-y-1/2" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 text-center space-y-6">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
            Explore the molecular links between{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              heart, brain &amp; proteins
            </span>
          </h1>

          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Multi-cohort results portal · Plasma proteomics · MRI phenotypes · Disease outcomes
          </p>

          {/* Search */}
          <div className="max-w-3xl mx-auto mt-2">
            {availableFiles.length === 0 && !isLoading ? (
              <div className="p-4 rounded-2xl bg-amber-900/40 border border-amber-700/50 text-amber-200 text-sm">
                <span className="font-semibold">No datasets found.</span> Add CSV files to{' '}
                <code className="px-1 py-0.5 bg-amber-800/50 rounded">public/data</code> and refresh.
              </div>
            ) : (
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                availableFiles={availableFiles}
                datasetSelectorStyle="full"
                showTypeSelector={false}
              />
            )}
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* Search results */}
        {hasSearched && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Results for <span className="text-blue-600">&ldquo;{lastQuery || '—'}&rdquo;</span>
                </h2>
                <p className="text-sm text-slate-500 mt-0.5 capitalize">
                  Search scope: {lastType}
                  {totalResults > 0 && ` · ${totalResults} rows found`}
                </p>
              </div>
              {isLoading && (
                <span className="text-sm text-slate-400 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                  Searching…
                </span>
              )}
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">
              <ResultsTable results={searchResults} totalResults={totalResults} />
            </div>
          </section>
        )}

        {/* Feature cards */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Browse by category
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">Data categories</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featureCards.map((card) => (
              <a
                key={card.href}
                href={card.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${card.color}`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${card.dot}`} />
                    <p className="font-semibold text-slate-900 text-sm">{card.title}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{card.desc}</p>
                </div>
                <svg className="w-4 h-4 text-slate-300 shrink-0 mt-0.5 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </section>

        {/* Study overview video */}
        <section className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 sm:p-8 grid gap-6 lg:grid-cols-[1fr_1.5fr] items-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Study overview
            </p>
            <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-snug">
              A quick tour of Proteomics in Heart-Brain Interactions
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Watch the short overview to understand the study design, findings, and how to navigate
              this portal.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
            >
              Learn more about the study
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900 shadow-sm">
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/XzbT1pHq4z8"
              title="Study overview video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </section>

        {/* External resources */}
        <section>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              External resources
            </p>
            <h2 className="text-xl font-semibold text-slate-900">Related databases</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="https://www.uniprot.org"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="px-5 py-4 bg-slate-50 h-24 flex items-center justify-center">
                <img
                  src="/images/uniprot-card.png"
                  alt="UniProt"
                  className="h-full object-contain"
                />
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">UniProt Knowledgebase</p>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Curated protein sequence and functional information.
                </p>
              </div>
            </a>
            <a
              href="https://www.ukbiobank.ac.uk"
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="px-5 py-4 bg-slate-50 h-24 flex items-center justify-center">
                <img
                  src="/images/ukbiobank-card.png"
                  alt="UK Biobank"
                  className="h-full object-contain"
                />
              </div>
              <div className="p-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">UK Biobank</p>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Large-scale biomedical database and research resource.
                </p>
              </div>
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
