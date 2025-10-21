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
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 flex justify-center items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity }
                        }}
                        className="w-20 h-20 border-4 border-indigo-400 border-t-transparent rounded-full mx-auto mb-6"
                    ></motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
                    >
                        جاري تحميل الأخبار...
                    </motion.p>
                </motion.div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-blue-950 text-white p-4 sm:p-6 lg:p-8">
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
                        className={`fixed top-6 right-6 px-6 py-4 rounded-2xl shadow-2xl font-bold z-50 border ${toast.type === "success"
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
            <div className="relative max-w-7xl mx-auto">
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
                                إدارة الأخبار
                            </h1>
                            <p className="text-lg text-indigo-200/80 font-medium">
                                أضف وادر أخبار المواد الدراسية والمجموعات
                            </p>
                        </motion.div>

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
                            <span className="flex items-center gap-3 text-white">
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

                                        <p
                                            className="text-indigo-100/90 mb-6 leading-relaxed text-right pr-3 border-r-2 border-indigo-500/30 min-h-[80px] max-h-[300px] p-3 rounded-lg bg-white/5 backdrop-blur-sm resize overflow-auto"
                                        >
                                            {item.content}
                                        </p>

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
                                {/* Form fields remain the same but with enhanced styling */}
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
                                                    {field.options.map((option, idx) => (
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
        </div>
    );
}