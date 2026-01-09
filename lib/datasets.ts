export interface DatasetGroup {
  label: string;
  value: string;
  files?: string[];
  match?: string[];
}

export const DATASET_GROUPS: DatasetGroup[] = [
  { label: 'All datasets', value: 'all' },
  {
    label: 'MRI association',
    value: 'mri-association',
    match: ['mri', 'association'],
    files: [],
  },
  {
    label: 'Protein-MRI association',
    value: 'protein-mri',
    match: ['protein', 'mri'],
    files: [],
  },
  {
    label: 'Protein-disease association',
    value: 'protein-disease',
    match: ['protein', 'disease', 'association'],
    files: [],
  },
  {
    label: 'Protein-disease causality',
    value: 'protein-disease-causality',
    match: ['protein', 'disease', 'causal', 'causality', 'mr'],
    files: [],
  },
];
