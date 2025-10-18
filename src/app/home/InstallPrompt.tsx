"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const iOS = /iphone|ipad|ipod/.test(userAgent);
        const standalone = (window.navigator as any).standalone === true;

        if (iOS && !standalone) {
            setIsIOS(true);
            setShowInstallBox(true);
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

    // ✅ Auto hide after 5s for both iOS & Android with fade animation
    useEffect(() => {
        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 600); // بعد الانيميشن
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
                {isIOS ? (
                    <p>📱 Tap <b>Share</b> → <b>Add to Home Screen</b> to install the app.</p>
                ) : (
                    <>
                        <p>📱 Install the app for a faster and smoother experience!</p>
                        <button onClick={handleInstallClick}>Install</button>
                    </>
                )}
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: rgba(20, 20, 30, 0.9);
                    border-radius: 1.5rem;
                    box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
                    padding: 15px 25px;
                    z-index: 1000;
                    color: #e5e7eb;
                    font-weight: 500;
                    overflow: hidden;
                    max-width: 280px;
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
