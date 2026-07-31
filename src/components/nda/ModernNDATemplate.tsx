"use client";

import React from "react";
import { formatDate } from "../../lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Lock,
  ShieldCheck,
  Clock,
  FileCheck,
  Gavel,
  AlertTriangle,
  Handshake,
  Key,
  Shield,
  FileText,
  CheckCircle,
  XCircle,
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
  disclosingWebsite?: string;
  
  // Receiving Party Details
  receivingName: string;
  receivingCompany?: string;
  receivingAddress?: string;
  receivingEmail?: string;
  receivingPhone?: string;
  receivingWebsite?: string;
  
  // Generic Freelancer NDA Clauses & Terms
  purpose?: string;
  confidentialItems?: string;
  obligations?: string;
  exclusions?: string;
  permittedDisclosure?: string;
  termDuration?: string;
  returnTerm?: string;
  ipClause?: string;
  dataProtection?: string;
  limitationOfLiability?: string;
  breachRemedies?: string;
  terminationClause?: string;
  entireAgreement?: string;
  additionalTerms?: string;
  
  // Signatures
  disclosingSignatory?: string;
  disclosingDesignation?: string;
  receivingSignatory?: string;
  receivingDesignation?: string;
  
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernNDATemplate({
  id = "nda-pdf-preview",
  activePage,
  ndaNumber = "SXL-NDA-2026-000001",
  effectiveDate = new Date().toISOString().split("T")[0],
  
  disclosingName = "Sahil Hode",
  disclosingCompany = "SevenX Labs",
  disclosingAddress = "Thane, Mumbai, Maharashtra",
  disclosingEmail = "sevenxlabs07@gmail.com",
  disclosingPhone = "8652601566",
  disclosingWebsite = "www.sevenxlabs.com",
  
  receivingName = "Sophia Smith",
  receivingCompany = "Smith Innovations Private Limited",
  receivingAddress = "742 Evergreen Terrace, Springfield, IL 62704, USA",
  receivingEmail = "sophia@smithinnovations.com",
  receivingPhone = "+1 234 567 8900",
  receivingWebsite = "www.smithinnovations.com",
  
  purpose = "Evaluating business partnership, freelance design/development services, custom software engineering, and technical project requirements.",
  confidentialItems = "Source Code, Database Schemas, REST APIs, UI/UX Wireframes, Business Logic, Customer Data, Financial Information, Credentials, and Project Specifications.",
  obligations = "Maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying or distributing confidential materials, and restrict access solely to project personnel.",
  exclusions = "Information that is already public, previously known without restriction, received legally from a third party, or independently developed without reference to Confidential Information.",
  permittedDisclosure = "Disclosures approved in writing by the disclosing party, required by legal process, or made to professional legal/financial advisors bound by confidentiality.",
  termDuration = "Agreement remains effective during project collaboration; confidentiality obligations survive for 3 years post-termination.",
  returnTerm = "Upon written request, Receiving Party shall immediately return or permanently delete all digital files, project backups, and physical documents.",
  ipClause = "All pre-existing intellectual property, project assets, and custom deliverables remain strictly owned by the respective owner. No transfer or license is implied unless agreed separately.",
  dataProtection = "Employ reasonable security measures, password protection, secure storage, and strict credential access controls for all shared materials.",
  limitationOfLiability = "Neither party shall be liable for indirect, incidental, or consequential damages. Liability is limited to direct actual damages arising from project scope.",
  breachRemedies = "Prompt written notice of any actual or suspected breach, right to seek immediate injunctive relief, and recovery of reasonable legal expenses.",
  terminationClause = "Either party may terminate this agreement upon written notice. Confidentiality and non-disclosure duties survive project termination.",
  entireAgreement = "This Agreement represents the complete understanding between parties regarding confidentiality, superseding all prior oral or written discussions.",
  additionalTerms = "Special Conditions: Custom project clauses, remote work protocols, and communication guidelines agreed upon by both parties.",
  
  disclosingSignatory = "Sahil Hode",
  disclosingDesignation = "Founder & Lead Developer",
  receivingSignatory = "Sophia Smith",
  receivingDesignation = "Managing Director",
  
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
  const showPage2 = activePage === undefined || activePage === 2;

  return (
    <div
      id={id}
      className="relative w-[210mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* PAGE 1 */}
      {showPage1 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pb-0 page-break-after-always" style={{ breakAfter: "page" }}>
          <div>
            {/* Top Header Row with Black Curved Block on Right */}
            <div className="flex justify-between items-start w-full relative">
              {/* Top Left Branding & Document Title */}
              <div className="pt-8 pl-10 pr-4 max-w-sm">
                <div className="flex flex-col items-start gap-1 mb-3">
                  <Image
                    src="/logo.png"
                    alt="SevenX Labs"
                    width={200}
                    height={60}
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
                    NON-DISCLOSURE AGREEMENT
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-snug">
                    MUTUAL FREELANCE CONFIDENTIALITY AGREEMENT (NDA)
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel with Curved Bottom-Left Edge */}
              <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[180px] overflow-hidden">
                <div className="relative z-10">
                  <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-4">
                    NDA
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                    <div>
                      <span className="text-xs text-neutral-400 block font-sans">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{ndaNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-neutral-400 block font-sans">Effective Date</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Geometric Accent Triangles strictly contained within black panel */}
                <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none z-20">
                  <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="30,20 100,50 40,90" fill={accentShape} opacity="0.95" />
                    <polygon points="60,30 100,60 70,85" fill={accentShape} opacity="0.65" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="px-10 mt-4 text-xs text-neutral-800 font-medium leading-relaxed">
              <p>
                This Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;) by and between the Disclosing Party and Receiving Party listed below to safeguard proprietary project information and assets.
              </p>
            </div>

            {/* Section 1 & 2: Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-3" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="bg-[#0a0a0a] text-white rounded-full py-2 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
                <span className="w-1/2 text-left pl-2">1. DISCLOSING PARTY</span>
                <span className="w-1/2 text-left pl-4">2. RECEIVING PARTY</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-xs">
                {/* Disclosing Party */}
                <div className="space-y-1 pr-3 border-r border-neutral-200">
                  <h3 className="text-xs font-black text-neutral-900">{disclosingCompany || disclosingName}</h3>
                  <p className="text-neutral-700 font-medium text-xs">{disclosingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-xs">
                    <p><strong className="text-neutral-600 font-bold">Rep:</strong> {disclosingName}</p>
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {disclosingPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {disclosingEmail}</p>
                  </div>
                </div>

                {/* Receiving Party */}
                <div className="space-y-1 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">{receivingName}</h3>
                  {receivingCompany && <p className="text-neutral-800 font-bold text-xs">{receivingCompany}</p>}
                  <p className="text-neutral-700 font-medium text-xs">{receivingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-xs">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {receivingPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {receivingEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Clauses: Sections 3 - 10 */}
            <div className="px-10 mt-3 space-y-3">
              {/* Section 3 & 4 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">3. PURPOSE OF DISCLOSURE</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{purpose}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">4. DEFINITION OF CONFIDENTIAL INFO</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{confidentialItems}</p>
                  </div>
                </div>
              </div>

              {/* Section 5 & 6 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">5. OBLIGATIONS OF RECEIVING PARTY</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{obligations}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">6. EXCLUSIONS FROM CONFIDENTIALITY</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{exclusions}</p>
                  </div>
                </div>
              </div>

              {/* Section 7 & 8 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">7. PERMITTED DISCLOSURES</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{permittedDisclosure}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">8. TERM & SURVIVAL DURATION</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{termDuration}</p>
                  </div>
                </div>
              </div>

              {/* Section 9 & 10 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">9. RETURN OR DESTRUCTION OF DATA</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{returnTerm}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">10. INTELLECTUAL PROPERTY RIGHTS</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium">{ipClause}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 1 Footer Bar */}
          <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-center items-center text-xs font-semibold z-20">
            <span>Made with SevenX Labs</span>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {showPage2 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pt-10 pb-0">
          <div className="px-10 space-y-4">
            {/* Section 11 & 12 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">11. DATA PROTECTION & SECURITY</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{dataProtection}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">12. LIMITATION OF LIABILITY</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{limitationOfLiability}</p>
                </div>
              </div>
            </div>

            {/* Section 13 & 14 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">13. BREACH & LEGAL REMEDIES</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{breachRemedies}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">14. TERMINATION CONDITIONS</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{terminationClause}</p>
                </div>
              </div>
            </div>

            {/* Section 15 & 16 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">15. ENTIRE AGREEMENT</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{entireAgreement}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">16. ADDITIONAL SPECIAL TERMS</h4>
                  <p className="text-xs text-neutral-800 mt-1 leading-relaxed font-medium">{additionalTerms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pinned Digital Signatures Block & Footer Bar on Page 2 */}
          <div className="mt-auto">
            {/* Section 17 & 18: Digital Signatures Block Pinned at Bottom */}
            <div className="px-10 pb-5 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs bg-white" style={{ breakInside: "avoid" }}>
              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-xs tracking-wider mb-1">17. AUTHORIZED SIGNATURE</p>
                <p className="font-bold text-neutral-900 text-xs">{disclosingCompany || disclosingName}</p>
                <div className="h-9 flex items-center mt-2 mb-1">
                  <span className="font-signature text-3xl font-extrabold text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2">
                    shode
                  </span>
                </div>
                <p className="text-xs text-neutral-600 font-medium">{disclosingDesignation}</p>
                <p className="text-xs text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>

              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-xs tracking-wider mb-1">18. RECEIVING PARTY SIGNATURE</p>
                <p className="font-bold text-neutral-900 text-xs">{receivingCompany || receivingName}</p>
                <p className="font-mono text-neutral-800 border-b border-neutral-300 pb-1 mt-4 font-bold text-xs">{receivingSignatory}</p>
                <p className="text-xs text-neutral-600 font-medium">{receivingDesignation}</p>
                <p className="text-xs text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>
            </div>

            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-center items-center text-xs font-semibold z-20">
              <span>Made with SevenX Labs</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
