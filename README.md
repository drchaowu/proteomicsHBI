# Proteomics in Heart-Brain Interactions (HBI)

A Next.js web portal for exploring multi-cohort proteomics associations with MRI traits and disease outcomes. The site provides searchable tables and purpose-built visualizations (heatmaps and forest plots) to support discovery and review.

## Highlights

- Search by protein, MRI trait, or disease with a secondary filter to refine results.
- Dataset-aware filtering to focus on specific cohorts.
- Interactive tables with rounded numeric values.
- Heatmaps for MRI and protein–MRI associations.
- Forest plots for disease prevalence/incidence/causality with 95% CI.

## Datasets

The portal is organized around four dataset families:

1. **Cardiac MRI & Brain MRI Trait Associations**
2. **Proteomics–MRI Trait Associations**
3. **Proteomics–Disease Incidence/Prevalence Associations**
4. **Proteomics–Disease Causal Inferences (MR)**

## Data Preparation

Place CSVs in `public/data`. The app will automatically read and search all CSV files it finds.

### Expected CSV Files

- `mri_association.csv`
- `protein_mri_association.csv`
- `protein_prevalence.csv`
- `protein_incidence.csv`
- `protein_disease_causality.csv`

### Recommended Columns

Use these headers for best search and visualization behavior:

**Common identifiers**
- `protein`, `gene`, `uniprot_id`
- `mri_trait`, `cmr_trait`, `bmr_trait`
- `disease`, `disease_category`, `disease_group`

**Statistics**
- `beta` (correlation/effect size)
- `pvalue`
- `odds_ratio`, `hazard_ratio`
- `ci_lower`, `ci_upper`
- `n`

## Convert Excel to CSV

If you maintain data in Excel sheets, use the provided conversion script:

```bash
python3 scripts/convert_results.py --excel /path/to/results.xlsx --output-dir public/data
```

This script:
- Renames columns to match the expected schema
- Removes duplicate rows
- Writes per-sheet CSVs to `public/data`

## Running Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
app/
  api/search/route.ts      # Search API
  components/              # UI components
lib/
  csvParser.ts             # CSV parsing + search
public/data/               # CSV datasets
scripts/
  convert_results.py       # Excel → CSV conversion
```

## Data Access Notice

The accompanying manuscript is under review. Data shown on the website is not yet publicly available. For access or reuse, please contact:

drchaowu@med.umich.edu

Include:
- Name and affiliation
- Intended use
- Specific datasets or results requested

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- PapaParse
- Recharts

## License

See `LICENSE`.
