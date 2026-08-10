import Link from "next/link";
import { ShieldCheck, ArrowLeft, Lock, Database, EyeOff } from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            <span>Data Protection Standard</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-5xl font-light text-primaryText mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm text-primaryText/70 font-light">
            Last updated: August 2026 • Security First Architecture
          </p>
        </div>

        <div className="space-y-6 bg-surfaceCard border border-surfaceBorder rounded-3xl p-8 md:p-10 shadow-derma text-sm leading-relaxed text-primaryText/80 font-light">
          <section className="space-y-2">
            <h2 className="font-editorial text-xl font-medium text-primaryText flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent" />
              1. Row Level Security (RLS) Enforced Privacy
            </h2>
            <p>
              Your personal skin profile (skin type, shade, and ingredient sensitivities) and scan history are stored in a dedicated PostgreSQL database powered by Supabase. Access is strictly governed by SQL Row Level Security (RLS) policies enforcing <code className="bg-surface px-2 py-0.5 rounded border border-surfaceBorder text-xs text-primaryText">auth.uid() = id</code>. No third party or unauthorized user can view or modify your data.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-surfaceBorder/50">
            <h2 className="font-editorial text-xl font-medium text-primaryText flex items-center gap-2">
              <Database className="w-5 h-5 text-accent" />
              2. Server-Side Gemini API Processing
            </h2>
            <p>
              All ingredient label scans and photo OCR analyses are transmitted via secure HTTPS server-side Next.js route handlers (`app/api/analyze/route.ts`). API keys are never exposed to the client browser.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-surfaceBorder/50">
            <h2 className="font-editorial text-xl font-medium text-primaryText flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-accent" />
              3. Zero Data Reselling
            </h2>
            <p>
              DermaAI does not sell, rent, or commercialize your personal health or skin sensitivity data to advertising brokers or cosmetic manufacturers. Your data is used exclusively to generate compatibility analyses for your personal account.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
