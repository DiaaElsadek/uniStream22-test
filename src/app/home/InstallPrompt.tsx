"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // نتحقق إذا المستخدم على ديسكتوب فقط
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);

        if (!isMobile) {
            setShowInstallBox(true);
        }

        // نخفيها بعد 5 ثواني
        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 600);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showInstallBox]);

    if (!showInstallBox) return null;

    return (
        <div className={`install-box ${fadeOut ? "fade-out" : "fade-in"}`}>
            <div className="gradient-border"></div>
            <div className="install-content">
                <div className="icon">📱</div>
                <p>💻 You can install the web app directly from your browser menu!</p>
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    background: linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(50, 50, 80, 0.95));
                    border-radius: 2rem;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(100, 100, 255, 0.3);
                    padding: 20px 30px;
                    z-index: 1000;
                    color: #ffffff;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-weight: 600;
                    font-size: 14px;
                    overflow: hidden;
                    max-width: 350px;
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }

                .fade-in {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .fade-out {
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                }

                .gradient-border {
                    position: absolute;
                    inset: 0;
                    padding: 3px;
                    border-radius: 2rem;
                    background: linear-gradient(270deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe);
                    background-size: 600% 600%;
                    animation: gradientMove 8s ease infinite;
                    z-index: 1;
                    pointer-events: none;
                }

                .install-content {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .icon {
                    font-size: 24px;
                    animation: bounce 2s infinite;
                }

                p {
                    margin: 0;
                    line-height: 1.4;
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

                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40% {
                        transform: translateY(-5px);
                    }
                    60% {
                        transform: translateY(-3px);
                    }
                }
            `}</style>
        </div>
    );
}
