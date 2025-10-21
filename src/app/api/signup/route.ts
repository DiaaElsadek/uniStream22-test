"use server";

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
  try {
    const { academicId, email, password, fullName, userToken } = await req.json();
    const finalToken = userToken || randomUUID();

    // تحقق من تكرار الـ Academic ID
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

    // تحقق من تكرار الإيميل
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

    // إدخال المستخدم الجديد
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
        userToken: finalToken,
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
