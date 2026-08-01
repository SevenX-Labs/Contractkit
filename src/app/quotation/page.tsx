"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextQuotationNumberDB, createQuotationDB } from "../actions";
import { QuotationData, QuotationItem } from "../../types";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernQuotationTemplate } from "../../components/quotation/ModernQuotationTemplate";
import {
  FileCheck,
  Plus,
  Trash2,
  Save,
  User,
  Building,
  Eye,
  X,
  Calculator,
  Calendar,
  Briefcase,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

export default function QuotationPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);
  const [accentTheme, setAccentTheme] = useState<"lime" | "purple" | "pink" | "emerald">("lime");

  const [quoSeq, setQuoSeq] = useState("000001");

  const defaultTerms = [
    "This quotation is valid for 30 days from the date of issue.",
    "50% advance payment is required to start the project.",
    "The balance 50% payment will be charged on project completion.",
    "Any additional work or changes in scope will be charged extra.",
    "Delivery timeline may vary based on client feedback and content.",
    "All payments are non-refundable.",
  ];

  const [formData, setFormData] = useState<QuotationData>({
    quotationNumber: `SXL-QUO-${new Date().getFullYear()}-000001`,
    quotationDate: new Date().toISOString().split("T")[0],
    validityDays: 30,
    validUntilDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],

    projectName: "",
    preparedBy: "SevenX Labs",
    currency: "INR (Indian Rupees)",
    paymentTerms: "50% Advance, 50% on Completion",
    deliveryTime: "4 - 6 Weeks",

    senderName: "Sahil Hode",
    senderCompany: "SevenX Labs",
    senderAddress: "Thane, Mumbai, Maharashtra",
    senderEmail: "sevenxlabs07@gmail.com",
    senderPhone: "+91 8652601566",
    senderWebsite: "www.sevenxlabs.com",

    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",
    clientWebsite: "",
    clientGstin: "",

    items: [],

    subtotal: 0,
    gstPercent: 0,
    gstAmount: 0,
    totalAmount: 0,

    termsAndConditions: defaultTerms,
    signatoryName: "Sahil Hode",
    designation: "Founder",
    status: "sent",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    const savedEdit = localStorage.getItem("edit_quotation");
    if (savedEdit) {
      try {
        const parsed = JSON.parse(savedEdit);
        setFormData(parsed);
        localStorage.removeItem("edit_quotation");
        toast.success("Document loaded into editor!");
        return;
      } catch (e) {}
    }

    Promise.all([getProfileDB(), getNextQuotationNumberDB()]).then(([profile, quoNum]) => {
      const seq = quoNum.split("-").pop() || "000001";
      setQuoSeq(seq);

      setFormData((prev) => ({
        ...prev,
        quotationNumber: quoNum,
        senderName: profile.name || "Sahil Hode",
        senderCompany: "SevenX Labs",
        senderAddress: profile.address || "Thane, Mumbai, Maharashtra",
        senderEmail: profile.email || "contact@sevenxlabs.com",
        senderPhone: profile.phone || "+91 98765 43210",
        bankName: profile.bankName || "HDFC Bank",
        bankAccount: profile.bankAccount || "50100234567890",
        bankIfsc: profile.bankIfsc || "HDFC0001234",
        upiId: profile.upiId || "sevenxlabs@upi",
      }));
    });
  }, []);

  // Update validity target date when quotation date or validity days change
  const handleValidityDaysChange = (days: number) => {
    const qDate = new Date(formData.quotationDate || Date.now());
    const validUntil = new Date(qDate.getTime() + days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      validityDays: days,
      validUntilDate: validUntil,
    }));
  };

  const calculateTotals = (items: QuotationItem[], gstPct: number) => {
    const sub = items.reduce((acc, item) => acc + item.amount, 0);
    const gstAmt = (sub * gstPct) / 100;
    const total = sub + gstAmt;
    return { subtotal: sub, gstAmount: gstAmt, totalAmount: total };
  };

  const updateItem = (id: string, field: keyof QuotationItem, value: string | number) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
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

      const totals = calculateTotals(updatedItems, prev.gstPercent);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: `q-${Date.now()}`,
      description: "",
      miniDescription: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length === 1) {
      toast.error("Quotation must have at least one line item.");
      return;
    }
    setFormData((prev) => {
      const updatedItems = prev.items.filter((i) => i.id !== id);
      const totals = calculateTotals(updatedItems, prev.gstPercent);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const updateTerm = (index: number, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.termsAndConditions];
      updated[index] = val;
      return { ...prev, termsAndConditions: updated };
    });
  };

  const addTerm = () => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, "New custom condition."],
    }));
  };

  const removeTerm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error("Please enter a client name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createQuotationDB(formData);
    setIsSaving(false);

    if (res.success) {
      const nextQuo = await getNextQuotationNumberDB();
      setFormData((prev) => ({ ...prev, quotationNumber: nextQuo }));
      toast.success(`Quotation #${formData.quotationNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving quotation: ${res.error}`);
    }
  };

  const handleExportPDF = async () => {
    await handleSave();
    await exportToPDF("quotation-pdf-preview", `${formData.quotationNumber}.pdf`);
  };

  const handleExportDOCX = async () => {
    await handleSave();
    await exportToDOCX("quotation-pdf-preview", `${formData.quotationNumber}.docx`);
  };

  const handleExportImage = async () => {
    await handleSave();
    await exportToImage("quotation-pdf-preview", `${formData.quotationNumber}.png`);
  };

  const quotationPreviewContent = (
    <ModernQuotationTemplate
      id="quotation-pdf-preview"
      quotationNumber={formData.quotationNumber}
      quotationDate={formData.quotationDate}
      validityDays={formData.validityDays}
      validUntilDate={formData.validUntilDate}
      projectName={formData.projectName}
      preparedBy={formData.preparedBy}
      currency={formData.currency}
      paymentTerms={formData.paymentTerms}
      deliveryTime={formData.deliveryTime}
      senderName={formData.senderName}
      senderCompany={formData.senderCompany}
      senderAddress={formData.senderAddress}
      senderEmail={formData.senderEmail}
      senderPhone={formData.senderPhone}
      senderWebsite={formData.senderWebsite}
      clientName={formData.clientName}
      clientCompany={formData.clientCompany}
      clientAddress={formData.clientAddress}
      clientEmail={formData.clientEmail}
      clientPhone={formData.clientPhone}
      clientWebsite={formData.clientWebsite}
      clientGstin={formData.clientGstin}
      items={formData.items}
      subtotal={formData.subtotal}
      gstPercent={formData.gstPercent}
      gstAmount={formData.gstAmount}
      totalAmount={formData.totalAmount}
      termsAndConditions={formData.termsAndConditions}
      signatoryName={formData.signatoryName}
      designation={formData.designation}
      currencySymbol="₹"
      accentColor={accentTheme}
    />
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-lime-100 text-lime-800">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Enterprise Quotation Studio</h1>
            <p className="text-xs text-neutral-600 font-medium">Recreated matching corporate pitch quotation design sample</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Accent Color Switcher */}
          <div className="flex items-center gap-1 bg-[#F4F0E6] p-1 rounded-full border border-[#E2DDD0] mr-2">
            <button
              onClick={() => setAccentTheme("lime")}
              className={`w-6 h-6 rounded-full bg-[#a6ce39] border-2 ${accentTheme === "lime" ? "border-black scale-110" : "border-transparent"}`}
              title="Lime Theme"
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a0a0a] hover:bg-neutral-800 text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <Save className="w-4 h-4 text-[#a6ce39]" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
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
          {/* Quotation Meta Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Quotation No.</label>
              <div className="flex items-center bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl overflow-hidden shadow-xs">
                <span className="px-3 py-2 bg-[#DFD9C9] text-xs font-mono font-extrabold text-neutral-800 border-r border-[#E2DDD0] select-none whitespace-nowrap">
                  SXL-QUO-{new Date().getFullYear()}-
                </span>
                <input
                  type="text"
                  value={quoSeq}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setQuoSeq(val);
                    const year = new Date().getFullYear();
                    setFormData((prev) => ({
                      ...prev,
                      quotationNumber: `SXL-QUO-${year}-${val.padStart(6, "0")}`,
                    }));
                  }}
                  placeholder="000001"
                  className="flex-1 bg-transparent px-3 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5">Quotation Date</label>
              <input
                type="date"
                value={formData.quotationDate}
                onChange={(e) => {
                  const d = e.target.value;
                  setFormData((prev) => {
                    const qDate = new Date(d || Date.now());
                    const validUntil = new Date(qDate.getTime() + prev.validityDays * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0];
                    return { ...prev, quotationDate: d, validUntilDate: validUntil };
                  });
                }}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Validity & Project Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-lime-700" />
                <span>Validity Period (Days)</span>
              </label>
              <select
                value={formData.validityDays}
                onChange={(e) => handleValidityDaysChange(Number(e.target.value))}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
              >
                <option value={7}>7 Days</option>
                <option value={15}>15 Days</option>
                <option value={30}>30 Days (Standard)</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-lime-700" />
                <span>Project Name</span>
              </label>
              <input
                type="text"
                placeholder="Project Name"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Prepared By, Currency, Payment Terms, Delivery Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Prepared By</label>
              <input
                type="text"
                value={formData.preparedBy}
                onChange={(e) => setFormData({ ...formData, preparedBy: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Currency</label>
              <input
                type="text"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Payment Terms</label>
              <input
                type="text"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Delivery Time</label>
              <input
                type="text"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Client Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-lime-700" />
              <span>Client Information (QUOTATION TO.)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client / Company Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value, clientCompany: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
              />
              <input
                type="text"
                placeholder="GSTIN Number"
                value={formData.clientGstin || ""}
                onChange={(e) => setFormData({ ...formData, clientGstin: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono focus:outline-none"
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
            <input
              type="text"
              placeholder="Client Website (e.g. www.abcpvtltd.com)"
              value={formData.clientWebsite || ""}
              onChange={(e) => setFormData({ ...formData, clientWebsite: e.target.value })}
              className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
            />
            <textarea
              placeholder="Client Billing Address"
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
                className="flex items-center gap-1 text-xs font-bold text-lime-800 hover:text-neutral-900 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {formData.items.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-2 bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0]">
                  <div className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-1 text-center font-mono font-bold text-xs text-lime-800">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Item Title (e.g. Website Design & Development)"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        className="w-full bg-transparent border-none text-xs text-neutral-900 font-bold focus:outline-none"
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
                    <div className="col-span-3">
                      <input
                        type="number"
                        min={0}
                        placeholder="Rate (₹)"
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

                  {/* Subtitle detail scope description line */}
                  <input
                    type="text"
                    placeholder="Subtitle scope description (e.g. Responsive design and development of complete website.)"
                    value={item.miniDescription || ""}
                    onChange={(e) => updateItem(item.id, "miniDescription", e.target.value)}
                    className="w-full bg-white/60 border border-[#E2DDD0] rounded-lg px-2.5 py-1 text-[11px] text-neutral-700 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* GST Tax & Grand Total Banner */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">GST Tax (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.gstPercent}
                  onChange={(e) => {
                    const pct = Number(e.target.value);
                    const totals = calculateTotals(formData.items, pct);
                    setFormData({ ...formData, gstPercent: pct, ...totals });
                  }}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Tax Amount</label>
                <div className="bg-[#DFD9C9] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900">
                  ₹{formData.gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Total Summary Banner */}
            <div className="flex items-center justify-between bg-[#F4F0E6] px-5 py-4 rounded-2xl border border-[#E2DDD0] shadow-xs">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-lime-200 text-lime-900">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-neutral-900 block">Total Quotation Value</span>
                  <span className="text-[10px] text-neutral-500 font-medium">Includes Subtotal + GST ({formData.gstPercent}%)</span>
                </div>
              </div>
              <span className="text-2xl font-black font-mono text-lime-800 tracking-tight">
                ₹{formData.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Terms & Conditions Editor */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-3.5 h-3.5 text-lime-800" />
                <span>Terms & Conditions</span>
              </h3>
              <button
                onClick={addTerm}
                className="flex items-center gap-1 text-xs font-bold text-lime-800 hover:text-neutral-900 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Condition</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {formData.termsAndConditions.map((term, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#F4F0E6] p-2 rounded-xl border border-[#E2DDD0]">
                  <span className="text-xs font-bold text-lime-800 pl-1">•</span>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => updateTerm(idx, e.target.value)}
                    className="flex-1 bg-transparent border-none text-xs text-neutral-900 font-medium focus:outline-none"
                  />
                  <button
                    onClick={() => removeTerm(idx)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-pink-700 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live A4 Pixel-Perfect Preview</span>
            <span className="text-[11px] text-neutral-500 font-semibold">Updates dynamically</span>
          </div>

          <div className="w-full bg-[#DFD9C9] p-4 rounded-3xl border border-[#D5CEBC] shadow-inner flex flex-col items-center justify-start min-h-[600px] overflow-hidden">
            <div className="w-full flex justify-center overflow-hidden py-1">
              <div
                className="origin-top transition-transform duration-300 shadow-2xl rounded-2xl shrink-0"
                style={{
                  transform: "scale(0.54)",
                  width: "210mm",
                  marginBottom: "calc(-297mm * 0.46)",
                }}
              >
                {quotationPreviewContent}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Quotation Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Quotation #{formData.quotationNumber}</p>
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
              {quotationPreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
