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
} from "lucide-react";
import Image from "next/image";

export interface AgreementTemplateProps {
  id?: string;
  activePage?: number; // 1 or 2 (or undefined for all pages)
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
  clientName: string;
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

  totalAmount?: number;
  advanceAmount?: number;
  balanceAmount?: number;
  currencySymbol?: string;
  paymentSchedule?: string;

  ipClause?: string;
  deliverables?: string;
  confidentialityClause?: string;

  warrantyPeriod?: string;
  revisionPolicy?: string;
  cancellationPolicy?: string;

  // Signatures
  providerSignatory?: string;
  clientSignatory?: string;

  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernAgreementTemplate({
  id = "agreement-pdf-preview",
  activePage,
  agreementNumber = "SXL-AGR-2026-000001",
  effectiveDate = new Date().toISOString().split("T")[0],
  version = "1.0",
  projectTitle = "Custom Software & Mobile App Development",

  providerName = "Sahil Hode",
  providerCompany = "SevenX Labs",
  providerAddress = "Thane, Mumbai, Maharashtra",
  providerEmail = "sevenxlabs07@gmail.com",
  providerPhone = "8652601566",
  providerGst = "27AAAAA0000A1Z5",
  providerPan = "ABCDE1234F",

  clientName = "Sophia Smith",
  clientCompany = "Smith Innovations Private Limited",
  clientAddress = "742 Evergreen Terrace, Springfield, IL 62704, USA",
  clientEmail = "sophia@smithinnovations.com",
  clientPhone = "+1 234 567 8900",
  clientGst = "27BBBBB1111B2Z6",
  clientPan = "FGHIJ5678K",

  projectDescription = "Design, development, testing, and deployment of enterprise web application and mobile app solution.",
  projectType = "Full-Stack Web & Cross-Platform Mobile App",
  techStack = "Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL, React Native",
  platforms = "Web Browser, iOS App Store, Google Play Store",
  includedScope = "• UI/UX Prototype Design & User Flow Architecture\n• Frontend & Backend API Development\n• Database Architecture & Cloud Infrastructure Setup\n• Quality Assurance Testing & Bug Fixes\n• Final Deployment & Code Handover",

  startDate = new Date().toISOString().split("T")[0],
  deliveryDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  durationDays = 45,

  totalAmount = 250000,
  advanceAmount = 125000,
  balanceAmount = 125000,
  currencySymbol = "₹",
  paymentSchedule = "50% advance deposit upon contract signing; 50% balance payment upon project completion and code handover.",

  ipClause = "Upon full and final payment, SevenX Labs assigns all intellectual property rights, source code ownership, and patent rights for custom software created under this agreement to the Client.",
  deliverables = "• Complete Clean Source Code (GitHub Repository access)\n• Production Build Deployment Files & Environment Configs\n• Admin Dashboard & API Documentation\n• User Manual & System Walkthrough Video",
  confidentialityClause = "Both parties agree to protect and keep strictly confidential all proprietary business logic, trade secrets, database schemas, customer data, and source code disclosed during the engagement.",

  warrantyPeriod = "30 Days free bug fix support and warranty from deployment date.",
  revisionPolicy = "2 Rounds of major UI/UX revisions included during design phase.",
  cancellationPolicy = "Termination by written notice; work completed up to termination date shall be billed accordingly.",

  providerSignatory = "Sahil Hode (SevenX Labs)",
  clientSignatory = "Sophia Smith (Smith Innovations)",

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

  const showPage1 = activePage === undefined || activePage === 1;
  const showPage2 = activePage === undefined || activePage === 2;

  return (
    <div
      id={id}
      className="relative w-[210mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* PAGE 1 */}
      {showPage1 && (
        <div className="relative w-full h-[297mm] flex flex-col justify-between pb-0 overflow-hidden page-break-after-always" style={{ breakAfter: "page" }}>
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
                  <p className="text-xs italic font-medium text-neutral-400">Innovate. Create. Elevate.</p>
                </div>

                <div className="mt-4">
                  <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                    AGREEMENT FOR
                  </span>
                  <h2 className="text-lg font-black text-neutral-900 tracking-tight leading-snug">
                    {projectTitle}
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel */}
              <div className="relative w-[55%] bg-[#0a0a0a] text-white pt-7 pb-6 px-7 rounded-bl-[40px] shadow-xl flex flex-col justify-between min-h-[175px] overflow-hidden">
                <div className="relative z-10 pr-12">
                  <h1 className="text-3xl font-black tracking-wider uppercase text-white mb-3">
                    AGREEMENT
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-3 text-left text-xs font-medium border-t border-neutral-800 pt-3">
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
            <div className="px-10 mt-4 text-xs text-neutral-800 font-medium leading-relaxed">
              <p>
                This IT Development Agreement (&quot;Agreement&quot;) is made and entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;), by and between the parties mentioned below.
              </p>
            </div>

            {/* Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-4" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="grid grid-cols-2 gap-4 bg-[#0a0a0a] text-white rounded-full py-3 px-6 text-xs font-black uppercase tracking-wider mb-2 shadow-md" style={{ lineHeight: "1.4" }}>
                <span className="text-left pl-2" style={{ display: "block", lineHeight: "1.4" }}>1. SERVICE PROVIDER</span>
                <span className="text-left pl-3" style={{ display: "block", lineHeight: "1.4" }}>2. CLIENT</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
                {/* Service Provider */}
                <div className="space-y-1 pr-3 border-r border-neutral-200">
                  <h3 className="text-xs font-black text-neutral-900">{providerCompany || providerName}</h3>
                  <p className="text-neutral-700 font-medium text-xs">{providerAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-xs">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {providerPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {providerEmail}</p>
                    <p><strong className="text-neutral-600 font-bold">GST / PAN:</strong> {providerGst} / {providerPan}</p>
                  </div>
                </div>

                {/* Client */}
                <div className="space-y-1 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">{clientName}</h3>
                  {clientCompany && <p className="text-neutral-800 font-bold text-xs">{clientCompany}</p>}
                  <p className="text-neutral-700 font-medium text-xs">{clientAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-xs">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {clientPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {clientEmail}</p>
                    <p><strong className="text-neutral-600 font-bold">GST / PAN:</strong> {clientGst} / {clientPan}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections 3, 4, 5, 6 on Page 1 */}
            <div className="px-10 mt-4 space-y-3">
              {/* Section 3: Project Overview */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">3. PROJECT OVERVIEW</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{projectDescription}</p>
                  </div>
                  <div className="col-span-7 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-0.5 font-mono text-neutral-800">
                    <p><strong className="text-neutral-600 font-bold">Type:</strong> {projectType}</p>
                    <p><strong className="text-neutral-600 font-bold">Tech Stack:</strong> {techStack}</p>
                    <p><strong className="text-neutral-600 font-bold">Platforms:</strong> {platforms}</p>
                  </div>
                </div>
              </div>

              {/* Section 4: Scope of Work */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Target style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">4. SCOPE OF WORK</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">Full lifecycle engineering & code delivery as specified.</p>
                  </div>
                  <div className="col-span-7 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-0.5 font-mono text-neutral-800">
                    {includedScope ? (
                      <p className="whitespace-pre-line leading-relaxed">{includedScope}</p>
                    ) : (
                      <p>Custom dashboard & authentication • REST APIs development & integration • PostgreSQL database & migrations • High-performance PDF/DOCX/PNG export engine</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Timeline & Milestones */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Calendar style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">5. TIMELINE & MILESTONES</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">Execution according to agreed milestone deadlines.</p>
                  </div>
                  <div className="col-span-7 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-0.5 font-mono text-neutral-800">
                    <p><strong className="text-neutral-600 font-bold">Start Date:</strong> {formatDate(startDate)}</p>
                    <p><strong className="text-neutral-600 font-bold">Estimated Completion:</strong> {formatDate(deliveryDate)}</p>
                    <p><strong className="text-neutral-600 font-bold">Duration:</strong> {durationDays} Days</p>
                  </div>
                </div>
              </div>

              {/* Section 6: Payment Terms */}
              <div className="p-3 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IndianRupee style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">6. PAYMENT TERMS</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{paymentSchedule}</p>
                  </div>
                  <div className="col-span-7 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs space-y-0.5 font-mono text-neutral-800">
                    <p><strong className="text-neutral-600 font-bold">Total Project Fee:</strong> <span className="font-extrabold text-neutral-900">{formatCurrency(totalAmount, currencySymbol)}</span></p>
                    <p><strong className="text-neutral-600 font-bold">Advance Deposit (50%):</strong> {formatCurrency(advanceAmount, currencySymbol)}</p>
                    <p><strong className="text-neutral-600 font-bold">Balance Handover (50%):</strong> {formatCurrency(balanceAmount, currencySymbol)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 1 Full-Width Black Footer Bar */}
          <div>
            <div className="px-10 pt-3 pb-2 flex justify-between items-center text-xs text-neutral-500 font-mono border-t border-neutral-100 bg-white">
              <span>SevenX Labs • Ref #{formattedAgrNumber}</span>
              <span>Page 1 of 2</span>
            </div>

            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: 600 }}>
              <span>Made with SevenX Labs</span>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {showPage2 && (
        <div className="relative w-full h-[297mm] flex flex-col justify-between pt-8 pb-0 overflow-hidden">
          <div>
            {/* Minimal Top Header for Page 2 */}
            <div className="px-10 pb-4 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-900 text-sm uppercase">SevenX Labs</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">IT Development Agreement</span>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{formattedAgrNumber}</span>
            </div>

            {/* Sections 7, 8, 9, 10 on Page 2 */}
            <div className="px-10 mt-6 space-y-4">
              {/* Section 7: Intellectual Property & Ownership */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Code style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">7. INTELLECTUAL PROPERTY & OWNERSHIP</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium">{ipClause}</p>
                </div>
              </div>

              {/* Section 8: Deliverables & Code Handover */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FileCheck style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">8. DELIVERABLES & CODE HANDOVER</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium whitespace-pre-line">{deliverables}</p>
                </div>
              </div>

              {/* Section 9: Confidentiality & Data Security */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Lock style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">9. CONFIDENTIALITY & DATA SECURITY</h4>
                  <p className="text-xs text-neutral-800 leading-relaxed font-medium">{confidentialityClause}</p>
                </div>
              </div>

              {/* Section 10: Warranty, Support & Revision Policy */}
              <div className="p-4 rounded-2xl bg-white border border-neutral-200" style={{ display: "flex", alignItems: "flex-start", gap: "12px", breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full ${accentBadgeBg}`} style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck style={{ width: "16px", height: "16px", display: "block" }} />
                </div>
                <div className="flex-1 space-y-1 text-xs">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider mb-1">10. WARRANTY, SUPPORT & REVISION POLICY</h4>
                  <p><strong className="text-neutral-900 font-bold">• Warranty Support:</strong> {warrantyPeriod}</p>
                  <p><strong className="text-neutral-900 font-bold">• Revision Policy:</strong> {revisionPolicy}</p>
                  <p><strong className="text-neutral-900 font-bold">• Termination & Refunds:</strong> {cancellationPolicy}</p>
                </div>
              </div>
            </div>

            {/* Signatures Section */}
            <div className="px-10 mt-8" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <div>
                  <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">AUTHORIZED SIGNATURE:</p>
                  <div className="py-2 border-b border-neutral-300">
                    <span className="font-signature text-3xl font-extrabold text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2">
                      shode
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">CLIENT SIGNATURE:</p>
                  <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-1 font-bold text-xs">{clientSignatory}</p>
                  <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page 2 Full-Width Black Footer Bar */}
          <div>
            <div className="px-10 pt-3 pb-2 flex justify-between items-center text-xs text-neutral-500 font-mono border-t border-neutral-100 bg-white">
              <span>SevenX Labs • Ref #{formattedAgrNumber}</span>
              <span>Page 2 of 2</span>
            </div>

            {/* Full-Width Black Footer Bar */}
            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 z-20" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: 600 }}>
              <span>Made with SevenX Labs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
