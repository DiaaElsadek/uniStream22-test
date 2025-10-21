"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const subjects = [
    "معالجة الصور الرقمية",
    "الحوسبة السحابية",
    "التنقيب عن البيانات",
    "اتصالات البيانات",
    "مشروع تخرج 1",
];

// SVG Icons
const BookIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CheckIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const CloseIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SaveIcon = ({ className = "w-6 h-6" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

const GroupIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export default function SubjectsPage() {
    const [selected, setSelected] = useState<Record<string, number | null>>({});
    const [showModal, setShowModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    const handleSelect = (subject: string, value: string) => {
        setSelected((prev) => ({
            ...prev,
            [subject]: value === "null" ? null : Number(value),
        }));
    };

    const handleSave = () => setShowModal(true);

    const handleConfirm = async () => {
        try {
            const userToken = localStorage.getItem("userToken");
            if (!userToken) {
                alert("مفيش userToken محفوظ!");
                return;
            }

            const res = await fetch("/api/selectschedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ selected, userToken }),
            });

            const data = await res.json();
            if (data.status) {
                alert("تم تحديث اختياراتك بنجاح ✅");
                setShowModal(false);
                router.replace("/home");
            } else {
                alert(data.message || "حصل خطأ أثناء الحفظ ❌");
            }
        } catch (err) {
            console.error(err);
            alert("حصل خطأ أثناء الحفظ ❌");
        }
    };

    // Color gradients for each subject card
    const cardGradients = [
        "from-blue-500/10 to-cyan-500/10",
        "from-purple-500/10 to-pink-500/10",
        "from-green-500/10 to-emerald-500/10",
        "from-orange-500/10 to-red-500/10",
        "from-indigo-500/10 to-purple-500/10"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Subtle Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 5
                    }}
                    className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl"
                />

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 0.6, 0],
                            scale: [0, 1, 0],
                            rotate: [0, 180, 360],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 15,
                            repeat: Infinity,
                            delay: i * 0.8,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-40"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16 relative z-10"
            >
                <motion.div
                    animate={{
                        y: [0, -8, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-gray-300 mb-8 flex justify-center"
                >
                    <div className="p-5 bg-slate-800/40 rounded-3xl border border-slate-700/50 backdrop-blur-2xl shadow-2xl">
                        <BookIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-6"
                >
                    اختر مجموعاتك
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-400 text-xl max-w-2xl leading-relaxed"
                >
                    اختر المجموعة المناسبة لكل مادة من المواد الدراسية الخاصة بك
                </motion.p>
            </motion.div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl mb-16 relative z-10">
                {subjects.map((subj, index) => (
                    <motion.div
                        key={subj}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ 
                            duration: 0.6, 
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 100
                        }}
                        whileHover={{ 
                            scale: 1.05, 
                            y: -8,
                            transition: { duration: 0.3 }
                        }}
                        className="group relative"
                    >
                        {/* Glow Effect */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cardGradients[index]} blur-xl group-hover:blur-2xl transition-all duration-500`}
                        />

                        <div className={`relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 h-full flex flex-col group-hover:border-slate-600/50 ${cardGradients[index].replace('10', '20')}`}>
                            {/* Subject Icon */}
                            <motion.div
                                whileHover={{ rotate: 5, scale: 1.1 }}
                                className="mb-6 flex justify-center"
                            >
                                <div className="p-4 bg-slate-700/50 rounded-2xl border border-slate-600/50">
                                    <BookIcon className="w-8 h-8 text-cyan-400" />
                                </div>
                            </motion.div>

                            {/* Subject Title */}
                            <motion.h2 
                                className="text-2xl font-bold mb-6 text-center text-slate-100 leading-tight"
                                whileHover={{ scale: 1.05 }}
                            >
                                {subj}
                            </motion.h2>

                            {/* Select Input */}
                            <motion.div 
                                whileHover={{ scale: 1.02 }}
                                className="relative mt-auto"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <GroupIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors duration-300" />
                                </div>
                                <select
                                    className="w-full pl-12 pr-10 py-4 rounded-2xl bg-slate-700/60 border-2 border-slate-600 text-slate-100 focus:outline-none focus:border-cyan-500 focus:bg-slate-700/80 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer shadow-lg hover:shadow-xl"
                                    value={selected[subj] ?? "null"}
                                    onChange={(e) => handleSelect(subj, e.target.value)}
                                >
                                    <option value="null" className="bg-slate-800 text-slate-200">لا شيء</option>
                                    {[1, 2, 3, 4, 5, 6].map((num) => (
                                        <option key={num} value={num} className="bg-slate-800 text-slate-200">
                                            المجموعة {num}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none transition-colors duration-300 group-hover:text-cyan-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Save Button */}
            <motion.button
                onClick={handleSave}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                whileHover={{ 
                    scale: 1.05, 
                    y: -2,
                    background: "linear-gradient(45deg, #0ea5e9, #3b82f6, #8b5cf6)"
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="px-16 py-5 rounded-2xl font-bold text-xl transition-all duration-500 relative overflow-hidden group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl border border-cyan-500/30 relative z-10"
            >
                <span className="relative z-10 flex items-center justify-center gap-3">
                    <SaveIcon className="w-6 h-6" />
                    حفظ الاختيارات
                </span>
                
                {/* Enhanced Button Shine Effect */}
                {isHovered && (
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                    />
                )}

                {/* Pulse Effect */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20"
                />
            </motion.button>

            {/* Enhanced Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-xl z-50 p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="relative w-full max-w-2xl"
                        >
                            {/* Modal Background */}
                            <div className="relative bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/60 shadow-3xl">
                                {/* Modal Header */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center mb-8"
                                >
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.1, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="text-cyan-400 mb-4 flex justify-center"
                                    >
                                        <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30">
                                            <CheckIcon className="w-8 h-8" />
                                        </div>
                                    </motion.div>
                                    <h2 className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                                        تأكيد الاختيارات
                                    </h2>
                                    <p className="text-slate-400 text-lg">
                                        الرجاء مراجعة اختياراتك قبل الحفظ
                                    </p>
                                </motion.div>
                                
                                {/* Choices List */}
                                <motion.ul 
                                    className="space-y-4 mb-8 max-h-80 overflow-y-auto"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {subjects.map((subj, index) => (
                                        <motion.li 
                                            key={subj}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="bg-slate-700/40 p-5 rounded-2xl border border-slate-600/50 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-slate-200 text-lg">{subj}</span>
                                                <span className={`px-4 py-2 rounded-xl font-bold ${
                                                    selected[subj] 
                                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" 
                                                        : "bg-slate-600/50 text-slate-400 border border-slate-500/30"
                                                }`}>
                                                    {selected[subj] ? `المجموعة ${selected[subj]}` : "لا شيء"}
                                                </span>
                                            </div>
                                        </motion.li>
                                    ))}
                                </motion.ul>

                                {/* Action Buttons */}
                                <motion.div 
                                    className="flex justify-between gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.button
                                        onClick={handleConfirm}
                                        whileHover={{ 
                                            scale: 1.05,
                                            background: "linear-gradient(45deg, #10b981, #059669)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold hover:from-emerald-500 hover:to-green-500 transition-all duration-300 border border-emerald-500/30 flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <CheckIcon className="w-5 h-5" />
                                        تأكيد الحفظ
                                    </motion.button>
                                    <motion.button
                                        onClick={() => setShowModal(false)}
                                        whileHover={{ 
                                            scale: 1.05,
                                            background: "linear-gradient(45deg, #ef4444, #dc2626)"
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-bold hover:from-rose-500 hover:to-red-500 transition-all duration-300 border border-rose-500/30 flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        <CloseIcon className="w-5 h-5" />
                                        إلغاء
                                    </motion.button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}