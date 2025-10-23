"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from 'next/navigation';

type LoginResponse = {
  message: string;
  status: boolean;
  type?: string;
  user?: {
    academicId: string;
    email: string;
    fullName: string;
    userToken: string;
    role: string;
  };
};

async function handelLogin(email: string, password: string): Promise<LoginResponse> {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      return data as LoginResponse;
    } catch {
      console.error("handelLogin: server returned non-json:", text);
      return { message: "Server error", status: false };
    }
  } catch (err) {
    console.error("handelLogin error:", err);
    return { message: "Unexpected error", status: false };
  }
}

// SVG Icons
const LockIcon = ({ className = "w-6 h-6" }) => (
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

const ArrowRightIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail") || localStorage.getItem("email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const onEmailChange = (value: string) => {
    setEmail(value);
    if (value.length === 0) setEmailError("Email is required.");
    else if (!emailRegex.test(value)) setEmailError("Invalid email format.");
    else setEmailError(null);
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    if (value.length === 0) setPasswordError("Password is required.");
    else if (value.length < 6) setPasswordError("Password must be at least 6 characters.");
    else setPasswordError(null);
  };

  const formValid = !emailError && !passwordError && email.length > 0 && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await handelLogin(email.trim(), password);

      if (res.status && res.user) {
        localStorage.setItem("savedEmail", email.trim());
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("academicId", res.user.academicId);
        localStorage.setItem("email", res.user.email);
        localStorage.setItem("fullName", res.user.fullName);
        localStorage.setItem("userToken", res.user.userToken);
        document.cookie = `role=${encodeURIComponent(res.user.role)}; path=/; Secure; SameSite=Lax`;

        sessionStorage.setItem("hasReloadedSignup", "false");
        sessionStorage.setItem("hasReloadedLogin", "false");
        router.replace("/home");
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error("submit error:", err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloadedLogin");
    if (!hasReloaded) {
      sessionStorage.setItem("hasReloadedLogin", "true");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
        />

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -120, 0],
              x: [0, Math.random() * 80 - 40, 0],
              opacity: [0, 0.6, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 18 + Math.random() * 12,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut"
            }}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Main Login Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        {/* Enhanced Animated Border */}
        <motion.div
          animate={{
            rotate: 360,
            background: [
              "linear-gradient(45deg, #4f46e5, #7c3aed, #ec4899, #06b6d4)",
              "linear-gradient(45deg, #06b6d4, #4f46e5, #7c3aed, #ec4899)",
              "linear-gradient(45deg, #ec4899, #06b6d4, #4f46e5, #7c3aed)",
              "linear-gradient(45deg, #7c3aed, #ec4899, #06b6d4, #4f46e5)",
            ]
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            background: { duration: 20, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute inset-0 rounded-3xl p-[2px]"
        >
          <div className="w-full h-full rounded-3xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl"></div>
        </motion.div>

        <div className="relative bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-2xl rounded-3xl p-8 border border-gray-700/60 shadow-2xl">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-10"
          >
            <motion.div
              animate={{
                y: [0, -12, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-gray-300 mb-6 flex justify-center"
            >
              <div className="p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl border border-gray-700/50 shadow-lg">
                <LockIcon className="w-8 h-8" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-black text-gray-100 mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-lg"
            >
              Sign in to your account
            </motion.p>
          </motion.div>

          {/* Enhanced Login Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-8"
            method="POST"
            action="/api/login"
            autoComplete="on"
          >
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 }}
            >
              <label htmlFor="email" className="block text-gray-300 font-semibold mb-3 text-base">
                Email Address
              </label>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileFocus={{ scale: 1.02 }}
                className="relative group"
              >
                <motion.div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{ 
                    scale: email ? 1.1 : 1,
                    color: email ? "#a78bfa" : "#9ca3af"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <EmailIcon className="w-5 h-5" />
                </motion.div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/60 border-2 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-100 transition-all duration-300 outline-none"
                />
                {/* Animated Border Effect */}
                <motion.div 
                  className="absolute inset-0 rounded-xl border-2 border-transparent pointer-events-none"
                  animate={{ 
                    boxShadow: email ? "0 0 0 2px rgba(139, 92, 246, 0.3)" : "none"
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <AnimatePresence>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2 flex items-center gap-2"
                  >
                    {emailError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <label htmlFor="password" className="block text-gray-300 font-semibold mb-3 text-base">
                Password
              </label>
              <motion.div 
                whileHover={{ scale: 1.02 }} 
                whileFocus={{ scale: 1.02 }}
                className="relative group"
              >
                <motion.div 
                  className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                  animate={{ 
                    scale: password ? 1.1 : 1,
                    color: password ? "#a78bfa" : "#9ca3af"
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <PasswordIcon className="w-5 h-5" />
                </motion.div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 rounded-xl bg-gray-800/60 border-2 border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-gray-100 transition-all duration-300 outline-none"
                />
                
                {/* Password Toggle Button */}
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-400 p-1 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    animate={{ rotate: showPassword ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {!showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </motion.div>
                </motion.button>
              </motion.div>
              <AnimatePresence>
                {passwordError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm mt-2 flex items-center gap-2"
                  >
                    {passwordError}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.9 }}
                  className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-center"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -2, 2, 0]
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-semibold"
                  >
                    {error}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 }}
            >
              <motion.button
                type="submit"
                disabled={loading || !formValid}
                className={`w-full py-4 rounded-xl font-bold text-base relative overflow-hidden ${
                  loading || !formValid
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                } transition-all duration-300`}
                whileHover={!loading && formValid ? { 
                  scale: 1.02,
                } : {}}
                whileTap={!loading && formValid ? { scale: 0.98 } : {}}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                {/* Loading Animation */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        rotate: {
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        },
                        scale: {
                          duration: 0.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                  </motion.div>
                )}

                {/* Button Text */}
                <motion.span
                  animate={{ 
                    opacity: loading ? 0 : 1,
                    y: loading ? 10 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                >
                  {loading ? "Signing in..." : "Sign In"}
                  {!loading && formValid && (
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.span>

                {/* Shimmer Effect on Hover */}
                {!loading && formValid && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                )}
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Enhanced Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-400 text-base">
              Don't have an account?{" "}
              <Link
                href="/signup"
                onClick={() => {
                  sessionStorage.setItem("hasReloadedSignup", "false");
                  sessionStorage.setItem("hasReloadedLogin", "false");
                }}
                className="text-gray-300 font-semibold hover:text-indigo-300 underline underline-offset-4 transition-all duration-300 hover:underline-offset-2"
              >
                Sign Up Now
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}