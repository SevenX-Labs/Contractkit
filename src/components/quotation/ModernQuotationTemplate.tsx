"use client";

import React from "react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { Phone, Mail, MapPin, Globe, Calendar, Briefcase, User, CreditCard, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export interface QuotationItemProps {
  id: string;
  srNo?: string;
  description: string;
  miniDescription?: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface QuotationTemplateProps {
  id?: string;
  quotationNumber?: string;
  quotationDate?: string;
  validityDays?: number;
  validUntilDate?: string;

  projectName?: string;
  preparedBy?: string;
  currency?: string;
  paymentTerms?: string;
  deliveryTime?: string;

  senderName?: string;
  senderCompany?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderPhone?: string;
  senderWebsite?: string;

  clientName?: string;
  clientCompany?: string;
  clientAddress?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientWebsite?: string;
  clientGstin?: string;

  items?: QuotationItemProps[];
  subtotal?: number;
  gstPercent?: number;
  gstAmount?: number;
  totalAmount?: number;

  termsAndConditions?: string[];
  signatoryName?: string;
  designation?: string;
  signatureUrl?: string;

  bankName?: string;
  bankAccount?: string;
  bankIfsc?: string;
  upiId?: string;

  currencySymbol?: string;
  accentColor?: "lime" | "purple" | "pink" | "emerald";
}

export function ModernQuotationTemplate({
  id = "quotation-pdf-preview",
  quotationNumber = "SXL-QUO-2026-000001",
  quotationDate = new Date().toISOString().split("T")[0],
  validityDays = 30,
  validUntilDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

  projectName = "",
  preparedBy = "SevenX Labs",
  currency = "INR (Indian Rupees)",
  paymentTerms = "50% Advance, 50% on Completion",
  deliveryTime = "4 - 6 Weeks",

  senderName = "Sahil Hode",
  senderCompany = "SevenX Labs",
  senderAddress = "Thane, Mumbai, Maharashtra",
  senderEmail = "sevenxlabs07@gmail.com",
  senderPhone = "+91 8652601566",
  senderWebsite = "www.sevenxlabs.com",

  clientName = "",
  clientCompany = "",
  clientAddress = "",
  clientEmail = "",
  clientPhone = "",
  clientWebsite = "",
  clientGstin = "",

  items = [],
  subtotal = 0,
  gstPercent = 0,
  gstAmount = 0,
  totalAmount = 0,

  termsAndConditions = [
    "This quotation is valid for 30 days from the date of issue.",
    "50% advance payment is required to start the project.",
    "The balance 50% payment will be charged on project completion.",
  ],
  signatoryName = "Sahil Hode",
  designation = "Founder & Manager",
  signatureUrl,

  bankName = "HDFC Bank",
  bankAccount = "50100234567890",
  bankIfsc = "HDFC0001234",
  upiId = "sevenxlabs@upi",

  currencySymbol = "₹",
  accentColor = "lime",
}: QuotationTemplateProps) {
  const accentBadgeBg =
    accentColor === "lime"
      ? "bg-[#8cc63f] text-neutral-950"
      : accentColor === "purple"
      ? "bg-purple-500 text-white"
      : accentColor === "pink"
      ? "bg-pink-500 text-white"
      : "bg-emerald-500 text-white";

  const accentLightRow =
    accentColor === "lime"
      ? "bg-[#f5fae8]"
      : accentColor === "purple"
      ? "bg-purple-50"
      : accentColor === "pink"
      ? "bg-pink-50"
      : "bg-emerald-50";

  const accentBadgeSr =
    accentColor === "lime"
      ? "bg-[#e8f6cd] text-[#5e9618]"
      : accentColor === "purple"
      ? "bg-purple-100 text-purple-700"
      : accentColor === "pink"
      ? "bg-pink-100 text-pink-700"
      : "bg-emerald-100 text-emerald-700";

  const accentShape =
    accentColor === "lime"
      ? "#8cc63f"
      : accentColor === "purple"
      ? "#a855f7"
      : accentColor === "pink"
      ? "#ec4899"
      : "#10b981";

  const displayItems = items.length > 0 ? items : [
    { id: "q-placeholder", description: "[ Enter Quotation Item Description ]", miniDescription: "", quantity: 1, rate: 0, amount: 0 }
  ];

  const computedSubtotal = subtotal || displayItems.reduce((acc, item) => acc + item.amount, 0);
  const computedGstAmount = gstAmount !== undefined ? gstAmount : (computedSubtotal * (gstPercent || 0)) / 100;
  const computedTotalAmount = totalAmount || computedSubtotal + computedGstAmount;

  return (
    <div
      id={id}
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden p-0"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      <div>
        {/* Top Header Section: Flush-Right Black Curved Header Box */}
        <div className="relative w-full min-h-[160px]">
          {/* Top Left Branding & Client Details */}
          <div className="pt-8 pl-10 pr-4 max-w-[55%]">
            {/* Logo */}
            <div className="flex flex-col items-start gap-0.5 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-neutral-900 font-black text-2xl tracking-tighter uppercase">SEVENX</span>
                <span className="text-[#8cc63f] font-black text-2xl tracking-tighter uppercase">LABS</span>
              </div>
              <p className="text-[11px] font-extrabold text-neutral-500 tracking-tight">
                Freelance & Technology Solutions
              </p>
            </div>

            {/* Client Info (QUOTATION TO.) */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                QUOTATION TO.
              </span>
              <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">
                {clientName || <span className="text-neutral-400 italic font-normal">[ Client Name ]</span>}
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-700 font-medium leading-relaxed">
                {clientAddress ? (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <MapPin style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block", marginTop: "2px" }} />
                    <span style={{ lineHeight: "1.4" }}>{clientAddress}</span>
                  </div>
                ) : (
                  <p className="text-neutral-400 italic font-normal">[ Client Address ]</p>
                )}
                {clientEmail && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Mail style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
                    <span style={{ lineHeight: "1.4" }}>{clientEmail}</span>
                  </div>
                )}
                {clientPhone && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Phone style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
                    <span style={{ lineHeight: "1.4" }}>{clientPhone}</span>
                  </div>
                )}
                {clientGstin && (
                  <p className="font-bold text-neutral-900 text-[11px] mt-1.5">
                    GSTIN: <span className="font-mono">{clientGstin}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Top Right Curved Black Panel */}
          <div
            className="absolute top-0 right-0 w-[46%] bg-[#0a0a0a] text-white pt-8 pb-7 px-8 rounded-bl-[60px] shadow-2xl flex flex-col justify-between"
            style={{ minHeight: "185px" }}
          >
            <div>
              <h1 className="text-4xl font-black tracking-wider uppercase text-white mb-4">
                QUOTATION
              </h1>

              {/* 2-Column Meta Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-left text-xs font-medium border-t border-neutral-800 pt-3">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Quotation No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{quotationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(quotationDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Valid Until</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{formatDate(validUntilDate)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans">Prepared By</span>
                  <span className="font-bold text-white text-xs block mt-0.5 whitespace-nowrap">{preparedBy}</span>
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

        {/* Project & Scope Overview Pill Box */}
        <div className="px-10 mt-6">
          <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl flex flex-col gap-2">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block font-mono">PROJECT NAME</span>
                <h3 className="text-base font-black text-neutral-900 tracking-tight">
                  {projectName || <span className="text-neutral-400 italic font-normal">[ Enter Project Name ]</span>}
                </h3>
              </div>
              <div className="flex gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase block font-sans">ESTIMATED TIMELINE</span>
                  <span className="font-bold text-neutral-900">{deliveryTime}</span>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-neutral-400 uppercase block font-sans">PAYMENT TERMS</span>
                  <span className="font-bold text-neutral-900">{paymentTerms}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quotation Table Container */}
        <div className="px-10 mt-6">
          {/* Black Full-Width Header Row */}
          <div className="bg-[#0a0a0a] text-white rounded-full py-3 px-6 flex justify-between items-center text-xs font-black uppercase tracking-wider mb-2 shadow-md">
            <span className="w-12 text-center">SR NO.</span>
            <span className="flex-1 px-4">ITEM DESCRIPTION</span>
            <span className="w-20 text-center">QTY</span>
            <span className="w-24 text-right">RATE</span>
            <span className="w-28 text-right">AMOUNT</span>
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
                      ? `${accentLightRow} text-neutral-900 rounded-full border border-[#e2f0ca]`
                      : "bg-white text-neutral-800 rounded-full border border-neutral-100"
                  }`}
                >
                  <span className={`w-12 text-center font-mono font-bold py-1 px-2 rounded-full text-[11px] ${accentBadgeSr}`}>
                    {srNo}
                  </span>
                  <div className="flex-1 px-4">
                    <p className="font-black text-neutral-900 leading-tight">{item.description}</p>
                    {item.miniDescription && (
                      <p className="text-[11px] text-neutral-500 font-medium leading-snug mt-0.5">{item.miniDescription}</p>
                    )}
                  </div>
                  <span className="w-20 text-center font-mono font-bold text-neutral-700">{item.quantity}</span>
                  <span className="w-24 text-right font-mono text-neutral-800">{formatCurrency(item.rate, currencySymbol)}</span>
                  <span className="w-28 text-right font-mono font-black text-neutral-900">{formatCurrency(item.amount, currencySymbol)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Pinned Section */}
      <div className="mt-auto px-10 pb-8 pt-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-end border-t border-neutral-200 pt-6">
          {/* Left Column: Bank Info & Terms */}
          <div className="col-span-7 space-y-4">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 text-xs">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-2 font-mono">
                TERMS & CONDITIONS
              </span>
              <ul className="space-y-1 text-neutral-700 font-medium text-[11px] list-disc pl-4">
                {termsAndConditions.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            {bankName && (
              <div className="bg-neutral-900 text-white p-3 rounded-xl text-[11px] font-mono flex flex-wrap justify-between items-center">
                <div>
                  <span><strong>Bank:</strong> {bankName}</span>
                  {bankAccount && <span className="ml-2">| <strong>A/C:</strong> {bankAccount}</span>}
                  {bankIfsc && <span className="ml-2">| <strong>IFSC:</strong> {bankIfsc}</span>}
                </div>
                {upiId && <div><strong>UPI:</strong> {upiId}</div>}
              </div>
            )}
          </div>

          {/* Right Column: Totals & Signature */}
          <div className="col-span-5 flex flex-col items-end gap-6">
            <div className="w-full bg-neutral-900 text-white p-5 rounded-2xl shadow-xl flex flex-col gap-2 font-mono text-xs">
              <div className="flex justify-between items-center text-neutral-300">
                <span>Subtotal:</span>
                <span>{formatCurrency(computedSubtotal, currencySymbol)}</span>
              </div>
              {gstPercent > 0 && (
                <div className="flex justify-between items-center text-neutral-300">
                  <span>GST ({gstPercent}%):</span>
                  <span>{formatCurrency(computedGstAmount, currencySymbol)}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-white pt-2 border-t border-neutral-800">
                <span className="uppercase font-sans tracking-wider">Total Quote:</span>
                <span className="text-[#8cc63f] text-base">{formatCurrency(computedTotalAmount, currencySymbol)}</span>
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
              <p className="text-xs font-black text-neutral-900 uppercase mt-1">{signatoryName || preparedBy}</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase">{designation || "Authorized Signatory"}</p>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="mt-6 pt-3 border-t border-neutral-100 flex justify-between items-center text-[11px] font-semibold text-neutral-400">
          <span>SevenX Labs • Quotation #{quotationNumber}</span>
          <span>Made with SevenX Labs</span>
        </div>
      </div>
    </div>
  );
}
