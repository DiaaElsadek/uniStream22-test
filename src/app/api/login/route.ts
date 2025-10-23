// server-side route: app/api/login/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// دالة لتنظيف أي أكواد JavaScript أو HTML
function sanitizeInput(input: string): string {
  return input.replace(/<[^>]*>?/gm, "").replace(/script/gi, "").trim();
}

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
    const emailRaw = (body.email || "").toString().trim();
    const passwordRaw = (body.password || "").toString();

    // تنظيف المدخلات من أي أكواد ضارة
    const email = sanitizeInput(emailRaw);
    const password = sanitizeInput(passwordRaw);

    // فاليديشن أساسي
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required.", status: false, type: "validation" },
        { status: 400 }
      );
    }

    // السماح فقط بحروف وأرقام و @ و .
    const emailRegex = /^[A-Za-z0-9@.]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Email can only contain letters, numbers, '@', and '.'", status: false, type: "email" },
        { status: 400 }
      );
    }

    // كلمة المرور 8 حروف بالضبط
    if (password.length !== 8) {
      return NextResponse.json(
        { message: "Password must be exactly 8 characters long.", status: false, type: "password" },
        { status: 400 }
      );
    }

    // البحث عن المستخدم بالبريد الإلكتروني
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

    // مقارنة كلمة المرور (يُفضل لاحقًا عمل hash)
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid Email or Password.", status: false, type: "credentials" },
        { status: 401 }
      );
    }

    // استخدام التوكن من قاعدة البيانات
    const userToken = user.userToken ?? user.token ?? "";

    const responseUser = {
      academicId: user.AcademicId ?? user.academicId ?? "",
      email: user.email,
      fullName: user.fullName ?? "user",
      userToken,
      role: user.role ?? "user",
    };

    // حفظ الـ token في cookies بشكل آمن
    (await cookies()).set("userToken", userToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

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
