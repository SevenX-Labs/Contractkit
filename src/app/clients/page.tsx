"use client";

import React, { useState, useEffect } from "react";
import { getClientsDB, createClientDB, updateClientDB, deleteClientDB } from "../actions";
import { Users, Plus, Search, Trash2, Pencil, X, FileText } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import Link from "next/link";
import { toast } from "sonner";

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  workType?: string | null;
  projectTitle?: string | null;
  projectSummary?: string | null;
  billingAddress?: string | null;
  notes?: string | null;
  status: string;
  totalValue: number;
  amountPaid: number;
  amountPending: number;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Client State
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    workType: "Web Dev",
    projectTitle: "",
    projectSummary: "",
    status: "Active",
  });

  // Create Client State (Client Info + Project Title & Passage Summary)
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    workType: "Web Dev",
    projectTitle: "",
    projectSummary: "",
  });

  const fetchClients = async () => {
    setIsLoading(true);
    const data = await getClientsDB();
    setClients(data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please enter Client Name and Email.");
      return;
    }

    const res = await createClientDB(formData);
    if (res.success) {
      toast.success(`Client "${formData.name}" created successfully!`);
      setIsModalOpen(false);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        workType: "Web Dev",
        projectTitle: "",
        projectSummary: "",
      });
      fetchClients();
    } else {
      toast.error(`Error saving client: ${res.error}`);
    }
  };

  const handleStartEdit = (client: ClientItem) => {
    setEditingClient(client);
    setEditFormData({
      name: client.name || "",
      company: client.company || "",
      email: client.email || "",
      phone: client.phone || "",
      workType: client.workType || "Web Dev",
      projectTitle: client.projectTitle || "",
      projectSummary: client.projectSummary || client.notes || "",
      status: client.status || "Active",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    if (!editFormData.name || !editFormData.email) {
      toast.error("Client Name and Email are required.");
      return;
    }

    const res = await updateClientDB(editingClient.id, editFormData);
    if (res.success) {
      toast.success(`Client "${editFormData.name}" updated successfully!`);
      setEditingClient(null);
      fetchClients();
    } else {
      toast.error(`Error updating client: ${res.error}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const res = await deleteClientDB(id);
    if (res.success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Deleted client "${name}" and all associated data.`);
    } else {
      toast.error(`Error: ${res.error}`);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.workType && c.workType.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Client Directory & CRM</h1>
            <p className="text-xs text-neutral-600 font-medium">Manage enterprise client profiles, project titles, project summary scope passages, and earnings</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-pink-400" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] p-3 rounded-2xl">
        <Search className="w-4 h-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search by client name, company, email, or work type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full px-4 py-2 text-xs text-neutral-900 focus:outline-none"
        />
      </div>

      {/* Client Table */}
      <div className="rounded-3xl bg-[#EBE7DC] border border-[#E2DDD0] p-6 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading client directory...</div>
        ) : filteredClients.length === 0 ? (
          <div className="py-16 text-center p-8 flex flex-col items-center gap-3">
            <Users className="w-10 h-10 text-neutral-400" />
            <h3 className="text-sm font-bold text-neutral-800">No client records found</h3>
            <p className="text-xs text-neutral-500 max-w-sm">Add a client profile to manage client information and assign projects in the Project Hub!</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow cursor-pointer"
            >
              + Add Client
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-900">
              <thead className="text-neutral-500 uppercase tracking-wider text-[10px] border-b border-[#D5CEBC]">
                <tr>
                  <th className="py-3.5 px-4">Name / Email</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Work Type</th>
                  <th className="py-3.5 px-4">Project Title</th>
                  <th className="py-3.5 px-4">Total Value</th>
                  <th className="py-3.5 px-4">Paid</th>
                  <th className="py-3.5 px-4">Pending</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DDD0]">
                {filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-[#DFD9C9]/50 transition">
                    <td className="py-4 px-4">
                      <div className="font-extrabold text-neutral-900">{c.name}</div>
                      <div className="text-[11px] text-neutral-600 font-medium">{c.email}</div>
                    </td>
                    <td className="py-4 px-4 font-bold text-neutral-800">
                      {c.company || "Individual"}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#DFD9C9] text-neutral-900">
                        {c.workType || "Web Dev"}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-neutral-800 max-w-[150px] truncate">
                      {c.projectTitle || "Not set"}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-neutral-900">
                      {formatCurrency(c.totalValue, "₹")}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-emerald-700">
                      {formatCurrency(c.amountPaid, "₹")}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-pink-700">
                      {formatCurrency(c.amountPending, "₹")}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.status === "On Hold"
                          ? "bg-amber-200 text-amber-900"
                          : c.amountPending === 0 && c.totalValue > 0
                          ? "bg-emerald-200 text-emerald-900"
                          : "bg-purple-200 text-purple-900"
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(c)}
                          className="p-1.5 rounded-full bg-blue-100 text-blue-900 hover:bg-blue-200 transition cursor-pointer"
                          title="Edit Client Details"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <Link
                          href={`/projects`}
                          className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition cursor-pointer"
                          title="View Projects & Milestones"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.name)}
                          className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition cursor-pointer"
                          title="Delete Client & All Related Data"
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

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-neutral-900">Add New Client & Project Summary</h3>
                <p className="text-[11px] text-neutral-500 font-medium">Add client profile, project title, and passage scope summary.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vishal Aggarwal"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="e.g. YF Advisors"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="vishal@yfadvisors.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Work Type Category</label>
                <select
                  value={formData.workType}
                  onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                >
                  <option value="Web Dev">Web Development</option>
                  <option value="App Dev">Mobile App Dev</option>
                  <option value="Automation">Automation Platform</option>
                  <option value="AI Agent">AI Solutions / Agents</option>
                  <option value="UI/UX">UI/UX Design</option>
                  <option value="SEO">SEO & Growth</option>
                  <option value="E-Commerce">E-Commerce Store</option>
                  <option value="Other">Other Consultancy</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  placeholder="e.g. E-Commerce Store & Web App"
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Summary (Passage / Scope Notes)</label>
                <textarea
                  rows={3}
                  placeholder="Write a passage summarizing the project scope, key features, tech stack, and client requirements..."
                  value={formData.projectSummary}
                  onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full bg-[#DFD9C9] text-xs font-bold text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#121212] text-white text-xs font-bold hover:bg-neutral-800 transition cursor-pointer"
                >
                  Save Client Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Client Modal */}
      {editingClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4 my-auto">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <div className="flex items-center gap-2">
                <Pencil className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-extrabold text-neutral-900">Edit Client Information</h3>
              </div>
              <button onClick={() => setEditingClient(null)} className="p-1 text-neutral-500 hover:text-neutral-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company</label>
                  <input
                    type="text"
                    value={editFormData.company}
                    onChange={(e) => setEditFormData({ ...editFormData, company: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Work Type</label>
                  <select
                    value={editFormData.workType}
                    onChange={(e) => setEditFormData({ ...editFormData, workType: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  >
                    <option value="Web Dev">Web Development</option>
                    <option value="App Dev">Mobile App Dev</option>
                    <option value="Automation">Automation Platform</option>
                    <option value="AI Agent">AI Solutions / Agents</option>
                    <option value="UI/UX">UI/UX Design</option>
                    <option value="SEO">SEO & Growth</option>
                    <option value="E-Commerce">E-Commerce Store</option>
                    <option value="Other">Other Consultancy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Client Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                  >
                    <option value="Active">Active</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={editFormData.projectTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, projectTitle: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Project Summary (Passage / Scope Notes)</label>
                <textarea
                  rows={3}
                  value={editFormData.projectSummary}
                  onChange={(e) => setEditFormData({ ...editFormData, projectSummary: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 mt-3">
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="px-4 py-2 rounded-full bg-[#DFD9C9] text-xs font-bold text-neutral-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition cursor-pointer shadow-md"
                >
                  Save Client Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
