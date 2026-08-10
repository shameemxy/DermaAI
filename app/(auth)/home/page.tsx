"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { Sparkles, Camera, UploadCloud, FileText, CheckCircle2, AlertTriangle, RefreshCw, X, User, Sliders, Shield, ArrowRight, XCircle, History } from "lucide-react";

type ScanMode = "manual" | "upload" | "camera";

interface UserProfile {
  name?: string;
  skin_type?: string;
  skin_shade?: string;
  allergies?: string[];
}

interface ScanResult {
  product_name: string;
  compatibility_status: "Compatible" | "Not Compatible";
  reasoning: string;
  scanned_at: string;
}

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Derma AI User",
    skin_type: "Combo",
    skin_shade: "Medium",
    allergies: ["Fragrance", "Parabens", "Sulfates"],
  });

  const [scanMode, setScanMode] = useState<ScanMode>("manual");
  const [productName, setProductName] = useState("");
  const [manualText, setManualText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  
  // Camera WebCam state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Analysis Loading & Result State
  const [analyzing, setAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
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
      console.warn("Using default profile preview:", err);
    }
  };

  useEffect(() => {
    if (scanMode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError("Camera access is not supported by your browser.");
      }
    } catch (err: any) {
      console.warn("Camera permission error:", err);
      setCameraError("Camera permission denied. Please select Image Upload instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUrl);
        setImageBase64(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (scanMode === "camera") {
      startCamera();
    }
  };

  const handleAnalyze = async () => {
    if (scanMode === "manual" && !manualText.trim()) {
      setErrorMessage("Please enter an ingredient list to analyze.");
      return;
    }
    if ((scanMode === "upload" || scanMode === "camera") && !imageBase64) {
      setErrorMessage("Please upload or capture a label photo first.");
      return;
    }

    setAnalyzing(true);
    setErrorMessage(null);
    setScanResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: productName.trim() || undefined,
          ingredientsText: scanMode === "manual" ? manualText : undefined,
          imageBase64: scanMode !== "manual" ? imageBase64 : undefined,
          profileOverride: profile,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to complete dermatological analysis.");
      }

      if (data.scan) {
        setScanResult(data.scan);

        if (typeof window !== "undefined") {
          const localHistory = localStorage.getItem("derma_scans_history");
          const historyArr = localHistory ? JSON.parse(localHistory) : [];
          historyArr.unshift(data.scan);
          localStorage.setItem("derma_scans_history", JSON.stringify(historyArr));
        }
      }
    } catch (err: any) {
      console.error("Scan submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during scanning.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* User Greeting & Skin Profile Summary Header */}
      <section className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-8 shadow-derma flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-xs font-semibold text-primaryText mb-3">
            <User className="w-3.5 h-3.5 text-accent" />
            <span>Active Skin Persona</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-light text-primaryText mb-2">
            Welcome, <span className="font-normal italic">{profile.name || "Derma User"}</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
            <span className="px-3 py-1 rounded-full bg-surface border border-surfaceBorder font-medium">
              Skin Type: <strong className="text-primaryText">{profile.skin_type || "Combo"}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-surface border border-surfaceBorder font-medium">
              Shade: <strong className="text-primaryText">{profile.skin_shade || "Medium"}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-surface border border-surfaceBorder font-medium text-amber-900 bg-amber-50">
              Sensitivities: <strong>{profile.allergies?.length || 0} active</strong>
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-3">
          <Link
            href="/history"
            className="px-4 py-2.5 rounded-full bg-surface border border-surfaceBorder hover:bg-surfaceCard text-xs font-semibold text-primaryText transition-all flex items-center gap-2 shadow-sm"
          >
            <History className="w-3.5 h-3.5 text-accent" />
            <span>History</span>
          </Link>
          <Link
            href="/wizard"
            className="px-4 py-2.5 rounded-full bg-accent hover:bg-accentHover text-xs font-semibold text-primaryText transition-all flex items-center gap-2 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Edit Persona</span>
          </Link>
        </div>
      </section>

      {/* Main Scan Toggle Card Interface */}
      <section className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-10 shadow-derma-lg">
        
        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest text-primaryText/70 font-bold flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            Dermatological Compatibility Scanner
          </span>
          <h2 className="font-editorial text-3xl font-light text-primaryText mb-2">
            Scan Skincare Product Ingredients
          </h2>
          <p className="text-sm text-primaryText/70 font-light">
            Select your preferred input mode to run intelligent ingredient safety checking.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-100/80 border border-red-200 text-red-800 text-xs flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Product Name Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80 mb-2">
            Product Name (Optional)
          </label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. CeraVe Hydrating Cleanser"
            className="w-full px-4 py-3.5 rounded-2xl bg-surface border border-surfaceBorder text-primaryText placeholder-primaryText/40 focus:outline-none focus:border-accent text-sm"
          />
        </div>

        {/* Scan Toggle Mode Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-surface border border-surfaceBorder mb-6">
          <button
            type="button"
            onClick={() => { setScanMode("manual"); setErrorMessage(null); }}
            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scanMode === "manual"
                ? "bg-accent text-primaryText shadow-sm"
                : "text-primaryText/70 hover:text-primaryText"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Type</span> Manually
          </button>

          <button
            type="button"
            onClick={() => { setScanMode("upload"); setErrorMessage(null); }}
            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scanMode === "upload"
                ? "bg-accent text-primaryText shadow-sm"
                : "text-primaryText/70 hover:text-primaryText"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Image
          </button>

          <button
            type="button"
            onClick={() => { setScanMode("camera"); setErrorMessage(null); }}
            className={`py-3 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
              scanMode === "camera"
                ? "bg-accent text-primaryText shadow-sm"
                : "text-primaryText/70 hover:text-primaryText"
            }`}
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </button>
        </div>

        {/* TAB 1: TYPE MANUALLY */}
        {scanMode === "manual" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80">
              Ingredient List (Paste raw label text)
            </label>
            <textarea
              rows={5}
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="Aqua / Water, Glycerin, Squalane, Niacinamide, Cetearyl Alcohol, Fragrance, Salicylic Acid..."
              className="w-full p-4 rounded-2xl bg-surface border border-surfaceBorder text-primaryText placeholder-primaryText/40 focus:outline-none focus:border-accent text-sm leading-relaxed"
            />
          </div>
        )}

        {/* TAB 2: UPLOAD IMAGE */}
        {scanMode === "upload" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80">
              Upload Cosmetic Product Label Photo
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-surfaceBorder bg-surface p-2 flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Uploaded label preview"
                  className="max-h-64 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="mt-3 px-4 py-2 rounded-full bg-red-100 text-red-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-red-200"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-surfaceBorder rounded-2xl p-10 bg-surface/50 hover:bg-surface transition-all flex flex-col items-center justify-center cursor-pointer">
                <UploadCloud className="w-10 h-10 text-accent mb-3" />
                <span className="text-sm font-semibold text-primaryText mb-1">
                  Click to select label image
                </span>
                <span className="text-xs text-primaryText/60">
                  Supports PNG, JPG, WEBP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        )}

        {/* TAB 3: TAKE PHOTO (LIVE WEBCAM) */}
        {scanMode === "camera" && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-primaryText/80">
              Live Camera Label Snapshot
            </label>

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-surfaceBorder bg-surface p-2 flex flex-col items-center">
                <img
                  src={imagePreview}
                  alt="Captured photo preview"
                  className="max-h-64 object-contain rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="mt-3 px-4 py-2 rounded-full bg-accent text-primaryText text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Snapshot</span>
                </button>
              </div>
            ) : (
              <div className="rounded-2xl border border-surfaceBorder overflow-hidden bg-black/90 relative min-h-[260px] flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full max-h-72 object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {cameraError ? (
                  <div className="p-6 text-center text-red-200 text-xs flex flex-col items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-amber-400" />
                    <span>{cameraError}</span>
                  </div>
                ) : (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={!cameraActive}
                      className="px-6 py-3 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-xs shadow-derma-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-surfaceBorder/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-primaryText/60 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-accent" />
            <span>Secure AI Analysis</span>
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {analyzing ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Ingredients...</span>
              </span>
            ) : (
              <>
                <span>Analyze Ingredients</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* SKELETAL LOADING STATE UI */}
        {analyzing && (
          <div className="mt-10 p-8 rounded-3xl bg-surface border border-surfaceBorder animate-pulse space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-surfaceBorder/80 rounded" />
                <div className="h-7 w-64 bg-surfaceBorder rounded-lg" />
              </div>
              <div className="h-9 w-36 bg-accent/40 rounded-full" />
            </div>

            <div className="space-y-2 pt-4 border-t border-surfaceBorder/40">
              <div className="h-4 w-full bg-surfaceBorder/70 rounded" />
              <div className="h-4 w-5/6 bg-surfaceBorder/70 rounded" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-8 h-8 rounded-full bg-accent/50 flex-shrink-0" />
              <div className="h-4 w-1/2 bg-surfaceBorder rounded" />
            </div>
          </div>
        )}

        {/* COMPATIBILITY ANALYSIS RESULT CARD */}
        {scanResult && !analyzing && (
          <div className="mt-10 rounded-3xl border p-8 shadow-derma-lg transition-all animate-fadeIn bg-surfaceCard border-surfaceBorder">
            
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-surfaceBorder/60">
              <div>
                <span className="text-xs uppercase tracking-wider text-primaryText/60 font-semibold">
                  Analysis Complete
                </span>
                <h3 className="font-editorial text-2xl font-bold text-primaryText">
                  {scanResult.product_name}
                </h3>
              </div>

              {scanResult.compatibility_status === "Compatible" ? (
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-semibold text-sm shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Compatible</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-100/90 text-red-800 border border-red-300 font-semibold text-sm shadow-sm">
                  <XCircle className="w-4 h-4 text-red-700" />
                  <span>Not Compatible</span>
                </span>
              )}
            </div>

            <div className="pt-6 space-y-4">
              <div>
                <h4 className="font-editorial text-lg font-medium text-primaryText mb-2">
                  Dermatological Safety Reasoning:
                </h4>
                <p className="text-sm md:text-base text-primaryText/80 leading-relaxed font-light bg-surface/50 p-5 rounded-2xl border border-surfaceBorder/60">
                  &quot;{scanResult.reasoning}&quot;
                </p>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs text-primaryText/60 border-t border-surfaceBorder/40">
                <span>Scanned at: {new Date(scanResult.scanned_at).toLocaleTimeString()}</span>
                <Link
                  href="/history"
                  className="font-semibold text-primaryText underline hover:text-accent flex items-center gap-1"
                >
                  <span>View in Scan History</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

      </section>
    </div>
  );
}