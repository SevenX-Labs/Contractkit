"use client";

import React, { useState } from "react";
import { ModernNDATemplate } from "../../components/nda/ModernNDATemplate";
import {
  FileText,
  Download,
  Share2,
  Save,
  Eye,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { createNDADB } from "../actions";

export default function NDABuilderPage() {
  const { exportToPDF, exportToImage, exportToDOCX, isExporting } = useDocumentExport();

  // Active Preview Page State (1 or 2)
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);
  const [showAllSections, setShowAllSections] = useState<boolean>(false);
  const [accentColor, setAccentColor] = useState<"lime" | "purple" | "pink" | "emerald">("lime");
  const [isSaving, setIsSaving] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);

  // Accordion Toggle States (Sections 1 to 18)
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
    9: false,
    10: false,
    11: false,
    12: false,
    13: false,
    14: false,
    15: false,
    16: false,
    17: false,
    18: false,
  });

  const toggleSection = (section: number) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Fixed Document Number Prefix + Sequence Number
  const [ndaSeq, setNdaSeq] = useState("000001");

  // Complete Form State (Generic Freelancer NDA)
  const [formData, setFormData] = useState({
    ndaNumber: `SXL-NDA-${new Date().getFullYear()}-000001`,
    effectiveDate: new Date().toISOString().split("T")[0],

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

    // Freelancer NDA Clauses
    purpose: "Evaluating business partnership, freelance design/development services, custom software engineering, and technical project requirements.",
    confidentialItems: "Source Code, Database Schemas, REST APIs, UI/UX Wireframes, Business Logic, Customer Data, Financial Information, Credentials, and Project Specifications.",
    obligations: "Maintain strict confidentiality, prevent unauthorized disclosure, refrain from copying or distributing confidential materials, and restrict access solely to project personnel.",
    exclusions: "Information that is already public, previously known without restriction, received legally from a third party, or independently developed without reference to Confidential Information.",
    permittedDisclosure: "Disclosures approved in writing by the disclosing party, required by legal process, or made to professional legal/financial advisors bound by confidentiality.",
    termDuration: "Agreement remains effective during project collaboration; confidentiality obligations survive for 3 years post-termination.",
    returnTerm: "Upon written request, Receiving Party shall immediately return or permanently delete all digital files, project backups, and physical documents.",
    ipClause: "All pre-existing intellectual property, project assets, and custom deliverables remain strictly owned by the respective owner. No transfer or license is implied unless agreed separately.",
    dataProtection: "Employ reasonable security measures, password protection, secure storage, and strict credential access controls for all shared materials.",
    limitationOfLiability: "Neither party shall be liable for indirect, incidental, or consequential damages. Liability is limited to direct actual damages arising from project scope.",
    breachRemedies: "Prompt written notice of any actual or suspected breach, right to seek immediate injunctive relief, and recovery of reasonable legal expenses.",
    terminationClause: "Either party may terminate this agreement upon written notice. Confidentiality and non-disclosure duties survive project termination.",
    entireAgreement: "This Agreement represents the complete understanding between parties regarding confidentiality, superseding all prior oral or written discussions.",
    additionalTerms: "Special Conditions: Custom project clauses, remote work protocols, and communication guidelines agreed upon by both parties.",

    // Signatures
    disclosingSignatory: "Sahil Hode",
    disclosingDesignation: "Founder & Lead Developer",
    receivingSignatory: "Sophia Smith",
    receivingDesignation: "Managing Director",
  });

  // Save to Database Handler
  const handleSaveToDB = async () => {
    try {
      setIsSaving(true);
      const res = await createNDADB(formData);
      if (res.success) {
        toast.success(`NDA #${formData.ndaNumber} saved successfully!`);
        const nextNum = await getNextDocumentNumberDB("NDA");
        setFormData((prev) => ({ ...prev, ndaNumber: nextNum }));
      } else {
        toast.error("Failed to save NDA to database.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving NDA.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-neutral-900 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#EBE7DC]/90 backdrop-blur-md border-b border-[#E2DDD0] px-6 py-3.5 flex items-center justify-between shadow-xs">
        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              Freelancer NDA Builder
              <span className="text-[10px] font-extrabold bg-[#a6ce39] text-neutral-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Generic Template
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Create, edit, preview & export generic freelancer non-disclosure agreements
            </p>
          </div>
        </div>

        {/* Action Controls: 1. Preview -> 2. Save -> 3. Export As Dropdown */}
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

          {/* 1. Preview Button */}
          <button
            onClick={() => setIsModalPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#DFD9C9] hover:bg-[#D5CEBC] text-neutral-900 rounded-xl font-bold text-xs transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-purple-600" />
            <span>Full Preview</span>
          </button>

          {/* 2. Save Button */}
          <button
            type="button"
            onClick={handleSaveToDB}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#121212] hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-[#a6ce39]" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>

          {/* 3. Export As Dropdown Button */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#a6ce39] hover:bg-[#95bd2f] text-neutral-900 rounded-xl font-extrabold text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export As</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-44 bg-[#0a0a0a] text-white rounded-2xl p-1.5 shadow-xl border border-neutral-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <button
                onClick={async () => {
                  const currentDocNum = formData.ndaNumber;
                  await exportToPDF("nda-export-container", `NDA-${currentDocNum}.pdf`);
                  await handleSaveToDB();
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export PDF</span>
                <span className="text-[10px] text-[#a6ce39]">.pdf</span>
              </button>

              <button
                onClick={async () => {
                  const currentDocNum = formData.ndaNumber;
                  await exportToDOCX("nda-export-container", `NDA-${currentDocNum}.docx`);
                  await handleSaveToDB();
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export DOCX</span>
                <span className="text-[10px] text-blue-400">.docx</span>
              </button>

              <button
                onClick={async () => {
                  const currentDocNum = formData.ndaNumber;
                  await exportToImage("nda-export-container", `NDA-${currentDocNum}.png`);
                  await handleSaveToDB();
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
            {/* Dynamic Page Filter Banner */}
            <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl shadow-xs">
              <div>
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  {showAllSections
                    ? "All Form Sections (1 - 18)"
                    : activePreviewPage === 1
                    ? "Page 1 Sections (Sections 1 - 10)"
                    : "Page 2 Sections (Sections 11 - 18)"}
                </h3>
                <p className="text-[10px] text-neutral-500 font-medium">
                  {showAllSections
                    ? "Showing all 18 generic NDA form sections"
                    : `Form fields matching active Page ${activePreviewPage} preview`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllSections(!showAllSections)}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition cursor-pointer"
              >
                {showAllSections ? "Show Page Form" : "Show All 18 Sections"}
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

                {/* SECTION 2: Parties Details */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(2)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 2: Disclosing & Receiving Parties</span>
                    {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[2] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-5">
                      {/* Disclosing Party */}
                      <div>
                        <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-2 pb-1 border-b border-[#D5CEBC]">
                          1. Disclosing Party Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company / Studio</label>
                            <input
                              type="text"
                              value={formData.disclosingCompany}
                              onChange={(e) => setFormData({ ...formData, disclosingCompany: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Representative Name</label>
                            <input
                              type="text"
                              value={formData.disclosingName}
                              onChange={(e) => setFormData({ ...formData, disclosingName: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Address</label>
                            <input
                              type="text"
                              value={formData.disclosingAddress}
                              onChange={(e) => setFormData({ ...formData, disclosingAddress: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email Address</label>
                            <input
                              type="email"
                              value={formData.disclosingEmail}
                              onChange={(e) => setFormData({ ...formData, disclosingEmail: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={formData.disclosingPhone}
                              onChange={(e) => setFormData({ ...formData, disclosingPhone: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Receiving Party */}
                      <div>
                        <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider mb-2 pb-1 border-b border-[#D5CEBC]">
                          2. Receiving Party Details
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Receiving Name</label>
                            <input
                              type="text"
                              value={formData.receivingName}
                              onChange={(e) => setFormData({ ...formData, receivingName: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company (Optional)</label>
                            <input
                              type="text"
                              value={formData.receivingCompany}
                              onChange={(e) => setFormData({ ...formData, receivingCompany: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Address</label>
                            <input
                              type="text"
                              value={formData.receivingAddress}
                              onChange={(e) => setFormData({ ...formData, receivingAddress: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email Address</label>
                            <input
                              type="email"
                              value={formData.receivingEmail}
                              onChange={(e) => setFormData({ ...formData, receivingEmail: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={formData.receivingPhone}
                              onChange={(e) => setFormData({ ...formData, receivingPhone: e.target.value })}
                              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* SECTION 3: Purpose */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(3)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 3: Purpose of Disclosure</span>
                    {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[3] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                      <textarea
                        rows={3}
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 4: Definition of Confidential Info */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(4)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 4: Definition of Confidential Information</span>
                    {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[4] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                      <textarea
                        rows={3}
                        value={formData.confidentialItems}
                        onChange={(e) => setFormData({ ...formData, confidentialItems: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 5: Obligations */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(5)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 5: Obligations of Receiving Party</span>
                    {openSections[5] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[5] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                      <textarea
                        rows={3}
                        value={formData.obligations}
                        onChange={(e) => setFormData({ ...formData, obligations: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 6: Exclusions */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(6)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 6: Exclusions from Confidentiality</span>
                    {openSections[6] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[6] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                      <textarea
                        rows={3}
                        value={formData.exclusions}
                        onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                      />
                    </div>
                  )}
                </div>

                {/* SECTION 7: Permitted Disclosures */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(7)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 7: Permitted Disclosures</span>
                    {openSections[7] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[7] && (
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

                {/* SECTION 8: Term & Survival Duration */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(8)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 8: Term & Survival Duration</span>
                    {openSections[8] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[8] && (
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

                {/* SECTION 9: Return or Destruction */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(9)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 9: Return or Destruction of Data</span>
                    {openSections[9] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[9] && (
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

                {/* SECTION 10: Intellectual Property */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(10)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 10: Intellectual Property Rights</span>
                    {openSections[10] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[10] && (
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
              </>
            )}

            {/* PAGE 2 SECTIONS (11 - 18) */}
            {(showAllSections || activePreviewPage === 2) && (
              <>
                {/* SECTION 11: Data Protection & Security */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(11)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 11: Data Protection & Cyber Security</span>
                    {openSections[11] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[11] && (
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

                {/* SECTION 12: Limitation of Liability */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(12)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 12: Limitation of Liability</span>
                    {openSections[12] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[12] && (
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

                {/* SECTION 13: Breach & Remedies */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(13)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 13: Breach & Legal Remedies</span>
                    {openSections[13] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[13] && (
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

                {/* SECTION 14: Termination */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(14)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 14: Termination Conditions</span>
                    {openSections[14] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[14] && (
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

                {/* SECTION 15: Entire Agreement */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(15)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 15: Entire Agreement</span>
                    {openSections[15] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[15] && (
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

                {/* SECTION 16: Additional Terms */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(16)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 16: Additional Special Terms</span>
                    {openSections[16] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[16] && (
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

                {/* SECTION 17: Disclosing Signatory */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(17)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 17: Disclosing Party Signature</span>
                    {openSections[17] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[17] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
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
                  )}
                </div>

                {/* SECTION 18: Receiving Signatory */}
                <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleSection(18)}
                    className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                  >
                    <span>SECTION 18: Receiving Party Signature</span>
                    {openSections[18] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openSections[18] && (
                    <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
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
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Live Preview Panel with Page Switcher Controls */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-20">
            {/* Live Preview Header Controls */}
            <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6ce39] animate-pulse" />
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Live NDA Preview
                </h3>
              </div>

              {/* Page Switcher Switch */}
              <div className="flex items-center gap-2 bg-[#DFD9C9] p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActivePreviewPage(1)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activePreviewPage === 1
                      ? "bg-[#0a0a0a] text-white shadow-xs"
                      : "text-neutral-700 hover:text-neutral-900"
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Page 1</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewPage(2)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activePreviewPage === 2
                      ? "bg-[#0a0a0a] text-white shadow-xs"
                      : "text-neutral-700 hover:text-neutral-900"
                  }`}
                >
                  <span>Page 2</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Preview Stage */}
            <div className="w-full bg-[#DFD9C9] p-4 rounded-3xl border border-[#D5CEBC] shadow-inner overflow-hidden flex flex-col items-center">
              <div className="w-full flex justify-center overflow-hidden">
                <div
                  className="origin-top transition-transform duration-300 shadow-2xl rounded-2xl shrink-0"
                  style={{
                    transform: "scale(0.52)",
                    width: "210mm",
                    marginBottom: "calc(-297mm * 0.48)",
                  }}
                >
                  <ModernNDATemplate
                    {...formData}
                    activePage={activePreviewPage}
                    accentColor={accentColor}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Offscreen Container for Clean PDF/DOCX/PNG Exports */}
      <div className="hidden">
        <div id="nda-export-container">
          <ModernNDATemplate
            {...formData}
            activePage={undefined}
            accentColor={accentColor}
          />
        </div>
      </div>

      {/* Full Modal Preview Modal */}
      {isModalPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <h3 className="text-sm font-black text-neutral-900 uppercase tracking-wider">
                Full Document Preview (Page {activePreviewPage} of 2)
              </h3>
              <div className="flex items-center gap-3">
                {/* Modal Page Switcher */}
                <div className="flex items-center gap-2 bg-[#DFD9C9] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setActivePreviewPage(1)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activePreviewPage === 1 ? "bg-[#0a0a0a] text-white" : "text-neutral-700"
                    }`}
                  >
                    Page 1
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreviewPage(2)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      activePreviewPage === 2 ? "bg-[#0a0a0a] text-white" : "text-neutral-700"
                    }`}
                  >
                    Page 2
                  </button>
                </div>
                <button
                  onClick={() => setIsModalPreviewOpen(false)}
                  className="px-4 py-1.5 bg-[#0a0a0a] text-white rounded-xl font-bold text-xs hover:bg-neutral-800 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex justify-center py-4 bg-[#DFD9C9] rounded-2xl">
              <div className="scale-[0.95] origin-top">
                <ModernNDATemplate
                  {...formData}
                  activePage={activePreviewPage}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
