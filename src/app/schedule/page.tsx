"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

type ScheduleItem = {
    id: number;
    subjectId: number;
    groupId?: number | null;
    startTime?: string | null;
    endTime?: string | null;
    location?: string | null;
    description?: string | null;
    day?: string | null;
};

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1";
const HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
};

async function handelRole(): Promise<boolean> {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, { method: "GET", headers: HEADERS });
        const data = await res.json();
        return "admin" === data[0]?.Role;
    } catch {
        return false;
    }
}

export default function SchedulePage() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scheduleByDay, setScheduleByDay] = useState<Record<string, ScheduleItem[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const academicId = localStorage.getItem("academicId");
                if (!academicId) {
                    router.replace("/login");
                    return;
                }

                const cached = localStorage.getItem("cachedSchedule");
                if (cached) {
                    setScheduleByDay(JSON.parse(cached));
                    setLoading(false);
                }

                const userRes = await fetch(`${API_URL}/AppUser?AcademicId=eq.${encodeURIComponent(academicId)}`, {
                    headers: HEADERS,
                });
                if (!userRes.ok) throw new Error(`AppUser fetch failed: ${userRes.status}`);

                const users = await userRes.json();
                if (!Array.isArray(users) || users.length === 0) throw new Error("User not found");
                const admin = await handelRole();
                setIsAdmin(admin);

                const user = users[0];
                let rawSubjects: any[] = [];
                if (Array.isArray(user.subjects)) rawSubjects = user.subjects;
                else if (typeof user.subjects === "string")
                    try {
                        rawSubjects = JSON.parse(user.subjects);
                    } catch {
                        rawSubjects = [];
                    }

                const subjectIds = Array.from(
                    new Set(
                        rawSubjects
                            .map((s: any) => {
                                const n = Number(s);
                                return Number.isNaN(n) ? null : n;
                            })
                            .filter(Boolean)
                    )
                ) as number[];

                if (subjectIds.length === 0) {
                    setScheduleByDay({});
                    setLoading(false);
                    return;
                }

                const idsStr = subjectIds.join(",");
                const scheduleRes = await fetch(`${API_URL}/Schedule?id=in.(${idsStr})`, { headers: HEADERS });
                if (!scheduleRes.ok) throw new Error(`Schedule fetch failed: ${scheduleRes.status}`);

                const scheduleItems: ScheduleItem[] = await scheduleRes.json();

                const grouped: Record<string, ScheduleItem[]> = {};
                scheduleItems.forEach((it) => {
                    const day = it.day ?? "Unknown";
                    if (!grouped[day]) grouped[day] = [];
                    grouped[day].push(it);
                });
                Object.keys(grouped).forEach((day) => {
                    grouped[day].sort((a, b) => a.id - b.id);
                });

                localStorage.setItem("cachedSchedule", JSON.stringify(grouped));
                setScheduleByDay(grouped);
                setLoading(false);
            } catch (err: any) {
                console.error(err);
                setError(err?.message || "Unknown error");
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const WEEK_DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const subjects_name = ["معالجة الصور الرقمية", "الحوسبة السحابية", "التنقيب على البيانات", "إتصالات البيانات", "مشروع تخرج 1"];
    const startTimes = ["9:00", "9:45", "10:40", "11:25", "12:20", "1:05", "2:00", "2:45"];
    const todayIndex = (new Date().getDay() + 1) % 7;

    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // دي معناها إن الصفحة رجعت من الكاش
                window.location.reload(); // إعادة تحميل كاملة للستايل
            }
        };

        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);


    return (
        <div
            className="
                relative min-h-screen text-gray-200 p-4 md:p-12 
                overflow-hidden flex flex-col items-center
                bg-[radial-gradient(circle_at_top_left,#0f172a,#1e293b)]
            "
        >
            {/* خلفية الأنيميشن */}
            <div
                className="
                    absolute top-0 left-0 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 
                    bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_4px)]
                    animate-[bgMove_20s_linear_infinite]
                    z-0
                "
            ></div>

            {/* Gradient border container */}
            <div
                className="
                    relative z-10 w-full max-w-[1600px] rounded-3xl shadow-2xl overflow-hidden
                    before:absolute before:inset-0 before:p-[2px] before:rounded-3xl
                    before:bg-[linear-gradient(270deg,#ff00cc,#3333ff,#00ffcc,#ffcc00)]
                    before:bg-[length:600%_600%]
                    before:animate-[gradientMove_8s_ease_infinite]
                "
            >
                {/* المحتوى الفعلي */}
                <div className="relative z-20 bg-[rgba(20,20,30,0.9)] rounded-3xl p-6 md:p-12">
                    {/* Navbar */}
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
                                    <button
                                        className="nav-btn hover:text-indigo-400"
                                        onClick={() => router.push("/dashboard/addnews")}
                                    >
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
                                <button
                                    className="nav-btn w-full hover:text-indigo-400 text-left"
                                    onClick={() => {
                                        router.push("/home");
                                        setMenuOpen(false);
                                    }}
                                >
                                    Home
                                </button>
                                <button
                                    className="nav-btn w-full hover:text-indigo-400 text-left"
                                    onClick={() => {
                                        router.push("/schedule");
                                        setMenuOpen(false);
                                    }}
                                >
                                    Table
                                </button>
                                <button
                                    className="nav-btn w-full hover:text-indigo-400 text-left"
                                    onClick={() => {
                                        router.push("/notes");
                                        setMenuOpen(false);
                                    }}
                                >
                                    Notes
                                </button>
                                <button
                                    className="nav-btn w-full hover:text-red-400 text-left"
                                    onClick={() => {
                                        localStorage.clear();
                                        router.replace("/login");
                                        setMenuOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </nav>

                    <div className="h-5" />
                    <h1 className="text-3xl font-bold mb-8 text-center mt-10 md:mt-2 lg:mt-0">Weekly Schedule</h1>

                    {loading ? (
                        <div className="flex items-center justify-center min-h-[40vh]">
                            <div className="relative p-10 text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-100 drop-shadow-lg animate-pulse">
                                    Checking schedule...
                                </h1>
                                <div className="mt-4">
                                    <div className="inline-block w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                                </div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400">Error: {error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {WEEK_DAYS.map((day) => (
                                <div
                                    key={day}
                                    className={`bg-gray-800 rounded-2xl p-6 shadow-lg relative overflow-hidden ${day === WEEK_DAYS[todayIndex] ? "bg-sky-900" : ""
                                        }`}
                                >
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-400">{day}</h2>
                                    {scheduleByDay[day] && scheduleByDay[day].length > 0 ? (
                                        scheduleByDay[day]
                                            .sort((a, b) => {
                                                const indexA = startTimes.indexOf(a.startTime ?? "");
                                                const indexB = startTimes.indexOf(b.startTime ?? "");
                                                return indexA - indexB;
                                            })
                                            .map((lec) => (
                                                <div
                                                    key={lec.id}
                                                    className="bg-gray-700/70 rounded-xl p-3 mb-3 hover:bg-indigo-600/30 transition"
                                                >
                                                    <h3 className="font-bold text-lg">
                                                        Subject: {subjects_name[lec.subjectId - 1] ?? `ID ${lec.subjectId}`}
                                                    </h3>
                                                    <p className="text-gray-300">
                                                        {lec.startTime ?? "-"} - {lec.endTime ?? "-"} | Room:{" "}
                                                        {lec.location ?? "-"}
                                                    </p>
                                                    {lec.description && (
                                                        <p className="text-gray-400 text-sm whitespace-pre-line">
                                                            {lec.description}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-indigo-300">
                                                        Group: {lec.groupId ?? "-"}
                                                    </p>
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-gray-400">No classes</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* زر Edit My Schedule */}
            <div className="w-full flex justify-center mt-16 mb-10 cursor-pointer">
                <button
                    onClick={() => router.push("/selectschedule")}
                    className="
      relative overflow-hidden group 
      px-10 py-4 text-lg font-bold rounded-full 
      text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
      shadow-[0_0_20px_rgba(147,51,234,0.6)] 
      transition-all duration-500 ease-out
      hover:scale-105 hover:shadow-[0_0_35px_rgba(236,72,153,0.8)]
      cursor-pointer
    "
                >
                    <span
                        className="
        absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)]
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-1000 ease-in-out
      "
                    ></span>
                    Edit My Schedule ✏️
                </button>
            </div>


            {/* الأنيميشنات */}
            {/* <style jsx global>{`
                @keyframes bgMove {
                    0% {
                        transform: rotate(0deg) translate(0, 0);
                    }
                    100% {
                        transform: rotate(360deg) translate(0, 0);
                    }
                }
                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style> */}
        </div>
    );
}
