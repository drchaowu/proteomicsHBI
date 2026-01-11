import argparse
from pathlib import Path

import pandas as pd


SHEETS = {
    "mri_associations": {
        "output": "mri_association.csv",
        "columns": {
            "CMR IDP category": "cmr_category",
            "CMR IDP": "cmr_trait",
            "BMR IDP category": "bmr_category",
            "BMR IDP": "bmr_trait",
            "Participants number": "n",
            "Correlation coefficient": "beta",
            "P value": "pvalue",
        },
    },
    "protein_mri_associations": {
        "output": "protein_mri_association.csv",
        "columns": {
            "Model": "model",
            "MRI IDP category": "mri_category",
            "MRI IDP": "mri_trait",
            "Proteins": "protein",
            "Participants number": "n",
            "Correlation coefficient": "beta",
            "P value": "pvalue",
        },
    },
    "protein_prevalence": {
        "output": "protein_prevalence.csv",
        "columns": {
            "Analysis model": "model",
            "Disease category": "disease_category",
            "Diseases": "disease",
            "Incident Rate (%)": "incident_rate",
            "Proteins": "protein",
            "Coefficient": "beta",
            "Odds Ratio": "odds_ratio",
            "95% CI Lower": "ci_lower",
            "95% CI Upper": "ci_upper",
            "P Value": "pvalue",
        },
    },
    "protein_incidence": {
        "output": "protein_incidence.csv",
        "columns": {
            "Analysis model": "model",
            "Disease category": "disease_category",
            "Diseases": "disease",
            "Incident Rate (%)": "incident_rate",
            "Proteins": "protein",
            "Hazard Ratio": "hazard_ratio",
            "95% CI Lower": "ci_lower",
            "95% CI Upper": "ci_upper",
            "P Value": "pvalue",
        },
    },
    "protein_diseases_causality": {
        "output": "protein_disease_causality.csv",
        "columns": {
            "Disease group": "disease_group",
            "Category": "disease_category",
            "Disease GWAS name": "disease",
            "GWAS ID": "gwas_id",
            "Proteins": "protein",
            "MR method": "mr_method",
            "Number of SNP": "snps",
            "Odds Ratio": "odds_ratio",
            "95% CI Lower": "ci_lower",
            "95% CI Upper": "ci_upper",
            "P value": "pvalue",
        },
    },
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [str(c).strip() for c in df.columns]
    return df


def convert_sheet(
    excel_path: Path,
    sheet_name: str,
    output_dir: Path,
    column_map: dict[str, str],
    output_name: str,
) -> Path:
    df = pd.read_excel(excel_path, sheet_name=sheet_name)
    df = normalize_columns(df)

    missing = [col for col in column_map.keys() if col not in df.columns]
    if missing:
        missing_list = ", ".join(missing)
        raise ValueError(f"Sheet '{sheet_name}' missing columns: {missing_list}")

    df = df[list(column_map.keys())].rename(columns=column_map)
    text_columns = df.select_dtypes(include=["object"]).columns
    df[text_columns] = df[text_columns].apply(lambda col: col.str.strip())
    before = len(df)
    df = df.drop_duplicates()
    after = len(df)

    output_path = output_dir / output_name
    output_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(output_path, index=False)
    removed = before - after
    print(f"{sheet_name}: removed {removed} duplicate row(s)")
    return output_path


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Convert results.xlsx sheets into CSV files for the app."
    )
    parser.add_argument(
        "--excel",
        default="results.xlsx",
        help="Path to the Excel file (default: results.xlsx)",
    )
    parser.add_argument(
        "--output-dir",
        default="public/data",
        help="Output directory for CSV files (default: public/data)",
    )
    args = parser.parse_args()

    excel_path = Path(args.excel)
    if not excel_path.exists():
        raise FileNotFoundError(f"Excel file not found: {excel_path}")

    output_dir = Path(args.output_dir)

    outputs: list[Path] = []
    for sheet_name, meta in SHEETS.items():
        output_path = convert_sheet(
            excel_path=excel_path,
            sheet_name=sheet_name,
            output_dir=output_dir,
            column_map=meta["columns"],
            output_name=meta["output"],
        )
        outputs.append(output_path)

    for output in outputs:
        print(f"Wrote {output}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
