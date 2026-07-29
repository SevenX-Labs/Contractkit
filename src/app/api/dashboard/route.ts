import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { formatCurrency, formatDate } from "../../../lib/utils";

export async function GET() {
  try {
    const [invoices, agreements, ndas, documentSuites, clientsCount, projectsCount] = await Promise.all([
      prisma.invoice.findMany({
        where: { isDeleted: false },
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
      prisma.documentSuite.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
      }),
      prisma.client.count(),
      prisma.project.count(),
    ]);

    // Calculate Real Financial Aggregates
    const invoiceTotalSum = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const agreementTotalSum = agreements.reduce((acc, agr) => acc + agr.totalAmount, 0);
    const suiteTotalSum = documentSuites.reduce((acc, doc) => acc + doc.totalAmount, 0);
    
    const totalRevenue = invoiceTotalSum + agreementTotalSum + suiteTotalSum;

    // Payments Received (PAID invoices & documents)
    const invoicePaid = invoices.filter((inv) => inv.status === "PAID").reduce((acc, inv) => acc + inv.total, 0);
    const suitePaid = documentSuites.filter((doc) => doc.status === "PAID" || doc.status === "SIGNED").reduce((acc, doc) => acc + doc.totalAmount, 0);
    const paymentsReceived = invoicePaid + suitePaid;

    // Payments Requested / Pending (SENT / DRAFT invoices)
    const invoicePending = invoices.filter((inv) => inv.status === "SENT" || inv.status === "DRAFT").reduce((acc, inv) => acc + inv.total, 0);
    const suitePending = documentSuites.filter((doc) => doc.status === "SENT" || doc.status === "DRAFT").reduce((acc, doc) => acc + doc.totalAmount, 0);
    const paymentsRequested = invoicePending + suitePending;

    // Direct Contract Billing (Agreements & Software Contracts)
    const directContractBilling = agreementTotalSum + suiteTotalSum;

    // Unified List of Recent Transactions
    const invoiceTx = invoices.map((inv) => ({
      id: inv.id,
      documentNumber: inv.invoiceNumber,
      clientName: inv.clientName,
      type: "invoice" as const,
      amount: inv.total,
      date: inv.invoiceDate.toISOString().split("T")[0],
      status: inv.status.toLowerCase(),
      createdAt: inv.createdAt.toISOString(),
    }));

    const agreementTx = agreements.map((agr) => ({
      id: agr.id,
      documentNumber: agr.agreementNumber,
      clientName: agr.clientName,
      type: "agreement" as const,
      amount: agr.totalAmount,
      date: agr.date.toISOString().split("T")[0],
      status: agr.status.toLowerCase(),
      createdAt: agr.createdAt.toISOString(),
    }));

    const ndaTx = ndas.map((nda) => ({
      id: nda.id,
      documentNumber: nda.ndaNumber,
      clientName: nda.clientName,
      type: "nda" as const,
      amount: 0,
      date: nda.effectiveDate.toISOString().split("T")[0],
      status: nda.status.toLowerCase(),
      createdAt: nda.createdAt.toISOString(),
    }));

    const suiteTx = documentSuites.map((doc) => ({
      id: doc.id,
      documentNumber: doc.documentNumber,
      clientName: doc.clientName,
      type: doc.type.toLowerCase() as any,
      amount: doc.totalAmount,
      date: doc.date.toISOString().split("T")[0],
      status: doc.status.toLowerCase(),
      createdAt: doc.createdAt.toISOString(),
    }));

    const allTx = [...invoiceTx, ...agreementTx, ...ndaTx, ...suiteTx].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Waiting for bills pending payment
    const waitingForBills = invoices
      .filter((inv) => inv.status === "SENT" || inv.status === "DRAFT")
      .slice(0, 4)
      .map((inv) => ({
        id: inv.id,
        clientName: inv.clientName,
        invoiceNumber: inv.invoiceNumber,
        amount: inv.total,
        formattedAmount: formatCurrency(inv.total, "₹"),
        date: formatDate(inv.invoiceDate.toISOString().split("T")[0]),
      }));

    return NextResponse.json({
      success: true,
      stats: {
        totalClients: clientsCount,
        totalProjects: projectsCount,
        totalRevenue,
        formattedTotalRevenue: formatCurrency(totalRevenue, "₹"),
        paymentsReceived,
        formattedPaymentsReceived: formatCurrency(paymentsReceived, "₹"),
        paymentsRequested,
        formattedPaymentsRequested: formatCurrency(paymentsRequested, "₹"),
        directContractBilling,
        formattedDirectContractBilling: formatCurrency(directContractBilling, "₹"),
        totalInvoices: invoices.length,
        totalAgreements: agreements.length,
        totalNDAs: ndas.length,
        totalDocumentSuites: documentSuites.length,
        totalDocuments: invoices.length + agreements.length + ndas.length + documentSuites.length,
      },
      latestTransactions: allTx.slice(0, 6),
      waitingForBills,
      allDocuments: allTx,
    });
  } catch (err) {
    console.error("Error fetching dashboard stats:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
