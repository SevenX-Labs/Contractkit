"use client";

import React, { useState, useEffect } from "react";
import {
  getProjectsDB,
  getClientsDB,
  createProjectDB,
  updatePaymentStatusDB,
  deleteProjectDB,
} from "../actions";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Trash2,
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
  Calendar,
  Sparkles,
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
  status: "PENDING" | "PAID" | "OVERDUE";
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

export default function ProjectsPage() {
  const { exportToPDF, isExporting } = useDocumentExport();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
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

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) {
      toast.error("Please enter a project name.");
      return;
    }

    setIsSubmitting(true);
    const res = await createProjectDB({
      name: newProject.name,
      description: newProject.description,
      budget: Number(newProject.budget),
      workType: newProject.workType,
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

  const handleMarkPaid = async (paymentId: string, label: string) => {
    const res = await updatePaymentStatusDB(paymentId, "PAID");
    if (res.success) {
      toast.success(`Marked "${label}" as PAID! Project progress updated.`);
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
    // Standard document suite types for a project
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
      (p.client && p.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.workType && p.workType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        return <FileSignature className="w-4 h-4 text-lime-600" />;
      case "AGREEMENT":
        return <FileCheck className="w-4 h-4 text-blue-600" />;
      case "NDA":
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case "INVOICE":
        return <FileText className="w-4 h-4 text-pink-600" />;
      case "PAYMENT_RECEIPT":
      case "RECEIPT":
        return <Receipt className="w-4 h-4 text-cyan-600" />;
      case "CERTIFICATE":
        return <Award className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-purple-600" />;
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Project Milestone Tracker & Related Documents
            </h1>
            <p className="text-xs text-neutral-600 font-medium">
              Track project progress bars, paid vs pending milestones, and view related legal & financial documents
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
      <div className="flex items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] p-3 rounded-2xl">
        <Search className="w-4 h-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search projects by title, client name, or work type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full px-4 py-2 text-xs text-neutral-900 focus:outline-none"
        />
      </div>

      {/* Projects List */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading projects & tracker...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <FolderKanban className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No projects found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Create your first project or add a client in the Client CRM to auto-track milestones & related documents!
          </p>
          <button
            onClick={() => setShowAddProjectModal(true)}
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow mt-2 hover:bg-neutral-800 transition"
          >
            Create Project Now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredProjects.map((p) => {
            const totalVal = p.totalValue || p.budget || 1;
            const progressPct = Math.min(100, Math.round((p.amountPaid / totalVal) * 100));
            const isExpanded = expandedProjectId === p.id;

            // Related documents types list for this project
            const docTypes = [
              { key: "QUOTATION", label: "Quotation" },
              { key: "AGREEMENT", label: "Agreement" },
              { key: "NDA", label: "NDA" },
              { key: "INVOICE", label: "Invoice" },
              { key: "PAYMENT_RECEIPT", label: "Receipt" },
              { key: "CERTIFICATE", label: "Completion Certificate" },
            ];

            return (
              <div key={p.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col gap-5">
                {/* Card Top Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-neutral-900">{p.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                        {p.workType || "Web Dev"}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                        {p.status || "In Progress"}
                      </span>
                    </div>
                    {p.client && (
                      <p className="text-xs text-neutral-600 font-medium mt-1 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Client: <strong className="text-neutral-900">{p.client.name}</strong></span>
                        {p.client.company && <span className="text-neutral-400">({p.client.company})</span>}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-500 font-bold block">Paid / Total Budget</span>
                      <span className="text-sm font-extrabold text-neutral-900 font-mono">
                        {formatCurrency(p.amountPaid, "₹")} / {formatCurrency(totalVal, "₹")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-2 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5 bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0]">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-neutral-700">Financial Progress ({progressPct}%)</span>
                    <span className="text-pink-700">Pending Balance: {formatCurrency(p.amountPending, "₹")}</span>
                  </div>
                  <div className="w-full bg-[#EBE7DC] h-3 rounded-full overflow-hidden border border-[#E2DDD0]">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Related Documents Grid Section */}
                <div className="flex flex-col gap-2.5 pt-1 border-t border-[#D5CEBC]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-700">
                      Related Documents Suite
                    </span>
                    <span className="text-[10px] text-neutral-500 font-bold">
                      Click View icon to trigger live floating preview
                    </span>
                  </div>

                  {/* 6 Document Type Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {docTypes.map((dt) => {
                      const matchedDoc = (p.documents || []).find(
                        (d) => d.type.toUpperCase() === dt.key || d.type.toLowerCase() === dt.label.toLowerCase()
                      );

                      return (
                        <div
                          key={dt.key}
                          className="bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl p-2.5 flex flex-col justify-between gap-2 shadow-xs hover:border-purple-300 transition"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {getDocTypeIcon(dt.key)}
                              <span className="text-[11px] font-bold text-neutral-900 truncate max-w-[80px]">
                                {dt.label}
                              </span>
                            </div>

                            {matchedDoc ? (
                              <button
                                onClick={() => openDocPreview(p, dt.key, dt.label)}
                                className="p-1 rounded-md bg-[#DFD9C9] text-neutral-900 hover:bg-[#121212] hover:text-white transition cursor-pointer"
                                title={`Preview ${dt.label} (${matchedDoc.documentNumber})`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => openDocPreview(p, dt.key, dt.label)}
                                className="p-1 rounded-md bg-neutral-200 text-neutral-500 hover:bg-purple-600 hover:text-white transition cursor-pointer"
                                title={`View status for ${dt.label}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {matchedDoc ? (
                            <div>
                              <span className="font-mono text-[10px] font-bold text-neutral-800 block truncate">
                                {matchedDoc.documentNumber}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-200 text-emerald-900 inline-block mt-0.5">
                                {matchedDoc.status}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-400 font-medium italic block">
                              Not generated
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Toggle Milestone Breakdown */}
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-purple-700 transition cursor-pointer"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>
                      {isExpanded ? "Hide Milestone Breakdown" : `View ${p.payments.length} Milestone Payments`}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 flex flex-col gap-3 bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0]">
                      <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">
                        Milestone Breakdown & Payment Status
                      </h4>
                      <div className="flex flex-col gap-2">
                        {p.payments.map((pm) => (
                          <div
                            key={pm.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#EBE7DC] border border-[#E2DDD0] gap-2"
                          >
                            <div className="flex items-center gap-3">
                              {pm.status === "PAID" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              )}
                              <div>
                                <span className="text-xs font-bold text-neutral-900 block">{pm.label}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {pm.status === "PAID"
                                    ? `Paid on ${formatDate(pm.paidDate as any)}`
                                    : pm.dueDate
                                    ? `Due: ${formatDate(pm.dueDate as any)}`
                                    : "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                              <span className="text-xs font-extrabold text-neutral-900 font-mono">
                                {formatCurrency(pm.amount, "₹")}
                              </span>
                              {pm.status !== "PAID" ? (
                                <button
                                  onClick={() => handleMarkPaid(pm.id, pm.label)}
                                  className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold shadow hover:bg-emerald-800 transition cursor-pointer"
                                >
                                  Mark PAID
                                </button>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-extrabold uppercase">
                                  PAID
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-neutral-900">Create New Project</h3>
              </div>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="p-1 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Website Redesign"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Link Client</label>
                  <select
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">-- Select Client --</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Work Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Dev, App Dev, UI/UX"
                    value={newProject.workType}
                    onChange={(e) => setNewProject({ ...newProject, workType: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Total Budget (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900 focus:outline-none"
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

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  placeholder="Project scope summary..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#D5CEBC]">
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
                  {isSubmitting ? "Creating..." : "Save Project"}
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
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold hover:bg-neutral-900 hover:text-white transition cursor-pointer"
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
