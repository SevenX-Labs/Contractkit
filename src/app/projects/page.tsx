"use client";

import React, { useState, useEffect } from "react";
import { getProjectsDB, createProjectDB, deleteProjectDB, getClientsDB } from "../actions";
import { FolderKanban, Plus, Search, Trash2, Calendar, IndianRupee, User, X, FileText } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface ProjectItem {
  id: string;
  name: string;
  description?: string | null;
  budget: number;
  status: string;
  startDate?: string | null;
  deliveryDate?: string | null;
  client?: { name: string; company?: string | null } | null;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [clients, setClients] = useState<Array<{ id: string; name: string }>>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: 250000,
    status: "In Progress",
    startDate: new Date().toISOString().split("T")[0],
    deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    clientId: "",
  });

  const fetchData = async () => {
    setIsLoading(true);
    const [projData, clientData] = await Promise.all([getProjectsDB(), getClientsDB()]);
    setProjects(projData as any);
    setClients(clientData as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error("Please enter Project Name.");
      return;
    }

    const res = await createProjectDB(formData);
    if (res.success) {
      toast.success(`Project "${formData.name}" created!`);
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        budget: 250000,
        status: "In Progress",
        startDate: new Date().toISOString().split("T")[0],
        deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        clientId: "",
      });
      fetchData();
    } else {
      toast.error(`Error: ${res.error}`);
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
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
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
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Project Management</h1>
            <p className="text-xs text-neutral-600 font-medium">Track studio projects, milestone budgets, client links, and contract statuses</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4 text-[#FEF08A]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] p-3 rounded-2xl">
        <Search className="w-4 h-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search projects by title or scope description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full px-4 py-2 text-xs text-neutral-900 focus:outline-none"
        />
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading project dashboard...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <FolderKanban className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No active projects</h3>
          <p className="text-xs text-neutral-500 max-w-sm">Create a project to link invoices, agreements, and milestones to client accounts!</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow"
          >
            + Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900">{p.name}</h3>
                    {p.client && <p className="text-xs text-neutral-600 font-medium mt-0.5">Client: {p.client.name}</p>}
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-200 text-purple-900 text-[10px] font-bold uppercase">
                    {p.status}
                  </span>
                </div>

                {p.description && (
                  <p className="text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">{p.description}</p>
                )}

                <div className="mt-4 flex flex-col gap-2 text-xs text-neutral-800">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-neutral-500 text-[11px]">Total Budget:</span>
                    <span className="text-neutral-900">{formatCurrency(p.budget, "₹")}</span>
                  </div>
                  {p.startDate && (
                    <div className="flex items-center justify-between text-[11px] text-neutral-600">
                      <span>Timeline:</span>
                      <span className="font-mono">{formatDate(p.startDate as any)} → {p.deliveryDate ? formatDate(p.deliveryDate as any) : "TBD"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D5CEBC] flex items-center justify-between">
                <Link
                  href={`/agreement?title=${encodeURIComponent(p.name)}`}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-purple-700 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Draft Contract</span>
                </Link>

                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <h3 className="text-base font-extrabold text-neutral-900">Create New Project</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js SaaS Platform & Mobile App"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Description & Scope</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Budget (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Assign Client</label>
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  >
                    <option value="">No Client Assigned</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Delivery Deadline</label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#DFD9C9] text-xs font-bold text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#121212] text-white text-xs font-bold hover:bg-neutral-800 transition"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
