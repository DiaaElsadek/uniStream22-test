import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPA_URL = process.env.SUPABASE_URL!;
const SUPA_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// 🔍 دالة للتحقق من المستخدم في Supabase
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

// 🔒 الميدل وير
export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // الصفحات العامة اللي مش محتاجة تسجيل دخول
    const publicRoutes = ["/login", "/signup", "/"];

    // لو الصفحة عامة، نسمح بالمرور
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const userToken = req.cookies.get("userToken")?.value || null;

    // لو مفيش userToken → رجع المستخدم للـ login
    if (!userToken) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    const user = await checkUser(userToken);
    if (!user) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    }

    // لو المستخدم مش admin وبيحاول يدخل على dashboard → نرجعه للـ home
    if (user.Role !== "admin" && (pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/addnews"))) {
        const homeUrl = new URL("/home", req.url);
        return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
}

// ✅ الصفحات اللي يتطبق عليها الميدل وير
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
