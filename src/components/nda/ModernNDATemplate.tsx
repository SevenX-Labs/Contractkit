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
  Shield,
  FileText,
  Building,
  UserCheck,
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
  
  // 20 NDA Clauses & Terms
  purpose?: string;
  confidentialItems?: string;
  obligations?: string;
  exclusions?: string;
  permittedDisclosure?: string;
  termDuration?: string;
  returnTerm?: string;
  ipClause?: string;
  nonSolicitation?: string;
  dataProtection?: string;
  limitationOfLiability?: string;
  breachRemedies?: string;
  terminationClause?: string;
  governingLaw?: string;
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
  version = "1.0",
  
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
  
  purpose = "Evaluating business partnership, custom software development requirements, and technical API integrations.",
  confidentialItems = "Source Code, Database Schemas, REST APIs, UI/UX Wireframes, Business Logic, Customer Data, Financial Information, Trade Secrets, and Proprietary Algorithms.",
  obligations = "Maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying or reverse engineering, and restrict access solely to authorized personnel with a need-to-know.",
  exclusions = "Information that is already public, previously known without restriction, received legally from a third party, or independently developed without reference to Confidential Information.",
  permittedDisclosure = "Disclosures required by law, court subpoena, regulatory government request, or to professional legal/financial advisors bound by confidentiality duties.",
  termDuration = "Agreement remains effective for 3 years from Effective Date; confidentiality obligations survive for 5 years post-termination.",
  returnTerm = "Upon written notice, Receiving Party shall immediately return or permanently destroy all digital files, backups, and physical documents.",
  ipClause = "All intellectual property rights, trade secrets, and ownership remain strictly with Disclosing Party. No license or transfer is granted.",
  nonSolicitation = "Neither party shall solicit, recruit, hire, or poach employees or contractors of the other party during the term and 12 months thereafter.",
  dataProtection = "Employ industry-standard AES-256 encryption, secure cloud storage, strict credential access control, and robust cyber security protocols.",
  limitationOfLiability = "Neither party shall be liable for indirect, incidental, punitive, or consequential damages. Maximum aggregate liability is limited to actual direct damages.",
  breachRemedies = "Immediate injunctive relief without posting bond, monetary damages, legal fee reimbursement, and prompt notice of any actual or suspected breach.",
  terminationClause = "Either party may terminate this agreement upon 14 calendar days written notice. Survival clauses remain binding post-termination.",
  governingLaw = "Governed by the laws of India, with exclusive legal jurisdiction in the courts of Mumbai, Maharashtra.",
  entireAgreement = "This Agreement contains the complete and exclusive understanding between parties, superseding all prior oral or written agreements.",
  additionalTerms = "Special conditions: Confidentiality duties extend to all affiliated subsidiaries and third-party contractor audit trails.",
  
  disclosingSignatory = "Sahil Hode",
  disclosingDesignation = "Founder & CEO (SevenX Labs)",
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
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                    NON-DISCLOSURE AGREEMENT
                  </span>
                  <h2 className="text-lg font-black text-neutral-900 tracking-tight leading-snug">
                    MUTUAL CONFIDENTIALITY AGREEMENT (NDA)
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel */}
              <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[180px]">
                <div className="relative z-10">
                  <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-4">
                    NDA
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-sans">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{ndaNumber}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-sans">Effective Date</span>
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
            <div className="px-10 mt-3.5 text-xs text-neutral-800 font-medium leading-relaxed">
              <p>
                This Mutual Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;) by and between the Disclosing Party and Receiving Party listed below to protect proprietary business and technical assets.
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
                  <p className="text-neutral-700 font-medium text-[11px]">{disclosingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Rep:</strong> {disclosingName}</p>
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {disclosingPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {disclosingEmail}</p>
                  </div>
                </div>

                {/* Receiving Party */}
                <div className="space-y-1 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">{receivingName}</h3>
                  {receivingCompany && <p className="text-neutral-800 font-bold text-[11px]">{receivingCompany}</p>}
                  <p className="text-neutral-700 font-medium text-[11px]">{receivingAddress}</p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {receivingPhone}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {receivingEmail}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Clauses: Sections 3 - 12 (Legible Typography) */}
            <div className="px-10 mt-3 space-y-3">
              {/* Section 3 & 4 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">3. PURPOSE OF DISCLOSURE</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{purpose}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">4. DEFINITION OF CONFIDENTIAL INFO</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{confidentialItems}</p>
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
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">5. OBLIGATIONS OF RECEIVING PARTY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{obligations}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">6. EXCLUSIONS FROM CONFIDENTIALITY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{exclusions}</p>
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
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">7. PERMITTED DISCLOSURES</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{permittedDisclosure}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">8. TERM & SURVIVAL PERIOD</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{termDuration}</p>
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
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">9. RETURN OR DESTRUCTION OF DATA</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{returnTerm}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">10. INTELLECTUAL PROPERTY RIGHTS</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{ipClause}</p>
                  </div>
                </div>
              </div>

              {/* Section 11 & 12 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">11. NON-SOLICITATION CLAUSE</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{nonSolicitation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2.5 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">12. DATA PROTECTION & SECURITY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium">{dataProtection}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page 1 Footer Bar */}
          <div>
            <div className="px-10 py-1 flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>SevenX Labs • Ref #{ndaNumber}</span>
              <span>Page 1 of 2</span>
            </div>

            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingPhone || "8652601566"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingEmail || "sevenxlabs07@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingAddress || "Thane, Mumbai, Maharashtra"}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {showPage2 && (
        <div className="relative w-full min-h-[297mm] flex flex-col justify-between pt-10 pb-0">
          <div className="px-10 space-y-4">
            {/* Section 13 & 14 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">13. LIMITATION OF LIABILITY</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{limitationOfLiability}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Gavel className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">14. BREACH & LEGAL REMEDIES</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{breachRemedies}</p>
                </div>
              </div>
            </div>

            {/* Section 15 & 16 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">15. TERMINATION CONDITIONS</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{terminationClause}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">16. GOVERNING LAW & JURISDICTION</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{governingLaw}</p>
                </div>
              </div>
            </div>

            {/* Section 17 & 18 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">17. ENTIRE AGREEMENT & CLAUSES</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{entireAgreement}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">18. ADDITIONAL TERMS & CONDITIONS</h4>
                  <p className="text-[11px] text-neutral-800 mt-1 leading-relaxed font-medium">{additionalTerms}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pinned Digital Signatures Block & Footer Bar on Page 2 */}
          <div className="mt-auto">
            {/* Section 19 & 20: Digital Signatures Block Pinned at Bottom */}
            <div className="px-10 pb-5 pt-4 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs bg-white" style={{ breakInside: "avoid" }}>
              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-xs tracking-wider mb-1">19. DISCLOSING PARTY SIGNATURE</p>
                <p className="font-bold text-neutral-900 text-xs">{disclosingCompany || disclosingName}</p>
                <p className="font-mono text-neutral-800 border-b border-neutral-300 pb-1 mt-4 font-bold text-xs">{disclosingSignatory}</p>
                <p className="text-[11px] text-neutral-600 font-medium">{disclosingDesignation}</p>
                <p className="text-xs text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>

              <div>
                <p className="font-extrabold text-[#a6ce39] uppercase text-xs tracking-wider mb-1">20. RECEIVING PARTY SIGNATURE</p>
                <p className="font-bold text-neutral-900 text-xs">{receivingCompany || receivingName}</p>
                <p className="font-mono text-neutral-800 border-b border-neutral-300 pb-1 mt-4 font-bold text-xs">{receivingSignatory}</p>
                <p className="text-[11px] text-neutral-600 font-medium">{receivingDesignation}</p>
                <p className="text-xs text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
              </div>
            </div>

            <div className="px-10 py-1 flex justify-between items-center text-xs text-neutral-400 font-mono">
              <span>SevenX Labs • Ref #{ndaNumber}</span>
              <span>Page 2 of 2</span>
            </div>

            {/* Full-Width Black Footer Bar */}
            <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingPhone || "8652601566"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingEmail || "sevenxlabs07@gmail.com"}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-white shrink-0" />
                <span>{disclosingAddress || "Thane, Mumbai, Maharashtra"}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
