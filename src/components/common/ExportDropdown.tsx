"use client";

import React, { useState, useRef, useEffect } from "react";
import { Download, FileText, Image as ImageIcon, ChevronDown } from "lucide-react";

interface ExportDropdownProps {
  onExportPDF: () => void;
  onExportDOCX: () => void;
  onExportPNG: () => void;
  isExporting?: boolean;
}

export function ExportDropdown({
  onExportPDF,
  onExportDOCX,
  onExportPNG,
  isExporting = false,
}: ExportDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#a6ce39] hover:bg-[#95bd2f] text-neutral-900 font-extrabold text-xs shadow-sm transition cursor-pointer disabled:opacity-50 whitespace-nowrap"
      >
        <Download className="w-4 h-4 text-neutral-900" />
        <span>{isExporting ? "Exporting..." : "Export As"}</span>
        <ChevronDown className="w-3.5 h-3.5 text-neutral-900" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#EBE7DC] border border-[#E2DDD0] shadow-2xl py-2 z-50 overflow-hidden flex flex-col gap-1">
          <button
            onClick={() => {
              setIsOpen(false);
              onExportPDF();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-900 hover:bg-[#DFD9C9] transition flex items-center gap-2.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-pink-600 shrink-0" />
            <span>Download PDF (.pdf)</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onExportDOCX();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-900 hover:bg-[#DFD9C9] transition flex items-center gap-2.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Download Word (.docx)</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onExportPNG();
            }}
            className="w-full text-left px-4 py-2.5 text-xs font-bold text-neutral-900 hover:bg-[#DFD9C9] transition flex items-center gap-2.5 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4 text-purple-600 shrink-0" />
            <span>Download Image (.png)</span>
          </button>
        </div>
      )}
    </div>
  );
}
