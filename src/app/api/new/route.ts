"use server";

import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
    try {
        const id = req.nextUrl.searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Missing id parameter.", status: false, type: "id" },
                { status: 400 }
            );
        }

        const res = await fetch(`${SUPA_URL}/rest/v1/News?id=eq.${id}`, {
            method: "GET",
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("Fetch error:", errText);
            return NextResponse.json(
                { message: "Failed to fetch news.", status: false, type: "server" },
                { status: 500 }
            );
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return NextResponse.json(
                { message: "No news found with this id.", status: false, type: "not_found", data: [] },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "News fetched successfully!",
            status: true,
            type: "success",
            data,
        });
    } catch (error) {
        console.error("Error fetching news:", error);
        return NextResponse.json(
            { message: "Internal server error.", status: false, type: "error" },
            { status: 500 }
        );
    }
}
