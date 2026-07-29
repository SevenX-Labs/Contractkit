import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { formatCurrency, formatDate } from "../../../lib/utils";

export async function GET() {
  try {
    const [payments, expenses, projectsCount, clientsCount, invoices, suites] = await Promise.all([
      prisma.projectPayment.findMany({
        include: {
          project: {
            include: { client: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.expense.findMany(),
      prisma.project.count(),
      prisma.client.count(),
      prisma.invoice.findMany({ where: { isDeleted: false } }),
      prisma.documentSuite.findMany({ where: { isDeleted: false } }),
    ]);

    // 1. Total Earnings (Sum of all PAID ProjectPayment amounts + PAID Invoices)
    const paidPaymentsSum = payments
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    const paidInvoicesSum = invoices
      .filter((inv) => inv.status === "PAID")
      .reduce((acc, inv) => acc + inv.total, 0);

    const totalEarnings = paidPaymentsSum + paidInvoicesSum;

    // 2. Total Pending (Sum of all PENDING ProjectPayment amounts + PENDING Invoices)
    const pendingPaymentsSum = payments
      .filter((p) => p.status === "PENDING")
      .reduce((acc, p) => acc + p.amount, 0);

    const pendingInvoicesSum = invoices
      .filter((inv) => inv.status === "SENT" || inv.status === "DRAFT")
      .reduce((acc, inv) => acc + inv.total, 0);

    const totalPending = pendingPaymentsSum + pendingInvoicesSum;

    // 3. This Month Earnings
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthEarnings = payments
      .filter((p) => {
        if (p.status !== "PAID" || !p.paidDate) return false;
        const d = new Date(p.paidDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((acc, p) => acc + p.amount, 0);

    // 4. Profit = Total Earnings - Total Expenses
    const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
    const profit = Math.max(0, totalEarnings - totalExpenses);

    // 5. Format recent payments list
    const recentPayments = payments.slice(0, 8).map((p) => ({
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
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
