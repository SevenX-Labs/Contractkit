"use client";

import React, { useState, useEffect } from "react";
import {
  getProjectsDB,
  getClientsDB,
  createProjectDB,
  updateProjectDB,
  updatePaymentStatusDB,
  updateProjectPaymentDB,
  addProjectPaymentDB,
  deleteProjectPaymentDB,
  deleteProjectDB,
} from "../actions";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Trash2,
  Pencil,
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  X,
  Download,
  Printer,
  Share2,
  Maximize2,
  Minimize2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  FileSignature,
  FileCheck,
  ShieldCheck,
  FileText,
  Receipt,
  Award,
  FileQuestion,
  Building,
  Sparkles,
  Layers,
  UserCheck,
  MapPin,
  CircleDot,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Calendar,
  CheckSquare,
  Hourglass,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { ModernQuotationTemplate } from "../../components/quotation/ModernQuotationTemplate";
import { ModernInvoiceTemplate } from "../../components/invoice/ModernInvoiceTemplate";
import { ModernAgreementTemplate } from "../../components/agreement/ModernAgreementTemplate";
import { ModernNDATemplate } from "../../components/nda/ModernNDATemplate";
import { ModernReceiptTemplate } from "../../components/receipt/ModernReceiptTemplate";
import { ModernCertificateTemplate } from "../../components/certificate/ModernCertificateTemplate";
import { toast } from "sonner";
import Link from "next/link";

interface PaymentItem {
  id: string;
  label: string;
  amount: number;
  dueDate?: string | null;
  paidDate?: string | null;
  status: string; // PENDING | PARTIALLY_PAID | PAID | OVERDUE
  note?: string | null;
}

interface DocumentItem {
  id: string;
  documentNumber: string;
  title: string;
  type: string;
  status: string;
  totalAmount?: number;
  date: string;
  dueDate?: string;
  clientName: string;
  clientEmail?: string;
  contentJson?: string;
}

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  workType?: string | null;
  projectTitle?: string | null;
  projectSummary?: string | null;
  notes?: string | null;
}

interface ProjectItem {
  id: string;
  name: string;
  description?: string | null;
  workType?: string | null;
  budget: number;
  totalValue: number;
  amountPaid: number;
  amountPending: number;
  status: string;
  startDate?: string | null;
  deliveryDate?: string | null;
  client?: ClientItem | null;
  payments: PaymentItem[];
  documents: DocumentItem[];
}

interface MilestoneMeta {
  description: string;
  workStatus: "Not Started" | "In Progress" | "Completed";
  notes: string;
}

// Helper to parse JSON string inside ProjectPayment.note
function parseMilestoneNote(note?: string | null, paymentStatus?: string): MilestoneMeta {
  const normPay = (paymentStatus || "").toUpperCase();
  const defaultWork = normPay === "PAID" ? "Completed" : "Not Started";

  if (!note) {
    return { description: "", workStatus: defaultWork, notes: "" };
  }
  try {
    const parsed = JSON.parse(note);
    if (parsed && typeof parsed === "object") {
      return {
        description: parsed.description || "",
        workStatus: parsed.workStatus || defaultWork,
        notes: parsed.notes || "",
      };
    }
  } catch (e) {
    return { description: note, workStatus: defaultWork, notes: "" };
  }
  return { description: "", workStatus: defaultWork, notes: "" };
}

export default function ProjectsPage() {
  const { exportToPDF, isExporting } = useDocumentExport();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Collapsible toggle states
  const [expandedDocsProjectId, setExpandedDocsProjectId] = useState<string | null>(null);
  const [expandedMilestonesProjectId, setExpandedMilestonesProjectId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Add Project Modal State
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    workType: "Web Dev",
    budget: 50000,
    paymentStructure: "50/50",
    clientId: "",
    startDate: new Date().toISOString().split("T")[0],
    deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // Edit Project Details State
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectEditForm, setProjectEditForm] = useState({
    name: "",
    description: "",
    workType: "Web Dev",
    status: "In Progress",
    budget: 0,
  });

  // Milestone Form State (Used for both Create & Edit)
  const [milestoneModalState, setMilestoneModalState] = useState<{
    isOpen: boolean;
    mode: "CREATE" | "EDIT";
    projectId: string | null;
    paymentId?: string;
    name: string;
    description: string;
    workStatus: "Not Started" | "In Progress" | "Completed";
    dueDate: string;
    amount: number;
    paymentStatus: "Pending" | "Partially Paid" | "Paid";
    notes: string;
  }>({
    isOpen: false,
    mode: "CREATE",
    projectId: null,
    name: "",
    description: "",
    workStatus: "Not Started",
    dueDate: new Date().toISOString().split("T")[0],
    amount: 10000,
    paymentStatus: "Pending",
    notes: "",
  });

  // Floating Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{
    doc: DocumentItem | null;
    project: ProjectItem | null;
    docType: string;
    docIndex: number;
    relatedDocsList: Array<{ doc: DocumentItem | null; typeLabel: string; typeKey: string }>;
  } | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fetchInitialData = async () => {
    setIsLoading(true);
    const [projData, clientData] = await Promise.all([getProjectsDB(), getClientsDB()]);
    setProjects(projData as any);
    setClients(clientData as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleSelectClient = (clientId: string) => {
    const matched = clients.find((c) => c.id === clientId);
    if (matched) {
      setNewProject((prev) => ({
        ...prev,
        clientId,
        name: matched.projectTitle || prev.name || `${matched.workType || "Web Dev"} Project`,
        description: matched.projectSummary || matched.notes || prev.description || "",
        workType: matched.workType || prev.workType || "Web Dev",
      }));
    } else {
      setNewProject((prev) => ({ ...prev, clientId }));
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) {
      toast.error("Please select a client or enter a project title.");
      return;
    }

    setIsSubmitting(true);
    const res = await createProjectDB({
      name: newProject.name,
      description: newProject.description,
      budget: Number(newProject.budget),
      workType: newProject.workType,
      paymentStructure: newProject.paymentStructure,
      clientId: newProject.clientId || undefined,
      startDate: newProject.startDate,
      deliveryDate: newProject.deliveryDate,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success(`Project "${newProject.name}" created successfully!`);
      setShowAddProjectModal(false);
      setNewProject({
        name: "",
        description: "",
        workType: "Web Dev",
        budget: 50000,
        paymentStructure: "50/50",
        clientId: "",
        startDate: new Date().toISOString().split("T")[0],
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
      fetchInitialData();
    } else {
      toast.error(`Error creating project: ${res.error}`);
    }
  };

  const handleStartEditProject = (project: ProjectItem) => {
    setEditingProject(project);
    setProjectEditForm({
      name: project.name || "",
      description: project.description || "",
      workType: project.workType || "Web Dev",
      status: project.status || "In Progress",
      budget: project.budget || project.totalValue || 0,
    });
  };

  const handleSaveProjectEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!projectEditForm.name) {
      toast.error("Project Name is required.");
      return;
    }

    const res = await updateProjectDB(editingProject.id, {
      name: projectEditForm.name,
      description: projectEditForm.description,
      workType: projectEditForm.workType,
      status: projectEditForm.status,
      budget: Number(projectEditForm.budget),
    });

    if (res.success) {
      toast.success(`Project "${projectEditForm.name}" updated successfully!`);
      setEditingProject(null);
      fetchInitialData();
    } else {
      toast.error(`Error updating project: ${res.error}`);
    }
  };

  // Open Milestone Modal for Creation
  const handleOpenAddMilestone = (projectId: string) => {
    setMilestoneModalState({
      isOpen: true,
      mode: "CREATE",
      projectId,
      name: "",
      description: "",
      workStatus: "Not Started",
      dueDate: new Date().toISOString().split("T")[0],
      amount: 10000,
      paymentStatus: "Pending",
      notes: "",
    });
  };

  // Open Milestone Modal for Editing
  const handleOpenEditMilestone = (payment: PaymentItem) => {
    const meta = parseMilestoneNote(payment.note, payment.status);

    let normPayStatus: "Pending" | "Partially Paid" | "Paid" = "Pending";
    const statusUpper = (payment.status || "").toUpperCase();
    if (statusUpper === "PAID") normPayStatus = "Paid";
    else if (statusUpper === "PARTIALLY_PAID" || statusUpper === "PARTIALLY PAID") normPayStatus = "Partially Paid";
    else normPayStatus = "Pending";

    setMilestoneModalState({
      isOpen: true,
      mode: "EDIT",
      projectId: null,
      paymentId: payment.id,
      name: payment.label || "",
      description: meta.description || "",
      workStatus: meta.workStatus || "Not Started",
      dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      amount: payment.amount || 0,
      paymentStatus: normPayStatus,
      notes: meta.notes || "",
    });
  };

  // Save Milestone (Create or Update)
  const handleSaveMilestoneForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneModalState.name) {
      toast.error("Please enter a Milestone Name.");
      return;
    }

    const notePayload = JSON.stringify({
      description: milestoneModalState.description,
      workStatus: milestoneModalState.workStatus,
      notes: milestoneModalState.notes,
    });

    const statusMap: Record<string, string> = {
      Pending: "PENDING",
      "Partially Paid": "PARTIALLY_PAID",
      Paid: "PAID",
    };
    const dbStatus = statusMap[milestoneModalState.paymentStatus] || "PENDING";

    if (milestoneModalState.mode === "CREATE" && milestoneModalState.projectId) {
      const res = await addProjectPaymentDB(milestoneModalState.projectId, {
        label: milestoneModalState.name,
        amount: Number(milestoneModalState.amount),
        dueDate: milestoneModalState.dueDate,
        status: dbStatus,
        note: notePayload,
      });

      if (res.success) {
        toast.success(`Milestone "${milestoneModalState.name}" created!`);
        setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
        fetchInitialData();
      } else {
        toast.error(`Error creating milestone: ${res.error}`);
      }
    } else if (milestoneModalState.mode === "EDIT" && milestoneModalState.paymentId) {
      const res = await updateProjectPaymentDB(milestoneModalState.paymentId, {
        label: milestoneModalState.name,
        amount: Number(milestoneModalState.amount),
        dueDate: milestoneModalState.dueDate,
        status: dbStatus as any,
        note: notePayload,
      });

      if (res.success) {
        toast.success(`Milestone "${milestoneModalState.name}" updated!`);
        setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
        fetchInitialData();
      } else {
        toast.error(`Error updating milestone: ${res.error}`);
      }
    }
  };

  const handleDeleteMilestone = async () => {
    if (!milestoneModalState.paymentId) return;
    const res = await deleteProjectPaymentDB(milestoneModalState.paymentId);
    if (res.success) {
      toast.success(`Deleted milestone "${milestoneModalState.name}"`);
      setMilestoneModalState((prev) => ({ ...prev, isOpen: false }));
      fetchInitialData();
    } else {
      toast.error(`Error deleting milestone: ${res.error}`);
    }
  };

  const handleToggleMarkPaid = async (payment: PaymentItem) => {
    const meta = parseMilestoneNote(payment.note, payment.status);
    const isCurrentlyPaid = payment.status.toUpperCase() === "PAID";
    const nextStatus = isCurrentlyPaid ? "PENDING" : "PAID";
    const nextWorkStatus = isCurrentlyPaid ? meta.workStatus : "Completed";

    const notePayload = JSON.stringify({
      ...meta,
      workStatus: nextWorkStatus,
    });

    const res = await updateProjectPaymentDB(payment.id, {
      label: payment.label,
      amount: payment.amount,
      dueDate: payment.dueDate ? new Date(payment.dueDate).toISOString().split("T")[0] : null,
      status: nextStatus as any,
      note: notePayload,
    });

    if (res.success) {
      toast.success(
        isCurrentlyPaid
          ? `Marked "${payment.label}" as PENDING`
          : `Marked "${payment.label}" as PAID & Work Completed!`
      );
      fetchInitialData();
    } else {
      toast.error(`Error updating payment: ${res.error}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const res = await deleteProjectDB(id);
    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(`Deleted project "${name}"`);
    } else {
      toast.error(`Error: ${res.error}`);
    }
  };

  // Helper to open floating document preview modal
  const openDocPreview = (
    project: ProjectItem,
    targetTypeKey: string,
    targetTypeLabel: string
  ) => {
    const allDocTypes = [
      { typeKey: "QUOTATION", typeLabel: "Quotation", route: "/quotation" },
      { typeKey: "AGREEMENT", typeLabel: "Agreement", route: "/agreement" },
      { typeKey: "NDA", typeLabel: "NDA", route: "/nda" },
      { typeKey: "INVOICE", typeLabel: "Invoice", route: "/invoice" },
      { typeKey: "PAYMENT_RECEIPT", typeLabel: "Receipt", route: "/receipt" },
      { typeKey: "CERTIFICATE", typeLabel: "Completion Certificate", route: "/certificate" },
    ];

    const relatedDocsList = allDocTypes.map((dt) => {
      const match = (project.documents || []).find(
        (d) => d.type.toUpperCase() === dt.typeKey || d.type.toLowerCase() === dt.typeLabel.toLowerCase()
      );
      return { doc: match || null, typeLabel: dt.typeLabel, typeKey: dt.typeKey };
    });

    const currentIndex = allDocTypes.findIndex((dt) => dt.typeKey === targetTypeKey);
    const selectedItem = relatedDocsList[currentIndex >= 0 ? currentIndex : 0];

    setPreviewDoc({
      doc: selectedItem ? selectedItem.doc : null,
      project,
      docType: targetTypeKey,
      docIndex: currentIndex >= 0 ? currentIndex : 0,
      relatedDocsList,
    });
  };

  const handlePrevDoc = () => {
    if (!previewDoc) return;
    const newIdx = (previewDoc.docIndex - 1 + previewDoc.relatedDocsList.length) % previewDoc.relatedDocsList.length;
    const item = previewDoc.relatedDocsList[newIdx];
    setPreviewDoc({
      ...previewDoc,
      docIndex: newIdx,
      docType: item.typeKey,
      doc: item.doc,
    });
  };

  const handleNextDoc = () => {
    if (!previewDoc) return;
    const newIdx = (previewDoc.docIndex + 1) % previewDoc.relatedDocsList.length;
    const item = previewDoc.relatedDocsList[newIdx];
    setPreviewDoc({
      ...previewDoc,
      docIndex: newIdx,
      docType: item.typeKey,
      doc: item.doc,
    });
  };

  const handleShareDoc = () => {
    if (!previewDoc || !previewDoc.doc) return;
    const shareText = `Document ${previewDoc.doc.documentNumber} (${previewDoc.doc.title}) for client ${previewDoc.doc.clientName}`;
    navigator.clipboard.writeText(shareText);
    toast.success("Document information copied to clipboard!");
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.client && p.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.workType && p.workType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Selected Client Object inside Add Project modal
  const selectedClientObj = clients.find((c) => c.id === newProject.clientId);

  // Helper to render parsed document template inside modal
  const renderTemplateComponent = (doc: DocumentItem) => {
    let data: any = {};
    try {
      data = JSON.parse(doc.contentJson || "{}");
    } catch (e) {
      data = {};
    }

    const typeUpper = doc.type.toUpperCase();

    if (typeUpper === "QUOTATION") {
      return <ModernQuotationTemplate id="floating-project-doc" {...data} />;
    } else if (typeUpper === "INVOICE") {
      return <ModernInvoiceTemplate id="floating-project-doc" {...data} />;
    } else if (typeUpper === "AGREEMENT") {
      return <ModernAgreementTemplate id="floating-project-doc" {...data} />;
    } else if (typeUpper === "NDA") {
      return <ModernNDATemplate id="floating-project-doc" {...data} />;
    } else if (typeUpper === "PAYMENT_RECEIPT" || typeUpper === "RECEIPT") {
      return <ModernReceiptTemplate id="floating-project-doc" {...data} />;
    } else if (typeUpper === "CERTIFICATE") {
      return <ModernCertificateTemplate id="floating-project-doc" {...data} />;
    }

    return (
      <div className="p-8 text-center text-neutral-800 bg-white rounded-2xl shadow-xl w-[210mm] min-h-[297mm]">
        <h2 className="text-xl font-bold">{doc.title}</h2>
        <p className="font-mono text-sm text-neutral-500 mt-1">Ref #: {doc.documentNumber}</p>
        <p className="text-xs mt-4">Client: {doc.clientName}</p>
        <p className="text-xs font-bold text-[#a6ce39] mt-2">Status: {doc.status}</p>
      </div>
    );
  };

  const getDocTypeIcon = (typeKey: string) => {
    switch (typeKey.toUpperCase()) {
      case "QUOTATION":
        return <FileSignature className="w-3.5 h-3.5 text-lime-600" />;
      case "AGREEMENT":
        return <FileCheck className="w-3.5 h-3.5 text-blue-600" />;
      case "NDA":
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case "INVOICE":
        return <FileText className="w-3.5 h-3.5 text-pink-600" />;
      case "PAYMENT_RECEIPT":
      case "RECEIPT":
        return <Receipt className="w-3.5 h-3.5 text-cyan-600" />;
      case "CERTIFICATE":
        return <Award className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  const getDocRoute = (typeKey: string) => {
    switch (typeKey.toUpperCase()) {
      case "QUOTATION":
        return "/quotation";
      case "AGREEMENT":
        return "/agreement";
      case "NDA":
        return "/nda";
      case "INVOICE":
        return "/invoice";
      case "PAYMENT_RECEIPT":
      case "RECEIPT":
        return "/receipt";
      case "CERTIFICATE":
        return "/certificate";
      default:
        return "/invoice";
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-5 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Projects & Milestone Hub
            </h1>
            <p className="text-xs text-neutral-600 font-medium">
              Manage project work status, milestone progress, payment breakdown, and document suites
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddProjectModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#121212] hover:bg-neutral-800 text-white font-bold text-xs transition shadow-md cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4 text-[#a6ce39]" />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] p-2.5 rounded-2xl">
        <Search className="w-4 h-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search projects by title, scope description, client name, or work type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full px-4 py-1.5 text-xs text-neutral-900 focus:outline-none"
        />
      </div>

      {/* Projects Ultra-Compact High-Density List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading projects & directory...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <FolderKanban className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No projects found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Create your first project or select a client to auto-fetch project title & summary and set milestone payments!
          </p>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow mt-2 hover:bg-neutral-800 transition cursor-pointer"
          >
            Create Project Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredProjects.map((p) => {
            // Milestone Calculations derived from Work Status & Payment Status
            const totalMilestones = p.payments.length;
            const milestoneMetas = p.payments.map((pm) => ({
              payment: pm,
              meta: parseMilestoneNote(pm.note, pm.status),
            }));

            const completedMilestones = milestoneMetas.filter(
              (m) => m.meta.workStatus === "Completed"
            ).length;
            const remainingMilestones = Math.max(0, totalMilestones - completedMilestones);

            // Progress calculated from Work Status
            const workProgressPct =
              totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

            // Financial Summary calculated from Payment Status
            const totalMilestoneAmount = p.payments.reduce((acc, pm) => acc + pm.amount, 0) || p.totalValue || p.budget || 0;
            const totalPaidAmount = p.payments
              .filter((pm) => (pm.status || "").toUpperCase() === "PAID")
              .reduce((acc, pm) => acc + pm.amount, 0);
            const totalPartiallyPaidAmount = p.payments
              .filter((pm) => (pm.status || "").toUpperCase() === "PARTIALLY_PAID" || (pm.status || "").toUpperCase() === "PARTIALLY PAID")
              .reduce((acc, pm) => acc + pm.amount * 0.5, 0);

            const effectivePaidAmount = totalPaidAmount + totalPartiallyPaidAmount;
            const totalPendingAmount = Math.max(0, totalMilestoneAmount - effectivePaidAmount);

            const isDocsExpanded = expandedDocsProjectId === p.id;
            const isMilestonesExpanded = expandedMilestonesProjectId === p.id;

            const docTypes = [
              { key: "QUOTATION", label: "Quotation" },
              { key: "AGREEMENT", label: "Agreement" },
              { key: "NDA", label: "NDA" },
              { key: "INVOICE", label: "Invoice" },
              { key: "PAYMENT_RECEIPT", label: "Receipt" },
              { key: "CERTIFICATE", label: "Certificate" },
            ];

            return (
              <div
                key={p.id}
                className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-4 shadow-sm hover:border-[#D5CEBC] transition flex flex-col gap-3"
              >
                {/* 1. SINGLE COMPACT ROW: Title, Client, Scope + Stats + Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left: Project Title, Badges, Client & 1-Line Scope */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight truncate">
                        {p.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                        {p.workType || "Web Dev"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                        {p.status || "In Progress"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-neutral-600 font-medium">
                      {p.client && (
                        <span className="flex items-center gap-1 shrink-0">
                          <Building className="w-3 h-3 text-neutral-500" />
                          <span>Client: <strong className="text-neutral-900">{p.client.name}</strong></span>
                        </span>
                      )}
                      {p.description && (
                        <span className="text-[11px] text-neutral-600 truncate border-l border-[#D5CEBC] pl-2 font-normal">
                          <strong className="text-neutral-800 font-semibold">Scope:</strong> {p.description}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Inline Progress, Financials & Actions */}
                  <div className="flex items-center gap-4 shrink-0 self-end lg:self-center">
                    {/* Work Progress Pill */}
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-neutral-500 font-bold">
                        Progress: <strong className="text-neutral-900">{workProgressPct}%</strong> ({completedMilestones}/{totalMilestones} Done)
                      </span>
                      <div className="w-28 bg-[#DFD9C9] h-1.5 rounded-full overflow-hidden mt-1 self-end border border-[#D5CEBC]">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${workProgressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Stats */}
                    <div className="flex flex-col text-right font-mono">
                      <span className="text-[10px] text-neutral-500 font-bold">
                        Paid: <strong className="text-emerald-700 font-sans">{formatCurrency(effectivePaidAmount, "₹")}</strong> / {formatCurrency(totalMilestoneAmount, "₹")}
                      </span>
                      <span className="text-[10px] text-pink-700 font-bold">
                        Pending: {formatCurrency(totalPendingAmount, "₹")}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 border-l border-[#D5CEBC] pl-3">
                      <button
                        onClick={() => handleStartEditProject(p)}
                        className="p-1.5 rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition cursor-pointer"
                        title="Edit Project"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. TOGGLE ACTION BAR (Documents Suite & Milestones Breakdown) */}
                <div className="flex items-center justify-between pt-2 border-t border-[#D5CEBC] text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => setExpandedDocsProjectId(isDocsExpanded ? null : p.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                        isDocsExpanded
                          ? "bg-[#121212] text-white"
                          : "bg-[#DFD9C9] text-neutral-800 hover:bg-[#D5CEBC]"
                      }`}
                    >
                      <Layers className="w-3 h-3 text-[#a6ce39]" />
                      <span>Documents ({p.documents?.length || 0})</span>
                      {isDocsExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    <button
                      onClick={() => setExpandedMilestonesProjectId(isMilestonesExpanded ? null : p.id)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                        isMilestonesExpanded
                          ? "bg-[#121212] text-white"
                          : "bg-[#DFD9C9] text-neutral-800 hover:bg-[#D5CEBC]"
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-amber-500" />
                      <span>Milestones ({totalMilestones})</span>
                      {isMilestonesExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  <span className="text-[10px] text-neutral-500 font-mono">
                    {completedMilestones} Completed • {remainingMilestones} Remaining
                  </span>
                </div>

                {/* 3. COLLAPSIBLE DOCUMENTS SUITE GRID */}
                {isDocsExpanded && (
                  <div className="mt-1 bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-neutral-700 tracking-wider">
                        Related Documents Suite
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Click eye icon to view live preview
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {docTypes.map((dt) => {
                        const matchedDoc = (p.documents || []).find(
                          (d) =>
                            d.type.toUpperCase() === dt.key ||
                            d.type.toLowerCase() === dt.label.toLowerCase()
                        );

                        return (
                          <div
                            key={dt.key}
                            className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-xl p-2 flex items-center justify-between gap-1 shadow-xs"
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              {getDocTypeIcon(dt.key)}
                              <span className="text-[11px] font-bold text-neutral-900 truncate">
                                {dt.label}
                              </span>
                            </div>

                            <button
                              onClick={() => openDocPreview(p, dt.key, dt.label)}
                              className={`p-1 rounded-md transition cursor-pointer shrink-0 ${
                                matchedDoc
                                  ? "bg-[#DFD9C9] text-neutral-900 hover:bg-[#121212] hover:text-white"
                                  : "bg-neutral-200 text-neutral-500 hover:bg-purple-600 hover:text-white"
                              }`}
                              title={
                                matchedDoc
                                  ? `Preview ${dt.label} (${matchedDoc.documentNumber})`
                                  : `Generate ${dt.label}`
                              }
                            >
                              <Eye className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. COLLAPSIBLE MILESTONES BREAKDOWN */}
                {isMilestonesExpanded && (
                  <div className="mt-1 bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0] flex flex-col gap-2.5">
                    <div className="flex items-center justify-between border-b border-[#E2DDD0] pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-purple-600" />
                        <span className="text-[11px] font-extrabold uppercase text-neutral-900 tracking-wider">
                          Project Milestones Breakdown ({totalMilestones})
                        </span>
                      </div>

                      <button
                        onClick={() => handleOpenAddMilestone(p.id)}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#121212] text-white text-[11px] font-bold hover:bg-neutral-800 transition cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#a6ce39]" />
                        <span>Add Project Milestone</span>
                      </button>
                    </div>

                    <div className="flex flex-col gap-2">
                      {p.payments.map((pm) => {
                        const meta = parseMilestoneNote(pm.note, pm.status);
                        const isPaid = (pm.status || "").toUpperCase() === "PAID";
                        const isPartiallyPaid =
                          (pm.status || "").toUpperCase() === "PARTIALLY_PAID" ||
                          (pm.status || "").toUpperCase() === "PARTIALLY PAID";

                        return (
                          <div
                            key={pm.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-[#EBE7DC] border border-[#E2DDD0] text-xs gap-2 shadow-xs hover:border-[#D5CEBC] transition"
                          >
                            {/* Left Info: Milestone Name & Badges */}
                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-neutral-900 text-xs">
                                  {pm.label}
                                </span>

                                {/* Work Status Badge */}
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 ${
                                    meta.workStatus === "Completed"
                                      ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                      : meta.workStatus === "In Progress"
                                      ? "bg-blue-100 text-blue-900 border border-blue-300"
                                      : "bg-neutral-200 text-neutral-700 border border-neutral-300"
                                  }`}
                                >
                                  {meta.workStatus === "Completed" ? (
                                    <CheckCircle className="w-3 h-3 text-emerald-700" />
                                  ) : meta.workStatus === "In Progress" ? (
                                    <CircleDot className="w-3 h-3 text-blue-700 animate-pulse" />
                                  ) : (
                                    <AlertCircle className="w-3 h-3 text-neutral-500" />
                                  )}
                                  <span>{meta.workStatus}</span>
                                </span>

                                {/* Payment Status Badge */}
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                    isPaid
                                      ? "bg-emerald-200 text-emerald-900"
                                      : isPartiallyPaid
                                      ? "bg-amber-200 text-amber-900"
                                      : "bg-pink-100 text-pink-900"
                                  }`}
                                >
                                  {isPaid ? "Paid" : isPartiallyPaid ? "Partially Paid" : "Pending"}
                                </span>
                              </div>

                              {meta.description && (
                                <p className="text-[11px] text-neutral-600 font-medium leading-tight line-clamp-1">
                                  {meta.description}
                                </p>
                              )}

                              {pm.dueDate && (
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  Due: {formatDate(pm.dueDate as any)}
                                </span>
                              )}
                            </div>

                            {/* Right Info: Financial Amount & Interactive Buttons */}
                            <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                              <span className="font-mono font-extrabold text-neutral-900 text-xs">
                                {formatCurrency(pm.amount, "₹")}
                              </span>

                              <button
                                onClick={() => handleToggleMarkPaid(pm)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold transition cursor-pointer ${
                                  isPaid
                                    ? "bg-emerald-200 text-emerald-900 hover:bg-emerald-300"
                                    : "bg-[#121212] text-white hover:bg-neutral-800"
                                }`}
                              >
                                {isPaid ? "✓ Paid" : "Mark Paid"}
                              </button>

                              <button
                                onClick={() => handleOpenEditMilestone(pm)}
                                className="p-1 rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition cursor-pointer"
                                title="Edit Project Milestone"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-extrabold text-neutral-900">Edit Project Details & Scope</h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="p-1 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectEdit} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={projectEditForm.name}
                  onChange={(e) => setProjectEditForm({ ...projectEditForm, name: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                  placeholder="e.g. Website Redesign & SEO"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Work Type</label>
                  <input
                    type="text"
                    value={projectEditForm.workType}
                    onChange={(e) => setProjectEditForm({ ...projectEditForm, workType: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Project Status</label>
                  <select
                    value={projectEditForm.status}
                    onChange={(e) => setProjectEditForm({ ...projectEditForm, status: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Total Budget (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={projectEditForm.budget}
                  onChange={(e) => setProjectEditForm({ ...projectEditForm, budget: Number(e.target.value) })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-neutral-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Project Summary (Passage)</label>
                <textarea
                  rows={3}
                  placeholder="Detailed project requirements, scope summary passage..."
                  value={projectEditForm.description}
                  onChange={(e) => setProjectEditForm({ ...projectEditForm, description: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D5CEBC] mt-2">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-800 text-xs font-bold hover:bg-[#D5CEBC] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-md cursor-pointer"
                >
                  Save Project Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redesigned 📍 Add / Edit Project Milestone Dialog Modal */}
      {milestoneModalState.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in zoom-in-95">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-[24px] p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">
                  📍 {milestoneModalState.mode === "CREATE" ? "Add Project Milestone" : "Edit Project Milestone"}
                </h3>
              </div>
              <button
                onClick={() => setMilestoneModalState((prev) => ({ ...prev, isOpen: false }))}
                className="p-1 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestoneForm} className="flex flex-col gap-4">
              {/* Field 1: Milestone Name */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  1. Milestone Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UI Design, Homepage Development, SEO Optimization, Testing, Deployment"
                  value={milestoneModalState.name}
                  onChange={(e) => setMilestoneModalState({ ...milestoneModalState, name: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs font-bold text-neutral-900 focus:outline-none"
                />
              </div>

              {/* Field 2: Description (Optional) */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  2. Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe what needs to be completed in this milestone..."
                  value={milestoneModalState.description}
                  onChange={(e) => setMilestoneModalState({ ...milestoneModalState, description: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
                />
              </div>

              {/* Field 3 & 4: Work Status & Due Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    3. Work Status *
                  </label>
                  <select
                    value={milestoneModalState.workStatus}
                    onChange={(e) =>
                      setMilestoneModalState({
                        ...milestoneModalState,
                        workStatus: e.target.value as any,
                      })
                    }
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    4. Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={milestoneModalState.dueDate}
                    onChange={(e) => setMilestoneModalState({ ...milestoneModalState, dueDate: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-medium text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Payment Information Section Divider & Heading */}
              <div className="border-t border-[#D5CEBC] pt-3 mt-1">
                <div className="flex items-center gap-1.5 mb-3">
                  <IndianRupee className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-extrabold uppercase text-neutral-800 tracking-wider">
                    Payment Information
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Field 5: Payment Amount */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      5. Payment Amount (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={milestoneModalState.amount}
                      onChange={(e) => setMilestoneModalState({ ...milestoneModalState, amount: Number(e.target.value) })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-neutral-900 focus:outline-none"
                    />
                  </div>

                  {/* Field 6: Payment Status */}
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      6. Payment Status
                    </label>
                    <select
                      value={milestoneModalState.paymentStatus}
                      onChange={(e) =>
                        setMilestoneModalState({
                          ...milestoneModalState,
                          paymentStatus: e.target.value as any,
                        })
                      }
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Field 7: Notes (Optional) */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  7. Notes (Optional Internal Notes)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add any internal client or developer notes..."
                  value={milestoneModalState.notes}
                  onChange={(e) => setMilestoneModalState({ ...milestoneModalState, notes: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[#D5CEBC] mt-2">
                {milestoneModalState.mode === "EDIT" ? (
                  <button
                    type="button"
                    onClick={handleDeleteMilestone}
                    className="flex items-center gap-1 px-4 py-2 rounded-full bg-pink-100 text-pink-800 text-xs font-bold hover:bg-pink-200 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMilestoneModalState((prev) => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-800 text-xs font-bold hover:bg-[#D5CEBC] transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-md cursor-pointer"
                  >
                    {milestoneModalState.mode === "CREATE" ? "Create Milestone" : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Project Modal with Auto-Fetched Client & Passage Summary */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">Create New Project & Milestones</h3>
              </div>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="p-1 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Select Client (Auto-Fetches Title & Summary) *</label>
                <select
                  value={newProject.clientId}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                  required
                >
                  <option value="">-- Select Client from Directory --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.company ? `(${c.company})` : ""} {c.projectTitle ? `— ${c.projectTitle}` : ""}
                    </option>
                  ))}
                </select>

                {/* Auto-Fetched Client Summary Card */}
                {selectedClientObj && (
                  <div className="mt-2 bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0] text-xs font-medium text-neutral-700 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-extrabold text-neutral-900">{selectedClientObj.name} {selectedClientObj.company ? `(${selectedClientObj.company})` : ""}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                        {selectedClientObj.workType || "Web Dev"}
                      </span>
                    </div>

                    {selectedClientObj.projectTitle && (
                      <div className="text-[11px] font-bold text-purple-900">
                        Title: {selectedClientObj.projectTitle}
                      </div>
                    )}

                    {(selectedClientObj.projectSummary || selectedClientObj.notes) && (
                      <div className="text-[11px] text-neutral-600 leading-snug line-clamp-2 bg-[#EBE7DC] p-2 rounded-xl border border-[#E2DDD0]">
                        <span className="font-bold text-neutral-800">Passage Summary: </span>
                        {selectedClientObj.projectSummary || selectedClientObj.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Project Title / Name *</label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Website & Admin Portal"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Project Description / Passage Summary</label>
                <textarea
                  rows={2}
                  placeholder="Detailed scope passage..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Work Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Dev, App Dev, UI/UX"
                    value={newProject.workType}
                    onChange={(e) => setNewProject({ ...newProject, workType: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Total Budget / Project Value (₹) *</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-extrabold text-neutral-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Payment Milestone Structure</label>
                <select
                  value={newProject.paymentStructure}
                  onChange={(e) => setNewProject({ ...newProject, paymentStructure: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                >
                  <option value="50/50">50/50 (50% Advance + 50% Final)</option>
                  <option value="3-Way Split">3-Way Split (30% + 30% + 40%)</option>
                  <option value="Full Upfront">Full Upfront (100% Advance)</option>
                  <option value="Full Payment After Work">Full Payment After Work (100% Post-Completion)</option>
                  <option value="Monthly Retainer">Monthly Retainer</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Delivery Date</label>
                  <input
                    type="date"
                    value={newProject.deliveryDate}
                    onChange={(e) => setNewProject({ ...newProject, deliveryDate: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D5CEBC] mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-800 text-xs font-bold hover:bg-[#D5CEBC] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-[#121212] hover:bg-neutral-800 text-white text-xs font-bold transition shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save Project & Milestones"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Floating Document Preview Modal (No Navigation Away) */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 transition-all duration-250 animate-in fade-in zoom-in-95">
          <div
            className={`bg-[#EBE7DC] border border-white/10 rounded-[24px] shadow-2xl flex flex-col justify-between transition-all duration-250 overflow-hidden ${
              isFullScreen ? "w-full h-full rounded-none p-4" : "w-[92vw] max-w-5xl h-[90vh] p-6"
            }`}
          >
            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D5CEBC] pb-4 shrink-0">
              {/* Left Info */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#DFD9C9] text-neutral-900">
                  {getDocTypeIcon(previewDoc.docType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-neutral-900">
                      {previewDoc.relatedDocsList[previewDoc.docIndex]?.typeLabel} Preview
                    </h3>
                    {previewDoc.doc && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-200 text-emerald-900">
                        {previewDoc.doc.status}
                      </span>
                    )}
                  </div>
                  {previewDoc.doc ? (
                    <p className="text-xs text-neutral-600 font-mono mt-0.5">
                      #{previewDoc.doc.documentNumber} • Client: <strong>{previewDoc.doc.clientName}</strong> • Date: {formatDate(previewDoc.doc.date)}
                    </p>
                  ) : (
                    <p className="text-xs text-neutral-500 font-medium mt-0.5">
                      Project: {previewDoc.project?.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Top Right Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {previewDoc.doc && (
                  <>
                    <button
                      onClick={() =>
                        exportToPDF(
                          "floating-project-doc",
                          `${previewDoc.doc?.documentNumber || "Document"}.pdf`
                        )
                      }
                      disabled={isExporting}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121212] text-white text-xs font-bold shadow hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5 text-[#a6ce39]" />
                      <span>PDF</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="p-2 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition cursor-pointer"
                      title="Print Document"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={handleShareDoc}
                      className="p-2 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition cursor-pointer"
                      title="Share Document"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className="p-2 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition cursor-pointer"
                  title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>

                <Link
                  href={getDocRoute(previewDoc.docType)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold shadow hover:bg-purple-700 transition cursor-pointer"
                  title="Open Editor"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-2 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
                  title="Close Modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content / Embedded Viewer Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-neutral-950/20 rounded-2xl flex justify-center items-start my-3 shadow-inner">
              {previewDoc.doc ? (
                <div className="shadow-2xl rounded-2xl overflow-hidden bg-white">
                  {renderTemplateComponent(previewDoc.doc)}
                </div>
              ) : (
                /* Empty State when Document is not generated yet */
                <div className="m-auto py-16 px-8 text-center flex flex-col items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl shadow-xl max-w-md">
                  <div className="p-4 rounded-3xl bg-purple-100 text-purple-700">
                    <FileQuestion className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-extrabold text-neutral-900">📄 No document available yet</h3>
                  <p className="text-xs text-neutral-600 font-medium">
                    The {previewDoc.relatedDocsList[previewDoc.docIndex]?.typeLabel} for project &quot;{previewDoc.project?.name}&quot; has not been generated. Generate it now!
                  </p>
                  <Link
                    href={getDocRoute(previewDoc.docType)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] hover:bg-neutral-800 text-white text-xs font-extrabold transition shadow-md mt-2"
                  >
                    <Sparkles className="w-4 h-4 text-[#a6ce39]" />
                    <span>Generate {previewDoc.relatedDocsList[previewDoc.docIndex]?.typeLabel}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom Sticky Footer Bar */}
            <div className="flex items-center justify-between border-t border-[#D5CEBC] pt-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold hover:bg-neutral-900 hover:text-white transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Document</span>
                </button>

                <button
                  onClick={handleNextDoc}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold hover:bg-[#121212] hover:text-white transition cursor-pointer"
                >
                  <span>Next Document</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-neutral-500 font-mono hidden sm:block">
                Document {previewDoc.docIndex + 1} of {previewDoc.relatedDocsList.length}
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="px-5 py-1.5 rounded-full bg-[#121212] text-white text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
