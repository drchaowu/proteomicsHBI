export interface DatasetGroup {
  label: string;
  value: string;
  files?: string[];
  match?: string[];
}

export const DATASET_TITLES: Record<string, string> = {
  'mri_association.csv': 'MRI association',
  'protein_mri_association.csv': 'Proteomics-MRI association',
  'protein_prevalence.csv': 'Proteomics-disease prevalence',
  'protein_incidence.csv': 'Proteomics-disease incidence',
  'protein_disease_causality.csv': 'Proteomics-disease causality',
  'associations.csv': 'Associations (legacy)',
  'sample_data.csv': 'Sample data',
};

export const DATASET_GROUPS: DatasetGroup[] = [
  { label: 'All datasets', value: 'all' },
  {
    label: 'MRI association',
    value: 'mri-association',
    files: ['mri_association.csv'],
  },
  {
    label: 'Protein-MRI association',
    value: 'protein-mri',
    files: ['protein_mri_association.csv'],
  },
  {
    label: 'Disease association',
    value: 'disease-association',
    files: ['protein_prevalence.csv', 'protein_incidence.csv'],
  },
  {
    label: 'Disease causality',
    value: 'disease-causality',
    files: ['protein_disease_causality.csv'],
  },
];
