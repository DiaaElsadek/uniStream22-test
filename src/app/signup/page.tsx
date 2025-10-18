"use client";
import React, { useState, useEffect } from "react";
import './style.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

type SignupResponse = {
    message: string;
    status: boolean;
    type: string;
};

async function saveData(
    academicId: string,
    email: string,
    password: string,
    fullName: string,
    userToken: string,
) {
    const res = await fetch(
        "https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser",
        {
            method: "POST",
            headers: {
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                AcademicId: academicId,
                email: email,
                password: password,
                Role: "user",
                fullName: fullName,
                userToken: userToken,
            }),
        }
    );
    if (res.ok) {
        // alert("All is Okay");
        return true;
    } else {
        console.error("SaveData failed:", await res.text());
        // alert("All is Not Okay");
        return false;
    }
}

async function handelSignup(academicId: string,
    email: string,
    password: string,
    fullName: string): Promise<SignupResponse> {

    // افترض body عندك فيه الـ email اللي عايز تجيب البيانات بتاعته

    const query = `?AcademicId=eq.${academicId}`; // مثال فلترة حسب الايميل
    const url = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${query}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
            "Content-Type": "application/json",
        },
    });

    // استلام الداتا في متغير
    const data = await res.json();

    const academicIdError = {
        message: "This Acadimic ID is Already Registered.",
        status: false,
        type: "academicId"
    }

    console.log(data);

    if (data[0]?.AcademicId !== "" && data.length > 0) {
        // alert("This Academic ID is already registered.");
        return academicIdError;
    }

    const queryEmail = `?email=eq.${email}`; // مثال فلترة حسب الايميل
    const urlEmail = `https://udhvfuvdxwhwobgleuyd.supabase.co/rest/v1/AppUser${queryEmail}`;

    const resEmail = await fetch(urlEmail, {
        method: "GET",
        headers: {
            "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkaHZmdXZkeHdod29iZ2xldXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0OTIwODQsImV4cCI6MjA3NDA2ODA4NH0.P-EefbnljoUmaQ-t03FypD37CRmTDa8Xhv-QMJHndY4",
            "Content-Type": "application/json",
        },
    });

    const emailError = {
        message: "This Email is Already Registered.",
        status: false,
        type: "email"
    }

    const dataEmail = await resEmail.json();

    console.log(dataEmail);


    if (dataEmail[0]?.email !== "" && dataEmail.length > 0) {
        // alert("This Email is already registered.");
        return emailError;
    }

    localStorage.setItem("academicId", academicId);

    // Handler OTP
    // const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit
    // const leftotp = Math.floor(100000 + Math.random() * 900000);
    // const rightotp = Math.floor(100000 + Math.random() * 900000);

    // تحديد الرابط الأساسي (محلي أو على Vercel)
    // const baseUrl =
    //     typeof window === "undefined"
    //         ? process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    //         : window.location.origin;

    // const resOTP = await fetch(`${baseUrl}/api/handelerotp`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ email, otp, academicId }),
    // });

    const successMessage = {
        message: "Registered Successfully",
        status: true,
        type: "All is Okay",
    };

    // let dataOTP;
    // try {
    //     dataOTP = await resOTP.json();
    // } catch {
    //     dataOTP = { success: false, message: `Server returned status ${resOTP.status}` };
    // }

    // console.log("Data OTP:", dataOTP);

    // if (!dataOTP.success) {
    //     return {
    //         message: "Failed to send OTP. Please try again.",
    //         status: false,
    //         type: "OTP",
    //     };
    // } else {
    //     if (typeof window !== "undefined") {
    //         localStorage.setItem("id", leftotp.toString() + otp.toString() + rightotp.toString());
    //         localStorage.setItem("email", email);
    //         localStorage.setItem("academicId", academicId);
    //         localStorage.setItem("fullName", fullName);
    //         localStorage.setItem("password", password);
    //     }
    //     return successMessage;
    // }

    // localStorage.setItem("id", leftotp.toString() + otp.toString() + rightotp.toString());
    localStorage.setItem("email", email);
    localStorage.setItem("academicId", academicId);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("password", password);
    return successMessage;

}

export default function SignupPage() {
    const [academicId, setAcademicId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    // Name Validation
    // داخل الـ SignupPage component، قبل الأكاديمك والاميل والباسورد
    const [fullName, setFullName] = useState("");
    const [fullNameError, setFullNameError] = useState<string | null>(null);

    // handler للـ full name
    const onFullNameChange = (value: string) => {
        if (value.length > 20) return; // لا يزيد عن 20 حرف
        setFullName(value);

        // live validation message
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

    // helpers: regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const academicRegex = /^4202[0123456]\d{3}$/; // starts with 4202 then 4 digits (total 8 digits)
    const onlyDigitsRegex = /^\d*$/;
    const upperRegex = /[A-Z]/;
    const lowerRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

    // live validate password rules
    useEffect(() => {
        setPwLenOk(password.length >= 8);
        setPwUpperOk(upperRegex.test(password));
        setPwLowerOk(lowerRegex.test(password));
        setPwDigitOk(digitRegex.test(password));
        setPwSpecialOk(specialRegex.test(password));

        // overall password error (one-line message)
        if (password.length === 0) {
            setPasswordError(null);
        } else if (pwLenOk && pwUpperOk && pwLowerOk && pwDigitOk && pwSpecialOk) {
            setPasswordError(null);
        } else {
            setPasswordError("Password does not meet all requirements.");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, pwLenOk, pwUpperOk, pwLowerOk, pwDigitOk, pwSpecialOk]);

    // academicId validation on change (force numeric only)
    const onAcademicChange = (value: string) => {
        // allow only digits while typing
        if (!onlyDigitsRegex.test(value)) return;
        // limit to 8 chars
        if (value.length > 8) return;
        setAcademicId(value);

        // live validation message
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

    // decide if form valid
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
        // final pre-check
        if (!formValid) {
            // show inline messages if something missing
            if (!academicRegex.test(academicId)) setAcademicError("Academic ID must be 8 digits and start with 4202.");
            if (!emailRegex.test(email)) setEmailError("Invalid email format.");
            if (!(pwLenOk && pwUpperOk && pwLowerOk && pwDigitOk && pwSpecialOk)) setPasswordError("Password does not meet all requirements.");
            return;
        }

        setLoading(true);

        try {

            const isOkay = await handelSignup(academicId, email, password, fullName); // userToken not used now

            // call your server-side API route (recommended) to avoid CORS and hide keys
            // const res = await fetch("/api/signup", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ academicId, email, password }),
            // });

            if (isOkay.status) {
                // if ok -> simulate token or use returned token if API gives one
                let token = "";
                if (!token) {
                    token = `token-${btoa(JSON.stringify({ academicId, email, ts: Date.now() }))}`;
                }
                localStorage.setItem("userToken", token);
                // success UX
                // alert("Signed up successfully!");
                // academicId = localStorage.getItem("academicId");
                // email = localStorage.getItem("email");
                const fullName = localStorage.getItem("fullName");
                const userToken = localStorage.getItem("userToken");
                const password = localStorage.getItem("password");
                const res = await saveData(academicId, email, password ?? "", fullName ?? "", userToken ?? "");
                if (res) {
                    sessionStorage.setItem("hasReloadedSignup", "false");
                    sessionStorage.setItem("hasReloadedLogin", "false");
                    router.push("/selectschedule");
                }
                else {
                    console.log("try again");
                }
            }
            else {
                if (isOkay.type === "academicId") {
                    setAcademicError(isOkay.message);
                }
                else if (isOkay.type === "email") {
                    setEmailError(isOkay.message);
                }
            }
        }
        finally {
            setLoading(false);
        }
    };

    // Hot Reload
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem("hasReloadedSignup");
    
        if (!hasReloaded) {
          sessionStorage.setItem("hasReloadedSignup", "true");
          window.location.reload();
        }
      }, []);

    // console.log("Keys:", process.env.MAILJET_API_KEY, process.env.MAILJET_SECRET_KEY);
    // console.log("Keys:", process.env.MAILJET_API_KEY!, process.env.MAILJET_SECRET_KEY!);

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

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10" noValidate
                    autoComplete="on" >
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullName" className="block text-gray-200 font-medium mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            value={fullName}
                            onChange={(e) => onFullNameChange(e.target.value)}
                            onBlur={onFullNameBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${fullNameError ? "ring-2 ring-red-500" : ""}`}
                            placeholder="Enter your full name (max 20 chars)"
                        />
                        {fullNameError && (
                            <p className="mt-2 text-sm text-red-400">{fullNameError}</p>
                        )}
                    </div>
                    {/* Academic ID */}
                    <div>
                        <label htmlFor="academicId" className="block text-gray-200 font-medium mb-2">
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
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${academicError ? "ring-2 ring-red-500" : ""}`}
                            placeholder="Enter your Academic ID (e.g. 4202XXXX)"
                        />
                        {academicError ? (
                            <p className="mt-2 text-sm text-red-400">{academicError}</p>
                        ) : (
                            <p className="mt-2 text-sm text-gray-400">Must be 8 digits and start with <span className="font-semibold">4202</span>.</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-200 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => onEmailChange(e.target.value)}
                            onBlur={onEmailBlur}
                            required
                            className={`w-full px-4 py-3 border rounded-xl border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition ${emailError ? "ring-2 ring-red-500" : ""}`}
                            placeholder="Enter your email"
                        />
                        {emailError ? (
                            <p className="mt-2 text-sm text-red-400">{emailError}</p>
                        ) : (
                            <p className="mt-2 text-sm text-gray-400">We'll use this email for login & notifications.</p>
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
                            <RuleLine ok={pwSpecialOk} text="At least one special character (!@#$...)" />
                        </div>

                        {passwordError && (
                            <p className="mt-2 text-sm text-red-400">{passwordError}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !formValid}
                        className={`w-full py-3 ${loading || !formValid ? "bg-gray-600 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"} text-white font-semibold rounded-xl shadow-md transition relative z-10`}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-300 relative z-10">
                    Already have an account?{" "}
                    <Link href={'/login'} onClick={ () => {
                        sessionStorage.setItem("hasReloadedSignup", "false");
                        sessionStorage.setItem("hasReloadedLogin", "false");
                    }} className="text-indigo-400 font-semibold hover:underline">
                        Login Now
                    </Link>
                </div>
            </div>
        </div>
    );
}

/* small component to show rule with check */
function RuleLine({ ok, text }: { ok: boolean; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${ok ? "bg-green-400 text-white" : "bg-gray-700 text-gray-400"}`}>
                {ok ? <i className="fas fa-check text-xs"></i> : <i className="fas fa-minus text-xs"></i>}
            </span>
            <span className={`text-sm ${ok ? "text-gray-200" : "text-gray-400"}`}>{text}</span>
        </div>
    );
}
