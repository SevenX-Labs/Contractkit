"use server";

import prisma from "../lib/prisma";
import { InvoiceData, AgreementData, NDAData, FreelancerProfile, SavedDocument } from "../types";
import { revalidatePath } from "next/cache";

// ==================== PROFILE / SETTINGS ====================
export async function getProfileDB(): Promise<FreelancerProfile> {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      const defaultProf = await prisma.profile.create({
        data: {
          name: "SevenX Labs",
          company: "SevenX Labs Studio",
          email: "hello@sevenxlabs.com",
          phone: "+91 98765 43210",
          address: "SevenX Labs Tech Park, HSR Layout, Sector 1, Bengaluru, KA 560102",
          upiId: "sevenxlabs@upi",
          bankName: "HDFC Bank",
          bankAccount: "50100234567890",
          bankIfsc: "HDFC0001234",
          paypalEmail: "billing@sevenxlabs.com",
          invoicePrefix: "SXL-INV-",
          currency: "₹",
        },
      });
      return {
        name: defaultProf.name,
        company: defaultProf.company || "",
        email: defaultProf.email,
        phone: defaultProf.phone || "",
        address: defaultProf.address || "",
        upiId: defaultProf.upiId || "",
        bankName: defaultProf.bankName || "",
        bankAccount: defaultProf.bankAccount || "",
        bankIfsc: defaultProf.bankIfsc || "",
        paypalEmail: defaultProf.paypalEmail || "",
        invoicePrefix: defaultProf.invoicePrefix || "SXL-INV-",
      };
    }

    return {
      name: profile.name,
      company: profile.company || "",
      email: profile.email,
      phone: profile.phone || "",
      address: profile.address || "",
      upiId: profile.upiId || "",
      bankName: profile.bankName || "",
      bankAccount: profile.bankAccount || "",
      bankIfsc: profile.bankIfsc || "",
      paypalEmail: profile.paypalEmail || "",
      invoicePrefix: profile.invoicePrefix || "SXL-INV-",
    };
  } catch (err) {
    console.error("Error fetching profile:", err);
    return {
      name: "SevenX Labs",
      company: "SevenX Labs Studio",
      email: "hello@sevenxlabs.com",
      phone: "+91 98765 43210",
      address: "SevenX Labs Tech Park, HSR Layout, Sector 1, Bengaluru, KA 560102",
      upiId: "sevenxlabs@upi",
      bankName: "HDFC Bank",
      bankAccount: "50100234567890",
      bankIfsc: "HDFC0001234",
      paypalEmail: "billing@sevenxlabs.com",
      invoicePrefix: "SXL-INV-",
    };
  }
}

export async function saveProfileDB(data: FreelancerProfile) {
  try {
    const existing = await prisma.profile.findFirst();
    if (existing) {
      await prisma.profile.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          address: data.address,
          upiId: data.upiId,
          bankName: data.bankName,
          bankAccount: data.bankAccount,
          bankIfsc: data.bankIfsc,
          paypalEmail: data.paypalEmail,
          invoicePrefix: data.invoicePrefix,
        },
      });
    } else {
      await prisma.profile.create({
        data: {
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          address: data.address,
          upiId: data.upiId,
          bankName: data.bankName,
          bankAccount: data.bankAccount,
          bankIfsc: data.bankIfsc,
          paypalEmail: data.paypalEmail,
          invoicePrefix: data.invoicePrefix,
        },
      });
    }
    revalidatePath("/settings");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==================== CLIENT CRM ACTIONS ====================
export async function getClientsDB() {
  try {
    const clients = await prisma.client.findMany({
      include: { projects: true, documents: true },
      orderBy: { createdAt: "desc" },
    });
    return clients;
  } catch (err) {
    console.error("Error fetching clients:", err);
    return [];
  }
}

export async function createClientDB(data: {
  name: string;
  company?: string;
  designation?: string;
  email: string;
  phone?: string;
  gstNo?: string;
  taxNo?: string;
  website?: string;
  billingAddress?: string;
  shippingAddress?: string;
  notes?: string;
  tags?: string[];
  status?: string;
}) {
  try {
    const client = await prisma.client.create({
      data: {
        name: data.name,
        company: data.company,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        gstNo: data.gstNo,
        taxNo: data.taxNo,
        website: data.website,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        tags: data.tags || ["Enterprise"],
        status: data.status || "Active",
      },
    });
    revalidatePath("/clients");
    return { success: true, client };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteClientDB(id: string) {
  try {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/clients");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==================== PROJECT MANAGEMENT ACTIONS ====================
export async function getProjectsDB() {
  try {
    const projects = await prisma.project.findMany({
      include: { client: true, documents: true },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (err) {
    console.error("Error fetching projects:", err);
    return [];
  }
}

export async function createProjectDB(data: {
  name: string;
  description?: string;
  budget?: number;
  status?: string;
  startDate?: string;
  deliveryDate?: string;
  clientId?: string;
}) {
  try {
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        budget: data.budget || 0,
        status: data.status || "In Progress",
        startDate: data.startDate ? new Date(data.startDate) : null,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : null,
        clientId: data.clientId || null,
      },
    });
    revalidatePath("/projects");
    return { success: true, project };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteProjectDB(id: string) {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==================== LEGAL CLAUSE LIBRARY ACTIONS ====================
export async function getClausesDB() {
  try {
    const clauses = await prisma.clause.findMany({
      orderBy: { category: "asc" },
    });

    if (clauses.length === 0) {
      // Seed default professional legal clauses
      const defaultClauses = [
        {
          category: "Payment Terms",
          title: "Standard 50/50 Payment Schedule",
          content: "50% advance deposit required prior to project kickoff. Remaining 50% balance due upon final project delivery and client sign-off.",
        },
        {
          category: "Payment Terms",
          title: "Late Payment Interest (2%/month)",
          content: "Invoices unpaid past 14 calendar days shall accrue late penalty interest at 2% per month calculated daily.",
        },
        {
          category: "Source Code Ownership",
          title: "Full Intellectual Property Transfer",
          content: "Full copyright, source code ownership, and patent rights shall be transferred to the Client upon 100% receipt of full agreed project fee.",
        },
        {
          category: "Warranty & Support",
          title: "30-Day Post Launch Bug Fix Guarantee",
          content: "SevenX Labs provides 30 calendar days of free warranty coverage for any technical defects or software bugs directly attributable to original specifications.",
        },
        {
          category: "Revision Policy",
          title: "3 Round Design Revision Cap",
          content: "Project scope includes up to 3 major revision cycles per milestone. Additional requested revisions shall be billed at ₹2,500/hour.",
        },
        {
          category: "Confidentiality",
          title: "Mutual NDA & Non-Solicitation",
          content: "Both parties agree to hold all technical blueprints, customer data, and business strategies in strict confidence for 2 years.",
        },
      ];

      for (const cl of defaultClauses) {
        await prisma.clause.create({ data: cl });
      }

      return await prisma.clause.findMany({ orderBy: { category: "asc" } });
    }

    return clauses;
  } catch (err) {
    console.error("Error fetching clauses:", err);
    return [];
  }
}

export async function createClauseDB(data: { category: string; title: string; content: string }) {
  try {
    const clause = await prisma.clause.create({ data });
    revalidatePath("/clauses");
    return { success: true, clause };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteClauseDB(id: string) {
  try {
    await prisma.clause.delete({ where: { id } });
    revalidatePath("/clauses");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==================== DOCUMENT SUITE ACTIONS (15 TYPES) ====================
export async function getNextDocumentNumberDB(type: string): Promise<string> {
  try {
    const prefix = `SXL-${type.slice(0, 3).toUpperCase()}-`;
    const count = await prisma.documentSuite.count({ where: { type: type as any } });
    return `${prefix}${(count + 1).toString().padStart(3, "0")}`;
  } catch (err) {
    return "SXL-DOC-001";
  }
}

export async function createDocumentSuiteDB(data: {
  documentNumber: string;
  title: string;
  type: string;
  totalAmount?: number;
  date?: string;
  dueDate?: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  projectId?: string;
  contentJson: string;
  clausesJson?: string;
}) {
  try {
    const created = await prisma.documentSuite.create({
      data: {
        documentNumber: data.documentNumber,
        title: data.title,
        type: data.type as any,
        totalAmount: data.totalAmount || 0,
        date: data.date ? new Date(data.date) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientId: data.clientId || null,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        projectId: data.projectId || null,
        contentJson: data.contentJson,
        clausesJson: data.clausesJson || "[]",
      },
    });

    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/builder");
    return { success: true, id: created.id };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// Keep legacy fallback helper compatibility
export async function getNextInvoiceNumberDB(): Promise<string> {
  return getNextDocumentNumberDB("INVOICE");
}

export async function createInvoiceDB(data: InvoiceData) {
  return createDocumentSuiteDB({
    documentNumber: data.invoiceNumber,
    title: `Tax Invoice #${data.invoiceNumber}`,
    type: "INVOICE",
    totalAmount: data.total,
    date: data.invoiceDate,
    dueDate: data.dueDate,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    contentJson: JSON.stringify(data),
  });
}

export async function createAgreementDB(data: AgreementData) {
  return createDocumentSuiteDB({
    documentNumber: data.agreementNumber,
    title: `Agreement - ${data.projectTitle}`,
    type: "AGREEMENT",
    totalAmount: data.totalAmount,
    date: data.date,
    dueDate: data.deadline,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    contentJson: JSON.stringify(data),
  });
}

export async function createNDADB(data: NDAData) {
  return createDocumentSuiteDB({
    documentNumber: data.ndaNumber,
    title: `Mutual NDA - ${data.clientName}`,
    type: "NDA",
    totalAmount: 0,
    date: data.effectiveDate,
    clientName: data.clientName,
    clientEmail: "nda@client.com",
    contentJson: JSON.stringify(data),
  });
}

export async function getAllDocumentsDB(): Promise<SavedDocument[]> {
  try {
    const suites = await prisma.documentSuite.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });

    return suites.map((doc) => ({
      id: doc.id,
      title: doc.title,
      documentNumber: doc.documentNumber,
      type: doc.type.toLowerCase() as any,
      clientName: doc.clientName,
      amount: doc.totalAmount,
      date: doc.date.toISOString().split("T")[0],
      status: doc.status.toLowerCase() as any,
      updatedAt: doc.updatedAt.toISOString(),
      data: JSON.parse(doc.contentJson || "{}"),
    }));
  } catch (err) {
    console.error("Error fetching all documents:", err);
    return [];
  }
}

export async function deleteDocumentDB(id: string, type: string) {
  try {
    await prisma.documentSuite.update({
      where: { id },
      data: { isDeleted: true },
    });
    revalidatePath("/");
    revalidatePath("/history");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
