// src/app/api/home/route.ts
import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function fetchUser(userToken: string) {
    const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
        headers: {
            apikey: SUPA_SERVICE_KEY,
            Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
        },
    });
    const data = await res.json();
    return data?.[0];
}

export async function GET(req: NextRequest) {
    try {
        const userToken = req.nextUrl.searchParams.get("userToken");
        if (!userToken)
            return NextResponse.json({ status: false, message: "No user token provided" }, { status: 400 });

        const user = await fetchUser(userToken);
        if (!user)
            return NextResponse.json({ status: false, message: "User not found" }, { status: 404 });

        const res = await fetch(`${SUPA_URL}/rest/v1/News`, {
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
            },
        });
        const newsData = await res.json();

        return NextResponse.json({
            status: true,
            user: {
                Role: user.Role,
                subjectsId: user.subjectsId,
            },
            news: newsData,
        });
    } catch (err) {
        console.error("Home route error:", err);
        return NextResponse.json({ status: false, message: "Server error" }, { status: 500 });
    }
}
