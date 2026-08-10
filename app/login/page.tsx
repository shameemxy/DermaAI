"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!isSupabaseConfigured()) {
        router.push("/home");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      if (data.session) {
        router.push("/home");
      }
    } catch (err: any) {
      let finalError = err?.message || "An unexpected authentication error occurred.";
      if (typeof window !== "undefined" && !navigator.onLine) {
        finalError = "No internet connection. Please check your network and try again.";
      } else if (err?.message === "Failed to fetch") {
        finalError = "Unable to reach the server. Please check your internet connection.";
      } else if (err?.message?.includes("Invalid login credentials")) {
        finalError = "Incorrect email or password. Please try again.";
      }
      setErrorMsg(finalError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primaryBG text-primaryText flex flex-col justify-between p-6">
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="DermaAI Logo" 
            width={36} 
            height={36} 
            className="h-9 w-auto object-contain" 
          />
          <span className="font-editorial text-2xl font-bold tracking-tight text-primaryText">
            DermaAI
          </span>
        </Link>

        <Link
          href="/signup"
          className="text-sm font-medium hover:text-accent transition-colors"
        >
          Need an account? <span className="underline font-semibold">Sign Up</span>
        </Link>
      </header>

      <main className="max-w-md w-full mx-auto my-auto py-12">
        <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-8 shadow-derma-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20 mb-4">
              <Sparkles className="w-6 h-6 text-primaryText" />
            </div>
            <h1 className="font-editorial text-3xl font-light text-primaryText mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-primaryText/70 font-light">
              Sign in to access your personal skin profile and scan history.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-primaryText/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-surfaceBorder text-primaryText placeholder-primaryText/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-primaryText/50 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface border border-surfaceBorder text-primaryText placeholder-primaryText/40 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-6 rounded-xl bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-primaryText/60 border-t border-surfaceBorder/40 pt-6">
            Don&apos;t have a skin persona configured?{" "}
            <Link href="/signup" className="text-primaryText font-semibold underline hover:text-accent">
              Create one now
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-primaryText/50 py-4">
        © {new Date().getFullYear()} DermaAI. All rights reserved.
      </footer>
    </div>
  );
}