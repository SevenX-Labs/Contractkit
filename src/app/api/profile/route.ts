import { NextResponse } from "next/server";
import { getProfileDB, saveProfileDB } from "../../actions";

export async function GET() {
  const profile = await getProfileDB();
  return NextResponse.json({ success: true, profile });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await saveProfileDB(body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
