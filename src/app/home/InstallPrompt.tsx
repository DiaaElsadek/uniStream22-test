"use client";

import { useEffect, useState } from "react";

export default function MobileInstallPrompt() {
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isAndroid, setIsAndroid] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);
        setIsAndroid(/android/.test(userAgent));

        // نخزن الحدث لما يكون أندرويد
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBox(true);
        });

        // fallback في حالة مش ظهر الحدث
        if (isMobile && !isAndroid) {
            setShowInstallBox(true);
        }

        // نخفيها بعد 10 ثواني تلقائيًا
        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 500);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [showInstallBox]);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === "accepted") {
                console.log("User accepted installation");
            } else {
                console.log("User dismissed installation");
            }
            setDeferredPrompt(null);
            setFadeOut(true);
            setTimeout(() => setShowInstallBox(false), 300);
        }
    };

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => setShowInstallBox(false), 300);
    };

    if (!showInstallBox) return null;

    return (
        <div className={`mobile-install-prompt ${fadeOut ? "fade-out" : "fade-in"}`}>
            <div className="mobile-content">
                <button className="close" onClick={handleClose}>×</button>
                <div className="icon">📲</div>
                <div className="text">
                    <h4>{isAndroid ? "Install App" : "Add to Home Screen"}</h4>
                    <p>
                        {isAndroid
                            ? "Install this app directly on your device for faster access."
                            : "Tap 'Share → Add to Home Screen' to install this app."}
                    </p>

                    {isAndroid ? (
                        <button className="install-btn" onClick={handleInstall}>
                            Install
                        </button>
                    ) : (
                        <div className="steps">
                            <span>Tap</span> <strong>⋮</strong> <span>or</span>{" "}
                            <strong>Share → Add to Home Screen</strong>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .mobile-install-prompt {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(20, 20, 30, 0.95);
                    color: white;
                    border-radius: 20px;
                    padding: 16px 20px;
                    width: 90%;
                    max-width: 400px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                    opacity: 0;
                    transform: translate(-50%, 20px);
                    transition: all 0.4s ease;
                }

                .fade-in {
                    opacity: 1;
                    transform: translate(-50%, 0);
                }

                .fade-out {
                    opacity: 0;
                    transform: translate(-50%, 20px);
                }

                .mobile-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    position: relative;
                }

                .icon {
                    font-size: 28px;
                    flex-shrink: 0;
                    animation: bounce 2s infinite;
                }

                .text {
                    flex: 1;
                }

                .text h4 {
                    margin: 0;
                    font-size: 15px;
                    font-weight: 700;
                }

                .text p {
                    margin: 4px 0;
                    font-size: 13px;
                    opacity: 0.85;
                }

                .steps {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 4px;
                }

                .install-btn {
                    background: linear-gradient(135deg, #4facfe, #00f2fe);
                    border: none;
                    padding: 8px 16px;
                    border-radius: 10px;
                    color: white;
                    font-weight: 600;
                    cursor: pointer;
                    margin-top: 6px;
                    transition: all 0.3s ease;
                }

                .install-btn:hover {
                    opacity: 0.85;
                    transform: scale(1.05);
                }

                .close {
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 26px;
                    height: 26px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .close:hover {
                    background: rgba(255,255,255,0.2);
                }

                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }
            `}</style>
        </div>
    );
}
