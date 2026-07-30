"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Settings, User, Plus, Menu } from "lucide-react";
import { CommandSearch } from "../common/CommandSearch";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
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
      <header className="h-20 w-full flex items-center justify-between px-3 sm:px-6 md:px-8 py-4 bg-[#F4F0E6] select-none gap-2 sm:gap-3 min-w-0">
        {/* Mobile Menu Button & Search Capsule */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-w-xl">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-full bg-[#EBE7DC] border border-[#E2DDD0] text-neutral-800 hover:bg-[#E2DDD0] transition shrink-0"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900" />
            </button>
          )}

          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 w-full bg-[#EBE7DC] border border-[#E2DDD0] rounded-full px-3 py-1.5 sm:py-2 text-xs cursor-pointer hover:border-neutral-400 transition group shadow-sm min-w-0 overflow-hidden"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#FBCFE8] text-[#831843] flex items-center justify-center shrink-0">
              <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <span className="text-neutral-500 font-medium truncate text-[11px] sm:text-xs">
              Search clients... <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-neutral-200 text-[10px] font-mono text-neutral-700 ml-1">Ctrl+K</kbd>
            </span>
          </div>
        </div>

        {/* Right Icon Bubble Actions (shrink-0 ensures no cutoff) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">


          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-md hover:bg-neutral-800 transition shrink-0">
            <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-pink-400" />
          </button>
          
          <Link
            href="/settings"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#121212] text-white flex items-center justify-center shadow-md hover:bg-neutral-800 transition shrink-0"
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>

          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#121212] text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-[#FBCFE8] shrink-0">
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          </div>
        </div>
      </header>

      {/* Global Command K Search Overlay */}
      <CommandSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
