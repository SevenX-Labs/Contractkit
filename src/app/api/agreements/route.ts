import { NextResponse } from "next/server";
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
    const data = await req.json();

    // Map fields to Agreement model and store extra 30 sections inside additionalTerms / deliverables JSON
    const agreementNumber = data.agreementNumber || `SXL-AGR-${Math.floor(100 + Math.random() * 900)}`;

    const created = await prisma.agreement.create({
      data: {
        agreementNumber,
        date: data.date ? new Date(data.date) : new Date(),
        
        freelancerName: data.freelancerName || "SevenX Labs",
        freelancerCompany: data.freelancerCompany || "SevenX Labs Studio",
        freelancerEmail: data.freelancerEmail || "hello@sevenxlabs.com",
        
        clientName: data.clientName || "Client Name",
        clientCompany: data.clientCompany || "",
        clientEmail: data.clientEmail || "client@email.com",
        
        projectTitle: data.projectTitle || "Service Contract",
        projectDescription: data.projectDescription || "",
        deliverables: data.deliverables || "",
        
        startDate: data.startDate ? new Date(data.startDate) : new Date(),
        deadline: data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        
        totalAmount: data.totalAmount || 0,
        advancePercentage: data.advancePercentage || 50,
        finalPercentage: data.finalPercentage || 50,
        revisionLimit: data.revisionLimit || "3",
        
        ownershipClause: data.ownershipClause || "Transferred upon 100% full payment.",
        cancellationPolicy: data.cancellationPolicy || "7 days written notice.",
        additionalTerms: JSON.stringify(data),
        
        warrantyPeriod: data.warrantyPeriod || data.freeSupportPeriod || "",
        warrantyScope: data.warrantyScope || "",
        
        freelancerSignature: data.freelancerSignature || "",
        clientSignature: data.clientSignature || "",
        
        status: data.status ? (data.status.toUpperCase() as any) : "DRAFT",
      },
    });

    // Also sync to DocumentSuite for global vault search
    await prisma.documentSuite.create({
      data: {
        documentNumber: created.agreementNumber,
        title: `Agreement - ${created.projectTitle}`,
        type: "AGREEMENT",
        status: created.status,
        totalAmount: created.totalAmount,
        date: created.date,
        dueDate: created.deadline,
        clientName: created.clientName,
        clientEmail: created.clientEmail,
        contentJson: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, agreement: created });
  } catch (err) {
    console.error("Error creating agreement:", err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
