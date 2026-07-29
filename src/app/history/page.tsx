"use client";

import React, { useState, useEffect } from "react";
import { getAllDocumentsDB, deleteDocumentDB } from "../actions";
import { SavedDocument, DocumentType, DocumentStatus } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import {
  History,
  Search,
  FileText,
  FileCheck,
  ShieldCheck,
  Trash2,
  Eye,
  X,
  RefreshCw,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [activeType, setActiveType] = useState<"all" | DocumentType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { exportToPDF } = useDocumentExport();

  const fetchDocs = async () => {
    setIsLoading(true);
    const docs = await getAllDocumentsDB();
    setDocuments(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleDelete = async (doc: SavedDocument) => {
    const res = await deleteDocumentDB(doc.id, doc.type);
    if (res.success) {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      if (selectedDoc?.id === doc.id) setSelectedDoc(null);
      toast.success(`Deleted "${doc.title}" from Prisma Database`);
    } else {
      toast.error(`Error deleting: ${res.error}`);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesType = activeType === "all" || doc.type === activeType;
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentNumber.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Document Vault & History</h1>
            <p className="text-xs text-neutral-600 font-medium">
              View floating A4 screen previews, download PDFs, and manage studio contracts
            </p>
          </div>
        </div>

        <button
          onClick={fetchDocs}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold hover:bg-[#D5CEBC] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh Vault</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(["all", "invoice", "agreement", "nda"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition ${
                activeType === type
                  ? "bg-[#121212] text-white shadow"
                  : "bg-[#DFD9C9] text-neutral-800 hover:bg-[#D5CEBC]"
              }`}
            >
              {type === "all" ? "All Documents" : `${type}s`}
            </button>
          ))}
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search by client or #"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full pl-9 pr-3 py-1.5 text-xs text-neutral-900 placeholder-neutral-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#F4F4F4] border border-[#E2DDD0] rounded-full px-3 py-1.5 text-xs font-bold text-neutral-900 focus:outline-none capitalize"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="signed">Signed</option>
          </select>
        </div>
      </div>

      {/* Documents Table with Skeleton Loader */}
      <div className="rounded-3xl bg-[#EBE7DC] border border-[#E2DDD0] p-6 shadow-sm">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse bg-[#DFD9C9] h-12 rounded-xl w-full" />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 flex flex-col items-center gap-2">
            <History className="w-8 h-8 text-neutral-400" />
            <p className="text-sm font-bold text-neutral-800">No documents found in vault.</p>
            <p className="text-xs text-neutral-500">Create an invoice, agreement, or NDA to start saving!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-900">
              <thead className="text-neutral-500 uppercase tracking-wider text-[10px] border-b border-[#D5CEBC]">
                <tr>
                  <th className="py-3.5 px-4 rounded-l-xl">Document #</th>
                  <th className="py-3.5 px-4">Title / Client</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD0]">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#DFD9C9]/50 transition">
                    <td className="py-4 px-4 font-mono font-bold text-neutral-900">
                      {doc.documentNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-neutral-900">{doc.title}</div>
                      <div className="text-[11px] text-neutral-600 font-medium">{doc.clientName}</div>
                    </td>
                    <td className="py-4 px-4 capitalize">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#DFD9C9] text-neutral-900">
                        {doc.type === "invoice" && <FileText className="w-3 h-3 text-pink-700" />}
                        {doc.type === "agreement" && <FileCheck className="w-3 h-3 text-blue-700" />}
                        {doc.type === "nda" && <ShieldCheck className="w-3 h-3 text-emerald-700" />}
                        <span>{doc.type}</span>
                      </span>
                    </td>
                    <td className="py-4 px-4 text-neutral-600 font-mono">{formatDate(doc.date)}</td>
                    <td className="py-4 px-4 font-extrabold text-neutral-900">
                      {doc.amount ? formatCurrency(doc.amount, "₹") : "N/A"}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        doc.status === "paid" || doc.status === "signed"
                          ? "bg-emerald-200 text-emerald-900"
                          : doc.status === "sent"
                          ? "bg-blue-200 text-blue-900"
                          : "bg-pink-200 text-pink-900"
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition"
                          title="Floating Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc)}
                          className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Printable A4 Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Floating Live Document Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">{selectedDoc.title} (#{selectedDoc.documentNumber})</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportToPDF("floating-vault-doc", `${selectedDoc.documentNumber}.pdf`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow hover:bg-neutral-800 transition"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable A4 Card */}
            <div className="overflow-y-auto p-4 bg-neutral-950/20 rounded-2xl flex justify-center">
              <div
                id="floating-vault-doc"
                className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 shadow-2xl rounded-xl flex flex-col justify-between"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                <div>
                  <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-end">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                        {selectedDoc.title}
                      </h1>
                      <p className="text-xs text-neutral-500 mt-1 font-mono">Ref #: {selectedDoc.documentNumber}</p>
                    </div>
                    <div className="text-right text-xs text-neutral-600">
                      <p>Date: {formatDate(selectedDoc.date)}</p>
                      <p className="font-bold text-neutral-900 uppercase mt-0.5">Status: {selectedDoc.status}</p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-800 leading-relaxed mb-6 bg-neutral-50 p-4 rounded border border-neutral-100">
                    <p className="font-bold text-neutral-900 text-sm mb-1">CLIENT DETAILS:</p>
                    <p className="text-sm font-extrabold text-neutral-900">{selectedDoc.clientName}</p>
                    {selectedDoc.amount ? (
                      <p className="text-neutral-700 mt-1 font-mono font-bold">Total Amount: {formatCurrency(selectedDoc.amount, "₹")}</p>
                    ) : null}
                  </div>

                  {selectedDoc.data && (
                    <div className="text-xs text-neutral-700 space-y-3 font-mono bg-neutral-50 p-4 rounded border border-neutral-200">
                      {selectedDoc.data.projectTitle && <p><strong>Project:</strong> {selectedDoc.data.projectTitle}</p>}
                      {selectedDoc.data.projectDescription && <p><strong>Scope:</strong> {selectedDoc.data.projectDescription}</p>}
                      {selectedDoc.data.deliverables && <p className="whitespace-pre-line"><strong>Deliverables:</strong><br />{selectedDoc.data.deliverables}</p>}
                    </div>
                  )}
                </div>

                <div className="border-t border-neutral-300 pt-4 text-center text-[10px] text-neutral-400">
                  <p>SevenX Labs Studio • Official Record #{selectedDoc.documentNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
