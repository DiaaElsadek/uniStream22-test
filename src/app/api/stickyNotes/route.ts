"use server";

import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * جلب جميع الملاحظات الخاصة بمستخدم عبر userToken
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userToken = searchParams.get("userToken");
    if (!userToken)
        return NextResponse.json({ message: "Missing userToken" }, { status: 400 });

    const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
        method: "GET",
        headers: {
            apikey: SUPA_SERVICE_KEY,
            Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        },
    });

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0)
        return NextResponse.json({ message: "User not found" }, { status: 404 });

    const stickyNotes = data[0]?.stickyNotes ?? [];
    return NextResponse.json({ stickyNotes, status: true }, { status: 200 });
}

/**
 * تحديث الملاحظات لـ مستخدم محدد
 */
export async function PATCH(req: NextRequest) {
    try {
        const { userToken, stickyNotes } = await req.json();
        if (!userToken)
            return NextResponse.json({ message: "Missing userToken" }, { status: 400 });

        const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
            method: "PATCH",
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
            },
            body: JSON.stringify({ stickyNotes }),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error("PATCH error:", err);
            return NextResponse.json({ message: "Failed to update notes" }, { status: 500 });
        }

        const data = await res.json();
        return NextResponse.json({ message: "Notes updated successfully!", data, status: true });
    } catch (err) {
        console.error("PATCH catch:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
