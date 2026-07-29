"use client";

import React, { useState, useEffect } from "react";
import { getAllDocumentsDB, deleteDocumentDB } from "../actions";
import { SavedDocument, DocumentType, DocumentStatus } from "../../types";
import { formatCurrency, formatDate } from "../../lib/utils";
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
} from "lucide-react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [activeType, setActiveType] = useState<"all" | DocumentType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | DocumentStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<SavedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Document History</h1>
            <p className="text-xs text-neutral-600 font-medium">
              Search, filter, view and manage all studio contracts saved in Prisma Database
            </p>
          </div>
        </div>

        <button
          onClick={fetchDocs}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#DFD9C9] text-neutral-900 text-xs font-bold hover:bg-[#D5CEBC] transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh DB</span>
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

      {/* Documents Table */}
      <div className="rounded-3xl bg-[#EBE7DC] border border-[#E2DDD0] p-6 shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-neutral-500 flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium">Loading documents from Prisma Database...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-neutral-500 flex flex-col items-center gap-2">
            <History className="w-8 h-8 text-neutral-400" />
            <p className="text-sm font-bold text-neutral-800">No documents found in database.</p>
            <p className="text-xs text-neutral-500">Create an invoice, agreement, or NDA to start saving to Supabase!</p>
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
                      {doc.amount ? formatCurrency(doc.amount) : "N/A"}
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
                          title="View Details"
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

      {/* Modal View Details */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-neutral-900">{selectedDoc.title}</h3>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0] text-xs text-neutral-800 flex flex-col gap-2 font-mono">
              <div><strong className="text-neutral-900">Doc #:</strong> {selectedDoc.documentNumber}</div>
              <div><strong className="text-neutral-900">Type:</strong> {selectedDoc.type}</div>
              <div><strong className="text-neutral-900">Client:</strong> {selectedDoc.clientName}</div>
              <div><strong className="text-neutral-900">Date:</strong> {formatDate(selectedDoc.date)}</div>
              {selectedDoc.amount && <div><strong className="text-neutral-900">Amount:</strong> {formatCurrency(selectedDoc.amount)}</div>}
              <div><strong className="text-neutral-900">Status:</strong> {selectedDoc.status}</div>
              <div><strong className="text-neutral-900">Prisma ID:</strong> {selectedDoc.id}</div>
            </div>

            <div className="flex justify-end gap-3 mt-2">
              <button
                onClick={() => setSelectedDoc(null)}
                className="px-5 py-2 rounded-full bg-[#121212] text-white text-xs font-bold hover:bg-neutral-800 transition"
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
