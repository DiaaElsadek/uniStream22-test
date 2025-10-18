"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const headers = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
}

async function handelLogin(userToken: string): Promise<boolean> {
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;
    try {
        const res = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        const data = await res.json();
        return userToken === data[0]?.userToken;
    } catch {
        return false;
    }
}

async function handelRole(userToken: string): Promise<boolean> {
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        const data = await res.json();
        console.log(data[0]);
        console.log("Is Admin ? : ", "admin" === data[0]?.Role);
        return "admin" === data[0]?.Role;
    } catch {
        return false;
    }
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const userToken = localStorage.getItem("userToken");
            if (!userToken) return;

            const loggedIn = await handelLogin(userToken);
            setIsLogged(loggedIn);

            // if (!loggedIn && !pathname.startsWith("/login") && !pathname.startsWith("/signup")) {
            //     router.replace("/login");
            // }

            if ((pathname.startsWith("/dashboard") || pathname.startsWith("/dashboard/addnews")) &&
                !(await handelRole(userToken))) {
                router.replace("/home");
            }

            if ((pathname.startsWith("/login") || pathname.startsWith("/signup")) && loggedIn) {
                router.replace("/home");
            }
        };

        checkAuth();
    }, [pathname]);

    return <>{children}</>;
}
