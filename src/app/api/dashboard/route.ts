import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { formatCurrency, formatDate } from "../../../lib/utils";

export async function GET() {
  try {
    const projectPaymentModel = (prisma as any).projectPayment;
    const expenseModel = (prisma as any).expense;

    const [payments, expenses, projectsCount, clientsCount, invoices, suites] = await Promise.all([
      projectPaymentModel
        ? projectPaymentModel.findMany({
            include: {
              project: {
                include: { client: true },
              },
            },
            orderBy: { createdAt: "desc" },
          })
        : [],
      expenseModel ? expenseModel.findMany() : [],
      prisma.project ? prisma.project.count() : 0,
      prisma.client ? prisma.client.count() : 0,
      prisma.invoice ? prisma.invoice.findMany({ where: { isDeleted: false } }) : [],
      prisma.documentSuite ? prisma.documentSuite.findMany({ where: { isDeleted: false } }) : [],
    ]);

    // 1. Total Earnings (Sum of all PAID ProjectPayment amounts + PAID Invoices)
    const paidPaymentsSum = payments
      .filter((p: any) => p.status === "PAID")
      .reduce((acc: number, p: any) => acc + p.amount, 0);

    const paidInvoicesSum = invoices
      .filter((inv: any) => inv.status === "PAID")
      .reduce((acc: number, inv: any) => acc + inv.total, 0);

    const totalEarnings = paidPaymentsSum + paidInvoicesSum;

    // 2. Total Pending (Sum of all PENDING ProjectPayment amounts + PENDING Invoices)
    const pendingPaymentsSum = payments
      .filter((p: any) => p.status === "PENDING")
      .reduce((acc: number, p: any) => acc + p.amount, 0);

    const pendingInvoicesSum = invoices
      .filter((inv: any) => inv.status === "SENT" || inv.status === "DRAFT")
      .reduce((acc: number, inv: any) => acc + inv.total, 0);

    const totalPending = pendingPaymentsSum + pendingInvoicesSum;

    // 3. This Month Earnings
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthEarnings = payments
      .filter((p: any) => {
        if (p.status !== "PAID" || !p.paidDate) return false;
        const d = new Date(p.paidDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc: number, p: any) => acc + p.amount, 0);

    // 4. Profit = Total Earnings - Total Expenses
    const totalExpenses = expenses.reduce((acc: number, e: any) => acc + e.amount, 0);
    const profit = Math.max(0, totalEarnings - totalExpenses);

    // 5. Format recent payments list
    const recentPayments = payments.slice(0, 8).map((p: any) => ({
      id: p.id,
      clientName: p.project?.client?.name || p.project?.name || "Client",
      projectName: p.project?.name || "Project",
      label: p.label,
      amount: p.amount,
      formattedAmount: formatCurrency(p.amount, "₹"),
      status: p.status,
      date: p.paidDate ? formatDate(p.paidDate.toISOString().split("T")[0]) : p.dueDate ? formatDate(p.dueDate.toISOString().split("T")[0]) : "Pending",
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings,
        formattedTotalEarnings: formatCurrency(totalEarnings, "₹"),
        totalPending,
        formattedTotalPending: formatCurrency(totalPending, "₹"),
        totalProjects: projectsCount,
        totalClients: clientsCount,
        thisMonthEarnings,
        formattedThisMonthEarnings: formatCurrency(thisMonthEarnings, "₹"),
        totalExpenses,
        formattedTotalExpenses: formatCurrency(totalExpenses, "₹"),
        profit,
        formattedProfit: formatCurrency(profit, "₹"),
        totalDocuments: invoices.length + suites.length,
      },
      recentPayments,
    });
  } catch (err) {
    console.error("Error fetching dashboard statistics:", err);
    return NextResponse.json({
      success: true,
      stats: {
        totalEarnings: 0,
        formattedTotalEarnings: "₹0.00",
        totalPending: 0,
        formattedTotalPending: "₹0.00",
        totalProjects: 0,
        totalClients: 0,
        thisMonthEarnings: 0,
        formattedThisMonthEarnings: "₹0.00",
        totalExpenses: 0,
        formattedTotalExpenses: "₹0.00",
        profit: 0,
        formattedProfit: "₹0.00",
        totalDocuments: 0,
      },
      recentPayments: [],
    });
  }
}
