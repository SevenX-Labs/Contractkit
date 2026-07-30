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
  Shield,
  FileCheck,
  Code,
  Layers,
  Clock,
  RefreshCw,
  HelpCircle,
  Award,
  Server,
  Cpu,
  Key,
  Lock,
  Zap,
  AlertOctagon,
  FileText,
  CheckSquare,
} from "lucide-react";
import Image from "next/image";

export interface AgreementTemplateProps {
  id?: string;
  agreementNumber: string;
  effectiveDate: string;
  expiryDate?: string;
  version?: string;
  
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
  
  // Project Details
  projectTitle?: string;
  projectDescription?: string;
  businessGoal?: string;
  projectType?: string;
  techStack?: string;
  platforms?: string;
  
  // Scope & Modules
  includedScope?: string;
  excludedScope?: string;
  deliverables?: string;
  
  // Timeline & Financials
  startDate?: string;
  deliveryDate?: string;
  durationDays?: number;
  totalAmount?: number;
  advanceAmount?: number;
  balanceAmount?: number;
  paymentSchedule?: string;
  
  // Clauses & Terms
  ipClause?: string;
  confidentialityClause?: string;
  warrantyPeriod?: string;
  revisionPolicy?: string;
  cancellationPolicy?: string;
  governingLaw?: string;
  jurisdiction?: string;
  
  // Signatures
  providerSignatory?: string;
  clientSignatory?: string;
  
  currencySymbol?: string;
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernAgreementTemplate({
  id = "agreement-pdf-preview",
  agreementNumber = "SXL-AGR-2026-000001",
  effectiveDate = new Date().toISOString().split("T")[0],
  expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  version = "1.0",
  
  providerName = "Sahil Hode",
  providerCompany = "SevenX Labs",
  providerAddress = "Thane, Mumbai, Maharashtra",
  providerEmail = "sevenxlabs07@gmail.com",
  providerPhone = "8652601566",
  providerGst = "27ABCDE1234F1Z5",
  providerPan = "ABCDE1234F",
  
  clientName = "Sophia Smith",
  clientCompany = "Smith Innovations Private Limited",
  clientAddress = "742 Evergreen Terrace, Springfield, IL 62704, USA",
  clientEmail = "sophia@smithinnovations.com",
  clientPhone = "+1 234 567 8900",
  clientGst = "63ABCDE1234F1Z5",
  clientPan = "ABCDF1234G",
  
  projectTitle = "IT DEVELOPMENT AGREEMENT",
  projectDescription = "End-to-end architecture, design, development, testing, and cloud deployment of custom web application and administrative dashboard.",
  businessGoal = "Automate client workflows, payment milestone tracking, and digital contract generation.",
  projectType = "Web Application & Admin Dashboard",
  techStack = "Next.js 16, React 19, Tailwind CSS v4, Prisma ORM, PostgreSQL",
  platforms = "Web, iOS, Android, Admin Dashboard",
  
  includedScope = "• Custom dashboard & authentication\n• REST APIs development & integration\n• PostgreSQL database & migrations\n• High-performance PDF/DOCX/PNG export engine",
  excludedScope = "• Third-party paid API subscription fees\n• Apple Developer & Google Play account registration fees",
  deliverables = "1. Production Source Code Repository\n2. Database Schemas & Migrations\n3. Technical System Architecture Documentation",
  
  startDate = new Date().toISOString().split("T")[0],
  deliveryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  durationDays = 30,
  totalAmount = 4500,
  advanceAmount = 2250,
  balanceAmount = 2250,
  paymentSchedule = "50% Advance deposit before kickoff; 50% Balance upon final deployment.",
  
  ipClause = "Full intellectual property rights and source code ownership shall be transferred to the Client upon 100% full payment receipt.",
  confidentialityClause = "Both parties agree to protect proprietary algorithms, source code, and commercial data under strict confidentiality for 2 years.",
  warrantyPeriod = "30 Days post-launch warranty bug fix support included.",
  revisionPolicy = "2 Free revision rounds included during active design phase.",
  cancellationPolicy = "7 Calendar days written notice required for termination.",
  governingLaw = "Laws of India",
  jurisdiction = "Mumbai, Maharashtra",
  
  providerSignatory = "Sahil Hode (Founder)",
  clientSignatory = "Sophia Smith (Managing Director)",
  
  currencySymbol = "₹",
  accentColor = "lime",
}: AgreementTemplateProps) {
  const accentBg =
    accentColor === "lime"
      ? "bg-[#c5e158]"
      : accentColor === "purple"
      ? "bg-purple-400"
      : accentColor === "pink"
      ? "bg-pink-400"
      : "bg-emerald-400";

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

  return (
    <div
      id={id}
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Page Content Container */}
      <div className="relative w-full pb-10">
        {/* Top Header Row with Black Block on Right */}
        <div className="flex justify-between items-start w-full relative">
          {/* Top Left Branding */}
          <div className="pt-10 pl-10 pr-4 max-w-sm">
            <div className="flex flex-col items-start gap-1 mb-2">
              <Image
                src="/logo.png"
                alt="SevenX Labs"
                width={220}
                height={70}
                className="h-14 w-auto object-contain"
                priority
              />
              <div className="flex items-center gap-1.5 mt-1 font-extrabold tracking-tight text-xl uppercase">
                <span className="text-neutral-900 font-black">SevenX</span>
                <span className="text-[#a6ce39] font-black">Labs</span>
              </div>
              <p className="text-[11px] italic font-medium text-neutral-400">Innovate. Create. Elevate.</p>
            </div>

            <div className="mt-6">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                AGREEMENT TO.
              </span>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-snug">
                {projectTitle}
              </h2>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-10 pb-8 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[200px]">
            <div className="relative z-10">
              <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-6">
                AGREEMENT
              </h1>
              
              {/* Metadata 3-Column Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium border-t border-neutral-800 pt-4">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Agreement No.</span>
                  <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{agreementNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Effective Date</span>
                  <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{formatDate(effectiveDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Expiry Date</span>
                  <span className="font-mono font-bold text-white text-[11px] block mt-0.5 whitespace-nowrap">{formatDate(expiryDate)}</span>
                </div>
              </div>
            </div>

            {/* Top Right Geometric Accent Triangles */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none z-20">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="20,10 90,50 30,90" fill={accentShape} opacity="0.95" />
                <polygon points="50,20 100,50 60,80" fill={accentShape} opacity="0.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* Intro Paragraph */}
        <div className="px-10 mt-6 text-xs text-neutral-700 font-medium leading-relaxed">
          <p>
            This IT Development Agreement (&quot;Agreement&quot;) is made and entered into on{" "}
            <strong className="text-neutral-900 font-bold">{formatDate(effectiveDate)}</strong> (&quot;Effective Date&quot;), by and between the parties mentioned below.
          </p>
        </div>

        {/* Parties Pill Header & 2-Column Grid */}
        <div className="px-10 mt-6">
          <div className="bg-[#0a0a0a] text-white rounded-full py-3 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-3 shadow-md">
            <span className="w-1/2 text-left pl-2">1. SERVICE PROVIDER</span>
            <span className="w-1/2 text-left pl-4">2. CLIENT</span>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-neutral-50/80 p-5 rounded-2xl border border-neutral-200/80 text-xs">
            {/* Service Provider */}
            <div className="space-y-1.5 pr-3 border-r border-neutral-200">
              <h3 className="text-sm font-black text-neutral-900">{providerCompany || providerName}</h3>
              <p className="text-neutral-600 font-medium text-[11px]">{providerAddress}</p>
              <div className="pt-1 space-y-1 text-[11px]">
                <p><strong className="text-neutral-500 font-medium">Phone:</strong> {providerPhone}</p>
                <p><strong className="text-neutral-500 font-medium">Email:</strong> {providerEmail}</p>
                <p><strong className="text-neutral-500 font-medium">GST No:</strong> {providerGst}</p>
                <p><strong className="text-neutral-500 font-medium">PAN No:</strong> {providerPan}</p>
              </div>
            </div>

            {/* Client */}
            <div className="space-y-1.5 pl-3">
              <h3 className="text-sm font-black text-neutral-900">{clientName}</h3>
              {clientCompany && <p className="text-neutral-700 font-bold text-[11px]">{clientCompany}</p>}
              <p className="text-neutral-600 font-medium text-[11px]">{clientAddress}</p>
              <div className="pt-1 space-y-1 text-[11px]">
                <p><strong className="text-neutral-500 font-medium">Phone:</strong> {clientPhone}</p>
                <p><strong className="text-neutral-500 font-medium">Email:</strong> {clientEmail}</p>
                <p><strong className="text-neutral-500 font-medium">GST No:</strong> {clientGst}</p>
                <p><strong className="text-neutral-500 font-medium">PAN No:</strong> {clientPan}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="px-10 mt-6 space-y-4">
          {/* Section 3: Project Overview */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">3. PROJECT OVERVIEW</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{projectDescription}</p>
              </div>
              <div className="col-span-7 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[11px] space-y-1 font-mono">
                <p><strong className="text-neutral-500">Project Type:</strong> {projectType}</p>
                <p><strong className="text-neutral-500">Tech Stack:</strong> {techStack}</p>
                <p><strong className="text-neutral-500">Platforms:</strong> {platforms}</p>
              </div>
            </div>
          </div>

          {/* Section 4: Scope of Work */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
              <Target className="w-5 h-5" />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">4. SCOPE OF WORK</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">Full lifecycle engineering & code delivery as specified.</p>
              </div>
              <div className="col-span-7 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[11px] whitespace-pre-line font-mono text-neutral-800">
                {includedScope}
              </div>
            </div>
          </div>

          {/* Section 5: Timeline & Milestones */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">5. TIMELINE & MILESTONES</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">Execution according to agreed milestone deadlines.</p>
              </div>
              <div className="col-span-7 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[11px] space-y-1 font-mono">
                <p><strong className="text-neutral-500">Project Start Date:</strong> {formatDate(startDate)}</p>
                <p><strong className="text-neutral-500">Estimated Delivery:</strong> {formatDate(deliveryDate)}</p>
                <p><strong className="text-neutral-500">Total Duration:</strong> {durationDays} Days</p>
              </div>
            </div>
          </div>

          {/* Section 6: Payment Terms */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
              <IndianRupee className="w-5 h-5" />
            </div>
            <div className="flex-1 grid grid-cols-12 gap-4">
              <div className="col-span-5">
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">6. PAYMENT TERMS</h4>
                <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">{paymentSchedule}</p>
              </div>
              <div className="col-span-7 bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-[11px] space-y-1 font-mono">
                <p><strong className="text-neutral-500">Total Project Fee:</strong> <span className="font-extrabold text-neutral-900">{formatCurrency(totalAmount, currencySymbol)}</span></p>
                <p><strong className="text-neutral-500">Advance Deposit (50%):</strong> {formatCurrency(advanceAmount, currencySymbol)}</p>
                <p><strong className="text-neutral-500">Balance Handover (50%):</strong> {formatCurrency(balanceAmount, currencySymbol)}</p>
              </div>
            </div>
          </div>

          {/* Section 7: Intellectual Property & Terms */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-xs">
            <div className={`p-3 rounded-full shrink-0 ${accentBadgeBg}`}>
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">7. INTELLECTUAL PROPERTY & GUARANTEE</h4>
              <p className="text-[11px] text-neutral-700 mt-1 leading-relaxed">{ipClause}</p>
            </div>
          </div>

          {/* Section 8: Digital Signatures */}
          <div className="pt-4 border-t border-neutral-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-extrabold text-neutral-900 uppercase text-[10px] tracking-wider mb-2">DEVELOPER SIGNATURE:</p>
              <p className="font-mono text-neutral-800 border-b border-neutral-300 pb-1">{providerSignatory}</p>
              <p className="text-[10px] text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
            </div>
            <div>
              <p className="font-extrabold text-neutral-900 uppercase text-[10px] tracking-wider mb-2">CLIENT SIGNATURE:</p>
              <p className="font-mono text-neutral-800 border-b border-neutral-300 pb-1">{clientSignatory}</p>
              <p className="text-[10px] text-neutral-400 mt-1">Date: {formatDate(effectiveDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Geometric Accent */}
      <div className="absolute bottom-10 -left-6 pointer-events-none z-0 opacity-40">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,90 70,50 10,0" fill={accentShape} />
        </svg>
      </div>

      {/* Full-Width Black Footer Bar */}
      <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-4 flex justify-between items-center text-xs font-semibold z-20">
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{providerPhone || "8652601566"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{providerEmail || "sevenxlabs07@gmail.com"}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{providerAddress || "Thane, Mumbai, Maharashtra"}</span>
        </div>
      </div>
    </div>
  );
}
