"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, createNDADB } from "../actions";
import { NDAData } from "../../types";
import { formatDate } from "../../lib/utils";
import { DEFAULT_NDA_DATA } from "../../lib/constants";
import {
  ShieldCheck,
  Save,
  Download,
  FileText,
  Image as ImageIcon,
  User,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function NDAPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [formData, setFormData] = useState<NDAData>(DEFAULT_NDA_DATA);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfileDB().then((profile) => {
      setFormData((prev: NDAData) => ({
        ...prev,
        freelancerName: profile.name || "SevenX Labs",
        freelancerCompany: profile.company || "SevenX Labs Studio",
        freelancerSignature: profile.name || "SevenX Labs",
      }));
    });
  }, []);

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error("Please enter Client Name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createNDADB(formData);
    setIsSaving(false);

    if (res.success) {
      toast.success(`NDA for "${formData.clientName}" saved to Prisma Database!`);
    } else {
      toast.error(`Failed to save to database: ${res.error}`);
    }
  };

  const handleExportPDF = async () => {
    await handleSave();
    await exportToPDF("nda-pdf-preview", `NDA-${formData.ndaNumber}.pdf`);
  };

  const handleExportDOCX = async () => {
    await handleSave();
    await exportToDOCX("nda-pdf-preview", `NDA-${formData.ndaNumber}.docx`);
  };

  const handleExportImage = async () => {
    await handleSave();
    await exportToImage("nda-pdf-preview", `NDA-${formData.ndaNumber}.png`);
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">NDA Generator</h1>
            <p className="text-xs text-neutral-600 font-medium">Generate mutual non-disclosure agreements saved in Prisma Database</p>
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
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Parties Involved</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  value={formData.freelancerName}
                  onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client / Company Name *</label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Project Context & Duration */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Context & Terms</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Effective Date</label>
                <input
                  type="date"
                  value={formData.effectiveDate}
                  onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Confidentiality Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value as any })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                >
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                  <option value="3 Years">3 Years</option>
                  <option value="5 Years">5 Years</option>
                </select>
              </div>
            </div>
            <textarea
              placeholder="Project Context"
              rows={2}
              value={formData.projectContext}
              onChange={(e) => setFormData({ ...formData, projectContext: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
            <textarea
              placeholder="Definition of Confidential Information"
              rows={3}
              value={formData.confidentialInfoDefinition}
              onChange={(e) => setFormData({ ...formData, confidentialInfoDefinition: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Breach & Return Clauses */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              <span>Breach & Return Clauses</span>
            </h3>
            <textarea
              placeholder="Return / Destroy Clause"
              rows={2}
              value={formData.returnDestroyClause}
              onChange={(e) => setFormData({ ...formData, returnDestroyClause: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
            <textarea
              placeholder="Breach Penalty Clause"
              rows={2}
              value={formData.breachPenalty}
              onChange={(e) => setFormData({ ...formData, breachPenalty: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">Your Signature</label>
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

        {/* Right Live Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider">Live NDA Preview</span>
            <span className="text-[11px] text-neutral-600 font-semibold">A4 Printable Format</span>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            <div
              id="nda-pdf-preview"
              className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              <div>
                {/* Header */}
                <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-end">
                  <div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                      MUTUAL NON-DISCLOSURE AGREEMENT
                    </h1>
                    <p className="text-xs text-neutral-500 mt-1 font-mono">Ref #: {formData.ndaNumber}</p>
                  </div>
                  <div className="text-right text-xs text-neutral-600">
                    <p>Effective Date: {formatDate(formData.effectiveDate)}</p>
                    <p>Duration: {formData.duration}</p>
                  </div>
                </div>

                <div className="text-xs text-neutral-800 leading-relaxed space-y-4">
                  <p>
                    This Non-Disclosure Agreement (&quot;Agreement&quot;) is entered into on <strong>{formatDate(formData.effectiveDate)}</strong> by and between <strong>{formData.freelancerName || "Disclosing Party"}</strong> and <strong>{formData.clientName || "Receiving Party"}</strong>.
                  </p>

                  <div>
                    <h3 className="font-bold uppercase text-neutral-900 border-b border-neutral-200 pb-1 mb-1">
                      1. PROJECT CONTEXT
                    </h3>
                    <p className="text-neutral-700">{formData.projectContext}</p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase text-neutral-900 border-b border-neutral-200 pb-1 mb-1">
                      2. CONFIDENTIAL INFORMATION DEFINITION
                    </h3>
                    <p className="text-neutral-700 bg-neutral-50 p-3 rounded border border-neutral-100 font-mono text-[11px]">
                      {formData.confidentialInfoDefinition}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase text-neutral-900 border-b border-neutral-200 pb-1 mb-1">
                      3. OBLIGATIONS & DURATION
                    </h3>
                    <p className="text-neutral-700">{formData.obligations}</p>
                    <p className="mt-1 text-neutral-600 font-semibold">Term: This agreement shall remain binding for a period of {formData.duration}.</p>
                  </div>

                  <div>
                    <h3 className="font-bold uppercase text-neutral-900 border-b border-neutral-200 pb-1 mb-1">
                      4. RETURN OF INFORMATION & BREACH PENALTY
                    </h3>
                    <p className="text-neutral-700 mb-1">{formData.returnDestroyClause}</p>
                    <p className="text-neutral-700">{formData.breachPenalty}</p>
                  </div>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 border-t border-neutral-300 pt-6 mt-12 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">DISCLOSING PARTY</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.freelancerSignature || formData.freelancerName}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.freelancerName}</p>
                    <p className="text-[10px] text-neutral-400">Date: {formatDate(formData.freelancerSignDate || formData.effectiveDate)}</p>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-4">RECEIVING PARTY</span>
                    <p className="font-bold text-neutral-900 font-serif italic text-base border-b border-neutral-400 pb-1">
                      {formData.clientSignature || formData.clientName}
                    </p>
                    <p className="text-neutral-500 mt-1">{formData.clientName}</p>
                    <p className="text-[10px] text-neutral-400">Date: {formatDate(formData.clientSignDate || formData.effectiveDate)}</p>
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
