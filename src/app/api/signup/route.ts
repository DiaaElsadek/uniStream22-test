import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { academicId, email, password, fullName } = await req.json();

    // تحقق من وجود نفس AcademicId
    const resAcad = await fetch(`${SUPA_URL}/rest/v1/AppUser?AcademicId=eq.${academicId}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    const dataAcad = await resAcad.json();
    if (dataAcad.length > 0) {
      return NextResponse.json(
        { message: "This Academic ID is Already Registered.", status: false, type: "academicId" },
        { status: 400 }
      );
    }

    // تحقق من وجود نفس الإيميل
    const resEmail = await fetch(`${SUPA_URL}/rest/v1/AppUser?email=eq.${email}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    const dataEmail = await resEmail.json();
    if (dataEmail.length > 0) {
      return NextResponse.json(
        { message: "This Email is Already Registered.", status: false, type: "email" },
        { status: 400 }
      );
    }

    // لو مافيش تعارض، ضيف المستخدم الجديد
    const insertRes = await fetch(`${SUPA_URL}/rest/v1/AppUser`, {
      method: "POST",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ academicId, email, password, fullName }),
    });

    if (!insertRes.ok) {
      const err = await insertRes.text();
      return NextResponse.json({ message: err, status: false, type: "server" }, { status: 500 });
    }

    const user = await insertRes.json();
    return NextResponse.json({
      message: "Registered Successfully",
      status: true,
      type: "success",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Server error", status: false, type: "error" },
      { status: 500 }
    );
  }
}
