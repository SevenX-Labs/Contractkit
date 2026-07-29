"use client";

import React, { useState, useEffect } from "react";
import { getProjectsDB, updatePaymentStatusDB, deleteProjectDB } from "../actions";
import { FolderKanban, CheckCircle2, Clock, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { toast } from "sonner";

interface PaymentItem {
  id: string;
  label: string;
  amount: number;
  dueDate?: string | null;
  paidDate?: string | null;
  status: "PENDING" | "PAID" | "OVERDUE";
  note?: string | null;
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
  client?: { name: string; company?: string | null } | null;
  payments: PaymentItem[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    setIsLoading(true);
    const data = await getProjectsDB();
    setProjects(data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleMarkPaid = async (paymentId: string, label: string) => {
    const res = await updatePaymentStatusDB(paymentId, "PAID");
    if (res.success) {
      toast.success(`Marked "${label}" as PAID! Project progress updated.`);
      fetchProjects();
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

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.client && p.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.workType && p.workType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Project Milestone Tracker</h1>
            <p className="text-xs text-neutral-600 font-medium">Track project progress bars, paid vs pending milestones, and mark payments as PAID</p>
          </div>
        </div>
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
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading project tracker...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <FolderKanban className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No projects found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">Add a client in the Client CRM to auto-create projects and milestone payments!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredProjects.map((p) => {
            const totalVal = p.totalValue || p.budget || 1;
            const progressPct = Math.min(100, Math.round((p.amountPaid / totalVal) * 100));
            const isExpanded = expandedProjectId === p.id;

            return (
              <div key={p.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-neutral-900">{p.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 text-[10px] font-bold">
                        {p.workType || "Web Dev"}
                      </span>
                    </div>
                    {p.client && <p className="text-xs text-neutral-600 font-medium mt-0.5">Client: <strong>{p.client.name}</strong></p>}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 font-bold block">Paid / Total</span>
                      <span className="text-sm font-extrabold text-neutral-900 font-mono">
                        {formatCurrency(p.amountPaid, "₹")} / {formatCurrency(totalVal, "₹")}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-neutral-600">Payment Progress ({progressPct}%)</span>
                    <span className="text-pink-700">Pending: {formatCurrency(p.amountPending, "₹")}</span>
                  </div>
                  <div className="w-full bg-[#F4F0E6] h-3 rounded-full overflow-hidden border border-[#E2DDD0]">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Toggle Milestone Breakdown */}
                <div className="pt-2">
                  <button
                    onClick={() => setExpandedProjectId(isExpanded ? null : p.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-purple-700 transition"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    <span>{isExpanded ? "Hide Milestone Breakdown" : `View ${p.payments.length} Milestone Payments`}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-4 flex flex-col gap-3 bg-[#F4F0E6] p-4 rounded-2xl border border-[#E2DDD0]">
                      <h4 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider">Milestone Breakdown</h4>
                      <div className="flex flex-col gap-2">
                        {p.payments.map((pm) => (
                          <div key={pm.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#EBE7DC] border border-[#E2DDD0] gap-2">
                            <div className="flex items-center gap-3">
                              {pm.status === "PAID" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                              )}
                              <div>
                                <span className="text-xs font-bold text-neutral-900 block">{pm.label}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {pm.status === "PAID" ? `Paid on ${formatDate(pm.paidDate as any)}` : pm.dueDate ? `Due: ${formatDate(pm.dueDate as any)}` : "Pending"}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                              <span className="text-xs font-extrabold text-neutral-900 font-mono">{formatCurrency(pm.amount, "₹")}</span>
                              {pm.status !== "PAID" ? (
                                <button
                                  onClick={() => handleMarkPaid(pm.id, pm.label)}
                                  className="px-3 py-1 rounded-full bg-emerald-700 text-white text-[10px] font-extrabold shadow hover:bg-emerald-800 transition"
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
    </div>
  );
}
