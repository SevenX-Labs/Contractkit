"use client";

import React from "react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export interface InvoiceTemplateProps {
  id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  
  senderName?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  logoUrl?: string;
  stampUrl?: string;
  
  clientName?: string;
  clientCompany?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  
  items?: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  
  subtotal?: number;
  taxPercent?: number;
  taxAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  shippingAmount?: number;
  total?: number;
  
  paymentMethod?: string;
  paymentDetails?: string;
  holderName?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  
  note?: string;
  terms?: string;
  signatureName?: string;
  signatureTitle?: string;
  signatureUrl?: string;
  qrCodeUrl?: string;
  
  currencySymbol?: string;
  projectName?: string;
  invoiceType?: string;
  miniDescription?: string;
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernInvoiceTemplate({
  id = "invoice-pdf-preview",
  invoiceNumber = "SXL-INV-2026-000001",
  invoiceDate = new Date().toISOString().split("T")[0],
  senderName = "Sahil Hode",
  senderCompany = "SevenX Labs",
  senderAddress = "Thane, Mumbai, Maharashtra",
  senderEmail = "sevenxlabs07@gmail.com",
  senderPhone = "8652601566",
  logoUrl = "/logo.png",
  stampUrl,
  clientName = "",
  clientCompany = "",
  clientAddress = "",
  clientEmail = "",
  clientPhone = "",
  items = [],
  subtotal = 0,
  taxPercent = 0,
  taxAmount = 0,
  discountPercent = 0,
  discountAmount = 0,
  shippingAmount = 0,
  total = 0,
  paymentMethod = "Bank Transfer",
  paymentDetails = "",
  holderName = "SevenX Labs",
  bankName = "HDFC Bank",
  accountNumber = "50100234567890",
  ifscCode = "HDFC0001234",
  note,
  terms,
  signatureName = "Sahil Hode",
  signatureTitle = "Founder & Manager",
  signatureUrl,
  qrCodeUrl,
  currencySymbol = "₹",
  projectName = "",
  invoiceType = "Advance Payment",
  miniDescription = "",
  accentColor = "lime",
}: InvoiceTemplateProps) {
  const accentBg =
    accentColor === "lime"
      ? "bg-[#a6ce39]"
      : accentColor === "purple"
      ? "bg-purple-500 text-white"
      : accentColor === "pink"
      ? "bg-pink-500 text-white"
      : "bg-emerald-500 text-white";

  const accentShape =
    accentColor === "lime"
      ? "#a6ce39"
      : accentColor === "purple"
      ? "#a855f7"
      : accentColor === "pink"
      ? "#ec4899"
      : "#10b981";

  const displayItems = items.length > 0 ? items : [
    { id: "item-placeholder", description: "[ Enter Service / Item Description ]", quantity: 1, rate: 0, amount: 0 }
  ];

  return (
    <div
      id={id}
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Top Header & Table Section */}
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
            </div>

            {/* Client Info Section */}
            <div className="mt-8">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest block mb-1">
                INVOICE TO.
              </span>
              <h2 className="text-3xl font-black text-neutral-900 tracking-tight mb-2">
                {clientName || <span className="text-neutral-400 italic font-normal text-2xl">[ Client Name ]</span>}
              </h2>
              <div className="space-y-1 text-xs text-neutral-800 font-semibold leading-relaxed">
                {clientCompany && <p className="font-bold text-neutral-900">{clientCompany}</p>}
                <p>{clientAddress || <span className="text-neutral-400 italic font-normal">[ Client Address ]</span>}</p>
                {clientPhone && <p>Phone: {clientPhone}</p>}
                {clientEmail && <p>Email: {clientEmail}</p>}
              </div>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[52%] bg-[#0a0a0a] text-white pt-10 pb-8 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[200px] overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-6xl font-black tracking-wider uppercase text-white mb-6">
                INVOICE
              </h1>
              
              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-3 text-left text-xs font-medium border-t border-neutral-800 pt-4">
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Invoice No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(invoiceDate)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Invoice Type</span>
                  <span className="font-bold text-[#a6ce39] text-xs block mt-0.5 whitespace-nowrap">{invoiceType || "Advance Payment"}</span>
                </div>
                <div className="pr-4">
                  <span className="text-[11px] text-neutral-400 block font-sans">Project Name</span>
                  <span className="font-bold text-white text-xs block mt-0.5 leading-snug break-words">
                    {projectName || <span className="text-neutral-400 italic font-normal">[ Project Name ]</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Geometric Accent Triangles */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none z-0 opacity-80">
              <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="20,10 90,50 30,90" fill={accentShape} opacity="0.75" />
                <polygon points="50,20 100,50 60,80" fill={accentShape} opacity="0.45" />
              </svg>
            </div>
          </div>
        </div>

        {/* Work Description / Summary Note */}
        {miniDescription && (
          <div className="px-10 mt-6">
            <div className="bg-neutral-50 border-l-4 border-[#0a0a0a] rounded-r-2xl p-3.5 text-xs text-neutral-800 font-medium leading-relaxed shadow-xs flex items-baseline gap-2">
              <span className="font-black text-neutral-900 uppercase text-xs tracking-wider shrink-0 font-mono">
                SUMMARY:
              </span>
              <p className="flex-1 text-neutral-800 leading-relaxed font-semibold">{miniDescription}</p>
            </div>
          </div>
        )}

        {/* Invoice Table Container */}
        <div className="px-10 mt-6">
          {/* Black Full-Width Header Row */}
          <div className="bg-[#0a0a0a] text-white rounded-full py-3.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <span className="w-16 text-center">SR NO.</span>
            <span className="flex-1 px-4">ITEM DESCRIPTION</span>
            <span className="w-28 text-right">RATE</span>
            <span className="w-28 text-right">TOTAL</span>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col gap-2">
            {displayItems.map((item, index) => {
              const isHighlighted = index % 2 === 1;
              const srNo = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={item.id || index}
                  className={`flex justify-between items-center py-3.5 px-6 text-xs transition font-medium ${
                    isHighlighted
                      ? `${accentBg} text-neutral-900 rounded-full font-bold shadow-sm`
                      : "bg-white text-neutral-800 rounded-full border border-neutral-100"
                  }`}
                >
                  <span className="w-16 text-center font-mono font-bold">{srNo}</span>
                  <span className="flex-1 px-4 font-semibold">{item.description}</span>
                  <span className="w-28 text-right font-mono">{formatCurrency(item.rate, currencySymbol)}</span>
                  <span className="w-28 text-right font-mono font-bold">{formatCurrency(item.amount, currencySymbol)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Pinned Section */}
      <div className="mt-auto px-10 pb-8 pt-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-end">
          {/* Left Column: Payment Details */}
          <div className="col-span-6 space-y-4">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-2 font-mono">
                PAYMENT INFORMATION
              </span>
              <div className="space-y-1.5 font-mono text-neutral-800">
                {paymentDetails ? (
                  <p className="whitespace-pre-line font-medium">{paymentDetails}</p>
                ) : (
                  <>
                    <p><strong className="text-neutral-500 font-sans">Bank:</strong> {bankName || "HDFC Bank"}</p>
                    <p><strong className="text-neutral-500 font-sans">Account Name:</strong> {holderName || senderName}</p>
                    <p><strong className="text-neutral-500 font-sans">A/C No:</strong> {accountNumber || "50100234567890"}</p>
                    <p><strong className="text-neutral-500 font-sans">IFSC:</strong> {ifscCode || "HDFC0001234"}</p>
                  </>
                )}
              </div>
            </div>

            {note && (
              <div className="text-[11px] text-neutral-500 italic leading-snug">
                <strong>Note:</strong> {note}
              </div>
            )}
          </div>

          {/* Right Column: Totals & Signature */}
          <div className="col-span-6 flex flex-col items-end gap-6">
            <div className="w-full bg-neutral-900 text-white p-5 rounded-2xl shadow-xl flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal, currencySymbol)}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between items-center text-neutral-300">
                  <span>Tax ({taxPercent}%):</span>
                  <span>{formatCurrency(taxAmount, currencySymbol)}</span>
                </div>
              )}
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-400">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount, currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-white pt-2 border-t border-neutral-800">
                <span className="uppercase font-sans tracking-wider">Total Due:</span>
                <span className="text-[#a6ce39] text-base">{formatCurrency(total, currencySymbol)}</span>
              </div>
            </div>

            {/* Signature Block */}
            <div className="text-right">
              <span
                className="font-signature text-3xl text-neutral-900 tracking-wider inline-block select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2"
                style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
              >
                shode
              </span>
              <p className="text-xs font-black text-neutral-900 uppercase mt-1">{signatureName || senderName}</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{signatureTitle || "Authorized Signatory"}</p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-8 pt-4 border-t border-neutral-200 flex justify-between items-center text-[11px] font-semibold text-neutral-400">
          <span>SevenX Labs • Invoice #{invoiceNumber}</span>
          <span>Made with SevenX Labs</span>
        </div>
      </div>
    </div>
  );
}
