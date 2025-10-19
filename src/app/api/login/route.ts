// Server Component
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required.", status: false },
        { status: 400 }
      );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // بنجيب اليوزر من Supabase بناءً على الإيميل
    const encodedEmail = encodeURIComponent(email);
    const url = `${SUPABASE_URL}/rest/v1/AppUser?email=eq.${encodedEmail}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Error connecting to database.", status: false },
        { status: 500 }
      );
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { message: "User not found.", status: false, type: "not_found" },
        { status: 404 }
      );
    }

    const user = data[0];

    if (password === user.password) {
      // تسجيل الدخول ناجح
      return NextResponse.json({
        message: "Login successful.",
        status: true,
        type: "success",
        user: {
          academicId: user?.AcademicId ?? "",
          email: user?.email ?? "",
          fullName: user?.fullName ?? "",
          userToken: user?.userToken ?? "",
          role: user?.role ?? "",
        },
      });
    } else {
      return NextResponse.json(
        { message: "Invalid email or password.", status: false, type: "credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Unexpected server error.", status: false },
      { status: 500 }
    );
  }
}
