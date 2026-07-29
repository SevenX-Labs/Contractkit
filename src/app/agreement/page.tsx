"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, createAgreementDB } from "../actions";
import { AgreementData } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import { DEFAULT_AGREEMENT_DATA } from "../../lib/constants";
import {
  FileCheck,
  Save,
  Download,
  FileText,
  Image as ImageIcon,
  User,
  Building,
  Calendar,
  DollarSign,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

export default function AgreementPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [formData, setFormData] = useState<AgreementData>(DEFAULT_AGREEMENT_DATA);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfileDB().then((profile) => {
      setFormData((prev: AgreementData) => ({
        ...prev,
        freelancerName: profile.name || "SevenX Labs",
        freelancerCompany: profile.company || "SevenX Labs Studio",
        freelancerEmail: profile.email || "hello@sevenxlabs.com",
        freelancerSignature: profile.name || "SevenX Labs",
      }));
    });
  }, []);

  const handleSave = async () => {
    if (!formData.clientName || !formData.projectTitle) {
      toast.error("Please enter Client Name and Project Title before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createAgreementDB(formData);
    setIsSaving(false);

    if (res.success) {
      toast.success(`Agreement for "${formData.projectTitle}" saved to Prisma Database!`);
    } else {
      toast.error(`Failed to save to database: ${res.error}`);
    }
  };

  const handleExportPDF = async () => {
    await handleSave();
    await exportToPDF("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.pdf`);
  };

  const handleExportDOCX = async () => {
    await handleSave();
    await exportToDOCX("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.docx`);
  };

  const handleExportImage = async () => {
    await handleSave();
    await exportToImage("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.png`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Actions (High Contrast Warm Cream) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Agreement Generator</h1>
            <p className="text-xs text-neutral-600 font-medium">
              Generate legally sound freelance contracts saved directly in Prisma Database
            </p>
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

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          {/* Parties */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-700" />
              <span>Contracting Parties</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Freelancer Name</label>
                <input
                  type="text"
                  value={formData.freelancerName}
                  onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Freelancer Email</label>
                <input
                  type="email"
                  value={formData.freelancerEmail}
                  onChange={(e) => setFormData({ ...formData, freelancerEmail: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Project Details */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-purple-700" />
              <span>Project Scope & Deliverables</span>
            </h3>
            <input
              type="text"
              placeholder="Project Title *"
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
            />
            <textarea
              placeholder="Project Description"
              rows={3}
              value={formData.projectDescription}
              onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
            <textarea
              placeholder="Deliverables List (Bullet points)"
              rows={3}
              value={formData.deliverables}
              onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Timeline & Financial Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </h3>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Financial Terms</span>
              </h3>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Total Fee ($)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 block mb-1">Advance %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.advancePercentage}
                    onChange={(e) => setFormData({ ...formData, advancePercentage: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-2 py-1.5 text-xs text-center font-bold text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-700 block mb-1">Revision Limit</label>
                  <select
                    value={formData.revisionLimit}
                    onChange={(e) => setFormData({ ...formData, revisionLimit: e.target.value as any })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-2 py-1.5 text-xs font-bold text-neutral-900"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Legal Clauses & Signatures */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-700" />
              <span>IP & Signatures</span>
            </h3>
            <textarea
              placeholder="Ownership Clause"
              rows={2}
              value={formData.ownershipClause}
              onChange={(e) => setFormData({ ...formData, ownershipClause: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Freelancer Signature</label>
                <input
                  type="text"
                  value={formData.freelancerSignature}
                  onChange={(e) => setFormData({ ...formData, freelancerSignature: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Signature</label>
                <input
                  type="text"
                  value={formData.clientSignature}
                  onChange={(e) => setFormData({ ...formData, clientSignature: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">Live Contract Preview</span>
            <span className="text-[11px] text-neutral-600 font-semibold">A4 Printable Format</span>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            <div
              id="agreement-pdf-preview"
              className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              <div>
                {/* Header */}
                <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                      FREELANCE SERVICE AGREEMENT
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">Ref #: {formData.agreementNumber}</p>
                  </div>
                  <div className="text-right text-xs text-neutral-600">
                    <p>Effective Date: {formatDate(formData.date)}</p>
                  </div>
                </div>

                {/* Parties */}
                <div className="text-xs text-neutral-800 leading-relaxed mb-6">
                  <p>
                    This Agreement is made on <strong>{formatDate(formData.date)}</strong> between{" "}
                    <strong>{formData.freelancerName || "Freelancer"}</strong> ({formData.freelancerCompany}) and{" "}
                    <strong>{formData.clientName || "Client"}</strong> ({formData.clientCompany || "Client Corp"}).
                  </p>
                </div>

                {/* Scope */}
                <div className="mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                    1. PROJECT TITLE & SCOPE
                  </h3>
                  <h4 className="text-xs font-bold text-neutral-800">{formData.projectTitle}</h4>
                  <p className="text-xs text-neutral-600 mt-1 whitespace-pre-line">{formData.projectDescription}</p>
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

                {/* Financials & Timeline */}
                <div className="mb-6 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                      3. FINANCIAL TERMS
                    </h3>
                    <p className="text-neutral-700">Total Project Fee: <strong>{formatCurrency(formData.totalAmount)}</strong></p>
                    <p className="text-neutral-600">Advance Deposit: {formData.advancePercentage}% ({formatCurrency((formData.totalAmount * formData.advancePercentage) / 100)})</p>
                    <p className="text-neutral-600">Revision Limit: {formData.revisionLimit} round(s)</p>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                      4. TIMELINE
                    </h3>
                    <p className="text-neutral-700">Start Date: {formatDate(formData.startDate)}</p>
                    <p className="text-neutral-700">Deadline: {formatDate(formData.deadline)}</p>
                  </div>
                </div>

                {/* Ownership & Terms */}
                <div className="mb-8 text-xs text-neutral-700 leading-relaxed">
                  <h3 className="font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                    5. IP OWNERSHIP & TERMINATION
                  </h3>
                  <p className="mb-2">{formData.ownershipClause}</p>
                  <p>{formData.cancellationPolicy}</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 border-t border-neutral-300 pt-6 mt-12 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">FREELANCER SIGNATURE</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.freelancerSignature || formData.freelancerName}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.freelancerName}</p>
                    <p className="text-[10px] text-neutral-400">Date: {formatDate(formData.freelancerSignDate || formData.date)}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">CLIENT SIGNATURE</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.clientSignature || formData.clientName}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.clientName}</p>
                    <p className="text-[10px] text-neutral-400">Date: {formatDate(formData.clientSignDate || formData.date)}</p>
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
