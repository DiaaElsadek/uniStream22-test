// app/api/auth/checkUser/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
    try {
        const userToken = req.nextUrl.searchParams.get("userToken");
        if (!userToken) return NextResponse.json({ status: false, message: "No token" }, { status: 400 });

        const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
            method: "GET",
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (data.length === 0) return NextResponse.json({ status: false, message: "User not found" }, { status: 404 });

        return NextResponse.json({ status: true, user: data[0] });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: false, message: "Server error" }, { status: 500 });
    }
}
