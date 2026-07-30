"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createNDADB } from "../actions";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernNDATemplate } from "../../components/nda/ModernNDATemplate";
import {
  ShieldCheck,
  Save,
  Lock,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

export default function NDAPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 4: true, 19: true, 20: true });
  const [showAllSections, setShowAllSections] = useState(false);
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);

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
    disclosingWebsite: "www.sevenxlabs.com",

    // Receiving Party
    receivingName: "Sophia Smith",
    receivingCompany: "Smith Innovations Private Limited",
    receivingAddress: "742 Evergreen Terrace, Springfield, IL 62704, USA",
    receivingEmail: "sophia@smithinnovations.com",
    receivingPhone: "+1 234 567 8900",
    receivingWebsite: "www.smithinnovations.com",

    // 20 NDA Sections
    purpose: "Evaluating business partnership, custom software development requirements, and technical API integrations.",
    confidentialItems: "Source Code, Database Schemas, REST APIs, UI/UX Wireframes, Business Logic, Customer Data, Financial Information, Trade Secrets, and Proprietary Algorithms.",
    obligations: "Maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying or reverse engineering, and restrict access solely to authorized personnel with a need-to-know.",
    exclusions: "Information that is already public, previously known without restriction, received legally from a third party, or independently developed without reference to Confidential Information.",
    permittedDisclosure: "Disclosures required by law, court subpoena, regulatory government request, or to professional legal/financial advisors bound by confidentiality duties.",
    termDuration: "Agreement remains effective for 3 years from Effective Date; confidentiality obligations survive for 5 years post-termination.",
    returnTerm: "Upon written notice, Receiving Party shall immediately return or permanently destroy all digital files, backups, and physical documents.",
    ipClause: "All intellectual property rights, trade secrets, and ownership remain strictly with Disclosing Party. No license or transfer is granted.",
    nonSolicitation: "Neither party shall solicit, recruit, hire, or poach employees or contractors of the other party during the term and 12 months thereafter.",
    dataProtection: "Employ industry-standard AES-256 encryption, secure cloud storage, strict credential access control, and robust cyber security protocols.",
    limitationOfLiability: "Neither party shall be liable for indirect, incidental, punitive, or consequential damages. Maximum aggregate liability is limited to actual direct damages.",
    breachRemedies: "Immediate injunctive relief without posting bond, monetary damages, legal fee reimbursement, and prompt notice of any actual or suspected breach.",
    terminationClause: "Either party may terminate this agreement upon 14 calendar days written notice. Survival clauses remain binding post-termination.",
    governingLaw: "Governed by the laws of India, with exclusive legal jurisdiction in the courts of Mumbai, Maharashtra.",
    entireAgreement: "This Agreement contains the complete and exclusive understanding between parties, superseding all prior oral or written agreements.",
    additionalTerms: "Special conditions: Confidentiality duties extend to all affiliated subsidiaries and third-party contractor audit trails.",

    // Signatures
    disclosingSignatory: "Sahil Hode",
    disclosingDesignation: "Founder & CEO (SevenX Labs)",
    receivingSignatory: "Sophia Smith",
    receivingDesignation: "Managing Director",
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

  const renderNDAContent = (page?: number, elementId = "nda-pdf-preview") => (
    <ModernNDATemplate
      id={elementId}
      activePage={page}
      ndaNumber={formData.ndaNumber}
      effectiveDate={formData.effectiveDate}
      version={formData.version}
      disclosingName={formData.disclosingName}
      disclosingCompany={formData.disclosingCompany}
      disclosingAddress={formData.disclosingAddress}
      disclosingEmail={formData.disclosingEmail}
      disclosingPhone={formData.disclosingPhone}
      disclosingWebsite={formData.disclosingWebsite}
      receivingName={formData.receivingName}
      receivingCompany={formData.receivingCompany}
      receivingAddress={formData.receivingAddress}
      receivingEmail={formData.receivingEmail}
      receivingPhone={formData.receivingPhone}
      receivingWebsite={formData.receivingWebsite}
      purpose={formData.purpose}
      confidentialItems={formData.confidentialItems}
      obligations={formData.obligations}
      exclusions={formData.exclusions}
      permittedDisclosure={formData.permittedDisclosure}
      termDuration={formData.termDuration}
      returnTerm={formData.returnTerm}
      ipClause={formData.ipClause}
      nonSolicitation={formData.nonSolicitation}
      dataProtection={formData.dataProtection}
      limitationOfLiability={formData.limitationOfLiability}
      breachRemedies={formData.breachRemedies}
      terminationClause={formData.terminationClause}
      governingLaw={formData.governingLaw}
      entireAgreement={formData.entireAgreement}
      additionalTerms={formData.additionalTerms}
      disclosingSignatory={formData.disclosingSignatory}
      disclosingDesignation={formData.disclosingDesignation}
      receivingSignatory={formData.receivingSignatory}
      receivingDesignation={formData.receivingDesignation}
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
          {/* Dynamic Page Filter Banner */}
          <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl shadow-xs">
            <div>
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                {showAllSections
                  ? "All Form Sections (1 - 20)"
                  : activePreviewPage === 1
                  ? "Page 1 Sections (Sections 1 - 12)"
                  : "Page 2 Sections (Sections 13 - 20)"}
              </h3>
              <p className="text-[10px] text-neutral-500 font-medium">
                {showAllSections
                  ? "Showing all 20 NDA form sections"
                  : `Form fields matching active Page ${activePreviewPage} preview`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllSections(!showAllSections)}
              className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition cursor-pointer"
            >
              {showAllSections ? "Show Page Form" : "Show All 20 Sections"}
            </button>
          </div>

          {/* PAGE 1 SECTIONS (1 - 10) */}
          {(showAllSections || activePreviewPage === 1) && (
            <>
              {/* SECTION 1: Agreement Info */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(1)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 1: Agreement Information</span>
                  {openSections[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[1] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">NDA #</label>
                        <div className="flex items-center bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl overflow-hidden shadow-xs">
                          <span className="px-2 py-2 bg-[#DFD9C9] text-[10px] font-mono font-extrabold text-neutral-800 border-r border-[#E2DDD0] select-none whitespace-nowrap">
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
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: Disclosing Party */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(2)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 2: Disclosing Party (You)</span>
                  {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[2] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.disclosingCompany}
                        onChange={(e) => setFormData({ ...formData, disclosingCompany: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Representative Name"
                        value={formData.disclosingName}
                        onChange={(e) => setFormData({ ...formData, disclosingName: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={formData.disclosingAddress}
                        onChange={(e) => setFormData({ ...formData, disclosingAddress: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={formData.disclosingPhone}
                        onChange={(e) => setFormData({ ...formData, disclosingPhone: e.target.value })}
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
                        placeholder="Website"
                        value={formData.disclosingWebsite}
                        onChange={(e) => setFormData({ ...formData, disclosingWebsite: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Receiving Party */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(3)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 3: Receiving Party (Client)</span>
                  {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[3] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
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
                        type="text"
                        placeholder="Address"
                        value={formData.receivingAddress}
                        onChange={(e) => setFormData({ ...formData, receivingAddress: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                      <input
                        type="text"
                        placeholder="Phone"
                        value={formData.receivingPhone}
                        onChange={(e) => setFormData({ ...formData, receivingPhone: e.target.value })}
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
                        placeholder="Website"
                        value={formData.receivingWebsite}
                        onChange={(e) => setFormData({ ...formData, receivingWebsite: e.target.value })}
                        className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 4: Purpose */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(4)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 4: Purpose of Disclosure</span>
                  {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[4] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 5: Definition of Confidential Information */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(5)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 5: Definition of Confidential Information</span>
                  {openSections[5] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[5] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={3}
                      value={formData.confidentialItems}
                      onChange={(e) => setFormData({ ...formData, confidentialItems: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 6: Obligations */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(6)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 6: Obligations of Receiving Party</span>
                  {openSections[6] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[6] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={3}
                      value={formData.obligations}
                      onChange={(e) => setFormData({ ...formData, obligations: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 7: Exclusions */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(7)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 7: Exclusions from Confidentiality</span>
                  {openSections[7] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[7] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.exclusions}
                      onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 8: Permitted Disclosure */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(8)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 8: Permitted Disclosure</span>
                  {openSections[8] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[8] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.permittedDisclosure}
                      onChange={(e) => setFormData({ ...formData, permittedDisclosure: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 9: Term & Duration */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(9)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 9: Term & Survival Period</span>
                  {openSections[9] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[9] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.termDuration}
                      onChange={(e) => setFormData({ ...formData, termDuration: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 10: Return or Destruction */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(10)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 10: Return or Destruction of Data</span>
                  {openSections[10] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[10] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.returnTerm}
                      onChange={(e) => setFormData({ ...formData, returnTerm: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>
              {/* SECTION 11: Intellectual Property */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(11)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 11: Intellectual Property Rights</span>
                  {openSections[11] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[11] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.ipClause}
                      onChange={(e) => setFormData({ ...formData, ipClause: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 12: Non-Solicitation */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(12)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 12: Non-Solicitation Clause</span>
                  {openSections[12] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[12] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.nonSolicitation}
                      onChange={(e) => setFormData({ ...formData, nonSolicitation: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* PAGE 2 SECTIONS (13 - 20) */}
          {(showAllSections || activePreviewPage === 2) && (
            <>

              {/* SECTION 13: Data Protection & Security */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(13)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 13: Data Protection & Cyber Security</span>
                  {openSections[13] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[13] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.dataProtection}
                      onChange={(e) => setFormData({ ...formData, dataProtection: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 14: Limitation of Liability */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(14)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 14: Limitation of Liability</span>
                  {openSections[14] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[14] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.limitationOfLiability}
                      onChange={(e) => setFormData({ ...formData, limitationOfLiability: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 15: Breach & Remedies */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(15)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 15: Breach & Legal Remedies</span>
                  {openSections[15] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[15] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.breachRemedies}
                      onChange={(e) => setFormData({ ...formData, breachRemedies: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 16: Termination */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(16)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 16: Termination Conditions</span>
                  {openSections[16] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[16] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.terminationClause}
                      onChange={(e) => setFormData({ ...formData, terminationClause: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 17: Governing Law */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(17)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 17: Governing Law & Jurisdiction</span>
                  {openSections[17] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[17] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <input
                      type="text"
                      value={formData.governingLaw}
                      onChange={(e) => setFormData({ ...formData, governingLaw: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 18: Entire Agreement */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(18)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 18: Entire Agreement</span>
                  {openSections[18] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[18] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.entireAgreement}
                      onChange={(e) => setFormData({ ...formData, entireAgreement: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 19: Additional Terms */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(19)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 19: Additional Special Terms</span>
                  {openSections[19] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[19] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      rows={2}
                      value={formData.additionalTerms}
                      onChange={(e) => setFormData({ ...formData, additionalTerms: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 20: Digital Signatures */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(20)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 20: Digital Signatures Block</span>
                  {openSections[20] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[20] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Disclosing Signatory Name</label>
                        <input
                          type="text"
                          value={formData.disclosingSignatory}
                          onChange={(e) => setFormData({ ...formData, disclosingSignatory: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 mb-2"
                        />
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Disclosing Designation</label>
                        <input
                          type="text"
                          value={formData.disclosingDesignation}
                          onChange={(e) => setFormData({ ...formData, disclosingDesignation: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Receiving Signatory Name</label>
                        <input
                          type="text"
                          value={formData.receivingSignatory}
                          onChange={(e) => setFormData({ ...formData, receivingSignatory: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 mb-2"
                        />
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Receiving Designation</label>
                        <input
                          type="text"
                          value={formData.receivingDesignation}
                          onChange={(e) => setFormData({ ...formData, receivingDesignation: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Live A4 Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live NDA Preview</span>
            
            {/* Page Arrow Switcher */}
            <div className="flex items-center gap-2 bg-[#EBE7DC] px-3 py-1 rounded-full border border-[#E2DDD0] shadow-xs">
              <button
                disabled={activePreviewPage === 1}
                onClick={() => setActivePreviewPage(1)}
                className="p-1 rounded-full hover:bg-[#DFD9C9] disabled:opacity-30 transition cursor-pointer text-neutral-900"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold font-mono text-neutral-900">
                Page {activePreviewPage} of 2
              </span>
              <button
                disabled={activePreviewPage === 2}
                onClick={() => setActivePreviewPage(2)}
                className="p-1 rounded-full hover:bg-[#DFD9C9] disabled:opacity-30 transition cursor-pointer text-neutral-900"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto shadow-xl rounded-3xl bg-[#EBE7DC] p-3 border border-[#E2DDD0]">
            {renderNDAContent(activePreviewPage, "nda-preview-onscreen")}
          </div>

          {/* Hidden Offscreen Container for PDF Export (Both Pages) */}
          <div className="fixed -left-[9999px] -top-[9999px]">
            {renderNDAContent(undefined, "nda-pdf-preview")}
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
                {/* Modal Page Switcher */}
                <div className="flex items-center gap-2 bg-[#DFD9C9] px-3 py-1 rounded-full border border-[#D5CEBC]">
                  <button
                    disabled={activePreviewPage === 1}
                    onClick={() => setActivePreviewPage(1)}
                    className="p-1 rounded-full hover:bg-neutral-900 hover:text-white disabled:opacity-30 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold font-mono text-neutral-900">
                    Page {activePreviewPage} of 2
                  </span>
                  <button
                    disabled={activePreviewPage === 2}
                    onClick={() => setActivePreviewPage(2)}
                    className="p-1 rounded-full hover:bg-neutral-900 hover:text-white disabled:opacity-30 transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

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
              {renderNDAContent(activePreviewPage, "nda-preview-modal")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
