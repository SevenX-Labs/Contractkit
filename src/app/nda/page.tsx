"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createNDADB } from "../actions";
import { NDAData } from "../../types";
import { formatDate } from "../../lib/utils";
import {
  ShieldCheck,
  Download,
  Save,
  Building,
  Lock,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function NDAPage() {
  const { exportToPDF, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);

  const [formData, setFormData] = useState<NDAData>({
    ndaNumber: "SXL-NDA-001",
    effectiveDate: new Date().toISOString().split("T")[0],
    
    freelancerName: "",
    freelancerCompany: "",
    
    clientName: "",
    clientCompany: "",
    
    projectContext: "Custom Software Application Architecture & Proprietary Source Code Development",
    confidentialInfoDefinition: "Includes all trade secrets, algorithms, source code, business workflows, client lists, financial data, and technical specifications.",
    obligations: "The receiving party agrees to hold all confidential information in strict confidence and shall not disclose or reproduce without explicit written approval.",
    duration: "2 Years",
    
    returnDestroyClause: "Upon project termination, receiving party shall return or permanently delete all confidential assets.",
    breachPenalty: "Subject to injunctive relief and liquidated damages under applicable law.",
    additionalNotes: "Governed under standard commercial law.",
    
    status: "draft",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getNextDocumentNumberDB("NDA")]).then(([profile, num]) => {
      setFormData((prev: NDAData) => ({
        ...prev,
        ndaNumber: num,
        freelancerName: profile.name || "SevenX Labs",
        freelancerCompany: profile.company || "SevenX Labs Studio",
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
      const nextNum = await getNextDocumentNumberDB("NDA");
      setFormData((prev: NDAData) => ({ ...prev, ndaNumber: nextNum }));
      toast.success(`NDA #${formData.ndaNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving NDA: ${res.error}`);
    }
  };

  const ndaPreviewContent = (
    <div
      id="nda-pdf-preview"
      className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div>
        <div className="border-b-2 border-neutral-900 pb-6 mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
              MUTUAL NON-DISCLOSURE AGREEMENT (NDA)
            </h1>
            <p className="text-xs text-neutral-500 mt-1 font-mono">Ref #: {formData.ndaNumber}</p>
          </div>
          <div className="text-right text-xs text-neutral-600">
            <p>Effective Date: {formatDate(formData.effectiveDate)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
          <div>
            <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1">PARTY A:</span>
            <p className="font-bold text-neutral-900">{formData.freelancerName}</p>
            {formData.freelancerCompany && <p className="text-neutral-600">{formData.freelancerCompany}</p>}
          </div>
          <div>
            <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1">PARTY B:</span>
            <p className="font-bold text-neutral-900">{formData.clientName || "Client Name"}</p>
            {formData.clientCompany && <p className="text-neutral-600">{formData.clientCompany}</p>}
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-800 leading-relaxed mb-6">
          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              1. PURPOSE & CONTEXT
            </h3>
            <p className="text-neutral-700">{formData.projectContext}</p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              2. CONFIDENTIAL INFORMATION DEFINITION
            </h3>
            <p className="text-neutral-700">{formData.confidentialInfoDefinition}</p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              3. OBLIGATIONS & DURATION
            </h3>
            <p>{formData.obligations}</p>
            <p className="mt-1 font-bold">Confidentiality Term: {formData.duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-300 text-xs mt-6">
          <div>
            <p className="font-bold text-neutral-900">For Party A:</p>
            <p className="text-neutral-500 font-mono mt-6 border-b border-neutral-400 pb-1">{formData.freelancerName}</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">For Party B:</p>
            <p className="text-neutral-500 font-mono mt-6 border-b border-neutral-400 pb-1">{formData.clientName || "Client Signatory"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-4 text-center text-[10px] text-neutral-400">
        <p>SevenX Labs Studio • Official Mutual Non-Disclosure Agreement #{formData.ndaNumber}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Mutual NDA Generator</h1>
            <p className="text-xs text-neutral-600 font-medium">Protect proprietary source code and trade secrets</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFloatingPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 font-bold text-xs hover:bg-[#D5CEBC] transition"
          >
            <Save className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isSaving ? "Saving..." : "Save Draft"}</span>
          </button>

          <button
            onClick={() => { handleSave(); exportToPDF("nda-pdf-preview", `NDA-${formData.ndaNumber}.pdf`); }}
            disabled={isExporting || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-pink-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">NDA #</label>
              <input
                type="text"
                value={formData.ndaNumber}
                onChange={(e) => setFormData({ ...formData, ndaNumber: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Effective Date</label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Party B (Client Details)</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
              />
              <input
                type="text"
                placeholder="Client Company"
                value={formData.clientCompany}
                onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Confidentiality Term & Scope</span>
            </h3>
            <input
              type="text"
              placeholder="Duration (e.g. 2 Years)"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            {ndaPreviewContent}
          </div>
        </div>
      </div>

      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live NDA Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">NDA #{formData.ndaNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { handleSave(); exportToPDF("nda-pdf-preview", `NDA-${formData.ndaNumber}.pdf`); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow hover:bg-neutral-800 transition"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setShowFloatingPreview(false)}
                  className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto p-4 bg-neutral-950/20 rounded-2xl flex justify-center">
              {ndaPreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
