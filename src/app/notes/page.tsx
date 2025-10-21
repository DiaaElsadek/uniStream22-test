"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBars,
    faTimes,
    faHome,
    faCalendarAlt,
    faBook,
    faSignOutAlt,
    faDashboard,
    faGraduationCap,
    faThumbtack,
    faTrash,
    faPalette,
    faEdit,
    faSave,
    faPlus,
    faLightbulb
} from "@fortawesome/free-solid-svg-icons";

type Note = {
    id: number;
    content: string;
    color: string;
    isPinned: boolean;
    date: string;
    rotation: number;
};

const noteColors = ["note-yellow", "note-blue", "note-green", "note-pink", "note-purple"];

export default function StickyWall() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const nextIdRef = useRef<number>(1);
    const router = useRouter();

    const randomRotation = () => {
        let r = Math.floor(Math.random() * 13) - 6;
        if (r === 0) r = 1;
        return r;
    };

    const randomColor = () => noteColors[Math.floor(Math.random() * noteColors.length)];

    const getColor = (className: string) => {
        const map: Record<string, string> = {
            "note-yellow": "linear-gradient(135deg, #FFEB3B, #FFC107, #FF9800)",
            "note-blue": "linear-gradient(135deg, #2196F3, #03A9F4, #00BCD4)",
            "note-green": "linear-gradient(135deg, #4CAF50, #8BC34A, #CDDC39)",
            "note-pink": "linear-gradient(135deg, #E91E63, #EC407A, #F06292)",
            "note-purple": "linear-gradient(135deg, #9C27B0, #BA68C8, #CE93D8)",
        };
        return map[className] || "linear-gradient(135deg, #FFEB3B, #FFC107, #FF9800)";
    };

    const getShadowColor = (className: string) => {
        const map: Record<string, string> = {
            "note-yellow": "rgba(255, 235, 59, 0.6)",
            "note-blue": "rgba(33, 150, 243, 0.6)",
            "note-green": "rgba(76, 175, 80, 0.6)",
            "note-pink": "rgba(233, 30, 99, 0.6)",
            "note-purple": "rgba(156, 39, 176, 0.6)",
        };
        return map[className] || "rgba(255, 235, 59, 0.6)";
    };

    const loadNotes = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) return;

            const res = await fetch(`/api/stickyNotes?userToken=${token}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data?.stickyNotes && Array.isArray(data.stickyNotes)) {
                    const notesWithDefaults = data.stickyNotes.map((note: any) => ({
                        ...note,
                        rotation: note.rotation || randomRotation(),
                        color: note.color || randomColor(),
                        date: note.date || new Date().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    }));
                    setNotes(notesWithDefaults);
                    nextIdRef.current = Math.max(...notesWithDefaults.map((n: Note) => n.id), 0) + 1;
                }
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
            // Fallback to localStorage
            const stored = localStorage.getItem("stickyNotes");
            if (stored) {
                const parsedNotes = JSON.parse(stored);
                setNotes(parsedNotes);
                nextIdRef.current = Math.max(...parsedNotes.map((n: Note) => n.id), 0) + 1;
            }
        }
    };

    const saveNotes = async () => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                // Save to localStorage only if no token
                localStorage.setItem("stickyNotes", JSON.stringify(notes));
                return;
            }

            const body = {
                userToken: token,
                stickyNotes: notes
            };

            const res = await fetch("/api/stickyNotes", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                throw new Error('Failed to save notes');
            }
        } catch (error) {
            console.error('Failed to save notes:', error);
            // Fallback to localStorage
            localStorage.setItem("stickyNotes", JSON.stringify(notes));
        }
    };

    const addNewNote = () => {
        const id = nextIdRef.current++;
        const newNote: Note = {
            id,
            content: "",
            color: randomColor(),
            isPinned: false,
            date: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            rotation: randomRotation(),
        };
        const updated = [...notes, newNote];
        setNotes(updated);
        setEditingId(id);
        localStorage.setItem("stickyNotes", JSON.stringify(updated));
    };

    const deleteNote = (id: number) => {
        const updated = notes.filter((n) => n.id !== id);
        setNotes(updated);
        localStorage.setItem("stickyNotes", JSON.stringify(updated));
        if (editingId === id) {
            setEditingId(null);
        }
    };

    const togglePin = (id: number) => {
        const updated = notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n));
        setNotes(updated);
        localStorage.setItem("stickyNotes", JSON.stringify(updated));
    };

    const changeColor = (id: number) => {
        const updated = notes.map((n) => {
            if (n.id === id) {
                const currentIndex = noteColors.indexOf(n.color);
                const nextColor = noteColors[(currentIndex + 1) % noteColors.length];
                return { ...n, color: nextColor };
            }
            return n;
        });
        setNotes(updated);
        localStorage.setItem("stickyNotes", JSON.stringify(updated));
    };

    const deleteAllNotes = () => {
        if (window.confirm("Are you sure you want to delete all notes?")) {
            setNotes([]);
            localStorage.removeItem("stickyNotes");
            setEditingId(null);
        }
    };

    const updateNoteContent = (id: number, content: string) => {
        const updated = notes.map((n) =>
            n.id === id ? { ...n, content } : n
        );
        setNotes(updated);
        localStorage.setItem("stickyNotes", JSON.stringify(updated));
    };

    useEffect(() => {
        loadNotes();
        // Check if user is admin
        const userRole = localStorage.getItem("role");
        setIsAdmin(userRole === "admin");
    }, []);

    const pinned = notes.filter((n) => n.isPinned);
    const unpinned = notes.filter((n) => !n.isPinned);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-800 relative overflow-hidden">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Gradient Mesh */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/5 via-transparent to-slate-800/10"></div>

                {/* Floating Gradient Orbs */}
                <motion.div
                    animate={{
                        x: [0, 80, -40, 0],
                        y: [0, -60, 40, 0],
                        scale: [1, 1.2, 1.1, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 40, 0],
                        y: [0, 80, -40, 0],
                        scale: [1, 1.3, 1.2, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-slate-600/5 to-blue-500/5 rounded-full blur-3xl"
                />

                {/* Subtle Grid */}
                <div className="absolute inset-0 opacity-[0.02]">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,_transparent_95%,_rgba(255,255,255,0.3)_100%)] bg-[length:60px_60px]"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,_transparent_95%,_rgba(255,255,255,0.3)_100%)] bg-[length:60px_60px]"></div>
                </div>

                {/* Subtle Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -100, 0],
                            x: [0, Math.random() * 50 - 25, 0],
                            opacity: [0, 0.4, 0],
                            scale: [0, 1.5, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 20,
                            repeat: Infinity,
                            delay: i * 0.5,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1 h-1 bg-slate-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Premium Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[85%] z-50 
                    bg-slate-800/80 backdrop-blur-3xl shadow-2xl rounded-3xl 
                    border border-slate-700/50 transition-all duration-500 hover:shadow-3xl hover:border-slate-600/60"
            >
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-3xl font-black bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent drop-shadow-2xl cursor-pointer flex items-center gap-3"
                        onClick={() => router.push("/home")}
                    >
                        <motion.div
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="p-2 bg-gradient-to-r from-slate-600 to-slate-500 rounded-xl"
                        >
                            <FontAwesomeIcon icon={faGraduationCap} className="text-slate-200 text-xl" />
                        </motion.div>
                        UniStream22
                    </motion.div>

                    <div className="hidden md:flex gap-4">
                        {[
                            { name: "Home", path: "/home", icon: faHome },
                            { name: "Table", path: "/schedule", icon: faCalendarAlt },
                            { name: "Notes", path: "/notes", icon: faBook },
                            ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faDashboard }] : [])
                        ].map((item, index) => (
                            <motion.button
                                key={item.name}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                                whileHover={{
                                    scale: 1.05,
                                    y: -2,
                                    background: "linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.1))",
                                    transition: { duration: 0.2 }
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-3 text-slate-300 hover:text-white transition-all duration-300 font-semibold text-sm px-4 py-2.5 rounded-2xl hover:bg-gradient-to-r hover:from-slate-700/10 hover:to-slate-600/10 border border-transparent hover:border-slate-600/30"
                                onClick={() => router.push(item.path)}
                            >
                                <FontAwesomeIcon icon={item.icon} className="text-sm" />
                                {item.name}
                            </motion.button>
                        ))}
                        <motion.button
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, type: "spring" }}
                            whileHover={{
                                scale: 1.05,
                                y: -2,
                                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))",
                                transition: { duration: 0.2 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-all duration-300 font-semibold text-sm px-4 py-2.5 rounded-2xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
                            onClick={() => {
                                localStorage.clear();
                                router.replace("/login");
                            }}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                            Logout
                        </motion.button>
                    </div>

                    <div className="md:hidden">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-slate-300 focus:outline-none p-3 rounded-xl bg-slate-700/50 border border-slate-600/40"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <FontAwesomeIcon
                                icon={menuOpen ? faTimes : faBars}
                                className="text-xl transition-all duration-300"
                            />
                        </motion.button>
                    </div>
                </div>

                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="md:hidden overflow-hidden border-t border-slate-700/40"
                        >
                            <div className="flex flex-col bg-slate-800/95 backdrop-blur-3xl rounded-b-3xl p-4 gap-2">
                                {[
                                    { name: "Home", path: "/home", icon: faHome },
                                    { name: "Table", path: "/schedule", icon: faCalendarAlt },
                                    { name: "Notes", path: "/notes", icon: faBook },
                                    ...(isAdmin ? [{ name: "Dashboard", path: "/dashboard/addnews", icon: faDashboard }] : [])
                                ].map((item, index) => (
                                    <motion.button
                                        key={item.name}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 10, background: "linear-gradient(135deg, rgba(100, 116, 139, 0.1), rgba(71, 85, 105, 0.1))" }}
                                        className="flex items-center gap-3 w-full text-slate-300 hover:text-white text-left transition-all duration-300 py-4 px-4 rounded-xl hover:bg-gradient-to-r hover:from-slate-700/10 hover:to-slate-600/10"
                                        onClick={() => { router.push(item.path); setMenuOpen(false); }}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                                        <span className="font-semibold">{item.name}</span>
                                    </motion.button>
                                ))}
                                <motion.button
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    whileHover={{ x: 10, background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))" }}
                                    className="flex items-center gap-3 w-full text-red-400 hover:text-red-300 text-left transition-all duration-300 py-4 px-4 rounded-xl hover:bg-red-500/10"
                                    onClick={() => { localStorage.clear(); router.replace("/login"); setMenuOpen(false); }}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                                    <span className="font-semibold">Logout</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            <div className="h-28" />

            {/* Main Content */}
            <div className="relative z-10 max-w-8xl mx-auto px-4 py-12">
                {/* Premium Header */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-center mb-20"
                >
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 3, -3, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="mb-8"
                    >
                        <FontAwesomeIcon
                            icon={faLightbulb}
                            className="text-6xl text-yellow-400/80"
                        />
                    </motion.div>
                    <motion.h1
                        animate={{
                            backgroundPosition: ["0%", "100%", "0%"],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-300 bg-clip-text text-transparent bg-[length:300%_300%]"
                    >
                        Sticky Notes Wall
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        Capture your ideas, organize your thoughts, and unleash your creativity with beautiful animated sticky notes
                    </motion.p>
                </motion.div>

                {/* Enhanced Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-4 mb-16"
                >
                    <motion.button
                        onClick={addNewNote}
                        onHoverStart={() => setIsHovered(true)}
                        onHoverEnd={() => setIsHovered(false)}
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                            background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                            boxShadow: "0 15px 30px rgba(124, 58, 237, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="relative overflow-hidden group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl hover:shadow-3xl border border-indigo-400/30 flex items-center gap-3"
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-lg" />
                        Add New Note

                        {/* Button Shine Effect */}
                        {isHovered && (
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
                            />
                        )}
                    </motion.button>

                    <motion.button
                        onClick={() => {
                            saveNotes();
                            router.push("/home");
                        }}
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                            background: "linear-gradient(135deg, #059669, #0D9488)",
                            boxShadow: "0 15px 30px rgba(5, 150, 105, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl hover:shadow-3xl border border-emerald-400/30 flex items-center gap-3"
                    >
                        <FontAwesomeIcon icon={faSave} className="text-lg" />
                        Save Notes
                    </motion.button>

                    <motion.button
                        onClick={deleteAllNotes}
                        whileHover={{
                            scale: 1.05,
                            y: -2,
                            background: "linear-gradient(135deg, #DC2626, #B91C1C)",
                            boxShadow: "0 15px 30px rgba(220, 38, 38, 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-500 bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-2xl hover:shadow-3xl border border-red-400/30 flex items-center gap-3"
                    >
                        <FontAwesomeIcon icon={faTrash} className="text-lg" />
                        Delete All
                    </motion.button>
                </motion.div>

                {/* Enhanced Notes Wall */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="min-h-screen"
                >
                    {/* Pinned Notes */}
                    {pinned.length > 0 && (
                        <div className="mb-16">
                            <motion.h2
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-3 justify-center"
                            >
                                <FontAwesomeIcon
                                    icon={faThumbtack}
                                    className="text-yellow-400 text-xl"
                                />
                                Pinned Notes
                            </motion.h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {pinned.map((note, index) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        index={index}
                                        editingId={editingId}
                                        setEditingId={setEditingId}
                                        togglePin={togglePin}
                                        deleteNote={deleteNote}
                                        changeColor={changeColor}
                                        getColor={getColor}
                                        getShadowColor={getShadowColor}
                                        updateNoteContent={updateNoteContent}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Unpinned Notes */}
                    {unpinned.length > 0 && (
                        <div>
                            {pinned.length > 0 && (
                                <motion.h2
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-2xl font-bold text-slate-300 mb-8 flex items-center gap-3 justify-center"
                                >
                                    <FontAwesomeIcon
                                        icon={faBook}
                                        className="text-slate-400 text-xl"
                                    />
                                    All Notes
                                </motion.h2>
                            )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                                {unpinned.map((note, index) => (
                                    <NoteCard
                                        key={note.id}
                                        note={note}
                                        index={index}
                                        editingId={editingId}
                                        setEditingId={setEditingId}
                                        togglePin={togglePin}
                                        deleteNote={deleteNote}
                                        changeColor={changeColor}
                                        getColor={getColor}
                                        getShadowColor={getShadowColor}
                                        updateNoteContent={updateNoteContent}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Enhanced Empty State */}
                    {notes.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-32"
                        >
                            <motion.div
                                animate={{
                                    y: [0, -15, 0],
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="mb-8"
                            >
                                <FontAwesomeIcon
                                    icon={faLightbulb}
                                    className="text-7xl text-slate-400/60"
                                />
                            </motion.div>
                            <h3 className="text-3xl font-black bg-gradient-to-r from-slate-300 to-slate-200 bg-clip-text text-transparent mb-6">
                                Your Creative Space Awaits
                            </h3>
                            <p className="text-slate-500 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                                Start organizing your thoughts with beautiful, animated sticky notes.
                                Click below to create your first note and unleash your creativity!
                            </p>
                            <motion.button
                                onClick={addNewNote}
                                whileHover={{
                                    scale: 1.05,
                                    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                                    boxShadow: "0 20px 40px rgba(124, 58, 237, 0.4)"
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-3xl hover:shadow-4xl border border-indigo-400/30 flex items-center gap-3 mx-auto"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                Create Your First Note
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}

// Enhanced Note Card Component
const NoteCard = ({
    note,
    index,
    editingId,
    setEditingId,
    togglePin,
    deleteNote,
    changeColor,
    getColor,
    getShadowColor,
    updateNoteContent
}: any) => {
    const isEditing = editingId === note.id;
    const [localHover, setLocalHover] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleContentBlur = () => {
        if (contentRef.current && isEditing) {
            const content = contentRef.current.innerText || '';
            updateNoteContent(note.id, content);
            setEditingId(null);
        }
    };

    const handleContentKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleContentBlur();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, rotate: note.rotation - 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: note.rotation }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            whileHover={{
                scale: 1.05,
                y: -8,
                rotate: isEditing ? 0 : note.rotation + 1,
                transition: { duration: 0.3, type: "spring", stiffness: 400 }
            }}
            onHoverStart={() => setLocalHover(true)}
            onHoverEnd={() => setLocalHover(false)}
            className="relative group cursor-pointer"
            style={{ perspective: "1000px" }}
        >
            {/* Enhanced Glow Effect */}
            <motion.div
                animate={{
                    opacity: localHover ? [0.3, 0.6, 0.3] : 0.2,
                    scale: localHover ? [1, 1.1, 1] : 1,
                }}
                transition={{
                    duration: localHover ? 2 : 3,
                    repeat: localHover ? Infinity : 0,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"
                style={{ background: getShadowColor(note.color) }}
            />

            {/* Note Paper with Enhanced Design */}
            <motion.div
                className="relative rounded-2xl p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm border border-white/20 min-h-[200px] flex flex-col"
                style={{
                    background: getColor(note.color),
                    transform: isEditing ? "rotate(0deg) scale(1.02)" : `rotate(${note.rotation}deg)`,
                }}
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%221%22/%3E%3Ccircle%20cx%3D%2210%22%20cy%3D%2210%22%20r%3D%221%22/%3E%3C/g%3E%3C/svg%3E')] opacity-40 mix-blend-overlay"></div>

                {/* Note Header */}
                <div className="flex justify-between items-start mb-3 relative z-10">
                    <motion.div
                        className="text-xs font-semibold text-slate-700 bg-white/50 px-2 py-1 rounded-full"
                        whileHover={{ scale: 1.05 }}
                    >
                        {note.date}
                    </motion.div>
                    <motion.div
                        className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ opacity: 1 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.2, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors backdrop-blur-sm"
                            title={note.isPinned ? "Unpin" : "Pin"}
                        >
                            <FontAwesomeIcon
                                icon={faThumbtack}
                                className={`text-xs ${note.isPinned ? 'text-yellow-600' : 'text-slate-600'}`}
                            />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.2, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); changeColor(note.id); }}
                            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors backdrop-blur-sm"
                            title="Change Color"
                        >
                            <FontAwesomeIcon icon={faPalette} className="text-xs text-slate-600" />
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.2, y: -1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                            className="p-1.5 rounded-lg bg-black/10 hover:bg-black/20 transition-colors backdrop-blur-sm"
                            title="Delete"
                        >
                            <FontAwesomeIcon icon={faTrash} className="text-xs text-slate-600" />
                        </motion.button>
                    </motion.div>
                </div>

                {/* Note Content */}
                <motion.div
                    ref={contentRef}
                    className="flex-1 outline-none text-slate-800 font-medium leading-relaxed break-words overflow-y-auto max-h-32 custom-scrollbar relative z-10 resize-none border-none bg-transparent"
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onFocus={() => setEditingId(note.id)}
                    onBlur={handleContentBlur}
                    onKeyDown={handleContentKeyDown}
                    style={{
                        cursor: isEditing ? 'text' : 'pointer',
                        minHeight: '80px'
                    }}
                >
                    {note.content}
                </motion.div>

                {/* Note Footer */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/30 relative z-10">
                    {isEditing ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-2 text-slate-600 text-xs font-semibold bg-white/50 px-2 py-1 rounded-full"
                        >
                            <FontAwesomeIcon icon={faEdit} className="text-xs" />
                            Editing...
                        </motion.div>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => { e.stopPropagation(); setEditingId(note.id); }}
                            className="p-1 rounded-lg bg-black/10 hover:bg-black/20 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100"
                            title="Edit"
                        >
                            <FontAwesomeIcon icon={faEdit} className="text-xs text-slate-600" />
                        </motion.button>
                    )}

                    <div className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
                        style={{ background: getColor(note.color) }}
                    />
                </div>

                {/* Corner Fold Effect */}
                <div className="absolute top-0 right-0 w-6 h-6 bg-gradient-to-bl from-black/10 to-transparent rounded-tr-2xl rounded-bl-xl"></div>
            </motion.div>
        </motion.div>
    );
};