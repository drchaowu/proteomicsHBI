'use client';

import { CSVData } from '@/lib/csvParser';
import { DATASET_TITLES } from '@/lib/datasets';
import { useState } from 'react';

interface ResultsTableProps {
  results: CSVData[];
  totalResults: number;
}

export default function ResultsTable({ results, totalResults }: ResultsTableProps) {
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  const formatValue = (value: unknown, header: string) => {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const raw = typeof value === 'string' ? value.trim() : value;
    const numberValue = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(numberValue)) {
      return String(value);
    }

    const lowerHeader = header.toLowerCase();
    const isPValue = lowerHeader.includes('pvalue') || lowerHeader.includes('p value');
    const isCount = lowerHeader === 'n' || lowerHeader.includes('participants');

    if (isCount) {
      return String(Math.round(numberValue));
    }

    if (isPValue) {
      return numberValue < 0.001 ? numberValue.toExponential(2) : numberValue.toFixed(3);
    }

    return numberValue.toFixed(2);
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg font-medium">No results found. Try a different search term or include more fields.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-slate-600 mb-4 flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
          {results.length} file{results.length !== 1 ? 's' : ''}
        </span>
      </div>

      {results.map((csvData, idx) => (
        <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => setExpandedFile(expandedFile === csvData.filename ? null : csvData.filename)}
            className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Dataset
              </span>
              <span className="font-semibold text-lg text-slate-900">
                {DATASET_TITLES[csvData.filename] || csvData.filename}
              </span>
              <span className="text-sm text-slate-500">
                ({csvData.data.length} result{csvData.data.length !== 1 ? 's' : ''})
              </span>
            </div>
            <svg
              className={`w-5 h-5 transition-transform ${expandedFile === csvData.filename ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedFile === csvData.filename && (
            <div className="p-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 tabular-nums">
                <thead className="bg-slate-50">
                  <tr>
                    {csvData.headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {csvData.data.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50">
                      {csvData.headers.map((header, hIdx) => (
                        <td
                          key={hIdx}
                          className="px-4 py-3 text-sm text-slate-900 whitespace-nowrap"
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
      ))}
    </div>
  );
}
