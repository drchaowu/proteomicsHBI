# Proteomics Research Portal

A web application for searching and visualizing proteomics research results, including association studies and MR (Mendelian Randomization) causal relationship analyses.

## Features

- 🔍 **Advanced Search**: Search across multiple CSV files by proteins, diseases, or MRI phenotypes
- 📊 **Data Visualization**: Automatic visualization of statistical results (p-values, effect sizes, odds ratios)
- 📋 **Interactive Tables**: Expandable tables showing detailed results from each CSV file
- 🎯 **Filtered Search**: Filter search results by type (proteins, diseases, MRI phenotypes, or all)
- 📁 **Multi-file Support**: Automatically scans and searches all CSV files in the data directory

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Add your CSV files to the `public/data` directory

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## CSV File Format

Place your CSV files in the `public/data` directory. The application will automatically detect and index all CSV files.

### Recommended Column Names

For optimal search results, use these column naming conventions:

**Proteins:**
- `protein`, `protein_name`, `gene`, `gene_name`, `uniprot_id`

**Diseases:**
- `disease`, `disease_name`, `outcome`, `phenotype`

**MRI Phenotypes:**
- `mri`, `mri_phenotype`, `imaging`, `brain_region`, `mri_trait`

**Statistical Results:**
- `pvalue`, `p_value`, `p-value` (for p-values)
- `beta`, `effect` (for effect sizes)
- `or`, `odds_ratio` (for odds ratios)
- `se`, `standard_error` (for standard errors)
- `ci_lower`, `ci_upper` (for confidence intervals)

### Example CSV Structure

```csv
protein,gene,disease,mri_phenotype,pvalue,beta,or,se
IL6,IL6,Alzheimer's Disease,Hippocampal Volume,0.001,0.25,1.28,0.05
TNF,TNF,Depression,White Matter Volume,0.003,0.18,1.20,0.04
```

A sample CSV file (`sample_data.csv`) is included in `public/data` for reference.

## Dataset Grouping (Filters)

The dataset filter in the search bar groups files by name. You can make this explicit by editing `lib/datasets.ts`:

- Use `files: []` to list exact CSV filenames (recommended).
- Or use `match: []` tokens to group by keyword when filenames are not fixed.

Example:

```ts
{
  label: 'Protein-MRI association',
  value: 'protein-mri',
  files: ['protein_mri_association.csv'],
}
```

## Usage

1. **Search**: Enter a search term in the search bar (e.g., protein name, disease, or MRI phenotype)
2. **Filter**: Select a search type from the dropdown (Proteins, Diseases, MRI Phenotypes, or All Types)
3. **View Results**: 
   - Results are displayed in expandable tables grouped by CSV file
   - Click on a file header to expand/collapse its results
   - Toggle visualizations on/off using the checkbox
4. **Visualizations**: The app automatically detects numeric columns and creates visualizations for:
   - P-value distributions
   - Effect sizes (Beta)
   - Odds ratios
   - Scatter plots (e.g., Beta vs P-value)

## Project Structure

```
project_proteomics/
├── app/
│   ├── api/
│   │   ├── search/        # Search API endpoint
│   │   └── files/         # Files list API endpoint
│   ├── components/
│   │   ├── SearchBar.tsx      # Search input component
│   │   ├── ResultsTable.tsx   # Results display component
│   │   └── Visualization.tsx  # Chart visualization component
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── lib/
│   ├── csvParser.ts       # CSV parsing utilities
│   └── dataLoader.ts      # Data loading utilities
└── public/
    └── data/              # Place your CSV files here
```

## Technologies Used

- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **PapaParse**: CSV parsing
- **Recharts**: Data visualization

## Building for Production

```bash
npm run build
npm start
```

## Deploying (GitHub + Vercel)

Yes, GitHub + Vercel is a good deployment path for this project.

1. Push your repo to GitHub.
2. In Vercel, click “New Project” and import the repo.
3. Framework will be detected as Next.js. Keep default build settings.
4. Deploy. Each push to the default branch triggers a new deploy.

Notes:
- Files in `public/data` are bundled at build time. If you update datasets, redeploy.
- For frequently changing datasets, consider hosting them externally and wiring a server-side fetch.

## Customization

### Adding More Search Fields

Edit `app/api/search/route.ts` to add more field names to the search field arrays:

```typescript
case 'protein':
  searchFields = ['protein', 'protein_name', 'gene', 'gene_name', 'uniprot_id', 'your_new_field'];
  break;
```

### Customizing Visualizations

Edit `app/components/Visualization.tsx` to add new chart types or modify existing ones.

## License

See LICENSE file for details.

## Support

For issues or questions, please check the documentation in `public/data/README.md` or review the code comments.
