import { NextRequest, NextResponse } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { selected, userToken } = body;

        if (!userToken || !selected) {
            return NextResponse.json({ status: false, message: "Missing data" }, { status: 400 });
        }

        const subjects = [
            "معالجة الصور الرقمية",
            "الحوسبة السحابية",
            "التنقيب عن البيانات",
            "اتصالات البيانات",
            "مشروع تخرج 1",
        ];

        let chosenIds: number[] = [];
        let chosenSubjects: number[] = [];

        for (let i = 0; i < subjects.length; i++) {
            const subjName = subjects[i];
            const groupId = selected[subjName];
            if (groupId) {
                const subjectId = i + 1;

                const res = await fetch(
                    `${SUPA_URL}/rest/v1/Schedule?subjectId=eq.${subjectId}&groupId=eq.${groupId}`,
                    {
                        headers: {
                            apikey: SUPA_KEY,
                            Authorization: `Bearer ${SUPA_KEY}`,
                        },
                    }
                );
                const data = await res.json();

                if (data?.length === 1) chosenIds.push(data[0].id);
                else if (data?.length === 2) {
                    chosenIds.push(data[0].id);
                    chosenIds.push(data[1].id);
                }

                chosenSubjects.push(subjectId);
            }
        }

        // جلب بيانات اليوزر
        const userRes = await fetch(
            `${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`,
            {
                headers: {
                    apikey: SUPA_KEY,
                    Authorization: `Bearer ${SUPA_KEY}`,
                },
            }
        );

        const userData = await userRes.json();
        if (!userData.length)
            return NextResponse.json({ status: false, message: "User not found" }, { status: 404 });

        const userId = userData[0].id;

        // Update AppUser
        const updateRes = await fetch(`${SUPA_URL}/rest/v1/AppUser?id=eq.${userId}`, {
            method: "PATCH",
            headers: {
                apikey: SUPA_KEY,
                Authorization: `Bearer ${SUPA_KEY}`,
                "Content-Type": "application/json",
                Prefer: "return=representation",
            },
            body: JSON.stringify({ subjects: chosenIds, subjectsId: chosenSubjects }),
        });

        const updatedUser = await updateRes.json();

        return NextResponse.json({
            status: true,
            message: "Subjects updated successfully ✅",
            user: updatedUser,
        });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json({ status: false, message: "Internal server error" }, { status: 500 });
    }
}
