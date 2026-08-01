"use client";

import React from "react";
import { formatDate } from "../../lib/utils";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Wallet,
} from "lucide-react";
import Image from "next/image";

export interface ReceiptItem {
  id: string;
  description: string;
  amount: number;
}

export interface ReceiptTemplateProps {
  id?: string;
  receiptNumber?: string;
  date?: string;

  // Paid By (Client) Details
  clientName?: string;
  clientAddress?: string;

  // Received By (Provider) Details
  providerName?: string;
  providerAddress?: string;
  providerEmail?: string;
  providerPhone?: string;

  // Amount
  amountReceived?: number;
  amountInWords?: string;

  // Payment Details
  paymentFor?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  upiId?: string;

  // Itemized Table
  items?: ReceiptItem[];
  subtotal?: number;
  taxPct?: number;
  taxAmount?: number;
  totalReceived?: number;

  // Notes & Signature
  notes?: string;
  signatoryName?: string;
  designation?: string;

  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernReceiptTemplate({
  id = "receipt-pdf-preview",
  receiptNumber = "SXL-RC-2026-000201",
  date = new Date().toISOString().split("T")[0],

  clientName = "",
  clientAddress = "",

  providerName = "SevenX Labs",
  providerAddress = "Thane, Mumbai, Maharashtra, India",
  providerEmail = "sevenxlabs07@gmail.com",
  providerPhone = "+91 8652601566",

  amountReceived = 0,
  amountInWords = "",

  paymentFor = "",
  invoiceNumber = "",
  invoiceDate = new Date().toISOString().split("T")[0],
  paymentMethod = "Bank Transfer",
  transactionId = "",
  paymentDate = new Date().toISOString().split("T")[0],
  bankName = "HDFC Bank",
  bankAccount = "50100234567890",
  bankIfsc = "HDFC0001234",
  upiId = "sevenxlabs@upi",

  items = [],
  subtotal = 0,
  taxPct = 0,
  taxAmount = 0,
  totalReceived = 0,

  notes = "",
  signatoryName = "Sahil Hode",
  designation = "Founder",

  accentColor = "lime",
}: ReceiptTemplateProps) {
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

  const displayItems = items.length > 0 ? items : [
    { id: "r-placeholder", description: "[ Enter Itemized Payment Description ]", amount: amountReceived }
  ];

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
          <div className="pt-10 pl-10 pr-4 max-w-sm">
            <div className="flex flex-col items-start gap-1 mb-3">
              <Image
                src="/logo.png"
                alt="SevenX Labs"
                width={260}
                height={90}
                className="h-16 w-auto object-contain max-w-[200px]"
                priority
              />
              <div className="flex items-center gap-1.5 mt-1 font-extrabold tracking-tight text-2xl uppercase">
                <span className="text-neutral-900 font-black">SevenX</span>
                <span className="text-[#a6ce39] font-black">Labs</span>
              </div>
              <p className="text-xs italic font-medium text-neutral-400">Innovate. Create. Elevate.</p>
            </div>

            <div className="mt-6">
              <span className="text-xs font-extrabold text-neutral-400 uppercase tracking-widest block mb-0.5">
                DOCUMENT STATUS
              </span>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight leading-snug uppercase text-emerald-700">
                PAYMENT CONFIRMED
              </h2>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[52%] bg-[#0a0a0a] text-white pt-10 pb-8 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[200px] overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-6">
                RECEIPT
              </h1>
              
              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                <div>
                  <span className="text-xs text-neutral-400 block font-sans">Receipt No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{receiptNumber}</span>
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

        {/* 2-Column Parties Grid: FROM (PAID BY) & TO (RECEIVED BY) */}
        <div className="px-10 mt-6 grid grid-cols-2 gap-8 text-xs">
          {/* FROM */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
              FROM (PAID BY)
            </span>
            <h3 className="text-base font-black text-neutral-900">
              {clientName || <span className="text-neutral-400 italic font-normal">[ Client Name ]</span>}
            </h3>
            <p className="text-neutral-600 font-medium leading-relaxed">
              {clientAddress || <span className="text-neutral-400 italic font-normal">[ Client Address ]</span>}
            </p>
          </div>

          {/* TO */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
              TO (RECEIVED BY)
            </span>
            <h3 className="text-base font-black text-neutral-900">{providerName}</h3>
            <p className="text-neutral-600 font-medium leading-relaxed">{providerAddress}</p>
            <p className="text-neutral-600 font-medium">Email: {providerEmail}</p>
            <p className="text-neutral-600 font-medium">Phone: {providerPhone}</p>
          </div>
        </div>

        {/* Amount Received Large Banner */}
        <div className="px-10 mt-6">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 flex items-center gap-5">
            <div className={`p-3.5 rounded-2xl shrink-0 shadow-sm ${accentBadgeBg}`}>
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase text-neutral-800 tracking-wider block">
                AMOUNT RECEIVED
              </span>
              <h2 className={`text-3xl font-black font-mono tracking-tight ${accentText} mt-1 leading-tight`}>
                ₹ {amountReceived.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              {amountInWords && (
                <p className="text-xs font-bold text-neutral-600 mt-2 leading-snug">{amountInWords}</p>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details Section */}
        <div className="px-10 mt-6">
          <div className="bg-[#0a0a0a] text-white rounded-t-xl py-2 px-5 text-xs font-black uppercase tracking-wider shadow-sm">
            PAYMENT DETAILS
          </div>

          <div className="bg-neutral-50 border-x border-b border-neutral-200 rounded-b-xl p-4 text-xs space-y-2 font-medium">
            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT FOR</span>
              <span className="font-bold text-neutral-900">
                : {paymentFor || <span className="text-neutral-400 italic font-normal">[ Enter Payment Purpose ]</span>}
              </span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">INVOICE NO.</span>
              <span className="font-mono text-neutral-800">: {invoiceNumber || "-"}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT METHOD</span>
              <span className="font-bold text-neutral-800">: {paymentMethod}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">TRANSACTION / REF ID</span>
              <span className="font-mono text-neutral-800">: {transactionId || "-"}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT DATE</span>
              <span className="font-mono text-neutral-800">: {formatDate(paymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Itemized Breakup Table */}
        <div className="px-10 mt-6">
          <div className="bg-[#0a0a0a] text-white rounded-full py-2.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <span>DESCRIPTION</span>
            <span className="text-right">AMOUNT (₹)</span>
          </div>

          <div className="space-y-1">
            {displayItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-neutral-50 border border-neutral-100 rounded-2xl py-2.5 px-6 text-xs flex justify-between items-center font-medium"
              >
                <span className="font-semibold text-neutral-800">{item.description}</span>
                <span className="font-mono font-bold text-neutral-900">
                  ₹ {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Pinned Section */}
      <div className="mt-auto px-10 pb-8 pt-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-end border-t border-neutral-200 pt-6">
          {/* Notes / Terms Left */}
          <div className="col-span-7 space-y-2 text-xs text-neutral-600 font-medium">
            {notes ? (
              <p><strong>Notes:</strong> {notes}</p>
            ) : (
              <p className="italic text-neutral-400">Payment received in full and final settlement for the stated invoice/purpose.</p>
            )}
            <p className="text-[10px] text-neutral-400 font-mono">This is a system generated digital receipt issued by SevenX Labs.</p>
          </div>

          {/* Signature Right */}
          <div className="col-span-5 text-right">
            <span
              className="font-signature text-3xl text-neutral-900 tracking-wider inline-block select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
              style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
            >
              shode
            </span>
            <p className="text-xs font-black text-neutral-900 uppercase mt-1">{signatoryName || providerName}</p>
            <p className="text-[10px] text-neutral-500 font-bold uppercase">{designation || "Authorized Signatory"}</p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-6 pt-3 border-t border-neutral-100 flex justify-between items-center text-[11px] font-semibold text-neutral-400">
          <span>SevenX Labs • Receipt #{receiptNumber}</span>
          <span>Made with SevenX Labs</span>
        </div>
      </div>
    </div>
  );
}
