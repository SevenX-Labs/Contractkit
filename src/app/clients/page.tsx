"use client";

import React, { useState, useEffect } from "react";
import { getClientsDB, createClientDB, deleteClientDB } from "../actions";
import { Users, Plus, Search, Trash2, Building, Mail, Phone, Globe, MapPin, X, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ClientItem {
  id: string;
  name: string;
  company?: string | null;
  designation?: string | null;
  email: string;
  phone?: string | null;
  gstNo?: string | null;
  taxNo?: string | null;
  website?: string | null;
  billingAddress?: string | null;
  shippingAddress?: string | null;
  notes?: string | null;
  tags: string[];
  status: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    designation: "CTO / Director",
    email: "",
    phone: "",
    gstNo: "",
    website: "",
    billingAddress: "",
    notes: "",
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
      toast.success(`Client "${formData.name}" saved to CRM!`);
      setIsModalOpen(false);
      setFormData({
        name: "",
        company: "",
        designation: "CTO / Director",
        email: "",
        phone: "",
        gstNo: "",
        website: "",
        billingAddress: "",
        notes: "",
      });
      fetchClients();
    } else {
      toast.error(`Error saving client: ${res.error}`);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const res = await deleteClientDB(id);
    if (res.success) {
      setClients((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Deleted client "${name}"`);
    } else {
      toast.error(`Error: ${res.error}`);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Client CRM & Directory</h1>
            <p className="text-xs text-neutral-600 font-medium">Manage reusable client profiles, tax info, and direct document generation</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4 text-pink-400" />
          <span>Add New Client</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#EBE7DC] border border-[#E2DDD0] p-3 rounded-2xl">
        <Search className="w-4 h-4 text-neutral-500 ml-2" />
        <input
          type="text"
          placeholder="Search by client name, company, email, or GST number..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full px-4 py-2 text-xs text-neutral-900 focus:outline-none"
        />
      </div>

      {/* Clients Cards Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading client directory...</div>
      ) : filteredClients.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <Users className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No client profiles found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">
            Add your enterprise clients to auto-fill contract, agreement, and invoice forms in 1-click!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#121212] text-white text-xs font-bold shadow"
          >
            + Add First Client
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((c) => (
            <div key={c.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-neutral-900">{c.name}</h3>
                    <p className="text-xs text-neutral-600 font-medium">{c.company || "Individual Client"}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                    {c.status}
                  </span>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-xs text-neutral-700 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{c.email}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  {c.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-neutral-500" />
                      <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">
                        {c.website}
                      </a>
                    </div>
                  )}
                  {c.gstNo && (
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <Building className="w-3.5 h-3.5 text-neutral-500" />
                      <span>GST: {c.gstNo}</span>
                    </div>
                  )}
                  {c.billingAddress && (
                    <div className="flex items-start gap-2 text-[11px] text-neutral-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{c.billingAddress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-[#D5CEBC] flex items-center justify-between">
                <Link
                  href={`/invoice?client=${encodeURIComponent(c.name)}`}
                  className="flex items-center gap-1 text-xs font-bold text-neutral-900 hover:text-pink-700 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-pink-600" />
                  <span>Create Invoice</span>
                </Link>

                <button
                  onClick={() => handleDelete(c.id, c.name)}
                  className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                  title="Delete Client"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <h3 className="text-base font-extrabold text-neutral-900">Add New Client to CRM</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">GST Number</label>
                  <input
                    type="text"
                    placeholder="29AAAAA0000A1Z5"
                    value={formData.gstNo}
                    onChange={(e) => setFormData({ ...formData, gstNo: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">Website URL</label>
                  <input
                    type="text"
                    placeholder="acme.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Full Billing Address</label>
                <textarea
                  rows={2}
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                />
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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
