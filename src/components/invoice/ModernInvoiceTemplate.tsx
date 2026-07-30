"use client";

import React from "react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

export interface InvoiceTemplateProps {
  id?: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  
  senderName?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderWebsite?: string;
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
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  
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
  invoiceNumber,
  invoiceDate,
  dueDate,
  senderName = "Cool Creative Studio",
  senderCompany = "SevenX Labs Studio",
  senderAddress = "Rosenstraße 12 Berlin",
  senderEmail = "mail@mail.com",
  senderPhone = "+49 0000 000 0000",
  senderWebsite = "www.yourdomain.com",
  logoUrl,
  stampUrl,
  clientName = "Sophia Smith",
  clientCompany = "Acme Global Inc",
  clientAddress = "Rosenstraße 12 Berlin",
  clientEmail = "mail@mail.com",
  clientPhone = "+49 0000 000 0000",
  items = [],
  subtotal = 0,
  taxPercent = 15,
  taxAmount = 0,
  discountPercent = 0,
  discountAmount = 0,
  shippingAmount = 0,
  total = 0,
  paymentMethod = "Payment Method.",
  paymentDetails,
  bankName = "Commerz Bank",
  accountName = "Account Name",
  accountNumber = "Account 0000 0000 0000",
  note = "Thanks For Your Business",
  terms = "Web Design is the Digital face of your brand shaping user perceptions and driving engagement. Through intuitive interfaces and captivating visuals, it creates memorable experiences that resonate with your target audience.",
  signatureName = "Sophia Smith",
  signatureTitle = "Manager",
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
      {/* Top Main Section */}
      <div className="relative w-full">
        {/* Top Header Row with Black Block in Top-Right */}
        <div className="flex justify-between items-start w-full relative">
          {/* Top Left Company Branding */}
          <div className="pt-10 pl-10 pr-4 max-w-sm">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 object-contain mb-2" />
            ) : (
              <h1 className="text-2xl font-black tracking-tight text-neutral-900">
                {senderCompany || senderName || "Cool Creative Studio"}
              </h1>
            )}

            {/* Client Info Section */}
            <div className="mt-10">
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

          {/* Top Right Black Header Panel with Curved Bottom Corner */}
          <div className="relative w-[50%] bg-[#0a0a0a] text-white pt-10 pb-8 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[200px]">
            <div>
              <h1 className="text-6xl font-black tracking-wider uppercase text-white mb-6">
                INVOICE
              </h1>
              
              {/* Metadata 3-Column Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium border-t border-neutral-800 pt-4">
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Invoice No.</span>
                  <span className="font-mono font-bold text-white text-sm block mt-0.5">#{invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-sm block mt-0.5">{formatDate(invoiceDate)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-neutral-400 block font-sans">Due Date</span>
                  <span className="font-mono font-bold text-white text-sm block mt-0.5">{formatDate(dueDate)}</span>
                </div>
              </div>
            </div>

            {/* Top Right Geometric Accent Triangles */}
            <div className="absolute -bottom-6 -right-6 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="20,10 90,50 30,90" fill={accentShape} opacity="0.9" />
                <polygon points="50,20 100,50 60,80" fill={accentShape} opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Invoice Table Container */}
        <div className="px-10 mt-10">
          {/* Black Full-Width Header Row */}
          <div className="bg-[#0a0a0a] text-white rounded-full py-3.5 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <span className="w-16 text-center">QTY</span>
            <span className="flex-1 px-4">ITEM DESCRIPTION</span>
            <span className="w-28 text-right">RATE</span>
            <span className="w-28 text-right">TOTAL</span>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col gap-2">
            {items.map((item, index) => {
              const isHighlighted = index % 2 === 1; // Alternating highlighted rows
              return (
                <div
                  key={item.id || index}
                  className={`flex justify-between items-center py-3.5 px-6 text-xs transition font-medium ${
                    isHighlighted
                      ? `${accentBg} text-neutral-900 rounded-full font-bold shadow-sm`
                      : "bg-white text-neutral-800 rounded-full"
                  }`}
                >
                  <span className="w-16 text-center font-mono font-bold">{item.quantity}</span>
                  <span className="flex-1 px-4 font-semibold">{item.description}</span>
                  <span className="w-28 text-right font-mono">{formatCurrency(item.rate, currencySymbol)}</span>
                  <span className="w-28 text-right font-mono font-bold">{formatCurrency(item.amount, currencySymbol)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Details Row: Payment Details & Terms (Left) + Totals & Signature (Right) */}
        <div className="px-10 mt-8 grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Details & Terms & Conditions */}
          <div className="col-span-7 space-y-5">
            {/* Payment Method */}
            <div>
              <h3 className="text-xs font-black text-neutral-900 tracking-tight uppercase mb-1">
                {paymentMethod}
              </h3>
              <div className="text-xs text-neutral-700 font-semibold space-y-0.5">
                <p>{accountName}</p>
                <p className="font-mono">{accountNumber}</p>
                <p>{bankName}</p>
                {paymentDetails && <p className="text-[11px] text-neutral-500 font-mono mt-1">{paymentDetails}</p>}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div>
              <h3 className="text-xs font-black text-neutral-900 tracking-tight uppercase mb-1">
                Terms & Condition
              </h3>
              <p className="text-[11px] text-neutral-600 leading-relaxed font-normal max-w-md">
                {terms}
              </p>
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
            <div className="text-right pt-4 flex flex-col items-end">
              {signatureUrl ? (
                <img src={signatureUrl} alt="Signature" className="h-10 object-contain mb-1" />
              ) : null}
              <span className="text-xs font-extrabold text-neutral-900 block">{signatureName}</span>
              <span className="text-[10px] font-bold text-neutral-500 block">{signatureTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Geometric Accent (Bottom-Left) */}
      <div className="absolute bottom-12 left-0 pointer-events-none">
        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,90 80,50 20,0" fill={accentShape} opacity="0.85" />
          <polygon points="0,60 50,30 10,0" fill={accentShape} opacity="0.5" />
        </svg>
      </div>

      {/* Full-Width Black Footer Bar with Contact Icons & Lime Green Accent Block */}
      <div className="relative w-full bg-[#0a0a0a] text-white px-8 py-3.5 flex justify-between items-center text-[10px] font-medium z-10">
        <div className="flex items-center gap-6 text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3 h-3 text-white shrink-0" />
            <span>{senderPhone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-white shrink-0" />
            <span>{senderEmail}</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-neutral-300">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-white shrink-0" />
            <span>{senderWebsite}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-white shrink-0" />
            <span>{senderAddress}</span>
          </div>
        </div>

        {/* Lime Accent Block on Bottom Right of Footer */}
        <div className={`absolute right-0 top-0 bottom-0 w-16 ${accentBg} rounded-tl-lg`} />
      </div>
    </div>
  );
}
