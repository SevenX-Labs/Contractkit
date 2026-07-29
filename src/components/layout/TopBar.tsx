"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Plus,
  User,
  Bell,
  Settings,
  FileText,
  FileCheck,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-transparent px-6 py-4 flex items-center justify-between gap-4 select-none">
      {/* Search Bar Capsule with Tag Pills (from image) */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
          <div className="absolute left-1.5 p-2 rounded-full bg-pink-300 text-pink-900 flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents or clients..."
            className="w-full bg-[#EBE7DC] border border-[#E2DDD0] rounded-full pl-12 pr-32 py-2.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
          />
          <div className="absolute right-3 flex items-center gap-1.5 text-[10px] text-neutral-500 font-semibold pointer-events-none hidden sm:flex">
            <span>In:</span>
            <span className="px-2 py-0.5 rounded-full bg-[#DFD9C9] text-neutral-800">Invoices</span>
            <span className="px-2 py-0.5 rounded-full bg-[#DFD9C9] text-neutral-800">NDAs</span>
          </div>
        </form>
      </div>

      {/* Right User Bubble Icons & Quick Create */}
      <div className="flex items-center gap-3">
        {/* Quick Action Button */}
        <div className="relative">
          <button
            onClick={() => setIsQuickCreateOpen(!isQuickCreateOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create Document</span>
          </button>

          {isQuickCreateOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#121212] text-white shadow-2xl p-2 z-50 flex flex-col gap-1 border border-neutral-800"
              onMouseLeave={() => setIsQuickCreateOpen(false)}
            >
              <Link
                href="/invoice"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition"
              >
                <FileText className="w-4 h-4 text-pink-400" />
                <span>New Invoice</span>
              </Link>
              <Link
                href="/agreement"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition"
              >
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>New Agreement</span>
              </Link>
              <Link
                href="/nda"
                onClick={() => setIsQuickCreateOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-neutral-800 transition"
              >
                <ShieldCheck className="w-4 h-4 text-yellow-400" />
                <span>New NDA</span>
              </Link>
            </div>
          )}
        </div>

        {/* Profile / Notification Bubbles (from image) */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition">
            <User className="w-4 h-4" />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition">
            <Bell className="w-4 h-4" />
          </div>
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-full bg-[#121212] text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-[#121212] text-white p-6 z-50 flex flex-col gap-3 md:hidden shadow-2xl rounded-b-3xl">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">Dashboard</Link>
          <Link href="/invoice" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">Invoices</Link>
          <Link href="/agreement" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">Agreements</Link>
          <Link href="/nda" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">NDAs</Link>
          <Link href="/history" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">History</Link>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="p-3 rounded-xl bg-neutral-900 font-semibold text-sm">Settings</Link>
        </div>
      )}
    </header>
  );
}
