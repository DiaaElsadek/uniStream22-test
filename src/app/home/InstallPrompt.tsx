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
        <div className={`install-box ${fadeOut ? "fade-out" : "fade-in"}`}>
            <div className="gradient-border"></div>
            <div className="install-content">
                {platform === "ios" && (
                    <p>📱 على أجهزة iPhone: اضغط <b>Share</b> ثم <b>Add to Home Screen</b> لتثبيت التطبيق.</p>
                )}

                {platform === "android" && (
                    <>
                        <p>📲 ثبّت التطبيق لتجربة أسرع وأفضل!</p>
                        <button onClick={handleInstallClick}>تثبيت التطبيق</button>
                    </>
                )}

                {platform === "desktop" && (
                    <>
                        <p>💻 يمكنك تثبيت التطبيق على سطح المكتب لتسهيل الوصول إليه.</p>
                        <button onClick={handleInstallClick}>تثبيت الآن</button>
                    </>
                )}
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(20, 20, 30, 0.95);
                    border-radius: 1.5rem;
                    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
                    padding: 15px 25px;
                    z-index: 1000;
                    color: #e5e7eb;
                    font-weight: 500;
                    overflow: hidden;
                    max-width: 300px;
                    opacity: 0;
                    transform: translateY(-15px);
                    transition: opacity 0.6s ease, transform 0.6s ease;
                }

                .fade-in {
                    opacity: 1;
                    transform: translateY(0);
                }

                .fade-out {
                    opacity: 0;
                    transform: translateY(-15px);
                }

                .gradient-border {
                    position: absolute;
                    inset: 0;
                    padding: 2px;
                    border-radius: 1.5rem;
                    background: linear-gradient(270deg, rgba(0, 0, 0, 0.6), #e5e7eb);
                    background-size: 600% 600%;
                    animation: gradientMove 6s ease infinite;
                    z-index: 1;
                    pointer-events: none;
                }

                .install-content {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                button {
                    background: linear-gradient(135deg, #2563eb, #1d4ed8);
                    color: white;
                    border: none;
                    border-radius: 0.75rem;
                    padding: 6px 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
                }

                @keyframes gradientMove {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
        </div>
    );
}
