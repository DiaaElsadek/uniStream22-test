"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { useRouter } from "next/navigation";

type Note = {
    id: number;
    content: string;
    color: string;
    isPinned: boolean;
    date: string;
    rotation: number;
};

const noteColors = ["note-yellow", "note-blue", "note-green", "note-pink", "note-purple"];

const API_URL = "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser";
const HEADERS = {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
    "Content-Type": "application/json",
    Prefer: "return=representation",
    Accept: "application/json"
};

export default function StickyWall() {
    const [notes, setNotes] = useState<Note[]>([]);
    const nextIdRef = useRef<number>(1);
    const [editingId, setEditingId] = useState<number | null>(null);

    const randomRotation = () => {
        let r = Math.floor(Math.random() * 13) - 6;
        if (r === 0) r = 1;
        return r;
    };

    const randomColor = () => noteColors[Math.floor(Math.random() * noteColors.length)];

    const getColorFromClass = (className: string) => {
        const colorMap: Record<string, string> = {
            "note-yellow": "#fffd8c",
            "note-blue": "#8cd4ff",
            "note-green": "#9dff8c",
            "note-pink": "#ff8cd4",
            "note-purple": "#d48cff",
        };
        return colorMap[className] || "#fffd8c";
    };

    const addNewNote = (content = "", color = randomColor(), isPinned = false) => {
        const id = nextIdRef.current++;
        const newNote: Note = {
            id,
            content,
            color,
            isPinned,
            date: new Date().toLocaleDateString(),
            rotation: randomRotation(),
        };
        setNotes(prev => {
            const updated = [...prev, newNote];
            try { localStorage.setItem("stickyNotes", JSON.stringify(updated)); } catch { }
            return updated;
        });
    };

    const deleteNote = (id: number) => {
        setNotes(prev => {
            const updated = prev.filter(n => n.id !== id);
            try { localStorage.setItem("stickyNotes", JSON.stringify(updated)); } catch { }
            return updated;
        });
        if (editingId === id) setEditingId(null);
    };

    const togglePin = (id: number) => {
        setNotes(prev => {
            const updated = prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n);
            try { localStorage.setItem("stickyNotes", JSON.stringify(updated)); } catch { }
            return updated;
        });
    };

    const updateContent = (id: number, newContent: string) => {
        setNotes(prev => {
            const updated = prev.map(n => n.id === id ? { ...n, content: newContent } : n);
            try { localStorage.setItem("stickyNotes", JSON.stringify(updated)); } catch { }
            return updated;
        });
    };

    const changeColor = (id: number) => {
        setNotes(prev => {
            const updated = prev.map(n => {
                if (n.id === id) {
                    const currentIndex = noteColors.indexOf(n.color);
                    const nextColor = noteColors[(currentIndex + 1) % noteColors.length];
                    return { ...n, color: nextColor };
                }
                return n;
            });
            try { localStorage.setItem("stickyNotes", JSON.stringify(updated)); } catch { }
            return updated;
        });
    };

    const clearAll = () => {
        try { localStorage.removeItem("stickyNotes"); } catch { }
        nextIdRef.current = 1;
        const starter: Note = {
            id: nextIdRef.current++,
            content: "Start fresh!<br><br>Click here to edit me.",
            color: "note-yellow",
            isPinned: true,
            date: new Date().toLocaleDateString(),
            rotation: randomRotation(),
        };
        setNotes([starter]);
        try { localStorage.setItem("stickyNotes", JSON.stringify([starter])); } catch { }
    };

    const saveToServer = async () => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            // alert("⚠️ Saved locally (no userToken found).");
            return;
        }
        try {
            const raw = localStorage.getItem("stickyNotes");
            let parsedNotes = [];
            try { parsedNotes = raw ? JSON.parse(raw) : []; } catch { parsedNotes = []; }
            const body = { stickyNotes: parsedNotes };

            const res = await fetch(`${API_URL}?userToken=eq.${token}`, {
                method: "PATCH",
                headers: HEADERS,
                body: JSON.stringify(body),
            });

            if (res.ok) {
                // alert("✅ Notes saved successfully!");
            } else {
                console.error("Save failed, status:", res.status);
                // alert(`⚠️ Failed to save (status ${res.status})`);
            }
        } catch (err) {
            console.error("Save error:", err);
            // alert("⚠️ Error while saving to server.");
        }
    };

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem("userToken");

            if (token) {
                try {
                    const res = await fetch(`${API_URL}?userToken=eq.${encodeURIComponent(token)}`, {
                        method: "GET",
                        headers: HEADERS,
                    });
                    if (res.ok) {
                        const data = await res.json();
                        if (Array.isArray(data) && data.length > 0) {
                            const dbUser = data[0];
                            const raw = dbUser?.stickyNotes;
                            if (raw) {
                                let parsedNotes: any[] = [];
                                try { parsedNotes = typeof raw === "string" ? JSON.parse(raw) : raw; } catch { parsedNotes = []; }

                                if (Array.isArray(parsedNotes) && parsedNotes.length > 0) {
                                    const mapped: Note[] = parsedNotes.map((n: any) => ({
                                        id: typeof n.id === "number" ? n.id : nextIdRef.current++,
                                        content: n.content ?? "",
                                        color: n.color ?? noteColors[0],
                                        isPinned: !!n.isPinned,
                                        date: n.date ?? new Date().toLocaleDateString(),
                                        rotation: typeof n.rotation === "number" ? n.rotation : randomRotation(),
                                    }));
                                    setNotes(mapped);
                                    const maxId = mapped.length > 0 ? Math.max(...mapped.map(p => p.id)) : 0;
                                    nextIdRef.current = maxId + 1;
                                    try { localStorage.setItem("stickyNotes", JSON.stringify(mapped)); } catch { }
                                    return;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.warn("Error fetching stickyNotes from Supabase:", e);
                }
            }

            const stored = localStorage.getItem("stickyNotes");
            if (stored) {
                try {
                    const parsed: Note[] = JSON.parse(stored).map((n: any) => ({
                        id: n.id,
                        content: n.content ?? "",
                        color: n.color ?? noteColors[0],
                        isPinned: !!n.isPinned,
                        date: n.date ?? new Date().toLocaleDateString(),
                        rotation: typeof n.rotation === "number" ? n.rotation : randomRotation(),
                    }));
                    setNotes(parsed);
                    const maxId = parsed.length > 0 ? Math.max(...parsed.map(p => p.id)) : 0;
                    nextIdRef.current = maxId + 1;
                } catch {
                    nextIdRef.current = 1;
                    addNewNote(
                        "Welcome to Sticky Notes Wall!<br><br>Click here to edit me.",
                        "note-yellow",
                        true
                    );
                }
            } else {
                nextIdRef.current = 1;
                addNewNote(
                    "Welcome to Sticky Notes Wall!<br><br>Click here to edit me.",
                    "note-yellow",
                    true
                );
            }
        };
        init();
    }, []);

    const pinnedNotes = notes.filter(n => n.isPinned);
    const unpinnedNotes = notes.filter(n => !n.isPinned);
    const router = useRouter();

    return (
        <div className={styles.stickyContainer}>
            <header>
                <h1>Sticky Notes Wall</h1>
                <p className={styles.subtitle}>
                    Organize your thoughts, tasks, and ideas with these colorful sticky notes
                </p>
            </header>

            <div className={styles.controls}>
                <button className={`${styles.btn} ${styles["btn-add"]}`} onClick={() => addNewNote()}>
                    <i className="fas fa-plus" /> Add New Note
                </button>
                <button className={styles.btn} onClick={clearAll}>
                    <i className="fas fa-trash" /> Clear All
                </button>
                <button className={styles.btn} onClick={() => {
                    saveToServer();
                    router.replace("/home")
                }}>
                    <i className="fas fa-save" /> Save Notes
                </button>
            </div>

            <div className={styles["sticky-wall"]}>
                {[...pinnedNotes, ...unpinnedNotes].map(note => {
                    const isEditing = editingId === note.id;
                    const wrapperStyle: React.CSSProperties = {
                        transform: isEditing ? `rotate(0deg)` : `rotate(${note.rotation}deg)`,
                        transition: "transform 150ms ease",
                        backgroundColor: getColorFromClass(note.color),
                    };

                    return (
                        <div
                            key={note.id}
                            className={`${styles.note} ${styles[note.color]} ${isEditing ? styles.editing : ""}`}
                            style={wrapperStyle}
                        >
                            <div className={styles["note-header"]}>
                                <div className={styles["note-date"]}>{note.date}</div>
                                <div className={styles["note-actions"]}>
                                    <button
                                        className={styles["note-action"]}
                                        onClick={() => togglePin(note.id)}
                                        aria-label={note.isPinned ? "Unpin note" : "Pin note"}
                                    >
                                        <i className={`fas fa-thumbtack ${note.isPinned ? styles.pinned : ""}`} />
                                    </button>
                                    <button
                                        className={styles["note-action"]}
                                        onClick={() => deleteNote(note.id)}
                                        aria-label="Delete note"
                                    >
                                        <i className="fas fa-times" />
                                    </button>
                                </div>
                            </div>

                            <div
                                className={styles["note-content"]}
                                contentEditable
                                suppressContentEditableWarning
                                tabIndex={0}
                                onFocus={() => setEditingId(note.id)}
                                onBlur={e => {
                                    const html = e.currentTarget.innerHTML;
                                    updateContent(note.id, html);
                                    setEditingId(prev => (prev === note.id ? null : prev));
                                }}
                                dangerouslySetInnerHTML={{ __html: note.content }}
                                style={{ outline: "none", cursor: "text" }}
                            />

                            <div className={styles["note-footer"]}>
                                <div
                                    className={styles["note-color"]}
                                    title="Change color"
                                    onClick={() => changeColor(note.id)}
                                    style={{ backgroundColor: getColorFromClass(note.color), cursor: "pointer" }}
                                />
                                <div className={styles["note-pinned"]} title={note.isPinned ? "Pinned" : "Not pinned"}>
                                    <i className={`fas fa-thumbtack ${note.isPinned ? styles.pinned : ""}`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
