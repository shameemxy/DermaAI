"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { Check, ArrowRight, ChevronRight, Droplets, Sun, AlertTriangle } from "lucide-react";

const SKIN_TYPES = [
  { id: "Oily", title: "Oily", desc: "Prone to shine, enlarged pores, and excess sebum production." },
  { id: "Dry", title: "Dry", desc: "Feels tight, flaky, or dehydrated with reduced natural oils." },
  { id: "Combo", title: "Combination", desc: "Oily T-zone (forehead/nose) with dry or normal cheeks." },
  { id: "Normal", title: "Normal", desc: "Well-balanced hydration levels with minimal sensitivity." },
  { id: "Sensitive", title: "Sensitive", desc: "Easily irritated, reactive to active ingredients or fragrance." },
];

const SKIN_SHADES = [
  { id: "Fair", title: "Fair / Light", color: "#F7E2D6", border: "#E5C8B8" },
  { id: "Medium", title: "Medium / Sand", color: "#E0B388", border: "#C99A6E" },
  { id: "Olive", title: "Olive / Tan", color: "#C68E5D", border: "#AD7646" },
  { id: "Deep", title: "Deep / Bronze", color: "#794E32", border: "#5E3921" },
];

const ALLERGY_OPTIONS = [
  "Synthetic Fragrance",
  "Essential Oils",
  "Parabens & Preservatives",
  "Sulfates (SLS/SLES)",
  "Salicylic Acid (BHA)",
  "Glycolic Acid (AHA)",
  "Retinoids / Retinol",
  "Benzoyl Peroxide",
  "Denatured Alcohol",
  "Silicones (Dimethicone)",
  "Niacinamide",
  "Nut Oils & Botanicals",
  "Chemical UV Filters",
  "Lanolin",
];

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [skinType, setSkinType] = useState<string>("Combo");
  const [skinShade, setSkinShade] = useState<string>("Medium");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("derma_user_name");
      if (storedName) setName(storedName);
    }
  }, []);

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((item) => item !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleFinishWizard = async () => {
    setLoading(true);

    const profileData = {
      name: name || "Derma User",
      skin_type: skinType,
      skin_shade: skinShade,
      allergies: selectedAllergies,
      updated_at: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("derma_user_profile", JSON.stringify(profileData));
    }

    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from("users_profiles").upsert({
            id: user.id,
            name: profileData.name,
            skin_type: profileData.skin_type,
            skin_shade: profileData.skin_shade,
            allergies: profileData.allergies,
            updated_at: profileData.updated_at,
          });

          if (error) {
            console.error("Supabase profile save error:", error.message);
          }
        }
      }
    } catch (err) {
      console.warn("Saving profile with fallback state:", err);
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  return (
    <div className="min-h-screen bg-primaryBG text-primaryText flex flex-col justify-between p-6">
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="DermaAI Logo" 
            width={36} 
            height={36} 
            className="h-9 w-auto object-contain" 
          />
          <span className="font-editorial text-2xl font-bold tracking-tight text-primaryText">
            DermaAI Profile Setup
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primaryText/70">
          <span>Step {step} of 3</span>
          <div className="flex gap-1.5 ml-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === step
                    ? "w-8 bg-accent"
                    : i < step
                    ? "w-4 bg-primaryText/40"
                    : "w-4 bg-surfaceBorder"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-2xl w-full mx-auto my-auto py-8">
        <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-8 md:p-10 shadow-derma-lg">
          
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-primaryText/70 font-semibold flex items-center gap-1.5 mb-2">
                  <Droplets className="w-3.5 h-3.5 text-accent" />
                  Personal Dermatology Profile
                </span>
                <h1 className="font-editorial text-3xl md:text-4xl font-light text-primaryText mb-2">
                  What is your primary Skin Type?
                </h1>
                <p className="text-sm text-primaryText/70 font-light">
                  Select the description that best reflects your skin barrier state.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80">
                  Your Preferred Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-surfaceBorder text-primaryText placeholder-primaryText/40 focus:outline-none focus:border-accent text-sm mb-4"
                />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {SKIN_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setSkinType(type.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      skinType === type.id
                        ? "bg-accent/20 border-accent shadow-sm"
                        : "bg-surface border-surfaceBorder/60 hover:bg-surface/80"
                    }`}
                  >
                    <div>
                      <h4 className="font-editorial text-lg font-medium text-primaryText">
                        {type.title}
                      </h4>
                      <p className="text-xs text-primaryText/70 font-light mt-0.5">
                        {type.desc}
                      </p>
                    </div>
                    {skinType === type.id && (
                      <div className="w-6 h-6 rounded-full bg-accent text-primaryText flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma flex items-center gap-2"
                >
                  <span>Next: Skin Shade</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-primaryText/70 font-semibold flex items-center gap-1.5 mb-2">
                  <Sun className="w-3.5 h-3.5 text-accent" />
                  Complexion Tone
                </span>
                <h1 className="font-editorial text-3xl md:text-4xl font-light text-primaryText mb-2">
                  Select your Skin Shade
                </h1>
                <p className="text-sm text-primaryText/70 font-light">
                  This helps evaluate active ingredient absorption and hyperpigmentation sensitivities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4">
                {SKIN_SHADES.map((shade) => (
                  <button
                    key={shade.id}
                    type="button"
                    onClick={() => setSkinShade(shade.id)}
                    className={`p-5 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all ${
                      skinShade === shade.id
                        ? "border-accent ring-2 ring-accent/40 bg-accent/10"
                        : "border-surfaceBorder bg-surface hover:bg-surface/80"
                    }`}
                  >
                    <div
                      className="w-14 h-14 rounded-full shadow-inner border-2"
                      style={{ backgroundColor: shade.color, borderColor: shade.border }}
                    />
                    <span className="font-editorial text-base font-medium text-primaryText">
                      {shade.title}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-3 rounded-full text-xs font-semibold text-primaryText/80 hover:text-primaryText"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-8 py-3.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma flex items-center gap-2"
                >
                  <span>Next: Allergies & Sensitivities</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-primaryText/70 font-semibold flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-accent" />
                  Sensitivities & Reactive Triggers
                </span>
                <h1 className="font-editorial text-3xl md:text-4xl font-light text-primaryText mb-2">
                  Select Known Irritants & Allergies
                </h1>
                <p className="text-sm text-primaryText/70 font-light">
                  AI will flag products containing any selected ingredients as <span className="font-semibold text-red-700">Not Compatible</span>.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 py-4 max-h-72 overflow-y-auto pr-2">
                {ALLERGY_OPTIONS.map((allergy) => {
                  const isSelected = selectedAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-4 py-2.5 rounded-full text-xs font-medium border transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-accent border-accent text-primaryText shadow-sm"
                          : "bg-surface border-surfaceBorder text-primaryText/80 hover:bg-surface/80"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{allergy}</span>
                    </button>
                  );
                })}
              </div>

              {selectedAllergies.length > 0 && (
                <p className="text-xs text-accent font-medium">
                  {selectedAllergies.length} sensitive trigger(s) selected
                </p>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-surfaceBorder/40">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full text-xs font-semibold text-primaryText/80 hover:text-primaryText"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFinishWizard}
                  className="px-9 py-3.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Saving Profile...</span>
                  ) : (
                    <>
                      <span>Complete Wizard & Go to Home</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      <footer className="text-center text-xs text-primaryText/50 py-4">
        © {new Date().getFullYear()} DermaAI. All rights reserved.
      </footer>
    </div>
  );
}