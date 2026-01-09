'use client';

import { useMemo, useState, FormEvent } from 'react';
import { DATASET_GROUPS } from '@/lib/datasets';

export interface SearchFilters {
  query: string;
  type: string;
  files: string[];
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  isLoading?: boolean;
  availableFiles?: string[];
}

const quickTypes: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Proteins', value: 'protein' },
  { label: 'Diseases', value: 'disease' },
  { label: 'MRI', value: 'mri' },
];

export default function SearchBar({
  onSearch,
  isLoading = false,
  availableFiles = [],
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [datasetGroup, setDatasetGroup] = useState('all');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const selectedGroup = DATASET_GROUPS.find((group) => group.value === datasetGroup);
    const normalizedFiles = availableFiles.map((file) => file.toLowerCase());
    const groupFiles =
      selectedGroup && selectedGroup.value !== 'all'
        ? availableFiles.filter((file, index) => {
            const lower = normalizedFiles[index];
            if (selectedGroup.files && selectedGroup.files.length > 0) {
              return selectedGroup.files.some((name) => name.toLowerCase() === lower);
            }
            if (selectedGroup.match && selectedGroup.match.length > 0) {
              return selectedGroup.match.every((token) => lower.includes(token));
            }
            return false;
          })
        : [];

    onSearch({
      query: searchTerm.trim(),
      type: searchType,
      files: groupFiles,
    });
  };

  const clearFilters = () => {
    setSearchType('all');
    setDatasetGroup('all');
  };

  const fileSummary = useMemo(() => {
    const groupLabel = DATASET_GROUPS.find((group) => group.value === datasetGroup)?.label;
    return groupLabel || 'All datasets';
  }, [datasetGroup]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-4 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Scope</span>
          {quickTypes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setSearchType(item.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                searchType === item.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-200 hover:text-blue-700'
              }`}
              disabled={isLoading}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Search term
            </span>
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500">
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="m21 21-5.2-5.2m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z"
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search proteins, diseases, MRI phenotypes..."
                className="w-full bg-transparent outline-none text-base text-slate-800 placeholder:text-slate-400"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="md:w-60">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Datasets</span>
              <select
                value={datasetGroup}
                onChange={(e) => setDatasetGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {DATASET_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
              {availableFiles.length === 0 && (
                <span className="text-xs text-slate-500">No CSV datasets detected</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="text-sm text-slate-600">
            Searching in: <span className="font-semibold text-slate-900">{fileSummary}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition"
              disabled={isLoading}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-sm"
            >
              {isLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
