"use client";

import React from "react";
import { formatDate } from "../../lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Award,
  Calendar,
  FileText,
  User,
  Check,
} from "lucide-react";
import Image from "next/image";

export interface CertificateTemplateProps {
  id?: string;
  certificateNumber?: string;
  date?: string;

  // Client Details
  clientName?: string;
  clientAddress?: string;
  clientGstin?: string;

  // Statement & Project Metadata
  certificationStatement?: string;
  projectTitle?: string;
  serviceProvider?: string;
  startDate?: string;
  completionDate?: string;
  receiptNumber?: string;
  contractNumber?: string;

  // Scope & Deliverables
  scopeOfWork?: string;
  deliverables?: string[];

  // Confirmation Note
  confirmationNote?: string;

  // Signatures
  providerSignatory?: string;
  providerDesignation?: string;
  providerDate?: string;
  clientSignatory?: string;
  clientDesignation?: string;
  clientDate?: string;

  // Contact Info
  phone?: string;
  email?: string;
  website?: string;

  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernCertificateTemplate({
  id = "certificate-pdf-preview",
  certificateNumber = "SXL-CC-2026-000101",
  date = new Date().toISOString().split("T")[0],

  clientName = "ABC Pvt. Ltd.",
  clientAddress = "123, Business Park, Andheri East, Mumbai, Maharashtra - 400069",
  clientGstin = "27ABCDE5678G1Z6",

  certificationStatement = "This is to certify that the project described below has been successfully completed by SevenX Labs and delivered to the client as per the agreed scope, requirements, and terms of the contract.",
  projectTitle = "E-Commerce Website Development",
  serviceProvider = "SevenX Labs",
  startDate = "2026-03-15",
  completionDate = "2026-07-30",
  receiptNumber,
  contractNumber = "AGR-2026-015",

  scopeOfWork = "Design, development, testing, and deployment of a responsive e-commerce website with admin panel and integration of payment gateway.",
  deliverables = [
    "Responsive Website",
    "Admin Panel",
    "Payment Gateway Integration",
    "Database & APIs",
    "Source Code",
    "Documentation",
  ],

  confirmationNote = "We hereby confirm that the above project has been completed in all respects and the deliverables have been handed over to the client. The client has reviewed and accepted the work.",

  providerSignatory = "Sahil Hode",
  providerDesignation = "Founder & Lead",
  providerDate = new Date().toISOString().split("T")[0],
  clientSignatory = "Rahul Mehta",
  clientDesignation = "Director",
  clientDate = new Date().toISOString().split("T")[0],

  phone = "+91 98765 43210",
  email = "contact@sevenxlabs.com",
  website = "www.sevenxlabs.com",

  accentColor = "lime",
}: CertificateTemplateProps) {
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

  const accentText =
    accentColor === "lime"
      ? "text-[#a6ce39]"
      : accentColor === "purple"
      ? "text-purple-600"
      : accentColor === "pink"
      ? "text-pink-600"
      : "text-emerald-600";

  return (
    <div
      id={id}
      className="relative w-[210mm] h-[297mm] max-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      <div>
        {/* Top Header Row with Black Curved Block on Right */}
        <div className="flex justify-between items-start w-full relative">
          {/* Top Left Branding */}
          <div className="pt-6 pl-10 pr-4 max-w-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="flex items-center gap-1.5 font-black tracking-tight text-2xl uppercase">
                <span className="text-neutral-900">SevenX</span>
                <span className={accentText}>Labs</span>
              </div>
            </div>
            <p className="text-[11px] font-extrabold text-neutral-500 tracking-wider uppercase">
              Official Completion Certificate
            </p>
            <p className="text-xs font-semibold text-neutral-600 mt-0.5">
              Issued by SevenX Labs Studio • {phone}
            </p>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[52%] bg-[#0a0a0a] text-white pt-6 pb-5 px-8 rounded-bl-[40px] shadow-2xl flex flex-col justify-between min-h-[145px] overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col mb-3">
                <h1 className="text-3xl font-black tracking-wider uppercase text-white leading-none">
                  COMPLETION
                </h1>
                <h2 className={`text-xl font-black tracking-wider uppercase ${accentText} mt-0.5`}>
                  CERTIFICATE
                </h2>
              </div>

              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-2.5">
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Certificate No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{certificateNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(date)}</span>
                </div>
              </div>
            </div>

            {/* Geometric Accent Triangles */}
            <div className="absolute bottom-0 right-0 overflow-hidden pointer-events-none z-20">
              <svg width="65" height="65" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,20 100,50 40,90" fill={accentShape} opacity="0.95" />
                <polygon points="60,30 100,60 70,85" fill={accentShape} opacity="0.65" />
              </svg>
            </div>
          </div>
        </div>

        {/* Client Name Banner */}
        <div className="px-10 mt-4">
          <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
            THIS IS TO CERTIFY THAT
          </span>
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-0.5">
            {clientName}
          </h2>
          <p className="text-xs text-neutral-600 font-medium">{clientAddress}</p>
        </div>

        {/* Certification Statement */}
        <div className="px-10 mt-3 text-xs text-neutral-700 font-medium leading-relaxed">
          <p>{certificationStatement}</p>
        </div>

        {/* Project Details List with Icons */}
        <div className="px-10 mt-3">
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs space-y-2">
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PROJECT TITLE</span>
              <span className="font-bold text-neutral-900">: {projectTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">SERVICE PROVIDER</span>
              <span className="font-bold text-neutral-900">: {serviceProvider}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PROJECT START DATE</span>
              <span className="font-bold text-neutral-900">: {formatDate(startDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PROJECT COMPLETION DATE</span>
              <span className="font-bold text-neutral-900">: {formatDate(completionDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT RECEIPT NO.</span>
              <span className="font-mono font-bold text-neutral-900">: {receiptNumber || contractNumber || "Nil"}</span>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="px-10 mt-3">
          <span className="text-[10px] font-black uppercase text-neutral-900 tracking-wider block mb-1">
            SCOPE OF WORK:
          </span>
          <div className="bg-neutral-50 border-l-4 border-[#0a0a0a] rounded-r-xl p-2.5 text-xs text-neutral-800 font-semibold leading-relaxed shadow-2xs">
            {scopeOfWork}
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="px-10 mt-3">
          <span className="text-[10px] font-black uppercase text-neutral-900 tracking-wider block mb-1.5">
            DELIVERABLES:
          </span>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs font-bold text-neutral-800 shadow-2xs">
            {deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${accentBadgeBg}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-neutral-900 font-bold">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Note */}
        <div className="px-10 mt-3">
          <span className="text-[10px] font-black uppercase text-neutral-900 tracking-wider block mb-1">
            CERTIFICATION & CONFIRMATION:
          </span>
          <div className="bg-neutral-50 border-l-4 border-[#a6ce39] rounded-r-xl p-2.5 text-xs text-neutral-800 font-semibold leading-relaxed shadow-2xs">
            {confirmationNote}
          </div>
        </div>
      </div>

      {/* Signatures & Footer Bar at Bottom */}
      <div className="mt-auto pt-3">
        {/* 2-Column Signatures Block with Seal */}
        <div className="px-10 pb-3 grid grid-cols-2 gap-6 text-xs bg-white">
          {/* Provider Signature */}
          <div className="border border-neutral-200 rounded-xl p-3 relative overflow-hidden">
            <p className="font-extrabold text-neutral-900 uppercase text-[10px] tracking-wider mb-1">AUTHORIZED SIGNATURE</p>
            <div className="h-8 flex items-center mb-1">
              <span
                className="font-signature text-2xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
              >
                shode
              </span>
            </div>
            <p className="font-bold text-neutral-900 text-xs">{providerSignatory}</p>
            <p className="text-[11px] text-neutral-500 font-medium">Designation: {providerDesignation}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Date: {formatDate(providerDate)}</p>

            {/* Stamp Badge */}
            <div className="absolute top-2 right-2 w-11 h-11 rounded-full border-2 border-dashed border-[#a6ce39] flex flex-col items-center justify-center text-[7px] font-black text-[#a6ce39] uppercase transform rotate-12 opacity-80 pointer-events-none">
              <span>SEVENX</span>
              <span className="text-[6px]">VERIFIED</span>
            </div>
          </div>

          {/* Client Signature */}
          <div className="border border-neutral-200 rounded-xl p-3 relative overflow-hidden">
            <p className="font-extrabold text-neutral-900 uppercase text-[10px] tracking-wider mb-1">FOR {clientName.toUpperCase()}</p>
            <div className="h-8 flex items-end mb-1">
              <span className="font-serif italic text-xl font-bold text-neutral-900 border-b border-neutral-300 w-full pb-0.5">
                {clientSignatory}
              </span>
            </div>
            <p className="font-bold text-neutral-900 text-xs">{clientSignatory}</p>
            <p className="text-[11px] text-neutral-500 font-medium">Designation: {clientDesignation}</p>
            <p className="text-[10px] text-neutral-400 mt-0.5">Date: {formatDate(clientDate)}</p>

            {/* Stamp Badge */}
            <div className="absolute top-2 right-2 w-11 h-11 rounded-full border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center text-[7px] font-black text-neutral-400 uppercase transform -rotate-12 opacity-70 pointer-events-none">
              <span>CLIENT</span>
              <span className="text-[6px]">ACCEPTED</span>
            </div>
          </div>
        </div>

        {/* Full-Width Black Footer Bar */}
        <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3 flex justify-center items-center text-xs font-semibold z-20">
          <span>Made with SevenX Labs</span>
        </div>
      </div>
    </div>
  );
}
