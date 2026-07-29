"use client";

import React, { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-neutral-900 flex antialiased selection:bg-pink-300 selection:text-pink-900">
      {/* Sidebar (Desktop Fixed & Mobile Slide-over Drawer) */}
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
