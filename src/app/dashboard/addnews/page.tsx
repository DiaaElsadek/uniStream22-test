"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AddNewsPage() {
    const router = useRouter();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

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
            <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black flex justify-center items-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-300 font-semibold">جاري تحميل الأخبار...</p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-4 sm:p-6 lg:p-8">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-2xl font-bold z-50 border-l-4 ${
                            toast.type === "success"
                                ? "bg-gradient-to-r from-green-900/90 to-green-800/90 border-green-400 text-green-100"
                                : "bg-gradient-to-r from-red-900/90 to-red-800/90 border-red-400 text-red-100"
                        } backdrop-blur-sm`}
                    >
                        <div className="flex items-center gap-3">
                            {/* <span className="text-xl">{toast.type === "success" ? "✅" : "⚠️"}</span> */}
                            <span>{toast.message}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-7xl mx-auto mb-12">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
                    <div className="text-center sm:text-right">
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
                            إدارة الأخبار
                        </h1>
                        <p className="text-gray-400 text-lg">أضف وادر أخبار المواد الدراسية والمجموعات</p>
                    </div>

                    <button
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
                        className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
                    >
                        <span className="flex items-center gap-3">
                            <span className="text-xl">📰</span>
                            إضافة خبر جديد
                            <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">+</span>
                        </span>
                    </button>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 right-4 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400 text-xl">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="ابحث عن عنوان، محتوى، مادة، أسبوع، أو أي معلومة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-4 pr-12 bg-gray-800/50 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-gray-400 text-lg backdrop-blur-sm transition-all duration-300"
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {filteredNews.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">لا توجد أخبار</h3>
                        <p className="text-gray-500">لم يتم إضافة أي أخبار بعد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {filteredNews.map((item) => (
                            <div
                                key={item.id}
                                className="group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-6 rounded-3xl border border-gray-700/30 shadow-2xl shadow-black/20 backdrop-blur-sm hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 hover:transform hover:scale-105"
                            >
                                {/* نقل العمود إلى الشمال */}
                                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-2xl"></div>

                                <div className="flex justify-between items-start mb-4 pl-2">
                                    <h3 className="text-xl font-black bg-gradient-to-l from-indigo-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                                        {item.title}
                                    </h3>
                                    <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30 text-sm font-bold whitespace-nowrap">
                                        الأسبوع {item.week}
                                    </span>
                                </div>

                                <p className="text-gray-200 mb-6 leading-relaxed text-right pl-3 border-l-2 border-indigo-500/20 min-h-[80px]">
                                    {item.content}
                                </p>

                                {/* الباقي زي ما هو */}
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                                        <span className="bg-blue-500/20 p-2 rounded-lg">
                                            <span className="text-blue-300 text-lg">📘</span>
                                        </span>
                                        <div className="text-right flex-1">
                                            <p className="text-gray-400 text-xs font-semibold">المادة</p>
                                            <p className="text-gray-200 font-medium">{subjects[item.subjectId - 1] || "عام"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                                        <span className="bg-green-500/20 p-2 rounded-lg">
                                            <span className="text-green-300 text-lg">👥</span>
                                        </span>
                                        <div className="text-right flex-1">
                                            <p className="text-gray-400 text-xs font-semibold">المجموعة</p>
                                            <p className="text-gray-200 font-medium">{item.groupId || "الكل"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                                        <span className="bg-purple-500/20 p-2 rounded-lg">
                                            <span className="text-purple-300 text-lg">✍️</span>
                                        </span>
                                        <div className="text-right flex-1">
                                            <p className="text-gray-400 text-xs font-semibold">الناشر</p>
                                            <p className="text-gray-200 font-medium">{item.createdBy || "Admin"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-700/30">
                                        <span className="bg-amber-500/20 p-2 rounded-lg">
                                            <span className="text-amber-300 text-lg">🕒</span>
                                        </span>
                                        <div className="text-right flex-1">
                                            <p className="text-gray-400 text-xs font-semibold">التاريخ</p>
                                            <p className="text-gray-200 font-medium">{formatDateTime(item.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-gray-700/30">
                                    <button
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
                                        className="flex-1 group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 font-bold flex items-center justify-center gap-2"
                                    >
                                        <span className="group-hover:rotate-12 transition-transform duration-300">✏️</span>
                                        تعديل
                                    </button>
                                    <button
                                        onClick={() => deleteNews(item.id)}
                                        className="flex-1 group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 font-bold flex items-center justify-center gap-2"
                                    >
                                        <span className="group-hover:scale-110 transition-transform duration-300">🗑️</span>
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 sm:p-8 rounded-3xl w-full max-w-2xl border border-gray-700/50 shadow-2xl shadow-black/40"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                {isEdit ? "✏️ تعديل الخبر" : "📰 إضافة خبر جديد"}
                            </h2>
                            <p className="text-gray-400 mt-2">{isEdit ? "قم بتعديل بيانات الخبر" : "املأ البيانات لإضافة خبر جديد"}</p>
                        </div>

                        <div className="space-y-6 text-right">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3">عنوان الخبر</label>
                                <input
                                    type="text"
                                    placeholder="اكتب عنوان الخبر هنا..."
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full p-4 bg-gray-800/70 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300 text-lg"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-3">محتوى الخبر</label>
                                <textarea
                                    rows={4}
                                    placeholder="اكتب تفاصيل الخبر..."
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-4 bg-gray-800/70 border border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300 resize-none text-lg"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-3">المادة</label>
                                    <select
                                        value={formData.subjectId}
                                        onChange={(e) => setFormData({ ...formData, subjectId: Number(e.target.value) })}
                                        className="w-full p-4 bg-gray-800/70 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                    >
                                        <option value={0}>عام (Global)</option>
                                        {subjects.map((s, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-3">المجموعة</label>
                                    <select
                                        value={formData.groupId}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                groupId: e.target.value === "global" ? 0 : Number(e.target.value),
                                            })
                                        }
                                        className="w-full p-4 bg-gray-800/70 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300"
                                    >
                                        {groups.map((g, i) => (
                                            <option key={i} value={g}>
                                                {g}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-300 mb-3">الأسبوع</label>
                                    <input
                                        type="number"
                                        placeholder="مثلاً: 5"
                                        value={formData.week || ""}
                                        onChange={(e) => setFormData({ ...formData, week: Number(e.target.value) })}
                                        className="w-full p-4 bg-gray-800/70 border border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-gray-400 transition-all duration-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-700/50">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-full sm:w-auto bg-gray-700/50 hover:bg-gray-600/50 px-8 py-4 rounded-xl font-bold text-gray-300 transition-all duration-300 border border-gray-600/50 hover:border-gray-500/50"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={addOrEditNews}
                                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 transform hover:scale-105"
                                >
                                    <span className="flex items-center gap-2 justify-center">
                                        {isEdit ? "💾" : "➕"}
                                        {isEdit ? "تعديل الخبر" : "إضافة الخبر"}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
