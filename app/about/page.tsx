import Link from "next/link";
import { ShieldCheck, Cpu, Sparkles, ArrowLeft, HeartHandshake, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-primaryBG text-primaryText flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto w-full">
        {/* Navigation back link */}
        <Link
          href="/home"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primaryText/70 hover:text-primaryText mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scanner</span>
        </Link>

        {/* Hero header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface text-xs font-semibold uppercase tracking-widest text-primaryText mb-4 border border-surfaceBorder">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Our Science & Purpose</span>
          </div>
          <h1 className="font-editorial text-4xl md:text-6xl font-light text-primaryText mb-4 leading-tight">
            Personalized Skincare Intelligence <br />
            <span className="italic font-normal">Without Compromise</span>
          </h1>
          <p className="text-lg text-primaryText/80 font-light leading-relaxed max-w-2xl">
            DermaAI was designed to bridge the gap between complex cosmetic ingredient formulations and individual skin sensitivities.
          </p>
        </div>

        {/* Content Section Cards */}
        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-surfaceCard border border-surfaceBorder shadow-derma">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="w-6 h-6 text-accent" />
              <h2 className="font-editorial text-2xl font-medium text-primaryText">
                Powered by Gemini AI Engine
              </h2>
            </div>
            <p className="text-primaryText/80 leading-relaxed font-light text-sm">
              Our backend utilizes server-side Google Gemini route handlers to perform deep ingredient parsing, allergen detection, and contraindication cross-referencing. By keeping all API calls strictly server-side, your API security and data privacy remain fully safeguarded.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surfaceCard border border-surfaceBorder shadow-derma">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <h2 className="font-editorial text-2xl font-medium text-primaryText">
                Row Level Security (RLS) Privacy
              </h2>
            </div>
            <p className="text-primaryText/80 leading-relaxed font-light text-sm">
              Your skin profile (skin type, shade, sensitivities, and allergy list) is protected in Supabase PostgreSQL using strict Row Level Security policies. Only your authenticated user session can read or insert records associated with your account.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-surfaceCard border border-surfaceBorder shadow-derma">
            <div className="flex items-center gap-3 mb-4">
              <HeartHandshake className="w-6 h-6 text-accent" />
              <h2 className="font-editorial text-2xl font-medium text-primaryText">
                Dermatological Philosophy
              </h2>
            </div>
            <p className="text-primaryText/80 leading-relaxed font-light text-sm">
              Skincare is deeply personal. A product rated five stars by one individual may cause irritation, breakouts, or allergic contact dermatitis in another. DermaAI translates raw chemical lists into clear, binary compatibility guidance tailored strictly to your skin persona.
            </p>
          </div>
        </div>

        {/* Return Button */}
        <div className="mt-12 text-center">
          <Link
            href="/home"
            className="px-8 py-3.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma inline-flex items-center gap-2"
          >
            <span>Return to App Scanner</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
