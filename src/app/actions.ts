"use server";

import prisma from "../lib/prisma";
import { InvoiceData, AgreementData, NDAData, FreelancerProfile, SavedDocument } from "../types";
import { revalidatePath } from "next/cache";

// ==================== PROFILE / SETTINGS ====================
export async function getProfileDB(): Promise<FreelancerProfile> {
  try {
    const profile = await prisma.profile.findFirst();
    if (!profile) {
      // Create initial default profile in Prisma DB
      const defaultProf = await prisma.profile.create({
        data: {
          name: "SevenX Labs",
          company: "SevenX Labs Studio",
          email: "hello@sevenxlabs.com",
          phone: "+1 (555) 789-0123",
          address: "100 Tech Plaza, Suite 400, Tech District, CA 94107",
          upiId: "sevenxlabs@upi",
          bankName: "Silicon Tech Bank",
          bankAccount: "98765432101234",
          bankIfsc: "STBK0009876",
          paypalEmail: "billing@sevenxlabs.com",
          invoicePrefix: "SXL-INV-",
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
    console.error("Error fetching profile from Prisma DB:", err);
    return {
      name: "SevenX Labs",
      company: "SevenX Labs Studio",
      email: "hello@sevenxlabs.com",
      phone: "+1 (555) 789-0123",
      address: "100 Tech Plaza, Suite 400, CA 94107",
      upiId: "sevenxlabs@upi",
      bankName: "Silicon Tech Bank",
      bankAccount: "98765432101234",
      bankIfsc: "STBK0009876",
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
    console.error("Error saving profile to Prisma DB:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== INVOICE COUNTER ====================
export async function getNextInvoiceNumberDB(): Promise<string> {
  try {
    const profile = await getProfileDB();
    const prefix = profile.invoicePrefix || "SXL-INV-";
    const count = await prisma.invoice.count();
    const nextNum = (count + 1).toString().padStart(3, "0");
    return `${prefix}${nextNum}`;
  } catch (err) {
    return "SXL-INV-001";
  }
}

// ==================== INVOICES ====================
export async function createInvoiceDB(data: InvoiceData) {
  try {
    const created = await prisma.invoice.create({
      data: {
        invoiceNumber: data.invoiceNumber,
        invoiceDate: new Date(data.invoiceDate),
        dueDate: new Date(data.dueDate),
        senderName: data.senderName,
        senderCompany: data.senderCompany,
        senderAddress: data.senderAddress,
        senderEmail: data.senderEmail,
        senderPhone: data.senderPhone,
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        clientAddress: data.clientAddress,
        clientEmail: data.clientEmail,
        clientPhone: data.clientPhone,
        paymentMethod: (data.paymentMethod === "Bank Transfer" ? "BANK_TRANSFER" : data.paymentMethod) as any,
        paymentDetails: data.paymentDetails,
        subtotal: data.subtotal,
        discountPct: data.discountPercent,
        discountAmt: data.discountAmount,
        taxPct: data.taxPercent,
        taxAmt: data.taxAmount,
        total: data.total,
        note: data.note,
        status: (data.status.toUpperCase()) as any,
        items: {
          create: data.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/invoice");
    return { success: true, id: created.id };
  } catch (err) {
    console.error("Error saving invoice to Prisma DB:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== AGREEMENTS ====================
export async function createAgreementDB(data: AgreementData) {
  try {
    const created = await prisma.agreement.create({
      data: {
        agreementNumber: data.agreementNumber,
        date: new Date(data.date),
        freelancerName: data.freelancerName,
        freelancerCompany: data.freelancerCompany,
        freelancerEmail: data.freelancerEmail,
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        clientEmail: data.clientEmail,
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        deliverables: data.deliverables,
        startDate: new Date(data.startDate),
        deadline: new Date(data.deadline),
        totalAmount: data.totalAmount,
        advancePercentage: data.advancePercentage,
        finalPercentage: data.finalPercentage,
        revisionLimit: data.revisionLimit,
        ownershipClause: data.ownershipClause,
        cancellationPolicy: data.cancellationPolicy,
        additionalTerms: data.additionalTerms,
        freelancerSignature: data.freelancerSignature,
        freelancerSignDate: data.freelancerSignDate ? new Date(data.freelancerSignDate) : new Date(),
        clientSignature: data.clientSignature,
        clientSignDate: data.clientSignDate ? new Date(data.clientSignDate) : new Date(),
        status: (data.status.toUpperCase()) as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/agreement");
    return { success: true, id: created.id };
  } catch (err) {
    console.error("Error saving agreement to Prisma DB:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== NDAs ====================
export async function createNDADB(data: NDAData) {
  try {
    const created = await prisma.nDA.create({
      data: {
        ndaNumber: data.ndaNumber,
        effectiveDate: new Date(data.effectiveDate),
        freelancerName: data.freelancerName,
        freelancerCompany: data.freelancerCompany,
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        projectContext: data.projectContext,
        confidentialInfoDefinition: data.confidentialInfoDefinition,
        obligations: data.obligations,
        duration: data.duration,
        returnDestroyClause: data.returnDestroyClause,
        breachPenalty: data.breachPenalty,
        additionalNotes: data.additionalNotes,
        freelancerSignature: data.freelancerSignature,
        freelancerSignDate: data.freelancerSignDate ? new Date(data.freelancerSignDate) : new Date(),
        clientSignature: data.clientSignature,
        clientSignDate: data.clientSignDate ? new Date(data.clientSignDate) : new Date(),
        status: (data.status.toUpperCase()) as any,
      },
    });

    revalidatePath("/");
    revalidatePath("/history");
    revalidatePath("/nda");
    return { success: true, id: created.id };
  } catch (err) {
    console.error("Error saving NDA to Prisma DB:", err);
    return { success: false, error: String(err) };
  }
}

// ==================== GET ALL DOCUMENTS ====================
export async function getAllDocumentsDB(): Promise<SavedDocument[]> {
  try {
    const [invoices, agreements, ndas] = await Promise.all([
      prisma.invoice.findMany({
        where: { isDeleted: false },
        include: { items: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.agreement.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      }),
      prisma.nDA.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const formattedInvoices: SavedDocument[] = invoices.map((inv) => ({
      id: inv.id,
      title: `Invoice #${inv.invoiceNumber} - ${inv.clientName}`,
      documentNumber: inv.invoiceNumber,
      type: "invoice",
      clientName: inv.clientName,
      amount: inv.total,
      date: inv.invoiceDate.toISOString().split("T")[0],
      status: inv.status.toLowerCase() as any,
      updatedAt: inv.updatedAt.toISOString(),
      data: {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        invoiceDate: inv.invoiceDate.toISOString().split("T")[0],
        dueDate: inv.dueDate.toISOString().split("T")[0],
        senderName: inv.senderName,
        senderCompany: inv.senderCompany || "",
        senderAddress: inv.senderAddress || "",
        senderEmail: inv.senderEmail,
        senderPhone: inv.senderPhone || "",
        clientName: inv.clientName,
        clientCompany: inv.clientCompany || "",
        clientAddress: inv.clientAddress || "",
        clientEmail: inv.clientEmail,
        clientPhone: inv.clientPhone || "",
        paymentMethod: inv.paymentMethod as any,
        paymentDetails: inv.paymentDetails || "",
        items: inv.items.map((i) => ({
          id: i.id,
          description: i.description,
          quantity: i.quantity,
          rate: i.rate,
          amount: i.amount,
        })),
        subtotal: inv.subtotal,
        discountPercent: inv.discountPct,
        discountAmount: inv.discountAmt,
        taxPercent: inv.taxPct,
        taxAmount: inv.taxAmt,
        total: inv.total,
        note: inv.note || "",
        status: inv.status.toLowerCase() as any,
        createdAt: inv.createdAt.toISOString(),
      },
    }));

    const formattedAgreements: SavedDocument[] = agreements.map((agr) => ({
      id: agr.id,
      title: `Agreement - ${agr.projectTitle}`,
      documentNumber: agr.agreementNumber,
      type: "agreement",
      clientName: agr.clientName,
      amount: agr.totalAmount,
      date: agr.date.toISOString().split("T")[0],
      status: agr.status.toLowerCase() as any,
      updatedAt: agr.updatedAt.toISOString(),
      data: {
        id: agr.id,
        agreementNumber: agr.agreementNumber,
        date: agr.date.toISOString().split("T")[0],
        freelancerName: agr.freelancerName,
        freelancerCompany: agr.freelancerCompany || "",
        freelancerEmail: agr.freelancerEmail,
        clientName: agr.clientName,
        clientCompany: agr.clientCompany || "",
        clientEmail: agr.clientEmail,
        projectTitle: agr.projectTitle,
        projectDescription: agr.projectDescription,
        deliverables: agr.deliverables,
        startDate: agr.startDate.toISOString().split("T")[0],
        deadline: agr.deadline.toISOString().split("T")[0],
        totalAmount: agr.totalAmount,
        advancePercentage: agr.advancePercentage,
        finalPercentage: agr.finalPercentage,
        revisionLimit: agr.revisionLimit as any,
        ownershipClause: agr.ownershipClause,
        cancellationPolicy: agr.cancellationPolicy,
        additionalTerms: agr.additionalTerms || "",
        freelancerSignature: agr.freelancerSignature || "",
        freelancerSignDate: agr.freelancerSignDate ? agr.freelancerSignDate.toISOString().split("T")[0] : "",
        clientSignature: agr.clientSignature || "",
        clientSignDate: agr.clientSignDate ? agr.clientSignDate.toISOString().split("T")[0] : "",
        status: agr.status.toLowerCase() as any,
        createdAt: agr.createdAt.toISOString(),
      },
    }));

    const formattedNDAs: SavedDocument[] = ndas.map((nda) => ({
      id: nda.id,
      title: `Mutual NDA - ${nda.clientName}`,
      documentNumber: nda.ndaNumber,
      type: "nda",
      clientName: nda.clientName,
      date: nda.effectiveDate.toISOString().split("T")[0],
      status: nda.status.toLowerCase() as any,
      updatedAt: nda.updatedAt.toISOString(),
      data: {
        id: nda.id,
        ndaNumber: nda.ndaNumber,
        effectiveDate: nda.effectiveDate.toISOString().split("T")[0],
        freelancerName: nda.freelancerName,
        freelancerCompany: nda.freelancerCompany || "",
        clientName: nda.clientName,
        clientCompany: nda.clientCompany || "",
        projectContext: nda.projectContext,
        confidentialInfoDefinition: nda.confidentialInfoDefinition,
        obligations: nda.obligations,
        duration: nda.duration as any,
        returnDestroyClause: nda.returnDestroyClause,
        breachPenalty: nda.breachPenalty,
        additionalNotes: nda.additionalNotes || "",
        freelancerSignature: nda.freelancerSignature || "",
        freelancerSignDate: nda.freelancerSignDate ? nda.freelancerSignDate.toISOString().split("T")[0] : "",
        clientSignature: nda.clientSignature || "",
        clientSignDate: nda.clientSignDate ? nda.clientSignDate.toISOString().split("T")[0] : "",
        status: nda.status.toLowerCase() as any,
        createdAt: nda.createdAt.toISOString(),
      },
    }));

    const allDocs = [...formattedInvoices, ...formattedAgreements, ...formattedNDAs];
    allDocs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return allDocs;
  } catch (err) {
    console.error("Error fetching documents from Prisma DB:", err);
    return [];
  }
}

// ==================== DELETE DOCUMENT ====================
export async function deleteDocumentDB(id: string, type: "invoice" | "agreement" | "nda") {
  try {
    if (type === "invoice") {
      await prisma.invoice.update({ where: { id }, data: { isDeleted: true } });
    } else if (type === "agreement") {
      await prisma.agreement.update({ where: { id }, data: { isDeleted: true } });
    } else if (type === "nda") {
      await prisma.nDA.update({ where: { id }, data: { isDeleted: true } });
    }

    revalidatePath("/");
    revalidatePath("/history");
    return { success: true };
  } catch (err) {
    console.error("Error deleting document from Prisma DB:", err);
    return { success: false, error: String(err) };
  }
}
