"use client";
import React, { useState } from "react";
import "./style.css"; // افتراضياً نفس ملف CSS للباكجراوند والكونتينر
import { useRouter } from "next/navigation";

async function resendOTP() {

    const otp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit 
    const leftotp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit 
    const rightotp = await Math.floor(100000 + Math.random() * 900000); // Generate 6-digit 

    localStorage.setItem("id", leftotp.toString() + otp.toString() + rightotp.toString()); // حفظ OTP مؤقتًا على الفرونت

    const email = localStorage.getItem("email");
    const academicId = localStorage.getItem("academicId");

    if (!email || !academicId) {
        alert("Email or Academic ID not found. Please sign up again.");
        return;
    }

    const resOTP = await fetch("/api/handelerotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, academicId }),
    });
}

async function verifyOTP(enteredOtp: string) {
    const storedOtp = localStorage.getItem("id");
    if (enteredOtp === storedOtp?.toString().slice(6, 12)) {
        alert("OTP verified successfully!");
        // call your server-side API route (recommended) to avoid CORS and hide keys
        const academicId = localStorage.getItem("academicId");
        const email = localStorage.getItem("email");
        const fullName = localStorage.getItem("fullName");
        const userToken = localStorage.getItem("userToken");
        const password = localStorage.getItem("password");
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ academicId, email, password, fullName, userToken}),
        });
        return true;
    }
    else {
        alert("Invalid OTP. Please try again.");
        return false;
    }
}

export default function OtpPage() {
    const [otp, setOtp] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = await verifyOTP(otp);
        if (isValid) {
            router.push("/selectschedule");
        }
    };


    return (
        <div className="login-bg min-h-screen flex items-center justify-center px-4">
            <div className="login-container max-w-md w-full p-8 sm:p-12 relative">

                <h1 className="text-3xl font-bold text-white mb-4 text-center">
                    Verify OTP
                </h1>
                <p className="text-gray-300 text-center mb-4">
                    Enter the OTP sent to your email/phone
                </p>

                <p className="text-gray-300 text-center mb-8">
                    You Will Find The OTP in the <span className="text-blue-500 font-bold">Spam</span> in Gmail
                </p>

                <div className="gradient-border rounded-2xl mb-5"></div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="otp" className="block text-gray-200 font-medium mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                            placeholder="Enter OTP"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition"
                    >
                        Verify
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-300 relative z-10">
                    Didn't receive OTP? <a
                        onClick={async (e) => {
                            e.preventDefault();
                            await resendOTP();
                        }}
                        href="#"
                        className="text-indigo-400 hover:underline"
                    >
                        Resend
                    </a>
                </div>
            </div>
        </div>
    );
};
