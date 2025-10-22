"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faTable,
    faStickyNote,
    faDashboard,
    faSignOutAlt,
    faArrowLeft,
    faBars,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function AddNewsPage() {
    const router = useRouter();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(true); // Assuming admin for this page

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        subjectId: 0,
        groupId: 0,
        week: 1,
        publishData: false,
        createdBy: "",
    });

    const subjects = [
        "معالجة الصور الرقمية",
        "الحوسبة السحابية",
        "التنقيب على البيانات",
        "اتصالات البيانات",
        "مشروع تخرج 1",
    ];
    const groups = ["global", "1", "2", "3", "4", "5", "6"];

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const showToast = (type: "success" | "error", message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    async function fetchNews() {
        setLoading(true);
        const res = await fetch("/api/dashboard/addnews", { method: "GET" });
        const json = await res.json();
        if (json.status) {
            setNews(json.data.sort((a: any, b: any) => b.id - a.id));
        }
        setLoading(false);
    }

    async function deleteNews(id: number) {
        const res = await fetch("/api/dashboard/addnews", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        const json = await res.json();
        if (json.status) {
            showToast("success", "✅ تم حذف الخبر بنجاح");
            setNews((prev) => prev.filter((n) => n.id !== id));
        } else showToast("error", "⚠️ حدث خطأ أثناء الحذف");
    }

    async function addOrEditNews() {
        const now = new Date().toISOString();
        const body = {
            ...formData,
            createdBy: localStorage.getItem("fullName"),
            createdAt: now,
        };

        const res = await fetch("/api/dashboard/addnews", {
            method: isEdit ? "PATCH" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(isEdit ? { id: editId, ...body } : body),
        });

        const json = await res.json();
        if (json.status) {
            showToast("success", isEdit ? "✅ تم التعديل" : "🎉 تم الإضافة بنجاح");
            fetchNews();
            setShowModal(false);
            setIsEdit(false);
            setEditId(null);
        } else showToast("error", "⚠️ حدث خطأ أثناء الحفظ");
    }

    useEffect(() => {
        fetchNews();
    }, []);

    function normalizeText(text: string) {
        return text?.toString().toLowerCase().trim().replace(/\s+/g, "");
    }

    const filteredNews = news.filter((item) => {
        const term = normalizeText(searchTerm);
        return (
            normalizeText(item.title).includes(term) ||
            normalizeText(item.content).includes(term) ||
            normalizeText(subjects[item.subjectId - 1] || "").includes(term) ||
            normalizeText(item.groupId).includes(term) ||
            normalizeText(item.week).includes(term) ||
            normalizeText(item.createdBy || "").includes(term) ||
            normalizeText(formatDateTime(item.createdAt)).includes(term)
        );
    });

    function formatDateTime(dateString: string) {
        if (!dateString) return "غير محدد";
        const date = new Date(dateString);
        return `${date.toLocaleDateString("ar-EG")} - ${date.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;
    }

    if (loading)
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 flex justify-center items-center relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                y: [0, -100, 0],
                                x: [0, Math.random() * 100 - 50, 0],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1, 0],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 2,
                                repeat: Infinity,
                                delay: i * 0.3,
                                ease: "easeInOut"
                            }}
                            className="absolute w-1 h-1 bg-indigo-400 rounded-full"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                        />
                    ))}
                </div>

                {/* Floating Geometric Shapes */}
                <motion.div
                    animate={{
                        rotate: 360,
                        y: [0, -20, 0],
                    }}
                    transition={{
                        rotate: {
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        y: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-purple-400/30 rounded-lg"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        y: [0, 15, 0],
                    }}
                    transition={{
                        rotate: {
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear"
                        },
                        y: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }}
                    className="absolute bottom-1/3 right-1/4 w-6 h-6 border-2 border-blue-400/30 rotate-45"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center relative z-10"
                >
                    {/* Main News Icon Container */}
                    <div className="relative mb-12">
                        {/* Outer Glow */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-xl"
                        />

                        {/* Animated News Icon */}
                        <motion.div
                            animate={{
                                y: [0, -25, 0],
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative text-8xl mb-4"
                        >
                            <motion.span
                                animate={{
                                    filter: [
                                        "drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))",
                                        "drop-shadow(0 0 30px rgba(168, 85, 247, 0.8))",
                                        "drop-shadow(0 0 20px rgba(99, 102, 241, 0.5))"
                                    ]
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                📰
                            </motion.span>
                        </motion.div>

                        {/* Orbiting Elements */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    rotate: 360,
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    rotate: {
                                        duration: 4 + i,
                                        repeat: Infinity,
                                        ease: "linear"
                                    },
                                    scale: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: i * 0.2
                                    }
                                }}
                                className="absolute w-4 h-4 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full"
                                style={{
                                    top: `${Math.cos((i * 60) * Math.PI / 180) * 80 + 50}%`,
                                    left: `${Math.sin((i * 60) * Math.PI / 180) * 80 + 50}%`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Multi-layer Spinner */}
                    <div className="relative mb-12">
                        {/* Outer Ring */}
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                rotate: {
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="w-32 h-32 border-4 border-indigo-400/30 border-t-indigo-400 border-r-purple-400 rounded-full mx-auto absolute inset-0"
                        />

                        {/* Middle Ring */}
                        <motion.div
                            animate={{
                                rotate: -360,
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                rotate: {
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="w-24 h-24 border-4 border-purple-400/40 border-t-purple-400 border-b-indigo-400 rounded-full mx-auto absolute inset-0 m-auto"
                        />

                        {/* Inner Core */}
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1],
                                backgroundColor: ["rgba(99, 102, 241, 0.3)", "rgba(168, 85, 247, 0.5)", "rgba(99, 102, 241, 0.3)"],
                            }}
                            transition={{
                                rotate: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear"
                                },
                                scale: {
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                },
                                backgroundColor: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }
                            }}
                            className="w-16 h-16 bg-indigo-400/30 rounded-full mx-auto absolute inset-0 m-auto backdrop-blur-sm"
                        >
                            {/* Pulsing Dot */}
                            <motion.div
                                animate={{
                                    scale: [0, 1, 0],
                                    opacity: [0, 1, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-3 h-3 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                            />
                        </motion.div>
                    </div>

                    {/* Text Content */}
                    <div className="relative mb-8">
                        {/* Main Title with Gradient Flow */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="mb-6"
                        >
                            <motion.h1
                                animate={{
                                    backgroundPosition: ["0%", "100%", "0%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-5xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent bg-[length:200%_auto] mb-4"
                            >
                                جاري تحميل الأخبار
                            </motion.h1>

                            {/* Animated Dots */}
                            <motion.div className="flex justify-center space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <motion.span
                                        key={i}
                                        animate={{
                                            opacity: [0, 1, 0],
                                            y: [0, -10, 0],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                            ease: "easeInOut"
                                        }}
                                        className="text-2xl text-purple-300"
                                    >
                                        .
                                    </motion.span>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Subtitle with Typewriter Effect */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-xl text-indigo-200/80 font-light mb-2"
                        >
                            يتم الآن تجهيز المحتوى
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2, duration: 1 }}
                            className="text-lg text-indigo-200/60 font-medium"
                        >
                            شكراً لصبرك
                        </motion.p>
                    </div>

                    {/* Advanced Progress Indicator */}
                    <div className="max-w-md mx-auto">
                        {/* Progress Bar Container */}
                        <div className="relative h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm mb-4">
                            {/* Animated Gradient Progress */}
                            <motion.div
                                animate={{
                                    x: ["-100%", "100%"],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
                            />

                            {/* Main Progress Bar */}
                            <motion.div
                                animate={{
                                    width: ["0%", "100%", "0%"],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full relative overflow-hidden"
                            >
                                {/* Shine Effect */}
                                <motion.div
                                    animate={{
                                        x: ["-100%", "100%"],
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                            </motion.div>
                        </div>

                        {/* Percentage Counter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="text-sm text-indigo-300/70 font-mono"
                        >
                            <motion.span
                                animate={{
                                    textShadow: [
                                        "0 0 0px rgba(99, 102, 241, 0)",
                                        "0 0 10px rgba(99, 102, 241, 0.5)",
                                        "0 0 0px rgba(99, 102, 241, 0)"
                                    ]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                جاري التحميل...
                            </motion.span>
                        </motion.div>
                    </div>

                    {/* Floating Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2 }}
                        className="flex justify-center space-x-4 mt-8"
                    >
                        {[
                            { icon: "⚡", text: "سريع", color: "text-yellow-400" },
                            { icon: "🔄", text: "محدث", color: "text-green-400" },
                            { icon: "🔒", text: "آمن", color: "text-blue-400" }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.1, y: -5 }}
                                className="flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10"
                            >
                                <span className={`text-lg ${item.color}`}>{item.icon}</span>
                                <span className="text-sm text-white/70">{item.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 text-white">
            {/* Enhanced Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? 'bg-slate-900/95 backdrop-blur-2xl shadow-2xl shadow-black/50 border-b border-slate-700/50 py-2'
                : 'bg-transparent py-4'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo and Back Button */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.push("/home")}
                                className="group flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 transform hover:scale-105 bg-slate-800/50 hover:bg-slate-700/50 px-4 py-2.5 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 backdrop-blur-sm"
                            >
                                <FontAwesomeIcon
                                    icon={faArrowLeft}
                                    className="text-cyan-400 group-hover:-translate-x-0.5 transition-transform duration-300"
                                />
                                <span className="font-semibold">Back</span>
                            </button>

                            <div className="w-px h-6 bg-slate-600/50"></div>

                            <div
                                className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300 tracking-tight"
                                onClick={() => router.push("/home")}
                            >
                                UniStream22
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-2">
                            {[
                                { path: '/home', icon: faHome, label: 'Home' },
                                { path: '/schedule', icon: faTable, label: 'Schedule' },
                                { path: '/notes', icon: faStickyNote, label: 'Notes' },
                                ...(isAdmin ? [{ path: '/dashboard/addnews', icon: faDashboard, label: 'Dashboard' }] : [])
                            ].map((item, index) => (
                                <button
                                    key={item.path}
                                    className="group flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-slate-800/50 border border-transparent hover:border-cyan-500/20 backdrop-blur-sm font-medium"
                                    onClick={() => router.push(item.path)}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <FontAwesomeIcon
                                        icon={item.icon}
                                        className="text-cyan-400 group-hover:scale-110 transition-transform duration-300 text-sm"
                                    />
                                    <span>{item.label}</span>
                                </button>
                            ))}

                            <div className="w-px h-6 bg-slate-600/50 mx-2"></div>

                            <button
                                className="group flex items-center gap-2 text-red-400 hover:text-red-300 px-4 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 backdrop-blur-sm font-medium"
                                onClick={() => {
                                    localStorage.clear();
                                    router.replace("/login");
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faSignOutAlt}
                                    className="group-hover:scale-110 transition-transform duration-300 text-sm"
                                />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden">
                            <button
                                className="text-slate-300 hover:text-white p-3 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                <FontAwesomeIcon
                                    icon={menuOpen ? faTimes : faBars}
                                    className="text-lg transition-all duration-300"
                                />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div
                        className={`lg:hidden transition-all duration-500 ease-out overflow-hidden ${menuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="bg-slate-800/95 backdrop-blur-2xl rounded-2xl p-4 space-y-2 border border-slate-700/50 shadow-2xl">
                            {[
                                { path: '/home', icon: faHome, label: 'Home' },
                                { path: '/schedule', icon: faTable, label: 'Schedule' },
                                { path: '/notes', icon: faStickyNote, label: 'Notes' },
                                ...(isAdmin ? [{ path: '/dashboard/addnews', icon: faDashboard, label: 'Dashboard' }] : [])
                            ].map((item) => (
                                <button
                                    key={item.path}
                                    className="w-full flex items-center gap-3 text-slate-300 hover:text-white p-4 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-slate-700/50 border border-transparent hover:border-cyan-500/20 font-medium"
                                    onClick={() => { router.push(item.path); setMenuOpen(false); }}
                                >
                                    <FontAwesomeIcon icon={item.icon} className="text-cyan-400 text-sm" />
                                    <span>{item.label}</span>
                                </button>
                            ))}
                            <button
                                className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 p-4 rounded-lg transition-all duration-300 transform hover:translate-x-2 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 font-medium"
                                onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-24 p-4 sm:p-6 lg:p-8">
                {/* Animated Background Elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
                </div>

                {/* Toast Notification */}
                <AnimatePresence>
                    {toast && (
                        <motion.div
                            initial={{ x: 300, opacity: 0, scale: 0.8 }}
                            animate={{ x: 0, opacity: 1, scale: 1 }}
                            exit={{ x: 300, opacity: 0, scale: 0.8 }}
                            transition={{ type: "spring", duration: 0.6 }}
                            className={`fixed top-24 right-6 px-6 py-4 rounded-2xl shadow-2xl font-bold z-50 border ${toast.type === "success"
                                ? "bg-gradient-to-r from-emerald-600/95 to-green-600/95 border-emerald-400/50 text-white backdrop-blur-xl"
                                : "bg-gradient-to-r from-rose-600/95 to-red-600/95 border-rose-400/50 text-white backdrop-blur-xl"
                                } backdrop-blur-sm`}
                        >
                            <div className="flex items-center gap-3">
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-xl"
                                >
                                    {toast.type === "success" ? "✨" : "⚠️"}
                                </motion.span>
                                <span className="text-sm">{toast.message}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto mt-10">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-center lg:text-right"
                            >
                                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-4 leading-tight">
                                    Dashboard
                                </h1>
                                <p className="text-lg text-indigo-200/80 font-medium">
                                    For Admins, Get Start and Add the News
                                </p>
                            </motion.div>

                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                {/* Add News Button */}
                                <motion.button
                                    whileHover={{
                                        scale: 1.05,
                                        boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
                                    }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setShowModal(true);
                                        setIsEdit(false);
                                        setFormData({
                                            title: "",
                                            content: "",
                                            subjectId: 0,
                                            groupId: 0,
                                            week: 1,
                                            publishData: false,
                                            createdBy: "",
                                        });
                                    }}
                                    className="group relative bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-xl border border-indigo-400/30 shadow-2xl shadow-indigo-500/25 transition-all duration-300"
                                >
                                    <span className="flex items-center gap-3 text-white cursor-pointer">
                                        <motion.span
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className="text-xl"
                                        >
                                            📰
                                        </motion.span>
                                        إضافة خبر جديد
                                        <motion.span
                                            whileHover={{ rotate: 90 }}
                                            className="text-2xl transition-transform duration-300"
                                        >
                                            +
                                        </motion.span>
                                    </span>
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </motion.button>
                            </div>
                        </div>

                        {/* Search Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-2xl mx-auto"
                        >
                            <div className="absolute inset-y-0 right-4 flex items-center pr-3 pointer-events-none">
                                <motion.span
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-indigo-300 text-xl"
                                >
                                    🔍
                                </motion.span>
                            </div>
                            <input
                                type="text"
                                placeholder="ابحث في الأخبار..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-4 pr-12 bg-white/5 border border-indigo-500/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-indigo-200/50 text-lg backdrop-blur-xl transition-all duration-300 text-white"
                            />
                        </motion.div>
                    </motion.div>

                    {/* News Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        {filteredNews.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="text-8xl mb-6"
                                >
                                    📰
                                </motion.div>
                                <h3 className="text-3xl font-bold text-indigo-200 mb-3">لا توجد أخبار</h3>
                                <p className="text-indigo-200/60 text-lg">ابدأ بإضافة أول خبر لك</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                                {filteredNews.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 25px 50px rgba(139, 92, 246, 0.15)"
                                        }}
                                        className="group relative bg-gradient-to-br from-white/5 to-white/10 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-xl hover:border-indigo-400/40 transition-all duration-500"
                                    >
                                        {/* Animated Gradient Border */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm group-hover:blur-0"></div>

                                        {/* Content */}
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-black bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight flex-1 pr-3">
                                                    {item.title}
                                                </h3>
                                                <motion.span
                                                    whileHover={{ scale: 1.1 }}
                                                    className="bg-indigo-500/30 text-indigo-100 px-3 py-1 rounded-full border border-indigo-400/30 text-sm font-bold whitespace-nowrap backdrop-blur-sm"
                                                >
                                                    الأسبوع {item.week}
                                                </motion.span>
                                            </div>

                                            <div className="mb-6 max-h-[120px] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500/30 scrollbar-track-indigo-500/10 rounded-lg bg-white/5 p-3 backdrop-blur-sm">
                                                <p className="text-indigo-100/90 leading-relaxed text-right pr-3 border-r-2 border-indigo-500/30">
                                                    {item.content}
                                                </p>
                                            </div>

                                            {/* Metadata Grid */}
                                            <div className="grid grid-cols-1 gap-3 mb-6">
                                                {[
                                                    { icon: "📘", label: "المادة", value: subjects[item.subjectId - 1] || "عام", color: "blue" },
                                                    { icon: "👥", label: "المجموعة", value: item.groupId || "الكل", color: "emerald" },
                                                    { icon: "✍️", label: "الناشر", value: item.createdBy || "Admin", color: "purple" },
                                                    { icon: "🕒", label: "التاريخ", value: formatDateTime(item.createdAt), color: "amber" }
                                                ].map((meta, i) => (
                                                    <motion.div
                                                        key={i}
                                                        whileHover={{ scale: 1.02 }}
                                                        className={`flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-${meta.color}-500/20 backdrop-blur-sm`}
                                                    >
                                                        <span className={`bg-${meta.color}-500/20 p-2 rounded-lg`}>
                                                            <span className={`text-${meta.color}-300 text-lg`}>{meta.icon}</span>
                                                        </span>
                                                        <div className="text-right flex-1">
                                                            <p className="text-indigo-200/70 text-xs font-semibold">{meta.label}</p>
                                                            <p className="text-white font-medium text-sm">{meta.value}</p>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 pt-4 border-t border-indigo-500/20">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setShowModal(true);
                                                        setIsEdit(true);
                                                        setEditId(item.id);
                                                        setFormData({
                                                            title: item.title,
                                                            content: item.content,
                                                            subjectId: item.subjectId,
                                                            groupId: item.groupId,
                                                            week: item.week,
                                                            publishData: item.publishData,
                                                            createdBy: item.createdBy,
                                                        });
                                                    }}
                                                    className="flex-1 group bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 font-bold flex items-center justify-center gap-2 backdrop-blur-sm"
                                                >
                                                    <motion.span
                                                        whileHover={{ rotate: 12 }}
                                                        className="transition-transform duration-300"
                                                    >
                                                        ✏️
                                                    </motion.span>
                                                    تعديل
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => deleteNews(item.id)}
                                                    className="flex-1 group bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-rose-500/25 font-bold flex items-center justify-center gap-2 backdrop-blur-sm"
                                                >
                                                    <motion.span
                                                        whileHover={{ scale: 1.2 }}
                                                        className="transition-transform duration-300"
                                                    >
                                                        🗑️
                                                    </motion.span>
                                                    حذف
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 p-6 sm:p-8 rounded-3xl w-full max-w-2xl border border-indigo-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-2xl"
                        >
                            <div className="text-center mb-8">
                                <motion.h2
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl font-black bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent mb-2"
                                >
                                    {isEdit ? "✏️ تعديل الخبر" : "📰 إضافة خبر جديد"}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-indigo-200/70"
                                >
                                    {isEdit ? "قم بتعديل بيانات الخبر" : "املأ البيانات لإضافة خبر جديد"}
                                </motion.p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="space-y-6 text-right"
                            >
                                <div>
                                    <label className="block text-sm font-bold text-indigo-200 mb-3">عنوان الخبر</label>
                                    <input
                                        type="text"
                                        placeholder="اكتب عنوان الخبر هنا..."
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-indigo-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-indigo-200/50 transition-all duration-300 text-white backdrop-blur-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-indigo-200 mb-3">محتوى الخبر</label>
                                    <textarea
                                        rows={4}
                                        placeholder="اكتب تفاصيل الخبر..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full p-4 bg-white/5 border border-indigo-500/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-indigo-200/50 transition-all duration-300 resize-none text-white backdrop-blur-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "المادة", type: "select", options: subjects, value: formData.subjectId, key: "subjectId" },
                                        { label: "المجموعة", type: "select", options: groups, value: formData.groupId, key: "groupId" },
                                        { label: "الأسبوع", type: "number", value: formData.week, key: "week" }
                                    ].map((field, i) => (
                                        <div key={i}>
                                            <label className="block text-sm font-bold text-indigo-200 mb-3">{field.label}</label>
                                            {field.type === "select" ? (
                                                <select
                                                    value={field.value}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: Number(e.target.value) })}
                                                    className="w-full p-4 bg-white/5 border border-indigo-500/30 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 text-white backdrop-blur-sm"
                                                >
                                                    <option value={0}>عام (Global)</option>
                                                    {field.options?.map((option, idx) => (
                                                        <option key={idx + 1} value={idx + 1}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="number"
                                                    placeholder="مثلاً: 5"
                                                    value={field.value || ""}
                                                    onChange={(e) => setFormData({ ...formData, [field.key]: Number(e.target.value) })}
                                                    className="w-full p-4 bg-white/5 border border-indigo-500/30 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-indigo-200/50 transition-all duration-300 text-white backdrop-blur-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-indigo-500/30">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setShowModal(false)}
                                        className="w-full sm:w-auto bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-bold text-indigo-200 transition-all duration-300 border border-indigo-500/30 hover:border-indigo-400/50 backdrop-blur-sm"
                                    >
                                        إلغاء
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={addOrEditNews}
                                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 backdrop-blur-sm"
                                    >
                                        <span className="flex items-center gap-2 justify-center">
                                            <motion.span
                                                animate={isEdit ? { rotate: [0, 360] } : { scale: [1, 1.2, 1] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                {isEdit ? "💾" : "➕"}
                                            </motion.span>
                                            {isEdit ? "تعديل الخبر" : "إضافة الخبر"}
                                        </span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
        .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
        }
        .scrollbar-thumb-indigo-500\/30::-webkit-scrollbar-thumb {
            background-color: rgba(99, 102, 241, 0.3);
            border-radius: 10px;
        }
        .scrollbar-track-indigo-500\/10::-webkit-scrollbar-track {
            background-color: rgba(99, 102, 241, 0.1);
            border-radius: 10px;
        }
        `}</style>
        </div>
    );
}