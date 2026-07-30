"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Save,
  User,
  FileText,
  Calendar,
  CheckCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { ModernCertificateTemplate } from "../../components/certificate/ModernCertificateTemplate";
import { useDocumentExport } from "../../hooks/useDocumentExport";
import { createCertificateDB, getNextCertificateNumberDB, getProfileDB } from "../actions";

export default function CertificateBuilderPage() {
  const { exportToPDF, exportToDOCX, exportToImage, isExporting } = useDocumentExport();
  const [isSaving, setIsSaving] = useState(false);
  const [isModalPreviewOpen, setIsModalPreviewOpen] = useState(false);
  const [accentColor, setAccentColor] = useState<"lime" | "purple" | "pink" | "emerald">("lime");

  const [formData, setFormData] = useState({
    certificateNumber: "SXL-CC-2026-000101",
    date: new Date().toISOString().split("T")[0],

    clientName: "ABC Pvt. Ltd.",
    clientAddress: "123, Business Park, Andheri East, Mumbai, Maharashtra - 400069",
    clientGstin: "27ABCDE5678G1Z6",

    certificationStatement:
      "This is to certify that the project described below has been successfully completed by SevenX Labs and delivered to the client as per the agreed scope, requirements, and terms of the contract.",
    projectTitle: "E-Commerce Website Development",
    serviceProvider: "SevenX Labs",
    startDate: "2026-03-15",
    completionDate: new Date().toISOString().split("T")[0],
    contractNumber: "AGR-2026-015",

    scopeOfWork:
      "Design, development, testing, and deployment of a responsive e-commerce website with admin panel and integration of payment gateway.",
    deliverables: [
      "Responsive Website",
      "Admin Panel",
      "Payment Gateway Integration",
      "Database & APIs",
      "Source Code",
      "Documentation",
    ],

    confirmationNote:
      "We hereby confirm that the above project has been completed in all respects and the deliverables have been handed over to the client. The client has reviewed and accepted the work.",

    providerSignatory: "Sahil Hode",
    providerDesignation: "Founder & Lead",
    providerDate: new Date().toISOString().split("T")[0],
    clientSignatory: "Rahul Mehta",
    clientDesignation: "Director",
    clientDate: new Date().toISOString().split("T")[0],

    phone: "+91 98765 43210",
    email: "contact@sevenxlabs.com",
    website: "www.sevenxlabs.com",
  });

  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });

  const toggleSection = (id: number) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    Promise.all([getProfileDB(), getNextCertificateNumberDB()]).then(([profile, num]) => {
      setFormData((prev) => ({
        ...prev,
        certificateNumber: num,
        serviceProvider: profile.company || "SevenX Labs",
        providerSignatory: profile.name || "Sahil Hode",
        phone: profile.phone || "+91 98765 43210",
        email: profile.email || "contact@sevenxlabs.com",
        website: profile.website || "www.sevenxlabs.com",
      }));
    });
  }, []);

  const handleSaveToDB = async () => {
    try {
      setIsSaving(true);
      const res = await createCertificateDB(formData);
      if (res.success) {
        alert(`Completion Certificate saved successfully to database! Record ID: ${res.id}`);
      } else {
        alert(`Failed to save certificate: ${res.error}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving certificate.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, "New Deliverable"],
    }));
  };

  const handleRemoveDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateDeliverable = (index: number, val: string) => {
    const updated = [...formData.deliverables];
    updated[index] = val;
    setFormData({ ...formData, deliverables: updated });
  };

  return (
    <div className="min-h-screen bg-[#F4F0E6] text-neutral-900 pb-16 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#EBE7DC]/90 backdrop-blur-md border-b border-[#E2DDD0] px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0a0a0a] text-white rounded-xl shadow-xs">
            <Award className="w-5 h-5 text-[#a6ce39]" />
          </div>
          <div>
            <h1 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              Completion Certificate Builder
              <span className="text-[10px] font-extrabold bg-[#a6ce39] text-neutral-900 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Official
              </span>
            </h1>
            <p className="text-xs text-neutral-500 font-medium">
              Create, edit, preview & export project completion certificates
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Accent Color Switcher */}
          <div className="flex items-center bg-[#DFD9C9] p-1 rounded-xl gap-1">
            {(["lime", "purple", "pink", "emerald"] as const).map((color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className={`w-6 h-6 rounded-lg transition-transform ${
                  accentColor === color ? "scale-110 ring-2 ring-neutral-900 shadow-xs" : "opacity-70 hover:opacity-100"
                } ${
                  color === "lime"
                    ? "bg-[#a6ce39]"
                    : color === "purple"
                    ? "bg-purple-600"
                    : color === "pink"
                    ? "bg-pink-600"
                    : "bg-emerald-600"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setIsModalPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#DFD9C9] hover:bg-[#D5CEBC] text-neutral-900 rounded-xl font-bold text-xs transition cursor-pointer whitespace-nowrap"
          >
            <Eye className="w-4 h-4 text-neutral-700" />
            <span>Preview</span>
          </button>

          <button
            onClick={handleSaveToDB}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0a0a0a] hover:bg-neutral-800 text-white rounded-xl font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50 whitespace-nowrap"
          >
            <Save className="w-4 h-4 text-[#a6ce39]" />
            <span>{isSaving ? "Saving..." : "Save"}</span>
          </button>

          {/* Export As Dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-[#a6ce39] hover:bg-[#95bd2f] text-neutral-900 rounded-xl font-extrabold text-xs transition shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Export As</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
            </button>

            <div className="absolute right-0 mt-1 w-44 bg-[#0a0a0a] text-white rounded-2xl p-1.5 shadow-xl border border-neutral-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50">
              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToPDF("certificate-export-container", `${formData.certificateNumber}.pdf`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export PDF</span>
                <span className="text-[10px] text-[#a6ce39]">.pdf</span>
              </button>

              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToDOCX("certificate-export-container", `${formData.certificateNumber}.docx`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export DOCX</span>
                <span className="text-[10px] text-blue-400">.docx</span>
              </button>

              <button
                onClick={async () => {
                  await handleSaveToDB();
                  exportToImage("certificate-export-container", `${formData.certificateNumber}.png`);
                }}
                disabled={isExporting}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold hover:bg-neutral-800 transition flex items-center justify-between cursor-pointer"
              >
                <span>Export PNG Image</span>
                <span className="text-[10px] text-pink-400">.png</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form Panel */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* SECTION 1: Certificate & Client Details */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(1)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-700" />
                  <span>SECTION 1: Certificate & Client Info</span>
                </div>
                {openSections[1] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[1] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Certificate #</label>
                      <input
                        type="text"
                        value={formData.certificateNumber}
                        onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono font-bold text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Client / Company Name</label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Client Address</label>
                    <input
                      type="text"
                      value={formData.clientAddress}
                      onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Client GSTIN (Optional)</label>
                    <input
                      type="text"
                      value={formData.clientGstin}
                      onChange={(e) => setFormData({ ...formData, clientGstin: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: Project Metadata */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(2)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-neutral-700" />
                  <span>SECTION 2: Project Metadata & Dates</span>
                </div>
                {openSections[2] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[2] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Project Title</label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-bold text-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Service Provider</label>
                      <input
                        type="text"
                        value={formData.serviceProvider}
                        onChange={(e) => setFormData({ ...formData, serviceProvider: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Agreement #</label>
                      <input
                        type="text"
                        value={formData.contractNumber}
                        onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs font-mono text-neutral-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Project Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Completion Date</label>
                      <input
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Scope of Work */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(3)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <span>SECTION 3: Scope of Work</span>
                {openSections[3] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[3] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <textarea
                    rows={3}
                    value={formData.scopeOfWork}
                    onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
                    className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                  />
                </div>
              )}
            </div>

            {/* SECTION 4: Deliverables Checklist */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(4)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <span>SECTION 4: Deliverables Checklist</span>
                {openSections[4] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[4] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  {formData.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => handleUpdateDeliverable(idx, e.target.value)}
                        className="flex-1 bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(idx)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddDeliverable}
                    className="flex items-center gap-1.5 text-xs font-bold text-neutral-900 bg-[#DFD9C9] hover:bg-[#D5CEBC] px-3 py-1.5 rounded-xl w-fit cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Deliverable</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 5: Confirmation & Signatures */}
            <div className="bg-[#EBE7DC] border border-[#E2DDD0] rounded-2xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleSection(5)}
                className="w-full px-5 py-3.5 flex items-center justify-between font-extrabold text-xs text-neutral-900 hover:bg-[#DFD9C9] transition cursor-pointer"
              >
                <span>SECTION 5: Confirmation & Signatories</span>
                {openSections[5] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {openSections[5] && (
                <div className="p-5 border-t border-[#D5CEBC] flex flex-col gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-neutral-600 uppercase block mb-1">Confirmation Statement</label>
                    <textarea
                      rows={2}
                      value={formData.confirmationNote}
                      onChange={(e) => setFormData({ ...formData, confirmationNote: e.target.value })}
                      className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#D5CEBC]">
                    <div>
                      <span className="text-xs font-bold text-neutral-900 block mb-2">Provider Signatory</span>
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.providerSignatory}
                        onChange={(e) => setFormData({ ...formData, providerSignatory: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900 mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Designation"
                        value={formData.providerDesignation}
                        onChange={(e) => setFormData({ ...formData, providerDesignation: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                      />
                    </div>

                    <div>
                      <span className="text-xs font-bold text-neutral-900 block mb-2">Client Signatory</span>
                      <input
                        type="text"
                        placeholder="Name"
                        value={formData.clientSignatory}
                        onChange={(e) => setFormData({ ...formData, clientSignatory: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900 mb-2"
                      />
                      <input
                        type="text"
                        placeholder="Designation"
                        value={formData.clientDesignation}
                        onChange={(e) => setFormData({ ...formData, clientDesignation: e.target.value })}
                        className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-1.5 text-xs text-neutral-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Live Preview Stage Container */}
          <div className="lg:col-span-6 flex flex-col gap-4 sticky top-20">
            <div className="flex items-center justify-between bg-[#EBE7DC] border border-[#E2DDD0] p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#a6ce39] animate-pulse" />
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
                  Live Certificate Preview
                </h3>
              </div>
            </div>

            {/* Document Stage */}
            <div className="w-full bg-[#DFD9C9] p-3 sm:p-4 rounded-3xl border border-[#D5CEBC] shadow-inner overflow-x-auto flex justify-center items-start">
              <div
                className="origin-top transition-transform duration-300 shadow-2xl rounded-2xl shrink-0"
                style={{
                  transform: "scale(0.48)",
                  width: "210mm",
                  marginBottom: "calc(-297mm * 0.52)",
                }}
              >
                <ModernCertificateTemplate
                  {...formData}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden Offscreen Container for PDF/DOCX/PNG Exports */}
      <div className="hidden">
        <div id="certificate-export-container">
          <ModernCertificateTemplate
            {...formData}
            accentColor={accentColor}
          />
        </div>
      </div>
    </div>
  );
}
