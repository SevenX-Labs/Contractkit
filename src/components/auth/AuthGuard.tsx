"use client";

import React, { useState, useEffect } from "react";
import { loginDB } from "../../app/actions";
import { Lock, KeyRound, Mail, ShieldCheck, Sparkles, ArrowRight, Eye, EyeOff, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Default pre-filled Email ID (User will not type email)
  const defaultEmail = "sevenxlabs07@gmail.com";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    // Check local storage for persistent authentication
    const authSaved = localStorage.getItem("contractkit_auth_v1");
    if (authSaved === "true") {
      setIsAuthenticated(true);
    }
    setIsChecking(false);

    // Listen for logout events
    const handleLogoutEvent = () => {
      localStorage.removeItem("contractkit_auth_v1");
      setIsAuthenticated(false);
      setPassword("");
      toast.info("Logged out of ContractKit portal.");
    };

    window.addEventListener("contractkit_logout", handleLogoutEvent);
    return () => {
      window.removeEventListener("contractkit_logout", handleLogoutEvent);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("Please enter your admin password.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = await loginDB(password);
    setIsLoading(false);

    if (res.success) {
      localStorage.setItem("contractkit_auth_v1", "true");
      setIsAuthenticated(true);
      toast.success("Welcome back to SevenX Labs ContractKit!");
    } else {
      setErrorMsg(res.error || "Incorrect password. Access denied.");
      toast.error(res.error || "Incorrect password. Access denied.");
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#121212] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-neutral-600">Verifying security session...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, render Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F4F0E6] flex items-center justify-center p-4 selection:bg-[#121212] selection:text-white">
        <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col gap-6 relative overflow-hidden animate-in fade-in zoom-in-95">
          {/* Top Decorative Banner */}
          <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-5">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#121212] text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#a6ce39]" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-neutral-900 tracking-tight">SevenX Labs</h1>
                <p className="text-xs text-neutral-600 font-bold">ContractKit Security Portal</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase tracking-wider">
              Protected
            </span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900">Sign in to Admin Dashboard</h2>
            <p className="text-xs text-neutral-600 font-medium mt-1">
              Enter your security password configured in environment variable (<code className="font-mono text-purple-900 font-bold bg-[#DFD9C9] px-1 rounded">USER_PASS</code>).
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-pink-100 border border-pink-200 text-pink-900 text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-pink-700 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            {/* Field 1: Default Admin Email ID (Pre-filled & Readonly) */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Admin Email ID (Default)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={defaultEmail}
                  readOnly
                  className="w-full bg-[#DFD9C9] border border-[#D5CEBC] rounded-xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 font-bold cursor-not-allowed select-none"
                  title="Default email ID. No typing required."
                />
              </div>
              <span className="text-[10px] text-neutral-500 font-medium mt-1 block">
                ✓ Default admin account pre-filled automatically.
              </span>
            </div>

            {/* Field 2: Security Password */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                Security Password (<code className="font-mono text-neutral-900">USER_PASS</code>) *
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  placeholder="Enter USER_PASS password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl pl-10 pr-10 py-2.5 text-xs text-neutral-900 font-bold focus:outline-none focus:border-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#121212] hover:bg-neutral-800 text-white text-xs font-extrabold transition shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#a6ce39]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Info */}
          <div className="border-t border-[#D5CEBC] pt-4 text-center">
            <p className="text-[11px] text-neutral-500 font-medium">
              Powered by SevenX Labs ContractKit • Advanced Agentic Operations
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render children (App Layout)
  return <>{children}</>;
}
