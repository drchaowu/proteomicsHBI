'use client';

import { useEffect, useState } from 'react';
import SearchBar, { SearchFilters } from './SearchBar';
import ResultsTable from './ResultsTable';
import Visualization from './Visualization';
import { CSVData } from '@/lib/csvParser';

interface SectionPageProps {
  title: string;
  description?: string;
  enableDownload?: boolean;
}

const sectionMeta: Record<string, { description: string; placeholder: string; hint: string }> = {
  Proteomics: {
    description:
      'Search plasma proteins and explore their associations with cardiac/brain MRI traits, disease prevalence, and disease incidence across multi-cohort datasets.',
    placeholder: 'e.g. NT-proBNP, TNFRSF10A, IL6…',
    hint: 'Enter a protein name, gene symbol, or UniProt ID.',
  },
  'MRI Phenotypes': {
    description:
      'Explore associations between cardiac and brain imaging-derived phenotypes (IDPs) and circulating plasma proteins.',
    placeholder: 'e.g. LV mass, hippocampal volume…',
    hint: 'Enter an MRI trait or imaging phenotype name.',
  },
  'Disease outcomes': {
    description:
      'Discover plasma protein associations with cardiovascular, neurological, and psychiatric disease incidence and outcomes.',
    placeholder: 'e.g. heart failure, dementia, atrial fibrillation…',
    hint: 'Enter a disease name or ICD category.',
  },
  Download: {
    description: 'Search and download filtered results as CSV files for offline analysis.',
    placeholder: 'Search all data…',
    hint: 'Search across all datasets and download the filtered results.',
  },
};

export default function SectionPage({ title, description, enableDownload = false }: SectionPageProps) {
  const [searchResults, setSearchResults] = useState<CSVData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'figure'>('table');

  const meta = sectionMeta[title];

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

  const handleDownload = () => {
    if (totalResults === 0) return;

    const headerSet = new Set<string>();
    searchResults.forEach((dataset) => {
      dataset.headers.forEach((header) => headerSet.add(header));
    });

    const headers = ['source_file', ...Array.from(headerSet)];
    const escapeValue = (value: unknown) => {
      const text = value === null || value === undefined ? '' : String(value);
      if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
      return text;
    };

    const rows = searchResults.flatMap((dataset) =>
      dataset.data.map((row) => [
        dataset.filename,
        ...headers.slice(1).map((header) => row[header] ?? ''),
      ])
    );

    const csvLines = [headers.join(','), ...rows.map((row) => row.map(escapeValue).join(','))];
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    link.href = url;
    link.download = `${slug || 'filtered-results'}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-[340px] space-y-5 lg:sticky lg:top-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
                {title}
              </p>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">{title}</h2>
              {(description || meta?.description) && (
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {description || meta?.description}
                </p>
              )}
            </div>

            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              availableFiles={availableFiles}
              searchPlaceholder={meta?.placeholder}
              fixedType={
                title === 'Proteomics'
                  ? 'protein'
                  : title === 'MRI Phenotypes'
                    ? 'mri'
                    : title === 'Disease outcomes'
                      ? 'disease'
                      : undefined
              }
              showTypeSelector={false}
              secondaryFilter={
                title === 'Proteomics'
                  ? { placeholder: 'Filter by disease or MRI trait…', type: 'disease_mri' }
                  : title === 'MRI Phenotypes'
                    ? { placeholder: 'Filter by protein or MRI trait…', type: 'protein_mri' }
                    : title === 'Disease outcomes'
                      ? { placeholder: 'Filter by protein…', type: 'protein' }
                      : undefined
              }
            />

            {meta?.hint && !hasSearched && (
              <p className="text-xs text-slate-400 flex items-start gap-1.5">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {meta.hint}
              </p>
            )}
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 space-y-5 min-w-0">

            {/* Not yet searched */}
            {!hasSearched && (
              <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.2-5.2m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z" />
                  </svg>
                </div>
                <p className="font-semibold text-slate-500">Ready to search</p>
                <p className="text-sm mt-1 max-w-xs">
                  Enter a search term in the panel on the left to explore the dataset.
                </p>
              </div>
            )}

            {/* Results area */}
            {hasSearched && (
              <div className="space-y-4">
                {/* Query info + controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div>
                    {isLoading ? (
                      <span className="flex items-center gap-2 text-slate-500">
                        <span className="inline-block w-3.5 h-3.5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                        Searching…
                      </span>
                    ) : (
                      <>
                        <span className="text-slate-500">Query: </span>
                        <span className="font-semibold text-slate-900">{lastQuery || '—'}</span>
                        <span className="text-slate-400 mx-1.5">·</span>
                        <span className="text-slate-500 capitalize">{lastType}</span>
                        {totalResults > 0 && (
                          <>
                            <span className="text-slate-400 mx-1.5">·</span>
                            <span className="font-semibold text-blue-600">{totalResults} results</span>
                          </>
                        )}
                      </>
                    )}
                  </div>

                  {!isLoading && searchResults.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {/* View mode toggle */}
                      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('table')}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                            viewMode === 'table'
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Table
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('figure')}
                          className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                            viewMode === 'figure'
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Figures
                        </button>
                      </div>

                      {/* Download button */}
                      {enableDownload && totalResults > 0 && (
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download CSV
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Figures view */}
                {!isLoading && searchResults.length > 0 && viewMode === 'figure' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
                    <Visualization results={searchResults} />
                  </div>
                )}

                {/* Table view */}
                {!isLoading && viewMode === 'table' && (
                  <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 min-w-0">
                    <ResultsTable results={searchResults} totalResults={totalResults} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
