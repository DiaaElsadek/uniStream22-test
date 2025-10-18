// app/api/signup/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const res = await fetch(
        "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser",
        {
            method: "POST",
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                AcademicId: body.academicId,
                email: body.email,
                password: body.password,
                Role: "user",
                fullName: body.fullName,
                userToken: body.userToken,
            }),
        }
    );
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    return NextResponse.json({ success: true, data });
}
