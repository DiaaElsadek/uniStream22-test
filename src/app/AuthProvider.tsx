import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function checkUser(userToken: string) {
    try {
        const res = await fetch(`${SUPA_URL}/rest/v1/AppUser?userToken=eq.${userToken}`, {
            headers: {
                apikey: SUPA_SERVICE_KEY,
                Authorization: `Bearer ${SUPA_SERVICE_KEY}`,
            },
            cache: "no-store",
        });

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return null;
        return data[0];
    } catch {
        return null;
    }
}

export default async function AuthProvider({ children }: { children: React.ReactNode }) {
    const cookieStore = cookies();
    const userToken = cookieStore.get("userToken")?.value || null;
    const pathname = ""; // السيرفر ميقدرش يجيب pathname مباشرة — ممكن نستبدله بخاصية route segment لو محتاجين

    // لو مفيش userToken، رجّع المستخدم لصفحة login
    if (!userToken) {
        redirect("/login");
    }

    const user = await checkUser(userToken);
    if (!user) {
        redirect("/login");
    }

    // لو المستخدم Admin فقط يدخل dashboard
    if (user.Role !== "admin" && (pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/addnews"))) {
        redirect("/home");
    }

    return <>{children}</>;
}
