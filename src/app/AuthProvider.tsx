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

    // ✅ نحاول نجيب الـ pathname من الكوكي (لو بتحفظه) أو نستخدم فلاج بسيط
    const currentUrl = typeof window === "undefined" ? "" : window.location.pathname;

    // ✅ استثناء صفحات معينة زي login و signup
    const publicRoutes = ["/login", "/signup"];

    // ⚠️ لو المستخدم في صفحة عامة، مفيش داعي نعمل redirect
    if (publicRoutes.includes(currentUrl)) {
        return <>{children}</>;
    }

    // ✅ لو مفيش userToken → redirect
    if (!userToken) {
        redirect("/login");
    }

    const user = await checkUser(userToken);
    if (!user) {
        redirect("/login");
    }

    // ✅ لو المستخدم مش admin وداخل على dashboard
    if (user.Role !== "admin" && currentUrl.startsWith("/dashboard")) {
        redirect("/home");
    }

    return <>{children}</>;
}
