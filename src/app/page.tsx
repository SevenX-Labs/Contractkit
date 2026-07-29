"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  IndianRupee,
  Users,
  FolderKanban,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Eye,
  UserCheck,
  Plus,
  RefreshCw,
} from "lucide-react";
import { deleteDocumentDB } from "./actions";
import { formatCurrency, formatDate } from "../lib/utils";
import { toast } from "sonner";

interface DashboardData {
  stats: {
    totalClients: number;
    totalProjects: number;
    totalRevenue: number;
    formattedTotalRevenue: string;
    paymentsReceived: number;
    formattedPaymentsReceived: string;
    paymentsRequested: number;
    formattedPaymentsRequested: string;
    directContractBilling: number;
    formattedDirectContractBilling: string;
    totalInvoices: number;
    totalAgreements: number;
    totalNDAs: number;
    totalDocumentSuites: number;
    totalDocuments: number;
  };
  latestTransactions: Array<{
    id: string;
    documentNumber: string;
    clientName: string;
    type: string;
    amount: number;
    date: string;
    status: string;
    createdAt: string;
  }>;
  waitingForBills: Array<{
    id: string;
    clientName: string;
    invoiceNumber: string;
    amount: number;
    formattedAmount: string;
    date: string;
  }>;
  allDocuments: Array<{
    id: string;
    documentNumber: string;
    clientName: string;
    type: string;
    amount: number;
    date: string;
    status: string;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        toast.error("Failed to load dashboard metrics.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDelete = async (doc: { id: string; type: any; clientName: string }) => {
    const res = await deleteDocumentDB(doc.id, doc.type);
    if (res.success) {
      toast.success(`Deleted item from database`);
      fetchDashboardData();
    } else {
      toast.error(`Error deleting: ${res.error}`);
    }
  };

  const filteredDocs = (data?.allDocuments || []).filter((d) => {
    if (activeFilter === "all") return true;
    return d.type.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Your client billing & invoices
          </h1>
          <p className="text-xs text-neutral-600 mt-1 font-medium">
            Real-time studio analytics powered by Prisma Database & Indian Rupees (₹)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-full bg-[#EBE7DC] border border-[#E2DDD0] text-neutral-900 hover:bg-[#E2DDD0] transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <Link
            href="/invoice"
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>Create Invoice</span>
          </Link>
          <Link
            href="/builder"
            className="px-4 py-2 rounded-full bg-[#EBE7DC] border border-[#E2DDD0] text-neutral-900 text-xs font-bold hover:bg-[#E2DDD0] transition flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Document Studio</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Enterprise Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Earnings</span>
            <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              {data?.stats ? data.stats.formattedTotalRevenue : "₹0.00"}
            </span>
            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">All time revenue</p>
          </div>
        </div>

        <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Clients</span>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              {data?.stats ? data.stats.totalClients : 0}
            </span>
            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Active CRM clients</p>
          </div>
        </div>

        <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Projects</span>
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              {data?.stats ? data.stats.totalProjects : 0}
            </span>
            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Studio projects</p>
          </div>
        </div>

        <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Documents</span>
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
              {data?.stats ? data.stats.totalDocuments : 0}
            </span>
            <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Invoices, contracts & NDAs</p>
          </div>
        </div>
      </div>

      {/* Grid: Donut Revenue Chart, Waiting for Bills, Latest Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart Component */}
        <div className="lg:col-span-4 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-sm min-h-[240px]">
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center mb-1">
                <IndianRupee className="w-3.5 h-3.5" />
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-neutral-900 tracking-tight">
                {data?.stats ? data.stats.formattedTotalRevenue : "₹0.00"}
              </span>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mt-0.5">
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
              Waiting for bills & payments ({data?.waitingForBills?.length || 0})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data?.waitingForBills && data.waitingForBills.length > 0 ? (
                data.waitingForBills.slice(0, 2).map((bill) => (
                  <div key={bill.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-neutral-900">{bill.clientName}</h4>
                          <p className="text-[10px] text-neutral-500 font-mono">Invoice #{bill.invoiceNumber}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-200 text-pink-900 text-[10px] font-bold">
                        {bill.formattedAmount}
                      </span>
                    </div>

                    <Link
                      href="/invoice"
                      className="w-full text-center py-2 rounded-full bg-[#121212] text-white text-[11px] font-bold hover:bg-neutral-800 transition"
                    >
                      Request payment
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-2 bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-6 text-center text-xs text-neutral-600 font-medium">
                  No pending invoices waiting for payment. Create an invoice to get started!
                </div>
              )}
            </div>
          </div>

          {/* Latest Transactions Horizontal Cards */}
          <div>
            <h3 className="text-xs font-extrabold text-neutral-800 uppercase tracking-wider mb-3">
              Latest transactions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {data?.latestTransactions && data.latestTransactions.length > 0 ? (
                data.latestTransactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-[11px] font-bold text-neutral-800 truncate max-w-[100px]">{tx.clientName}</p>
                      <p className="text-[10px] text-neutral-500 font-mono">#{tx.documentNumber}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-200 text-emerald-900 text-xs font-bold">
                      + {formatCurrency(tx.amount, "₹")}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-3 bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl p-4 text-center text-xs text-neutral-500 font-medium">
                  No transactions recorded yet.
                </div>
              )}
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
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {data?.stats ? data.stats.formattedPaymentsReceived : "₹0.00"}
              </span>
              <p className="text-[10px] font-semibold text-pink-900/70 mt-0.5">Total paid invoices value</p>
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
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {data?.stats ? data.stats.formattedPaymentsRequested : "₹0.00"}
              </span>
              <p className="text-[10px] font-semibold text-blue-900/70 mt-0.5">Pending invoice requests</p>
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
              <span className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {data?.stats ? data.stats.formattedDirectContractBilling : "₹0.00"}
              </span>
              <p className="text-[10px] font-semibold text-yellow-900/70 mt-0.5">Active agreement contract values</p>
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
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Recipient</th>
                  <th className="py-3 px-3">Amount (₹)</th>
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
                        {doc.amount ? formatCurrency(doc.amount, "₹") : "N/A"}
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
