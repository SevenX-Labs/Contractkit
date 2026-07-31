"use client";

import React, { useState, useEffect } from "react";
import { getProfileDB, saveProfileDB } from "../actions";
import { FreelancerProfile } from "../../types";
import { Settings as SettingsIcon, Save, Building, CreditCard, Sparkles, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [profile, setProfile] = useState<FreelancerProfile>({
    name: "SevenX Labs",
    company: "SevenX Labs Studio",
    email: "hello@sevenxlabs.com",
    phone: "+91 8652601566",
    address: "Thane, Mumbai, Maharashtra, India",
    upiId: "sevenxlabs@upi",
    bankName: "HDFC Bank",
    bankAccount: "50100234567890",
    bankIfsc: "HDFC0001234",
    paypalEmail: "hello@sevenxlabs.com",
    invoicePrefix: "SXL-INV-",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfileDB().then((prof) => setProfile(prof));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const res = await saveProfileDB(profile);
    setIsSaving(false);

    if (res.success) {
      toast.success("Studio settings saved to Prisma Database! All new forms will auto-fill with these details.");
    } else {
      toast.error(`Error saving settings to database: ${res.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#EBE7DC] border border-[#E2DDD0] p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-purple-100 text-purple-700">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-neutral-900 tracking-tight">Studio Settings</h1>
            <p className="text-xs text-neutral-600 font-medium">Manage your reusable freelancer details saved in Prisma Database</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] text-white font-bold text-xs shadow-md hover:bg-neutral-800 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving to DB..." : "Save Defaults"}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-7 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-700" />
            <span>Freelancer & Studio Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Your Name / Studio Name *</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Legal Company Name</label>
              <input
                type="text"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Email Address *</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-neutral-700 block mb-1">Full Studio Address</label>
            <textarea
              rows={3}
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3 py-2 text-xs text-neutral-900 font-medium focus:outline-none resize-none"
            />
          </div>

          <hr className="border-[#D5CEBC]" />

          {/* Invoice Counter Settings */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-700" />
              <span>Invoice Prefix Settings</span>
            </h3>
            <div className="w-full sm:w-1/2">
              <label className="text-xs font-bold text-neutral-700 block mb-1">Invoice Prefix</label>
              <input
                type="text"
                value={profile.invoicePrefix}
                onChange={(e) => setProfile({ ...profile, invoicePrefix: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2 text-xs text-neutral-900 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-5 flex flex-col gap-6 bg-[#EBE7DC] border border-[#E2DDD0] p-6 md:p-8 rounded-3xl shadow-sm">
          <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-700" />
            <span>Default Payment Details</span>
          </h3>

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="e.g. sevenxlabs@upi"
                value={profile.upiId}
                onChange={(e) => setProfile({ ...profile, upiId: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Bank Name</label>
              <input
                type="text"
                placeholder="Bank Name"
                value={profile.bankName}
                onChange={(e) => setProfile({ ...profile, bankName: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">Bank Account Number</label>
              <input
                type="text"
                placeholder="Account Number"
                value={profile.bankAccount}
                onChange={(e) => setProfile({ ...profile, bankAccount: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">IFSC / SWIFT Code</label>
              <input
                type="text"
                placeholder="IFSC Code"
                value={profile.bankIfsc}
                onChange={(e) => setProfile({ ...profile, bankIfsc: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">PayPal Email</label>
              <input
                type="email"
                placeholder="billing@sevenxlabs.com"
                value={profile.paypalEmail}
                onChange={(e) => setProfile({ ...profile, paypalEmail: e.target.value })}
                className="w-full bg-[#F4F0E6] border border-[#E2DDD0] rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-purple-100 border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
            <p>Saving these details automatically populates all new Invoice, Agreement, and NDA forms across your studio workflow.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
