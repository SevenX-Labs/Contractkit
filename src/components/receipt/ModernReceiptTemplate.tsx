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
  clientGstin?: string;

  // Received By (Provider) Details
  providerName?: string;
  providerAddress?: string;
  providerGstin?: string;
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

  clientName = "ABC Pvt. Ltd.",
  clientAddress = "123, Business Park, Andheri East, Mumbai, Maharashtra - 400069",
  clientGstin = "27ABCDE5678G1Z6",

  providerName = "SevenX Labs",
  providerAddress = "Diva, Thane, Maharashtra, India",
  providerGstin = "27ABCDE1234F1Z5",
  providerEmail = "contact@sevenxlabs.com",
  providerPhone = "+91 98765 43210",

  amountReceived = 75000,
  amountInWords = "(Rupees Seventy Five Thousand Only)",

  paymentFor = "Final Payment – E-Commerce Website Development",
  invoiceNumber = "INV-2026-112",
  invoiceDate = "2026-07-20",
  paymentMethod = "Bank Transfer",
  transactionId = "TXN1234567890",
  paymentDate = "2026-07-30",

  items = [
    {
      id: "r1",
      description: "Final Payment for E-Commerce Website Development",
      amount: 75000,
    },
  ],
  subtotal = 75000,
  taxPct = 0,
  taxAmount = 0,
  totalReceived = 75000,

  notes = "Payment received in full & final settlement for the above invoice.",
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
              <h1 className="text-5xl font-black tracking-wider uppercase text-white mb-4">
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
            <h3 className="text-base font-black text-neutral-900">{clientName}</h3>
            <p className="text-neutral-600 font-medium">{clientAddress}</p>
            {clientGstin && (
              <p className="font-mono text-neutral-500 font-semibold text-[11px]">GSTIN: {clientGstin}</p>
            )}
          </div>

          {/* TO */}
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
              TO (RECEIVED BY)
            </span>
            <h3 className="text-base font-black text-neutral-900">{providerName}</h3>
            <p className="text-neutral-600 font-medium">{providerAddress}</p>
            {providerGstin && (
              <p className="font-mono text-neutral-500 font-semibold text-[11px]">GSTIN: {providerGstin}</p>
            )}
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
              <h2 className={`text-3xl font-black font-mono tracking-tight ${accentText} mt-0.5`}>
                ₹ {amountReceived.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </h2>
              {amountInWords && (
                <p className="text-xs font-bold text-neutral-600 mt-0.5">{amountInWords}</p>
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
              <span className="font-bold text-neutral-900">: {paymentFor}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">INVOICE NO.</span>
              <span className="font-mono font-bold text-neutral-900">: {invoiceNumber}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">INVOICE DATE</span>
              <span className="font-mono font-bold text-neutral-900">: {formatDate(invoiceDate)}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT METHOD</span>
              <span className="font-bold text-neutral-900">: {paymentMethod}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">TRANSACTION ID</span>
              <span className="font-mono font-bold text-neutral-900">: {transactionId}</span>
            </div>

            <div className="flex items-center">
              <span className="w-44 font-black uppercase text-neutral-900 text-[11px]">PAYMENT DATE</span>
              <span className="font-mono font-bold text-neutral-900">: {formatDate(paymentDate)}</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="px-10 mt-6">
          <div className="bg-[#0a0a0a] text-white rounded-t-xl py-2 px-5 flex justify-between items-center text-xs font-black uppercase tracking-wider shadow-md">
            <span className="w-16 text-center">SR NO.</span>
            <span className="flex-1 px-4">DESCRIPTION</span>
            <span className="w-32 text-right">AMOUNT (₹)</span>
          </div>

          <div className="border-x border-b border-neutral-200 rounded-b-xl overflow-hidden">
            {items.map((item, index) => {
              const srNo = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={item.id || index}
                  className={`flex justify-between items-center py-3 px-5 text-xs font-semibold ${accentBadgeBg}`}
                >
                  <span className="w-16 text-center font-mono">{srNo}</span>
                  <span className="flex-1 px-4">{item.description}</span>
                  <span className="w-32 text-right font-mono font-bold">
                    {item.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}

            {/* Subtotal & Tax Rows */}
            <div className="bg-white px-5 py-2.5 flex justify-between items-center text-xs border-t border-neutral-200 font-bold text-neutral-700">
              <span className="uppercase text-neutral-500 text-[11px]">SUBTOTAL</span>
              <span className="font-mono">{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="bg-white px-5 py-2.5 flex justify-between items-center text-xs border-t border-neutral-100 font-bold text-neutral-700">
              <span className="uppercase text-neutral-500 text-[11px]">TAX ({taxPct}%)</span>
              <span className="font-mono">{taxAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            {/* Total Received Green Highlight Row */}
            <div className={`px-5 py-3 flex justify-between items-center text-xs font-black uppercase ${accentBadgeBg} border-t border-neutral-300`}>
              <span className="tracking-wider">TOTAL RECEIVED</span>
              <span className="font-mono text-sm font-black">
                ₹ {totalReceived.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="px-10 mt-5">
            <span className="text-[11px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
              NOTES
            </span>
            <p className="text-xs text-neutral-700 font-medium">{notes}</p>
          </div>
        )}
      </div>

      {/* Signatures & Footer Bar at Bottom */}
      <div className="mt-auto pt-6">
        <div className="px-10 pb-5 flex justify-between items-end bg-white">
          {/* Provider Signature */}
          <div className="relative">
            <p className="font-extrabold text-neutral-900 uppercase text-[11px] tracking-wider mb-2">FOR SEVENX LABS</p>
            <div className="h-10 flex items-end mb-1 w-48">
              <span className="font-serif italic text-2xl font-bold text-neutral-900 border-b border-neutral-300 w-full pb-1">
                {signatoryName}
              </span>
            </div>
            <p className="font-bold text-neutral-900 text-xs">{signatoryName}</p>
            <p className="text-xs text-neutral-500 font-medium">Designation: {designation}</p>
            <p className="text-[11px] text-neutral-400 mt-0.5">Date: {formatDate(date)}</p>

            {/* Stamp Badge */}
            <div className="absolute -top-1 right-0 w-12 h-12 rounded-full border-2 border-dashed border-[#a6ce39] flex flex-col items-center justify-center text-[8px] font-black text-[#a6ce39] uppercase transform rotate-12 opacity-80 pointer-events-none">
              <span>SEVENX</span>
              <span className="text-[7px]">RECEIVED</span>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="text-right max-w-xs space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-neutral-900">
              <Heart className={`w-4 h-4 ${accentText} fill-current`} />
              <span>Thank you for your business!</span>
            </div>
            <p className="text-xs text-neutral-500 font-medium">
              We appreciate your trust in SevenX Labs.
            </p>
          </div>
        </div>

        {/* Full-Width Black Footer Bar */}
        <div className="relative w-full bg-[#0a0a0a] text-white px-10 py-3.5 flex justify-between items-center text-xs font-semibold z-20">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white shrink-0" />
            <span>{providerPhone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-white shrink-0" />
            <span>{providerEmail}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-white shrink-0" />
            <span>www.sevenxlabs.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}
