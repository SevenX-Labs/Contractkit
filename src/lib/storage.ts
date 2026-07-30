import { FreelancerProfile, SavedDocument } from "../types";
import { DEFAULT_PROFILE, DEFAULT_INVOICE_DATA, DEFAULT_AGREEMENT_DATA, DEFAULT_NDA_DATA } from "./constants";
import { incrementInvoiceNumber } from "./utils";

const PROFILE_KEY = "sevenx_freelancer_profile";
const INVOICE_COUNTER_KEY = "sevenx_invoice_counter";
const DOCUMENTS_HISTORY_KEY = "sevenx_documents_history";

export function getStoredProfile(): FreelancerProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : DEFAULT_PROFILE;
  } catch (err) {
    console.error("Error reading profile from localStorage", err);
    return DEFAULT_PROFILE;
  }
}

export function saveStoredProfile(profile: FreelancerProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error("Error saving profile to localStorage", err);
  }
}

export function getNextInvoiceNumber(): string {
  if (typeof window === "undefined") return "SXL-INV-001";
  try {
    const profile = getStoredProfile();
    const prefix = profile.invoicePrefix || "SXL-INV-";
    const current = localStorage.getItem(INVOICE_COUNTER_KEY);
    if (!current) return `${prefix}001`;
    return current;
  } catch (err) {
    console.error("Error getting invoice counter", err);
    return "SXL-INV-001";
  }
}

export function saveNextInvoiceNumber(invNum: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INVOICE_COUNTER_KEY, invNum);
  } catch (err) {
    console.error("Error saving invoice counter", err);
  }
}

export function autoIncrementInvoiceNumber(): string {
  const current = getNextInvoiceNumber();
  const profile = getStoredProfile();
  const next = incrementInvoiceNumber(current, profile.invoicePrefix || "SXL-INV-");
  saveNextInvoiceNumber(next);
  return next;
}

export function getSavedDocuments(): SavedDocument[] {
  if (typeof window === "undefined") return getInitialSampleDocuments();
  try {
    const data = localStorage.getItem(DOCUMENTS_HISTORY_KEY);
    if (!data) {
      const initialSamples = getInitialSampleDocuments();
      localStorage.setItem(DOCUMENTS_HISTORY_KEY, JSON.stringify(initialSamples));
      return initialSamples;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading documents from localStorage", err);
    return getInitialSampleDocuments();
  }
}

export function saveDocument(doc: SavedDocument): void {
  if (typeof window === "undefined") return;
  try {
    const list = getSavedDocuments();
    const existingIndex = list.findIndex((d) => d.id === doc.id);
    let updated: SavedDocument[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = { ...doc, updatedAt: new Date().toISOString() };
    } else {
      updated = [{ ...doc, updatedAt: new Date().toISOString() }, ...list];
    }
    localStorage.setItem(DOCUMENTS_HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Error saving document to history", err);
  }
}

export function deleteDocument(id: string): SavedDocument[] {
  if (typeof window === "undefined") return [];
  try {
    const list = getSavedDocuments();
    const filtered = list.filter((d) => d.id !== id);
    localStorage.setItem(DOCUMENTS_HISTORY_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error("Error deleting document", err);
    return [];
  }
}

function getInitialSampleDocuments(): SavedDocument[] {
  return [
    {
      id: "doc-sample-1",
      title: "Invoice - Acme Dynamics",
      documentNumber: DEFAULT_INVOICE_DATA.invoiceNumber,
      type: "invoice",
      clientName: DEFAULT_INVOICE_DATA.clientName,
      amount: DEFAULT_INVOICE_DATA.total,
      date: DEFAULT_INVOICE_DATA.invoiceDate,
      status: "sent",
      updatedAt: new Date().toISOString(),
      data: DEFAULT_INVOICE_DATA,
    },
    {
      id: "doc-sample-2",
      title: "Freelance Development Agreement - Vortex Innovations",
      documentNumber: DEFAULT_AGREEMENT_DATA.agreementNumber,
      type: "agreement",
      clientName: DEFAULT_AGREEMENT_DATA.clientName,
      amount: DEFAULT_AGREEMENT_DATA.totalAmount,
      date: DEFAULT_AGREEMENT_DATA.date,
      status: "signed",
      updatedAt: new Date().toISOString(),
      data: DEFAULT_AGREEMENT_DATA,
    },
    {
      id: "doc-sample-3",
      title: "Mutual NDA - Nexus AI Tech",
      documentNumber: DEFAULT_NDA_DATA.ndaNumber,
      type: "nda",
      clientName: DEFAULT_NDA_DATA.clientName || "Nexus AI Tech India",
      date: DEFAULT_NDA_DATA.effectiveDate,
      status: "signed",
      updatedAt: new Date().toISOString(),
      data: DEFAULT_NDA_DATA,
    },
  ];
}
