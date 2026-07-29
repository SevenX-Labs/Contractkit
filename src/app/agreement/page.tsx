"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createAgreementDB } from "../actions";
import { AgreementData } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import {
  FileCheck,
  Download,
  Save,
  Image as ImageIcon,
  FileText,
  User,
  Building,
  Calendar,
  IndianRupee,
  Shield,
  Eye,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function AgreementPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);

  const [formData, setFormData] = useState<AgreementData>({
    agreementNumber: "SXL-AGR-001",
    date: new Date().toISOString().split("T")[0],
    
    freelancerName: "",
    freelancerCompany: "",
    freelancerEmail: "",
    
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    
    projectTitle: "Custom Software Architecture & Development",
    projectDescription: "End-to-end development of custom enterprise web application with Next.js 16, React 19, and PostgreSQL database.",
    deliverables: "1. Responsive Next.js Web Application\n2. PostgreSQL Prisma Database Schema\n3. Client CRM & Milestone Management System\n4. PDF Export Engine",
    
    startDate: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    
    totalAmount: 250000,
    advancePercentage: 50,
    finalPercentage: 50,
    revisionLimit: "3",
    
    ownershipClause: "Full source code copyright and IP rights are transferred to Client upon 100% full payment receipt.",
    cancellationPolicy: "Either party may terminate with 7 days written notice. Work completed to date is billed at prorated value.",
    additionalTerms: "Includes 30 days of free bug-fix warranty support following project handover.",
    
    status: "draft",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getNextDocumentNumberDB("AGREEMENT")]).then(([profile, num]) => {
      setFormData((prev: AgreementData) => ({
        ...prev,
        agreementNumber: num,
        freelancerName: profile.name || "SevenX Labs",
        freelancerCompany: profile.company || "SevenX Labs Studio",
        freelancerEmail: profile.email || "hello@sevenxlabs.com",
      }));
    });
  }, []);

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error("Please enter Client Name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createAgreementDB(formData);
    setIsSaving(false);

    if (res.success) {
      const nextNum = await getNextDocumentNumberDB("AGREEMENT");
      setFormData((prev: AgreementData) => ({ ...prev, agreementNumber: nextNum }));
      toast.success(`Agreement #${formData.agreementNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving agreement: ${res.error}`);
    }
  };

  const agreementPreviewContent = (
    <div
      id="agreement-pdf-preview"
      className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 mx-auto flex flex-col justify-between select-none shadow-lg rounded-xl"
      style={{ fontFamily: "Arial, sans-serif" }}
    >
      <div>
        <div className="border-b-2 border-neutral-900 pb-6 mb-6 flex justify-between items-start">
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

        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
          <div>
            <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1">CONTRACTOR:</span>
            <p className="font-bold text-neutral-900">{formData.freelancerName}</p>
            {formData.freelancerCompany && <p className="text-neutral-600">{formData.freelancerCompany}</p>}
            <p className="text-neutral-500">{formData.freelancerEmail}</p>
          </div>
          <div>
            <span className="font-bold text-neutral-400 uppercase text-[10px] block mb-1">CLIENT:</span>
            <p className="font-bold text-neutral-900">{formData.clientName || "Client Name"}</p>
            {formData.clientCompany && <p className="text-neutral-600">{formData.clientCompany}</p>}
            <p className="text-neutral-500">{formData.clientEmail || "client@email.com"}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-neutral-800 leading-relaxed mb-6">
          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              1. PROJECT TITLE & SCOPE
            </h3>
            <p className="font-bold text-neutral-900">{formData.projectTitle}</p>
            <p className="text-neutral-600 mt-1">{formData.projectDescription}</p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              2. DELIVERABLES
            </h3>
            <p className="whitespace-pre-line text-neutral-700 font-mono">{formData.deliverables}</p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              3. COMPENSATION & PAYMENT TERMS
            </h3>
            <p>Total Contract Fee: <strong className="text-neutral-900 font-extrabold">{formatCurrency(formData.totalAmount, "₹")}</strong></p>
            <p className="mt-1">
              • Advance Deposit ({formData.advancePercentage}%): {formatCurrency((formData.totalAmount * formData.advancePercentage) / 100, "₹")}<br />
              • Final Delivery ({formData.finalPercentage}%): {formatCurrency((formData.totalAmount * formData.finalPercentage) / 100, "₹")}
            </p>
          </div>

          <div>
            <h3 className="font-bold text-neutral-900 uppercase text-[11px] border-b border-neutral-200 pb-1 mb-1">
              4. IP OWNERSHIP & REVISIONS
            </h3>
            <p>{formData.ownershipClause}</p>
            <p className="mt-1 font-semibold">Included Revision Cap: {formData.revisionLimit} Rounds</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-neutral-300 text-xs mt-6">
          <div>
            <p className="font-bold text-neutral-900">For Contractor:</p>
            <p className="text-neutral-500 font-mono mt-6 border-b border-neutral-400 pb-1">{formData.freelancerName}</p>
          </div>
          <div>
            <p className="font-bold text-neutral-900">For Client:</p>
            <p className="text-neutral-500 font-mono mt-6 border-b border-neutral-400 pb-1">{formData.clientName || "Client Authorized Signatory"}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-4 text-center text-[10px] text-neutral-400">
        <p>SevenX Labs Studio • Official Service Agreement #{formData.agreementNumber}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Service Agreement Generator</h1>
            <p className="text-xs text-neutral-600 font-medium">Create legally compliant freelance contracts and IP transfer agreements</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFloatingPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white font-bold text-xs shadow hover:bg-purple-700 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Floating Preview</span>
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
            onClick={() => { handleSave(); exportToPDF("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.pdf`); }}
            disabled={isExporting || isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition"
          >
            <Download className="w-3.5 h-3.5 text-pink-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Agreement #</label>
              <input
                type="text"
                value={formData.agreementNumber}
                onChange={(e) => setFormData({ ...formData, agreementNumber: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
              />
            </div>
          </div>

          <hr className="border-[#D5CEBC]" />

          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              <span>Client Information</span>
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
              <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
              <span>Project Value & Milestones</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Total Fee (₹)</label>
                <input
                  type="number"
                  value={formData.totalAmount}
                  onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-extrabold text-neutral-900"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Revision Limit</label>
                <input
                  type="text"
                  value={formData.revisionLimit}
                  onChange={(e) => setFormData({ ...formData, revisionLimit: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live A4 Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            {agreementPreviewContent}
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Agreement Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Agreement #{formData.agreementNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { handleSave(); exportToPDF("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.pdf`); }}
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
              {agreementPreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
