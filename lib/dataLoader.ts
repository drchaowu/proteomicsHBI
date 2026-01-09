import { parseCSV, CSVData } from './csvParser';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * Load all CSV files from the data directory
 */
export async function loadAllCSVFiles(dataDir: string = 'public/data'): Promise<CSVData[]> {
  try {
    // In a real scenario, you'd read from the filesystem
    // For now, we'll return an empty array and let the API handle it
    // This function can be extended to preload data if needed
    return [];
  } catch (error) {
    console.error('Error loading CSV files:', error);
    return [];
  }
}

/**
 * Get list of available CSV files
 */
export async function getCSVFileList(dataDir: string = 'public/data'): Promise<string[]> {
  try {
    const files = await readdir(join(process.cwd(), dataDir));
    return files.filter(file => file.endsWith('.csv'));
  } catch (error) {
    console.error('Error reading data directory:', error);
    return [];
  }
}

