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
  CheckSquare,
  Square,
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
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: true, 9: true });

  const toggleSection = (sectionIndex: number) => {
    setOpenSections((prev) => ({ ...prev, [sectionIndex]: !prev[sectionIndex] }));
  };

  const [formData, setFormData] = useState({
    // Section 1: Agreement Info
    agreementNumber: "SXL-AGR-001",
    date: new Date().toISOString().split("T")[0],
    version: "1.0",

    // Section 2: Parties
    freelancerName: "SevenX Labs",
    freelancerCompany: "SevenX Labs Studio",
    freelancerAddress: "SevenX Tech Park, HSR Layout, Sector 1, Bengaluru, KA 560102",
    freelancerEmail: "hello@sevenxlabs.com",
    freelancerPhone: "+91 98765 43210",

    clientName: "Acme Corp",
    clientCompany: "Acme Enterprises Inc.",
    clientAddress: "100 Innovation Way, Tech Park, Mumbai 400001",
    clientEmail: "contracts@acme.com",
    clientPhone: "+91 91234 56789",

    // Section 3: Project Overview
    projectTitle: "Custom Enterprise Software & Web Application Development",
    projectDescription: "End-to-end architecture, development, and deployment of modern web platform with client CRM and document studio.",
    businessGoal: "Automate client contract generation, invoice tracking, and digital agreements.",

    // Section 4: Scope of Work
    includedScope: "• Full Stack Web App Development\n• PostgreSQL Database Setup\n• Client CRM & Milestone Payment Tracker\n• PDF/DOCX/PNG Export Engines",
    excludedScope: "• Third-party paid API subscription fees\n• App Store developer account registration fees",
    techStack: "Next.js 16, React 19, Tailwind CSS v4, Prisma ORM, PostgreSQL, Supabase",

    // Section 5: Requirements & Platforms
    featureList: "• Role-Based Access Control\n• Interactive Document Studio\n• Live A4 Printable Preview\n• Analytics Dashboard",
    moduleBreakdown: "Admin Module, Client CRM, Payment Engine, Document Generator",
    platforms: { web: true, ios: false, android: false, desktop: false },

    // Section 6: User Roles
    roleTypes: "Super Admin, Studio Manager, Client User",
    rolePermissions: "Super Admin has full access. Studio Manager can create invoices and view CRM.",
    dashboardsIncluded: "Executive Financial Dashboard, Client CRM Table, Milestone Progress Bar",

    // Section 7: Deliverables
    deliverablesList: "1. Production Next.js Source Code Repository\n2. Prisma PostgreSQL Database Migrations\n3. System Documentation & API Specs",
    fileFormats: ".ts, .tsx, .json, .pdf, .docx, .png",
    handoverMethod: "GitHub Repository & Google Drive",

    // Section 8: Timeline & Milestones
    startDate: new Date().toISOString().split("T")[0],
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    milestones: [
      { id: "m1", phaseName: "Phase 1: Architecture & UI Setup", description: "Design system & database schema setup", deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
      { id: "m2", phaseName: "Phase 2: Core Development & CRM", description: "Client CRM, Invoicing & Document Studio", deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
      { id: "m3", phaseName: "Phase 3: Final Deployment & Handover", description: "Testing, PDF export, and production deployment", deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] },
    ] as MilestoneRow[],

    // Section 9: Payment Terms
    totalAmount: 250000,
    currency: "₹",
    paymentStructure: "50/50" as "50/50" | "3-Way Split" | "Milestone-based" | "Full Upfront" | "Monthly Retainer",
    paymentRows: [
      { id: "p1", label: "Advance Payment (50%)", percentage: 50, amount: 125000, dueDate: "Before project start" },
      { id: "p2", label: "Final Delivery (50%)", percentage: 50, amount: 125000, dueDate: "On final project handover" },
    ] as PaymentRow[],
    paymentMethod: "UPI / Bank Transfer",
    paymentDetails: "UPI: sevenxlabs@upi | HDFC Bank: 50100234567890 (IFSC: HDFC0001234)",
    lateFee: "1.5% per week on overdue balance",
    workStoppageClause: "Work halts if payment is delayed more than 7 days past due date.",

    // Section 10: Change Request Policy
    changeDefinition: "Any feature, page, or module not explicitly listed in Section 4 Scope of Work.",
    changeProcess: "Client submits written request; Developer provides cost estimate; Work begins after written approval.",
    extraCostFormula: "Quoted separately at ₹2,500/hour or flat phase fee.",

    // Section 11: Client Responsibilities
    assetsDeadline: "Within 5 business days of project kickoff",
    feedbackTimeline: "3 business days for each review cycle",
    accessToProvide: "Server credentials, domain registrar access, API credentials",
    singlePointContact: "Client Project Manager",

    // Section 12: Developer Responsibilities
    deliveryCommitment: "Developer shall deliver project according to agreed milestone deadlines.",
    codeQualityStandard: "Clean, documented, maintainable code following TypeScript and React 19 standards.",
    updateFrequency: "Weekly status report via email / Slack",
    bugFixCommitment: "Prompt resolution of any critical blockers during active development.",

    // Section 13: Acceptance Criteria
    testingPeriod: "7 calendar days following delivery",
    approvalMethod: "Written email confirmation from Client",
    autoAcceptanceClause: "If no written feedback is received within 7 calendar days, work is deemed accepted.",

    // Section 14: Revision Policy
    revisionLimit: 2,
    revisionDefinition: "Minor design and text tweaks within agreed scope; excludes new features.",
    additionalRevisionRate: "₹2,000 / hour for additional revision rounds",

    // Section 15: Maintenance & Support
    freeSupportPeriod: "30 days post-launch warranty support",
    coveredSupport: "Technical bugs and defects directly attributable to original agreed scope.",
    paidMaintenanceOption: "Monthly retainer option available at ₹25,000 / month",
    responseTime: "24-48 hours for critical bug resolution",

    // Section 16: Warranty
    warrantyPeriod: "30 days from launch",
    warrantyCovered: "Fixes for broken layout, script errors, or core feature failures",
    warrantyNotCovered: "Issues caused by third-party hosting, client code modifications, or API changes",

    // Section 17: Hosting & Infrastructure
    hostingProvider: "Client's hosting account (Vercel / AWS / Supabase)",
    domainRegistration: "Client",
    serverCostBearer: "Client",

    // Section 18: Third-Party Services
    apiServicesUsed: "Supabase PostgreSQL, Vercel Hosting, Google Fonts",
    subscriptionBearer: "Client",
    licenseRequirements: "All open-source libraries used under MIT / Apache license",

    // Section 19: IP Rights
    ipTransferCondition: "Full intellectual property rights transferred upon 100% full payment receipt.",
    prePaymentOwnership: "Freelancer retains all copyright and source code rights prior to final payment.",
    portfolioRights: true,

    // Section 20: Source Code Ownership
    sourceHandoverCondition: "Handover delivered after final payment clears.",
    sourceHandoverFormat: "GitHub Repository Transfer & ZIP Archive",
    usageLicense: "Exclusive commercial license valid upon full payment.",

    // Section 21: Confidentiality
    confidentialityClause: "Both parties agree to protect proprietary data, code, and trade secrets.",
    confidentialityDuration: "2 years following project completion",
    separateNDASigned: true,

    // Section 22: Data Protection & Security
    dataHandlingPromise: "All customer data handled in compliance with standard security standards.",
    complianceResponsibility: "Shared responsibility between Client and Freelancer",

    // Section 23: Limitation of Liability
    maxLiabilityAmount: "Limited to total contract fee paid by Client",
    liabilityExclusions: "Excludes indirect damages, lost business profits, or third-party outages",

    // Section 24: Force Majeure
    acceptedDelays: "Natural disasters, government restrictions, major internet/power blackouts",
    notificationReq: "Notify written notice within 24 hours of force majeure event",
    noPenaltyClause: "Neither party liable for delays caused by force majeure conditions",

    // Section 25: Cancellation & Termination
    cancelBeforeStart: "Advance payment refunded minus 10% administrative fee",
    cancelMidProject: "Client pays for all work completed to date plus 25% termination fee",
    freelancerCancelClause: "Freelancer may cancel if client delays payment or assets past 14 days",
    noticePeriod: "7 calendar days written notice",

    // Section 26: Dispute Resolution & Governing Law
    resolutionSteps: "Good faith mutual negotiations first; escalation to binding arbitration if unresolved",
    arbitrationCourt: "Commercial Court of Mumbai",
    governingLaw: "Laws of India",
    jurisdiction: "Mumbai, Maharashtra",

    // Section 27: Additional Terms
    additionalNotes: "Includes complimentary onboarding session for client team.",

    // Section 28: Attachments
    attachmentsList: "Annexure A: System Architecture Diagram, Annexure B: API Endpoint Specifications",

    // Section 29: Digital Signatures
    freelancerSignatureName: "Sahil Hode (SevenX Labs)",
    freelancerSignDate: new Date().toISOString().split("T")[0],
    clientSignatureName: "Authorized Signatory (Client)",
    clientSignDate: new Date().toISOString().split("T")[0],
    acceptanceStatement: "By signing below, both parties agree to all 30 sections of this Agreement.",

    // Section 30: Agreement Acceptance
    effectiveDate: new Date().toISOString().split("T")[0],
    entireAgreementClause: true,
    modificationClause: "All modifications must be made in writing and signed by both parties.",

    status: "draft",
    createdAt: new Date().toISOString(),
  });

  // Auto-save draft to localStorage every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem("sevenx_agreement_draft", JSON.stringify(formData));
    }, 30000);
    return () => clearInterval(timer);
  }, [formData]);

  // Load profile & next agreement number on mount
  useEffect(() => {
    Promise.all([getProfileDB(), getNextDocumentNumberDB("AGREEMENT")]).then(([profile, num]) => {
      setFormData((prev) => ({
        ...prev,
        agreementNumber: num,
        freelancerName: profile.name || "SevenX Labs",
        freelancerCompany: profile.company || "SevenX Labs Studio",
        freelancerAddress: profile.address || "SevenX Tech Park, HSR Layout, Bengaluru",
        freelancerEmail: profile.email || "hello@sevenxlabs.com",
        freelancerPhone: profile.phone || "+91 98765 43210",
      }));
    });

    const savedDraft = localStorage.getItem("sevenx_agreement_draft");
    if (savedDraft) {
      try {
        setFormData((prev) => ({ ...prev, ...JSON.parse(savedDraft) }));
      } catch (e) {
        // Ignore JSON parse errors
      }
    }
  }, []);

  // Update Payment Structure auto-generation
  const handlePaymentStructureChange = (structure: any) => {
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
    } else if (structure === "Full Upfront") {
      newRows = [{ id: "p1", label: "Full Upfront Deposit (100%)", percentage: 100, amount: val, dueDate: "Before project start" }];
    } else if (structure === "Monthly Retainer") {
      newRows = [{ id: "p1", label: "Monthly Retainer (Month 1)", percentage: 100, amount: val, dueDate: "1st of each month" }];
    } else {
      newRows = [
        { id: "p1", label: "Phase 1 Milestone (40%)", percentage: 40, amount: val * 0.4, dueDate: "Kickoff" },
        { id: "p2", label: "Phase 2 Milestone (60%)", percentage: 60, amount: val * 0.6, dueDate: "Delivery" },
      ];
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
    const res = await createAgreementDB({
      agreementNumber: formData.agreementNumber,
      date: formData.date,
      freelancerName: formData.freelancerName,
      freelancerCompany: formData.freelancerCompany,
      freelancerEmail: formData.freelancerEmail,
      clientName: formData.clientName,
      clientCompany: formData.clientCompany,
      clientEmail: formData.clientEmail,
      projectTitle: formData.projectTitle,
      projectDescription: formData.projectDescription,
      deliverables: formData.deliverablesList,
      startDate: formData.startDate,
      deadline: formData.deadline,
      totalAmount: formData.totalAmount,
      advancePercentage: 50,
      finalPercentage: 50,
      revisionLimit: "3" as const,
      ownershipClause: formData.ipTransferCondition,
      cancellationPolicy: formData.cancelMidProject,
      additionalTerms: JSON.stringify(formData),
      freelancerSignature: formData.freelancerSignatureName,
      clientSignature: formData.clientSignatureName,
      status: "draft",
      createdAt: new Date().toISOString(),
    });
    setIsSaving(false);

    if (res.success) {
      const nextNum = await getNextDocumentNumberDB("AGREEMENT");
      setFormData((prev) => ({ ...prev, agreementNumber: nextNum }));
      toast.success(`Agreement #${formData.agreementNumber} saved to Prisma Database!`);
    } else {
      toast.error(`Error saving agreement: ${res.error}`);
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

  const handleExportPNG = async () => {
    await handleSave();
    await exportToImage("agreement-pdf-preview", `Agreement-${formData.agreementNumber}.png`);
  };

  const agreementPreviewContent = (
    <ModernAgreementTemplate
      id="agreement-pdf-preview"
      agreementNumber={formData.agreementNumber}
      effectiveDate={formData.date}
      expiryDate={formData.deadline}
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
            <p className="text-xs text-neutral-600 font-medium">Generate a professional freelance contract (30 Collapsible Sections)</p>
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

      {/* Grid: Form Collapsible Sections + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Collapsible Accordion Sections */}
        <div className="lg:col-span-6 flex flex-col gap-4">
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
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-700 block mb-1">Agreement #</label>
                    <input
                      type="text"
                      value={formData.agreementNumber}
                      onChange={(e) => setFormData({ ...formData, agreementNumber: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900"
                    />
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

          {/* SECTION 8: Milestones */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(8)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 8: Timeline & Milestones</span>
              {openSections[8] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[8] && (
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

          {/* SECTION 9: Payment Terms */}
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection(9)}
              className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
            >
              <span>SECTION 9: Payment Terms & Auto-Milestones</span>
              {openSections[9] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openSections[9] && (
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
        </div>

        {/* Live A4 Preview Panel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Live Contract Preview</span>
            <span className="text-[11px] text-neutral-500 font-semibold">Updates dynamically</span>
          </div>

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
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Contract Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Agreement #{formData.agreementNumber}</p>
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
              {agreementPreviewContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
