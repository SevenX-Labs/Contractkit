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

// ==================== WORK & PROFIT TRACKER ====================
export async function createClientWorkTrackerDB(data: {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  billingAddress?: string;
  workType: string;
  projectValue: number;
  paymentStructure: "50/50" | "3-Way Split" | "Full Upfront" | "Monthly Retainer" | "Milestone";
  customMilestones?: Array<{ label: string; percentage: number }>;
  startDate?: string;
  deadline?: string;
  notes?: string;
}) {
  try {
    // 1. Create Client
    const client = await prisma.client.create({
      data: {
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        billingAddress: data.billingAddress,
        workType: data.workType,
        notes: data.notes,
        status: "Active",
      },
    });

    // 2. Create Project
    const project = await prisma.project.create({
      data: {
        name: `${data.name} — ${data.workType}`,
        description: data.notes || `${data.workType} project for ${data.name}`,
        workType: data.workType,
        budget: data.projectValue,
        totalValue: data.projectValue,
        amountPaid: 0,
        amountPending: data.projectValue,
        status: "In Progress",
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        deliveryDate: data.deadline ? new Date(data.deadline) : null,
        clientId: client.id,
      },
    });

    // 3. Auto-generate ProjectPayment Milestone Rows
    const paymentRows: Array<{ label: string; amount: number; dueDate?: Date }> = [];
    const val = data.projectValue;

    if (data.paymentStructure === "50/50") {
      paymentRows.push(
        { label: "Advance Payment (50%)", amount: val * 0.5, dueDate: new Date() },
        { label: "Final Delivery (50%)", amount: val * 0.5, dueDate: data.deadline ? new Date(data.deadline) : undefined }
      );
    } else if (data.paymentStructure === "3-Way Split") {
      paymentRows.push(
        { label: "Advance Deposit (30%)", amount: val * 0.3, dueDate: new Date() },
        { label: "Milestone 2 — Design & Prototype (30%)", amount: val * 0.3 },
        { label: "Final Deployment (40%)", amount: val * 0.4, dueDate: data.deadline ? new Date(data.deadline) : undefined }
      );
    } else if (data.paymentStructure === "Full Upfront") {
      paymentRows.push({ label: "Full Upfront Payment (100%)", amount: val, dueDate: new Date() });
    } else if (data.paymentStructure === "Monthly Retainer") {
      paymentRows.push({ label: "Monthly Retainer (Month 1)", amount: val, dueDate: new Date() });
    } else if (data.paymentStructure === "Milestone" && data.customMilestones) {
      data.customMilestones.forEach((m) => {
        paymentRows.push({ label: m.label, amount: (val * m.percentage) / 100 });
      });
    } else {
      paymentRows.push({ label: "Advance Deposit (50%)", amount: val * 0.5 }, { label: "Final Delivery (50%)", amount: val * 0.5 });
    }

    for (const row of paymentRows) {
      await prisma.projectPayment.create({
        data: {
          projectId: project.id,
          label: row.label,
          amount: row.amount,
          dueDate: row.dueDate || null,
          status: "PENDING",
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true, client, project };
  } catch (err) {
    console.error("Error creating client work tracker:", err);
    return { success: false, error: String(err) };
  }
}

export async function updatePaymentStatusDB(
  paymentId: string,
  status: "PAID" | "PENDING" | "OVERDUE",
  note?: string
) {
  try {
    const payment = await prisma.projectPayment.update({
      where: { id: paymentId },
      data: {
        status,
        paidDate: status === "PAID" ? new Date() : null,
        note: note || null,
      },
    });

    // Recalculate Project Amount Paid & Amount Pending
    const allPayments = await prisma.projectPayment.findMany({
      where: { projectId: payment.projectId },
    });

    const paidSum = allPayments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    const project = await prisma.project.findUnique({ where: { id: payment.projectId } });
    const totalVal = project?.totalValue || project?.budget || 0;

    await prisma.project.update({
      where: { id: payment.projectId },
      data: {
        amountPaid: paidSum,
        amountPending: Math.max(0, totalVal - paidSum),
        status: paidSum >= totalVal ? "Completed" : "In Progress",
      },
    });

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("Error updating payment status:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== EXPENSE TRACKER ====================
export async function createExpenseDB(data: { title: string; amount: number; category: string }) {
  try {
    const exp = await prisma.expense.create({
      data: {
        title: data.title,
        amount: data.amount,
        category: data.category || "Software & Hosting",
      },
    });
    revalidatePath("/");
    return { success: true, expense: exp };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function getExpensesDB() {
  try {
    return await prisma.expense.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    return [];
  }
}

// ==================== CLIENT CRM ACTIONS ====================
export async function getClientsDB() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        projects: {
          include: { payments: true },
        },
        documents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return clients.map((c) => {
      const totalVal = c.projects.reduce((acc, p) => acc + (p.totalValue || p.budget), 0);
      const paidVal = c.projects.reduce((acc, p) => acc + p.amountPaid, 0);
      const pendingVal = Math.max(0, totalVal - paidVal);

      return {
        ...c,
        totalValue: totalVal,
        amountPaid: paidVal,
        amountPending: pendingVal,
      };
    });
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
  workType?: string;
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
        workType: data.workType || "Web Dev",
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
      include: {
        client: true,
        payments: { orderBy: { createdAt: "asc" } },
        documents: true,
      },
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
  workType?: string;
  status?: string;
  startDate?: string;
  deliveryDate?: string;
  clientId?: string;
}) {
  try {
    const val = data.budget || 0;
    const project = await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        workType: data.workType || "Web Dev",
        budget: val,
        totalValue: val,
        amountPaid: 0,
        amountPending: val,
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

// ==================== DOCUMENT SUITE ACTIONS ====================
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

export async function getNextInvoiceNumberDB(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const count = await prisma.documentSuite.count({ where: { type: "INVOICE" } });
    const num = (count + 1).toString().padStart(6, "0");
    return `SXL-INV-${year}-${num}`;
  } catch (err) {
    return "SXL-INV-2026-000001";
  }
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
