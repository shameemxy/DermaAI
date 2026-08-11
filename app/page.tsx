import Link from "next/link";
import Image from "next/image";
import { Sparkles, ShieldCheck, Cpu, CheckCircle2, ArrowRight, Scan } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-primaryBG text-primaryText flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-primaryBG/90 backdrop-blur-md border-b border-surfaceBorder/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-2">
          
          <Link href="/" className="flex items-center gap-2 md:gap-3 group flex-shrink-0">
            <Image 
              src="/logo.png" 
              alt="DermaAI Logo" 
              width={40} 
              height={40} 
              className="h-8 w-auto md:h-10 object-contain transition-transform group-hover:scale-105" 
              priority 
            />
            <span className="font-editorial text-xl md:text-2xl font-bold tracking-tight text-primaryText">
              DermaAI
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-primaryText/80">
            <Link href="#features" className="hover:text-primaryText transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primaryText transition-colors">How It Works</Link>
            <Link href="#safety" className="hover:text-primaryText transition-colors">Safety Standard</Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            <Link
              href="/login"
              className="px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-medium text-primaryText hover:opacity-80 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-accent hover:bg-accentHover text-primaryText text-xs md:text-sm font-medium transition-all shadow-derma hover:shadow-derma-lg whitespace-nowrap"
            >
              {/* Shortens the button text on small mobile screens */}
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Start Free Wizard</span>
            </Link>
          </div>
          
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-28 max-w-6xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/80 border border-surfaceBorder text-xs font-semibold uppercase tracking-widest text-primaryText mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-primaryText" />
          <span>Next-Generation Skincare Intelligence</span>
        </div>

        <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl font-light text-primaryText tracking-tight mb-8 leading-[1.08]">
          Purity & Compatibility <br />
          <span className="italic font-normal">For Your Skin Persona</span>
        </h1>

        <p className="text-lg md:text-xl text-primaryText/80 max-w-2xl font-sans mb-10 leading-relaxed font-light">
          Instantly evaluate cosmetics, serums, and cleansers against your unique skin type, shade, and sensitivities using our secure server-side dermatological engine.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-base transition-all shadow-derma-lg flex items-center justify-center gap-3"
          >
            <span>Create Your Skin Profile</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface border border-surfaceBorder hover:bg-surfaceCard text-primaryText font-medium text-base transition-all flex items-center justify-center"
          >
            Access Existing Account
          </Link>
        </div>

        {/* Hero Product Analysis Card Preview */}
        <div className="mt-16 w-full max-w-3xl rounded-3xl bg-surfaceCard border border-surfaceBorder p-8 shadow-derma-lg text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-0 pointer-events-none" />
          
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-surfaceBorder/60">
            <div>
              <span className="text-xs uppercase tracking-wider text-primaryText/60 font-semibold">Analyzed Product</span>
              <h3 className="font-editorial text-2xl font-bold text-primaryText">Radiance Botanical Hydrating Serum</h3>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-300 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Compatible</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-sm">
            <div>
              <h4 className="font-semibold text-primaryText mb-2">Key Ingredients Checked:</h4>
              <ul className="space-y-1.5 text-primaryText/80">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Hyaluronic Acid (Hydration Booster)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Squalane & Centella Asiatica
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Niacinamide 2% (Non-irritating)
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primaryText mb-2">AI Safety Reasoning:</h4>
              <p className="text-primaryText/80 leading-relaxed font-light text-xs md:text-sm">
                &quot;Formulated without synthetic fragrance or sulfates, aligning perfectly with your dry/sensitive profile. No listed reactive triggers detected.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-20 px-6 bg-surface/40 border-y border-surfaceBorder/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-primaryText/70 font-bold">Tailored Engineering</span>
            <h2 className="font-editorial text-4xl md:text-5xl font-light mt-2 mb-4">
              Designed For Your Skin Persona
            </h2>
            <p className="text-primaryText/70 font-light">
              Generic product reviews don&apos;t account for your unique skin barrier, allergies, or active sensitivities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-surfaceCard border border-surfaceBorder shadow-derma hover:shadow-derma-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-6">
                  <Scan className="w-6 h-6 text-primaryText" />
                </div>
                <h3 className="font-editorial text-2xl font-medium mb-3">Multi-Mode Input</h3>
                <p className="text-primaryText/70 text-sm leading-relaxed font-light">
                  Type ingredient lists manually, upload label photos, or capture camera images directly from your phone.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surfaceBorder/40 text-xs font-semibold text-accent flex items-center gap-1">
                <span>Instant Image Extraction</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-surfaceCard border border-surfaceBorder shadow-derma hover:shadow-derma-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6 text-primaryText" />
                </div>
                <h3 className="font-editorial text-2xl font-medium mb-3">Advanced AI Engine</h3>
                <p className="text-primaryText/70 text-sm leading-relaxed font-light">
                  Deep analysis powered by intelligent, secure route handlers with strict prompt injection prevention.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surfaceBorder/40 text-xs font-semibold text-accent flex items-center gap-1">
                <span>Server-Side Execution</span>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-surfaceCard border border-surfaceBorder shadow-derma hover:shadow-derma-lg transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-accent/30 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-primaryText" />
                </div>
                <h3 className="font-editorial text-2xl font-medium mb-3">Strict Data Isolation</h3>
                <p className="text-primaryText/70 text-sm leading-relaxed font-light">
                  Enterprise-grade database security policies enforce that your skin profile and scans remain 100% private.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-surfaceBorder/40 text-xs font-semibold text-accent flex items-center gap-1">
                <span>Encrypted & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section id="how-it-works" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-primaryText/70 font-bold">Simple 3-Step Process</span>
          <h2 className="font-editorial text-4xl md:text-5xl font-light mt-2">
            How DermaAI Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent text-primaryText font-editorial text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-derma">
              1
            </div>
            <h3 className="font-editorial text-xl font-medium mb-2">Build Your Skin Persona</h3>
            <p className="text-sm text-primaryText/70 leading-relaxed font-light">
              Select skin type, skin shade, and known ingredient sensitivities in the Skin Wizard.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent text-primaryText font-editorial text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-derma">
              2
            </div>
            <h3 className="font-editorial text-xl font-medium mb-2">Scan Any Cosmetic Product</h3>
            <p className="text-sm text-primaryText/70 leading-relaxed font-light">
              Upload a photo of the product ingredients label, take a live snapshot, or paste ingredient text directly.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 rounded-full bg-accent text-primaryText font-editorial text-2xl font-bold flex items-center justify-center mx-auto mb-6 shadow-derma">
              3
            </div>
            <h3 className="font-editorial text-xl font-medium mb-2">Get AI Compatibility Result</h3>
            <p className="text-sm text-primaryText/70 leading-relaxed font-light">
              Receive a instant binary rating (Compatible / Not Compatible) alongside concise dermatological advice.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-surface/80 border-t border-surfaceBorder py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-primaryText/70">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="DermaAI Logo" 
              width={32} 
              height={32} 
              className="h-8 w-auto object-contain" 
            />
            <span className="font-editorial text-xl font-bold text-primaryText">DermaAI</span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            <Link href="/about" className="hover:text-primaryText transition-colors">About Us</Link>
            <Link href="/privacy" className="hover:text-primaryText transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primaryText transition-colors">Terms & Conditions</Link>
          </div>

          <p className="text-xs text-primaryText/60">
            © {new Date().getFullYear()} DermaAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}