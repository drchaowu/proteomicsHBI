'use client';

import { CSVData } from '@/lib/csvParser';
import { DATASET_TITLES } from '@/lib/datasets';
import {
  CartesianGrid,
  ErrorBar,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface VisualizationProps {
  results: CSVData[];
}

type ForestDatum = {
  label: string;
  effect: number;
  error: [number, number];
  pvalue: number | undefined;
};

type ForestBlock = {
  title: string;
  data: ForestDatum[];
  effectLabel: string;
};

type HeatmapCell = {
  effect: number;
  pvalue?: number;
};

type HeatmapBlock = {
  title: string;
  rowLabel: string;
  colLabel: string;
  rows: string[];
  cols: string[];
  matrix: (HeatmapCell | null)[][];
  min: number;
  max: number;
};

export default function Visualization({ results }: VisualizationProps) {
  const normalizeKey = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

  const findColumn = (headers: string[], candidates: string[]) => {
    const headerMap = new Map<string, string>();
    headers.forEach((header) => {
      const key = normalizeKey(header);
      if (!headerMap.has(key)) {
        headerMap.set(key, header);
      }
    });

    for (const candidate of candidates) {
      const key = normalizeKey(candidate);
      const match = headerMap.get(key);
      if (match) {
        return match;
      }
    }
    return undefined;
  };

  const toNumber = (value: unknown) => {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const formatPvalue = (value?: number) => {
    if (value === undefined) return '';
    return value < 0.001 ? value.toExponential(2) : value.toFixed(3);
  };

  const wrapLabel = (value: string, maxChars: number) => {
    const words = value.split(/\s+/).filter(Boolean);
    if (words.length === 0) return [''];
    const lines: string[] = [];
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      const next = words[i];
      if ((current + ' ' + next).length > maxChars) {
        lines.push(current);
        current = next;
      } else {
        current = `${current} ${next}`;
      }
    }
    lines.push(current);
    return lines;
  };

  const buildForestBlock = (csvData: CSVData): ForestBlock | null => {
    const ciLowerCol = findColumn(csvData.headers, ['ci_lower', '95_ci_lower', 'ci_l']);
    const ciUpperCol = findColumn(csvData.headers, ['ci_upper', '95_ci_upper', 'ci_u']);
    const orCol = findColumn(csvData.headers, ['odds_ratio', 'oddsratio', 'or']);
    const hrCol = findColumn(csvData.headers, ['hazard_ratio', 'hazardratio', 'hr']);
    const pvalueCol = findColumn(csvData.headers, ['pvalue', 'p_value', 'p-value']);
    const modelCol = findColumn(csvData.headers, ['model', 'analysis_model']);

    const effectCol = orCol || hrCol;
    if (!effectCol || !ciLowerCol || !ciUpperCol) {
      return null;
    }

    const labelCol =
      findColumn(csvData.headers, ['disease', 'protein', 'outcome', 'trait']) ||
      csvData.headers[0];
    const diseaseCol = findColumn(csvData.headers, ['disease', 'outcome']);
    const proteinCol = findColumn(csvData.headers, ['protein', 'gene']);

    const isCausality = csvData.filename.toLowerCase().includes('causality');

    let rows = csvData.data
      .map((row) => {
        const effect = toNumber(row[effectCol]);
        const lower = toNumber(row[ciLowerCol]);
        const upper = toNumber(row[ciUpperCol]);
        const pvalue = pvalueCol ? toNumber(row[pvalueCol]) ?? undefined : undefined;
        const baseLabel = String(row[labelCol] || '').trim();
        const model = modelCol ? String(row[modelCol] || '').trim() : '';
        const disease = diseaseCol ? String(row[diseaseCol] || '').trim() : '';
        const proteinRaw = proteinCol ? String(row[proteinCol] || '').trim() : '';
        const protein = proteinRaw.split(';')[0].trim();
        if (!baseLabel || effect === null || lower === null || upper === null) {
          return null;
        }

        const label = disease && protein ? `${protein} -> ${disease}` : baseLabel;
        const lowError = Math.max(0, effect - lower);
        const highError = Math.max(0, upper - effect);

        return {
          label,
          effect,
          error: [lowError, highError] as [number, number],
          pvalue,
          disease,
          protein,
        };
      })
      .filter((row): row is ForestDatum & { disease: string; protein: string } =>
        Boolean(row)
      );

    if (isCausality && pvalueCol && rows.length > 0 && diseaseCol && proteinCol) {
      const bestByPair = new Map<string, typeof rows[number]>();
      rows.forEach((row) => {
        const key = `${row.protein}||${row.disease}`;
        const current = bestByPair.get(key);
        if (!current || (row.pvalue ?? 1) < (current.pvalue ?? 1)) {
          bestByPair.set(key, row);
        }
      });
      rows = Array.from(bestByPair.values()).sort(
        (a, b) => (a.pvalue ?? 1) - (b.pvalue ?? 1)
      );
    } else {
      rows = rows.slice(0, 20);
    }

    if (rows.length === 0) {
      return null;
    }

    const title = DATASET_TITLES[csvData.filename] || csvData.filename;
    return {
      title,
      data: rows,
      effectLabel: orCol ? 'Odds Ratio' : 'Hazard Ratio',
    };
  };

  const buildHeatmapBlock = (csvData: CSVData): HeatmapBlock | null => {
    const betaCol = findColumn(csvData.headers, ['beta', 'effect', 'correlation_coefficient']);
    const pvalueCol = findColumn(csvData.headers, ['pvalue', 'p_value', 'p-value']);
    if (!betaCol) {
      return null;
    }

    const rowCol =
      findColumn(csvData.headers, ['cmr_trait', 'protein', 'mri_trait']) ||
      findColumn(csvData.headers, ['cmr_idp', 'protein', 'mri_idp']);
    const colCol =
      findColumn(csvData.headers, ['bmr_trait', 'mri_trait', 'cmr_trait']) ||
      findColumn(csvData.headers, ['bmr_idp', 'mri_idp', 'cmr_idp']);

    if (!rowCol || !colCol || rowCol === colCol) {
      return null;
    }

    const pairStats = new Map<
      string,
      { sum: number; count: number; minP?: number }
    >();
    const rowCounts = new Map<string, number>();
    const colCounts = new Map<string, number>();

    csvData.data.forEach((row) => {
      const rowLabel = String(row[rowCol] || '').trim();
      const colLabel = String(row[colCol] || '').trim();
      const value = toNumber(row[betaCol]);
      if (!rowLabel || !colLabel || value === null) {
        return;
      }

      const pvalue = pvalueCol ? toNumber(row[pvalueCol]) ?? undefined : undefined;
      const key = `${rowLabel}||${colLabel}`;
      const current = pairStats.get(key) || { sum: 0, count: 0, minP: undefined };
      current.sum += value;
      current.count += 1;
      if (pvalue !== undefined) {
        current.minP = current.minP === undefined ? pvalue : Math.min(current.minP, pvalue);
      }
      pairStats.set(key, current);
      rowCounts.set(rowLabel, (rowCounts.get(rowLabel) || 0) + 1);
      colCounts.set(colLabel, (colCounts.get(colLabel) || 0) + 1);
    });

    const rows = Array.from(rowCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([label]) => label);
    const cols = Array.from(colCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([label]) => label);

    if (rows.length === 0 || cols.length === 0) {
      return null;
    }

    const values: number[] = [];
    const matrix = rows.map((rowLabel) =>
      cols.map((colLabel) => {
        const key = `${rowLabel}||${colLabel}`;
        const stat = pairStats.get(key);
        if (!stat) {
          return null;
        }
        const avg = stat.sum / stat.count;
        values.push(avg);
        return { effect: avg, pvalue: stat.minP };
      })
    );

    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;

    const title = DATASET_TITLES[csvData.filename] || csvData.filename;
    return {
      title,
      rowLabel: rowCol,
      colLabel: colCol,
      rows,
      cols,
      matrix,
      min,
      max,
    };
  };

  const getHeatmapColor = (value: number | null, min: number, max: number) => {
    if (value === null) {
      return '#f1f5f9';
    }
    const maxAbs = Math.max(Math.abs(min), Math.abs(max), 0.000001);
    const normalized = value / maxAbs;
    const clamp = Math.max(-1, Math.min(1, normalized));
    if (clamp >= 0) {
      const intensity = Math.round(255 - clamp * 155);
      return `rgb(239, ${intensity}, ${intensity})`;
    }
    const intensity = Math.round(255 - Math.abs(clamp) * 155);
    return `rgb(${intensity}, ${intensity}, 239)`;
  };

  const forestBlocks = results
    .map((csvData) => buildForestBlock(csvData))
    .filter((block): block is ForestBlock => Boolean(block));
  const heatmapBlocks = results
    .map((csvData) => buildHeatmapBlock(csvData))
    .filter((block): block is HeatmapBlock => Boolean(block));

  if (forestBlocks.length === 0 && heatmapBlocks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No suitable data found for visualization.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {heatmapBlocks.map((block) => (
        <div key={`heatmap-${block.title}`} className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">{block.title} heatmap</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-sm text-slate-600">
                {block.rowLabel} × {block.colLabel}
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>{block.min.toFixed(2)}</span>
                <div className="h-2 w-32 rounded-full bg-gradient-to-r from-blue-200 via-slate-100 to-rose-200" />
                <span>{block.max.toFixed(2)}</span>
              </div>
            </div>
            <div className="overflow-auto">
              <div
                className="grid gap-px bg-slate-200"
                style={{
                  gridTemplateColumns: `180px repeat(${block.cols.length}, minmax(90px, 1fr))`,
                }}
              >
                <div className="bg-white p-2 text-xs font-semibold text-slate-500">
                  {block.rowLabel} / {block.colLabel}
                </div>
                {block.cols.map((col) => (
                  <div
                    key={`col-${col}`}
                    className="bg-white p-2 text-xs font-semibold text-slate-600"
                  >
                    {col}
                  </div>
                ))}
                {block.rows.map((rowLabel, rowIdx) => (
                  <div key={`row-${rowLabel}`} className="contents">
                    <div className="bg-white p-2 text-xs font-semibold text-slate-600">
                      {rowLabel}
                    </div>
                    {block.cols.map((colLabel, colIdx) => {
                      const cell = block.matrix[rowIdx][colIdx];
                      const color = getHeatmapColor(
                        cell?.effect ?? null,
                        block.min,
                        block.max
                      );
                      return (
                        <div
                          key={`${rowLabel}-${colLabel}`}
                          className="p-2 text-[11px] text-slate-900 text-center leading-tight"
                          style={{ backgroundColor: color }}
                          title={
                            cell
                              ? `${rowLabel} × ${colLabel}: ${cell.effect.toFixed(3)} (p=${formatPvalue(cell.pvalue)})`
                              : 'No data'
                          }
                        >
                          {cell ? (
                            <>
                              <div className="font-semibold">{cell.effect.toFixed(2)}</div>
                              <div className="text-slate-600">p={formatPvalue(cell.pvalue)}</div>
                            </>
                          ) : (
                            '—'
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {forestBlocks.map((block) => (
        <div key={`forest-${block.title}`} className="space-y-4">
          <h3 className="text-xl font-semibold text-slate-900">{block.title} forest plot</h3>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between gap-4 mb-4">
              <p className="text-sm text-slate-600">{block.effectLabel} with 95% CI</p>
            </div>
            <ResponsiveContainer width="100%" height={90 + block.data.length * 58}>
              <ScatterChart layout="vertical" margin={{ left: 230, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="effect" />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={210}
                  tick={({ x, y, payload }) => {
                    const lines = wrapLabel(String(payload.value), 30);
                    return (
                      <text
                        x={x}
                        y={y}
                        textAnchor="end"
                        fill="#475569"
                        fontSize={11}
                      >
                        {lines.map((line, index) => (
                          <tspan key={index} x={x} dy={index === 0 ? 4 : 12}>
                            {line}
                          </tspan>
                        ))}
                      </text>
                    );
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'effect') {
                      const numeric =
                        typeof value === 'number' ? value : Number(value ?? NaN);
                      const display = Number.isFinite(numeric)
                        ? numeric.toFixed(3)
                        : '—';
                      return [display, block.effectLabel];
                    }
                    return [String(value ?? '—'), String(name)];
                  }}
                  labelFormatter={(label) => label}
                />
                <ReferenceLine x={1} stroke="#94a3b8" strokeDasharray="3 3" />
                <Scatter data={block.data} fill="#0ea5e9">
                  <ErrorBar dataKey="error" width={4} direction="x" stroke="#0ea5e9" />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
