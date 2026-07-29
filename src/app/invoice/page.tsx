"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextInvoiceNumberDB, createInvoiceDB } from "../actions";
import { InvoiceData, InvoiceItem, PaymentMethod } from "../../types";
import { formatCurrency, formatDate, calculateInvoiceTotals } from "../../lib/utils";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import {
  FileText,
  Plus,
  Trash2,
  Save,
  User,
  Building,
  CreditCard,
  Eye,
  X,
  Phone,
  Globe,
  Mail,
  MapPin,
  CheckSquare,
} from "lucide-react";
import { toast } from "sonner";

export default function InvoicePage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);

  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: "SXL-INV-001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    
    senderName: "Sahil Hode",
    senderCompany: "SevenX Labs",
    senderAddress: "123 Tech Park, HSR Layout, Sector 1, Bengaluru",
    senderEmail: "hello@sevenxlabs.com",
    senderPhone: "+91 98765 43210",
    
    clientName: "Sandira Maulia",
    clientCompany: "Acme Fashion & Tech",
    clientAddress: "123 Your Address St., City Name",
    clientEmail: "sandira@acme.com",
    clientPhone: "+123-456-7890",
    
    paymentMethod: "UPI",
    paymentDetails: "UPI ID: sevenxlabs@upi | Bank: HDFC Bank",
    
    items: [
      { id: "item-1", description: "T-Shirt UI/UX E-Commerce Development", quantity: 1, rate: 5000, amount: 5000 },
      { id: "item-2", description: "Jacket Platform Architecture & Integration", quantity: 2, rate: 9000, amount: 18000 },
      { id: "item-3", description: "Sweater Catalog & Checkout Module", quantity: 1, rate: 8000, amount: 8000 },
      { id: "item-4", description: "Shoes Automated Payment Gateway", quantity: 1, rate: 10000, amount: 10000 },
    ],
    
    subtotal: 41000,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    total: 41000,
    
    note: "Thanks For Order",
    status: "sent",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getNextInvoiceNumberDB()]).then(([profile, invNum]) => {
      setFormData((prev: InvoiceData) => ({
        ...prev,
        invoiceNumber: invNum,
        senderName: profile.name || "Sahil Hode",
        senderCompany: profile.company || "SevenX Labs",
        senderAddress: profile.address || "123 Tech Park, HSR Layout, Bengaluru",
        senderEmail: profile.email || "hello@sevenxlabs.com",
        senderPhone: profile.phone || "+91 98765 43210",
        paymentMethod: "UPI",
        paymentDetails: `UPI ID: ${profile.upiId || "sevenxlabs@upi"} | Bank: ${profile.bankAccount || "Account Details"}`,
      }));
    });
  }, []);

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData((prev: InvoiceData) => {
      const updatedItems = prev.items.map((item: InvoiceItem) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            const qty = field === "quantity" ? Number(value) : item.quantity;
            const rate = field === "rate" ? Number(value) : item.rate;
            updated.amount = qty * rate;
          }
          return updated;
        }
        return item;
      });

      const totals = calculateInvoiceTotals(updatedItems, prev.discountPercent, prev.taxPercent);

      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setFormData((prev: InvoiceData) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length === 1) {
      toast.error("Invoice must have at least one line item.");
      return;
    }
    setFormData((prev: InvoiceData) => {
      const updatedItems = prev.items.filter((i: InvoiceItem) => i.id !== id);
      const totals = calculateInvoiceTotals(updatedItems, prev.discountPercent, prev.taxPercent);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const handleDiscountTaxChange = (field: "discountPercent" | "taxPercent", value: number) => {
    setFormData((prev: InvoiceData) => {
      const discountPct = field === "discountPercent" ? value : prev.discountPercent;
      const taxPct = field === "taxPercent" ? value : prev.taxPercent;
      const totals = calculateInvoiceTotals(prev.items, discountPct, taxPct);
      return {
        ...prev,
        [field]: value,
        ...totals,
      };
    });
  };

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error("Please enter a client name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createInvoiceDB(formData);
    setIsSaving(false);

    if (res.success) {
      const nextInv = await getNextInvoiceNumberDB();
      setFormData((prev: InvoiceData) => ({ ...prev, invoiceNumber: nextInv }));
      toast.success(`Invoice #${formData.invoiceNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving invoice: ${res.error}`);
    }
  };

  const handleExportPDF = async () => {
    await handleSave();
    await exportToPDF("invoice-pdf-preview", `Invoice-${formData.invoiceNumber}.pdf`);
  };

  const handleExportDOCX = async () => {
    await handleSave();
    await exportToDOCX("invoice-pdf-preview", `Invoice-${formData.invoiceNumber}.docx`);
  };

  const handleExportImage = async () => {
    await handleSave();
    await exportToImage("invoice-pdf-preview", `Invoice-${formData.invoiceNumber}.png`);
  };

  const invoicePreviewContent = (
    <div
      id="invoice-pdf-preview"
      className="relative w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-2xl rounded-2xl overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}
    >
      {/* Background Soft Peach/Orange Gradient Aura Blur Circles */}
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-gradient-to-br from-orange-300/50 via-pink-200/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-gradient-to-tr from-orange-300/40 via-pink-200/30 to-transparent blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header Row */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-sm font-extrabold text-neutral-900 tracking-wider uppercase">
              {formData.senderCompany || formData.senderName || "SevenX Labs"}
            </h2>
            <p className="text-xs italic text-neutral-600 font-serif mt-1">
              &quot;Elevate Your Style: Unleash Fashion.&quot;
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <h1 className="text-5xl font-black text-neutral-900 tracking-tight leading-none mb-3">
              Invoice
            </h1>
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-4 py-1.5 rounded-full text-[10px] font-mono font-bold shadow-md">
              <span>Invoice No: <strong>{formData.invoiceNumber}</strong></span>
              <span className="text-neutral-500">|</span>
              <span>Date: <strong>{formatDate(formData.invoiceDate)}</strong></span>
            </div>
          </div>
        </div>

        {/* Invoice To Section */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-neutral-400 block mb-1">Invoice To</span>
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500" />
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
              {formData.clientName || "Sandira Maulia"}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-600 font-medium ml-5">
            {formData.clientPhone && <span>📞 {formData.clientPhone}</span>}
            {formData.clientAddress && <span>📍 {formData.clientAddress}</span>}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 overflow-hidden rounded-xl border border-neutral-200/80 shadow-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-neutral-100/80 text-neutral-600 font-extrabold uppercase text-[9px] tracking-wider border-b border-neutral-200">
                <th className="py-3 px-4">ITEM DESCRIPTION</th>
                <th className="py-3 px-4 text-right">UNIT PRICE</th>
                <th className="py-3 px-4 text-center">QUANTITY</th>
                <th className="py-3 px-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {formData.items.map((item: InvoiceItem, index: number) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}>
                  <td className="py-3.5 px-4 font-bold text-neutral-800">{item.description || "Service Item"}</td>
                  <td className="py-3.5 px-4 text-right text-neutral-600 font-mono">{formatCurrency(item.rate, "₹")}</td>
                  <td className="py-3.5 px-4 text-center text-neutral-700 font-bold font-mono">{String(item.quantity).padStart(2, "0")}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-neutral-900 font-mono">{formatCurrency(item.amount, "₹")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals Section */}
        <div className="flex justify-end mb-10 pr-2">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-6 text-xs text-neutral-500 font-bold uppercase tracking-wider">
              <span>SUB TOTAL</span>
              <span className="font-mono text-neutral-800">{formatCurrency(formData.subtotal, "₹")}</span>
            </div>
            <div className="flex items-center gap-6 mt-2">
              <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">TOTAL</span>
              <span className="text-3xl font-black text-neutral-900 font-mono tracking-tight">
                {formatCurrency(formData.total, "₹")}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Row: Left Black Banner + Right Terms & Signatory */}
        <div className="grid grid-cols-12 gap-4 items-center pt-4">
          {/* Left Dark Slate Banner Block */}
          <div className="col-span-6 bg-[#1a1a1a] text-white p-5 rounded-2xl shadow-xl flex flex-col gap-2">
            <h4 className="text-xs font-black tracking-widest uppercase text-white border-b border-neutral-800 pb-2">
              THANKS FOR YOUR BUSINESS
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-300 font-medium pt-1">
              <div>📞 {formData.senderPhone || "+91 98765 43210"}</div>
              <div>🌐 www.sevenxlabs.com</div>
              <div>✉️ {formData.senderEmail || "hello@sevenxlabs.com"}</div>
              <div>📍 {formData.senderAddress || "123 Your Address St."}</div>
            </div>
          </div>

          {/* Right Terms & Signature Block */}
          <div className="col-span-6 pl-4 flex flex-col justify-between h-full">
            <div>
              <h4 className="text-[11px] font-extrabold text-neutral-900 uppercase tracking-wider mb-2">
                TERM & CONDITIONS
              </h4>
              <ul className="text-[10px] text-neutral-600 space-y-1">
                <li className="flex items-start gap-1.5">
                  <CheckSquare className="w-3 h-3 text-neutral-900 shrink-0 mt-0.5" />
                  <span>Payment is required as per agreed milestone terms.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckSquare className="w-3 h-3 text-neutral-900 shrink-0 mt-0.5" />
                  <span>Includes standard warranty for agreed specifications.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-end mt-4">
              <span className="text-xs font-bold text-neutral-900 font-mono">{formData.senderName || "Sahil Hode"}</span>
              <span className="inline-block px-3 py-0.5 bg-[#1a1a1a] text-white text-[9px] font-black uppercase tracking-widest rounded-full mt-1">
                MANAGER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Script Signature */}
      <div className="relative z-10 pt-4 flex justify-between items-center text-xs italic font-serif text-neutral-500 border-t border-neutral-200/60 mt-6">
        <span>{formData.note || "Thanks For Order"}</span>
        <span className="not-italic text-[10px] font-mono text-neutral-400">SevenX Labs Studio</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-pink-100 text-pink-700">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Invoice Generator</h1>
            <p className="text-xs text-neutral-600 font-medium">Fill out details on the left to see instant A4 preview on the right</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFloatingPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 font-bold text-xs hover:bg-[#D5CEBC] transition cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <ExportDropdown
            onExportPDF={handleExportPDF}
            onExportDOCX={handleExportDOCX}
            onExportPNG={handleExportImage}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          {/* Invoice Meta Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Invoice #</label>
              <input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Date</label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Sender Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-pink-600" />
              <span>Your Details (Sender)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name / Studio Name"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Company Name (Optional)"
                value={formData.senderCompany}
                onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={formData.senderEmail}
                onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.senderPhone}
                onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Studio Address"
              rows={2}
              value={formData.senderAddress}
              onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
              className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Client Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Client Details (Billed To)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Client Company"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="email"
                placeholder="Client Email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
              <input
                type="text"
                placeholder="Client Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Client Address"
              rows={2}
              value={formData.clientAddress}
              onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
              className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Dynamic Items Table */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">Line Items</h3>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-pink-700 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {formData.items.map((item: InvoiceItem) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0]">
                  <div className="col-span-6 sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Item Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      className="w-full bg-transparent border-none text-xs text-neutral-900 font-medium focus:outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                      className="w-full bg-[#EBE7DC] border border-[#E2DDD0] rounded-lg px-2 py-1 text-xs text-center font-bold text-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                      className="w-full bg-[#EBE7DC] border border-[#E2DDD0] rounded-lg px-2 py-1 text-xs text-right font-bold text-neutral-900 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-pink-700 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Payment Method & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment Details</span>
              </h3>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
              >
                <option value="UPI">UPI Payment</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="PayPal">PayPal</option>
              </select>
              <textarea
                placeholder="Payment Details (UPI ID / Account No / IFSC)"
                rows={3}
                value={formData.paymentDetails}
                onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
              />
            </div>

            {/* Calculations Summary */}
            <div className="flex flex-col gap-2 bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0] text-xs text-neutral-800">
              <div className="flex justify-between py-1">
                <span>Subtotal:</span>
                <span className="font-bold text-neutral-900">{formatCurrency(formData.subtotal, "₹")}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Discount (%):</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.discountPercent}
                  onChange={(e) => handleDiscountTaxChange("discountPercent", Number(e.target.value))}
                  className="w-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded px-2 py-0.5 text-right text-xs font-bold text-neutral-900"
                />
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Tax (%):</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.taxPercent}
                  onChange={(e) => handleDiscountTaxChange("taxPercent", Number(e.target.value))}
                  className="w-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded px-2 py-0.5 text-right text-xs font-bold text-neutral-900"
                />
              </div>
              <hr className="border-[#D5CEBC] my-1" />
              <div className="flex justify-between py-1 text-sm font-extrabold text-neutral-900">
                <span>Grand Total:</span>
                <span className="text-pink-700">{formatCurrency(formData.total, "₹")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live A4 PDF Preview</span>
            <span className="text-[11px] text-neutral-500 font-semibold">Updates dynamically</span>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            {invoicePreviewContent}
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Invoice Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Invoice #{formData.invoiceNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <ExportDropdown
                  onExportPDF={handleExportPDF}
                  onExportDOCX={handleExportDOCX}
                  onExportPNG={handleExportImage}
                  isExporting={isExporting}
                />
                <button
                  onClick={() => setShowFloatingPreview(false)}
                  className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 bg-neutral-950/20 rounded-2xl flex justify-center">
              {invoicePreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
