"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Scale,
  FileText,
  FileCheck,
  ShieldCheck,
  History,
  Settings,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SevenXLogo } from "../logo/SevenXLogo";

export function Sidebar() {
  const pathname = usePathname();

  const generalNav = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Client CRM", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Clause Library", href: "/clauses", icon: Scale },
    { name: "Document Studio", href: "/builder", icon: Wand2, highlight: true },
  ];

  const toolsNav = [
    { name: "Invoices & Bills", href: "/invoice", icon: FileText },
    { name: "Agreements", href: "/agreement", icon: FileCheck },
    { name: "NDAs", href: "/nda", icon: ShieldCheck },
    { name: "History & Vault", href: "/history", icon: History },
  ];

  const bottomNav = [
    { name: "Studio Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 overflow-y-auto bg-[#121212] text-white flex flex-col justify-between p-6 select-none shrink-0 border-r border-neutral-800 rounded-r-3xl z-40">
      <div className="flex flex-col gap-8">
        {/* Logo Branding */}
        <div className="pt-2">
          <Link href="/">
            <SevenXLogo size="md" />
          </Link>
        </div>

        {/* General Navigation */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 px-3">
            General
          </span>
          <nav className="flex flex-col gap-1">
            {generalNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-md"
                      : item.highlight
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : ""}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Tools Section */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-500 px-3">
            Document Suite
          </span>
          <nav className="flex flex-col gap-1">
            {toolsNav.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition ${
                    isActive
                      ? "bg-white text-neutral-900 shadow-md"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : ""}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile Settings */}
      <div className="flex flex-col gap-4 pt-6 border-t border-neutral-800">
        <div className="flex flex-col gap-1">
          {bottomNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition ${
                  isActive
                    ? "bg-white text-neutral-900 shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : ""}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Upgrade Pro Card */}
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">SevenX Studio</p>
              <p className="text-[9px] text-neutral-400 font-mono">Enterprise v2.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
