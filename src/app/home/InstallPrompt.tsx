"use client";

import { useEffect, useState } from "react";

export default function MobileInstallPrompt() {
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // نتحقق لو المستخدم على موبايل (Android / iPhone / iPad)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);

        if (isMobile) {
            setShowInstallBox(true);
        }

        // نخفيها بعد 7 ثواني تلقائيًا
        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 500);
            }, 7000);
            return () => clearTimeout(timer);
        }
    }, [showInstallBox]);

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
                    <h4>Add to Home Screen</h4>
                    <p>Install this app on your device for quick access!</p>
                    <div className="steps">
                        <span>Tap</span>
                        <strong>⋮</strong>
                        <span>or</span>
                        <strong>Share → Add to Home Screen</strong>
                    </div>
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
