"use client";

import React from "react";
import { formatDate } from "../../lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Lock,
  ShieldCheck,
  Users,
  Clock,
  FileCheck,
  Gavel,
  AlertTriangle,
  Handshake,
  Key,
} from "lucide-react";
import Image from "next/image";

export interface NDATemplateProps {
  id?: string;
  activePage?: number; // 1 or 2 (or undefined for all pages)
  ndaNumber: string;
  effectiveDate: string;
  version?: string;
  
  // Disclosing Party Details
  disclosingName?: string;
  disclosingCompany?: string;
  disclosingAddress?: string;
  disclosingEmail?: string;
  disclosingPhone?: string;
  
  // Receiving Party Details
  receivingName: string;
  receivingCompany?: string;
  receivingAddress?: string;
  receivingEmail?: string;
  receivingPhone?: string;
  
  // Purpose & Content
  purpose?: string;
  confidentialItems?: string;
  obligations?: string;
  exclusions?: string;
  termDuration?: string;
  returnTerm?: string;
  governingLaw?: string;
  liabilityClause?: string;
  entireAgreement?: string;
  
  // Signatures
  disclosingSignatory?: string;
  receivingSignatory?: string;
  
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernNDATemplate({
  id = "nda-pdf-preview",
  activePage,
  ndaNumber = "SXL-NDA-2026-000001",
  effectiveDate = new Date().toISOString().split("T")[0],
  version = "1.0",
  
  disclosingName = "Sahil Hode",
  disclosingCompany = "SevenX Labs",
  disclosingAddress = "Thane, Mumbai, Maharashtra",
  disclosingEmail = "sevenxlabs07@gmail.com",
  disclosingPhone = "8652601566",
  
  receivingName = "Sophia Smith",
  receivingCompany = "Smith Innovations Private Limited",
  receivingAddress = "742 Evergreen Terrace, Springfield, IL 62704, USA",
  receivingEmail = "sophia@smithinnovations.com",
  receivingPhone = "+1 234 567 8900",
  
  purpose = "Evaluating business partnership, software development requirements, and technical architecture integration.",
  confidentialItems = "Source code, database schemas, REST APIs, UI/UX designs, wireframes, business logic, customer data, and trade secrets.",
  obligations = "The Receiving Party agrees to maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying, and restrict access to authorized personnel.",
  exclusions = "Information that is publicly available, already known prior to disclosure, received lawfully from a third party, or independently developed without reference to Confidential Information.",
  termDuration = "This Agreement remains effective for 3 years from the Effective Date, and confidentiality obligations survive for 5 years following termination.",
  returnTerm = "Upon written request, the Receiving Party shall immediately return or permanently destroy all physical and digital copies of Confidential Information.",
  governingLaw = "Governed by the laws of India, with exclusive jurisdiction in Mumbai, Maharashtra.",
  liabilityClause = "Neither party shall be liable for indirect, consequential, or punitive damages. Remedies include injunctive relief and actual damages.",
  entireAgreement = "This document constitutes the entire NDA between parties and supersedes all prior verbal or written understandings.",
  
  disclosingSignatory = "Sahil Hode (SevenX Labs)",
  receivingSignatory = "Sophia Smith (Managing Director)",
  
  accentColor = "lime",
}: NDATemplateProps) {
  const accentBadgeBg =
    accentColor === "lime"
      ? "bg-[#a6ce39] text-neutral-900"
      : accentColor === "purple"
      ? "bg-purple-600 text-white"
      : accentColor === "pink"
      ? "bg-pink-600 text-white"
      : "bg-emerald-600 text-white";

  const accentShape =
    accentColor === "lime"
      ? "#a6ce39"
      : accentColor === "purple"
      ? "#a855f7"
      : accentColor === "pink"
      ? "#ec4899"
      : "#10b981";

  const showPage1 = activePage === undefined || activePage === 1;

  return (
    <div
      id={id}
      className="relative w-[210mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* PAGE 1 */}
      {showPage1 && (
        <div className="relative w-full min-h-[297mm] flex flex-col justify-between pb-0">
          <div>
            {/* Top Header Row with Black Block on Right */}
            <div className="flex justify-between items-start w-full relative">
              {/* Top Left Branding */}
              <div className="pt-8 pl-10 pr-4 max-w-sm">
                <div className="flex flex-col items-start gap-1 mb-2">
                  <Image
                    src="/logo.png"
                    alt="SevenX Labs"
                    width={220}
                    height={70}
                    className="h-12 w-auto object-contain"
                    priority
                  />
                  <div className="flex items-center gap-1.5 mt-0.5 font-extrabold tracking-tight text-xl uppercase">
                    <span className="text-neutral-900 font-black">SevenX</span>
                    <span className="text-[#a6ce39] font-black">Labs</span>
                  </div>
                  <p className="text-[10px] italic font-medium text-neutral-400">Innovate. Create. Elevate.</p>
                </div>

                <div className="mt-4">
                  <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                    NON-DISCLOSURE AGREEMENT
                  </span>
                  <h2 className="text-lg font-black text-neutral-900 tracking-tight leading-snug">
                    CONFIDENTIALITY AGREEMENT (NDA)
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel */}
              <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[180px]">
                <div className="relative z-10">
                  <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-4">
                    NDA
                  </h1>
                  
                  {/* Metadata 3-Column Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium border-t border-neutral-800 pt-3">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{ndaNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">Effective Date</span>
                      <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans">Version</span>
                      <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{version}</span>
                    </div>
                  </div>
                </div>

                {/* Top Right Geometric Accent Triangles */}
                <div className="absolute -bottom-6 -right-6 pointer-events-none z-20">
                  <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="20,10 90,50 30,90" fill={accentShape} opacity="0.95" />
                    <polygon points="50,20 100,50 60,80" fill={accentShape} opacity="0.65" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="px-10 mt-4 text-xs text-neutral-700 font-medium leading-relaxed">
              <p>
                This Non-Disclosure Agreement (&quot;Agreement&quot;) is made and entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;) by and between the parties mentioned below. The parties agree to hold confidential and not disclose certain information in accordance with the terms and conditions set forth in this Agreement.
              </p>
            </div>

            {/* Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-4" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="bg-[#0a0a0a] text-white rounded-full py-2.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
                <span className="w-1/2 text-left pl-2">1. DISCLOSING PARTY</span>
                <span className="w-1/2 text-left pl-4">2. RECEIVING PARTY</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50/80 p-4 rounded-2xl border border-neutral-200/80 text-xs">
                {/* Disclosing Party */}
                <div className="space-y-1 pr-3 border-r border-neutral-200">
                  <h3 className="text-xs font-black text-neutral-900">{disclosingCompany || disclosingName}</h3>
                  <p className="text-neutral-600 font-medium text-[10px]">{disclosingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-[10px]">
                    <p><strong className="text-neutral-500 font-medium">Phone:</strong> {disclosingPhone}</p>
                    <p><strong className="text-neutral-500 font-medium">Email:</strong> {disclosingEmail}</p>
                  </div>
                </div>

                {/* Receiving Party */}
                <div className="space-y-1 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">{receivingName}</h3>
                  {receivingCompany && <p className="text-neutral-700 font-bold text-[10px]">{receivingCompany}</p>}
                  <p className="text-neutral-600 font-medium text-[10px]">{receivingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-[10px]">
                    <p><strong className="text-neutral-500 font-medium">Phone:</strong> {receivingPhone}</p>
                    <p><strong className="text-neutral-500 font-medium">Email:</strong> {receivingEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Cards Grid */}
            <div className="px-10 mt-4 space-y-3">
              {/* Section 3 & 4 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">3. CONFIDENTIAL INFORMATION</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{confidentialItems}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">4. OBLIGATIONS OF RECEIVING PARTY</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{obligations}</p>
                  </div>
                </div>
              </div>

              {/* Section 5 & 6 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">5. EXCLUSIONS</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{exclusions}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">6. TERM & SURVIVAL</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{termDuration}</p>
                  </div>
                </div>
              </div>

              {/* Section 7 & 8 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">7. RETURN OF INFORMATION</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{returnTerm}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Gavel className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">8. GOVERNING LAW</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{governingLaw}</p>
                  </div>
                </div>
              </div>

              {/* Section 9 & 10 Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">9. LIMITATION OF LIABILITY</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{liabilityClause}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-xs" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Handshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">10. ENTIRE AGREEMENT</h4>
                    <p className="text-[10px] text-neutral-600 mt-0.5 leading-relaxed">{entireAgreement}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pinned Digital Signatures Block & Footer Bar */}
          <div className="mt-auto">
            {/* Digital Signatures Box */}
            <div className="px-10 pb-4 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs bg-white" style={{ breakInside: "avoid" }}>
              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-[10px] tracking-wider mb-1">DISCLOSING PARTY</p>
                <p className="font-bold text-neutral-900 text-xs">{disclosingCompany || disclosingName}</p>
                <p className="font-mono text-neutral-700 border-b border-neutral-300 pb-1 mt-4">{disclosingSignatory}</p>
                <p className="text-[10px] text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>

              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-[10px] tracking-wider mb-1">RECEIVING PARTY</p>
                <p className="font-bold text-neutral-900 text-xs">{receivingCompany || receivingName}</p>
                <p className="font-mono text-neutral-700 border-b border-neutral-300 pb-1 mt-4">{receivingSignatory}</p>
                <p className="text-[10px] text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>
            </div>

            {/* Page Reference Footer */}
            <div className="px-10 py-1 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
              <span>SevenX Labs • Ref #{ndaNumber}</span>
              <span>Page 1 of 1</span>
            </div>

            {/* Full-Width Black Footer Bar */}
            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3 flex justify-between items-center text-xs font-semibold z-20">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{disclosingPhone || "8652601566"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{disclosingEmail || "sevenxlabs07@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                <span>{disclosingAddress || "Thane, Mumbai, Maharashtra"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
