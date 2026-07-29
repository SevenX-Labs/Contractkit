import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const agreement = await prisma.agreement.findUnique({
      where: { id },
    });

    if (!agreement) {
      return NextResponse.json({ success: false, error: "Agreement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, agreement });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();

    const updated = await prisma.agreement.update({
      where: { id },
      data: {
        freelancerName: data.freelancerName,
        freelancerCompany: data.freelancerCompany,
        freelancerEmail: data.freelancerEmail,
        clientName: data.clientName,
        clientCompany: data.clientCompany,
        clientEmail: data.clientEmail,
        projectTitle: data.projectTitle,
        projectDescription: data.projectDescription,
        deliverables: data.deliverables,
        totalAmount: data.totalAmount,
        advancePercentage: data.advancePercentage,
        finalPercentage: data.finalPercentage,
        revisionLimit: data.revisionLimit,
        ownershipClause: data.ownershipClause,
        cancellationPolicy: data.cancellationPolicy,
        additionalTerms: JSON.stringify(data),
        status: data.status ? (data.status.toUpperCase() as any) : "DRAFT",
      },
    });

    return NextResponse.json({ success: true, agreement: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.agreement.update({
      where: { id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
