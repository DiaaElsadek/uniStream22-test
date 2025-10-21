"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | null>(null);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIOS = /iphone|ipad|ipod/.test(userAgent);
        const isAndroid = /android/.test(userAgent);
        const isStandalone = (window.navigator as any).standalone === true;

        if (isIOS && !isStandalone) {
            setPlatform("ios");
            setShowInstallBox(true);
        } else if (isAndroid) {
            setPlatform("android");
        } else {
            setPlatform("desktop");
        }

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBox(true);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    // ⏱️ إخفاء البوكس بعد 5 ثواني مع انيميشن
    useEffect(() => {
        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 600);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showInstallBox]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setFadeOut(true);
        setTimeout(() => setShowInstallBox(false), 600);
    };

    if (!showInstallBox) return null;

    return (
        <div className={`fixed top-6 left-6 z-50 max-w-sm ${fadeOut ? "animate-fadeOut" : "animate-fadeIn"}`}>
            {/* Card Container */}
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur-sm">
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm -z-10 animate-pulse"></div>
                
                {/* Content */}
                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                            <span className="text-white text-lg">📱</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">تثبيت التطبيق</h3>
                            <p className="text-blue-200 text-sm">تجربة أفضل وأسرع</p>
                        </div>
                    </div>

                    {/* Platform Specific Content */}
                    <div className="space-y-4">
                        {platform === "ios" && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                                    <span className="text-white text-xs">1</span>
                                </div>
                                <p className="text-white/90 text-sm leading-relaxed">
                                    اضغط على <span className="font-bold text-blue-300">Share</span> 
                                    <span className="mx-2">→</span>
                                    ثم <span className="font-bold text-green-300">Add to Home Screen</span>
                                </p>
                            </div>
                        )}

                        {(platform === "android" || platform === "desktop") && (
                            <>
                                <p className="text-white/80 text-sm leading-relaxed">
                                    {platform === "android" 
                                        ? "ثبّت التطبيق على جهازك لتجربة سريعة وسلسة"
                                        : "ثبّت التطبيق على سطح المكتب للوصول السريع"
                                    }
                                </p>
                                <button 
                                    onClick={handleInstallClick}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <span>⚡</span>
                                    تثبيت الآن
                                    <span>📲</span>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Close Timer Indicator */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-white/60">
                            <span>⏱️</span>
                            <span>سيتم إخفاؤه تلقائياً</span>
                        </div>
                        <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full ${
                                    fadeOut ? "animate-shrinkWidth" : "animate-progressBar"
                                }`}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.9);
                    }
                }

                @keyframes progressBar {
                    from {
                        width: 100%;
                    }
                    to {
                        width: 0%;
                    }
                }

                @keyframes shrinkWidth {
                    from {
                        width: var(--current-width);
                    }
                    to {
                        width: 0%;
                    }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }

                .animate-fadeOut {
                    animation: fadeOut 0.6s ease-in forwards;
                }

                .animate-progressBar {
                    animation: progressBar 5s linear forwards;
                }

                .animate-shrinkWidth {
                    animation: shrinkWidth 0.6s linear forwards;
                }
            `}</style>
        </div>
    );
}