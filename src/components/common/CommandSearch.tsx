"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Users, FolderKanban, FileText, Shield, Scale } from "lucide-react";
import Link from "next/link";
import { getClientsDB, getProjectsDB, getClausesDB, getAllDocumentsDB } from "../../app/actions";

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  type: "Client" | "Project" | "Document" | "Clause";
  url: string;
}

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      Promise.all([
        getClientsDB(),
        getProjectsDB(),
        getClausesDB(),
        getAllDocumentsDB(),
      ]).then(([clients, projects, clauses, docs]) => {
        const clientResults: SearchResultItem[] = clients.map((c) => ({
          id: c.id,
          title: c.name,
          subtitle: `${c.company || "Client"} | ${c.email}`,
          type: "Client",
          url: "/clients",
        }));

        const projectResults: SearchResultItem[] = projects.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: `Budget: ₹${p.budget.toLocaleString("en-IN")} | ${p.status}`,
          type: "Project",
          url: "/projects",
        }));

        const clauseResults: SearchResultItem[] = clauses.map((cl) => ({
          id: cl.id,
          title: cl.title,
          subtitle: cl.category,
          type: "Clause",
          url: "/clauses",
        }));

        const docResults: SearchResultItem[] = docs.map((d) => ({
          id: d.id,
          title: d.title,
          subtitle: `#${d.documentNumber} • ${d.clientName}`,
          type: "Document",
          url: "/history",
        }));

        setItems([...clientResults, ...projectResults, ...clauseResults, ...docResults]);
        setIsLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredResults = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#D5CEBC]">
          <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search clients, projects, invoices, contracts, clauses... (Press Esc to exit)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-neutral-900 placeholder-neutral-500 font-medium focus:outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-medium">Loading studio database index...</div>
          ) : filteredResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-medium">No results found for &quot;{query}&quot;</div>
          ) : (
            filteredResults.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={item.url}
                onClick={onClose}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#DFD9C9] transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-white/70 text-neutral-800 border border-[#E2DDD0]">
                    {item.type === "Client" && <Users className="w-4 h-4 text-blue-700" />}
                    {item.type === "Project" && <FolderKanban className="w-4 h-4 text-purple-700" />}
                    {item.type === "Document" && <FileText className="w-4 h-4 text-pink-700" />}
                    {item.type === "Clause" && <Scale className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 group-hover:text-pink-700 transition">{item.title}</h4>
                    <p className="text-[11px] text-neutral-600 font-medium">{item.subtitle}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#DFD9C9] group-hover:bg-[#121212] group-hover:text-white text-[10px] font-extrabold uppercase transition">
                  {item.type}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
