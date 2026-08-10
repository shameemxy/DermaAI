import Link from "next/link";
import { FileText, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-primaryBG text-primaryText flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primaryText/70 hover:text-primaryText mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface text-xs font-semibold uppercase tracking-widest text-primaryText mb-4 border border-surfaceBorder">
            <FileText className="w-3.5 h-3.5 text-accent" />
            <span>Usage Guidelines</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl font-light text-primaryText mb-4">
            Terms & Conditions
          </h1>
          <p className="text-sm text-primaryText/70 font-light">
            Effective Date: August 2026
          </p>
        </div>

        <div className="space-y-6 bg-surfaceCard border border-surfaceBorder rounded-3xl p-8 md:p-10 shadow-derma text-sm leading-relaxed text-primaryText/80 font-light">
          <section className="space-y-2">
            <h2 className="font-editorial text-xl font-medium text-primaryText flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              1. Dermatological AI Disclaimer
            </h2>
            <p>
              DermaAI provides artificial intelligence-assisted ingredient safety and compatibility evaluations. DermaAI is <strong>not a licensed medical provider or dermatologist</strong>, and analysis results do not constitute formal medical diagnosis or treatment advice. Always perform a 24-hour patch test before introducing new skincare products.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-surfaceBorder/50">
            <h2 className="font-editorial text-xl font-medium text-primaryText flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              2. Acceptable Use
            </h2>
            <p>
              You agree to use DermaAI strictly for personal, non-commercial skincare scanning. Reverse engineering, automated web scraping of the scanning engine, or submitting malicious prompts intended to manipulate the Gemini API persona is strictly prohibited.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
