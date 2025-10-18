"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";
import { useRouter } from "next/navigation";

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/News";
const HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
};

async function handelRole(userToken: string): Promise<boolean> {
    if (!userToken) return false;
    const query = `?userToken=eq.${userToken}`;
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    try {
        const res = await fetch(url, { method: "GET", headers: HEADERS });
        const data = await res.json();
        return "admin" === data[0].Role;
    } catch {
        return false;
    }
}

export default function AdminDashboard() {
    const router = useRouter();
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(
        null
    );
    const [isAdmin, setisAdmin] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const checkRoleAndFetch = async () => {
            const userToken = localStorage.getItem("userToken");
            const check = await handelRole(userToken!);
            setisAdmin(check);

            if (!check) {
                router.replace("/home");
            }
        };

        checkRoleAndFetch();
    }, []);

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        subjectId: 0,
        groupId: 0,
        createdAt: "",
        publishData: false,
        week: 1,
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
        const res = await fetch(API_URL, { headers: HEADERS });
        const data = await res.json();

        const sortedData = Array.isArray(data)
            ? data.sort((a, b) => b.id - a.id)
            : [];
        setNews(sortedData);
        setLoading(false);
    }

    async function deleteNews(id: number) {
        const res = await fetch(`${API_URL}?id=eq.${id}`, {
            method: "DELETE",
            headers: HEADERS,
        });

        if (res.ok) {
            setNews((prev) => prev.filter((n) => n.id !== id));
            showToast("success", "✅ تم حذف الخبر بنجاح");
        } else {
            showToast("error", "⚠️ حدث خطأ أثناء حذف الخبر");
        }
    }

    async function addOrEditNews() {
        const now = new Date();
        const newData = {
            title: formData.title.trim(),
            content: formData.content.trim(),
            subjectId: formData.subjectId,
            groupId: formData.groupId,
            week: formData.week,
            isGeneral: formData.publishData,
            createdAt: now.toISOString(),
            createdBy: localStorage.getItem("fullName"),
        };

        if (isEdit && editId !== null) {
            const res = await fetch(`${API_URL}?id=eq.${editId}`, {
                method: "PATCH",
                headers: {
                    ...HEADERS,
                    Prefer: "return=representation",
                },
                body: JSON.stringify(newData),
            });
            if (res.ok) {
                showToast("success", "✅ تم تعديل الخبر بنجاح");
            } else {
                showToast("error", "⚠️ حدث خطأ أثناء تعديل الخبر");
            }
        } else {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: HEADERS,
                body: JSON.stringify(newData),
            });
            if (res.ok) {
                showToast("success", "🎉 تم إضافة الخبر بنجاح");
            } else {
                showToast("error", "⚠️ حدث خطأ أثناء إضافة الخبر");
            }
        }

        setShowModal(false);
        setFormData({
            title: "",
            content: "",
            subjectId: 0,
            groupId: 0,
            publishData: false,
            createdAt: "",
            week: 1,
            createdBy: "",
        });
        setIsEdit(false);
        setEditId(null);
        fetchNews();
    }

    useEffect(() => {
        fetchNews();
    }, []);

    function normalize(text: string) {
        return text
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/[^\w\u0600-\u06FF]+/g, "");
    }

    const filteredNews = news.filter((item) => {
        const search = normalize(searchTerm);
        const title = normalize(item.title || "");
        const subject = normalize(subjects[item.subjectId - 1] || "");
        const week = normalize(item.week?.toString() || "");

        return (
            title.includes(search) ||
            subject.includes(search) ||
            week.includes(search)
        );
    });

    if (loading || !isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
                <div className="flex space-x-3 mb-6">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-4 h-4 rounded-full bg-indigo-500"
                    />
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-4 h-4 rounded-full bg-indigo-400"
                    />
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-4 h-4 rounded-full bg-indigo-300"
                    />
                </div>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-3xl font-bold tracking-wide"
                >
                    Loading News...
                </motion.h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-6 relative overflow-x-hidden">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ type: "spring", duration: 0.6 }}
                        className={`fixed top-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-semibold z-50 ${toast.type === "success"
                            ? "bg-green-600/90 border border-green-400"
                            : "bg-red-600/90 border border-red-400"
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-10 border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-extrabold tracking-wide text-indigo-400">
                    Dashboard
                </h1>
                <button
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition rounded-lg font-semibold shadow-lg cursor-pointer"
                    onClick={() => {
                        setShowModal(true);
                        setIsEdit(false);
                        setFormData({
                            title: "",
                            content: "",
                            subjectId: 0,
                            groupId: 0,
                            publishData: false,
                            createdAt: "",
                            week: 1,
                            createdBy: "",
                        });
                    }}
                >
                    Add New +
                </button>
            </div>

            <div className="text-center mb-5">
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition rounded-lg font-semibold shadow-lg cursor-pointer"
                >
                    Back
                </button>
            </div>

            <div className="mb-8 text-center">
                <input
                    type="text"
                    placeholder="🔍 ابحث عن عنوان أو مادة أو أسبوع"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-center w-80 p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((item) => (
                    <div
                        key={item.id}
                        className="relative bg-gray-900/80 backdrop-blur-lg p-6 rounded-2xl shadow-md border border-gray-700 hover:border-indigo-600 transition duration-300 hover:scale-[1.02] overflow-hidden break-words"
                    >
                        <h3 className="text-2xl font-bold mb-2 text-indigo-300 break-words overflow-hidden">
                            {item.title || "بدون عنوان"}
                        </h3>
                        <p className="text-gray-300 mb-4 leading-relaxed break-words overflow-hidden">
                            {item.content || "لا يوجد محتوى"}
                        </p>
                        <div className="text-sm text-gray-400 space-y-1">
                            <p>📘 المادة: {item.subjectId === 0 ? "Global" : subjects[item.subjectId - 1]}</p>
                            <p>👥 المجموعة: {item.groupId === 0 ? "Global" : item.groupId}</p>
                            <p>📅 الأسبوع: {item.week}</p>
                            <p>
                                🕓 التاريخ:{" "}
                                {item.createdAt
                                    ? new Date(item.createdAt).toLocaleString("ar-EG")
                                    : "غير متاح"}
                            </p>
                        </div>
                        <p className="text-gray-300 mb-4 pt-5 leading-relaxed break-words overflow-hidden">
                            created By : {item.createdBy || "Admin"}
                        </p>
                        <div className="flex justify-between mt-3">
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
                                        publishData: item.isGeneral,
                                        createdAt: item.createdAt,
                                        week: item.week,
                                        createdBy: item.createdBy,
                                    });
                                }}
                                className="cursor-pointer px-4 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-sm font-semibold transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteNews(item.id)}
                                className="cursor-pointer px-4 py-1 bg-red-600 hover:bg-red-700 rounded-md text-sm font-semibold transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn relative">
                        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">
                            {isEdit ? "Edit News" : "Add New"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block mb-1 text-gray-300">العنوان:</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({ ...formData, title: e.target.value })
                                    }
                                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                                    placeholder="اكتب عنوان الخبر"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-300">المحتوى:</label>
                                <textarea
                                    rows={4}
                                    value={formData.content}
                                    onChange={(e) =>
                                        setFormData({ ...formData, content: e.target.value })
                                    }
                                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                                    placeholder="اكتب محتوى الخبر..."
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-300">المادة:</label>
                                        <select
                                            value={formData.subjectId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subjectId: Number(e.target.value),
                                                })
                                            }
                                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                                        >
                                            <option value={0}>Global</option>
                                            {subjects.map((sub, i) => (
                                                <option key={i + 1} value={i + 1}>
                                                    {sub}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex-1">
                                        <label className="block mb-1 text-gray-300">المجموعة:</label>
                                        <select
                                            value={formData.groupId}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    groupId:
                                                        e.target.value === "global"
                                                            ? 0
                                                            : Number(e.target.value),
                                                })
                                            }
                                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                                        >
                                            {groups.map((g, i) => (
                                                <option key={i} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block mb-1 text-gray-300">
                                        📅 رقم الأسبوع:
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.week}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                week: Number(e.target.value),
                                            })
                                        }
                                        className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-indigo-500 outline-none transition"
                                        placeholder="اكتب رقم الأسبوع (مثلاً: 3)"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition font-semibold"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={addOrEditNews}
                                    className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 font-semibold shadow-md transition"
                                >
                                    {isEdit ? "تعديل" : "إضافة"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
