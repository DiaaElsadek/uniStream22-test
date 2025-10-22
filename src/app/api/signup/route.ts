"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { academicId, email, password, fullName, userToken } = await req.json();

    // ========== VALIDATION SECTION ==========
    if (!academicId || !email || !password || !fullName || !userToken) {
      return NextResponse.json(
        { message: "All fields are required.", status: false, type: "validation" },
        { status: 400 }
      );
    }

    if (!/^\d{8}$/.test(academicId)) {
      return NextResponse.json(
        { message: "Academic ID must be exactly 8 digits.", status: false, type: "academicId" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please enter a valid email address.", status: false, type: "email" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "Password must be at least 8 characters long.", status: false, type: "password" },
        { status: 400 }
      );
    }

    if (fullName.trim().length < 3) {
      return NextResponse.json(
        { message: "Full name must be at least 3 characters long.", status: false, type: "fullName" },
        { status: 400 }
      );
    }

    // ========== CHECK DUPLICATES ==========
    const resAcad = await fetch(`${SUPA_URL}/rest/v1/AppUser?AcademicId=eq.${academicId}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });
    const dataAcad = await resAcad.json();
    if (Array.isArray(dataAcad) && dataAcad.length > 0) {
      return NextResponse.json(
        { message: "This Academic ID is already registered.", status: false, type: "academicId" },
        { status: 400 }
      );
    }

    const resEmail = await fetch(`${SUPA_URL}/rest/v1/AppUser?email=eq.${email}`, {
      method: "GET",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
      },
    });
    const dataEmail = await resEmail.json();
    if (Array.isArray(dataEmail) && dataEmail.length > 0) {
      return NextResponse.json(
        { message: "This email is already registered.", status: false, type: "email" },
        { status: 400 }
      );
    }

    // ========== INSERT NEW USER ==========
    const insertRes = await fetch(`${SUPA_URL}/rest/v1/AppUser`, {
      method: "POST",
      headers: {
        apikey: SUPA_SERVICE_KEY,
        Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        AcademicId: academicId,
        email,
        password,
        fullName,
        userToken,
      }),
    });

    if (!insertRes.ok) {
      const errText = await insertRes.text();
      console.error("Insert error:", errText);
      return NextResponse.json(
        { message: "Failed to register user.", status: false, type: "server" },
        { status: 500 }
      );
    }

    const user = await insertRes.json();

    (await cookies()).set("userToken", userToken, { httpOnly: true, secure: true });

    return NextResponse.json({
      message: "Registered successfully!",
      status: true,
      type: "success",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Internal server error.", status: false, type: "error" },
      { status: 500 }
    );
  }
}
