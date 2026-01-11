import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { parseCSVFromFile, searchInData, CSVData } from '@/lib/csvParser';

/**
 * GET /api/search - Search through CSV files
 * Query params:
 * - q: search term
 * - type: search type (protein, disease, mri, or all)
 * - files: comma-separated list of CSV files to search (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('q') || '';
    const searchType = searchParams.get('type') || 'all';
    const filesParam = searchParams.get('files');
    const filterTerm = searchParams.get('filter') || '';
    const filterType = searchParams.get('filterType') || '';

    // Determine which fields to search based on type
    let searchFields: string[] = [];
    switch (searchType) {
      case 'protein':
        searchFields = ['protein', 'protein_name', 'gene', 'gene_name', 'uniprot_id'];
        break;
      case 'disease':
        searchFields = [
          'disease',
          'disease_name',
          'disease_category',
          'disease_group',
          'outcome',
          'phenotype',
        ];
        break;
      case 'mri':
        searchFields = [
          'mri',
          'mri_phenotype',
          'mri_trait',
          'mri_category',
          'cmr_trait',
          'cmr_category',
          'bmr_trait',
          'bmr_category',
          'imaging',
          'brain_region',
        ];
        break;
      default:
        searchFields = []; // Search all fields
    }

    let filterFields: string[] = [];
    switch (filterType) {
      case 'protein':
        filterFields = ['protein', 'protein_name', 'gene', 'gene_name', 'uniprot_id'];
        break;
      case 'disease':
        filterFields = [
          'disease',
          'disease_name',
          'disease_category',
          'disease_group',
          'outcome',
          'phenotype',
        ];
        break;
      case 'mri':
        filterFields = [
          'mri',
          'mri_phenotype',
          'mri_trait',
          'mri_category',
          'cmr_trait',
          'cmr_category',
          'bmr_trait',
          'bmr_category',
          'imaging',
          'brain_region',
        ];
        break;
      case 'disease_mri':
        filterFields = [
          'disease',
          'disease_name',
          'disease_category',
          'disease_group',
          'outcome',
          'phenotype',
          'mri',
          'mri_phenotype',
          'mri_trait',
          'mri_category',
          'cmr_trait',
          'cmr_category',
          'bmr_trait',
          'bmr_category',
          'imaging',
          'brain_region',
        ];
        break;
      case 'protein_disease':
        filterFields = [
          'protein',
          'protein_name',
          'gene',
          'gene_name',
          'uniprot_id',
          'disease',
          'disease_name',
          'disease_category',
          'disease_group',
          'outcome',
          'phenotype',
        ];
        break;
      case 'protein_mri':
        filterFields = [
          'protein',
          'protein_name',
          'gene',
          'gene_name',
          'uniprot_id',
          'mri',
          'mri_phenotype',
          'mri_trait',
          'mri_category',
          'cmr_trait',
          'cmr_category',
          'bmr_trait',
          'bmr_category',
          'imaging',
          'brain_region',
        ];
        break;
      default:
        filterFields = [];
    }

    // Get list of CSV files
    const dataDir = join(process.cwd(), 'public/data');
    let csvFiles: string[] = [];
    
    try {
      const files = await readdir(dataDir);
      csvFiles = files.filter(file => file.endsWith('.csv'));
    } catch (error) {
      // Data directory might not exist yet
      console.warn('Data directory not found, returning empty results');
      return NextResponse.json({ results: [], totalResults: 0 });
    }

    // Filter files if specific files are requested
    if (filesParam) {
      const requestedFiles = filesParam
        .split(',')
        .map((f) => f.trim().toLowerCase())
        .filter(Boolean);

      csvFiles = csvFiles.filter((file) =>
        requestedFiles.includes(file.toLowerCase())
      );
    }

    // Load and parse all CSV files
    const allData: CSVData[] = [];
    for (const file of csvFiles) {
      try {
        const filePath = join(dataDir, file);
        const csvData = await parseCSVFromFile(filePath);
        allData.push(csvData);
      } catch (error) {
        console.error(`Error loading ${file}:`, error);
        // Continue with other files
      }
    }

    // Perform search
    let results = searchInData(allData, searchTerm, searchFields);
    if (filterTerm && filterFields.length > 0) {
      results = searchInData(results, filterTerm, filterFields);
    }
    const totalResults = results.reduce((sum, csvData) => sum + csvData.data.length, 0);

    return NextResponse.json({
      results,
      totalResults,
      searchTerm,
      searchType,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/files - Get list of available CSV files
 */
export async function getFiles() {
  try {
    const dataDir = join(process.cwd(), 'public/data');
    const files = await readdir(dataDir);
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    return NextResponse.json({ files: csvFiles });
  } catch (error) {
    return NextResponse.json({ files: [] });
  }
}
