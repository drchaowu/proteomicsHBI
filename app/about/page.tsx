import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Proteomics in Heart-Brain Interactions (HBI)
            </h2>
            <p className="text-lg text-slate-600">
              Proteomics in Heart-Brain Interactions (HBI) is an open, searchable results portal
              accompanying an ongoing research study investigating the molecular links between
              plasma proteomics, cardiac and brain MRI phenotypes, and cardiometabolic, neurological,
              and psychiatric diseases.
            </p>
            <p className="text-lg text-slate-600">
              This platform provides interactive access to results derived from large-scale,
              multi-cohort analyses, integrating observational associations and Mendelian
              randomization to support hypothesis generation and translational research in heart-brain
              biology.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Data Overview</h3>
            <p className="text-slate-700">The results are organized into four primary categories:</p>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                Cardiac and Brain MRI Trait Associations: Phenotypic correlations between cardiac and
                brain imaging-derived phenotypes (IDPs).
              </li>
              <li>
                Proteomics-MRI Trait Associations: Associations between circulating plasma proteins
                and cardiac or brain MRI traits.
              </li>
              <li>
                Proteomics-Disease Incidence and Prevalence Associations: Relationships between
                plasma proteomics and the prevalence or incidence of cardiovascular, neurological,
                and psychiatric diseases.
              </li>
              <li>
                Proteomics-Disease Outcomes: Association and Mendelian randomization analyses
                evaluating potential causal links between plasma proteomics and disease outcomes.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Intended Users</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>
                Scientific researchers studying proteomics, imaging genetics, cardiovascular or
                neurological diseases
              </li>
              <li>
                Clinicians and translational scientists interested in biomarker discovery, disease
                mechanisms, or therapeutic target prioritization
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">How to Use the Platform</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>
                Navigate between sections corresponding to MRI traits, proteomics-MRI associations,
                proteomics-disease associations, and disease outcomes.
              </li>
              <li>Use the global search bar to query proteins, diseases, or MRI traits of interest.</li>
              <li>Apply filters to refine results by data category or analysis type.</li>
              <li>
                Explore interactive tables reporting effect estimates, statistical significance, and
                analysis metadata.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Data Access and Use</h3>
            <p className="text-slate-700">
              The accompanying manuscript is currently under peer review. Accordingly, the results
              displayed on this platform are for research and exploratory use only and should not be
              used for clinical decision-making.
            </p>
            <p className="text-slate-700">
              If you use data from this website, please cite: medRxiv 2026.01.26.26344874; doi:
              https://doi.org/10.64898/2026.01.26.26344874.
            </p>
            <p className="text-slate-700">
              Researchers interested in accessing or formally using these data are asked to contact
              the study team for approval. Please include:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Name and institutional affiliation</li>
              <li>Purpose and intended use of the data</li>
              <li>Specific datasets or results of interest</li>
            </ul>
            <p className="text-slate-700">
              Contact:{' '}
              <a
                className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4"
                href="mailto:drchaowu@med.umich.edu"
              >
                drchaowu@med.umich.edu
              </a>
              .
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Acknowledgments</h3>
            <p className="text-slate-700">
              This platform is part of ongoing research efforts within the Rosenzweig Lab, aimed at
              elucidating the molecular and systems-level mechanisms underlying heart-brain
              interactions using multi-omics and imaging data. We gratefully acknowledge all
              collaborators and study participants whose contributions made this work possible.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
