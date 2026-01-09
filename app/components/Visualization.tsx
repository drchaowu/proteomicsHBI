'use client';

import { CSVData } from '@/lib/csvParser';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line } from 'recharts';

interface VisualizationProps {
  results: CSVData[];
}

export default function Visualization({ results }: VisualizationProps) {
  // Try to find numeric columns that might be suitable for visualization
  const findNumericColumns = (csvData: CSVData): string[] => {
    if (csvData.data.length === 0) return [];
    
    const numericColumns: string[] = [];
    csvData.headers.forEach(header => {
      const sampleValue = csvData.data[0][header];
      const numValue = Number(sampleValue);
      if (!isNaN(numValue) && sampleValue !== null && sampleValue !== '') {
        numericColumns.push(header);
      }
    });
    return numericColumns;
  };

  // Try to find common visualization-friendly columns
  const findVisualizationData = () => {
    for (const csvData of results) {
      if (csvData.data.length === 0) continue;
      
      // Look for common statistical columns
      const pvalueCol = csvData.headers.find(h => 
        h.toLowerCase().includes('pvalue') || 
        h.toLowerCase().includes('p_value') ||
        h.toLowerCase().includes('p-value')
      );
      const betaCol = csvData.headers.find(h => 
        h.toLowerCase().includes('beta') || 
        h.toLowerCase().includes('effect')
      );
      const orCol = csvData.headers.find(h => 
        h.toLowerCase().includes('or') || 
        h.toLowerCase().includes('odds')
      );
      const seCol = csvData.headers.find(h => 
        h.toLowerCase().includes('se') || 
        h.toLowerCase().includes('standard_error')
      );
      
      // Try to find a label column (protein, gene, disease, etc.)
      const labelCol = csvData.headers.find(h => 
        ['protein', 'gene', 'disease', 'phenotype', 'trait', 'outcome'].some(term => 
          h.toLowerCase().includes(term)
        )
      ) || csvData.headers[0];

      if (pvalueCol || betaCol || orCol) {
        const chartData = csvData.data.slice(0, 20).map(row => {
          const dataPoint: any = {
            label: String(row[labelCol] || ''),
          };
          
          if (pvalueCol) dataPoint.pvalue = Number(row[pvalueCol]) || 0;
          if (betaCol) dataPoint.beta = Number(row[betaCol]) || 0;
          if (orCol) dataPoint.or = Number(row[orCol]) || 0;
          if (seCol) dataPoint.se = Number(row[seCol]) || 0;
          
          return dataPoint;
        }).filter(d => d.label);

        return {
          data: chartData,
          pvalueCol,
          betaCol,
          orCol,
          seCol,
          filename: csvData.filename,
        };
      }
    }
    return null;
  };

  const vizData = findVisualizationData();

  if (!vizData || vizData.data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No suitable data found for visualization. Ensure your CSV files contain numeric columns like p-values, beta, or odds ratios.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Visualization: {vizData.filename}</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* P-value distribution */}
        {vizData.pvalueCol && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium mb-4">P-value Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vizData.data.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pvalue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Beta/Effect size */}
        {vizData.betaCol && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium mb-4">Effect Size (Beta)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vizData.data.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="beta" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Odds Ratio */}
        {vizData.orCol && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium mb-4">Odds Ratio</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vizData.data.slice(0, 15)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="label" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  interval={0}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="or" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Scatter plot: Beta vs P-value */}
        {vizData.betaCol && vizData.pvalueCol && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h4 className="text-lg font-medium mb-4">Effect Size vs P-value</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="beta" name="Beta" />
                <YAxis type="number" dataKey="pvalue" name="P-value" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={vizData.data} fill="#8b5cf6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

