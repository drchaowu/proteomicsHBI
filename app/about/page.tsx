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
              Overview
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
              Proteomics in Heart-Brain Interactions (HBI)
            </h2>
            <p className="text-lg text-slate-600">
              This platform provides a searchable database containing results derived from
              multi-cohort analyses of proteomics and its associations with MRI traits and
              diseases. The four main categories of data are:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                Cardiac MRI and Brain MRI Trait Associations: Correlations between imaging-derived
                phenotypes (IDPs) for the heart and brain.
              </li>
              <li>
                Proteomics-MRI Trait Associations: Connections between plasma proteomics and
                specific cardiac or brain MRI traits.
              </li>
              <li>
                Proteomics-Disease Incidence/Prevalence Associations: Relationships between
                proteomics and the prevalence or incidence of cardiovascular, neurological, and
                psychiatric diseases.
              </li>
              <li>
                Proteomics-Disease Outcomes: Mendelian randomization and association results
                highlighting links between proteomics and diseases.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Who Can Use This Tool?</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>
                Scientific Researchers: Investigating proteins, diseases, or imaging phenotypes
                relevant to their work.
              </li>
              <li>
                Clinicians and Translational Scientists: Exploring molecular mechanisms underlying
                disease to identify biomarkers or therapeutic targets.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">How to Use the Platform</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                Navigate through the tabs corresponding to the four cohorts: MRI Traits
                Associations, Proteomics-MRI Associations, Proteomics-Disease Associations, and
                Proteomics-Disease Outcomes.
              </li>
              <li>Use the search bar to input a protein, disease, or MRI Trait of interest.</li>
              <li>Filter results by dataset type to narrow your focus.</li>
              <li>
                Review the interactive results tables for details, including correlations, effect
                sizes, and statistical significance.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">Data Request and Approval</h3>
            <p className="text-slate-700">
              As the associated manuscript is under review, the data presented here is not yet
              publicly available. Researchers or individuals interested in using this data must
              contact us for approval before accessing or utilizing it. Please include the
              following in your request:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Your name and affiliation.</li>
              <li>The purpose of your inquiry and intended data use.</li>
              <li>Specific datasets or results you are interested in.</li>
            </ul>
            <p className="text-slate-700">
              Requests can be directed to{' '}
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
              This platform is part of ongoing research efforts by Rosenzweig Lab to explore the
              molecular underpinnings of heart-brain interactions using multi-omics approaches. We
              thank all collaborators and study participants for their contributions to this work.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">About</h3>
            <p className="text-slate-700">
              Proteomics in Heart-Brain Interactions (HBI) is a knowledge-sharing platform designed
              to support scientific researchers in exploring the intricate relationships between
              plasma proteomics, cardiac MRI traits, brain MRI traits, and their associations with
              cardiovascular, neurological, and psychiatric diseases. This website accompanies a
              research manuscript that is currently under review in a scientific journal and
              offers an interactive, user-friendly interface for accessing detailed study results.
            </p>
            <p className="text-slate-700">
              The website provides access to a rich dataset derived from multiple cohorts, grouped
              into four main categories:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-700">
              <li>
                Cardiac MRI and Brain MRI Trait Associations: Examines phenotypic correlations
                between cardiac and brain imaging-derived traits.
              </li>
              <li>
                Proteomics-MRI Trait Associations: Investigates the relationships between plasma
                proteins and imaging-derived phenotypes (IDPs) from cardiac and brain MRIs.
              </li>
              <li>
                Proteomics-Disease Incidence/Prevalence Associations: Explores the associations
                between plasma proteomics and disease prevalence or incidence in cardiovascular,
                neurological, and psychiatric domains.
              </li>
              <li>
                Proteomics-Disease Outcomes: Features association and Mendelian randomization
                analyses to infer relationships between plasma proteomics and various diseases.
              </li>
            </ol>
            <p className="text-slate-700">
              Given that the accompanying manuscript has not yet been published, users interested
              in accessing or utilizing the data presented on this platform must contact us for
              approval. This ensures that data usage aligns with ethical research practices and
              academic collaboration goals.
            </p>
            <p className="text-slate-700">
              This resource aims to foster collaborative research and discovery by offering
              comprehensive insights into proteomics in the context of heart-brain interactions.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
