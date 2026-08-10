"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { User, Droplets, Sun, AlertTriangle, Lock, Sliders, ArrowLeft, ShieldCheck } from "lucide-react";

interface UserProfile {
  name?: string;
  skin_type?: string;
  skin_shade?: string;
  allergies?: string[];
  updated_at?: string;
}

const SHADE_COLORS: Record<string, { color: string; border: string }> = {
  Fair: { color: "#F7E2D6", border: "#E5C8B8" },
  Medium: { color: "#E0B388", border: "#C99A6E" },
  Olive: { color: "#C68E5D", border: "#AD7646" },
  Deep: { color: "#794E32", border: "#5E3921" },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Derma AI User",
    skin_type: "Combo",
    skin_shade: "Medium",
    allergies: ["Synthetic Fragrance", "Parabens & Preservatives", "Sulfates (SLS/SLES)"],
    updated_at: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("derma_user_profile");
        if (local) {
          setProfile(JSON.parse(local));
        }
      }

      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("users_profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (data && !error) {
            setProfile(data);
          }
        }
      }
    } catch (err) {
      console.warn("Using local profile state:", err);
    } finally {
      setLoading(false);
    }
  };

  const shadeInfo = SHADE_COLORS[profile.skin_shade || "Medium"] || SHADE_COLORS.Medium;

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-surfaceBorder/60">
        <div>
          <Link
            href="/home"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primaryText/70 hover:text-primaryText mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scanner</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial text-4xl font-light text-primaryText">
              Skin Details Persona
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-surfaceBorder text-xs font-semibold text-primaryText/80">
              <Lock className="w-3.5 h-3.5 text-accent" />
              <span>Strictly Read-Only</span>
            </span>
          </div>
          <p className="text-sm text-primaryText/70 font-light mt-1">
            Personal dermatological characteristics used by Gemini AI scanning engine.
          </p>
        </div>

        <div>
          <Link
            href="/wizard"
            className="px-6 py-2.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-xs transition-all shadow-derma flex items-center gap-2"
          >
            <Sliders className="w-4 h-4" />
            <span>Re-run Wizard to Modify</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="p-8 rounded-3xl bg-surfaceCard border border-surfaceBorder animate-pulse space-y-6">
          <div className="h-6 w-48 bg-surfaceBorder rounded" />
          <div className="h-20 w-full bg-surfaceBorder/60 rounded-2xl" />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* User Name & Overview Card */}
          <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-8 shadow-derma flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent text-primaryText font-editorial text-3xl font-bold flex items-center justify-center shadow-inner">
                {(profile.name || "D")[0]}
              </div>
              <div>
                <h2 className="font-editorial text-3xl font-light text-primaryText">
                  {profile.name || "Derma User"}
                </h2>
                <p className="text-xs text-primaryText/60 font-light mt-1">
                  Profile protected with Supabase Row Level Security (RLS)
                </p>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-surface border border-surfaceBorder text-xs text-primaryText/70 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted User Profile</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Skin Type Read-Only Card */}
            <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-8 shadow-derma space-y-4">
              <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-4">
                <div className="flex items-center gap-2 text-primaryText font-editorial text-xl font-medium">
                  <Droplets className="w-5 h-5 text-accent" />
                  <span>Skin Barrier Type</span>
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-primaryText/60">Read-Only</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-surfaceBorder/60 flex items-center justify-between">
                <span className="font-editorial text-2xl font-bold text-primaryText">
                  {profile.skin_type || "Combo"} Skin
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-primaryText/70 font-light leading-relaxed">
                Your skin type dictates active ingredient tolerance, moisture retention requirements, and optimal pH balance during scanning.
              </p>
            </div>

            {/* Skin Shade Read-Only Card */}
            <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-8 shadow-derma space-y-4">
              <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-4">
                <div className="flex items-center gap-2 text-primaryText font-editorial text-xl font-medium">
                  <Sun className="w-5 h-5 text-accent" />
                  <span>Complexion Shade</span>
                </div>
                <span className="text-xs uppercase tracking-wider font-semibold text-primaryText/60">Read-Only</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-surfaceBorder/60 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border-2 shadow-sm flex-shrink-0"
                  style={{ backgroundColor: shadeInfo.color, borderColor: shadeInfo.border }}
                />
                <div>
                  <span className="font-editorial text-2xl font-bold text-primaryText block">
                    {profile.skin_shade || "Medium"} Tone
                  </span>
                  <span className="text-xs text-primaryText/60">Hyperpigmentation risk factor monitoring</span>
                </div>
              </div>
              <p className="text-xs text-primaryText/70 font-light leading-relaxed">
                Shade evaluation assists in flagging harsh exfoliating acids that risk post-inflammatory hyperpigmentation.
              </p>
            </div>

          </div>

          {/* Allergies & Sensitivities Read-Only Section */}
          <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-8 shadow-derma space-y-4">
            <div className="flex items-center justify-between border-b border-surfaceBorder/60 pb-4">
              <div className="flex items-center gap-2 text-primaryText font-editorial text-xl font-medium">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <span>Flagged Allergies & Sensitivities</span>
              </div>
              <span className="text-xs uppercase tracking-wider font-semibold text-accent">
                {profile.allergies?.length || 0} Triggers Active
              </span>
            </div>

            {profile.allergies && profile.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {profile.allergies.map((allergy) => (
                  <span
                    key={allergy}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold bg-surface border border-surfaceBorder text-primaryText shadow-sm flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <span>{allergy}</span>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-primaryText/60 font-light py-2">
                No specific ingredient sensitivities configured. Re-run the wizard to add known allergens.
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-surfaceBorder/40 text-xs text-primaryText/60 flex items-center justify-between">
              <span>Gemini API strictly flags products containing any listed items as <strong>Not Compatible</strong>.</span>
              <Link href="/wizard" className="font-semibold text-primaryText underline hover:text-accent">
                Edit Sensitivities
              </Link>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
