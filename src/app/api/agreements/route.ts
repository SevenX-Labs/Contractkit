import { NextResponse } from "next/server";
import { createAgreementDB } from "../../actions";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const agreements = await prisma.agreement.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, agreements });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createAgreementDB(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
