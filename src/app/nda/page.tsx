"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createNDADB } from "../actions";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernNDATemplate } from "../../components/nda/ModernNDATemplate";
import {
  ShieldCheck,
  Save,
  Building,
  User,
  Calendar,
  Lock,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Users,
  Clock,
  Gavel,
  AlertTriangle,
  Handshake,
} from "lucide-react";
import { toast } from "sonner";

export default function NDAPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true });

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) => ({ ...prev, [sectionIndex]: !prev[sectionIndex] }));
  };

  const [ndaSeq, setNdaSeq] = useState("000001");

  const [formData, setFormData] = useState({
    ndaNumber: `SXL-NDA-${new Date().getFullYear()}-000001`,
    effectiveDate: new Date().toISOString().split("T")[0],
    version: "1.0",

    // Disclosing Party
    disclosingName: "Sahil Hode",
    disclosingCompany: "SevenX Labs",
    disclosingAddress: "Thane, Mumbai, Maharashtra",
    disclosingEmail: "sevenxlabs07@gmail.com",
    disclosingPhone: "8652601566",

    // Receiving Party
    receivingName: "Sophia Smith",
    receivingCompany: "Smith Innovations Private Limited",
    receivingAddress: "742 Evergreen Terrace, Springfield, IL 62704, USA",
    receivingEmail: "sophia@smithinnovations.com",
    receivingPhone: "+1 234 567 8900",

    // NDA Details
    purpose: "Evaluating business partnership, software development requirements, and technical architecture integration.",
    confidentialItems: "Source code, database schemas, REST APIs, UI/UX designs, wireframes, business logic, customer data, and trade secrets.",
    obligations: "The Receiving Party agrees to maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying, and restrict access to authorized personnel.",
    exclusions: "Information that is publicly available, already known prior to disclosure, received lawfully from a third party, or independently developed without reference to Confidential Information.",
    termDuration: "This Agreement remains effective for 3 years from the Effective Date, and confidentiality obligations survive for 5 years following termination.",
    returnTerm: "Upon written request, the Receiving Party shall immediately return or permanently destroy all physical and digital copies of Confidential Information.",
    governingLaw: "Governed by the laws of India, with exclusive jurisdiction in Mumbai, Maharashtra.",
    liabilityClause: "Neither party shall be liable for indirect, consequential, or punitive damages. Remedies include injunctive relief and actual damages.",
    entireAgreement: "This document constitutes the entire NDA between parties and supersedes all prior verbal or written understandings.",

    // Signatures
    disclosingSignatory: "Sahil Hode (SevenX Labs)",
    receivingSignatory: "Sophia Smith (Managing Director)",
  });

  useEffect(() => {
    Promise.all([getProfileDB(), getNextDocumentNumberDB("NDA")]).then(([profile, num]) => {
      const seq = num.split("-").pop() || "000001";
      setNdaSeq(seq);

      setFormData((prev) => ({
        ...prev,
        ndaNumber: num,
        disclosingName: profile.name || "Sahil Hode",
        disclosingCompany: "SevenX Labs",
        disclosingAddress: profile.address || "Thane, Mumbai, Maharashtra",
        disclosingEmail: profile.email || "sevenxlabs07@gmail.com",
        disclosingPhone: profile.phone || "8652601566",
      }));
    });
  }, []);

  const handleSave = async () => {
    if (!formData.receivingName) {
      toast.error("Please enter Receiving Party Name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createNDADB({
      ndaNumber: formData.ndaNumber,
      effectiveDate: formData.effectiveDate,
      version: formData.version,
      clientName: formData.receivingName,
      clientCompany: formData.receivingCompany,
      clientEmail: formData.receivingEmail,
      clientAddress: formData.receivingAddress,
      purpose: formData.purpose,
      confidentialItems: formData.confidentialItems,
      obligations: formData.obligations,
      termDuration: formData.termDuration,
      disclosingSignatory: formData.disclosingSignatory,
      receivingSignatory: formData.receivingSignatory,
    } as any);
    setIsSaving(false);

    if (res.success) {
      const nextNum = await getNextDocumentNumberDB("NDA");
      setFormData((prev) => ({ ...prev, ndaNumber: nextNum }));
      toast.success(`NDA #${formData.ndaNumber} saved to Prisma database!`);
    } else {
      toast.error(`Error saving NDA: ${res.error}`);
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

  const handleExportPNG = async () => {
    await handleSave();
    await exportToImage("nda-pdf-preview", `NDA-${formData.ndaNumber}.png`);
  };

  const renderNDAContent = (elementId = "nda-pdf-preview") => (
    <ModernNDATemplate
      id={elementId}
      ndaNumber={formData.ndaNumber}
      effectiveDate={formData.effectiveDate}
      version={formData.version}
      disclosingName={formData.disclosingName}
      disclosingCompany={formData.disclosingCompany}
      disclosingAddress={formData.disclosingAddress}
      disclosingEmail={formData.disclosingEmail}
      disclosingPhone={formData.disclosingPhone}
      receivingName={formData.receivingName}
      receivingCompany={formData.receivingCompany}
      receivingAddress={formData.receivingAddress}
      receivingEmail={formData.receivingEmail}
      receivingPhone={formData.receivingPhone}
      purpose={formData.purpose}
      confidentialItems={formData.confidentialItems}
      obligations={formData.obligations}
      exclusions={formData.exclusions}
      termDuration={formData.termDuration}
      returnTerm={formData.returnTerm}
      governingLaw={formData.governingLaw}
      liabilityClause={formData.liabilityClause}
      entireAgreement={formData.entireAgreement}
      disclosingSignatory={formData.disclosingSignatory}
      receivingSignatory={formData.receivingSignatory}
    />
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Non-Disclosure Agreement (NDA)</h1>
            <p className="text-xs text-neutral-600 font-medium">Generate a mutual confidentiality agreement matching the invoice design system</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFloatingPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition cursor-pointer"
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
            onExportPNG={handleExportPNG}
            isExporting={isExporting}
          />
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          {/* SECTION 1: Agreement Info */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(1)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 1: NDA Metadata & Date</span>
              {openSections[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[1] && (
              <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">NDA No.</label>
                    <div className="flex items-center bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl overflow-hidden shadow-xs">
                      <span className="px-2.5 py-2 bg-[#DFD9C9] text-[11px] font-mono font-extrabold text-neutral-800 border-r border-[#E2DDD0] select-none whitespace-nowrap">
                        SXL-NDA-{new Date().getFullYear()}-
                      </span>
                      <input
                        type="text"
                        value={ndaSeq}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setNdaSeq(val);
                          const year = new Date().getFullYear();
                          setFormData((prev) => ({
                            ...prev,
                            ndaNumber: `SXL-NDA-${year}-${val.padStart(6, "0")}`,
                          }));
                        }}
                        placeholder="000001"
                        className="flex-1 bg-transparent px-2 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Effective Date</label>
                    <input
                      type="date"
                      value={formData.effectiveDate}
                      onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Version</label>
                    <input
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: Parties */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(2)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 2: Disclosing & Receiving Parties</span>
              {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[2] && (
              <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h4 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider">Disclosing Party (You)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.disclosingName}
                      onChange={(e) => setFormData({ ...formData, disclosingName: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.disclosingCompany}
                      onChange={(e) => setFormData({ ...formData, disclosingCompany: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.disclosingEmail}
                      onChange={(e) => setFormData({ ...formData, disclosingEmail: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.disclosingPhone}
                      onChange={(e) => setFormData({ ...formData, disclosingPhone: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">Receiving Party</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={formData.receivingName}
                      onChange={(e) => setFormData({ ...formData, receivingName: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={formData.receivingCompany}
                      onChange={(e) => setFormData({ ...formData, receivingCompany: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.receivingEmail}
                      onChange={(e) => setFormData({ ...formData, receivingEmail: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={formData.receivingPhone}
                      onChange={(e) => setFormData({ ...formData, receivingPhone: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: Purpose & Confidentiality Scope */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(3)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 3: Purpose & Scope of Confidentiality</span>
              {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[3] && (
              <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Purpose of Sharing</label>
                  <textarea
                    rows={2}
                    value={formData.purpose}
                    onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Confidential Information Items</label>
                  <textarea
                    rows={3}
                    value={formData.confidentialItems}
                    onChange={(e) => setFormData({ ...formData, confidentialItems: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: Obligations & Signatures */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(4)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 4: Terms, Obligations & Signatures</span>
              {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[4] && (
              <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Receiving Party Obligations</label>
                  <textarea
                    rows={2}
                    value={formData.obligations}
                    onChange={(e) => setFormData({ ...formData, obligations: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Disclosing Signatory</label>
                    <input
                      type="text"
                      value={formData.disclosingSignatory}
                      onChange={(e) => setFormData({ ...formData, disclosingSignatory: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Receiving Signatory</label>
                    <input
                      type="text"
                      value={formData.receivingSignatory}
                      onChange={(e) => setFormData({ ...formData, receivingSignatory: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live A4 Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live NDA Preview</span>
            <span className="text-xs font-mono text-neutral-500 font-bold">1 Page Standard</span>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            {renderNDAContent("nda-preview-onscreen")}
          </div>

          {/* Hidden Offscreen Container for PDF Export */}
          <div className="fixed -left-[9999px] -top-[9999px]">
            {renderNDAContent("nda-pdf-preview")}
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live NDA Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">NDA #{formData.ndaNumber}</p>
              </div>

              <div className="flex items-center gap-3">
                <ExportDropdown
                  onExportPDF={handleExportPDF}
                  onExportDOCX={handleExportDOCX}
                  onExportPNG={handleExportPNG}
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
              {renderNDAContent("nda-preview-modal")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
