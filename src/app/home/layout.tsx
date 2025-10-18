import type { Metadata } from "next";
import "./style.css";
import InstallPrompt from "./InstallPrompt";

export const metadata: Metadata = {
    title: "uniStream22",
    description: "كل أخبار وجداول الدفعة في مكان واحد.",
    icons: {
        icon: "/uniStream.png",
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <InstallPrompt />
            {children}
        </>
    );
}
