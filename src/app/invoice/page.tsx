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
    
    senderName: "",
    senderCompany: "",
    senderAddress: "",
    senderEmail: "",
    senderPhone: "",
    
    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    
    paymentMethod: "UPI",
    paymentDetails: "",
    
    items: [
      {
        id: "item-1",
        description: "Full Stack Web Application Development",
        quantity: 1,
        rate: 250000,
        amount: 250000,
      },
    ],
    
    subtotal: 250000,
    discountPercent: 0,
    discountAmount: 0,
    taxPercent: 0,
    taxAmount: 0,
    total: 250000,
    
    note: "This is not a GST invoice.",
    status: "sent",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getNextInvoiceNumberDB()]).then(([profile, invNum]) => {
      setFormData((prev: InvoiceData) => ({
        ...prev,
        invoiceNumber: invNum,
        senderName: profile.name || "SevenX Labs",
        senderCompany: profile.company || "SevenX Labs Studio",
        senderAddress: profile.address || "",
        senderEmail: profile.email || "",
        senderPhone: profile.phone || "",
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
      className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start border-b border-neutral-200 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              {formData.senderCompany || formData.senderName || "SevenX Labs"}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{formData.senderAddress}</p>
            <p className="text-xs text-neutral-500">{formData.senderEmail} {formData.senderPhone && `| ${formData.senderPhone}`}</p>
          </div>

          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-neutral-900 text-white font-bold text-xs uppercase tracking-widest rounded">
              INVOICE
            </span>
            <p className="text-sm font-bold text-neutral-800 mt-2 font-mono">{formData.invoiceNumber}</p>
            <p className="text-xs text-neutral-500 mt-0.5">Date: {formatDate(formData.invoiceDate)}</p>
            <p className="text-xs text-neutral-500">Due: {formatDate(formData.dueDate)}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
            BILLED TO:
          </span>
          <h3 className="text-sm font-bold text-neutral-900">{formData.clientName || "Client Name"}</h3>
          {formData.clientCompany && <p className="text-xs text-neutral-600">{formData.clientCompany}</p>}
          {formData.clientAddress && <p className="text-xs text-neutral-500 whitespace-pre-line mt-0.5">{formData.clientAddress}</p>}
          {formData.clientEmail && <p className="text-xs text-neutral-500 mt-0.5">{formData.clientEmail}</p>}
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-xs mb-8">
          <thead>
            <tr className="border-b-2 border-neutral-900 text-neutral-700 font-bold uppercase text-[10px]">
              <th className="py-2.5">Description</th>
              <th className="py-2.5 text-center">Qty</th>
              <th className="py-2.5 text-right">Rate</th>
              <th className="py-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {formData.items.map((item: InvoiceItem) => (
              <tr key={item.id}>
                <td className="py-3 font-medium text-neutral-800">{item.description || "Service Description"}</td>
                <td className="py-3 text-center text-neutral-600">{item.quantity}</td>
                <td className="py-3 text-right text-neutral-600">{formatCurrency(item.rate, "₹")}</td>
                <td className="py-3 text-right font-semibold text-neutral-900">{formatCurrency(item.amount, "₹")}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64 flex flex-col gap-1 text-xs">
            <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-neutral-800">{formatCurrency(formData.subtotal, "₹")}</span>
            </div>
            {formData.discountPercent > 0 && (
              <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                <span>Discount ({formData.discountPercent}%):</span>
                <span className="text-emerald-600">-{formatCurrency(formData.discountAmount, "₹")}</span>
              </div>
            )}
            {formData.taxPercent > 0 && (
              <div className="flex justify-between py-1 border-b border-neutral-100 text-neutral-600">
                <span>Tax ({formData.taxPercent}%):</span>
                <span>+{formatCurrency(formData.taxAmount, "₹")}</span>
              </div>
            )}
            <div className="flex justify-between py-2 border-b-2 border-neutral-900 text-sm font-bold text-neutral-900">
              <span>Total Due:</span>
              <span>{formatCurrency(formData.total, "₹")}</span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
          <span className="font-bold text-neutral-900 block mb-1">Payment Method: {formData.paymentMethod}</span>
          <p className="text-neutral-600 whitespace-pre-line">{formData.paymentDetails}</p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="border-t border-neutral-200 pt-4 mt-8 text-center text-[10px] text-neutral-500 font-medium">
        <p>{formData.note || "This is not a GST invoice."}</p>
        <p className="mt-1 text-neutral-400">Thank you for your business! — SevenX Labs</p>
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
