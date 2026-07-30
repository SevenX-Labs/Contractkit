"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileSignature,
  FileCheck,
  ShieldCheck,
  FolderKanban,
  FileText,
  Receipt,
  Award,
  Scale,
  History,
  Settings,
  Sparkles,
  X,
  LogOut,
} from "lucide-react";
import { SevenXLogo } from "../logo/SevenXLogo";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Quotations", href: "/quotation", icon: FileSignature },
    { name: "Agreements", href: "/agreement", icon: FileCheck },
    { name: "NDAs", href: "/nda", icon: ShieldCheck },
    { name: "Invoices", href: "/invoice", icon: FileText },
    { name: "Receipts", href: "/receipt", icon: Receipt },
    { name: "Completion Certificates", href: "/certificate", icon: Award },
    { name: "Clause Library", href: "/clauses", icon: Scale },
    { name: "History & Vault", href: "/history", icon: History },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    window.dispatchEvent(new Event("contractkit_logout"));
  };

  const navContent = (
    <div className="flex flex-col justify-between min-h-full p-6 select-none">
      <div className="flex flex-col gap-6">
        {/* Logo Branding & Mobile Close */}
        <div className="pt-2 flex items-center justify-between">
          <Link href="/" onClick={onMobileClose}>
            <SevenXLogo size="md" />
          </Link>
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Flat Sequential Navigation List */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
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

      {/* SevenX Studio Footer Card with Logout */}
      <div className="pt-6 mt-6 border-t border-neutral-800">
        <div className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-white truncate">SevenX Studio</p>
              <p className="text-[9px] text-neutral-400 font-mono truncate">sevenxlabs07@gmail.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-pink-900/50 transition cursor-pointer shrink-0 ml-1"
            title="Logout of ContractKit"
          >
            <LogOut className="w-4 h-4 text-pink-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanently Fixed Sidebar (fixed to left viewport) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 h-screen bg-[#121212] text-white flex-col justify-between overflow-y-auto shrink-0 border-r border-neutral-800 rounded-r-3xl z-40">
        {navContent}
      </aside>

      {/* Mobile Slide-Over Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[85vw] bg-[#121212] text-white h-full shadow-2xl z-50 overflow-y-auto rounded-r-3xl border-r border-neutral-800">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
