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
  activePage?: number;
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
  receivingName?: string;
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
  
  receivingName = "",
  receivingCompany = "",
  receivingAddress = "",
  receivingEmail = "",
  receivingPhone = "",
  receivingWebsite = "",
  
  purpose = "",
  confidentialItems = "",
  obligations = "",
  exclusions = "",
  permittedDisclosure = "",
  termDuration = "",
  returnTerm = "",
  ipClause = "",
  dataProtection = "",
  limitationOfLiability = "",
  breachRemedies = "",
  terminationClause = "",
  entireAgreement = "",
  additionalTerms = "",
  
  disclosingSignatory = "Sahil Hode",
  disclosingDesignation = "Founder & Lead Developer",
  receivingSignatory = "",
  receivingDesignation = "",
  
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
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pb-8 page-break-after-always" style={{ breakAfter: "page" }}>
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
                    MUTUAL AGREEMENT
                  </span>
                  <h2 className="text-base font-black text-neutral-900 tracking-tight leading-snug">
                    NON-DISCLOSURE AGREEMENT
                  </h2>
                </div>
              </div>

              {/* Top Right Black Header Panel */}
              <div className="relative w-[55%] bg-[#0a0a0a] text-white pt-6 pb-5 px-7 rounded-bl-[40px] shadow-xl flex flex-col justify-between min-h-[165px] overflow-hidden">
                <div className="relative z-10 pr-12">
                  <h1 className="text-3xl font-black tracking-wider uppercase text-white mb-2.5">
                    NDA
                  </h1>
                  
                  {/* Metadata 2-Column Grid */}
                  <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-2.5">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans uppercase">Agreement No.</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{ndaNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-sans uppercase">Effective Date</span>
                      <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Geometric Accent Triangles */}
                <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none z-20">
                  <svg width="75" height="75" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="30,20 100,50 40,90" fill={accentShape} opacity="0.95" />
                    <polygon points="60,30 100,60 70,85" fill={accentShape} opacity="0.65" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Intro Paragraph */}
            <div className="px-10 mt-2.5 text-[11.5px] text-neutral-800 font-medium leading-relaxed">
              <p>
                This Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into on{" "}
                <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;) by and between the Disclosing Party and Receiving Party listed below to safeguard proprietary project information and assets.
              </p>
            </div>

            {/* Section 1 & 2: Parties Pill Header & 2-Column Grid */}
            <div className="px-10 mt-2.5" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="bg-[#0a0a0a] text-white rounded-full py-1.5 px-6 flex justify-between items-center text-[11px] font-black uppercase tracking-wider mb-1.5 shadow-md">
                <span className="w-1/2 text-left pl-2">1. DISCLOSING PARTY</span>
                <span className="w-1/2 text-left pl-4">2. RECEIVING PARTY</span>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200 text-xs">
                {/* Disclosing Party */}
                <div className="space-y-0.5 pr-3 border-r border-neutral-200">
                  <h3 className="text-xs font-black text-neutral-900">{disclosingCompany || disclosingName || "SevenX Labs"}</h3>
                  <p className="text-neutral-700 font-medium text-[11px]">{disclosingAddress || "Thane, Mumbai, Maharashtra"}</p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Rep:</strong> {disclosingName || "Sahil Hode"}</p>
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {disclosingPhone || "-"}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {disclosingEmail || "-"}</p>
                  </div>
                </div>

                {/* Receiving Party */}
                <div className="space-y-0.5 pl-3">
                  <h3 className="text-xs font-black text-neutral-900">
                    {receivingName || <span className="text-neutral-400 italic font-normal">[ Receiving Party Name ]</span>}
                  </h3>
                  {receivingCompany && <p className="text-neutral-800 font-bold text-[11px]">{receivingCompany}</p>}
                  <p className="text-neutral-700 font-medium text-[11px]">
                    {receivingAddress || <span className="text-neutral-400 italic font-normal">[ Receiving Address ]</span>}
                  </p>
                  <div className="pt-0.5 space-y-0.5 text-[11px]">
                    <p><strong className="text-neutral-600 font-bold">Phone:</strong> {receivingPhone || "-"}</p>
                    <p><strong className="text-neutral-600 font-bold">Email:</strong> {receivingEmail || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Page 1 Clauses: Sections 3 - 10 */}
            <div className="px-10 mt-2.5 space-y-2">
              {/* Section 3 & 4 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">3. PURPOSE OF DISCLOSURE</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {purpose || <span className="text-neutral-400 italic font-normal">[ Purpose of disclosure... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">4. DEFINITION OF CONFIDENTIAL INFO</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {confidentialItems || <span className="text-neutral-400 italic font-normal">[ Definition of confidential info... ]</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5 & 6 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">5. OBLIGATIONS OF RECEIVING PARTY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {obligations || <span className="text-neutral-400 italic font-normal">[ Obligations of receiving party... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">6. EXCLUSIONS FROM CONFIDENTIALITY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {exclusions || <span className="text-neutral-400 italic font-normal">[ Exclusions clause... ]</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 7 & 8 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">7. PERMITTED DISCLOSURES</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {permittedDisclosure || <span className="text-neutral-400 italic font-normal">[ Permitted disclosures... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">8. TERM & SURVIVAL DURATION</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {termDuration || <span className="text-neutral-400 italic font-normal">[ Term & survival duration... ]</span>}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* PAGE 2 */}
      {showPage2 && (
        <div data-page="true" className="relative w-full min-h-[297mm] flex flex-col justify-between pt-7 pb-8">
          <div>
            {/* Minimal Top Header */}
            <div className="px-10 pb-3 border-b border-neutral-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-black text-neutral-900 text-xs uppercase tracking-wider">SevenX Labs</span>
                <span className="text-neutral-300">•</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">Non-Disclosure Agreement</span>
              </div>
              <span className="font-mono text-xs text-neutral-500 font-bold">Ref #{ndaNumber} | Page 2 of 2</span>
            </div>

            {/* Page 2 Clauses: Sections 9 - 16 */}
            <div className="px-10 mt-3 space-y-2.5">
              {/* Section 9 & 10 */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">9. RETURN OF MATERIALS</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {returnTerm || <span className="text-neutral-400 italic font-normal">[ Return of materials clause... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-2xl bg-white border border-neutral-200" style={{ breakInside: "avoid" }}>
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Key className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-wider">10. INTELLECTUAL PROPERTY</h4>
                    <p className="text-[11px] text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {ipClause || <span className="text-neutral-400 italic font-normal">[ Intellectual property ownership... ]</span>}
                    </p>
                  </div>
                </div>
              </div>
              {/* Section 11 & 12 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">11. DATA PROTECTION & SECURITY</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {dataProtection || <span className="text-neutral-400 italic font-normal">[ Data protection terms... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">12. LIMITATION OF LIABILITY</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {limitationOfLiability || <span className="text-neutral-400 italic font-normal">[ Limitation of liability... ]</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 13 & 14 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Gavel className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">13. INJUNCTIVE RELIEF & REMEDIES</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {breachRemedies || <span className="text-neutral-400 italic font-normal">[ Injunctive relief terms... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <Handshake className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">14. TERMINATION OF AGREEMENT</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {terminationClause || <span className="text-neutral-400 italic font-normal">[ Termination clause... ]</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 15 & 16 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">15. ENTIRE AGREEMENT & CLAUSES</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {entireAgreement || <span className="text-neutral-400 italic font-normal">[ Entire agreement clause... ]</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-neutral-200">
                  <div className={`p-2 rounded-full shrink-0 ${accentBadgeBg}`}>
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">16. ADDITIONAL CONDITIONS</h4>
                    <p className="text-xs text-neutral-800 mt-0.5 leading-relaxed font-medium whitespace-pre-line">
                      {additionalTerms || <span className="text-neutral-400 italic font-normal">[ Additional conditions... ]</span>}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures Section */}
            <div className="px-10 mt-5" style={{ breakInside: "avoid", pageBreakInside: "avoid" }}>
              <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div>
                  <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">DISCLOSING PARTY SIGNATURE:</p>
                  <div className="py-1.5 border-b border-neutral-300">
                    <span
                      className="font-signature text-3xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                      style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                    >
                      shode
                    </span>
                  </div>
                  <p className="text-xs text-neutral-900 font-bold mt-1.5">{disclosingSignatory || disclosingCompany || disclosingName}</p>
                  <p className="text-[11px] text-neutral-500 font-medium">{disclosingDesignation}</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Date: {formatDate(effectiveDate)}</p>
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">RECEIVING PARTY SIGNATURE:</p>
                  <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-2 font-bold text-xs">
                    {receivingSignatory || <span className="text-neutral-400 italic font-normal">[ Receiving Signatory ]</span>}
                  </p>
                  <p className="text-xs text-neutral-900 font-bold mt-1.5">
                    {receivingCompany || receivingName || <span className="text-neutral-400 italic font-normal">[ Receiving Company ]</span>}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium">{receivingDesignation}</p>
                  <p className="text-[11px] text-neutral-400 font-medium">Date: {formatDate(effectiveDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
