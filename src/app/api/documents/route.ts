import { NextResponse } from "next/server";
import { getAllDocumentsDB, deleteDocumentDB } from "../../actions";

export async function GET() {
  const documents = await getAllDocumentsDB();
  return NextResponse.json({ success: true, documents });
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type") as "invoice" | "agreement" | "nda";

    if (!id || !type) {
      return NextResponse.json({ success: false, error: "Missing id or type query param" }, { status: 400 });
    }

    const result = await deleteDocumentDB(id, type);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
