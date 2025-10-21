"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    faBars,
    faTimes,
    faArrowLeft,
    faShare,
    faCalendar,
    faUsers,
    faBook,
    faStar,
    faHome,
    faTable,
    faStickyNote,
    faDashboard,
    faSignOutAlt,
    faLink,
    faNewspaper,
    faClock,
    faExclamationTriangle,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./style.css";

export default function NewsDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id as string;

    const [newsItem, setNewsItem] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!id) return;

        const role = localStorage.getItem("role");
        setIsAdmin(role === "admin");

        const fetchNews = async () => {
            try {
                const res = await fetch(`/api/new?id=${id}`, { method: "GET" });
                const data = await res.json();

                if (data.status && Array.isArray(data.data) && data.data.length > 0) {
                    setNewsItem(data.data[0]);
                } else {
                    setNewsItem(null);
                }
            } catch (error) {
                console.error("Error fetching news:", error);
                setNewsItem(null);
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

    const shareNews = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: newsItem.title,
                    text: newsItem.content?.substring(0, 100) + '...',
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // يمكن إضافة toast notification هنا
            alert('تم نسخ الرابط!');
        }
    };

    if (loading)
        return (
            <div className="loading-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>

                {/* Floating Particles */}
                <div className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-particle-float-1"></div>
                <div className="absolute w-80 h-80 bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-particle-float-2"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-full blur-3xl animate-particle-float-3"></div>

                {/* Main Loading Content */}
                <div className="relative z-20 text-center space-y-8">
                    {/* Animated Logo/Icon */}
                    <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl rotate-45 animate-logo-spin mx-auto shadow-2xl shadow-blue-500/25 relative">
                            <div className="absolute inset-3 bg-slate-900 rounded-2xl"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-3xl blur-xl animate-pulse"></div>
                    </div>

                    {/* Animated Text */}
                    <div className="space-y-4">
                        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 animate-text-glow leading-tight">
                            Loading
                        </h1>
                        <p className="text-slate-400 text-lg font-medium animate-pulse">
                            جاري تحميل المحتوى الرائع...
                        </p>
                    </div>

                    {/* Advanced Loading Bar */}
                    <div className="w-80 mx-auto bg-slate-700/50 rounded-full h-2 overflow-hidden backdrop-blur-sm border border-slate-600/30">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-loading-bar shadow-lg shadow-blue-500/50"></div>
                    </div>

                    {/* Loading Indicators */}
                    <div className="flex justify-center space-x-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 150}ms` }}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        );

    if (!newsItem)
        return (
            <div className="error-container min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-red-900/20 to-purple-900/20"></div>
                <div className="absolute w-full h-1/2 bg-gradient-to-t from-slate-900 via-transparent to-transparent bottom-0"></div>

                {/* Animated Elements */}
                <div className="absolute w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000 bottom-32 right-32"></div>

                <div className="relative z-10 text-center space-y-8 px-4">
                    {/* Animated Icon */}
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl rotate-45 mx-auto shadow-2xl shadow-red-500/25 flex items-center justify-center">
                            <FontAwesomeIcon
                                icon={faExclamationTriangle}
                                className="text-white text-3xl -rotate-45"
                            />
                        </div>
                        <div className="absolute -inset-4 bg-red-500/20 rounded-2xl blur-xl animate-ping"></div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                            لم يتم العثور على الخبر
                        </h1>
                        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                            الخبر المطلوب غير موجود أو قد تم إزالته. يمكنك العودة للصفحة الرئيسية واستكشاف الأخبار الأخرى.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => router.push("/home")}
                            className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 font-semibold flex items-center gap-3"
                        >
                            <FontAwesomeIcon icon={faHome} className="group-hover:scale-110 transition-transform" />
                            العودة للرئيسية
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="group border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-3"
                        >
                            <FontAwesomeIcon icon={faClock} className="group-hover:rotate-180 transition-transform" />
                            إعادة المحاولة
                        </button>
                    </div>
                </div>
            </div>
        );

    return (
        <div className="news-details-page min-h-screen flex flex-col relative overflow-hidden bg-slate-900">
            {/* Dynamic Background with Mouse Interaction */}
            <div
                className="fixed inset-0 transition-opacity duration-1000"
                style={{
                    background: `
                        radial-gradient(800px at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.15), transparent 60%),
                        radial-gradient(600px at ${mousePos.x * 0.8}px ${mousePos.y * 0.8}px, rgba(168, 85, 247, 0.1), transparent 50%),
                        radial-gradient(400px at ${mousePos.x * 1.2}px ${mousePos.y * 1.2}px, rgba(236, 72, 153, 0.08), transparent 40%)
                    `,
                }}
            ></div>

            {/* Static Background Layers */}
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-indigo-900/30"></div>
            <div
                className="fixed inset-0"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            ></div>


            {/* Animated Background Elements */}
            <div className="fixed w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-orbital-1 -top-48 -left-48"></div>
            <div className="fixed w-80 h-80 bg-purple-500/8 rounded-full blur-3xl animate-orbital-2 top-1/2 -right-40"></div>
            <div className="fixed w-64 h-64 bg-blue-500/12 rounded-full blur-3xl animate-orbital-3 bottom-32 left-1/4"></div>

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
                                UniStream
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
            <main className="flex-1 pt-32 pb-20 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-8">
                        {/* Header Section */}
                        <section className="text-center space-y-8 animate-content-fade">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-3 rounded-2xl border border-cyan-500/20 backdrop-blur-sm">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-sm" />
                                <span className="text-cyan-300 font-semibold text-sm tracking-wide">NEWS DETAILS</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 leading-tight tracking-tight drop-shadow-2xl">
                                {newsItem.title === "" ? "Untitled" : newsItem.title}
                            </h1>

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto animate-stagger">
                                {[
                                    {
                                        icon: faBook,
                                        label: ["معالجة الصور الرقمية", "الحوسبة السحابية", "التنقيب على البيانات", "إتصالات البيانات", "مشروع تخرج 1"][newsItem.subjectId - 1] || "غير محدد",
                                        gradient: "from-cyan-500 to-blue-500",
                                        delay: 0,
                                    },
                                    {
                                        icon: faCalendar,
                                        label: `Week ${newsItem.week ?? "—"}`,
                                        gradient: "from-emerald-500 to-green-500",
                                        delay: 1,
                                    },
                                    {
                                        icon: faUsers,
                                        label: `Group ${newsItem.groupId === 0 ? "Global" : newsItem.groupId}`,
                                        gradient: "from-purple-500 to-pink-500",
                                        delay: 2,
                                    },
                                    {
                                        icon: faClock,
                                        label: newsItem.createdAt
                                            ? new Date(newsItem.createdAt).toLocaleDateString("en-US")
                                            : "—",
                                        gradient: "from-orange-500 to-red-500",
                                        delay: 3,
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
                                        style={{ animationDelay: `${item.delay * 150}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`bg-gradient-to-br ${item.gradient} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                <FontAwesomeIcon icon={item.icon} className="text-white text-lg" />
                                            </div>
                                            <div className="text-left flex-1">
                                                <p className="text-slate-400 text-sm font-medium mb-1">{
                                                    index === 0 ? "Subject" :
                                                        index === 1 ? "Week" :
                                                            index === 2 ? "Group" : "Date"
                                                }</p>
                                                <p className="text-white font-semibold text-lg">{item.label}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Content Section */}
                        <section className="grid grid-cols-1 xl:grid-cols-4 gap-8 animate-content-fade" style={{ animationDelay: '400ms' }}>
                            {/* Main Article */}
                            <article className="xl:col-span-3 group relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="relative bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 lg:p-12 group-hover:border-cyan-500/30 transition-all duration-500 overflow-hidden">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(120,119,198,0.15)_1px,_transparent_0)] bg-[length:20px_20px] opacity-10"></div>

                                    {/* Content */}
                                    <div className={`relative z-10 text-lg leading-8 text-slate-200 whitespace-pre-line ${/[\u0600-\u06FF]/.test(newsItem.content) ? "text-right" : "text-left"
                                        }`}>
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
                                                            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline hover:no-underline transition-all duration-300 transform hover:translate-y-[-1px] bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 font-medium"
                                                        >
                                                            <FontAwesomeIcon icon={faLink} className="text-sm" />
                                                            {part}
                                                        </a>
                                                    );
                                                } else {
                                                    return part;
                                                }
                                            })
                                            : "No content available"}
                                    </div>

                                    {/* Share Button */}
                                    <div className="relative z-10 mt-12 pt-8 border-t border-slate-700/50">
                                        <button
                                            onClick={shareNews}
                                            className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 font-semibold"
                                        >
                                            <FontAwesomeIcon icon={faShare} className="group-hover:scale-110 transition-transform duration-300" />
                                            <span>Share This News</span>
                                        </button>
                                    </div>
                                </div>
                            </article>

                            {/* Sidebar */}
                            <aside className="space-y-6">
                                {/* News Info Card */}
                                <div className="bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-500 group">
                                    <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faNewspaper} className="text-sm" />
                                        News Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-3 border-b border-slate-700/30 group-hover:border-slate-600/50 transition-colors">
                                            <span className="text-slate-400 text-sm">Status</span>
                                            <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30">Published</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-slate-700/30 group-hover:border-slate-600/50 transition-colors">
                                            <span className="text-slate-400 text-sm">Type</span>
                                            <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-500/30">Announcement</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3">
                                            <span className="text-slate-400 text-sm">Priority</span>
                                            <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium border border-amber-500/30">High</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-500 group">
                                    <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faDashboard} className="text-sm" />
                                        Quick Actions
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: faNewspaper, label: 'All News', path: '/home', color: 'cyan' },
                                            { icon: faTable, label: 'Schedule', path: '/schedule', color: 'emerald' },
                                            { icon: faStickyNote, label: 'Notes', path: '/notes', color: 'purple' },
                                        ].map((action, index) => (
                                            <button
                                                key={action.path}
                                                onClick={() => router.push(action.path)}
                                                className="w-full flex items-center gap-3 text-slate-300 hover:text-white p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-slate-700/50 border border-transparent hover:border-cyan-500/20 group"
                                            >
                                                <div className={`bg-${action.color}-500/20 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                                                    <FontAwesomeIcon icon={action.icon} className={`text-${action.color}-400 text-sm`} />
                                                </div>
                                                <span className="font-medium flex-1 text-left">{action.label}</span>
                                                <FontAwesomeIcon icon={faArrowLeft} className="text-slate-500 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all duration-300 text-sm" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </aside>
                        </section>
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-2xl shadow-cyan-500/25 border border-cyan-400/30 flex items-center justify-center text-white hover:scale-110 hover:shadow-cyan-500/40 transition-all duration-300 group backdrop-blur-sm"
            >
                <FontAwesomeIcon
                    icon={faChevronUp}
                    className="group-hover:-translate-y-0.5 transition-transform duration-300"
                />
            </button>
        </div>
    );
}