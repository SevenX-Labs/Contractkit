"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createAgreementDB } from "../actions";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernAgreementTemplate } from "../../components/agreement/ModernAgreementTemplate";
import {
  FileCheck,
  Save,
  Building,
  User,
  Calendar,
  IndianRupee,
  Shield,
  Eye,
  X,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  Lock,
  Code,
  PenTool,
} from "lucide-react";
import { toast } from "sonner";

interface MilestoneRow {
  id: string;
  phaseName: string;
  description: string;
  deadline: string;
}

interface PaymentRow {
  id: string;
  label: string;
  percentage: number;
  amount: number;
  dueDate: string;
}

export default function AgreementPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [showFloatingPreview, setShowFloatingPreview] = useState(false);
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 7: true, 10: true });
  const [showAllSections, setShowAllSections] = useState(false);

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) => ({ ...prev, [sectionIndex]: !prev[sectionIndex] }));
  };

  const [formData, setFormData] = useState({
    // Section 1: Agreement Info
    agreementNumber: "SXL-AGR-001",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",

    // Section 2: Parties
    freelancerName: "Sahil Hode",
    freelancerCompany: "SevenX Labs",
    freelancerAddress: "Thane, Mumbai, Maharashtra",
    freelancerEmail: "sevenxlabs07@gmail.com",
    freelancerPhone: "8652601566",

    clientName: "Sophia Smith",
    clientCompany: "Smith Innovations Private Limited",
    clientAddress: "742 Evergreen Terrace, Springfield, IL 62704, USA",
    clientEmail: "sophia@smithinnovations.com",
    clientPhone: "+1 234 567 8900",

    // Section 3: Project Overview
    projectTitle: "IT DEVELOPMENT AGREEMENT",
    projectDescription: "End-to-end architecture, design, development, testing, and cloud deployment of custom web application and administrative dashboard.",
    businessGoal: "Automate client workflows, payment milestone tracking, and digital contract generation.",

    // Section 4: Scope of Work
    includedScope: "• Custom dashboard & authentication\n• REST APIs development & integration\n• PostgreSQL database & migrations\n• High-performance PDF/DOCX/PNG export engine",
    excludedScope: "• Third-party paid API subscription fees\n• Apple Developer & Google Play account registration fees",
    techStack: "Next.js 16, React 19, Tailwind CSS v4, Prisma ORM, PostgreSQL",

    // Section 5: Timeline & Milestones
    startDate: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    milestones: [
      { id: "m1", phaseName: "Phase 1: Architecture & UI Setup", description: "Design tokens, Next.js routing & database schemas", deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
      { id: "m2", phaseName: "Phase 2: Core Engineering & Testing", description: "API routes integration & export engine verification", deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
    ] as MilestoneRow[],

    // Section 6: Payment Terms
    totalAmount: 250000,
    paymentStructure: "50/50",
    paymentRows: [
      { id: "p1", label: "Advance Payment (50%)", percentage: 50, amount: 125000, dueDate: "Before project kickoff" },
      { id: "p2", label: "Final Delivery (50%)", percentage: 50, amount: 125000, dueDate: "On final code handover" },
    ] as PaymentRow[],

    // Section 7: IP Rights
    ipTransferCondition: "Full intellectual property rights and source code ownership shall be transferred to the Client upon 100% full payment receipt.",

    // Section 8: Deliverables
    deliverablesList: "1. Production Next.js Source Code Repository\n2. Prisma PostgreSQL Database Migrations\n3. System Documentation & API Specs",

    // Section 9: Confidentiality & Support
    confidentialityClause: "Both parties agree to protect proprietary algorithms, source code, and commercial data under strict confidentiality for 2 years.",
    freeSupportPeriod: "30 days post-launch warranty bug fix support included.",
    revisionLimit: 2,

    // Section 10: Digital Signatures
    freelancerSignatureName: "Sahil Hode (SevenX Labs)",
    clientSignatureName: "Sophia Smith (Managing Director)",
    freelancerSignDate: new Date().toISOString().split("T")[0],
    clientSignDate: new Date().toISOString().split("T")[0],
  });

  const [agrSeq, setAgrSeq] = useState("000001");

  useEffect(() => {
    const savedEdit = localStorage.getItem("edit_agreement");
    if (savedEdit) {
      try {
        const parsed = JSON.parse(savedEdit);
        setFormData(parsed);
        localStorage.removeItem("edit_agreement");
        toast.success("Document loaded into editor!");
        return;
      } catch (e) {}
    }

    Promise.all([getProfileDB(), getNextDocumentNumberDB("AGREEMENT")]).then(([profile, num]) => {
      const rawSeq = num.split("-").pop() || "001";
      const cleanSeq = rawSeq.replace(/[^0-9]/g, "") || "001";
      setAgrSeq(cleanSeq);

      const year = new Date().getFullYear();
      const fullDocNum = `SXL-AGR-${year}-${cleanSeq}`;

      setFormData((prev) => ({
        ...prev,
        agreementNumber: fullDocNum,
        freelancerName: profile.name || "Sahil Hode",
        freelancerCompany: "SevenX Labs",
        freelancerAddress: profile.address || "Thane, Mumbai, Maharashtra",
        freelancerEmail: profile.email || "sevenxlabs07@gmail.com",
        freelancerPhone: profile.phone || "8652601566",
        bankName: profile.bankName || "HDFC Bank",
        bankAccount: profile.bankAccount || "50100234567890",
        bankIfsc: profile.bankIfsc || "HDFC0001234",
        upiId: profile.upiId || "sevenxlabs@upi",
      }));
    });
  }, []);

  const handlePaymentStructureChange = (structure: string) => {
    const val = formData.totalAmount;
    let newRows: PaymentRow[] = [];

    if (structure === "50/50") {
      newRows = [
        { id: "p1", label: "Advance Payment (50%)", percentage: 50, amount: val * 0.5, dueDate: "Before project kickoff" },
        { id: "p2", label: "Final Delivery (50%)", percentage: 50, amount: val * 0.5, dueDate: "On final code handover" },
      ];
    } else if (structure === "3-Way Split") {
      newRows = [
        { id: "p1", label: "Advance Deposit (30%)", percentage: 30, amount: val * 0.3, dueDate: "Before project kickoff" },
        { id: "p2", label: "Milestone 2: Beta Prototype (30%)", percentage: 30, amount: val * 0.3, dueDate: "Upon Phase 2 completion" },
        { id: "p3", label: "Final Deployment (40%)", percentage: 40, amount: val * 0.4, dueDate: "On final project handover" },
      ];
    } else if (structure === "Full Payment After Work") {
      newRows = [{ id: "p1", label: "Full Payment Upon Completion (100%)", percentage: 100, amount: val, dueDate: "Upon final project handover" }];
    } else {
      newRows = [{ id: "p1", label: "Full Upfront Deposit (100%)", percentage: 100, amount: val, dueDate: "Before project start" }];
    }

    setFormData({ ...formData, paymentStructure: structure, paymentRows: newRows });
  };

  const handleTotalAmountChange = (val: number) => {
    const updatedRows = formData.paymentRows.map((r) => ({
      ...r,
      amount: (val * r.percentage) / 100,
    }));
    setFormData({ ...formData, totalAmount: val, paymentRows: updatedRows });
  };

  const addMilestone = () => {
    const newM: MilestoneRow = {
      id: `m-${Date.now()}`,
      phaseName: `Phase ${formData.milestones.length + 1}`,
      description: "Deliverable description",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };
    setFormData({ ...formData, milestones: [...formData.milestones, newM] });
  };

  const removeMilestone = (id: string) => {
    setFormData({ ...formData, milestones: formData.milestones.filter((m) => m.id !== id) });
  };

  const handleSave = async () => {
    if (!formData.clientName) {
      toast.error("Please enter Client Name before saving.");
      return;
    }

    setIsSaving(true);
    const res = await createAgreementDB(formData as any);
    setIsSaving(false);

    if (res.success) {
      toast.success(`Agreement #${formData.agreementNumber} saved successfully!`);
    } else {
      toast.error(`Error saving agreement: ${res.error}`);
    }
  };

  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);

  const handleExportPDF = async () => {
    const currentDocNum = formData.agreementNumber;
    await exportToPDF("agreement-pdf-preview", `Agreement-${currentDocNum}.pdf`);
    await handleSave();
  };

  const handleExportDOCX = async () => {
    const currentDocNum = formData.agreementNumber;
    await exportToDOCX("agreement-pdf-preview", `Agreement-${currentDocNum}.docx`);
    await handleSave();
  };

  const handleExportPNG = async () => {
    const currentDocNum = formData.agreementNumber;
    await exportToImage("agreement-pdf-preview", `Agreement-${currentDocNum}.png`);
    await handleSave();
  };

  const renderAgreementContent = (page?: number, elementId = "agreement-pdf-preview") => (
    <ModernAgreementTemplate
      id={elementId}
      activePage={page}
      agreementNumber={formData.agreementNumber}
      effectiveDate={formData.date}
      version={formData.version}
      providerName={formData.freelancerName}
      providerCompany={formData.freelancerCompany}
      providerAddress={formData.freelancerAddress}
      providerEmail={formData.freelancerEmail}
      providerPhone={formData.freelancerPhone}
      clientName={formData.clientName}
      clientCompany={formData.clientCompany}
      clientAddress={formData.clientAddress}
      clientEmail={formData.clientEmail}
      clientPhone={formData.clientPhone}
      projectTitle={formData.projectTitle}
      projectDescription={formData.projectDescription}
      businessGoal={formData.businessGoal}
      techStack={formData.techStack}
      includedScope={formData.includedScope}
      excludedScope={formData.excludedScope}
      deliverables={formData.deliverablesList}
      startDate={formData.startDate}
      deliveryDate={formData.deadline}
      totalAmount={formData.totalAmount}
      advanceAmount={formData.totalAmount * 0.5}
      balanceAmount={formData.totalAmount * 0.5}
      paymentSchedule={`${formData.paymentStructure} payment structure.`}
      ipClause={formData.ipTransferCondition}
      confidentialityClause={formData.confidentialityClause}
      warrantyPeriod={formData.freeSupportPeriod}
      providerSignatory={formData.freelancerSignatureName}
      clientSignatory={formData.clientSignatureName}
      currencySymbol="₹"
    />
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Create Agreement</h1>
            <p className="text-xs text-neutral-600 font-medium">Generate a professional freelance contract matching invoice design system</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
                  ? "All Form Sections (1 - 10)"
                  : activePreviewPage === 1
                  ? "Page 1 Sections (Sections 1 - 6)"
                  : "Page 2 Sections (Sections 7 - 10)"}
              </h3>
              <p className="text-[10px] text-neutral-500 font-medium">
                {showAllSections
                  ? "Showing all 10 form sections"
                  : `Form fields matching active Page ${activePreviewPage} preview`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllSections(!showAllSections)}
              className="text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full border border-purple-200 transition cursor-pointer"
            >
              {showAllSections ? "Show Page Form" : "Show All Sections"}
            </button>
          </div>

          {/* PAGE 1 SECTIONS (1 - 6) */}
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
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Agreement #</label>
                        <div className="flex items-center bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl overflow-hidden shadow-xs">
                          <span className="px-2.5 py-2 bg-[#DFD9C9] text-[11px] font-mono font-extrabold text-neutral-800 border-r border-[#E2DDD0] select-none whitespace-nowrap">
                            SXL-AGR-{new Date().getFullYear()}-
                          </span>
                          <input
                            type="text"
                            value={agrSeq}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              setAgrSeq(val);
                              const year = new Date().getFullYear();
                              setFormData((prev) => ({
                                ...prev,
                                agreementNumber: `SXL-AGR-${year}-${val || "001"}`,
                              }));
                            }}
                            placeholder="001"
                            className="flex-1 bg-transparent px-2 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
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
                  <span>SECTION 2: Parties (Freelancer & Client)</span>
                  {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[2] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider">Freelancer (You)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={formData.freelancerName}
                          onChange={(e) => setFormData({ ...formData, freelancerName: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Business Name"
                          value={formData.freelancerCompany}
                          onChange={(e) => setFormData({ ...formData, freelancerCompany: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.freelancerEmail}
                          onChange={(e) => setFormData({ ...formData, freelancerEmail: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={formData.freelancerPhone}
                          onChange={(e) => setFormData({ ...formData, freelancerPhone: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">Client</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Full Name *"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Company Name"
                          value={formData.clientCompany}
                          onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Phone"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Project Overview */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(3)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 3: Project Overview</span>
                  {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[3] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                    <textarea
                      placeholder="Brief Description (2-3 lines)"
                      rows={3}
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Business Goal (what problem this solves)"
                      value={formData.businessGoal}
                      onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 4: Scope of Work */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(4)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 4: Scope of Work & Tech Stack</span>
                  {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[4] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      placeholder="What's INCLUDED (bullet list)"
                      rows={3}
                      value={formData.includedScope}
                      onChange={(e) => setFormData({ ...formData, includedScope: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-none"
                    />
                    <textarea
                      placeholder="What's NOT INCLUDED (explicit exclusions)"
                      rows={2}
                      value={formData.excludedScope}
                      onChange={(e) => setFormData({ ...formData, excludedScope: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Technology Stack"
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 5: Milestones */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(5)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 5: Timeline & Milestones</span>
                  {openSections[5] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[5] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-700">Project Milestones</span>
                      <button
                        type="button"
                        onClick={addMilestone}
                        className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Milestone</span>
                      </button>
                    </div>
                    {formData.milestones.map((m) => (
                      <div key={m.id} className="grid grid-cols-12 gap-2 bg-[#F4F0E6] p-3 rounded-xl border border-[#E2DDD0]">
                        <input
                          type="text"
                          value={m.phaseName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              milestones: formData.milestones.map((row) => (row.id === m.id ? { ...row, phaseName: e.target.value } : row)),
                            })
                          }
                          className="col-span-4 bg-transparent text-xs font-bold text-neutral-900"
                        />
                        <input
                          type="text"
                          value={m.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              milestones: formData.milestones.map((row) => (row.id === m.id ? { ...row, description: e.target.value } : row)),
                            })
                          }
                          className="col-span-5 bg-transparent text-xs text-neutral-700"
                        />
                        <input
                          type="date"
                          value={m.deadline}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              milestones: formData.milestones.map((row) => (row.id === m.id ? { ...row, deadline: e.target.value } : row)),
                            })
                          }
                          className="col-span-2 bg-[#EBE7DC] text-xs font-mono text-neutral-900 rounded p-1"
                        />
                        <button
                          type="button"
                          onClick={() => removeMilestone(m.id)}
                          className="col-span-1 text-neutral-400 hover:text-pink-700 text-right cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 6: Payment Terms */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(6)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 6: Payment Terms & Auto-Milestones</span>
                  {openSections[6] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[6] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Total Fee (₹)</label>
                        <input
                          type="number"
                          value={formData.totalAmount}
                          onChange={(e) => handleTotalAmountChange(Number(e.target.value))}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-extrabold text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Payment Structure</label>
                        <select
                          value={formData.paymentStructure}
                          onChange={(e) => handlePaymentStructureChange(e.target.value)}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        >
                          <option value="50/50">50/50 Split (50% Advance + 50% Final)</option>
                          <option value="3-Way Split">3-Way Split (30% + 30% + 40%)</option>
                          <option value="Milestone-based">Milestone-based (40% + 60%)</option>
                          <option value="Full Upfront">Full Upfront (100%)</option>
                          <option value="Full Payment After Work">Full Payment After Work (100% Upon Completion)</option>
                          <option value="Monthly Retainer">Monthly Retainer</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-2">
                      <span className="text-[11px] font-bold text-neutral-700">Auto-Generated Payment Breakdown</span>
                      {formData.paymentRows.map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4F0E6] border border-[#E2DDD0] text-xs">
                          <span className="font-bold text-neutral-900">{r.label} ({r.percentage}%)</span>
                          <span className="font-extrabold font-mono text-neutral-900">{formatCurrency(r.amount, "₹")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* PAGE 2 SECTIONS (7 - 10) */}
          {(showAllSections || activePreviewPage === 2) && (
            <>
              {/* SECTION 7: IP Rights */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(7)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 7: Intellectual Property & Ownership</span>
                  {openSections[7] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[7] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      placeholder="IP Transfer Condition"
                      rows={3}
                      value={formData.ipTransferCondition}
                      onChange={(e) => setFormData({ ...formData, ipTransferCondition: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 8: Deliverables */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(8)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 8: Deliverables & System Handover</span>
                  {openSections[8] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[8] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      placeholder="Deliverables List"
                      rows={3}
                      value={formData.deliverablesList}
                      onChange={(e) => setFormData({ ...formData, deliverablesList: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-mono"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 9: Confidentiality & Warranty */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(9)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 9: Confidentiality & Warranty Support</span>
                  {openSections[9] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[9] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      placeholder="Confidentiality Clause"
                      rows={2}
                      value={formData.confidentialityClause}
                      onChange={(e) => setFormData({ ...formData, confidentialityClause: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                    <input
                      type="text"
                      placeholder="Warranty Period (e.g. 30 days post-launch)"
                      value={formData.freeSupportPeriod}
                      onChange={(e) => setFormData({ ...formData, freeSupportPeriod: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>
                )}
              </div>

              {/* SECTION 10: Digital Signatures */}
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(10)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 10: Digital Signatures Block</span>
                  {openSections[10] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[10] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Developer Signatory</label>
                        <input
                          type="text"
                          value={formData.freelancerSignatureName}
                          onChange={(e) => setFormData({ ...formData, freelancerSignatureName: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Signatory</label>
                        <input
                          type="text"
                          value={formData.clientSignatureName}
                          onChange={(e) => setFormData({ ...formData, clientSignatureName: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
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
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live Contract Preview</span>
            
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
                {renderAgreementContent(activePreviewPage, "agreement-preview-onscreen")}
              </div>
            </div>
          </div>

          {/* Hidden Offscreen Container for PDF Export (Both Pages) */}
          <div style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm", overflow: "hidden", pointerEvents: "none" }}>
            {renderAgreementContent(undefined, "agreement-pdf-preview")}
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Contract Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Agreement #{formData.agreementNumber}</p>
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
              {renderAgreementContent(activePreviewPage, "agreement-preview-modal")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
