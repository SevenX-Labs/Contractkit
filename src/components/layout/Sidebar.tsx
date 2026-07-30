"use client";

import React, { useState } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { SevenXLogo } from "../logo/SevenXLogo";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    window.dispatchEvent(new Event("contractkit_logout"));
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full p-4 sm:p-5 select-none overflow-hidden">
      <div className="flex flex-col gap-4">
        {/* Logo Branding & Mobile Close */}
        <div className="pt-1 flex items-center justify-between">
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

        {/* Flat Sequential Navigation List (Compact Fit, No Scrollbar Needed) */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-full text-xs font-bold transition ${
                  isActive
                    ? "bg-white text-neutral-900 shadow-md"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-900" : ""}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* SevenX Studio Footer Card with Sign Out Button */}
      <div className="pt-3 border-t border-neutral-800 shrink-0">
        <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex flex-col">
              <p className="text-[11px] font-extrabold text-white truncate leading-tight">SevenX Studio</p>
              <p className="text-[9px] text-neutral-400 font-mono truncate leading-tight">sevenxlabs07@gmail.com</p>
            </div>
          </div>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-pink-900/50 transition cursor-pointer shrink-0 ml-1"
            title="Sign Out of ContractKit"
          >
            <LogOut className="w-4 h-4 text-pink-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanently Fixed Sidebar (Hides Scrollbar completely) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 h-screen bg-[#121212] text-white flex-col justify-between overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] shrink-0 border-r border-neutral-800 rounded-r-3xl z-40">
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
          <div className="relative w-72 max-w-[85vw] bg-[#121212] text-white h-full shadow-2xl z-50 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] rounded-r-3xl border-r border-neutral-800">
            {navContent}
          </div>
        </div>
      )}

      {/* Compulsory Sign Out Confirmation Dialog Box Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95">
          <div className="bg-[#121212] border border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4 text-white">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Confirm Sign Out</h3>
                <p className="text-xs text-neutral-400 font-medium">Security Session</p>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed font-medium">
              Are you sure you want to sign out of <strong>SevenX Labs ContractKit</strong>? You will need to enter your admin password to access the portal again.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800 mt-1">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-full bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold transition shadow-md cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
