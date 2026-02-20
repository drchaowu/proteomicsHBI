export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 gap-8">

          {/* Citation */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Citation
            </p>
            <p className="text-sm text-slate-600">
              If you use data from this website, please cite:
            </p>
            <p className="text-sm font-medium text-slate-800">
              medRxiv 2026.01.26.26344874
            </p>
            <a
              href="https://doi.org/10.64898/2026.01.26.26344874"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              doi: 10.64898/2026.01.26.26344874
            </a>
          </div>

          {/* Info */}
          <div className="space-y-2 sm:text-right">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Contact
            </p>
            <a
              href="mailto:drchaowu@med.umich.edu"
              className="text-sm text-blue-600 hover:underline transition-colors"
            >
              drchaowu@med.umich.edu
            </a>
            <div className="pt-2 space-y-1">
              <p className="text-xs text-slate-400">Version 0.2.0 · Released 2026-01-31</p>
              <p className="text-xs text-slate-400">© 2026 Rosenzweig Lab · University of Michigan</p>
              <p className="text-xs text-slate-400">For research use only · Not for clinical decision-making</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
