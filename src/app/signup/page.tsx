"use client";
import React, { useState, useEffect } from "react";
import "./style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
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
    fullName: string
): Promise<SignupResponse> {
    try {
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ academicId, email, password, fullName }),
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.error("handelSignup error:", err);
        return { message: "Unexpected error", status: false, type: "error" };
    }
}

export default function SignupPage() {
    const [academicId, setAcademicId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState<string | null>(null);
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
            const result = await handelSignup(academicId, email, password, fullName);
            console.log(result);
            if (result.status) {
                localStorage.setItem("academicId", academicId);
                localStorage.setItem("email", email);
                localStorage.setItem("fullName", fullName);
                setTimeout(() => router.push("/selectschedule"), 300);
            } else {
                if (result.type === "academicId") setAcademicError(result.message);
                else if (result.type === "email") setEmailError(result.message);
            }
        } finally {
            setLoading(false);
        }
    };

    console.log({ academicId, email, password, fullName, formValid });

    return (
        <div className="login-bg min-h-screen flex items-center justify-center px-4">
            <div className="login-container relative max-w-md w-full p-8 sm:p-12 my-10">
                <div className="gradient-border mb-7"></div>

                <h1 className="text-3xl font-bold text-white mb-2 text-center relative z-10">
                    Welcome To HTI
                </h1>
                <p className="text-gray-300 text-center mb-8 relative z-10">
                    Get Start and Sign Up Now
                </p>

                <div className="gradient-border mb-4"></div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 relative z-10"
                    noValidate
                    autoComplete="on"
                >
                    {/* Full Name */}
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-gray-200 font-medium mb-2"
                        >
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => onFullNameChange(e.target.value)}
                            onBlur={onFullNameBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${fullNameError ? "ring-2 ring-red-500" : ""
                                }`}
                            placeholder="Enter your full name (max 20 chars)"
                        />
                        {fullNameError && (
                            <p className="mt-2 text-sm text-red-400">{fullNameError}</p>
                        )}
                    </div>

                    {/* Academic ID */}
                    <div>
                        <label
                            htmlFor="academicId"
                            className="block text-gray-200 font-medium mb-2"
                        >
                            Academic ID
                        </label>
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
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${academicError ? "ring-2 ring-red-500" : ""
                                }`}
                            placeholder="Enter your Academic ID (e.g. 4202XXXX)"
                        />
                        {academicError ? (
                            <p className="mt-2 text-sm text-red-400">{academicError}</p>
                        ) : (
                            <p className="mt-2 text-sm text-gray-400">
                                Must be 8 digits and start with{" "}
                                <span className="font-semibold">4202</span>.
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-200 font-medium mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            onBlur={onEmailBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${emailError ? "ring-2 ring-red-500" : ""
                                }`}
                            placeholder="Enter your email"
                        />
                        {emailError ? (
                            <p className="mt-2 text-sm text-red-400">{emailError}</p>
                        ) : (
                            <p className="mt-2 text-sm text-gray-400">
                                We'll use this email for login & notifications.
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className="block text-gray-200 font-medium mb-2"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition pr-12 ${passwordError ? "ring-2 ring-red-500" : ""
                                    }`}
                                placeholder="Enter your password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <i className="fas fa-eye cursor-pointer"></i>
                                ) : (
                                    <i className="fas fa-eye-slash cursor-pointer"></i>
                                )}
                            </button>
                        </div>

                        {/* password rules visual */}
                        <div className="mt-3 space-y-1 text-sm">
                            <RuleLine ok={pwLenOk} text="At least 8 characters" />
                            <RuleLine ok={pwUpperOk} text="At least one uppercase letter" />
                            <RuleLine ok={pwLowerOk} text="At least one lowercase letter" />
                            <RuleLine ok={pwDigitOk} text="At least one digit" />
                            <RuleLine
                                ok={pwSpecialOk}
                                text="At least one special character (!@#$...)"
                            />
                        </div>

                        {passwordError && (
                            <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formValid}
                        className={`w-full py-3 ${loading || !formValid
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                            } text-white font-semibold rounded-xl shadow-md transition relative z-10`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-300 relative z-10">
                    Already have an account?{" "}
                    <Link
                        href={"/login"}
                        onClick={() => {
                            sessionStorage.setItem("hasReloadedSignup", "false");
                            sessionStorage.setItem("hasReloadedLogin", "false");
                        }}
                        className="text-indigo-400 font-semibold hover:underline"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

function RuleLine({ ok, text }: { ok: boolean; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${ok
                    ? "bg-green-400 text-white"
                    : "bg-gray-700 text-gray-400"
                    }`}
            >
                {ok ? (
                    <i className="fas fa-check text-xs"></i>
                ) : (
                    <i className="fas fa-minus text-xs"></i>
                )}
            </span>
            <span
                className={`text-sm ${ok ? "text-gray-200" : "text-gray-400"
                    }`}
            >
                {text}
            </span>
        </div>
    );
}
