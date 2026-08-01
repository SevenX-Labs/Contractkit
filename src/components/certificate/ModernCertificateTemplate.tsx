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

  clientName = "",
  clientAddress = "",
  clientGstin = "",

  certificationStatement = "This is to certify that the project described below has been successfully completed by SevenX Labs and delivered to the client as per the agreed scope, requirements, and terms of the contract.",
  projectTitle = "",
  serviceProvider = "SevenX Labs",
  startDate = new Date().toISOString().split("T")[0],
  completionDate = new Date().toISOString().split("T")[0],
  receiptNumber,
  contractNumber = "",

  scopeOfWork = "",
  deliverables = [],

  confirmationNote = "We hereby confirm that the above project has been completed in all respects and the deliverables have been handed over to the client. The client has reviewed and accepted the work.",

  providerSignatory = "Sahil Hode",
  providerDesignation = "Founder & Lead Developer",
  providerDate = new Date().toISOString().split("T")[0],
  clientSignatory = "",
  clientDesignation = "",
  clientDate = new Date().toISOString().split("T")[0],

  phone = "+91 8652601566",
  email = "sevenxlabs07@gmail.com",
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

  const displayDeliverables = deliverables.length > 0 ? deliverables : ["[ Completed Deliverable Asset ]"];

  return (
    <div
      id={id}
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Top Header & Content Section */}
      <div className="relative w-full">
        {/* Top Header Row with Black Block in Top-Right */}
        <div className="flex justify-between items-start w-full relative">
          {/* Top Left Company Branding & Crisp Logo */}
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
                OFFICIAL CERTIFICATE
              </span>
              <h2 className="text-base font-black text-neutral-900 tracking-tight leading-snug uppercase text-emerald-700">
                PROJECT COMPLETION
              </h2>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[54%] bg-[#0a0a0a] text-white pt-7 pb-6 px-7 rounded-bl-[40px] shadow-2xl flex flex-col justify-between min-h-[175px] overflow-hidden">
            <div className="relative z-10 pr-12">
              <h1 className="text-2xl font-black tracking-wider uppercase text-white mb-2 leading-tight">
                COMPLETION CERTIFICATE
              </h1>
              
              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-3 text-left text-xs font-medium border-t border-neutral-800 pt-2.5">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Certificate No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{certificateNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Issue Date</span>
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
            {clientName || <span className="text-neutral-400 italic font-normal">[ Client / Recipient Name ]</span>}
          </h2>
          <p className="text-xs text-neutral-600 font-medium">
            {clientAddress || <span className="text-neutral-400 italic font-normal">[ Client Address ]</span>}
          </p>
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
              <span className="font-bold text-neutral-900">
                : {projectTitle || <span className="text-neutral-400 italic font-normal">[ Enter Project Title ]</span>}
              </span>
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
            {scopeOfWork || <span className="text-neutral-400 italic font-normal">[ Enter project scope of work description... ]</span>}
          </div>
        </div>

        {/* Deliverables Grid */}
        <div className="px-10 mt-3">
          <span className="text-[10px] font-black uppercase text-neutral-900 tracking-wider block mb-1.5">
            DELIVERABLES:
          </span>
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 grid grid-cols-2 gap-2 text-xs font-bold text-neutral-800 shadow-2xs">
            {displayDeliverables.map((item, idx) => (
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
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-[11px] text-neutral-700 font-medium leading-relaxed">
            {confirmationNote}
          </div>
        </div>
      </div>

      {/* Bottom Signatures Section */}
      <div className="mt-auto px-10 pb-8 pt-4 relative z-10">
        <div className="grid grid-cols-2 gap-6 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">
              ISSUED BY (SERVICE PROVIDER)
            </span>
            <div className="py-1 border-b border-neutral-300">
              <span
                className="font-signature text-2xl text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2 inline-block"
                style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
              >
                shode
              </span>
            </div>
            <p className="text-xs font-black text-neutral-900 mt-1">{providerSignatory || serviceProvider}</p>
            <p className="text-[10px] text-neutral-500 font-bold">{providerDesignation || "Authorized Signatory"}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Date: {formatDate(providerDate)}</p>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block mb-1">
              ACCEPTED BY (CLIENT)
            </span>
            <p className="font-mono text-neutral-900 border-b border-neutral-300 pb-1 font-bold text-xs">
              {clientSignatory || <span className="text-neutral-400 italic font-normal">[ Client Signatory ]</span>}
            </p>
            <p className="text-xs font-black text-neutral-900 mt-1">
              {clientName || <span className="text-neutral-400 italic font-normal">[ Client Company ]</span>}
            </p>
            <p className="text-[10px] text-neutral-500 font-bold">{clientDesignation || "Client Representative"}</p>
            <p className="text-[10px] text-neutral-400 font-medium">Date: {formatDate(clientDate)}</p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center text-[11px] font-semibold text-neutral-400">
          <span>SevenX Labs • Certificate #{certificateNumber}</span>
          <span>Made with SevenX Labs</span>
        </div>
      </div>
    </div>
  );
}
