"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck,
  IndianRupee,
  Users,
  FolderKanban,
  FileText,
  Clock,
  TrendingUp,
  CreditCard,
  Plus,
  RefreshCw,
  Eye,
  X,
  Download,
} from "lucide-react";
import { updatePaymentStatusDB } from "./actions";
import { formatCurrency, formatDate } from "../lib/utils";
import { useDocumentExport } from "../hooks/useDocumentExport";
import { toast } from "sonner";

interface DashboardData {
  stats: {
    totalEarnings: number;
    formattedTotalEarnings: string;
    totalPending: number;
    formattedTotalPending: string;
    totalProjects: number;
    totalClients: number;
    thisMonthEarnings: number;
    formattedThisMonthEarnings: string;
    totalExpenses: number;
    formattedTotalExpenses: string;
    profit: number;
    formattedProfit: string;
    totalDocuments: number;
  };
  recentPayments: Array<{
    id: string;
    clientName: string;
    projectName: string;
    label: string;
    amount: number;
    formattedAmount: string;
    status: "PAID" | "PENDING" | "OVERDUE";
    date: string;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
  const { exportToPDF } = useDocumentExport();

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleMarkPaid = async (paymentId: string, label: string) => {
    const res = await updatePaymentStatusDB(paymentId, "PAID");
    if (res.success) {
      toast.success(`Marked "${label}" as PAID! Earnings & profit updated.`);
      fetchDashboardData();
    } else {
      toast.error(`Error updating payment: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Client Work & Profit Tracker
          </h1>
          <p className="text-xs text-neutral-600 mt-1 font-medium">
            Real-time earnings, pending milestones, expenses, and net profit in Indian Rupees (₹)
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
            href="/clients"
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow-md hover:bg-neutral-800 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-pink-400" />
            <span>Add Client & Work</span>
          </Link>
        </div>
      </div>

      {/* Top 5 Metric Cards (with Skeleton Loader) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm animate-pulse h-28 flex flex-col justify-between">
              <div className="w-20 h-4 bg-[#DFD9C9] rounded" />
              <div className="w-28 h-7 bg-[#DFD9C9] rounded" />
            </div>
          ))
        ) : (
          <>
            {/* Total Earnings */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Earnings</span>
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {data?.stats ? data.stats.formattedTotalEarnings : "₹0.00"}
                </span>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Sum of all PAID payments</p>
              </div>
            </div>

            {/* Total Pending */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">Total Pending</span>
                <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {data?.stats ? data.stats.formattedTotalPending : "₹0.00"}
                </span>
                <p className="text-[10px] text-pink-700 font-semibold mt-0.5">Sum of pending milestones</p>
              </div>
            </div>

            {/* Total Projects */}
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
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">Active work contracts</p>
              </div>
            </div>

            {/* This Month Earnings */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">This Month</span>
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-extrabold text-neutral-900">
                  {data?.stats ? data.stats.formattedThisMonthEarnings : "₹0.00"}
                </span>
                <p className="text-[10px] text-blue-700 font-semibold mt-0.5">Received this month</p>
              </div>
            </div>

            {/* Net Profit */}
            <div className="col-span-2 sm:col-span-1 bg-[#FEF08A] text-[#713F12] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider">Net Profit</span>
                <div className="p-2 rounded-xl bg-white/60 text-[#713F12]">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {data?.stats ? data.stats.formattedProfit : "₹0.00"}
                </span>
                <p className="text-[10px] font-bold opacity-80 mt-0.5">Earnings minus Expenses</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payment Milestones Breakdown Table */}
      <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-neutral-900">Project Payment Milestones</h3>
            <p className="text-xs text-neutral-600">Click &quot;Mark PAID&quot; to update project earnings and profit calculation</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-900">
            <thead className="text-neutral-500 uppercase tracking-wider text-[10px] border-b border-[#D5CEBC]">
              <tr>
                <th className="py-3 px-3">Client / Project</th>
                <th className="py-3 px-3">Milestone Label</th>
                <th className="py-3 px-3">Amount (₹)</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DDD0]">
              {isLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-4 px-3">
                      <div className="w-full h-4 bg-[#DFD9C9] rounded" />
                    </td>
                  </tr>
                ))
              ) : !data?.recentPayments || data.recentPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500 font-medium">
                    No milestone payments recorded yet. Add a client in Client CRM to generate payment milestones!
                  </td>
                </tr>
              ) : (
                data.recentPayments.map((pm) => (
                  <tr key={pm.id} className="hover:bg-[#DFD9C9]/50 transition">
                    <td className="py-3.5 px-3 font-bold text-neutral-900">
                      <div>{pm.clientName}</div>
                      <div className="text-[10px] text-neutral-500 font-normal">{pm.projectName}</div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-neutral-800">
                      {pm.label}
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-neutral-900 font-mono">
                      {formatCurrency(pm.amount, "₹")}
                    </td>
                    <td className="py-3.5 px-3 text-neutral-600 font-mono">
                      {pm.date}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        pm.status === "PAID"
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-pink-200 text-pink-900"
                      }`}>
                        {pm.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewDoc(pm)}
                          className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition"
                          title="Preview Document Receipt"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {pm.status !== "PAID" && (
                          <button
                            onClick={() => handleMarkPaid(pm.id, pm.label)}
                            className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold shadow hover:bg-emerald-800 transition"
                          >
                            Mark PAID
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Printable A4 Document Preview Screen Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-4xl w-full shadow-2xl flex flex-col gap-4 my-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Live Floating Document Preview</h3>
                <p className="text-xs text-neutral-600 font-mono">Milestone: {previewDoc.label} ({previewDoc.clientName})</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => exportToPDF("floating-preview-doc", `Receipt-${previewDoc.id}.pdf`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow hover:bg-neutral-800 transition"
                >
                  <Download className="w-3.5 h-3.5 text-pink-400" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-neutral-900 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* A4 Document Preview Card */}
            <div className="overflow-y-auto p-4 bg-neutral-950/20 rounded-2xl flex justify-center">
              <div
                id="floating-preview-doc"
                className="w-[210mm] min-h-[297mm] bg-white text-neutral-900 p-10 shadow-2xl rounded-xl flex flex-col justify-between"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                <div>
                  <div className="border-b-2 border-neutral-900 pb-4 mb-6 flex justify-between items-end">
                    <div>
                      <h1 className="text-xl font-bold tracking-tight text-neutral-900 uppercase">
                        SEVENX LABS STUDIO
                      </h1>
                      <p className="text-xs text-neutral-500 mt-1 font-mono">PAYMENT RECEIPT & MILESTONE ACKNOWLEDGMENT</p>
                    </div>
                    <div className="text-right text-xs text-neutral-600">
                      <p>Date: {previewDoc.date}</p>
                      <p className="font-mono mt-0.5">Status: {previewDoc.status}</p>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-800 leading-relaxed mb-6 bg-neutral-50 p-4 rounded border border-neutral-100">
                    <p className="font-bold text-neutral-900 text-sm mb-1">CLIENT / RECIPIENT:</p>
                    <p className="text-sm font-extrabold text-neutral-900">{previewDoc.clientName}</p>
                    <p className="text-neutral-600 mt-0.5">Project: {previewDoc.projectName}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1 mb-2">
                      MILESTONE BREAKDOWN
                    </h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-neutral-300 font-bold uppercase text-[10px] text-neutral-500">
                          <th className="py-2">Milestone Description</th>
                          <th className="py-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-neutral-200">
                          <td className="py-3 font-bold text-neutral-900">{previewDoc.label}</td>
                          <td className="py-3 text-right font-mono font-extrabold text-neutral-900">{formatCurrency(previewDoc.amount, "₹")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-neutral-100 rounded text-xs text-neutral-700">
                    <p>Total Payment Amount: <strong className="text-neutral-900 text-sm">{formatCurrency(previewDoc.amount, "₹")}</strong></p>
                    <p className="text-[11px] text-neutral-500 mt-1">This official document certifies the recorded milestone payment status for SevenX Labs.</p>
                  </div>
                </div>

                <div className="border-t border-neutral-300 pt-4 text-center text-[10px] text-neutral-400">
                  <p>SevenX Labs Freelance Tech Studio • India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
