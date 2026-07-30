import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { isDeleted: false },
      include: { items: true, client: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, invoices });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const invoiceNumber = data.invoiceNumber || `SXL-INV-${new Date().getFullYear()}-000001`;

    const created = await prisma.documentSuite.create({
      data: {
        documentNumber: invoiceNumber,
        title: `Tax Invoice #${invoiceNumber}`,
        type: "INVOICE",
        totalAmount: data.total || 0,
        date: data.invoiceDate ? new Date(data.invoiceDate) : new Date(),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientName: data.clientName || "Client",
        clientEmail: data.clientEmail || "client@email.com",
        contentJson: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, invoice: created });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
