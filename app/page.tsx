'use client';

import { useEffect, useState } from 'react';
import SearchBar, { SearchFilters } from './components/SearchBar';
import ResultsTable from './components/ResultsTable';
import Visualization from './components/Visualization';
import SiteFooter from './components/SiteFooter';
import SiteHeader from './components/SiteHeader';
import { CSVData } from '@/lib/csvParser';

export default function Home() {
  const [searchResults, setSearchResults] = useState<CSVData[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [showVisualization, setShowVisualization] = useState(true);
  const [lastQuery, setLastQuery] = useState('');
  const [lastType, setLastType] = useState('all');

  useEffect(() => {
    fetch('/api/files')
      .then((res) => res.json())
      .then((data) => setAvailableFiles(data.files || []))
      .catch((err) => console.error('Error loading files:', err));
  }, []);

  const handleSearch = async ({ query, type, files }: SearchFilters) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,#c7d2fe_0,transparent_35%),radial-gradient(circle_at_85%_0,#fde68a_0,transparent_28%),radial-gradient(circle_at_50%_80%,#e2e8f0_0,transparent_40%)] opacity-70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mx-auto text-center space-y-5" id="explore">
            <h2 className="text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight">
              Explore proteins, MRI phenotypes, and disease evidence
            </h2>
            <p className="text-lg text-slate-600">
              Search across association and causality results in a unified portal.
            </p>
            <div className="mt-6">
              <SearchBar
                onSearch={handleSearch}
                isLoading={isLoading}
                availableFiles={availableFiles}
              />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-12">
        {availableFiles.length === 0 && !isLoading && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
            <p className="font-semibold">No CSV files found.</p>
            <p className="text-sm mt-1">
              Add your data to <code className="px-1 py-0.5 bg-amber-100 rounded">public/data</code> and refresh.
            </p>
          </div>
        )}

        {hasSearched && (
          <div className="space-y-6">
            {searchResults.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-600">Query</p>
                  <p className="text-lg font-semibold text-slate-900">{lastQuery || '—'}</p>
                  <p className="text-sm text-slate-600 capitalize">Mode: {lastType}</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showVisualization}
                    onChange={(e) => setShowVisualization(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Show visualizations</span>
                </label>
              </div>
            )}

            {showVisualization && searchResults.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <Visualization results={searchResults} />
              </div>
            )}

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <ResultsTable results={searchResults} totalResults={totalResults} />
            </div>
          </div>
        )}

        <section className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.uniprot.org"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:-translate-y-0.5 transition"
          >
            <img
              src="/images/uniprot-card.svg"
              alt="UniProt"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-900">UniProt Knowledgebase</p>
              <p className="text-sm text-slate-600 mt-1">
                Curated protein sequence and functional information.
              </p>
            </div>
          </a>
          <a
            href="https://www.ukbiobank.ac.uk"
            target="_blank"
            rel="noreferrer"
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:-translate-y-0.5 transition"
          >
            <img
              src="/images/ukbiobank-card.svg"
              alt="UK Biobank"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <p className="text-sm font-semibold text-slate-900">UK Biobank</p>
              <p className="text-sm text-slate-600 mt-1">
                Large-scale biomedical database and research resource.
              </p>
            </div>
          </a>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
