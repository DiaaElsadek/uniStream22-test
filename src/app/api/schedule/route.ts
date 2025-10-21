import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1";
const HEADERS = {
    apikey: process.env.SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
    "Content-Type": "application/json",
};

export async function GET(req: NextRequest) {
    try {
        const userToken = req.nextUrl.searchParams.get("userToken");
        const academicId = req.nextUrl.searchParams.get("academicId");

        if (!academicId) return NextResponse.json({ status: false, message: "AcademicId missing" });

        // Fetch user
        const userRes = await fetch(`${API_URL}/AppUser?AcademicId=eq.${encodeURIComponent(academicId)}`, {
            headers: HEADERS,
        });
        if (!userRes.ok) throw new Error(`AppUser fetch failed: ${userRes.status}`);
        const users = await userRes.json();
        if (!Array.isArray(users) || users.length === 0) throw new Error("User not found");

        // Check admin
        let isAdmin = false;
        if (userToken) {
            const roleRes = await fetch(`${API_URL}/AppUser?userToken=eq.${userToken}`, {
                headers: HEADERS,
            });
            const roleData = await roleRes.json();
            isAdmin = roleData[0]?.Role === "admin";
        }

        // Get subject IDs
        const user = users[0];
        let rawSubjects: any[] = [];
        if (Array.isArray(user.subjects)) rawSubjects = user.subjects;
        else if (typeof user.subjects === "string")
            try {
                rawSubjects = JSON.parse(user.subjects);
            } catch {
                rawSubjects = [];
            }

        const subjectIds = Array.from(
            new Set(
                rawSubjects
                    .map((s: any) => {
                        const n = Number(s);
                        return Number.isNaN(n) ? null : n;
                    })
                    .filter(Boolean)
            )
        ) as number[];

        if (subjectIds.length === 0) return NextResponse.json({ scheduleByDay: {}, isAdmin });

        const idsStr = subjectIds.join(",");
        const scheduleRes = await fetch(`${API_URL}/Schedule?id=in.(${idsStr})`, { headers: HEADERS });
        if (!scheduleRes.ok) throw new Error(`Schedule fetch failed: ${scheduleRes.status}`);
        const scheduleItems = await scheduleRes.json();

        // Group by day
        const grouped: Record<string, typeof scheduleItems> = {};
        scheduleItems.forEach((it: any) => {
            const day = it.day ?? "Unknown";
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(it);
        });
        Object.keys(grouped).forEach((day) => {
            (grouped[day] as any[]).sort((a, b) => (a.id as number) - (b.id as number));
        });

        return NextResponse.json({ scheduleByDay: grouped, isAdmin });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ status: false, message: err.message || "Unknown error" }, { status: 500 });
    }
}
