"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileCheck,
  ShieldCheck,
  History,
  Settings,
  Sun,
  Moon,
  ChevronLeft,
  MessageSquare,
  CreditCard,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { useTheme } from "next-themes";

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const generalItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Invoices & Bills", href: "/invoice", icon: FileText },
    { label: "Agreements", href: "/agreement", icon: FileCheck },
    { label: "NDAs", href: "/nda", icon: ShieldCheck },
    { label: "History & Reports", href: "/history", icon: History },
  ];

  const toolsItems = [
    { label: "Studio Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#121212] text-white flex flex-col justify-between h-screen sticky top-0 z-40 select-none hidden md:flex p-4 rounded-r-3xl my-2 ml-2 shadow-2xl">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-3 pt-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow">
              X
            </div>
            <span className="font-bold text-xl tracking-tight text-white">SevenX</span>
          </Link>

          <button className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Section 1: General */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-3 mb-1">
            General
          </span>
          {generalItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#242424] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-pink-400" : "text-neutral-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Section 2: Tools */}
        <div className="flex flex-col gap-1 mt-2">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-3 mb-1">
            Tools
          </span>
          {toolsItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-[#242424] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-pink-400" : "text-neutral-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-neutral-800 flex flex-col gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-2xl bg-neutral-900 text-xs text-neutral-300 hover:bg-neutral-800 transition font-medium"
        >
          <span className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-purple-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
            <span>Theme Mode</span>
          </span>
          <span className="capitalize text-neutral-500 font-bold">{theme || "light"}</span>
        </button>
      </div>
    </aside>
  );
}
