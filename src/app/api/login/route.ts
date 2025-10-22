// server-side route: app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    if (!SUPA_URL || !SUPA_SERVICE_KEY) {
      console.error("Missing Supabase env vars");
      return NextResponse.json(
        { message: "Server configuration error", status: false, type: "server" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const email = (body.email || "").toString().trim();
    const password = (body.password || "").toString();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required.", status: false, type: "validation" },
        { status: 400 }
      );
    }

    // fetch user by email
    const resUser = await fetch(`${SUPA_URL}/rest/v1/AppUser?email=eq.${encodeURIComponent(email)}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });

    if (!resUser.ok) {
      const txt = await resUser.text();
      console.error("Supabase lookup failed:", resUser.status, txt);
      return NextResponse.json(
        { message: "Failed to lookup user.", status: false, type: "server" },
        { status: 500 }
      );
    }

    const users = await resUser.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials.", status: false, type: "credentials" },
        { status: 401 }
      );
    }

    const user = users[0];

    // NOTE: this example compares plain-text passwords.
    // In production you MUST hash passwords (bcrypt) and compare hashes.
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid Emain or Password.", status: false, type: "credentials" },
        { status: 401 }
      );
    }

    // ✅ هنا بناخد التوكن اللي في قاعدة البيانات كما هو
    const userToken = user.userToken ?? user.token ?? "";

    // return user info (avoid returning sensitive fields)
    const responseUser = {
      academicId: user.AcademicId ?? user.academicId ?? "",
      email: user.email,
      fullName: user.fullName ?? "user",
      userToken, // التوكن الحقيقي من الداتا بيز
      role: user.role ?? "user",
    };
    
    (await cookies()).set("userToken", userToken, { httpOnly: true, secure: true });

    return NextResponse.json(
      { message: "Logged in", status: true, type: "success", user: responseUser },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { message: "Internal server error.", status: false, type: "server" },
      { status: 500 }
    );
  }
}