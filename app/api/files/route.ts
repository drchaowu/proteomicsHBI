import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

/**
 * GET /api/files - Get list of available CSV files
 */
export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'public/data');
    const files = await readdir(dataDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    return NextResponse.json({ files: csvFiles });
  } catch (error) {
    console.error('Error reading files:', error);
    return NextResponse.json({ files: [] });
  }
}

