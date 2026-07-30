"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextInvoiceNumberDB, createInvoiceDB } from "../actions";
import { InvoiceData, InvoiceItem, PaymentMethod } from "../../types";
import { calculateInvoiceTotals } from "../../lib/utils";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernInvoiceTemplate } from "../../components/invoice/ModernInvoiceTemplate";
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
} from "lucide-react";
import { toast } from "sonner";

export default function InvoicePage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);
  const [accentTheme, setAccentTheme] = useState<"lime" | "purple" | "pink" | "emerald">("lime");

  const [formData, setFormData] = useState<InvoiceData>({
    invoiceNumber: "SXL-INV-2026-000001",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    
    senderName: "Sahil Hode",
    senderCompany: "SevenX Labs",
    senderAddress: "Thane, Mumbai, Maharashtra",
    senderEmail: "sevenxlabs07@gmail.com",
    senderPhone: "8652601566",
    
    clientName: "Sophia Smith",
    clientCompany: "Acme Global",
    clientAddress: "100 Tech Plaza, Suite 400, Tech District, CA",
    clientEmail: "mail@mail.com",
    clientPhone: "+123-456-7890",
    
    paymentMethod: "Payment Method.",
    paymentDetails: "Holder Name: Sahil Hode (SevenX Labs) | Bank Name: HDFC Bank | Account No: 50100234567890 | IFSC Code: HDFC0001234",
    
    items: [
      { id: "item-1", description: "Website Design and Development", quantity: 1, rate: 1230, amount: 1230 },
      { id: "item-2", description: "Custom Graphic Design", quantity: 3, rate: 300, amount: 900 },
      { id: "item-3", description: "Content Management System (CMS) Integration", quantity: 5, rate: 190, amount: 950 },
      { id: "item-4", description: "SEO Friendly Design", quantity: 2, rate: 790, amount: 1580 },
      { id: "item-5", description: "E-commerce Integration", quantity: 3, rate: 673.33, amount: 2020 },
      { id: "item-6", description: "Site Maintenance and Updates", quantity: 4, rate: 85, amount: 340 },
    ],
    
    subtotal: 7020,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    total: 7020,
    
    note: "",
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
        senderAddress: profile.address || "Thane, Mumbai, Maharashtra",
        senderEmail: profile.email || "sevenxlabs07@gmail.com",
        senderPhone: profile.phone || "8652601566",
        paymentMethod: "Payment Method.",
        paymentDetails: `Holder Name: ${profile.name || "Sahil Hode (SevenX Labs)"} | Bank Name: ${profile.bankName || "HDFC Bank"} | Account No: ${profile.bankAccount || "50100234567890"} | IFSC Code: HDFC0001234`,
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
    <ModernInvoiceTemplate
      id="invoice-pdf-preview"
      invoiceNumber={formData.invoiceNumber}
      invoiceDate={formData.invoiceDate}
      dueDate={formData.dueDate}
      senderName={formData.senderName}
      senderCompany={formData.senderCompany}
      senderAddress={formData.senderAddress}
      senderEmail={formData.senderEmail}
      senderPhone={formData.senderPhone}
      clientName={formData.clientName}
      clientCompany={formData.clientCompany}
      clientAddress={formData.clientAddress}
      clientEmail={formData.clientEmail}
      clientPhone={formData.clientPhone}
      items={formData.items}
      subtotal={formData.subtotal}
      taxPercent={formData.taxPercent}
      taxAmount={formData.taxAmount}
      discountPercent={formData.discountPercent}
      discountAmount={formData.discountAmount}
      total={formData.total}
      paymentMethod={formData.paymentMethod}
      paymentDetails={formData.paymentDetails}
      terms={formData.note || "Web Design is the Digital face of your brand shaping user perceptions and driving engagement."}
      signatureName={formData.clientName || "Sophia Smith"}
      signatureTitle="Manager"
      currencySymbol="₹"
      accentColor={accentTheme}
    />
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
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Enterprise Invoice Studio</h1>
            <p className="text-xs text-neutral-600 font-medium">Recreated matching Dribbble & Behance premium corporate template</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Accent Color Switcher */}
          <div className="flex items-center gap-1 bg-[#F4F0E6] p-1 rounded-full border border-[#E2DDD0] mr-2">
            <button
              onClick={() => setAccentTheme("lime")}
              className={`w-6 h-6 rounded-full bg-[#c5e158] border-2 ${accentTheme === "lime" ? "border-black scale-110" : "border-transparent"}`}
              title="Lime Green Theme"
            />
            <button
              onClick={() => setAccentTheme("purple")}
              className={`w-6 h-6 rounded-full bg-purple-400 border-2 ${accentTheme === "purple" ? "border-black scale-110" : "border-transparent"}`}
              title="Purple Theme"
            />
            <button
              onClick={() => setAccentTheme("emerald")}
              className={`w-6 h-6 rounded-full bg-emerald-400 border-2 ${accentTheme === "emerald" ? "border-black scale-110" : "border-transparent"}`}
              title="Emerald Theme"
            />
          </div>

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
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Invoice No.</label>
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
              <span>Company Branding (Sender)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company Name *"
                value={formData.senderCompany}
                onChange={(e) => setFormData({ ...formData, senderCompany: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
              />
              <input
                type="text"
                placeholder="Sender Name"
                value={formData.senderName}
                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
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
              placeholder="Address"
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
              <span>Client Details (INVOICE TO.)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Full Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
              />
              <input
                type="text"
                placeholder="Client Phone"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
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
                placeholder="Client Company"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
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

          {/* Payment Details & Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment Details & Terms</span>
              </h3>
              <textarea
                placeholder="Payment Details (Bank, Account No, UPI)"
                rows={2}
                value={formData.paymentDetails}
                onChange={(e) => setFormData({ ...formData, paymentDetails: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
              />
              <textarea
                placeholder="Terms & Conditions"
                rows={2}
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
              />
            </div>

            {/* Calculations Summary */}
            <div className="flex flex-col gap-2 bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0] text-xs text-neutral-800">
              <div className="flex justify-between py-1">
                <span>Sub Total:</span>
                <span className="font-bold text-neutral-900">₹{formData.subtotal}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Tax Vat (%):</span>
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
                <span>Total :</span>
                <span className="text-pink-700">₹{formData.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live A4 Pixel-Perfect Preview</span>
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
