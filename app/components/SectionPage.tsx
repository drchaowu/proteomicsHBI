'use client';

import { useEffect, useState } from 'react';
import SearchBar, { SearchFilters } from './SearchBar';
import ResultsTable from './ResultsTable';
import Visualization from './Visualization';
import { CSVData } from '@/lib/csvParser';

interface SectionPageProps {
  title: string;
  enableDownload?: boolean;
}

export default function SectionPage({ title, enableDownload = false }: SectionPageProps) {
  const [searchResults, setSearchResults] = useState<CSVData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'figure'>('table');

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => setAvailableFiles(data.files || []))
      .catch((err) => console.error('Error loading files:', err));
  }, []);

  const handleSearch = async ({
    query,
    type,
    files,
    filter,
    filterType,
  }: SearchFilters) => {
    const trimmed = query.trim();
    setHasSearched(true);
    setIsLoading(true);
    setLastQuery(trimmed);
    setLastType(type);

    try {
      const params = new URLSearchParams({
        q: trimmed,
        type,
      });

      if (files.length > 0) {
        params.set('files', files.join(','));
      }
      if (filter) {
        params.set('filter', filter);
      }
      if (filterType) {
        params.set('filterType', filterType);
      }

      const response = await fetch(`/api/search?${params}`);
      const data = await response.json();

      if (data.error) {
        console.error('Search error:', data.error);
        setSearchResults([]);
        setTotalResults(0);
      } else {
        setSearchResults(data.results || []);
        setTotalResults(data.totalResults || 0);
      }
    } catch (error) {
      console.error('Search failed:', error);
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
      if (/[",\n]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
      }
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-[360px] space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              availableFiles={availableFiles}
              searchPlaceholder={
                title === 'Proteomics'
                  ? 'Search proteins...'
                  : title === 'MRI Phenotypes'
                    ? 'Search MRI traits...'
                    : title === 'Disease outcomes'
                      ? 'Search diseases...'
                      : undefined
              }
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
                    ? {
                        placeholder: 'Filter by disease or MRI trait...',
                        type: 'disease_mri',
                      }
                    : title === 'MRI Phenotypes'
                      ? {
                          placeholder: 'Filter by protein or MRI trait...',
                          type: 'protein_mri',
                        }
                      : title === 'Disease outcomes'
                        ? {
                            placeholder: 'Filter by protein...',
                            type: 'protein',
                          }
                        : undefined
                }
              />
          </aside>
          <div className="flex-1 space-y-6">
            {hasSearched && (
              <div className="space-y-6">
                {searchResults.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
                    <div>
                      Query:{' '}
                      <span className="font-semibold text-slate-900">{lastQuery || '—'}</span> ·
                      Mode: <span className="capitalize">{lastType}</span>
                      {totalResults > 0 && (
                        <span className="ml-2">· {totalResults} results</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1">
                        <button
                          type="button"
                          onClick={() => setViewMode('table')}
                          className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                            viewMode === 'table'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Table
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode('figure')}
                          className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                            viewMode === 'figure'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Figures
                        </button>
                      </div>
                      {enableDownload && totalResults > 0 && (
                        <button
                          type="button"
                          onClick={handleDownload}
                          className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition"
                        >
                          Download CSV
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {searchResults.length > 0 && viewMode !== 'table' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <Visualization results={searchResults} />
                  </div>
                )}
                {viewMode !== 'figure' && (
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <ResultsTable results={searchResults} totalResults={totalResults} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
