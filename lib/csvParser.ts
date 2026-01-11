import Papa from 'papaparse';
import { readFile } from 'fs/promises';

export interface SearchResult {
  [key: string]: string | number;
}

export interface CSVData {
  filename: string;
  headers: string[];
  data: SearchResult[];
}

/**
 * Parse a CSV file from filesystem (server-side)
 */
export async function parseCSVFromFile(filePath: string): Promise<CSVData> {
  try {
    const text = await readFile(filePath, 'utf-8');
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`Failed to parse CSV: ${results.errors[0].message}`));
            return;
          }
          
          const headers = results.meta.fields || [];
          const data = results.data as SearchResult[];
          
          resolve({
            filename: filePath.split('/').pop() || 'unknown.csv',
            headers,
            data,
          });
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    throw new Error(`Failed to load CSV file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse a CSV file from URL (client-side)
 */
export async function parseCSV(filePath: string): Promise<CSVData> {
  try {
    const response = await fetch(filePath);
    const text = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.data.length === 0) {
            reject(new Error(`Failed to parse CSV: ${results.errors[0].message}`));
            return;
          }
          
          const headers = results.meta.fields || [];
          const data = results.data as SearchResult[];
          
          resolve({
            filename: filePath.split('/').pop() || 'unknown.csv',
            headers,
            data,
          });
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    throw new Error(`Failed to load CSV file: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Case-insensitive search through CSV data for matching terms.
 * If searchFields are provided, match against headers case-insensitively.
 */
export function searchInData(
  data: CSVData[],
  searchTerm: string,
  searchFields: string[] = []
): CSVData[] {
  if (!searchTerm.trim()) {
    return data;
  }

  const terms = searchTerm
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

  const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const matchesTerm = (value: string, term: string) => {
    const pattern = `\\b${escapeRegExp(term)}\\b`;
    const regex = new RegExp(pattern, 'i');
    return regex.test(value);
  };

  return data
    .map((csvData) => {
      const headerLookup = new Map(
        csvData.headers.map((header) => [header.toLowerCase(), header])
      );

      const fieldsToSearch =
        searchFields.length > 0
          ? searchFields
              .map((field) => headerLookup.get(field.toLowerCase()))
              .filter((h): h is string => Boolean(h))
          : csvData.headers;

      const filteredData = csvData.data.filter((row) =>
        fieldsToSearch.some((field) => {
          const value = String(row[field] ?? '').toLowerCase();
          return terms.every((term) => matchesTerm(value, term));
        })
      );

      return {
        ...csvData,
        data: filteredData,
      };
    })
    .filter((csvData) => csvData.data.length > 0);
}

/**
 * Get unique values from a specific column across all CSV files
 */
export function getUniqueValues(data: CSVData[], columnName: string): string[] {
  const values = new Set<string>();
  
  data.forEach((csvData) => {
    if (csvData.headers.includes(columnName)) {
      csvData.data.forEach((row) => {
        const value = String(row[columnName] || '').trim();
        if (value) {
          values.add(value);
        }
      });
    }
  });
  
  return Array.from(values).sort();
}
