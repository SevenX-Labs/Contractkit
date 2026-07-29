import { NextResponse } from "next/server";
import { createNDADB } from "../../actions";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const ndas = await prisma.nDA.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, ndas });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await createNDADB(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
