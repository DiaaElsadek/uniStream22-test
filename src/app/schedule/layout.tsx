"use client";
import { useEffect } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // بيشتغل لما الصفحة ترجع من الكاش
        window.addEventListener("pageshow", (event) => {
            if (event.persisted) {
                // Reload بسيط عشان يرجّع كل ملفات CSS
                window.location.reload();
            }
        });
    }, []);

    return <>
        {children}
    </>
}
