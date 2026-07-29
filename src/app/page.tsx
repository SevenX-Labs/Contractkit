"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Eye,
  Video,
  UserCheck,
  Plus,
} from "lucide-react";
import { getAllDocumentsDB, deleteDocumentDB } from "./actions";
import { SavedDocument } from "../types";
import { formatCurrency, formatDate } from "../lib/utils";
import { toast } from "sonner";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "invoice" | "agreement" | "nda">("all");
  const [mounted, setMounted] = useState(false);

  const fetchDocs = async () => {
    const docs = await getAllDocumentsDB();
    setDocuments(docs);
  };

  useEffect(() => {
    setMounted(true);
    fetchDocs();
  }, []);

  const handleDelete = async (doc: SavedDocument) => {
    const res = await deleteDocumentDB(doc.id, doc.type);
    if (res.success) {
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      toast.success(`Deleted "${doc.title}" from database`);
    } else {
      toast.error(`Error deleting document: ${res.error}`);
    }
  };

  const filteredDocs = documents.filter((d) => {
    if (activeFilter === "all") return true;
    return d.type === activeFilter;
  });

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Your client billing & invoices
          </h1>
          <p className="text-xs text-neutral-600 mt-1 font-medium">
            Manage your studio payments, active contracts, and client invoices via Prisma Database
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/invoice"
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Invoice</span>
          </Link>
          <Link
            href="/agreement"
            className="px-4 py-2 rounded-full bg-[#EBE7DC] border border-[#E2DDD0] text-neutral-900 text-xs font-bold hover:bg-[#E2DDD0] transition flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>New Agreement</span>
          </Link>
        </div>
      </div>

      {/* Top Grid: Donut Chart, Waiting for Bills, Latest Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart Component */}
        <div className="lg:col-span-4 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-sm min-h-[220px]">
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* SVG Donut Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#FBCFE8"
                strokeWidth="14"
                strokeDasharray="140 240"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#BFDBFE"
                strokeWidth="14"
                strokeDasharray="60 240"
                strokeDashoffset="-145"
                strokeLinecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="transparent"
                stroke="#FEF08A"
                strokeWidth="14"
                strokeDasharray="50 240"
                strokeDashoffset="-210"
                strokeLinecap="round"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mb-1">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                23,4k
              </span>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                Total Revenue
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Waiting for Bills + Latest Transactions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Waiting for Bills Row */}
          <div>
            <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-3">
              Waiting for bills & payments
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">Samantha Williams</h4>
                      <p className="text-[10px] text-neutral-500">SXL — Web App Setup</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-200 text-blue-900 text-[10px] font-bold">
                    09:15 AM
                  </span>
                </div>

                <Link
                  href="/invoice"
                  className="w-full text-center py-2 rounded-full bg-[#121212] text-white text-[11px] font-bold hover:bg-neutral-800 transition"
                >
                  Request payment
                </Link>
              </div>

              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900">Amy White</h4>
                      <p className="text-[10px] text-neutral-500">SXL — UI Consultation</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-200 text-pink-900 text-[10px] font-bold">
                    09:45 AM
                  </span>
                </div>

                <Link
                  href="/invoice"
                  className="w-full text-center py-2 rounded-full bg-[#121212] text-white text-[11px] font-bold hover:bg-neutral-800 transition"
                >
                  Request payment
                </Link>
              </div>
            </div>
          </div>

          {/* Latest Transaction Horizontal Cards */}
          <div>
            <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-3">
              Latest transactions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Acme Dynamics</p>
                  <p className="text-[10px] text-neutral-500 font-mono">#3586895</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                  + $568.56
                </span>
              </div>

              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Wilkinson T.</p>
                  <p className="text-[10px] text-neutral-500 font-mono">#1244657</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                  + $465.40
                </span>
              </div>

              <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-[11px] font-bold text-neutral-800">Vortex AI Tech</p>
                  <p className="text-[10px] text-neutral-500 font-mono">#5476856</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                  + $345.65
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Stacked Colorful Stat Cards + Transactions Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Colorful Stat Cards */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-[#FBCFE8] text-[#831843] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>♡</span>
                <span>Payments received</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/60 text-pink-950 text-[10px] font-extrabold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                +13%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight">$ 14,568</span>
              <p className="text-[10px] font-semibold text-pink-900/70 mt-0.5">Total receipts value</p>
            </div>
          </div>

          <div className="bg-[#BFDBFE] text-[#1E3A8A] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>⌛</span>
                <span>Payments requested</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/60 text-blue-950 text-[10px] font-extrabold flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                -6%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight">$ 6,234</span>
              <p className="text-[10px] font-semibold text-blue-900/70 mt-0.5">Total waiting payments value</p>
            </div>
          </div>

          <div className="bg-[#FEF08A] text-[#713F12] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-xs">
                <span>💳</span>
                <span>Direct contract billing</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/60 text-yellow-950 text-[10px] font-extrabold flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" />
                -17%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight">$ 3,786</span>
              <p className="text-[10px] font-semibold text-yellow-900/70 mt-0.5">Total value of non-covered billing</p>
            </div>
          </div>
        </div>

        {/* Right Transactions & Documents Table */}
        <div className="lg:col-span-8 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {(["all", "invoice", "agreement", "nda"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition ${
                    activeFilter === filter
                      ? "bg-[#121212] text-white shadow"
                      : "bg-[#DFD9C9] text-neutral-800 hover:bg-[#D5CEBC]"
                  }`}
                >
                  {filter === "all" ? "All Documents" : `${filter}s`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-900">
              <thead className="text-neutral-500 uppercase tracking-wider text-[10px] border-b border-[#D5CEBC]">
                <tr>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Send Date</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD0]">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                      No documents stored in Prisma DB yet. Create your first document above!
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#DFD9C9]/50 transition">
                      <td className="py-3.5 px-3 font-semibold capitalize text-neutral-900">
                        {doc.type}
                      </td>
                      <td className="py-3.5 px-3 text-neutral-600 font-mono">
                        {formatDate(doc.date)}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-neutral-900">
                        {doc.clientName}
                      </td>
                      <td className="py-3.5 px-3 font-extrabold text-neutral-900">
                        {doc.amount ? formatCurrency(doc.amount) : "N/A"}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          doc.status === "paid" || doc.status === "signed"
                            ? "bg-emerald-200 text-emerald-900"
                            : doc.status === "sent"
                            ? "bg-blue-200 text-blue-900"
                            : "bg-pink-200 text-pink-900"
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href="/history"
                            className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
