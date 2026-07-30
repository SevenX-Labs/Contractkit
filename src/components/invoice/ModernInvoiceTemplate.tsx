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
  
  clientName: string;
  clientCompany?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  
  subtotal: number;
  taxPercent?: number;
  taxAmount?: number;
  discountPercent?: number;
  discountAmount?: number;
  shippingAmount?: number;
  total: number;
  
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
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernInvoiceTemplate({
  id = "invoice-pdf-preview",
  invoiceNumber = "SXL-INV-2026-000001",
  invoiceDate,
  senderName = "Sahil Hode",
  senderCompany = "SevenX Labs",
  senderAddress = "Thane, Mumbai, Maharashtra",
  senderEmail = "sevenxlabs07@gmail.com",
  senderPhone = "8652601566",
  logoUrl = "/logo.png",
  stampUrl,
  clientName = "Sophia Smith",
  clientCompany = "Acme Global",
  clientAddress = "100 Tech Plaza, Suite 400, Tech District, CA",
  clientEmail = "mail@mail.com",
  clientPhone = "+123-456-7890",
  items = [],
  subtotal = 0,
  taxPercent = 0,
  taxAmount = 0,
  discountPercent = 0,
  discountAmount = 0,
  shippingAmount = 0,
  total = 0,
  paymentMethod = "Payment Method.",
  paymentDetails,
  holderName = "Sahil Hode (SevenX Labs)",
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
  accentColor = "lime",
}: InvoiceTemplateProps) {
  // Color configuration
  const accentBg =
    accentColor === "lime"
      ? "bg-[#c5e158]"
      : accentColor === "purple"
      ? "bg-purple-300"
      : accentColor === "pink"
      ? "bg-pink-300"
      : "bg-emerald-300";

  const accentShape =
    accentColor === "lime"
      ? "#a6ce39"
      : accentColor === "purple"
      ? "#a855f7"
      : accentColor === "pink"
      ? "#ec4899"
      : "#10b981";

  const computedTaxAmount = taxAmount || (subtotal * (taxPercent || 0)) / 100;
  const computedTotal = total || subtotal + computedTaxAmount - (discountAmount || 0) + (shippingAmount || 0);

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
            <div className="flex flex-col items-start gap-1 mb-4">
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
                {clientName || "Sophia Smith"}
              </h2>
              <div className="space-y-1 text-xs text-neutral-800 font-semibold leading-relaxed">
                {clientPhone && <p>{clientPhone}</p>}
                {clientAddress && <p>{clientAddress}</p>}
                {clientEmail && <p>{clientEmail}</p>}
              </div>
            </div>
          </div>

          {/* Top Right Black Header Panel */}
          <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-10 pb-8 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[200px]">
            <div className="relative z-10">
              <h1 className="text-6xl font-black tracking-wider uppercase text-white mb-6">
                INVOICE
              </h1>
              
              {/* Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-left text-xs font-medium border-t border-neutral-800 pt-4">
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Invoice No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(invoiceDate)}</span>
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

        {/* Invoice Table Container */}
        <div className="px-10 mt-10">
          {/* Black Full-Width Header Row */}
          <div className="bg-[#0a0a0a] text-white rounded-full py-3.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <span className="w-16 text-center">SR NO.</span>
            <span className="flex-1 px-4">ITEM DESCRIPTION</span>
            <span className="w-28 text-right">RATE</span>
            <span className="w-28 text-right">TOTAL</span>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col gap-2">
            {items.map((item, index) => {
              const isHighlighted = index % 2 === 1;
              const srNo = String(index + 1).padStart(2, "0");
              return (
                <div
                  key={item.id || index}
                  className={`flex justify-between items-center py-3.5 px-6 text-xs transition font-medium ${
                    isHighlighted
                      ? `${accentBg} text-neutral-900 rounded-full font-bold shadow-sm`
                      : "bg-white text-neutral-800 rounded-full"
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

      {/* Bottom Pinned Section: Payment Details (Left) + Totals & Signature (Right) */}
      <div className="mt-auto px-10 pb-8 pt-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-end">
          {/* Left Column: Real-Time Dynamic Payment Details */}
          <div className="col-span-7 space-y-2">
            <h3 className="text-xs font-black text-neutral-900 tracking-tight uppercase mb-1.5 ml-1">
              {paymentMethod}
            </h3>
            <div className="text-xs text-neutral-900 font-semibold space-y-1.5 bg-neutral-50/95 p-4 rounded-2xl border border-neutral-200/80 shadow-sm backdrop-blur-sm relative z-20">
              {paymentDetails ? (
                paymentDetails.split("|").map((line, i) => (
                  <p key={i} className="text-neutral-900 font-bold font-mono">{line.trim()}</p>
                ))
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-medium min-w-[90px]">Holder Name:</span>
                    <span className="font-bold text-neutral-900">{holderName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-medium min-w-[90px]">Bank Name:</span>
                    <span className="font-bold text-neutral-900">{bankName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-medium min-w-[90px]">Account No:</span>
                    <span className="font-mono font-extrabold text-neutral-900 tracking-wide">{accountNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 font-medium min-w-[90px]">IFSC Code:</span>
                    <span className="font-mono font-bold text-neutral-900">{ifscCode}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Totals & Signature */}
          <div className="col-span-5 flex flex-col items-end space-y-6">
            {/* Totals Summary */}
            <div className="w-full text-right space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-600 font-bold">
                <span>Sub Total :</span>
                <span className="font-mono text-neutral-900 text-sm">{formatCurrency(subtotal, currencySymbol)}</span>
              </div>

              {taxPercent ? (
                <div className="flex justify-between items-center text-neutral-600 font-bold border-b border-neutral-900 pb-1">
                  <span>Tax Vat ({taxPercent}%) :</span>
                  <span className="font-mono text-neutral-900 text-sm">{formatCurrency(computedTaxAmount, currencySymbol)}</span>
                </div>
              ) : null}

              {discountAmount ? (
                <div className="flex justify-between items-center text-emerald-700 font-bold">
                  <span>Discount :</span>
                  <span className="font-mono text-sm">-{formatCurrency(discountAmount, currencySymbol)}</span>
                </div>
              ) : null}

              <div className="flex justify-between items-center pt-2 text-neutral-900">
                <span className="text-sm font-black uppercase">Total :</span>
                <span className="text-2xl font-black font-mono tracking-tight">{formatCurrency(computedTotal, currencySymbol)}</span>
              </div>
            </div>

            {/* Manager / Signature Block */}
            <div className="text-right flex flex-col items-end">
              {signatureUrl ? (
                <img src={signatureUrl} alt="Signature" className="h-10 object-contain mb-1" />
              ) : null}
              <span className="text-xs font-extrabold text-neutral-900 block">{signatureName}</span>
              <span className="text-[10px] font-bold text-neutral-500 block">{signatureTitle}</span>
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
          <span>{senderPhone || "8652601566"}</span>
        </div>

        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{senderEmail || "sevenxlabs07@gmail.com"}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{senderAddress || "Thane, Mumbai, Maharashtra"}</span>
        </div>
      </div>
    </div>
  );
}
