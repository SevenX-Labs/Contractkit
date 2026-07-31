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

  projectName = "E-Commerce Website Development",
  preparedBy = "SevenX Labs",
  currency = "INR (Indian Rupees)",
  paymentTerms = "50% Advance, 50% on Completion",
  deliveryTime = "4 - 6 Weeks",

  senderName = "Sahil Hode",
  senderCompany = "SevenX Labs",
  senderAddress = "Thane, Mumbai, Maharashtra",
  senderEmail = "contact@sevenxlabs.com",
  senderPhone = "+91 98765 43210",
  senderWebsite = "www.sevenxlabs.com",

  clientName = "ABC Pvt. Ltd.",
  clientCompany = "ABC Pvt. Ltd.",
  clientAddress = "123, Business Park, Andheri East, Mumbai, Maharashtra - 400069",
  clientEmail = "contact@abcpvtltd.com",
  clientPhone = "+91 98765 43210",
  clientWebsite = "www.abcpvtltd.com",
  clientGstin = "27ABCDE5678G1Z6",

  items = [
    {
      id: "q1",
      description: "Website Design & Development",
      miniDescription: "Responsive design and development of complete website.",
      quantity: 1,
      rate: 25000,
      amount: 25000,
    },
    {
      id: "q2",
      description: "Custom Graphic Design",
      miniDescription: "Custom banners, icons and visual assets.",
      quantity: 1,
      rate: 8000,
      amount: 8000,
    },
    {
      id: "q3",
      description: "Content Management System (CMS) Integration",
      miniDescription: "WordPress CMS integration with easy content management.",
      quantity: 1,
      rate: 7000,
      amount: 7000,
    },
    {
      id: "q4",
      description: "SEO Friendly Development",
      miniDescription: "Basic on-page SEO setup and optimization.",
      quantity: 1,
      rate: 5000,
      amount: 5000,
    },
    {
      id: "q5",
      description: "E-commerce Integration",
      miniDescription: "Product, cart, checkout and payment gateway integration.",
      quantity: 1,
      rate: 15000,
      amount: 15000,
    },
    {
      id: "q6",
      description: "Site Maintenance (3 Months)",
      miniDescription: "Bug fixes, updates and technical support.",
      quantity: 1,
      rate: 5000,
      amount: 5000,
    },
  ],

  subtotal = 65000,
  gstPercent = 18,
  gstAmount = 11700,
  totalAmount = 76700,

  termsAndConditions = [
    "This quotation is valid for 30 days from the date of issue.",
    "50% advance payment is required to start the project.",
    "The balance 50% payment will be charged on project completion.",
    "Any additional work or changes in scope will be charged extra.",
    "Delivery timeline may vary based on client feedback and content.",
    "All payments are non-refundable.",
  ],

  signatoryName = "Sahil Hode",
  designation = "Founder & Lead Developer",
  signatureUrl,
  bankName = "HDFC Bank",
  bankAccount = "50100234567890",
  bankIfsc = "HDFC0001234",
  upiId = "sevenxlabs@upi",
  currencySymbol = "₹",
  accentColor = "lime",
}: QuotationTemplateProps) {
  // Theme color tokens
  const accentBanner =
    accentColor === "lime"
      ? "bg-[#8cc63f] text-neutral-950 font-black"
      : accentColor === "purple"
      ? "bg-purple-600 text-white font-black"
      : accentColor === "pink"
      ? "bg-pink-600 text-white font-black"
      : "bg-emerald-600 text-white font-black";

  const accentBadge =
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

  const computedSubtotal = subtotal || items.reduce((acc, item) => acc + item.amount, 0);
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
                {clientName || "ABC Pvt. Ltd."}
              </h2>
              <div className="space-y-1 text-[11px] text-neutral-700 font-medium leading-relaxed">
                {clientAddress && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                    <MapPin style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block", marginTop: "2px" }} />
                    <span style={{ lineHeight: "1.4" }}>{clientAddress}</span>
                  </div>
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
                {clientWebsite && (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Globe style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
                    <span style={{ lineHeight: "1.4" }}>{clientWebsite}</span>
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

          {/* Top Right Black Header Box (Flush to Top and Right Edge) */}
          <div className="absolute top-0 right-0 w-[45%] bg-[#0a0a0a] text-white pt-8 pb-6 px-8 rounded-bl-[50px] shadow-2xl flex flex-col justify-between min-h-[150px]">
            <div className="relative z-10">
              <h1 className="text-4xl font-black tracking-wider uppercase text-white mb-3">
                QUOTATION
              </h1>

              {/* Divider & Metadata 2-Column Grid */}
              <div className="grid grid-cols-2 gap-4 text-left border-t border-neutral-800 pt-3">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans uppercase tracking-wider">Quotation No.</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">
                    {quotationNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 block font-sans uppercase tracking-wider">Date</span>
                  <span className="font-mono font-bold text-white text-xs block mt-0.5 whitespace-nowrap">
                    {formatDate(quotationDate)}
                  </span>
                </div>
              </div>
            </div>

            {/* Geometric Top-Right Corner Green Triangle Accent */}
            <div className="absolute top-0 right-0 pointer-events-none z-20 overflow-hidden">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polygon points="30,0 100,0 100,70" fill={accentShape} opacity="0.95" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2-Column Overview Section: Left Project Meta & Right VALIDITY Box */}
        <div className="px-10 mt-6 grid grid-cols-12 gap-6 items-start">
          {/* Left Column: Project Parameters List */}
          <div className="col-span-7 space-y-2 text-xs text-neutral-800">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Briefcase style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
              <span className="font-bold text-neutral-500" style={{ width: "112px", flexShrink: 0 }}>Project Name</span>
              <span className="font-bold text-neutral-900">: {projectName}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
              <span className="font-bold text-neutral-500" style={{ width: "112px", flexShrink: 0 }}>Prepared By</span>
              <span className="font-bold text-neutral-900">: {preparedBy}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
              <span className="font-bold text-neutral-500" style={{ width: "112px", flexShrink: 0 }}>Currency</span>
              <span className="font-bold text-neutral-900">: {currency}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <CheckCircle2 style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
              <span className="font-bold text-neutral-500" style={{ width: "112px", flexShrink: 0 }}>Payment Terms</span>
              <span className="font-bold text-neutral-900">: {paymentTerms}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock style={{ width: "14px", height: "14px", color: "#8cc63f", flexShrink: 0, display: "block" }} />
              <span className="font-bold text-neutral-500" style={{ width: "112px", flexShrink: 0 }}>Delivery Time</span>
              <span className="font-bold text-neutral-900">: {deliveryTime}</span>
            </div>
          </div>

          {/* Right Column: Green Validity Box */}
          <div className="col-span-5 flex justify-end">
            <div className="bg-[#fafaf8] border border-neutral-200 rounded-2xl p-4 shadow-xs" style={{ display: "flex", alignItems: "center", gap: "14px", width: "100%", maxWidth: "240px" }}>
              <div className={`p-3 rounded-full shrink-0 shadow-xs ${accentBadge}`} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar style={{ width: "20px", height: "20px", display: "block" }} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block">
                  VALIDITY
                </span>
                <p className="text-sm font-black text-neutral-900 mt-0.5">
                  {validityDays} Days
                </p>
                <p className="text-[10px] font-bold text-neutral-400 mt-0.5 whitespace-nowrap">
                  (Valid Till: {formatDate(validUntilDate)})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Itemized Line Items Table */}
        <div className="px-10 mt-6">
          {/* Black Full-Width Rounded Header Bar */}
          <div className="bg-[#0a0a0a] text-white rounded-xl py-3 px-6 mb-2 shadow-md" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <span style={{ width: "64px", textAlign: "center" }}>SR NO.</span>
            <span style={{ flex: 1, paddingLeft: "16px", paddingRight: "16px" }}>ITEM DESCRIPTION</span>
            <span style={{ width: "64px", textAlign: "center" }}>QTY.</span>
            <span style={{ width: "112px", textAlign: "right" }}>RATE ({currencySymbol})</span>
            <span style={{ width: "112px", textAlign: "right" }}>AMOUNT ({currencySymbol})</span>
          </div>

          {/* Table Body Rows */}
          <div className="flex flex-col gap-1.5">
            {items.map((item, index) => {
              const srNo = item.srNo || String(index + 1).padStart(2, "0");
              const isEven = index % 2 === 1;

              return (
                <div
                  key={item.id || index}
                  className={`py-3 px-6 text-xs transition rounded-xl ${
                    isEven ? accentLightRow : "bg-white"
                  }`}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  {/* SR NO Badge */}
                  <div style={{ width: "64px", display: "flex", justifyContent: "center" }}>
                    <span className={`font-mono font-bold text-xs px-2.5 py-1 rounded-md ${accentBadgeSr}`}>
                      {srNo}
                    </span>
                  </div>

                  {/* Description Title & Subtitle */}
                  <div style={{ flex: 1, paddingLeft: "16px", paddingRight: "16px" }}>
                    <p className="font-bold text-neutral-900 text-xs">{item.description}</p>
                    {item.miniDescription && (
                      <p className="text-[11px] text-neutral-500 font-medium mt-0.5 leading-snug">
                        {item.miniDescription}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <span className="font-mono font-bold text-neutral-900" style={{ width: "64px", textAlign: "center" }}>{item.quantity}</span>

                  {/* Rate */}
                  <span className="font-mono text-neutral-700 font-semibold" style={{ width: "112px", textAlign: "right" }}>
                    {formatCurrency(item.rate, "")}
                  </span>

                  {/* Amount */}
                  <span className="font-mono font-bold text-neutral-900" style={{ width: "112px", textAlign: "right" }}>
                    {formatCurrency(item.amount, "")}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Subtotal, GST, and Total Amount Banner */}
          <div className="mt-4 flex flex-col items-end space-y-2">
            <div className="w-64 space-y-1 text-xs">
              <div className="flex justify-between items-center text-neutral-600 font-bold px-2">
                <span className="uppercase text-[11px]">SUBTOTAL</span>
                <span className="font-mono text-neutral-900">{formatCurrency(computedSubtotal, "")}</span>
              </div>

              {gstPercent > 0 && (
                <div className="flex justify-between items-center text-neutral-600 font-bold px-2">
                  <span className="uppercase text-[11px]">GST ({gstPercent}%)</span>
                  <span className="font-mono text-neutral-900">{formatCurrency(computedGstAmount, "")}</span>
                </div>
              )}
            </div>

            {/* Lime Green Banner for TOTAL AMOUNT */}
            <div className={`w-full py-3.5 px-6 rounded-xl flex justify-between items-center shadow-md ${accentBanner}`}>
              <span className="text-xs font-black uppercase tracking-wider">TOTAL AMOUNT</span>
              <span className="text-lg font-black font-mono tracking-tight">
                {currencySymbol} {formatCurrency(computedTotalAmount, "")}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom 2-Column Section: TERMS & CONDITIONS (Left) + AUTHORIZED SIGNATURE (Right) */}
        <div className="px-10 mt-6 grid grid-cols-12 gap-8 items-start">
          {/* Left Column: Terms & Conditions */}
          <div className="col-span-7">
            <div className="bg-[#0a0a0a] text-white px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-block mb-2 shadow-xs">
              TERMS & CONDITIONS
            </div>

            <div className="bg-[#fafaf8] border border-neutral-200 rounded-2xl p-4 text-[11px] font-medium text-neutral-700 space-y-1.5 shadow-xs">
              {termsAndConditions.map((term, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-[#8cc63f] font-bold text-xs shrink-0">•</span>
                  <span className="leading-snug">{term}</span>
                </div>
              ))}
              {bankName && (
                <div className="mt-2 pt-2 border-t border-neutral-200 font-mono text-[10px] text-neutral-800">
                  <p><strong>Bank:</strong> {bankName} {bankAccount ? `| A/C: ${bankAccount}` : ""} {bankIfsc ? `| IFSC: ${bankIfsc}` : ""} {upiId ? `| UPI: ${upiId}` : ""}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Signature Block */}
          <div className="col-span-5 flex flex-col items-end text-right space-y-1 pt-1">
            <p className="text-xs font-extrabold text-neutral-900 uppercase">Authorized Signature</p>

            {/* Signature Area */}
            <div className="h-14 flex items-center justify-end my-1">
              {signatureUrl ? (
                <img src={signatureUrl} alt="Signature" className="h-12 object-contain" />
              ) : (
                <span className="font-signature text-3xl font-extrabold text-neutral-900 tracking-wider select-none transform -rotate-3 border-b-2 border-neutral-900/80 pb-0.5 px-2">
                  shode
                </span>
              )}
            </div>

            <div className="text-xs space-y-0.5">
              <p className="font-bold text-neutral-900">Name: {signatoryName}</p>
              <p className="text-neutral-500 font-semibold text-[11px]">Designation: {designation}</p>
              <p className="text-neutral-500 font-medium text-[11px]">Date: {formatDate(quotationDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Full-Width Black Contact Footer Bar */}
      <div className="mt-6 mb-6 mx-10 bg-[#0a0a0a] text-white px-8 py-3.5 rounded-full shadow-xl" style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "12px", fontWeight: 600 }}>
        <span>Made with SevenX Labs</span>
      </div>
    </div>
  );
}
