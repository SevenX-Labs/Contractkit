"use client";

import React from "react";
import { formatDate, formatCurrency } from "../../lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Target,
  Calendar,
  IndianRupee,
  FileCheck,
  Code,
  Lock,
  ShieldCheck,
  FileText,
} from "lucide-react";
import Image from "next/image";

export interface MilestoneItem {
  id: string;
  phaseName: string;
  description: string;
  deadline: string;
}

export interface PaymentItem {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  dueDate: string;
}

export interface CustomPageItem {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
}

export interface AgreementTemplateProps {
  id?: string;
  activePage?: number;
  totalPages?: number;
  pageLayout?: "2-page" | "3-page" | "4-page" | "auto";
  customPages?: CustomPageItem[];
  agreementNumber: string;
  effectiveDate: string;
  version?: string;
  projectTitle?: string;

  // Service Provider Details
  providerName?: string;
  providerCompany?: string;
  providerAddress?: string;
  providerEmail?: string;
  providerPhone?: string;
  providerGst?: string;
  providerPan?: string;

  // Client Details
  clientName?: string;
  clientCompany?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientGst?: string;
  clientPan?: string;

  // Project Specifications & Terms
  projectDescription?: string;
  businessGoal?: string;
  projectType?: string;
  techStack?: string;
  includedScope?: string;
  excludedScope?: string;
  platforms?: string;

  startDate?: string;
  deliveryDate?: string;
  durationDays?: number;
  milestones?: MilestoneItem[];

  totalAmount?: number;
  advanceAmount?: number;
  balanceAmount?: number;
  currencySymbol?: string;
  paymentSchedule?: string;
  customPaymentTerms?: string;
  paymentRows?: PaymentItem[];

  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  upiId?: string;

  ipClause?: string;
  deliverables?: string;
  confidentialityClause?: string;

  warrantyPeriod?: string;
  warrantyScope?: string;
  revisionPolicy?: string;
  cancellationPolicy?: string;

  // Signatures
  providerSignatory?: string;
  clientSignatory?: string;

  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

// Helper: Smart Tech Stack Renderer (Full Text Un-truncated)
function renderFormattedTechStack(stackStr?: string) {
  const effectiveStr =
    stackStr && stackStr.trim().length > 0
      ? stackStr
      : "Frontend: Next.js 16, React 19, Tailwind CSS v4\nBackend: Node.js, REST API Services\nDatabase: PostgreSQL (Supabase)\nCloud: Vercel & Cloud Infra";

  // Split by newlines first if available
  const lines = effectiveStr.split("\n").map((l) => l.trim()).filter(Boolean);

  if (lines.length > 0 && lines.some((l) => l.includes(":"))) {
    return (
      <div className="space-y-1.5 mt-1">
        {lines.map((line, idx) => {
          const colonPos = line.indexOf(":");
          if (colonPos !== -1) {
            const category = line.substring(0, colonPos).trim();
            const itemsStr = line.substring(colonPos + 1).trim();
            const items = itemsStr.split(",").map((i) => i.trim()).filter(Boolean);

            return (
              <div key={idx} className="flex flex-wrap items-center gap-1.5 text-[10.5px]">
                <span className="font-sans font-black text-[9px] uppercase tracking-wider text-[#5e9618] bg-[#f0f9df] px-1.5 py-0.5 rounded border border-[#d3ec9c] shrink-0">
                  {category}
                </span>
                <div className="flex flex-wrap items-center gap-1">
                  {items.map((item, iIdx) => (
                    <span key={iIdx} className="font-mono font-bold text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-neutral-200 shadow-2xs">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          }
          return (
            <div key={idx} className="font-mono text-[10.5px] font-bold text-neutral-800">
              {line}
            </div>
          );
        })}
      </div>
    );
  }

  // Comma-separated fallback without colons
  if (effectiveStr.includes(",")) {
    const items = effectiveStr.split(",").map((s) => s.trim()).filter(Boolean);
    if (items.length >= 1) {
      return (
        <div className="flex flex-wrap gap-1 mt-1">
          {items.map((item, idx) => (
            <span key={idx} className="bg-white text-neutral-900 font-mono text-[9.5px] font-bold px-2 py-0.5 rounded-md border border-neutral-200 shadow-2xs">
              {item}
            </span>
          ))}
        </div>
      );
    }
  }

  return <p className="font-mono text-[10.5px] leading-relaxed text-neutral-800 whitespace-pre-line">{effectiveStr}</p>;
}

// Helper: Smart Scope of Work Renderer (Full Text Un-truncated)
function renderFormattedIncludedScope(scopeStr?: string) {
  if (!scopeStr) {
    return <span className="text-neutral-400 italic font-normal text-xs">[ Enter included scope of work... ]</span>;
  }

  let items: string[] = [];
  if (scopeStr.includes("\n") || scopeStr.includes("•") || scopeStr.includes("- ")) {
    items = scopeStr.split(/[\n•\-]/).map((s) => s.trim()).filter(Boolean);
  } else if (scopeStr.includes(",")) {
    items = scopeStr.split(",").map((s) => s.trim()).filter(Boolean);
  }

  if (items.length >= 2) {
    return (
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-1 text-[10.5px]">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-1.5 font-sans text-neutral-800 font-medium leading-tight">
            <span className="text-[#8cc63f] font-black text-xs leading-none select-none shrink-0">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    );
  }

  return <p className="whitespace-pre-line leading-relaxed text-[10.5px] font-mono text-neutral-800">{scopeStr}</p>;
}

export function ModernAgreementTemplate({
  id = "agreement-pdf-preview",
  activePage,
  totalPages,
  pageLayout = "3-page",
  customPages = [],
  agreementNumber = "SXL-AGR-2026-000001",
  effectiveDate = new Date().toISOString().split("T")[0],
  version = "1.0",
  projectTitle = "",

  providerName = "Sahil Hode",
  providerCompany = "SevenX Labs",
  providerAddress = "Thane, Mumbai, Maharashtra",
  providerEmail = "sevenxlabs07@gmail.com",
  providerPhone = "8652601566",
  providerGst = "",
  providerPan = "",

  clientName = "",
  clientCompany = "",
  clientAddress = "",
  clientEmail = "",
  clientPhone = "",
  clientGst = "",
  clientPan = "",

  projectDescription = "",
  businessGoal = "",
  projectType = "",
  techStack = "",
  platforms = "",
  includedScope = "",
  excludedScope = "",

  startDate = new Date().toISOString().split("T")[0],
  deliveryDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  durationDays = 45,
  milestones = [],

  totalAmount = 0,
  advanceAmount = 0,
  balanceAmount = 0,
  currencySymbol = "₹",
  paymentSchedule = "",
  customPaymentTerms = "",
  paymentRows = [],
  bankName = "",
  bankAccount = "",
  bankIfsc = "",
  upiId = "",

  ipClause = "",
  deliverables = "",
  confidentialityClause = "",

  warrantyPeriod = "",
  warrantyScope = "",
  revisionPolicy = "",
  cancellationPolicy = "",

  providerSignatory = "",
  clientSignatory = "",

  accentColor = "lime",
}: AgreementTemplateProps) {
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

  const formattedAgrNumber = (() => {
    if (!agreementNumber) return "";
    const parts = agreementNumber.split("-");
    const last = parts[parts.length - 1];
    const digits = last.replace(/[^0-9]/g, "");
    if (digits) {
      parts[parts.length - 1] = digits.padStart(6, "0");
      return parts.join("-");
    }
    return agreementNumber;
  })();

  const basePages = pageLayout === "2-page" ? 2 : pageLayout === "4-page" ? 4 : 3;
  const numPages = totalPages || (basePages + customPages.length);

  const showPage1 = activePage === undefined || activePage === 1;
  const showPage2 = activePage === undefined || activePage === 2;
  const showPage3 = basePages >= 3 && (activePage === undefined || activePage === 3);
  const showPage4 = basePages >= 4 && (activePage === undefined || activePage === 4);

  return (
    <div
      id={id}
      className="relative w-[210mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* PAGE 1: Header, Parties & Section 3 Project Overview */}
      {showPage1 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pb-0 page-break-after-always" style={{ breakAfter: "page" }}>
          <div>
            {/* Top Header Row with Black Block on Right */}
            <div className="flex justify-between items-start w-full relative">
              {/* Top Left Branding */}
              <div className="pt-6 pl-10 pr-4 max-w-sm">
                <div className="flex flex-col items-start gap-1 mb-1.5">
                  <Image
                    src="/logo.png"
                    alt="SevenX Labs"
                    width={220}
                    height={70}
                    className="h-11 w-auto object-contain"
                    priority
                  />
                  <div className="flex items-center gap-1.5 mt-0.5 font-extrabold tracking-tight text-xl uppercase">
                    <span className="text-neutral-900 font-black">SevenX</span>
                    <span className="text-[#a6ce39] font-black">Labs</span>
                  </div>
                  <p className="text-[11px] italic font-medium text-neutral-400">Innovate. Create. Elevate.</p>
                </div>

                <div className="mt-3">
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                    AGREEMENT FOR
                  </span>
                  <h2 className="text-base font-black text-neutral-900 tracking-tight leading-snug">
                    {projectTitle || <span className="text-neutral-400 italic font-normal">[ Project Title ]</span>}
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel */}
              <div className="relative w-[55%] bg-[#0a0a0a] text-white pt-6 pb-5 px-7 rounded-bl-[40px] shadow-xl flex flex-col justify-between min-h-[165px] overflow-hidden">
                <div className="relative z-10 pr-12">
                  <h1 className="text-3xl font-black tracking-wider uppercase text-white mb-2.5">
                    AGREEMENT
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left text-xs font-medium border-t border-neutral-800 pt-2.5">
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase font-sans tracking-wider">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formattedAgrNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block uppercase font-sans tracking-wider">Effective Date</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Top Right Geometric Accent Triangles */}
                <div className="absolute bottom-2 right-2 overflow-hidden pointer-events-none z-0 opacity-80">
                  <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="30,20 100,50 40,90" fill={accentShape} opacity="0.95" />
                    <polygon points="60,30 100,60 70,85" fill={accentShape} opacity="0.65" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="px-10 mt-2.5 text-xs text-neutral-800 font-medium leading-relaxed">
              <p>
                This IT Development Agreement (&quot;Agreement&quot;) is made and entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;), by and between the parties mentioned below.
              </p>
            </div>

            {/* Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-2.5" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="grid grid-cols-2 gap-4 bg-[#0a0a0a] text-white rounded-full py-2 px-6 text-xs font-black uppercase tracking-wider mb-1.5 shadow-md" style={{ lineHeight: "1.4" }}>
                <span className="text-left pl-2" style={{ display: "block", lineHeight: "1.4" }}>1. SERVICE PROVIDER</span>
                <span className="text-left pl-3" style={{ display: "block", lineHeight: "1.4" }}>2. CLIENT</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-xs">
                {/* Service Provider */}
                <div className="space-y-0.5 pr-3 border-r border-neutral-200">
                  <h3 className="text-xs font-black text-neutral-900">{providerCompany || providerName || "SevenX Labs"}</h3>
                  <p className="text-neutral-700 font-medium text-[11px]">{providerAddress || "Thane, Mumbai, Maharashtra"}</p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {providerPhone || "-"}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {providerEmail || "-"}</p>
                    {(providerGst || providerPan) && (
                      <p><strong className="text-neutral-600 font-bold">GST / PAN:</strong> {providerGst || "-"} / {providerPan || "-"}</p>
                    )}
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-0.5 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">
                    {clientName || <span className="text-neutral-400 italic font-normal">[ Client Name ]</span>}
                  </h3>
                  {clientCompany && <p className="text-neutral-800 font-bold text-[11px]">{clientCompany}</p>}
                  <p className="text-neutral-700 font-medium text-[11px]">
                    {clientAddress || <span className="text-neutral-400 italic font-normal">[ Client Address ]</span>}
                  </p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {clientPhone || "-"}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {clientEmail || "-"}</p>
                    {(clientGst || clientPan) && (
                      <p><strong className="text-neutral-600 font-bold">GST / PAN:</strong> {clientGst || "-"} / {clientPan || "-"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Project Overview & Tech Stack (Full Page 1 Focus) */}
            <div className="px-10 mt-3 space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 space-y-3">
                  {/* Title & Full-Width Stretched Description */}
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">3. PROJECT OVERVIEW</h4>
                    <div className="bg-neutral-50/90 p-3 rounded-xl border border-neutral-100 text-[11px] text-neutral-800 leading-relaxed font-medium whitespace-pre-line w-full">
                      {projectDescription || <span className="text-neutral-400 italic font-normal">[ Enter project overview description... ]</span>}
                    </div>
                  </div>

                  {/* 2-Column Split: Tech Stack (Left 7 Cols) | Goals, Type & Platforms (Right 5 Cols) */}
                  <div className="grid grid-cols-12 gap-3.5 pt-1">
                    {/* Left: Tech Stack */}
                    <div className="col-span-7 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-xs text-neutral-800">
                      <strong className="text-neutral-600 font-bold font-sans text-[10px] uppercase block mb-1 tracking-wider">Technology Stack:</strong>
                      {renderFormattedTechStack(techStack)}
                    </div>

                    {/* Right: Goals, Project Type & Target Platforms */}
                    <div className="col-span-5 space-y-2">
                      {/* Business Goal */}
                      {businessGoal && (
                        <div className="bg-[#f0f9df] p-2.5 rounded-xl border border-[#d3ec9c] text-xs">
                          <span className="text-[9.5px] font-extrabold text-[#5e9618] uppercase tracking-wider block font-sans mb-0.5">Primary Business Goal</span>
                          <p className="text-[10.5px] text-neutral-900 leading-snug font-semibold">{businessGoal}</p>
                        </div>
                      )}

                      {/* Project Type */}
                      <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs">
                        <span className="text-[9.5px] font-extrabold text-neutral-500 uppercase tracking-wider block font-sans mb-0.5">Project Type</span>
                        <p className="text-[10.5px] text-neutral-900 font-bold">{projectType || <span className="text-neutral-400 italic font-normal">[ Project Type ]</span>}</p>
                      </div>

                      {/* Target Platforms */}
                      {platforms && (
                        <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs">
                          <span className="text-[9.5px] font-extrabold text-neutral-500 uppercase tracking-wider block font-sans mb-0.5">Target Platforms</span>
                          <p className="text-[10.5px] text-neutral-800 font-medium leading-tight">{platforms}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* In 2-page mode only, Section 4 stays on Page 1 */}
              {basePages === 2 && (
                <div className="p-3 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "10px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className={`p-2 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Target style={{ width: "15px", height: "15px", display: "block" }} />
                  </div>
                  <div className="flex-1 grid grid-cols-12 gap-3">
                    <div className="col-span-4">
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">4. SCOPE OF WORK</h4>
                      <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">Full lifecycle engineering & code delivery as specified.</p>
                    </div>

                    <div className="col-span-8 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-1.5 text-neutral-800">
                      <div>
                        <span className="text-[10px] font-extrabold text-neutral-500 uppercase block font-sans tracking-wider mb-0.5">Included Scope</span>
                        {renderFormattedIncludedScope(includedScope)}
                      </div>

                      {excludedScope && (
                        <div className="pt-1.5 border-t border-neutral-200">
                          <span className="text-[9.5px] font-bold text-red-600 uppercase block font-sans mb-0.5">Excluded Scope</span>
                          <p className="whitespace-pre-line leading-relaxed text-[10px] text-neutral-600 font-mono">{excludedScope}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page 1 Footer Bar */}
          <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20 flex justify-between items-center text-xs font-semibold mt-6">
            <span>Made with SevenX Labs</span>
            <span className="font-mono text-[11px] text-neutral-400">Page 1 of {numPages}</span>
          </div>
        </div>
      )}

      {/* PAGE 2: Section 4 Scope of Work & Section 5 Timeline */}
      {showPage2 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pt-7 pb-0 page-break-after-always" style={{ breakAfter: basePages >= 3 ? "page" : "auto" }}>
          <div>
            {/* Running Header for Page 2 */}
            <div className="px-10 pb-3 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-900 text-xs uppercase tracking-wider">SevenX Labs</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">IT Development Agreement</span>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{formattedAgrNumber} | Page 2 of {numPages}</span>
            </div>

            {/* Sections on Page 2 */}
            <div className="px-10 mt-5 space-y-4">
              {/* Section 4: Scope of Work (Shifted to Page 2 for clean layout) */}
              {basePages >= 3 && (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Target style={{ width: "16px", height: "16px", display: "block" }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-2">4. SCOPE OF WORK & DELIVERABLE SPECIFICATIONS</h4>
                    
                    <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 text-xs space-y-2 text-neutral-800">
                      <div>
                        <span className="text-[10px] font-extrabold text-neutral-700 uppercase block font-sans tracking-wider mb-1">Included Scope of Work</span>
                        {renderFormattedIncludedScope(includedScope)}
                      </div>

                      {excludedScope && (
                        <div className="pt-2 border-t border-neutral-200">
                          <span className="text-[10px] font-bold text-red-600 uppercase block font-sans mb-0.5">Excluded Scope</span>
                          <p className="whitespace-pre-line leading-relaxed text-[10.5px] text-neutral-600 font-mono">{excludedScope}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 5: Timeline & Milestones */}
              {basePages >= 3 && (
                <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Calendar style={{ width: "16px", height: "16px", display: "block" }} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1.5">5. TIMELINE & PROJECT MILESTONES</h4>
                    <div className="grid grid-cols-3 gap-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-xs font-mono mb-2.5">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-sans font-bold block">Start Date</span>
                        <span className="font-bold text-neutral-900">{formatDate(startDate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-sans font-bold block">Target Delivery</span>
                        <span className="font-bold text-neutral-900">{formatDate(deliveryDate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-sans font-bold block">Total Duration</span>
                        <span className="font-bold text-neutral-900">{durationDays} Days</span>
                      </div>
                    </div>

                    {milestones && milestones.length > 0 ? (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider block">Milestone Schedule</span>
                        <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                          {milestones.map((m, idx) => (
                            <div key={m.id || idx} className={`p-2 flex justify-between items-center ${idx % 2 === 0 ? "bg-white" : "bg-neutral-50"} ${idx !== 0 ? "border-t border-neutral-100" : ""}`}>
                              <div>
                                <span className="font-bold text-neutral-900">{m.phaseName}</span>
                                <p className="text-[11px] text-neutral-600 font-medium">{m.description}</p>
                              </div>
                              <span className="font-mono text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                                {formatDate(m.deadline)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-xs text-neutral-400 italic">
                        [ Execution according to agreed milestone deadlines ]
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* If 2-page mode */}
              {basePages === 2 && (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IndianRupee style={{ width: "16px", height: "16px", display: "block" }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">6. PAYMENT TERMS</h4>
                      <p className="text-xs text-neutral-800 font-medium">{paymentSchedule}</p>
                    </div>
                  </div>

                  <div className="mt-4" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                      <div>
                        <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">AUTHORIZED SIGNATURE:</p>
                        <div className="py-1 border-b border-neutral-300">
                          <span
                            className="font-signature text-2xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                            style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                          >
                            shode
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">CLIENT SIGNATURE:</p>
                        <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-1 font-bold text-xs">
                          {clientSignatory || <span className="text-neutral-400 italic font-normal">[ Client Signatory ]</span>}
                        </p>
                        <p className="text-[11px] text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Page 2 Footer Bar */}
          <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20 flex justify-between items-center text-xs font-semibold mt-6">
            <span>Made with SevenX Labs</span>
            <span className="font-mono text-[11px] text-neutral-400">Page 2 of {numPages}</span>
          </div>
        </div>
      )}

      {/* PAGE 3: Section 6 Payment Terms, Section 7 IP & Section 8 Deliverables */}
      {showPage3 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pt-7 pb-0 page-break-after-always" style={{ breakAfter: basePages >= 4 ? "page" : "auto" }}>
          <div>
            {/* Running Header for Page 3 */}
            <div className="px-10 pb-3 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-900 text-xs uppercase tracking-wider">SevenX Labs</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">IT Development Agreement</span>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{formattedAgrNumber} | Page 3 of {numPages}</span>
            </div>

            {/* Sections 6, 7 & 8 on Page 3 */}
            <div className="px-10 mt-5 space-y-4">
              {/* Section 6: Payment Terms */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IndianRupee style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1.5">6. PAYMENT TERMS & SCHEDULE</h4>
                  {customPaymentTerms ? (
                    <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-800 leading-relaxed whitespace-pre-line mb-2.5">
                      {customPaymentTerms}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-800 mb-2 font-medium">
                      {paymentSchedule || <span className="text-neutral-400 italic font-normal">[ Payment terms schedule ]</span>}
                    </p>
                  )}
                  
                  {paymentRows && paymentRows.length > 0 ? (
                    <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs mb-2 font-mono">
                      {paymentRows.map((p, idx) => (
                        <div key={p.id || idx} className={`p-2 flex justify-between items-center ${idx % 2 === 0 ? "bg-neutral-50" : "bg-white"} ${idx !== 0 ? "border-t border-neutral-100" : ""}`}>
                          <div>
                            <span className="font-bold text-neutral-900 font-sans">{p.label}</span>
                            <span className="text-[11px] text-neutral-500 font-mono ml-2">({p.percentage}%)</span>
                          </div>
                          <div className="text-right">
                            <span className="font-extrabold text-neutral-900">{formatCurrency(p.amount, currencySymbol)}</span>
                            <span className="text-[10px] text-neutral-500 block font-sans">{p.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs font-mono space-y-1 mb-2">
                      <p><strong className="text-neutral-600 font-bold font-sans">Total Fee:</strong> <span className="font-black text-neutral-900">{formatCurrency(totalAmount, currencySymbol)}</span></p>
                    </div>
                  )}

                  {bankName && (
                    <div className="bg-neutral-900 text-white p-2.5 rounded-xl text-[11px] font-mono flex flex-wrap justify-between items-center">
                      <div>
                        <span><strong>Bank:</strong> {bankName}</span>
                        {bankAccount && <span className="ml-2">| <strong>A/C:</strong> {bankAccount}</span>}
                        {bankIfsc && <span className="ml-2">| <strong>IFSC:</strong> {bankIfsc}</span>}
                      </div>
                      {upiId && <div><strong>UPI:</strong> {upiId}</div>}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 7: Intellectual Property & Ownership */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Code style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">7. INTELLECTUAL PROPERTY & OWNERSHIP</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">
                    {ipClause || <span className="text-neutral-400 italic font-normal">[ Enter IP transfer & ownership clause... ]</span>}
                  </p>
                </div>
              </div>

              {/* Section 8: Deliverables & Code Handover */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileCheck style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1.5">8. DELIVERABLES & CODE HANDOVER</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">
                    {deliverables || <span className="text-neutral-400 italic font-normal">[ Enter deliverables list... ]</span>}
                  </p>
                </div>
              </div>

              {/* In 3-page mode, Confidentiality, Warranty & Signatures are on Page 3 */}
              {basePages === 3 && (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Lock style={{ width: "16px", height: "16px", display: "block" }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">9. CONFIDENTIALITY & DATA SECURITY</h4>
                      <p className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">
                        {confidentialityClause || <span className="text-neutral-400 italic font-normal">[ Enter confidentiality clause... ]</span>}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ShieldCheck style={{ width: "16px", height: "16px", display: "block" }} />
                    </div>
                    <div className="flex-1 space-y-1 text-xs">
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">10. WARRANTY, SUPPORT & REVISION POLICY</h4>
                      <p><strong className="text-neutral-900 font-bold">• Warranty Support:</strong> {warrantyPeriod || <span className="text-neutral-400 italic font-normal">[ Warranty period ]</span>}</p>
                      {warrantyScope && (
                        <p className="mt-1"><strong className="text-neutral-900 font-bold">• Warranty Scope:</strong> {warrantyScope}</p>
                      )}
                    </div>
                  </div>

                  {/* Signatures Section */}
                  <div className="mt-5" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                    <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                      <div>
                        <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">AUTHORIZED SIGNATURE:</p>
                        <div className="py-1.5 border-b border-neutral-300">
                          <span
                            className="font-signature text-3xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                            style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                          >
                            shode
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                        <p className="text-[11px] text-neutral-700 font-bold">{providerSignatory || providerCompany || providerName || "SevenX Labs"}</p>
                      </div>
                      <div>
                        <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">CLIENT SIGNATURE:</p>
                        <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-2.5 font-bold text-xs">
                          {clientSignatory || <span className="text-neutral-400 italic font-normal">[ Client Signatory ]</span>}
                        </p>
                        <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                        <p className="text-[11px] text-neutral-700 font-bold">
                          {clientCompany || clientName || <span className="text-neutral-400 italic font-normal">[ Client Company ]</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Page 3 Footer Bar */}
          <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20 flex justify-between items-center text-xs font-semibold mt-6">
            <span>Made with SevenX Labs</span>
            <span className="font-mono text-[11px] text-neutral-400">Page 3 of {numPages}</span>
          </div>
        </div>
      )}

      {/* PAGE 4: Section 9 Confidentiality, Section 10 Warranty & Signatures (in 4-page mode) */}
      {showPage4 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pt-7 pb-0 page-break-after-always" style={{ breakAfter: customPages.length > 0 ? "page" : "auto" }}>
          <div>
            {/* Running Header for Page 4 */}
            <div className="px-10 pb-3 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-900 text-xs uppercase tracking-wider">SevenX Labs</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">IT Development Agreement</span>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{formattedAgrNumber} | Page 4 of {numPages}</span>
            </div>

            {/* Sections 9 & 10 & Signatures on Page 4 */}
            <div className="px-10 mt-5 space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1.5">9. CONFIDENTIALITY & DATA SECURITY</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">
                    {confidentialityClause || <span className="text-neutral-400 italic font-normal">[ Enter confidentiality clause... ]</span>}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 space-y-1.5 text-xs">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1.5">10. WARRANTY, SUPPORT & REVISION POLICY</h4>
                  <p><strong className="text-neutral-900 font-bold">• Warranty Support:</strong> {warrantyPeriod || <span className="text-neutral-400 italic font-normal">[ Warranty period ]</span>}</p>
                  {warrantyScope && (
                    <p className="mt-1"><strong className="text-neutral-900 font-bold">• Warranty Scope:</strong> {warrantyScope}</p>
                  )}
                </div>
              </div>

              {/* Signatures Section */}
              <div className="mt-6" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                  <div>
                    <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">AUTHORIZED SIGNATURE:</p>
                    <div className="py-1.5 border-b border-neutral-300">
                      <span
                        className="font-signature text-3xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                        style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                      >
                        shode
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                    <p className="text-[11px] text-neutral-700 font-bold">{providerSignatory || providerCompany || providerName || "SevenX Labs"}</p>
                  </div>
                  <div>
                    <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">CLIENT SIGNATURE:</p>
                    <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-2.5 font-bold text-xs">
                      {clientSignatory || <span className="text-neutral-400 italic font-normal">[ Client Signatory ]</span>}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                    <p className="text-[11px] text-neutral-700 font-bold">
                      {clientCompany || clientName || <span className="text-neutral-400 italic font-normal">[ Client Company ]</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 4 Footer Bar */}
          <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20 flex justify-between items-center text-xs font-semibold mt-6">
            <span>Made with SevenX Labs</span>
            <span className="font-mono text-[11px] text-neutral-400">Page 4 of {numPages}</span>
          </div>
        </div>
      )}

      {/* DYNAMIC CUSTOM ADDITIONAL PAGES */}
      {customPages && customPages.map((cp, idx) => {
        const pageNum = basePages + 1 + idx;
        const showThisCustomPage = activePage === undefined || activePage === pageNum;

        if (!showThisCustomPage) return null;

        return (
          <div
            key={cp.id || idx}
            data-page="true"
            className="relative w-full min-h-[297mm] flex flex-col justify-between pt-7 pb-0 page-break-after-always"
            style={{ breakAfter: idx === customPages.length - 1 ? "auto" : "page" }}
          >
            <div>
              {/* Running Header */}
              <div className="px-10 pb-3 border-b border-neutral-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-black text-neutral-900 text-xs uppercase tracking-wider">SevenX Labs</span>
                  <span className="text-neutral-300">•</span>
                  <span className="text-xs font-bold text-neutral-600 uppercase">{cp.title || "Additional Terms & Appendix"}</span>
                </div>
                <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{formattedAgrNumber} | Page {pageNum} of {numPages}</span>
              </div>

              {/* Custom Page Body */}
              <div className="px-10 mt-5 space-y-4">
                <div className="p-5 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <div className={`p-3 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText style={{ width: "18px", height: "18px", display: "block" }} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="text-sm font-black text-neutral-900 uppercase tracking-wider">{cp.title || `PAGE ${pageNum}: APPENDIX`}</h4>
                    {cp.subtitle && <p className="text-xs text-neutral-500 font-bold">{cp.subtitle}</p>}
                    <div className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line pt-2 border-t border-neutral-100">
                      {cp.content || <span className="text-neutral-400 italic font-normal">[ Enter custom page content... ]</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20 flex justify-between items-center text-xs font-semibold mt-6">
              <span>Made with SevenX Labs</span>
              <span className="font-mono text-[11px] text-neutral-400">Page {pageNum} of {numPages}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
