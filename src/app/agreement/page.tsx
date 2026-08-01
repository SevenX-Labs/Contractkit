"use client";

import React, { useState, useEffect } from "react";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { getProfileDB, getNextDocumentNumberDB, createAgreementDB } from "../actions";
import { formatCurrency, formatDate } from "../../lib/utils";
import { ExportDropdown } from "../../components/common/ExportDropdown";
import { ModernAgreementTemplate, CustomPageItem } from "../../components/agreement/ModernAgreementTemplate";
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
  Layers,
  FileText,
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
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 7: true, 10: true, 11: true });
  const [showAllSections, setShowAllSections] = useState(false);
  const [pageLayoutMode, setPageLayoutMode] = useState<"2-page" | "3-page" | "4-page">("3-page");
  const [activePreviewPage, setActivePreviewPage] = useState<number>(1);

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) => ({ ...prev, [sectionIndex]: !prev[sectionIndex] }));
  };

  const [formData, setFormData] = useState({
    // Section 1: Agreement Info (AUTO-FILLED Number & Date)
    agreementNumber: "SXL-AGR-001",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",

    // Section 2: Parties (Freelancer/My Details AUTO-FILLED from DB, Client Empty)
    freelancerName: "",
    freelancerCompany: "SevenX Labs",
    freelancerAddress: "",
    freelancerEmail: "",
    freelancerPhone: "",

    clientName: "",
    clientCompany: "",
    clientAddress: "",
    clientEmail: "",
    clientPhone: "",

    // Section 3: Project Overview (EMPTY FOR USER INPUT)
    projectTitle: "",
    projectDescription: "",
    businessGoal: "",
    projectType: "",
    platforms: "",

    // Section 4: Scope of Work (EMPTY FOR USER INPUT)
    includedScope: "",
    excludedScope: "",
    techStack: "",

    // Section 5: Timeline & Milestones (EMPTY FOR USER INPUT)
    startDate: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    milestones: [] as MilestoneRow[],

    // Section 6: Payment Terms (EMPTY FOR USER INPUT)
    totalAmount: 0,
    paymentStructure: "50/50",
    customPaymentTerms: "",
    paymentRows: [] as PaymentRow[],

    // Section 7: IP Rights (EMPTY FOR USER INPUT)
    ipTransferCondition: "",

    // Section 8: Deliverables (EMPTY FOR USER INPUT)
    deliverablesList: "",

    // Section 9: Confidentiality & Support (EMPTY FOR USER INPUT)
    confidentialityClause: "",
    freeSupportPeriod: "30 Days Free Warranty",
    warrantyScope: "The warranty period covers bug fixes, security patches, and issues directly related to the deliverables.",
    revisionLimit: 2,

    // Section 10: Digital Signatures (My Signature AUTO-FILLED, Client Empty)
    freelancerSignatureName: "",
    clientSignatureName: "",
    freelancerSignDate: new Date().toISOString().split("T")[0],
    clientSignDate: new Date().toISOString().split("T")[0],

    // Section 11+: Custom Additional Pages
    customPages: [] as CustomPageItem[],

    // Payment Info (AUTO-FILLED from DB)
    bankName: "",
    bankAccount: "",
    bankIfsc: "",
    upiId: "",
  });

  const [agrSeq, setAgrSeq] = useState("000001");

  useEffect(() => {
    const savedEdit = localStorage.getItem("edit_agreement");
    if (savedEdit) {
      try {
        const parsed = JSON.parse(savedEdit);
        setFormData((prev) => ({ ...prev, ...parsed }));
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
        freelancerSignatureName: `${profile.name || "Sahil Hode"} (SevenX Labs)`,
        bankName: profile.bankName || "HDFC Bank",
        bankAccount: profile.bankAccount || "50100234567890",
        bankIfsc: profile.bankIfsc || "HDFC0001234",
        upiId: profile.upiId || "sevenxlabs@upi",
      }));
    });
  }, []);

  const basePagesCount = pageLayoutMode === "2-page" ? 2 : 3;
  const totalPagesCount = basePagesCount + formData.customPages.length;

  const handlePaymentStructureChange = (structure: string) => {
    const val = formData.totalAmount;
    let newRows: PaymentRow[] = [];
    let customText = formData.customPaymentTerms;

    if (structure === "50/50") {
      newRows = [
        { id: "p1", label: "Advance Payment (50%)", percentage: 50, amount: val * 0.5, dueDate: "Before project kickoff" },
        { id: "p2", label: "Final Delivery (50%)", percentage: 50, amount: val * 0.5, dueDate: "On final code handover" },
      ];
      customText = `Total Fixed Project Fee: ₹${val ? val.toLocaleString("en-IN") : "0"} (50% Advance / 50% Final Handover).\n- 50% Advance deposit before project kickoff.\n- 50% Balance payment upon final deployment & code handover.`;
    } else if (structure === "3-Way Split") {
      newRows = [
        { id: "p1", label: "Advance Deposit (30%)", percentage: 30, amount: val * 0.3, dueDate: "Before project kickoff" },
        { id: "p2", label: "Milestone 2: Beta Prototype (30%)", percentage: 30, amount: val * 0.3, dueDate: "Upon Phase 2 completion" },
        { id: "p3", label: "Final Deployment (40%)", percentage: 40, amount: val * 0.4, dueDate: "On final project handover" },
      ];
      customText = `Total Project Fee: ₹${val ? val.toLocaleString("en-IN") : "0"} (3-Way Milestone Split).\n- 30% Upfront deposit to start work.\n- 30% Second milestone upon beta prototype demo.\n- 40% Final balance upon production launch & handover.`;
    } else if (structure === "Monthly Retainer") {
      newRows = [
        { id: "p1", label: "Monthly Retainer (Month 1)", percentage: 100, amount: val, dueDate: "Due 1st of each month" },
      ];
      customText = `Monthly Retainer Agreement: ₹${val ? val.toLocaleString("en-IN") : "0"} / month.\n- Invoiced monthly in advance on the 1st of every billing cycle.\n- Covers recurring maintenance, support, development & server upkeep.`;
    } else if (structure === "Full Upfront") {
      newRows = [{ id: "p1", label: "Full Upfront Deposit (100%)", percentage: 100, amount: val, dueDate: "Before project start" }];
      customText = `Total Upfront Fee: ₹${val ? val.toLocaleString("en-IN") : "0"} (100% Paid Upfront).\n- Full payment required prior to commencement of work.`;
    } else if (structure === "Full Payment After Work") {
      newRows = [{ id: "p1", label: "Full Payment Upon Completion (100%)", percentage: 100, amount: val, dueDate: "Upon final project handover" }];
      customText = `Total Project Fee: ₹${val ? val.toLocaleString("en-IN") : "0"} (100% Due Upon Handover).\n- Full payment due within 7 days of final system delivery and client sign-off.`;
    }

    setFormData({
      ...formData,
      paymentStructure: structure,
      customPaymentTerms: customText,
      paymentRows: newRows,
    });
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

  const addCustomPage = () => {
    const newPageNum = basePagesCount + formData.customPages.length + 1;
    const newPage: CustomPageItem = {
      id: `cp-${Date.now()}`,
      title: `APPENDIX: ADDITIONAL TERMS (PAGE ${newPageNum})`,
      subtitle: "Custom Specifications & SLA Addendum",
      content: "",
    };
    setFormData((prev) => ({ ...prev, customPages: [...prev.customPages, newPage] }));
    setActivePreviewPage(newPageNum);
    toast.success(`Page ${newPageNum} added to document!`);
  };

  const removeCustomPage = (id: string) => {
    const updated = formData.customPages.filter((p) => p.id !== id);
    setFormData({ ...formData, customPages: updated });
    const newTotal = basePagesCount + updated.length;
    if (activePreviewPage > newTotal) {
      setActivePreviewPage(Math.max(1, newTotal));
    }
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
      pageLayout={pageLayoutMode}
      totalPages={totalPagesCount}
      customPages={formData.customPages}
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
      projectType={formData.projectType}
      platforms={formData.platforms}
      techStack={formData.techStack}
      includedScope={formData.includedScope}
      excludedScope={formData.excludedScope}
      milestones={formData.milestones}
      paymentRows={formData.paymentRows}
      customPaymentTerms={formData.customPaymentTerms}
      deliverables={formData.deliverablesList}
      startDate={formData.startDate}
      deliveryDate={formData.deadline}
      totalAmount={formData.totalAmount}
      advanceAmount={formData.paymentRows[0]?.amount || formData.totalAmount * 0.5}
      balanceAmount={formData.paymentRows[1]?.amount || formData.totalAmount * 0.5}
      paymentSchedule={formData.paymentStructure ? `${formData.paymentStructure} payment structure.` : ""}
      bankName={formData.bankName}
      bankAccount={formData.bankAccount}
      bankIfsc={formData.bankIfsc}
      upiId={formData.upiId}
      ipClause={formData.ipTransferCondition}
      confidentialityClause={formData.confidentialityClause}
      warrantyPeriod={formData.freeSupportPeriod}
      warrantyScope={formData.warrantyScope}
      providerSignatory={formData.freelancerSignatureName}
      clientSignatory={formData.clientSignatureName}
      currencySymbol="₹"
    />
  );

  const isSectionVisible = (sectionNum: number) => {
    if (showAllSections) return true;
    if (pageLayoutMode === "2-page") {
      if (activePreviewPage === 1) return sectionNum >= 1 && sectionNum <= 4;
      if (activePreviewPage === 2) return sectionNum >= 5 && sectionNum <= 10;
      if (activePreviewPage >= 3) return sectionNum === 11;
    } else if (pageLayoutMode === "4-page") {
      if (activePreviewPage === 1) return sectionNum >= 1 && sectionNum <= 3;
      if (activePreviewPage === 2) return sectionNum >= 4 && sectionNum <= 5;
      if (activePreviewPage === 3) return sectionNum >= 6 && sectionNum <= 8;
      if (activePreviewPage === 4) return sectionNum >= 9 && sectionNum <= 10;
      if (activePreviewPage >= 5) return sectionNum === 11;
    } else {
      // Standard 3-page layout (Section 4 on Page 2)
      if (activePreviewPage === 1) return sectionNum >= 1 && sectionNum <= 3;
      if (activePreviewPage === 2) return sectionNum >= 4 && sectionNum <= 5;
      if (activePreviewPage === 3) return sectionNum >= 6 && sectionNum <= 10;
      if (activePreviewPage >= 4) return sectionNum === 11;
    }
    return true;
  };

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
            <p className="text-xs text-neutral-600 font-medium">Generate a professional contract with clean user input and auto-filled metadata</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={addCustomPage}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-700 text-white font-bold text-xs shadow hover:bg-emerald-800 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Page ({totalPagesCount + 1})</span>
          </button>

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
                  ? `All Form Sections (1 - 10 + ${formData.customPages.length} Custom Pages)`
                  : `Page ${activePreviewPage} Form Fields`}
              </h3>
              <p className="text-[10px] text-neutral-500 font-medium">
                {showAllSections
                  ? "Showing all form sections"
                  : `Form fields matching active Page ${activePreviewPage} of ${totalPagesCount} preview`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAllSections(!showAllSections)}
              className="text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-full border border-purple-200 transition cursor-pointer"
            >
              {showAllSections ? "Show Active Page Form" : "Show All Sections"}
            </button>
          </div>

          {/* PAGE SECTIONS (1 - 11) */}
          <div className="flex flex-col gap-4">
            {/* SECTION 1: Agreement Info */}
            {isSectionVisible(1) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(1)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 1: Agreement Information (Auto-Filled)</span>
                  {openSections[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[1] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Agreement # (Auto-Generated)</label>
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
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Effective Date (Auto-Filled)</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 2: Parties */}
            {isSectionVisible(2) && (
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
                      <h4 className="text-[11px] font-extrabold text-purple-700 uppercase tracking-wider">Freelancer (Auto-Filled From Profile)</h4>
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
                      <h4 className="text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">Client (Type Client Details Below)</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Client Full Name *"
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Client Company Name"
                          value={formData.clientCompany}
                          onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="email"
                          placeholder="Client Email"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Client Phone"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                        <input
                          type="text"
                          placeholder="Client Full Address"
                          value={formData.clientAddress}
                          onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                          className="col-span-2 bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 3: Project Overview */}
            {isSectionVisible(3) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(3)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 3: Project Overview & Specifications</span>
                  {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[3] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Pet Food E-commerce Platform Development"
                        value={formData.projectTitle}
                        onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Description</label>
                      <textarea
                        placeholder="e.g. Design, development, testing, deployment, and launch of enterprise web application..."
                        rows={5}
                        value={formData.projectDescription}
                        onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-y font-medium leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Business Goal</label>
                      <textarea
                        placeholder="e.g. Build a modern, secure, scalable e-commerce store..."
                        rows={3}
                        value={formData.businessGoal}
                        onChange={(e) => setFormData({ ...formData, businessGoal: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-y font-medium leading-relaxed"
                      />
                    </div>
                    <div className="pt-2 border-t border-[#D5CEBC]">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-neutral-700">Technology Stack</label>
                        <span className="text-[10px] text-neutral-500 font-medium">Click quick preset to fill:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              techStack:
                                "Frontend: Next.js 16, React 19, Tailwind CSS v4\nBackend: Node.js, Next.js Server Actions\nDatabase: PostgreSQL (Supabase)\nHosting: Vercel & Cloud Infra",
                            })
                          }
                          className="text-[10px] font-bold text-green-800 bg-green-100 hover:bg-green-200 px-2 py-0.5 rounded-md border border-green-300 transition cursor-pointer"
                        >
                          + Next.js 16 Stack
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              techStack:
                                "Frontend: React 19, Redux Toolkit, Tailwind CSS\nBackend: Node.js, Express.js\nDatabase: MongoDB Atlas\nHosting: AWS / Render",
                            })
                          }
                          className="text-[10px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded-md border border-blue-300 transition cursor-pointer"
                        >
                          + MERN Stack
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              techStack:
                                "Mobile: React Native, Expo SDK 52, TypeScript\nBackend: Firebase Auth, Cloud Firestore, Cloud Functions\nAPIs: REST, WebSockets",
                            })
                          }
                          className="text-[10px] font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded-md border border-purple-300 transition cursor-pointer"
                        >
                          + Mobile App Stack
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              techStack:
                                "Frontend: Next.js 16, React 19\nBackend: Python 3.12, FastAPI, Celery\nDatabase: PostgreSQL, Redis\nAI / ML: OpenAI GPT-4o API, LangChain",
                            })
                          }
                          className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md border border-amber-300 transition cursor-pointer"
                        >
                          + Python & AI Stack
                        </button>
                      </div>
                      <textarea
                        placeholder="Frontend: Next.js 16, React 19, Tailwind CSS v4&#10;Backend: Node.js, NestJS&#10;Database: PostgreSQL"
                        rows={4}
                        value={formData.techStack}
                        onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900 resize-y leading-relaxed"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-[#D5CEBC]">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Type</label>
                        <input
                          type="text"
                          placeholder="e.g. Full-Stack Web & Cross-Platform Mobile App"
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Target Platforms</label>
                        <textarea
                          placeholder="e.g. Web Browser, iOS App Store, Google Play Store"
                          rows={2}
                          value={formData.platforms}
                          onChange={(e) => setFormData({ ...formData, platforms: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 resize-y"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 4: Scope of Work */}
            {isSectionVisible(4) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(4)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 4: Scope of Work (Included & Excluded Scope)</span>
                  {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[4] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-neutral-700">What&apos;s INCLUDED Scope</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.includedScope) return;
                            const items = formData.includedScope
                              .split(/[\n,•\-]/)
                              .map((s) => s.trim())
                              .filter(Boolean);
                            const formatted = items.map((i) => `• ${i}`).join("\n");
                            setFormData({ ...formData, includedScope: formatted });
                            toast.success("Converted items into clean bullet points!");
                          }}
                          className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition cursor-pointer"
                        >
                          ✨ Format Comma / Lines to Bullets
                        </button>
                      </div>
                      <textarea
                        placeholder="Type comma-separated or line items (e.g. UI/UX design, REST API, Database design, Supabase Auth)"
                        rows={6}
                        value={formData.includedScope}
                        onChange={(e) => setFormData({ ...formData, includedScope: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-y leading-relaxed"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-neutral-700">What&apos;s EXCLUDED Scope</label>
                        <button
                          type="button"
                          onClick={() => {
                            if (!formData.excludedScope) return;
                            const items = formData.excludedScope
                              .split(/[\n,•\-]/)
                              .map((s) => s.trim())
                              .filter(Boolean);
                            const formatted = items.map((i) => `• ${i}`).join("\n");
                            setFormData({ ...formData, excludedScope: formatted });
                            toast.success("Converted exclusions into clean bullet points!");
                          }}
                          className="text-[10px] font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md border border-red-200 transition cursor-pointer"
                        >
                          ✨ Format Comma / Lines to Bullets
                        </button>
                      </div>
                      <textarea
                        placeholder="Type comma-separated exclusions (e.g. Third-party API fees, Apple Developer Account fees)"
                        rows={3}
                        value={formData.excludedScope}
                        onChange={(e) => setFormData({ ...formData, excludedScope: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-y leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 5: Timeline & Milestones */}
            {isSectionVisible(5) && (
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
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Start Date</label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Target Deadline</label>
                        <input
                          type="date"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
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
                          placeholder="Phase Name"
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
                          placeholder="Description"
                          value={m.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              milestones: formData.milestones.map((row) => (row.id === m.id ? { ...row, description: e.target.value } : row)),
                            })
                          }
                          className="col-span-4 bg-transparent text-xs text-neutral-700"
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
                          className="col-span-3 bg-transparent text-xs text-neutral-900 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => removeMilestone(m.id)}
                          className="col-span-1 text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SECTION 6: Payment Terms */}
            {isSectionVisible(6) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(6)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 6: Payment Terms & Schedule</span>
                  {openSections[6] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[6] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Total Project Fee / Rate (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 250000"
                          value={formData.totalAmount || ""}
                          onChange={(e) => handleTotalAmountChange(Number(e.target.value))}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-black text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Payment Structure Type</label>
                        <select
                          value={formData.paymentStructure}
                          onChange={(e) => handlePaymentStructureChange(e.target.value)}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 cursor-pointer"
                        >
                          <option value="50/50">One-Time: 50% Advance / 50% Handover</option>
                          <option value="3-Way Split">One-Time: 3-Way Split (30% / 30% / 40%)</option>
                          <option value="Full Upfront">One-Time: 100% Full Upfront Deposit</option>
                          <option value="Full Payment After Work">One-Time: 100% Upon Handover</option>
                          <option value="Monthly Retainer">Recurring: Monthly Retainer Billing</option>
                          <option value="Custom Freeform">Custom: Freeform Text Description</option>
                        </select>
                      </div>
                    </div>

                    {/* Freeform Message Type Box for Custom Payment Terms */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-extrabold text-neutral-900 italic">
                          Custom Payment Terms & Notes <span className="font-normal text-neutral-500">(Type total amount, installments, retainer info here)</span>
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                customPaymentTerms: `Total Fixed Fee: ₹${formData.totalAmount ? formData.totalAmount.toLocaleString("en-IN") : "0"}\n- 50% Advance Deposit before project kickoff.\n- 50% Final Payment upon completion and production launch.`,
                              })
                            }
                            className="text-[9.5px] font-bold text-purple-800 bg-purple-100 hover:bg-purple-200 px-2 py-0.5 rounded border border-purple-300 transition cursor-pointer"
                          >
                            + 50/50 Preset
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                customPaymentTerms: `Monthly Retainer Rate: ₹${formData.totalAmount ? formData.totalAmount.toLocaleString("en-IN") : "50,000"} / month.\n- Invoiced on the 1st of every month.\n- Includes ongoing feature development, maintenance & server support.`,
                              })
                            }
                            className="text-[9.5px] font-bold text-blue-800 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded border border-blue-300 transition cursor-pointer"
                          >
                            + Monthly Retainer Preset
                          </button>
                        </div>
                      </div>
                      <textarea
                        placeholder="Type any custom payment terms or schedule here... e.g. Total amount ₹2,50,000 paid in 5 monthly installments of ₹50,000 each..."
                        rows={4}
                        value={formData.customPaymentTerms}
                        onChange={(e) => setFormData({ ...formData, customPaymentTerms: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-neutral-100 font-mono resize-y leading-relaxed shadow-inner focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    {/* Breakdown Payment Rows Table */}
                    <div className="flex flex-col gap-2 pt-1 border-t border-[#D5CEBC]">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-neutral-700">Installment Breakdown Rows (Optional Table)</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newRow: PaymentRow = {
                              id: `p-${Date.now()}`,
                              label: `Installment ${formData.paymentRows.length + 1}`,
                              percentage: 0,
                              amount: 0,
                              dueDate: "Upon Milestone Completion",
                            };
                            setFormData({ ...formData, paymentRows: [...formData.paymentRows, newRow] });
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Installment Row</span>
                        </button>
                      </div>

                      {formData.paymentRows.map((r, idx) => (
                        <div key={r.id} className="grid grid-cols-12 gap-2 bg-[#F4F0E6] p-2.5 rounded-xl border border-[#E2DDD0] items-center text-xs">
                          <input
                            type="text"
                            placeholder="Label (e.g. Advance 50%)"
                            value={r.label}
                            onChange={(e) => {
                              const updated = formData.paymentRows.map((row) => (row.id === r.id ? { ...row, label: e.target.value } : row));
                              setFormData({ ...formData, paymentRows: updated });
                            }}
                            className="col-span-4 bg-white border border-[#E2DDD0] rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-900"
                          />
                          <input
                            type="number"
                            placeholder="Amount (₹)"
                            value={r.amount || ""}
                            onChange={(e) => {
                              const amt = Number(e.target.value);
                              const pct = formData.totalAmount > 0 ? Math.round((amt / formData.totalAmount) * 100) : r.percentage;
                              const updated = formData.paymentRows.map((row) => (row.id === r.id ? { ...row, amount: amt, percentage: pct } : row));
                              setFormData({ ...formData, paymentRows: updated });
                            }}
                            className="col-span-3 bg-white border border-[#E2DDD0] rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-neutral-900"
                          />
                          <input
                            type="text"
                            placeholder="Due Date / Milestone"
                            value={r.dueDate}
                            onChange={(e) => {
                              const updated = formData.paymentRows.map((row) => (row.id === r.id ? { ...row, dueDate: e.target.value } : row));
                              setFormData({ ...formData, paymentRows: updated });
                            }}
                            className="col-span-4 bg-white border border-[#E2DDD0] rounded-lg px-2.5 py-1 text-xs text-neutral-700 font-sans"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, paymentRows: formData.paymentRows.filter((row) => row.id !== r.id) });
                            }}
                            className="col-span-1 text-red-500 hover:text-red-700 flex items-center justify-center cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 7: Intellectual Property */}
            {isSectionVisible(7) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(7)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <span>SECTION 7: Intellectual Property & Source Code</span>
                  {openSections[7] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[7] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                    <textarea
                      placeholder="e.g. Full intellectual property rights and source code ownership shall be transferred to the Client upon 100% full payment receipt."
                      rows={3}
                      value={formData.ipTransferCondition}
                      onChange={(e) => setFormData({ ...formData, ipTransferCondition: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium"
                    />
                  </div>
                )}
              </div>
            )}

            {/* SECTION 8: Deliverables */}
            {isSectionVisible(8) && (
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
                      placeholder="1. Production Source Code Repository&#10;2. Database Migrations&#10;3. System Documentation & API Specs"
                      rows={3}
                      value={formData.deliverablesList}
                      onChange={(e) => setFormData({ ...formData, deliverablesList: e.target.value })}
                      className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-mono"
                    />
                  </div>
                )}
              </div>
            )}

            {/* SECTION 9: Confidentiality & Support */}
            {isSectionVisible(9) && (
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
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Confidentiality Clause</label>
                      <textarea
                        placeholder="e.g. Both parties agree to protect proprietary source code and commercial data under strict confidentiality..."
                        rows={2}
                        value={formData.confidentialityClause}
                        onChange={(e) => setFormData({ ...formData, confidentialityClause: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none font-medium leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-neutral-700 block mb-1">Warranty Period</label>
                      <input
                        type="text"
                        placeholder="Warranty Period (e.g. 30 Days post-launch warranty support)"
                        value={formData.freeSupportPeriod}
                        onChange={(e) => setFormData({ ...formData, freeSupportPeriod: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-extrabold text-neutral-900 italic">(Optional) Warranty Scope <span className="font-normal text-neutral-500">(if you add another field later)</span></label>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              warrantyScope: "The warranty period covers bug fixes, security patches, and issues directly related to the deliverables.",
                            }));
                          }}
                          className="text-[10px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md border border-purple-200 transition cursor-pointer"
                        >
                          + Insert Default Scope
                        </button>
                      </div>
                      <div className="relative">
                        <textarea
                          placeholder="The warranty period covers bug fixes, security patches, and issues directly related to the deliverables..."
                          rows={3}
                          value={formData.warrantyScope}
                          onChange={(e) => setFormData({ ...formData, warrantyScope: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl px-4 py-3 text-xs text-neutral-100 font-mono resize-y leading-relaxed shadow-inner focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 10: Digital Signatures */}
            {isSectionVisible(10) && (
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
                        <label className="text-[11px] font-bold text-neutral-700 block mb-1">Developer Signatory (Auto-Filled)</label>
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
                          placeholder="e.g. Sophia Smith (Managing Director)"
                          value={formData.clientSignatureName}
                          onChange={(e) => setFormData({ ...formData, clientSignatureName: e.target.value })}
                          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SECTION 11+: Custom Pages Manager */}
            {isSectionVisible(11) && (
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleSection(11)}
                  className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>SECTION 11+: Custom Additional Pages ({formData.customPages.length})</span>
                  </div>
                  {openSections[11] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openSections[11] && (
                  <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-700">Custom Document Pages</span>
                      <button
                        type="button"
                        onClick={addCustomPage}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Page {totalPagesCount + 1}</span>
                      </button>
                    </div>

                    {formData.customPages.length === 0 ? (
                      <div className="p-4 bg-[#F4F0E6] rounded-xl border border-[#E2DDD0] text-center text-xs text-neutral-600">
                        No custom pages added yet. Click &quot;Add Page {totalPagesCount + 1}&quot; to insert SLA, technical specs, or appendix pages!
                      </div>
                    ) : (
                      formData.customPages.map((cp, idx) => {
                        const pageNum = basePagesCount + 1 + idx;
                        return (
                          <div key={cp.id} className="flex flex-col gap-2 bg-[#F4F0E6] p-4 rounded-xl border border-[#E2DDD0]">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-extrabold text-emerald-800 uppercase">
                                Page {pageNum} Content Block
                              </span>
                              <button
                                type="button"
                                onClick={() => removeCustomPage(cp.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Page</span>
                              </button>
                            </div>
                            <input
                              type="text"
                              placeholder="Page Title / Heading"
                              value={cp.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customPages: formData.customPages.map((row) => (row.id === cp.id ? { ...row, title: e.target.value } : row)),
                                })
                              }
                              className="bg-white border border-[#E2DDD0] rounded-lg px-3 py-1.5 text-xs font-bold text-neutral-900"
                            />
                            <input
                              type="text"
                              placeholder="Subtitle / Tagline (Optional)"
                              value={cp.subtitle || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customPages: formData.customPages.map((row) => (row.id === cp.id ? { ...row, subtitle: e.target.value } : row)),
                                })
                              }
                              className="bg-white border border-[#E2DDD0] rounded-lg px-3 py-1.5 text-xs text-neutral-800"
                            />
                            <textarea
                              placeholder="Page Content (bullets, SLA terms, specs...)"
                              rows={4}
                              value={cp.content}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  customPages: formData.customPages.map((row) => (row.id === cp.id ? { ...row, content: e.target.value } : row)),
                                })
                              }
                              className="bg-white border border-[#E2DDD0] rounded-lg px-3 py-2 text-xs text-neutral-900 resize-none font-mono"
                            />
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live A4 Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2 flex-wrap gap-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live Contract Preview</span>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Page Layout Mode Selector Switch */}
              <div className="flex items-center bg-[#EBE7DC] p-0.5 rounded-full border border-[#E2DDD0]">
                <button
                  onClick={() => {
                    setPageLayoutMode("2-page");
                    if (activePreviewPage > 2 + formData.customPages.length) {
                      setActivePreviewPage(2 + formData.customPages.length);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    pageLayoutMode === "2-page"
                      ? "bg-[#0a0a0a] text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  2 Base Pages
                </button>
                <button
                  onClick={() => setPageLayoutMode("3-page")}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition cursor-pointer ${
                    pageLayoutMode === "3-page"
                      ? "bg-[#0a0a0a] text-white shadow-xs"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  3 Base Pages
                </button>
              </div>

              {/* Page Arrow Switcher */}
              <div className="flex items-center gap-2 bg-[#EBE7DC] px-3 py-1 rounded-full border border-[#E2DDD0] shadow-xs">
                <button
                  disabled={activePreviewPage === 1}
                  onClick={() => setActivePreviewPage((prev) => Math.max(1, prev - 1))}
                  className="p-1 rounded-full hover:bg-[#DFD9C9] disabled:opacity-30 transition cursor-pointer text-neutral-900"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold font-mono text-neutral-900">
                  Page {activePreviewPage} of {totalPagesCount}
                </span>
                <button
                  disabled={activePreviewPage === totalPagesCount}
                  onClick={() => setActivePreviewPage((prev) => Math.min(totalPagesCount, prev + 1))}
                  className="p-1 rounded-full hover:bg-[#DFD9C9] disabled:opacity-30 transition cursor-pointer text-neutral-900"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
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

          {/* Hidden Offscreen Container for PDF Export (All Pages) */}
          <div style={{ position: "absolute", left: "-9999px", top: 0, width: "210mm", overflow: "hidden", pointerEvents: "none" }}>
            {renderAgreementContent(undefined, "agreement-pdf-preview")}
          </div>
        </div>
      </div>

      {/* Floating Printable A4 Preview Screen Modal */}
      {showFloatingPreview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4 flex-wrap gap-3">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Contract Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Agreement #{formData.agreementNumber}</p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* Modal Page Switcher */}
                <div className="flex items-center gap-2 bg-[#DFD9C9] px-3 py-1 rounded-full border border-[#D5CEBC]">
                  <button
                    disabled={activePreviewPage === 1}
                    onClick={() => setActivePreviewPage((prev) => Math.max(1, prev - 1))}
                    className="p-1 rounded-full hover:bg-neutral-900 hover:text-white disabled:opacity-30 transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-bold font-mono text-neutral-900">
                    Page {activePreviewPage} of {totalPagesCount}
                  </span>
                  <button
                    disabled={activePreviewPage === totalPagesCount}
                    onClick={() => setActivePreviewPage((prev) => Math.min(totalPagesCount, prev + 1))}
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
