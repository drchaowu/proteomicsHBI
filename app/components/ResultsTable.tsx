'use client';

import { CSVData } from '@/lib/csvParser';
import { DATASET_TITLES } from '@/lib/datasets';
import { useEffect, useState } from 'react';

interface ResultsTableProps {
  results: CSVData[];
  totalResults: number;
}

export default function ResultsTable({ results, totalResults }: ResultsTableProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  // Auto-expand the first dataset when results change
  useEffect(() => {
    if (results.length > 0) {
      setExpandedFiles(new Set([results[0].filename]));
    } else {
      setExpandedFiles(new Set());
    }
  }, [results]);

  const toggleFile = (filename: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) {
        next.delete(filename);
      } else {
        next.add(filename);
      }
      return next;
    });
  };

  const formatValue = (value: unknown, header: string) => {
    if (value === null || value === undefined || value === '') return '—';
    const raw = typeof value === 'string' ? value.trim() : value;
    const numberValue = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(numberValue)) return String(value);
    const h = header.toLowerCase();
    if (h === 'n' || h.includes('participants')) return String(Math.round(numberValue));
    if (h.includes('pvalue') || h.includes('p_value') || h.includes('p value')) {
      return numberValue < 0.001 ? numberValue.toExponential(2) : numberValue.toFixed(3);
    }
    return numberValue.toFixed(2);
  };

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <svg className="w-12 h-12 mb-4 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m21 21-5.2-5.2m0 0a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9Z" />
        </svg>
        <p className="font-semibold text-slate-500">No results found</p>
        <p className="text-sm mt-1">Try a different search term or dataset.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-semibold">
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200">
          across {results.length} dataset{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Dataset blocks */}
      {results.map((csvData, idx) => {
        const isExpanded = expandedFiles.has(csvData.filename);
        return (
          <div
            key={idx}
            className="border border-slate-200 rounded-2xl bg-white shadow-sm"
          >
            {/* Header row */}
            <button
              onClick={() => toggleFile(csvData.filename)}
              className={`w-full px-5 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between gap-3 text-left ${isExpanded ? 'rounded-t-2xl' : 'rounded-2xl'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="font-semibold text-slate-900 truncate text-sm">
                  {DATASET_TITLES[csvData.filename] || csvData.filename}
                </span>
                <span className="shrink-0 text-xs font-medium text-slate-500 bg-slate-200 rounded-full px-2 py-0.5">
                  {csvData.data.length} row{csvData.data.length !== 1 ? 's' : ''}
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Table */}
            {isExpanded && (
              <div className="overflow-x-auto scrollbar-visible">
                <table className="min-w-max w-full tabular-nums text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {csvData.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {csvData.data.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        {csvData.headers.map((header, hIdx) => (
                          <td
                            key={hIdx}
                            className="px-4 py-2.5 whitespace-nowrap text-slate-700"
                          >
                            {formatValue(row[header], header)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
