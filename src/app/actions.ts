"use server";

import prisma from "../lib/prisma";
import { InvoiceData, QuotationData, AgreementData, NDAData, FreelancerProfile, SavedDocument } from "../types";
import { revalidatePath } from "next/cache";

// ==================== AUTHENTICATION ====================
export async function loginDB(password: string) {
  try {
    const envPass = process.env.USER_PASS || "sevenxlabs@2026";
    if (password.trim() === envPass.trim()) {
      return { success: true };
    }
    return { success: false, error: "Incorrect password. Access denied." };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ==================== PROFILE / SETTINGS ====================
export async function getProfileDB(): Promise<FreelancerProfile> {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      const defaultProf = await prisma.profile.create({
        data: {
          name: "Sahil Hode",
          company: "SevenX Labs",
          email: "sevenxlabs07@gmail.com",
          phone: "8652601566",
          address: "Thane, Mumbai, Maharashtra",
          upiId: "sevenxlabs@upi",
          bankName: "HDFC Bank",
          bankAccount: "50100234567890",
          bankIfsc: "HDFC0001234",
          paypalEmail: "sevenxlabs07@gmail.com",
          invoicePrefix: "SXL-INV-",
          currency: "₹",
        },
      });
      return {
        name: defaultProf.name,
        company: "SevenX Labs",
        email: "sevenxlabs07@gmail.com",
        phone: "8652601566",
        address: "Thane, Mumbai, Maharashtra",
        upiId: defaultProf.upiId || "",
        bankName: defaultProf.bankName || "",
        bankAccount: defaultProf.bankAccount || "",
        bankIfsc: defaultProf.bankIfsc || "",
        paypalEmail: defaultProf.paypalEmail || "",
        invoicePrefix: defaultProf.invoicePrefix || "SXL-INV-",
      };
    }

    return {
      name: profile.name || "Sahil Hode",
      company: "SevenX Labs",
      email: "sevenxlabs07@gmail.com",
      phone: "8652601566",
      address: "Thane, Mumbai, Maharashtra",
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
      name: "Sahil Hode",
      company: "SevenX Labs",
      email: "sevenxlabs07@gmail.com",
      phone: "8652601566",
      address: "Thane, Mumbai, Maharashtra",
      upiId: "",
      bankName: "",
      bankAccount: "",
      bankIfsc: "",
      paypalEmail: "",
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
  projectTitle?: string;
  projectDescription?: string;
  projectValue: number;
  paymentStructure: "50/50" | "3-Way Split" | "Full Upfront" | "Full Payment After Work" | "Monthly Retainer" | "Milestone";
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

    // 2. Create Project with actual Project Title & Description
    const projName = data.projectTitle || `${data.workType} Project`;
    const projDesc = data.projectDescription || data.notes || `${data.workType} project for ${data.name}`;

    const project = await prisma.project.create({
      data: {
        name: projName,
        description: projDesc,
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
    } else if (data.paymentStructure === "Full Payment After Work") {
      paymentRows.push({
        label: "Full Payment Upon Completion (100%)",
        amount: val,
        dueDate: data.deadline ? new Date(data.deadline) : undefined,
      });
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

export async function updateProjectPaymentDB(
  paymentId: string,
  data: {
    label?: string;
    amount?: number;
    dueDate?: string | null;
    status?: "PAID" | "PENDING" | "OVERDUE";
    note?: string | null;
  }
) {
  try {
    const payment = await prisma.projectPayment.update({
      where: { id: paymentId },
      data: {
        label: data.label,
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: data.status,
        paidDate: data.status === "PAID" ? new Date() : null,
        note: data.note || null,
      },
    });

    // Recalculate Project total, amountPaid, and amountPending
    const allPayments = await prisma.projectPayment.findMany({
      where: { projectId: payment.projectId },
    });

    const totalSum = allPayments.reduce((acc, p) => acc + p.amount, 0);
    const paidSum = allPayments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    await prisma.project.update({
      where: { id: payment.projectId },
      data: {
        totalValue: totalSum,
        budget: totalSum,
        amountPaid: paidSum,
        amountPending: Math.max(0, totalSum - paidSum),
        status: paidSum >= totalSum && totalSum > 0 ? "Completed" : "In Progress",
      },
    });

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("Error updating project payment:", err);
    return { success: false, error: String(err) };
  }
}

export async function addProjectPaymentDB(
  projectId: string,
  data: {
    label: string;
    amount: number;
    dueDate?: string;
    status?: string;
    note?: string;
  }
) {
  try {
    const payment = await prisma.projectPayment.create({
      data: {
        projectId,
        label: data.label,
        amount: data.amount,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: data.status || "PENDING",
        paidDate: data.status === "PAID" || data.status === "Paid" ? new Date() : null,
        note: data.note || null,
      },
    });

    // Recalculate Project total
    const allPayments = await prisma.projectPayment.findMany({
      where: { projectId },
    });

    const totalSum = allPayments.reduce((acc, p) => acc + p.amount, 0);
    const paidSum = allPayments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    await prisma.project.update({
      where: { id: projectId },
      data: {
        totalValue: totalSum,
        budget: totalSum,
        amountPaid: paidSum,
        amountPending: Math.max(0, totalSum - paidSum),
      },
    });

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true, payment };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteProjectPaymentDB(paymentId: string) {
  try {
    const payment = await prisma.projectPayment.delete({
      where: { id: paymentId },
    });

    // Recalculate Project total
    const allPayments = await prisma.projectPayment.findMany({
      where: { projectId: payment.projectId },
    });

    const totalSum = allPayments.reduce((acc, p) => acc + p.amount, 0);
    const paidSum = allPayments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    await prisma.project.update({
      where: { id: payment.projectId },
      data: {
        totalValue: totalSum,
        budget: totalSum,
        amountPaid: paidSum,
        amountPending: Math.max(0, totalSum - paidSum),
      },
    });

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
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
        projectTitle: c.website || "",
        projectSummary: c.notes || "",
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
  projectTitle?: string;
  projectSummary?: string;
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
        website: data.projectTitle || data.website,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        notes: data.projectSummary || data.notes,
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
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return { success: true };
    }

    // 1. Find all projects for this client
    const clientProjects = await prisma.project.findMany({
      where: { clientId: id },
      select: { id: true },
    });
    const projectIds = clientProjects.map((p) => p.id);

    // 2. Delete all payment milestones for those projects
    if (projectIds.length > 0) {
      await prisma.projectPayment.deleteMany({
        where: { projectId: { in: projectIds } },
      });
    }

    // 3. Delete all document suites matching clientId, clientName, or clientEmail
    const docOrConditions: any[] = [{ clientId: id }];
    if (client.name) docOrConditions.push({ clientName: client.name });
    if (client.email) docOrConditions.push({ clientEmail: client.email });

    await prisma.documentSuite.deleteMany({
      where: { OR: docOrConditions },
    });

    // 4. Delete all projects for this client
    await prisma.project.deleteMany({
      where: { clientId: id },
    });

    // 5. Delete the client record
    await prisma.client.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true };
  } catch (err) {
    console.error("Error deleting client and related data:", err);
    return { success: false, error: String(err) };
  }
}

export async function updateClientDB(
  id: string,
  data: {
    name?: string;
    company?: string;
    designation?: string;
    email?: string;
    phone?: string;
    gstNo?: string;
    taxNo?: string;
    website?: string;
    projectTitle?: string;
    projectSummary?: string;
    billingAddress?: string;
    shippingAddress?: string;
    notes?: string;
    workType?: string;
    status?: string;
  }
) {
  try {
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        company: data.company,
        designation: data.designation,
        email: data.email,
        phone: data.phone,
        gstNo: data.gstNo,
        taxNo: data.taxNo,
        website: data.projectTitle !== undefined ? data.projectTitle : data.website,
        billingAddress: data.billingAddress,
        shippingAddress: data.shippingAddress,
        notes: data.projectSummary !== undefined ? data.projectSummary : data.notes,
        workType: data.workType,
        status: data.status,
      },
    });

    // Sync status to all linked projects
    if (data.status) {
      const projStatus =
        data.status === "Active" || data.status === "In Progress"
          ? "In Progress"
          : data.status;

      await prisma.project.updateMany({
        where: { clientId: id },
        data: { status: projStatus },
      });
    }

    revalidatePath("/clients");
    revalidatePath("/projects");
    return { success: true, client: updated };
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

    const allDocs = await prisma.documentSuite.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Merge documents matching client name, client email, or project ID
    const enrichedProjects = projects.map((p) => {
      const existingDocIds = new Set((p.documents || []).map((d) => d.id));
      const matchingDocs = allDocs.filter((d) => {
        if (existingDocIds.has(d.id)) return false;
        if (d.projectId === p.id) return true;
        if (
          p.client &&
          p.client.name &&
          d.clientName &&
          d.clientName.toLowerCase().trim() === p.client.name.toLowerCase().trim()
        )
          return true;
        if (
          p.client &&
          p.client.email &&
          d.clientEmail &&
          d.clientEmail.toLowerCase().trim() === p.client.email.toLowerCase().trim()
        )
          return true;
        return false;
      });

      const effectiveStatus =
        p.client && (p.client.status === "On Hold" || p.client.status === "Completed")
          ? p.client.status
          : p.status;

      return {
        ...p,
        status: effectiveStatus,
        documents: [...(p.documents || []), ...matchingDocs],
      };
    });

    return enrichedProjects;
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
  paymentStructure?: string;
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

    // Auto-generate ProjectPayment Milestone Rows
    const structure = data.paymentStructure || "50/50";
    const paymentRows: Array<{ label: string; amount: number; dueDate?: Date }> = [];

    if (structure === "50/50") {
      paymentRows.push(
        { label: "Advance Payment (50%)", amount: val * 0.5, dueDate: new Date() },
        { label: "Final Delivery (50%)", amount: val * 0.5, dueDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined }
      );
    } else if (structure === "3-Way Split") {
      paymentRows.push(
        { label: "Advance Deposit (30%)", amount: val * 0.3, dueDate: new Date() },
        { label: "Milestone 2 — Design & Prototype (30%)", amount: val * 0.3 },
        { label: "Final Deployment (40%)", amount: val * 0.4, dueDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined }
      );
    } else if (structure === "Full Upfront") {
      paymentRows.push({ label: "Full Upfront Payment (100%)", amount: val, dueDate: new Date() });
    } else if (structure === "Full Payment After Work") {
      paymentRows.push({
        label: "Full Payment Upon Completion (100%)",
        amount: val,
        dueDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
      });
    } else if (structure === "Monthly Retainer") {
      const today = new Date();
      const month2 = new Date();
      month2.setDate(today.getDate() + 30);
      const month3 = new Date();
      month3.setDate(today.getDate() + 60);

      paymentRows.push(
        { label: "Monthly Retainer — Month 1", amount: val, dueDate: today },
        { label: "Monthly Retainer — Month 2", amount: val, dueDate: month2 },
        { label: "Monthly Retainer — Month 3", amount: val, dueDate: month3 }
      );
    } else {
      paymentRows.push(
        { label: "Advance Payment (50%)", amount: val * 0.5, dueDate: new Date() },
        { label: "Final Delivery (50%)", amount: val * 0.5, dueDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined }
      );
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

    revalidatePath("/projects");
    return { success: true, project };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function updateProjectDB(
  id: string,
  data: {
    name?: string;
    description?: string;
    workType?: string;
    budget?: number;
    status?: string;
    startDate?: string;
    deliveryDate?: string;
  }
) {
  try {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        workType: data.workType,
        budget: data.budget !== undefined ? data.budget : undefined,
        totalValue: data.budget !== undefined ? data.budget : undefined,
        status: data.status,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
      },
    });

    // If project status was updated and has a linked client, sync client's status
    if (data.status && updated.clientId) {
      const clientStatus =
        data.status === "In Progress" || data.status === "Active"
          ? "Active"
          : data.status;

      await prisma.client.update({
        where: { id: updated.clientId },
        data: { status: clientStatus },
      });
    }

    revalidatePath("/projects");
    revalidatePath("/clients");
    return { success: true, project: updated };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deleteProjectDB(id: string) {
  try {
    await prisma.projectPayment.deleteMany({ where: { projectId: id } });
    await prisma.project.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/clients");
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
    const docNumber = data.documentNumber || `SXL-${data.type.slice(0, 3)}-${Date.now()}`;
    const safeClientName = data.clientName || "Client";
    const safeClientEmail = data.clientEmail || "client@email.com";
    const amountVal = data.totalAmount || 0;

    // 1. Link Client record if existing client is found
    let targetClientId = data.clientId || null;
    if (!targetClientId && safeClientName && safeClientName !== "Client") {
      const existingClient = await prisma.client.findFirst({
        where: {
          OR: [
            { email: { equals: safeClientEmail, mode: "insensitive" } },
            { name: { equals: safeClientName, mode: "insensitive" } },
          ],
        },
      });

      if (existingClient) {
        targetClientId = existingClient.id;
      }
    }

    // 2. Link Project record if existing project is found for targetClientId
    let targetProjectId = data.projectId || null;
    if (!targetProjectId && targetClientId) {
      const existingProject = await prisma.project.findFirst({
        where: { clientId: targetClientId },
      });

      if (existingProject) {
        targetProjectId = existingProject.id;
      }
    }

    // 3. Upsert DocumentSuite record
    let dbModel = (prisma as any).documentSuite;
    if (!dbModel) {
      const { PrismaClient } = require("@prisma/client");
      const freshPrisma = new PrismaClient();
      dbModel = freshPrisma.documentSuite;
    }

    const upserted = await dbModel.upsert({
      where: { documentNumber: docNumber },
      update: {
        title: data.title,
        type: data.type as any,
        totalAmount: amountVal,
        date: data.date ? new Date(data.date) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientId: targetClientId || null,
        clientName: safeClientName,
        clientEmail: safeClientEmail,
        projectId: targetProjectId || null,
        contentJson: data.contentJson,
        clausesJson: data.clausesJson || "[]",
      },
      create: {
        documentNumber: docNumber,
        title: data.title,
        type: data.type as any,
        totalAmount: amountVal,
        date: data.date ? new Date(data.date) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientId: targetClientId || null,
        clientName: safeClientName,
        clientEmail: safeClientEmail,
        projectId: targetProjectId || null,
        contentJson: data.contentJson,
        clausesJson: data.clausesJson || "[]",
      },
    });

    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/projects");
    revalidatePath("/clients");
    revalidatePath("/invoice");
    revalidatePath("/quotation");
    revalidatePath("/agreement");
    revalidatePath("/nda");
    revalidatePath("/receipt");
    revalidatePath("/certificate");
    return { success: true, id: upserted.id };
  } catch (err) {
    console.error("Error saving document to DB:", err);
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
    const year = new Date().getFullYear();
    return `SXL-INV-${year}-000001`;
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

export async function createAgreementDB(data: AgreementData | any) {
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
  const clientName = data.receivingName || data.clientName || "Receiving Party";
  const clientEmail = data.receivingEmail || data.disclosingEmail || "nda@client.com";

  return createDocumentSuiteDB({
    documentNumber: data.ndaNumber,
    title: `Mutual NDA - ${clientName}`,
    type: "NDA",
    totalAmount: 0,
    date: data.effectiveDate,
    clientName: clientName,
    clientEmail: clientEmail,
    contentJson: JSON.stringify(data),
  });
}

export async function getNextQuotationNumberDB(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const count = await prisma.documentSuite.count({ where: { type: "QUOTATION" } });
    const num = (count + 1).toString().padStart(6, "0");
    return `SXL-QUO-${year}-${num}`;
  } catch (err) {
    const year = new Date().getFullYear();
    return `SXL-QUO-${year}-000001`;
  }
}

export async function createQuotationDB(data: QuotationData) {
  return createDocumentSuiteDB({
    documentNumber: data.quotationNumber,
    title: `Quotation #${data.quotationNumber} - ${data.clientName}`,
    type: "QUOTATION",
    totalAmount: data.totalAmount,
    date: data.quotationDate,
    clientName: data.clientName,
    clientEmail: data.clientEmail || "client@email.com",
    contentJson: JSON.stringify(data),
  });
}

export async function getNextCertificateNumberDB(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const count = await prisma.documentSuite.count({ where: { type: "CERTIFICATE" } });
    const num = (count + 1).toString().padStart(6, "0");
    return `SXL-CC-${year}-${num}`;
  } catch (err) {
    const year = new Date().getFullYear();
    return `SXL-CC-${year}-000101`;
  }
}

export async function getNextReceiptNumberDB(): Promise<string> {
  try {
    const year = new Date().getFullYear();
    const count = await prisma.documentSuite.count({ where: { type: "PAYMENT_RECEIPT" } });
    const num = (count + 1).toString().padStart(6, "0");
    return `SXL-RC-${year}-${num}`;
  } catch (err) {
    const year = new Date().getFullYear();
    return `SXL-RC-${year}-000201`;
  }
}

export async function createCertificateDB(data: any) {
  const clientName = data.clientName || "Client";

  return createDocumentSuiteDB({
    documentNumber: data.certificateNumber,
    title: `Completion Certificate - ${data.projectTitle || clientName}`,
    type: "CERTIFICATE",
    totalAmount: 0,
    date: data.date,
    clientName: clientName,
    clientEmail: "certificate@client.com",
    contentJson: JSON.stringify(data),
  });
}

export async function createReceiptDB(data: any) {
  const clientName = data.clientName || "Client";

  return createDocumentSuiteDB({
    documentNumber: data.receiptNumber,
    title: `Payment Receipt #${data.receiptNumber} - ${clientName}`,
    type: "PAYMENT_RECEIPT",
    totalAmount: data.totalReceived || data.amountReceived || 0,
    date: data.date,
    clientName: clientName,
    clientEmail: "receipt@client.com",
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
