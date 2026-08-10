"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/utils/supabase/client";
import { Menu, X, Home, History, User, Info, Shield, FileText, LogOut, Trash2 } from "lucide-react";

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  // Ensure portals only render on the client side to prevent hydration errors
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.removeItem("derma_user_profile");
    }
    setIsOpen(false);
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    
    try {
      if (isSupabaseConfigured()) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Delete profile and scan history data (RLS allows users to delete their own rows)
          await supabase.from("users_profiles").delete().eq("id", user.id);
          await supabase.from("scans").delete().eq("user_id", user.id);
          
          // Sign out the user
          await supabase.auth.signOut();
        }
      }
      
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        localStorage.removeItem("derma_user_profile");
        localStorage.removeItem("derma_scans_history");
      }
      
      setIsOpen(false);
      setShowDeleteModal(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleting(false);
    }
  };

  const navLinks = [
    { href: "/home", label: "Scan Engine", icon: Home },
    { href: "/history", label: "Scan History", icon: History },
    { href: "/profile", label: "Skin Persona", icon: User },
    { href: "/about", label: "About DermaAI", icon: Info },
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  return (
    <>
      {/* Toggle Button (Stays in the Header) */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        className="p-2.5 rounded-full bg-surface border border-surfaceBorder text-primaryText hover:bg-surfaceCard transition-all shadow-sm flex items-center justify-center"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Portal teleports the menu outside of the header's CSS trap */}
      {mounted && createPortal(
        <div className="relative z-[100]">
          
          {/* Darkened Backdrop for better mobile readability */}
          {isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] transition-opacity"
            />
          )}

          {/* Slide-over Drawer */}
          <div
            className={`fixed top-0 right-0 h-[100dvh] w-80 max-w-[85vw] bg-primaryBG border-l border-surfaceBorder shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 overflow-y-auto ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-6 border-b border-surfaceBorder/60">
                <div className="flex items-center gap-3">
                  <Image 
                    src="/logo.png" 
                    alt="DermaAI Logo" 
                    width={36} 
                    height={36} 
                    className="h-9 w-auto object-contain" 
                  />
                  <span className="font-editorial text-2xl font-bold text-primaryText">
                    DermaAI
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-surface text-primaryText/70 hover:text-primaryText transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-6 space-y-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-accent text-primaryText shadow-sm font-semibold"
                          : "text-primaryText/80 hover:bg-surface hover:text-primaryText"
                      }`}
                    >
                      <Icon className="w-4 h-4 text-primaryText" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Footer / Actions */}
            <div className="pt-6 border-t border-surfaceBorder/60 space-y-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-surfaceBorder text-primaryText text-sm font-medium hover:bg-surfaceCard transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl border border-transparent text-red-700 text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
              <div className="bg-primaryBG border border-surfaceBorder rounded-3xl p-8 max-w-sm w-full space-y-5 shadow-2xl">
                <h3 className="font-editorial text-2xl font-bold text-primaryText">Delete Account?</h3>
                <p className="text-sm text-primaryText/80 font-light leading-relaxed">
                  This action is permanent. Your skin profile and all scan history will be securely erased from the database.
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    disabled={deleting}
                    className="px-5 py-2.5 text-sm font-semibold text-primaryText/80 hover:text-primaryText hover:bg-surface rounded-xl transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-5 py-2.5 text-sm font-semibold bg-red-700 text-white rounded-xl hover:bg-red-800 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Permanently Delete"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}