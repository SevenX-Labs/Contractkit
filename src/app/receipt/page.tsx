"use client";

import React, { useState, useEffect } from "react";
import {
  Receipt as ReceiptIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Save,
  User,
  Wallet,
  CreditCard,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ModernReceiptTemplate, ReceiptItem } from "../../components/receipt/ModernReceiptTemplate";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { createReceiptDB, getNextReceiptNumberDB, getProfileDB } from "../actions";

export default function ReceiptBuilderPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
  const [accentColor, setAccentColor] = useState<"lime" | "purple" | "pink" | "emerald">("lime");

  const [formData, setFormData] = useState({
    receiptNumber: "SXL-RC-2026-000201",
    date: new Date().toISOString().split("T")[0],

    clientName: "",
    clientAddress: "",
    clientGstin: "",

    providerName: "SevenX Labs",
    providerAddress: "Thane, Mumbai, Maharashtra, India",
    providerGstin: "",
    providerEmail: "sevenxlabs07@gmail.com",
    providerPhone: "+91 8652601566",

    amountReceived: 0,
    amountInWords: "",

    paymentFor: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Bank Transfer",
    transactionId: "",
    paymentDate: new Date().toISOString().split("T")[0],

    items: [] as ReceiptItem[],
    subtotal: 0,
    taxPct: 0,
    taxAmount: 0,
    totalReceived: 0,

    notes: "",
    signatoryName: "Sahil Hode",
    designation: "Founder",
  });

  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: true,
    4: false,
    5: false,
  });

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const savedEdit = localStorage.getItem("edit_receipt");
    if (savedEdit) {
      try {
        const parsed = JSON.parse(savedEdit);
        setFormData(parsed);
        localStorage.removeItem("edit_receipt");
        toast.success("Document loaded into editor!");
        return;
      } catch (e) {}
    }

    Promise.all([getProfileDB(), getNextReceiptNumberDB()]).then(([profile, num]) => {
      setFormData((prev) => ({
        ...prev,
        receiptNumber: num,
        providerName: profile.company || "SevenX Labs",
        providerAddress: profile.address || "Diva, Thane, Maharashtra, India",
        providerEmail: profile.email || "contact@sevenxlabs.com",
        providerPhone: profile.phone || "+91 98765 43210",
        signatoryName: profile.name || "Sahil Hode",
        bankName: profile.bankName || "HDFC Bank",
        bankAccount: profile.bankAccount || "50100234567890",
        bankIfsc: profile.bankIfsc || "HDFC0001234",
        upiId: profile.upiId || "sevenxlabs@upi",
      }));
    });
  }, []);

  const handleSaveToDB = async () => {
    try {
      setIsSaving(true);
      const res = await createReceiptDB(formData);
      if (res.success) {
        alert(`Payment Receipt saved successfully to database! Record ID: ${res.id}`);
      } else {
        alert(`Failed to save receipt: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddItem = () => {
    const newItem: ReceiptItem = {
      id: Date.now().toString(),
      description: "Additional Payment Item",
      amount: 1000,
    };
    const updatedItems = [...formData.items, newItem];
    recalculateTotals(updatedItems, formData.taxPct);
  };

  const handleRemoveItem = (id: string) => {
    const updatedItems = formData.items.filter((item) => item.id !== id);
    recalculateTotals(updatedItems, formData.taxPct);
  };

  const handleUpdateItem = (id: string, field: "description" | "amount", val: any) => {
    const updatedItems = formData.items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: field === "amount" ? parseFloat(val) || 0 : val };
      }
      return item;
    });
    recalculateTotals(updatedItems, formData.taxPct);
  };

  const recalculateTotals = (itemsList: ReceiptItem[], taxP: number) => {
    const sub = itemsList.reduce((acc, item) => acc + item.amount, 0);
    const taxA = (sub * taxP) / 100;
    const tot = sub + taxA;

    setFormData((prev) => ({
      ...prev,
      items: itemsList,
      subtotal: sub,
      taxPct: taxP,
      taxAmount: taxA,
      totalReceived: tot,
      amountReceived: tot,
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-neutral-900 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#EBE7DC]/90 backdrop-blur-md border-b border-[#E2DDD0] px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0a0a0a] text-white rounded-xl shadow-xs">
            <ReceiptIcon className="w-5 h-5 text-[#a6ce39]" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              Payment Receipt Builder
              <span className="text-[10px] font-extrabold bg-[#a6ce39] text-neutral-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Generate payment confirmation receipts, totals & transaction proof
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Accent Color Switcher */}
          <div className="flex items-center bg-[#DFD9C9] p-1 rounded-xl gap-1">
            {(["lime", "purple", "pink", "emerald"] as const).map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-6 h-6 rounded-lg transition-transform ${
                  accentColor === color ? "scale-110 ring-2 ring-neutral-900 shadow-xs" : "opacity-70 hover:opacity-100"
                } ${
                  color === "lime"
                    ? "bg-[#a6ce39]"
                    : color === "purple"
                    ? "bg-purple-600"
                    : color === "pink"
                    ? "bg-pink-600"
                    : "bg-emerald-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsModalPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#DFD9C9] hover:bg-[#D5CEBC] text-neutral-900 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-neutral-700" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSaveToDB}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <Save className="w-4 h-4 text-[#a6ce39]" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>

          {/* Export As Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#a6ce39] hover:bg-[#95bd2f] text-neutral-900 rounded-xl font-extrabold text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export As</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <div className="absolute right-0 mt-1 w-44 bg-[#0a0a0a] text-white rounded-2xl p-1.5 shadow-xl border border-neutral-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToPDF("receipt-export-container", `${formData.receiptNumber}.pdf`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export PDF</span>
                <span className="text-[10px] text-[#a6ce39]">.pdf</span>
              </button>

              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToDOCX("receipt-export-container", `${formData.receiptNumber}.docx`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export DOCX</span>
                <span className="text-[10px] text-blue-400">.docx</span>
              </button>

              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToImage("receipt-export-container", `${formData.receiptNumber}.png`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export PNG Image</span>
                <span className="text-[10px] text-pink-400">.png</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Panel */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* SECTION 1: Receipt Header & Client Details */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(1)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-700" />
                  <span>SECTION 1: Receipt & Client Details</span>
                </div>
                {openSections[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[1] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Receipt #</label>
                      <input
                        type="text"
                        value={formData.receiptNumber}
                        onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Receipt Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Paid By (Client Name)</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Client Address</label>
                    <input
                      type="text"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Amount Banner & Payment Details */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(2)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-neutral-700" />
                  <span>SECTION 2: Amount & Payment Details</span>
                </div>
                {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[2] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Payment For</label>
                    <input
                      type="text"
                      value={formData.paymentFor}
                      onChange={(e) => setFormData({ ...formData, paymentFor: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Amount In Words</label>
                    <input
                      type="text"
                      value={formData.amountInWords}
                      onChange={(e) => setFormData({ ...formData, amountInWords: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Invoice No.</label>
                      <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Payment Method</label>
                      <input
                        type="text"
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Transaction ID</label>
                      <input
                        type="text"
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Payment Date</label>
                      <input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Itemized Table */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(3)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <span>SECTION 3: Itemized Amounts</span>
                {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[3] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  {formData.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                        className="flex-1 bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                      />
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleUpdateItem(item.id, "amount", e.target.value)}
                        className="w-28 bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-neutral-900 text-right"
                      />
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-[#DFD9C9] hover:bg-[#D5CEBC] px-3 py-1.5 rounded-xl w-fit cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 4: Notes & Signatory */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(4)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <span>SECTION 4: Notes & Signatory</span>
                {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[4] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Settlement Notes</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D5CEBC]">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Signatory Name</label>
                      <input
                        type="text"
                        value={formData.signatoryName}
                        onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Stage Container */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-20">
            <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6ce39] animate-pulse" />
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Live Receipt Preview
                </h3>
              </div>
            </div>

            {/* Document Stage */}
            <div className="w-full bg-[#DFD9C9] p-3 sm:p-4 rounded-3xl border border-[#D5CEBC] shadow-inner overflow-x-auto flex justify-center items-start">
              <div
                className="origin-top transition-transform duration-300 shadow-2xl rounded-2xl shrink-0"
                style={{
                  transform: "scale(0.48)",
                  width: "210mm",
                  marginBottom: "calc(-297mm * 0.52)",
                }}
              >
                <ModernReceiptTemplate
                  {...formData}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Offscreen Container for PDF/DOCX/PNG Exports */}
      <div className="hidden">
        <div id="receipt-export-container">
          <ModernReceiptTemplate
            {...formData}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}
