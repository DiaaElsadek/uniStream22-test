"use client";
import { useState } from "react";
import "./style.css";
import { useRouter } from "next/navigation";

const subjects = [
    "معالجة الصور الرقمية",   // subjectId = 1
    "الحوسبة السحابية",       // subjectId = 2
    "التنقيب عن البيانات",    // subjectId = 3
    "اتصالات البيانات",       // subjectId = 4
    "مشروع تخرج 1",          // subjectId = 5
];

export default function SubjectsPage() {
    const [selected, setSelected] = useState<Record<string, number | null>>({});
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleSelect = (subject: string, value: string) => {
        setSelected((prev) => ({
            ...prev,
            [subject]: value === "null" ? null : Number(value),
        }));
    };

    const handleSave = () => {
        setShowModal(true);
    };

    const handleConfirm = async () => {
        try {
            // 1. هنجمع الـ ids من جدول Schedule
            let chosenIds: number[] = [];
            let chosenSubjects: number[] = [];

            for (let i = 0; i < subjects.length; i++) {
                const subjName = subjects[i];
                const groupId = selected[subjName];
                if (groupId) {
                    const subjectId = i + 1; // عشان يبدأ من 1
                    console.log("SubjectId : ", subjectId, "GroupId : ", groupId );
                    chosenSubjects.push(subjectId); // هنا بنخزن index المادة
                    const res = await fetch(
                        `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/Schedule?subjectId=eq.${subjectId}&groupId=eq.${groupId}`,
                        {
                            headers: {
                                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                                "Content-Type": "application/json",
                            },
                        }
                    );
                    const data = await res.json();

                    // if (data?.length > 0) {
                    //     for (let j = 0; j < data.length; j++) {
                    //         chosenIds.push(data[j].id); // ناخد كل المواد اللي طلعت
                    //         console.log("Added : ", data[j].id);
                    //     }
                    // }

                    if(data?.length === 1){
                        chosenIds.push(data[0].id);
                        console.log(data[0].id);
                    }
                    else if(data?.length === 2){
                        chosenIds.push(data[0].id);
                        chosenIds.push(data[1].id);
                        console.log(data[0].id);
                        console.log(data[1].id);
                    }
                }
            }

            console.log("Chosen IDs:", chosenIds);
            console.log("Chosen Subjects:", chosenSubjects);

            // 2. نجيب userToken من localStorage
            const userToken = localStorage.getItem("userToken");
            if (!userToken) {
                alert("مفيش userToken محفوظ!");
                return;
            }

            // 3. نجيب بيانات اليوزر من AppUser
            const userRes = await fetch(
                `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser?userToken=eq.${userToken}`,
                {
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                        "Content-Type": "application/json",
                    },
                }
            );
            const userData = await userRes.json();
            if (userData.length === 0) {
                alert("مفيش يوزر بالـ token ده!");
                return;
            }

            const userId = userData[0].id;

            // 4. نعمل Update للـ subjects بتاعة اليوزر
            const updateRes = await fetch(
                `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser?id=eq.${userId}`,
                {
                    method: "PATCH",
                    headers: {
                        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                        "Content-Type": "application/json",
                        "Prefer": "return=representation",
                    },
                    body: JSON.stringify({ subjects: chosenIds, subjectsId: chosenSubjects }),
                }
            );

            const updatedUser = await updateRes.json();
            console.log("Updated User:", updatedUser);

            alert("تم تحديث اختياراتك بنجاح ✅");
            setShowModal(false);
            router.replace("/home");
        } catch (err) {
            console.error("Error:", err);
            alert("حصل خطأ أثناء الحفظ ❌");
        }
    };

    return (
        <div className="login-bg min-h-screen flex flex-col items-center justify-center p-6">
            {/* المواد */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                {subjects.map((subj) => (
                    <div key={subj} className="login-container relative p-6">
                        <div className="gradient-border"></div>
                        <h2 className="text-xl font-bold mb-4 text-center text-white mt-5">{subj}</h2>

                        <select
                            className="w-full p-3 rounded-xl bg-gray-800 text-gray-200 focus:outline-none"
                            value={selected[subj] ?? "null"}
                            onChange={(e) => handleSelect(subj, e.target.value)}
                        >
                            <option value="null">
                                لا شيء
                            </option>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                                <option key={num} value={num}>
                                    جروب {num}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* زرار Save تحت خالص */}
            <div className="mt-12">
                <button
                    onClick={handleSave}
                    className="cursor-pointer px-8 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition"
                >
                    Save
                </button>
            </div>

            {/* المودال */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                    <div className="bg-gray-900 rounded-2xl p-8 shadow-xl w-[90%] max-w-lg text-center relative">
                        <h2 className="text-2xl font-bold mb-6 text-indigo-400">📌 اختياراتك</h2>
                        <ul className="text-gray-200 space-y-3 mb-6">
                            {subjects.map((subj) => (
                                <li key={subj} className="bg-gray-800 p-3 rounded-lg">
                                    <span className="font-semibold">{subj}:</span>{" "}
                                    {selected[subj] ? `جروب ${selected[subj]}` : "لا شيء"}
                                </li>
                            ))}
                        </ul>

                        {/* زرارين جنب بعض */}
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={handleConfirm}
                                className="flex-1 px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-500 transition"
                            >
                                I'm Sure
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-500 transition"
                            >
                                I'm Not Sure
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
