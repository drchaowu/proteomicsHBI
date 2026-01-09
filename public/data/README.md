# Data Directory

Place your CSV files in this directory to make them searchable through the portal.

## CSV File Format

Your CSV files should have headers in the first row. The search functionality will automatically detect and search through all columns.

### Recommended Column Names

For best search results, consider using these column name conventions:

**For Proteins:**
- `protein`, `protein_name`, `gene`, `gene_name`, `uniprot_id`

**For Diseases:**
- `disease`, `disease_name`, `outcome`, `phenotype`

**For MRI Phenotypes:**
- `mri`, `mri_phenotype`, `imaging`, `brain_region`, `mri_trait`

**For Statistical Results:**
- `pvalue`, `p_value`, `p-value` (for p-values)
- `beta`, `effect` (for effect sizes)
- `or`, `odds_ratio` (for odds ratios)
- `se`, `standard_error` (for standard errors)
- `ci_lower`, `ci_upper` (for confidence intervals)

### Example CSV Structure

```csv
protein,gene,disease,pvalue,beta,or,se
IL6,IL6,Alzheimer's Disease,0.001,0.25,1.28,0.05
TNF,TNF,Depression,0.003,0.18,1.20,0.04
```

## File Organization

You can organize your CSV files in any way you prefer:
- One file per analysis type
- One file per disease
- Combined results in a single file

The search will automatically scan all CSV files in this directory.

