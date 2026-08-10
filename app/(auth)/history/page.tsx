"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { History, CheckCircle2, XCircle, Search, Calendar, Clock, ArrowLeft, Scan, RefreshCw, Trash2 } from "lucide-react";

interface ScanRecord {
  id?: string;
  product_name: string;
  compatibility_status: "Compatible" | "Not Compatible";
  reasoning: string;
  scanned_at: string;
}

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Compatible" | "Not Compatible">("All");

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    setLoading(true);
    let loadedScans: ScanRecord[] = [];

    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("scans")
            .select("*")
            .eq("user_id", user.id)
            .order("scanned_at", { ascending: false });

          if (data && !error) {
            loadedScans = data;
          }
        }
      }

      // Merge or fallback to local storage history if Supabase list is empty
      if (loadedScans.length === 0 && typeof window !== "undefined") {
        const local = localStorage.getItem("derma_scans_history");
        if (local) {
          loadedScans = JSON.parse(local);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch Supabase scan history, loading local history:", err);
      if (typeof window !== "undefined") {
        const local = localStorage.getItem("derma_scans_history");
        if (local) loadedScans = JSON.parse(local);
      }
    } finally {
      setScans(loadedScans);
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your scan history?")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("derma_scans_history");
      }
      setScans([]);
    }
  };

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scan.reasoning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "All" || scan.compatibility_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
          <h1 className="font-editorial text-4xl font-light text-primaryText flex items-center gap-3">
            <History className="w-8 h-8 text-accent" />
            <span>Product Scan History</span>
          </h1>
          <p className="text-sm text-primaryText/70 font-light mt-1">
            Review past dermatological ingredient compatibility evaluations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/home"
            className="px-6 py-2.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-xs transition-all shadow-derma flex items-center gap-2"
          >
            <Scan className="w-4 h-4" />
            <span>New Product Scan</span>
          </Link>
          {scans.length > 0 && (
            <button
              onClick={clearHistory}
              className="p-2.5 rounded-full bg-surface border border-surfaceBorder text-primaryText/70 hover:text-red-700 hover:bg-red-50 transition-colors"
              title="Clear Local History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-primaryText/50 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product name or ingredient..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surfaceCard border border-surfaceBorder text-primaryText text-sm placeholder-primaryText/40 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(["All", "Compatible", "Not Compatible"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === status
                  ? "bg-accent border-accent text-primaryText shadow-sm"
                  : "bg-surfaceCard border-surfaceBorder text-primaryText/70 hover:text-primaryText"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Scan History Records List */}
      {loading ? (
        <div className="space-y-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-surfaceCard border border-surfaceBorder animate-pulse space-y-3">
              <div className="h-5 w-48 bg-surfaceBorder rounded" />
              <div className="h-4 w-full bg-surfaceBorder/60 rounded" />
            </div>
          ))}
        </div>
      ) : filteredScans.length === 0 ? (
        <div className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-12 text-center my-8 shadow-derma">
          <History className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="font-editorial text-2xl font-medium text-primaryText mb-2">
            No Scan Records Found
          </h3>
          <p className="text-sm text-primaryText/70 font-light max-w-md mx-auto mb-6">
            {searchQuery || filterStatus !== "All"
              ? "No scan records match your current filter criteria."
              : "You haven't scanned any skincare products yet. Perform your first scan to populate history."}
          </p>
          <Link
            href="/home"
            className="px-8 py-3.5 rounded-full bg-accent hover:bg-accentHover text-primaryText font-medium text-sm transition-all shadow-derma inline-flex items-center gap-2"
          >
            <span>Scan First Product</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredScans.map((scan, index) => {
            const dateObj = new Date(scan.scanned_at);
            const formattedDate = dateObj.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const formattedTime = dateObj.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={scan.id || index}
                className="bg-surfaceCard border border-surfaceBorder rounded-3xl p-6 md:p-8 shadow-derma hover:shadow-derma-lg transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-surfaceBorder/60">
                  <div>
                    <h3 className="font-editorial text-2xl font-semibold text-primaryText">
                      {scan.product_name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-primaryText/60 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-accent" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-accent" />
                        {formattedTime}
                      </span>
                    </div>
                  </div>

                  {scan.compatibility_status === "Compatible" ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-semibold text-xs shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Compatible</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100/90 text-red-800 border border-red-300 font-semibold text-xs shadow-sm">
                      <XCircle className="w-3.5 h-3.5 text-red-700" />
                      <span>Not Compatible</span>
                    </span>
                  )}
                </div>

                <div className="pt-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-primaryText/70 mb-1">
                    Gemini AI Safety Advice:
                  </h4>
                  <p className="text-sm text-primaryText/80 font-light leading-relaxed bg-surface/40 p-4 rounded-2xl border border-surfaceBorder/40">
                    &quot;{scan.reasoning}&quot;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
