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
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      <div>
        {/* Top Header Row with Black Curved Block on Right */}
        <div className="flex justify-between items-start w-full relative">
          {/* Top Left Branding */}
          <div className="pt-8 pl-10 pr-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <Image
                src="/logo.png"
                alt="SevenX Labs"
                width={180}
                height={55}
                className="h-10 w-auto object-contain"
                priority
              />
              <div className="flex items-center gap-1 font-extrabold tracking-tight text-xl uppercase">
                <span className="text-neutral-900 font-black">SevenX</span>
                <span className={accentText + " font-black"}>Labs</span>
              </div>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[52%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[170px] overflow-hidden">
            <div className="relative z-10">
              <div className="flex flex-col mb-4">
                <h1 className="text-4xl font-black tracking-wider uppercase text-white leading-none">
                  COMPLETION
                </h1>
                <h2 className={`text-2xl font-black tracking-wider uppercase ${accentText} mt-0.5`}>
                  CERTIFICATE
                </h2>
              </div>

              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                <div>
                  <span className="text-xs text-neutral-400 block font-sans">Certificate No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{certificateNumber}</span>
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(date)}</span>
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

        {/* Client Name Banner */}
        <div className="px-10 mt-6">
          <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
            THIS IS TO CERTIFY THAT
          </span>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-1">
            {clientName}
          </h2>
          <p className="text-xs text-neutral-600 font-medium">{clientAddress}</p>
          {clientGstin && (
            <p className="text-xs font-mono font-semibold text-neutral-500 mt-0.5">GSTIN: {clientGstin}</p>
          )}
        </div>

        {/* Certification Statement */}
        <div className="px-10 mt-4 text-xs text-neutral-700 font-medium leading-relaxed">
          <p>{certificationStatement}</p>
        </div>

        {/* Project Details List with Icons */}
        <div className="px-10 mt-5">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <FileText className="w-3.5 h-3.5" />
              </div>
              <span className="w-48 font-black uppercase text-neutral-900 text-[11px]">PROJECT TITLE</span>
              <span className="font-bold text-neutral-900">: {projectTitle}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="w-48 font-black uppercase text-neutral-900 text-[11px]">SERVICE PROVIDER</span>
              <span className="font-bold text-neutral-900">: {serviceProvider}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="w-48 font-black uppercase text-neutral-900 text-[11px]">PROJECT START DATE</span>
              <span className="font-bold text-neutral-900">: {formatDate(startDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span className="w-48 font-black uppercase text-neutral-900 text-[11px]">PROJECT COMPLETION DATE</span>
              <span className="font-bold text-neutral-900">: {formatDate(completionDate)}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg shrink-0 ${accentBadgeBg}`}>
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="w-48 font-black uppercase text-neutral-900 text-[11px]">AGREEMENT / CONTRACT NO.</span>
              <span className="font-bold text-neutral-900">: {contractNumber}</span>
            </div>
          </div>
        </div>

        {/* Scope of Work */}
        <div className="px-10 mt-5">
          <div className="bg-[#0a0a0a] text-white rounded-full py-1.5 px-5 inline-block text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
            SCOPE OF WORK
          </div>
          <p className="text-xs text-neutral-800 font-medium leading-relaxed pl-1">
            {scopeOfWork}
          </p>
        </div>

        {/* Deliverables Grid */}
        <div className="px-10 mt-5">
          <div className="bg-[#0a0a0a] text-white rounded-full py-1.5 px-5 inline-block text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
            DELIVERABLES
          </div>
          <div className="grid grid-cols-2 gap-2 pl-1 text-xs font-semibold text-neutral-800">
            {deliverables.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${accentBadgeBg}`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Certification Note */}
        <div className="px-10 mt-5">
          <div className="bg-[#0a0a0a] text-white rounded-full py-1.5 px-5 inline-block text-[11px] font-black uppercase tracking-wider mb-2 shadow-sm">
            CERTIFICATION
          </div>
          <p className="text-xs text-neutral-800 font-medium leading-relaxed pl-1">
            {confirmationNote}
          </p>
        </div>
      </div>

      {/* Signatures & Footer Bar at Bottom */}
      <div className="mt-auto pt-6">
        {/* 2-Column Signatures Block with Seal */}
        <div className="px-10 pb-5 grid grid-cols-2 gap-8 text-xs bg-white">
          {/* Provider Signature */}
          <div className="border border-neutral-200 rounded-2xl p-4 relative overflow-hidden">
            <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">FOR SEVENX LABS</p>
            <div className="h-10 flex items-end mb-2">
              <span className="font-serif italic text-2xl font-bold text-neutral-900 border-b border-neutral-300 w-full pb-1">
                {providerSignatory}
              </span>
            </div>
            <p className="font-bold text-neutral-900 text-xs">{providerSignatory}</p>
            <p className="text-xs text-neutral-500 font-medium">Designation: {providerDesignation}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Date: {formatDate(providerDate)}</p>

            {/* Stamp Badge */}
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full border-2 border-dashed border-[#a6ce39] flex flex-col items-center justify-center text-[8px] font-black text-[#a6ce39] uppercase transform rotate-12 opacity-80 pointer-events-none">
              <span>SEVENX</span>
              <span className="text-[7px]">VERIFIED</span>
            </div>
          </div>

          {/* Client Signature */}
          <div className="border border-neutral-200 rounded-2xl p-4 relative overflow-hidden">
            <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">FOR {clientName.toUpperCase()}</p>
            <div className="h-10 flex items-end mb-2">
              <span className="font-serif italic text-2xl font-bold text-neutral-900 border-b border-neutral-300 w-full pb-1">
                {clientSignatory}
              </span>
            </div>
            <p className="font-bold text-neutral-900 text-xs">{clientSignatory}</p>
            <p className="text-xs text-neutral-500 font-medium">Designation: {clientDesignation}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Date: {formatDate(clientDate)}</p>

            {/* Stamp Badge */}
            <div className="absolute top-3 right-3 w-12 h-12 rounded-full border-2 border-dashed border-neutral-400 flex flex-col items-center justify-center text-[8px] font-black text-neutral-400 uppercase transform -rotate-12 opacity-70 pointer-events-none">
              <span>CLIENT</span>
              <span className="text-[7px]">ACCEPTED</span>
            </div>
          </div>
        </div>

        {/* Full-Width Black Footer Bar */}
        <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white shrink-0" />
            <span>{phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white shrink-0" />
            <span>{email}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white shrink-0" />
            <span>{website}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
