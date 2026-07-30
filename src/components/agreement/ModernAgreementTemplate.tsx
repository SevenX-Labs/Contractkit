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
  projectType?: string;
  techStack?: string;
  platforms?: string;
  includedScope?: string;

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
        <div className="relative w-full min-h-[297mm] flex flex-col justify-between pb-0 page-break-after-always" style={{ breakAfter: "page" }}>
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
              <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[180px]">
                <div className="relative z-10">
                  <h1 className="text-4xl font-black tracking-wider uppercase text-white mb-4">
                    AGREEMENT
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                    <div>
                      <span className="text-xs text-neutral-400 block font-sans">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{agreementNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block font-sans">Effective Date</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
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
            <div className="px-10 mt-4 text-xs text-neutral-800 font-medium leading-relaxed">
              <p>
                This IT Development Agreement (&quot;Agreement&quot;) is made and entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;), by and between the parties mentioned below.
              </p>
            </div>

            {/* Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-4" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="bg-[#0a0a0a] text-white rounded-full py-2.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
                <span className="w-1/2 text-left pl-2">1. SERVICE PROVIDER</span>
                <span className="w-1/2 text-left pl-4">2. CLIENT</span>
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
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Briefcase className="w-4 h-4" />
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
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Target className="w-4 h-4" />
                </div>
                <div className="flex-1 grid grid-cols-12 gap-3">
                  <div className="col-span-5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">4. SCOPE OF WORK</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">Full lifecycle engineering & code delivery as specified.</p>
                  </div>
                  <div className="col-span-7 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 text-xs whitespace-pre-line font-mono text-neutral-800 leading-normal">
                    {includedScope}
                  </div>
                </div>
              </div>

              {/* Section 5: Timeline & Milestones */}
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Calendar className="w-4 h-4" />
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
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
                <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <IndianRupee className="w-4 h-4" />
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
            <div className="px-10 py-1 flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>SevenX Labs • Ref #{agreementNumber}</span>
              <span>Page 1 of 2</span>
            </div>

            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{providerPhone || "8652601566"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>{providerEmail || "sevenxlabs07@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>{providerAddress || "Thane, Mumbai, Maharashtra"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {showPage2 && (
        <div className="relative w-full min-h-[297mm] flex flex-col justify-between pt-10 pb-0">
          <div className="px-10 space-y-4">
            {/* Section 7: Intellectual Property Rights */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">7. INTELLECTUAL PROPERTY & OWNERSHIP</h4>
                <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{ipClause}</p>
              </div>
            </div>

            {/* Section 8: Deliverables & Code Handover */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                <Code className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">8. DELIVERABLES & CODE HANDOVER</h4>
                <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium whitespace-pre-line">{deliverables}</p>
              </div>
            </div>

            {/* Section 9: Confidentiality & Non-Disclosure */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                <Lock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">9. CONFIDENTIALITY & DATA SECURITY</h4>
                <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{confidentialityClause}</p>
              </div>
            </div>

            {/* Section 10: Warranty, Support & Revision Policy */}
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">10. WARRANTY, SUPPORT & REVISION POLICY</h4>
                <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">
                  • <strong>Warranty Support:</strong> {warrantyPeriod}
                  <br />
                  • <strong>Revision Policy:</strong> {revisionPolicy}
                  <br />
                  • <strong>Termination & Refunds:</strong> {cancellationPolicy}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Pinned Digital Signatures Block & Footer on Page 2 End */}
          <div className="mt-auto">
            {/* Section 11: Digital Signatures Block Pinned at the Very End */}
            <div className="px-10 pb-6 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs bg-white" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div>
                <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">DEVELOPER SIGNATURE:</p>
                <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-1 font-bold text-xs">{providerSignatory}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>
              <div>
                <p className="font-extrabold text-neutral-900 uppercase text-xs tracking-wider mb-2">CLIENT SIGNATURE:</p>
                <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-1 font-bold text-xs">{clientSignatory}</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>
            </div>

            <div className="px-10 py-1 flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>SevenX Labs • Ref #{agreementNumber}</span>
              <span>Page 2 of 2</span>
            </div>

            {/* Full-Width Black Footer Bar */}
            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{providerPhone || "8652601566"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>{providerEmail || "sevenxlabs07@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>{providerAddress || "Thane, Mumbai, Maharashtra"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
