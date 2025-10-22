"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SignupResponse = {
    message: string;
    status: boolean;
    type: string;
};

async function handelSignup(
    academicId: string,
    email: string,
    password: string,
    fullName: string,
    userToken: string,
): Promise<SignupResponse> {
    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ academicId, email, password, fullName, userToken }),
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("handelSignup error:", err);
        return { message: "Unexpected error", status: false, type: "error" };
    }
}

// SVG Icons
const UserIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const AcademicIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5m-9 5l-9-5" />
    </svg>
);

const EmailIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PasswordIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const EyeIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon = ({ className = "w-5 h-5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const ErrorIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CheckIcon = ({ className = "w-4 h-4" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

export default function SignupPage() {
    const [academicId, setAcademicId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const router = useRouter();

    // validation state
    const [academicError, setAcademicError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // password rules state
    const [pwLenOk, setPwLenOk] = useState(false);
    const [pwUpperOk, setPwUpperOk] = useState(false);
    const [pwLowerOk, setPwLowerOk] = useState(false);
    const [pwDigitOk, setPwDigitOk] = useState(false);
    const [pwSpecialOk, setPwSpecialOk] = useState(false);

    // helpers
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const academicRegex = /^4202[0123456]\d{3}$/;
    const onlyDigitsRegex = /^\d*$/;
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

    // live validate password
    useEffect(() => {
        setPwLenOk(password.length >= 8);
        setPwUpperOk(upperRegex.test(password));
        setPwLowerOk(lowerRegex.test(password));
        setPwDigitOk(digitRegex.test(password));
        setPwSpecialOk(specialRegex.test(password));

        if (password.length === 0) {
            setPasswordError(null);
        } else if (
            pwLenOk &&
            pwUpperOk &&
            pwLowerOk &&
            pwDigitOk &&
            pwSpecialOk
        ) {
            setPasswordError(null);
        } else {
            setPasswordError("Password does not meet all requirements.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, pwLenOk, pwUpperOk, pwLowerOk, pwDigitOk, pwSpecialOk]);

    // full name validation
    const onFullNameChange = (value: string) => {
        if (value.length > 20) return;
        setFullName(value);

        if (value.length === 0) {
            setFullNameError("Full Name is required.");
        } else {
            setFullNameError(null);
        }
    };

    const onFullNameBlur = () => {
        if (fullName.length === 0) {
            setFullNameError("Full Name is required.");
        } else {
            setFullNameError(null);
        }
    };

    // academic id validation
    const onAcademicChange = (value: string) => {
        if (!onlyDigitsRegex.test(value)) return;
        if (value.length > 8) return;
        setAcademicId(value);

        if (value.length === 0) {
            setAcademicError(null);
        } else if (!onlyDigitsRegex.test(value)) {
            setAcademicError("Academic ID must contain digits only.");
        } else if (value.length < 8) {
            setAcademicError("Academic ID must be 8 digits long.");
        } else if (!academicRegex.test(value)) {
            setAcademicError("Academic ID must start with 4202 and then 4 digits.");
        } else {
            setAcademicError(null);
        }
    };

    const onAcademicBlur = () => {
        if (academicId.length === 0) {
            setAcademicError("Academic ID is required.");
            return;
        }
        if (!academicRegex.test(academicId)) {
            setAcademicError("Academic ID must be 8 digits and start with 4202.");
        } else {
            setAcademicError(null);
        }
    };

    // email validation
    const onEmailChange = (value: string) => {
        setEmail(value);
        if (value.length === 0) {
            setEmailError(null);
        } else if (!emailRegex.test(value)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError(null);
        }
    };

    const onEmailBlur = () => {
        if (email.length === 0) {
            setEmailError("Email is required.");
        } else if (!emailRegex.test(email)) {
            setEmailError("Invalid email format.");
        } else {
            setEmailError(null);
        }
    };

    const formValid =
        academicRegex.test(academicId) &&
        emailRegex.test(email) &&
        pwLenOk &&
        pwUpperOk &&
        pwLowerOk &&
        pwDigitOk &&
        pwSpecialOk;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formValid) {
            if (!academicRegex.test(academicId))
                setAcademicError("Academic ID must be 8 digits and start with 4202.");
            if (!emailRegex.test(email))
                setEmailError("Invalid email format.");
            if (!(pwLenOk && pwUpperOk && pwLowerOk && pwDigitOk && pwSpecialOk))
                setPasswordError("Password does not meet all requirements.");
            return;
        }

        setLoading(true);
        try {
            const userToken = `Token-${academicId}-${crypto.randomUUID()}`;
            const result = await handelSignup(academicId, email, password, fullName, userToken);
            console.log(result);
            if (result.status) {
                localStorage.setItem("academicId", academicId);
                localStorage.setItem("email", email);
                localStorage.setItem("fullName", fullName);
                localStorage.setItem("userToken", userToken);
                setTimeout(() => router.push("/selectschedule"), 300);
            } else {
                if (result.type === "academicId") setAcademicError(result.message);
                else if (result.type === "email") setEmailError(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated Grid Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800 to-transparent animate-pulse"></div>
                </div>

                {/* Floating Particles */}
                {[...Array(12)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            y: [0, -80, 0],
                            x: [0, Math.random() * 60 - 30, 0],
                            opacity: [0, 0.4, 0],
                            scale: [0, 1.2, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 1.5,
                            ease: "easeInOut"
                        }}
                        className="absolute w-1.5 h-1.5 bg-gray-600 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
                
                {/* Enhanced Floating Shapes */}
                <motion.div
                    animate={{
                        rotate: 360,
                        y: [0, -25, 0],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        rotate: { duration: 25, repeat: Infinity, ease: "linear" },
                        y: { duration: 8, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute top-1/4 left-1/4 w-10 h-10 border border-gray-700/40 rounded-lg"
                />
                <motion.div
                    animate={{
                        rotate: -360,
                        y: [0, 20, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute bottom-1/3 right-1/4 w-8 h-8 border border-gray-700/30 rotate-45"
                />
                <motion.div
                    animate={{
                        rotate: 180,
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-3/4 left-3/4 w-12 h-12 border border-gray-700/20 rounded-full"
                />
            </div>

            {/* Enhanced Main Signup Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative w-full max-w-md"
            >
                {/* Enhanced Animated Border */}
                <motion.div
                    animate={{
                        rotate: 360,
                        background: [
                            "linear-gradient(45deg, #1f2937, #374151, #4b5563)",
                            "linear-gradient(45deg, #4b5563, #1f2937, #374151)",
                            "linear-gradient(45deg, #374151, #4b5563, #1f2937)",
                            "linear-gradient(45deg, #1f2937, #374151, #4b5563)",
                        ]
                    }}
                    transition={{
                        rotate: { duration: 12, repeat: Infinity, ease: "linear" },
                        background: { duration: 16, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="absolute inset-0 rounded-3xl p-[1.5px]"
                >
                    <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl border border-gray-700/60 shadow-2xl"></div>
                </motion.div>

                {/* Enhanced Inner Glow */}
                <motion.div
                    animate={{
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700/20 to-transparent pointer-events-none"
                />

                <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/60 shadow-2xl">
                    {/* Enhanced Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mb-10"
                    >
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-gray-300 mb-6 flex justify-center"
                        >
                            <div className="p-4 bg-gray-800/50 rounded-2xl border border-gray-700/50">
                                <UserIcon className="w-8 h-8" />
                            </div>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-3xl font-bold text-gray-100 mb-3"
                        >
                            Join UniStream22 Community
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-gray-400 text-lg"
                        >
                            Create your account and get started
                        </motion.p>
                    </motion.div>

                    {/* Enhanced Form */}
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Enhanced Full Name Field */}
                        <div>
                            <label htmlFor="fullName" className="block text-gray-300 font-semibold mb-3 text-base">
                                Full Name
                            </label>
                            <motion.div 
                                whileHover={{ scale: 1.02 }} 
                                whileFocus={{ scale: 1.02 }} 
                                className="relative group"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <UserIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" />
                                </div>
                                <input
                                    type="text"
                                    id="fullName"
                                    value={fullName}
                                    onChange={(e) => onFullNameChange(e.target.value)}
                                    onBlur={onFullNameBlur}
                                    required
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/60 border-2 backdrop-blur-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                                        fullNameError 
                                            ? "border-red-500/60 focus:border-red-500 shadow-lg shadow-red-500/10" 
                                            : "border-gray-700 focus:border-gray-500 focus:bg-gray-800/80 focus:shadow-2xl focus:shadow-gray-500/5"
                                    }`}
                                    placeholder="Enter your full name (max 20 chars)"
                                />
                            </motion.div>
                            <AnimatePresence>
                                {fullNameError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                    >
                                        <ErrorIcon className="w-4 h-4" />
                                        {fullNameError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Academic ID Field */}
                        <div>
                            <label htmlFor="academicId" className="block text-gray-300 font-semibold mb-3 text-base">
                                Academic ID
                            </label>
                            <motion.div 
                                whileHover={{ scale: 1.02 }} 
                                whileFocus={{ scale: 1.02 }} 
                                className="relative group"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <AcademicIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" />
                                </div>
                                <input
                                    inputMode="numeric"
                                    pattern="\d*"
                                    autoComplete="on"
                                    type="text"
                                    id="academicId"
                                    value={academicId}
                                    onChange={(e) => onAcademicChange(e.target.value)}
                                    onBlur={onAcademicBlur}
                                    required
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/60 border-2 backdrop-blur-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                                        academicError 
                                            ? "border-red-500/60 focus:border-red-500 shadow-lg shadow-red-500/10" 
                                            : "border-gray-700 focus:border-gray-500 focus:bg-gray-800/80 focus:shadow-2xl focus:shadow-gray-500/5"
                                    }`}
                                    placeholder="Enter your Academic ID (e.g. 4202XXXX)"
                                />
                            </motion.div>
                            <AnimatePresence>
                                {academicError ? (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                    >
                                        <ErrorIcon className="w-4 h-4" />
                                        {academicError}
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-3 text-sm text-gray-400 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/30"
                                    >
                                        Must be 8 digits and start with <span className="font-semibold text-gray-300">4202</span>
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-gray-300 font-semibold mb-3 text-base">
                                Email Address
                            </label>
                            <motion.div 
                                whileHover={{ scale: 1.02 }} 
                                whileFocus={{ scale: 1.02 }} 
                                className="relative group"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <EmailIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => onEmailChange(e.target.value)}
                                    onBlur={onEmailBlur}
                                    required
                                    className={`w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/60 border-2 backdrop-blur-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                                        emailError 
                                            ? "border-red-500/60 focus:border-red-500 shadow-lg shadow-red-500/10" 
                                            : "border-gray-700 focus:border-gray-500 focus:bg-gray-800/80 focus:shadow-2xl focus:shadow-gray-500/5"
                                    }`}
                                    placeholder="Enter your email"
                                />
                            </motion.div>
                            <AnimatePresence>
                                {emailError ? (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                    >
                                        <ErrorIcon className="w-4 h-4" />
                                        {emailError}
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-3 text-sm text-gray-400 bg-gray-800/30 px-3 py-2 rounded-lg border border-gray-700/30"
                                    >
                                        We'll use this email for login & notifications
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-gray-300 font-semibold mb-3 text-base">
                                Password
                            </label>
                            <motion.div 
                                whileHover={{ scale: 1.02 }} 
                                whileFocus={{ scale: 1.02 }} 
                                className="relative group"
                            >
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <PasswordIcon className="w-5 h-5 text-gray-400 group-focus-within:text-gray-300 transition-colors duration-300" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-800/60 border-2 backdrop-blur-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all duration-500 ${
                                        passwordError 
                                            ? "border-red-500/60 focus:border-red-500 shadow-lg shadow-red-500/10" 
                                            : "border-gray-700 focus:border-gray-500 focus:bg-gray-800/80 focus:shadow-2xl focus:shadow-gray-500/5"
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-300 p-2 rounded-lg hover:bg-gray-700/50"
                                >
                                    {!showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </motion.button>
                            </motion.div>

                            {/* Enhanced Password Rules */}
                            <div className="mt-4 space-y-2">
                                <RuleLine ok={pwLenOk} text="At least 8 characters" />
                                <RuleLine ok={pwUpperOk} text="At least one uppercase letter" />
                                <RuleLine ok={pwLowerOk} text="At least one lowercase letter" />
                                <RuleLine ok={pwDigitOk} text="At least one digit" />
                                <RuleLine ok={pwSpecialOk} text="At least one special character" />
                            </div>

                            <AnimatePresence>
                                {passwordError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20"
                                    >
                                        <ErrorIcon className="w-4 h-4" />
                                        {passwordError}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Enhanced Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={loading || !formValid}
                            onHoverStart={() => setIsHovered(true)}
                            onHoverEnd={() => setIsHovered(false)}
                            whileHover={!loading && formValid ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!loading && formValid ? { scale: 0.98 } : {}}
                            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-500 relative overflow-hidden group ${
                                loading || !formValid
                                    ? "bg-gray-700 cursor-not-allowed text-gray-500"
                                    : "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-gray-100 shadow-2xl hover:shadow-3xl hover:shadow-gray-500/10 border border-gray-600/50"
                            }`}
                        >
                            <motion.span
                                animate={loading ? { opacity: [1, 0.8, 1] } : {}}
                                transition={{ duration: 2, repeat: loading ? Infinity : 0 }}
                                className="relative z-10 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full"
                                        />
                                        Signing Up...
                                    </>
                                ) : (
                                    <>
                                        <UserIcon className="w-5 h-5" />
                                        Sign Up
                                    </>
                                )}
                            </motion.span>
                            
                            {/* Enhanced Button Shine Effect */}
                            {!loading && formValid && (
                                <motion.div
                                    animate={{
                                        x: isHovered ? "100%" : "-100%",
                                    }}
                                    transition={{ duration: 1.2 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-400/15 to-transparent transform -skew-x-12"
                                />
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Enhanced Login Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-400 text-base">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                onClick={() => {
                                    sessionStorage.setItem("hasReloadedSignup", "false");
                                    sessionStorage.setItem("hasReloadedLogin", "false");
                                }}
                                className="text-gray-300 font-semibold hover:text-gray-100 underline underline-offset-4 transition-all duration-300 hover:underline-offset-2"
                            >
                                Login Now
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

// Enhanced RuleLine Component
function RuleLine({ ok, text }: { ok: boolean; text: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
        >
            <motion.div
                animate={ok ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    ok
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-700/50 text-gray-500 border border-gray-600/30"
                }`}
            >
                {ok ? (
                    <CheckIcon className="w-3 h-3" />
                ) : (
                    <div className="w-2 h-0.5 bg-gray-500 rounded-full" />
                )}
            </motion.div>
            <span
                className={`text-sm ${ok ? "text-gray-300" : "text-gray-500"}`}
            >
                {text}
            </span>
        </motion.div>
    );
}