"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Settings, User, Plus } from "lucide-react";
import { CommandSearch } from "../common/CommandSearch";

export function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-20 w-full flex items-center justify-between px-6 md:px-10 py-4 bg-[#F4F0E6] select-none">
        {/* Search Capsule Input */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 w-full bg-[#EBE7DC] border border-[#E2DDD0] rounded-full px-4 py-2 text-xs cursor-pointer hover:border-neutral-400 transition group shadow-sm"
          >
            <div className="w-6 h-6 rounded-full bg-[#FBCFE8] text-[#831843] flex items-center justify-center shrink-0">
              <Search className="w-3.5 h-3.5" />
            </div>
            <span className="text-neutral-500 font-medium flex-1">
              Search clients, projects, invoices, contracts... <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-neutral-200 text-[10px] font-mono text-neutral-700 ml-2">Ctrl+K</kbd>
            </span>
          </div>
        </div>

        {/* Right Icon Bubble Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/builder"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>Document Studio</span>
          </Link>

          <button className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-md hover:bg-neutral-800 transition">
            <Bell className="w-4 h-4 text-pink-400" />
          </button>
          
          <Link
            href="/settings"
            className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-md hover:bg-neutral-800 transition"
          >
            <Settings className="w-4 h-4" />
          </Link>

          <div className="w-9 h-9 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-[#FBCFE8]">
            <User className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </header>

      {/* Global Command K Search Overlay */}
      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
