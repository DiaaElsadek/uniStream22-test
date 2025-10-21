"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

async function checkUser(userToken: string) {
    try {
        const res = await fetch(`/api/auth?userToken=${userToken}`);
        const data = await res.json();
        if (!data.status) return null;
        return data.user;
    } catch {
        return null;
    }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const userToken = localStorage.getItem("userToken");
            if (!userToken) return;

            const user = await checkUser(userToken);
            const loggedIn = !!user;
            setIsLogged(loggedIn);
            console.log(loggedIn);

            if (!loggedIn && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
                router.replace("/login");
                return;
            }

            // حماية المسارات الخاصة بالأدمن فقط
            if ((pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/addnews")) &&
                user?.Role !== "admin") {
                router.replace("/home");
                return;
            }

            // لو المستخدم بالفعل داخل، ميقدرش يدخل صفحة اللوجين أو التسجيل
            if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && loggedIn) {
                router.replace("/home");
            }
        };

        verifyUser();
    }, [pathname]);

    return <>{children}</>;
}
