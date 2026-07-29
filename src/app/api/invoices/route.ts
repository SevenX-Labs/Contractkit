import { NextResponse } from "next/server";
import { createInvoiceDB } from "../../actions";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { isDeleted: false },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, invoices });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createInvoiceDB(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
