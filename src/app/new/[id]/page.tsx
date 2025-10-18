"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/News";
const HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
};

export default function NewsDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [newsItem, setNewsItem] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const subjects = [
        "معالجة الصور الرقمية",
        "الحوسبة السحابية",
        "التنقيب على البيانات",
        "إتصالات البيانات",
        "مشروع تخرج 1",
    ];

    useEffect(() => {
        if (!id) return;

        const role = localStorage.getItem("role");
        setIsAdmin(role === "admin");

        const fetchNews = async () => {
            try {
                const res = await fetch(`${API_URL}?id=eq.${id}`, { headers: HEADERS });
                const data = await res.json();
                setNewsItem(data[0] || null);
            } catch (error) {
                console.error("Error fetching news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();

        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [id]);

    if (loading)
        return (
            <div className="login-bg flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
                {/* خلفية أنيميشن دوّارة */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-bg-spin opacity-70"></div>

                {/* دوائر طاقة متحركة */}
                <div className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower"></div>

                {/* اللوجو أو العنوان */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-lg animate-text-shine">
                    Loading...
                </h1>

                {/* سبينر متطور */}
                <div className="mt-8 w-16 h-16 border-[6px] border-t-transparent border-indigo-400 rounded-full animate-spin-fast shadow-[0_0_25px_rgba(99,102,241,0.6)]"></div>
            </div>

        );

    if (!newsItem)
        return (
            <div className="login-bg flex items-center justify-center min-h-screen text-gray-400 text-lg">
                ❌ لم يتم العثور على الخبر المطلوب
            </div>
        );

    return (
        <div
            className="login-bg min-h-screen flex flex-col text-white px-5 pb-20 relative overflow-hidden"
            style={{
                background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(100,200,255,0.08), #0f172a)`,
            }}
        >
            {/* 🌌 Navbar */}
            <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[80%] z-50 
                bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-2xl 
                border border-gray-700/30 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
                    <div
                        className="text-2xl font-bold text-indigo-400 drop-shadow-md cursor-pointer"
                        onClick={() => router.push("/home")}
                    >
                        UniStream22
                    </div>

                    <div className="hidden md:flex gap-6">
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/home")}>
                            Home
                        </button>
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/schedule")}>
                            Table
                        </button>
                        <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/notes")}>
                            Notes
                        </button>
                        {isAdmin && (
                            <button className="nav-btn hover:text-indigo-400" onClick={() => router.push("/dashboard/addnews")}>
                                Dashboard
                            </button>
                        )}
                        <button
                            className="nav-btn hover:text-red-400 text-red-400"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                        >
                            Logout
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button
                            className="text-indigo-400 focus:outline-none"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="text-2xl transition-transform duration-300"
                            />
                        </button>
                    </div>
                </div>

                <div
                    className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${menuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}
                >
                    <div className="flex flex-col bg-gray-900/95 backdrop-blur-lg rounded-b-2xl p-3 gap-2 border-t border-gray-700/30">
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/home"); setMenuOpen(false); }}>
                            Home
                        </button>
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/schedule"); setMenuOpen(false); }}>
                            Table
                        </button>
                        <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/notes"); setMenuOpen(false); }}>
                            Notes
                        </button>
                        {isAdmin && (
                            <button className="nav-btn w-full hover:text-indigo-400 text-left" onClick={() => { router.push("/dashboard/addnews"); setMenuOpen(false); }}>
                                Dashboard
                            </button>
                        )}
                        <button className="nav-btn w-full hover:text-red-400 text-left" onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* ✨ محتوى الخبر */}
            <div className="pt-32 flex flex-col items-center justify-start">
                <div className="max-w-4xl w-full text-center mb-10 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-bold text-indigo-400 drop-shadow-md mb-6">
                        {newsItem.title == "" ? "No Title" : newsItem.title}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-4 text-sm mb-8 animate-fadeIn">
                        {[
                            {
                                icon: "📚",
                                label: subjects[newsItem.subjectId - 1] || "غير محدد",
                                color: "from-indigo-500/30 to-purple-500/30",
                            },
                            {
                                icon: "🗓",
                                label: `Week ${newsItem.week ?? "—"}`,
                                color: "from-green-400/30 to-emerald-500/30",
                            },
                            {
                                icon: "👥",
                                label: `Group ${newsItem.groupId === 0 ? "global" : newsItem.groupId}`,
                                color: "from-pink-500/30 to-rose-500/30",
                            },
                            {
                                icon: "📅",
                                label: newsItem.createdAt
                                    ? new Date(newsItem.createdAt).toLocaleDateString("en")
                                    : "—",
                                color: "from-blue-500/30 to-cyan-500/30",
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className={`flex items-center gap-2 bg-gradient-to-br ${item.color} 
                        text-gray-200 px-4 py-2 rounded-xl shadow-md 
                        border border-white/10 backdrop-blur-md 
                        hover:scale-105 hover:shadow-lg 
                        hover:border-white/20 transition-all duration-300 
                        animate-slideUp`}
                                style={{ animationDelay: `${index * 0.15}s` }}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <article
                    className="news-card max-w-4xl w-full p-8 text-gray-200 leading-relaxed tracking-wide relative overflow-hidden animate-slideUp rounded-2xl shadow-2xl border border-gray-700/30"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(30,30,50,0.9), rgba(15,15,25,0.95))",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-70"></div>

                    <div
                        className={`relative z-10 text-lg whitespace-pre-line ${/[\u0600-\u06FF]/.test(newsItem.content) ? "text-right" : "text-left"
                            }`}
                    >
                        {newsItem.content
                            ? newsItem.content.split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g).map((part: string, index: number) => {
                                if (/^(https?:\/\/|www\.)/.test(part)) {
                                    const url = part.startsWith("http") ? part : `https://${part}`;
                                    return (
                                        <a
                                            key={index}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-indigo-400 underline hover:text-indigo-300 break-words"
                                        >
                                            {part}
                                        </a>
                                    );
                                } else {
                                    return part;
                                }
                            })
                            : "No Description"}
                    </div>
                </article>
            </div>
        </div>
    );
}
