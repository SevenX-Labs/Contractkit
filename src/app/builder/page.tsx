"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getClientsDB, getClausesDB, getProjectsDB, createDocumentSuiteDB, getNextDocumentNumberDB } from "../actions";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  Wand2,
  Save,
  Download,
  FileText,
  Image as ImageIcon,
  Check,
  User,
  Building,
  Scale,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

const DOCUMENT_TYPES = [
  { id: "PROPOSAL", label: "Proposal & Pitch Deck", category: "Pre-Sales" },
  { id: "QUOTATION", label: "Quotation & Price Quote", category: "Pre-Sales" },
  { id: "INVOICE", label: "Tax Invoice", category: "Financial" },
  { id: "AGREEMENT", label: "Freelance Service Agreement", category: "Legal" },
  { id: "SOFTWARE_CONTRACT", label: "Software Development Contract", category: "Legal" },
  { id: "WEB_CONTRACT", label: "Website Development Contract", category: "Legal" },
  { id: "MOBILE_APP_CONTRACT", label: "Mobile App Contract", category: "Legal" },
  { id: "AMC_CONTRACT", label: "Maintenance & AMC Agreement", category: "Maintenance" },
  { id: "NDA", label: "Mutual NDA", category: "Legal" },
  { id: "CERTIFICATE", label: "Project Completion Certificate", category: "Handover" },
  { id: "PAYMENT_RECEIPT", label: "Payment Receipt", category: "Financial" },
  { id: "CHANGE_REQUEST", label: "Scope Change Agreement", category: "Legal" },
  { id: "HANDOVER_DOC", label: "Project Handover Document", category: "Handover" },
];

export default function DocumentStudioPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [clients, setClients] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [availableClauses, setAvailableClauses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    documentType: "SOFTWARE_CONTRACT",
    documentNumber: "SXL-SOF-001",
    title: "Software Development & Architecture Contract",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    
    // Freelancer
    senderName: "SevenX Labs",
    senderCompany: "SevenX Labs Studio",
    senderEmail: "hello@sevenxlabs.com",
    senderPhone: "+91 98765 43210",
    
    // Client
    selectedClientId: "",
    clientName: "Acme Tech Pvt Ltd",
    clientCompany: "Acme Tech Private Limited",
    clientEmail: "contracts@acmetech.in",
    clientAddress: "100 MG Road, Bengaluru, KA 560001",
    
    // Scope
    projectTitle: "Enterprise Next.js 16 Web Application & Mobile App",
    scopeDescription: "Design, full-stack development, cloud deployment, and API integration for modern customer SaaS platform.",
    deliverables: "- Next.js 16 App Router Web Portal\n- React Native iOS & Android Apps\n- PostgreSQL database setup\n- 30 days post-launch warranty",
    
    // Financials
    totalAmount: 350000,
    advanceDeposit: 175000,
    paymentTerms: "50% advance upon contract signing, 50% upon final deployment.",
    
    // Selected Clauses
    selectedClauses: [] as Array<{ id: string; title: string; content: string }>,
    
    // Signatures
    freelancerSignature: "SevenX Labs Representative",
    clientSignature: "Authorized Client Signatory",
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getClientsDB(), getProjectsDB(), getClausesDB()]).then(
      ([profile, clientList, projectList, clauseList]) => {
        setClients(clientList);
        setProjects(projectList);
        setAvailableClauses(clauseList);

        setFormData((prev) => ({
          ...prev,
          senderName: profile.name || "SevenX Labs",
          senderCompany: profile.company || "SevenX Labs Studio",
          senderEmail: profile.email || "hello@sevenxlabs.com",
          senderPhone: profile.phone || "+91 98765 43210",
          freelancerSignature: profile.name || "SevenX Labs",
        }));
      }
    );
  }, []);

  const handleDocumentTypeChange = async (type: string) => {
    const docNum = await getNextDocumentNumberDB(type);
    const docObj = DOCUMENT_TYPES.find((d) => d.id === type);
    setFormData((prev) => ({
      ...prev,
      documentType: type,
      documentNumber: docNum,
      title: docObj ? docObj.label : "Document",
    }));
  };

  const handleSelectClient = (clientId: string) => {
    const matched = clients.find((c) => c.id === clientId);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        selectedClientId: clientId,
        clientName: matched.name,
        clientCompany: matched.company || matched.name,
        clientEmail: matched.email,
        clientAddress: matched.billingAddress || "",
      }));
    }
  };

  const toggleClause = (clause: any) => {
    setFormData((prev) => {
      const exists = prev.selectedClauses.some((c) => c.id === clause.id);
      if (exists) {
        return {
          ...prev,
          selectedClauses: prev.selectedClauses.filter((c) => c.id !== clause.id),
        };
      } else {
        return {
          ...prev,
          selectedClauses: [...prev.selectedClauses, { id: clause.id, title: clause.title, content: clause.content }],
        };
      }
    });
  };

  const handleSave = async () => {
    if (!formData.clientName || !formData.projectTitle) {
      toast.error("Please fill Client Name and Project Title before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createDocumentSuiteDB({
      documentNumber: formData.documentNumber,
      title: `${formData.title} - ${formData.projectTitle}`,
      type: formData.documentType,
      totalAmount: formData.totalAmount,
      date: formData.date,
      dueDate: formData.dueDate,
      clientId: formData.selectedClientId,
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      contentJson: JSON.stringify(formData),
      clausesJson: JSON.stringify(formData.selectedClauses),
    });
    setIsSaving(false);

    if (res.success) {
      toast.success(`Document #${formData.documentNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving: ${res.error}`);
    }
  };

  const handleExportPDF = async () => {
    await handleSave();
    await exportToPDF("studio-pdf-preview", `${formData.documentNumber}.pdf`);
  };

  const handleExportDOCX = async () => {
    await handleSave();
    await exportToDOCX("studio-pdf-preview", `${formData.documentNumber}.docx`);
  };

  const handleExportImage = async () => {
    await handleSave();
    await exportToImage("studio-pdf-preview", `${formData.documentNumber}.png`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Enterprise Document Studio</h1>
            <p className="text-xs text-neutral-600 font-medium">Multi-step document builder for proposals, software agreements, AMCs, and NDAs</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 font-bold text-xs hover:bg-[#D5CEBC] transition"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            disabled={isExporting || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            onClick={handleExportDOCX}
            disabled={isExporting || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>DOCX</span>
          </button>

          <button
            onClick={handleExportImage}
            disabled={isExporting || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow-md hover:bg-purple-700 transition disabled:opacity-50"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>PNG</span>
          </button>
        </div>
      </div>

      {/* Stepper Navigation Indicator */}
      <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl">
        {[
          { step: 1, label: "1. Type & Parties" },
          { step: 2, label: "2. Scope & Terms" },
          { step: 3, label: "3. Financials & Clauses" },
          { step: 4, label: "4. Live Preview" },
        ].map((s) => (
          <button
            key={s.step}
            onClick={() => setCurrentStep(s.step)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition ${
              currentStep === s.step
                ? "bg-[#121212] text-white shadow"
                : currentStep > s.step
                ? "bg-emerald-100 text-emerald-900"
                : "bg-[#DFD9C9] text-neutral-600 hover:bg-[#D5CEBC]"
            }`}
          >
            {currentStep > s.step ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : null}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Stepper Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          {/* STEP 1: Document Type & Parties */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-2">Select Document Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DOCUMENT_TYPES.map((dt) => (
                    <button
                      key={dt.id}
                      type="button"
                      onClick={() => handleDocumentTypeChange(dt.id)}
                      className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1 ${
                        formData.documentType === dt.id
                          ? "bg-[#121212] text-white border-[#121212] shadow"
                          : "bg-[#F4F0E6] text-neutral-900 border-[#E2DDD0] hover:bg-[#DFD9C9]"
                      }`}
                    >
                      <span className="text-[10px] uppercase font-mono font-bold opacity-60">{dt.category}</span>
                      <span className="text-xs font-extrabold">{dt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-[#D5CEBC]" />

              {/* Select Client from CRM */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>Contracting Client</span>
                  </h3>
                  <span className="text-[11px] text-neutral-500 font-semibold">Auto-fills from CRM</span>
                </div>

                <select
                  value={formData.selectedClientId}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                >
                  <option value="">-- Choose Existing Client from CRM --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company || "Individual"})
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Name *</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company</label>
                    <input
                      type="text"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Email</label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scope & Deliverables */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-purple-700" />
                <span>Project Scope & Deliverables</span>
              </h3>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Detailed Description</label>
                <textarea
                  rows={4}
                  value={formData.scopeDescription}
                  onChange={(e) => setFormData({ ...formData, scopeDescription: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Milestone Deliverables</label>
                <textarea
                  rows={4}
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Financials & Legal Clauses */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Total Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Advance Deposit (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.advanceDeposit}
                    onChange={(e) => setFormData({ ...formData, advanceDeposit: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  />
                </div>
              </div>

              <hr className="border-[#D5CEBC]" />

              {/* Attach Legal Clauses */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Attach Legal Clauses ({formData.selectedClauses.length})</span>
                  </h3>
                </div>

                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                  {availableClauses.map((clause) => {
                    const isSelected = formData.selectedClauses.some((c) => c.id === clause.id);
                    return (
                      <div
                        key={clause.id}
                        onClick={() => toggleClause(clause)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition flex items-start justify-between ${
                          isSelected
                            ? "bg-emerald-100 border-emerald-300 text-emerald-950 font-bold"
                            : "bg-[#F4F0E6] border-[#E2DDD0] text-neutral-800 hover:bg-[#DFD9C9]"
                        }`}
                      >
                        <div>
                          <span className="text-[10px] text-emerald-800 uppercase font-mono block">{clause.category}</span>
                          <span className="font-extrabold block">{clause.title}</span>
                          <span className="text-[11px] text-neutral-600 font-normal line-clamp-1">{clause.content}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-1 ${isSelected ? "bg-emerald-700 text-white" : "bg-[#DFD9C9]"}`}>
                          {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Signatures */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">Digital Signatures</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Your Signature</label>
                  <input
                    type="text"
                    value={formData.freelancerSignature}
                    onChange={(e) => setFormData({ ...formData, freelancerSignature: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Signature</label>
                  <input
                    type="text"
                    value={formData.clientSignature}
                    onChange={(e) => setFormData({ ...formData, clientSignature: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Next / Previous Stepper Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#D5CEBC]">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              disabled={currentStep === 4}
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#121212] text-white text-xs font-bold hover:bg-neutral-800 transition disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Live Printable Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">Live Document Preview</span>
            <span className="text-[11px] text-neutral-600 font-semibold font-mono">{formData.documentNumber}</span>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            <div
              id="studio-pdf-preview"
              className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              <div>
                {/* Header */}
                <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                      {formData.title}
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">Ref #: {formData.documentNumber}</p>
                  </div>
                  <div className="text-right text-xs text-neutral-600">
                    <p>Date: {formatDate(formData.date)}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="text-xs text-neutral-800 leading-relaxed mb-6">
                  <p>
                    This Document is executed on <strong>{formatDate(formData.date)}</strong> between{" "}
                    <strong>{formData.senderName}</strong> ({formData.senderCompany}) and{" "}
                    <strong>{formData.clientName}</strong> ({formData.clientCompany}).
                  </p>
                </div>

                {/* Scope */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                    1. PROJECT TITLE & SCOPE
                  </h3>
                  <h4 className="text-xs font-bold text-neutral-800">{formData.projectTitle}</h4>
                  <p className="text-xs text-neutral-600 mt-1 whitespace-pre-line">{formData.scopeDescription}</p>
                </div>

                {/* Deliverables */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                    2. DELIVERABLES
                  </h3>
                  <p className="text-xs text-neutral-700 font-mono whitespace-pre-line bg-neutral-50 p-3 rounded border border-neutral-100">
                    {formData.deliverables}
                  </p>
                </div>

                {/* Financials */}
                <div className="mb-6 text-xs">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                    3. FINANCIAL TERMS
                  </h3>
                  <p className="text-neutral-800">Total Agreed Fee: <strong>{formatCurrency(formData.totalAmount, "₹")}</strong></p>
                  <p className="text-neutral-600">Advance Deposit: {formatCurrency(formData.advanceDeposit, "₹")}</p>
                </div>

                {/* Attached Clauses */}
                {formData.selectedClauses.length > 0 && (
                  <div className="mb-6 text-xs">
                    <h3 className="font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                      4. SPECIAL LEGAL TERMS & CLAUSES
                    </h3>
                    <div className="flex flex-col gap-2">
                      {formData.selectedClauses.map((c, idx) => (
                        <div key={c.id} className="p-2 bg-neutral-50 rounded border border-neutral-100">
                          <strong className="text-neutral-900">{idx + 1}. {c.title}:</strong>{" "}
                          <span className="text-neutral-700 font-mono">{c.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 border-t border-neutral-300 pt-6 mt-12 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">SEVENX LABS SIGNATURE</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.freelancerSignature}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.senderName}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">CLIENT SIGNATURE</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.clientSignature}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.clientName}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
