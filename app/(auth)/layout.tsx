import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import Image from "next/image";
import HamburgerMenu from "@/components/HamburgerMenu";
import "../globals.css";

// Primary sans-serif font for body UI elements
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Custom "Silver Editorial" font configuration
const silverEditorial = localFont({
  src: [
    {
      path: "../../public/fonts/TheSilverEditorial-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/TheSilverEditorial-Italic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-silver-editorial",
  fallback: ["Playfair Display", "Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "DermaAI | Personalized Skincare Ingredient Scanner",
  description:
    "Advanced AI-powered dermatological analysis for safe and compatible skincare products.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${silverEditorial.variable}`}
    >
      <body className="min-h-screen bg-primaryBG text-primaryText antialiased selection:bg-accent selection:text-primaryText flex flex-col justify-between font-sans">
        
        {/* Authenticated Top Navbar */}
        <header className="sticky top-0 z-40 bg-primaryBG/90 backdrop-blur-md border-b border-surfaceBorder/50">
          <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/home" className="flex items-center gap-3 group">
              <Image 
                src="/logo.png" 
                alt="DermaAI Logo" 
                width={40} 
                height={40} 
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                priority 
              />
              <span className="font-editorial text-2xl font-bold tracking-tight text-primaryText">
                DermaAI
              </span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Hamburger Navigation Menu */}
              <HamburgerMenu />
            </div>
          </div>
        </header>

        {/* Main Authenticated Page Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-surfaceBorder/40 bg-surface/30 py-8 px-6 text-center text-xs text-primaryText/60">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} DermaAI. All rights reserved.</p>
            <div className="flex items-center justify-center gap-6 text-primaryText/70">
              <Link href="/about" className="hover:text-primaryText transition-colors">About</Link>
              <Link href="/privacy" className="hover:text-primaryText transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-primaryText transition-colors">Terms</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}