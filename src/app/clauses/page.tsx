"use client";

import React, { useState, useEffect } from "react";
import { getClausesDB, createClauseDB, deleteClauseDB } from "../actions";
import { Scale, Plus, Search, Trash2, Copy, Check, Shield, BookOpen, X } from "lucide-react";
import { toast } from "sonner";

interface ClauseItem {
  id: string;
  category: string;
  title: string;
  content: string;
  isCustom: boolean;
}

export default function ClausesPage() {
  const [clauses, setClauses] = useState<ClauseItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    category: "Payment Terms",
    title: "",
    content: "",
  });

  const fetchClauses = async () => {
    setIsLoading(true);
    const data = await getClausesDB();
    setClauses(data as any);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClauses();
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Clause copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("Please enter Clause Title and Content.");
      return;
    }

    const res = await createClauseDB(formData);
    if (res.success) {
      toast.success(`Clause "${formData.title}" added to Legal Library!`);
      setIsModalOpen(false);
      setFormData({ category: "Payment Terms", title: "", content: "" });
      fetchClauses();
    } else {
      toast.error(`Error saving clause: ${res.error}`);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const res = await deleteClauseDB(id);
    if (res.success) {
      setClauses((prev) => prev.filter((c) => c.id !== id));
      toast.success(`Deleted clause "${title}"`);
    } else {
      toast.error(`Error: ${res.error}`);
    }
  };

  const categories = ["all", ...Array.from(new Set(clauses.map((c) => c.category)))];

  const filteredClauses = clauses.filter((c) => {
    const matchesCategory = activeCategory === "all" || c.category === activeCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Legal Clause Library</h1>
            <p className="text-xs text-neutral-600 font-medium">Re-usable legal clauses for IP ownership, payment terms, warranties & SLAs</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Custom Clause</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize whitespace-nowrap transition ${
                activeCategory === cat
                  ? "bg-[#121212] text-white shadow"
                  : "bg-[#DFD9C9] text-neutral-800 hover:bg-[#D5CEBC]"
              }`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search clause library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-full pl-9 pr-3 py-1.5 text-xs text-neutral-900 focus:outline-none"
          />
        </div>
      </div>

      {/* Clauses Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-neutral-500 font-medium">Loading legal clause library...</div>
      ) : filteredClauses.length === 0 ? (
        <div className="py-16 bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl text-center p-8 flex flex-col items-center gap-3">
          <BookOpen className="w-10 h-10 text-neutral-400" />
          <h3 className="text-sm font-bold text-neutral-800">No clauses found</h3>
          <p className="text-xs text-neutral-500 max-w-sm">Add legal clauses to quickly insert payment terms, warranties, and IP transfer terms into your agreements!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClauses.map((c) => (
            <div key={c.id} className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-extrabold uppercase">
                    {c.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(c.id, c.content)}
                      className="p-1.5 rounded-full bg-[#DFD9C9] text-neutral-800 hover:bg-[#121212] hover:text-white transition"
                      title="Copy Clause"
                    >
                      {copiedId === c.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {c.isCustom && (
                      <button
                        onClick={() => handleDelete(c.id, c.title)}
                        className="p-1.5 rounded-full bg-pink-100 text-pink-800 hover:bg-pink-200 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="text-sm font-extrabold text-neutral-900 mt-3">{c.title}</h3>
                <p className="text-xs text-neutral-700 mt-2 bg-[#F4F0E6] p-3 rounded-2xl border border-[#E2DDD0] font-mono leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Clause Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#D5CEBC] pb-3">
              <h3 className="text-base font-extrabold text-neutral-900">Add Custom Legal Clause</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-500 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Clause Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                >
                  <option value="Payment Terms">Payment Terms</option>
                  <option value="Source Code Ownership">Source Code Ownership</option>
                  <option value="Warranty & Support">Warranty & Support</option>
                  <option value="Revision Policy">Revision Policy</option>
                  <option value="Confidentiality">Confidentiality</option>
                  <option value="SLA & Response Time">SLA & Response Time</option>
                  <option value="Jurisdiction & Legal">Jurisdiction & Legal</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Clause Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 60-Day Extended Technical Support"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">Clause Content & Text *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Exact legal language of the clause..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-mono resize-none"
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
                  Save Clause
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
