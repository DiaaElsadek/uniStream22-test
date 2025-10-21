// src/app/api/auth/checkUser/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
    try {
        const userToken = req.nextUrl.searchParams.get("userToken");
        if (!userToken) {
            return NextResponse.json({ status: false, message: "Missing user token" }, { status: 400 });
        }

        const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
            },
        });

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json({ status: false, message: "User not found" }, { status: 404 });
        }

        const user = data[0];
        return NextResponse.json({
            status: true,
            user: {
                fullName: user.fullName,
                email: user.email,
                Role: user.Role,
                userToken: user.userToken,
            },
        });
    } catch (error) {
        console.error("Auth check error:", error);
        return NextResponse.json({ status: false, message: "Server error" }, { status: 500 });
    }
}
