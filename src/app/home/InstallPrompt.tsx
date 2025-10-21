"use client";

import { useEffect, useState } from "react";

export default function InstallPrompt() {
    const [showInstallBox, setShowInstallBox] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android|mobile/.test(userAgent);

        if (!isMobile) {
            setShowInstallBox(true);
        }

        if (showInstallBox) {
            const timer = setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => setShowInstallBox(false), 600);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [showInstallBox]);

    const handleClose = () => {
        setFadeOut(true);
        setTimeout(() => setShowInstallBox(false), 300);
    };

    if (!showInstallBox) return null;

    return (
        <div className={`install-box ${fadeOut ? "fade-out" : "fade-in"}`}>
            <div className="gradient-border"></div>
            <button className="close-btn" onClick={handleClose}>×</button>
            
            <div className="install-content">
                <div className="icon-container">
                    <div className="icon">📱</div>
                    <div className="pulse-ring"></div>
                </div>
                <div className="text-content">
                    <h3>Install Web App</h3>
                    <p>Get quick access by installing this app to your desktop</p>
                    <div className="hint">
                        <span className="keyboard-shortcut">Ctrl+</span>
                        <span>Browser Menu → "Install App"</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .install-box {
                    position: fixed;
                    top: 24px;
                    left: 24px;
                    background: linear-gradient(135deg, 
                        rgba(25, 25, 35, 0.98) 0%,
                        rgba(35, 35, 55, 0.98) 100%);
                    backdrop-filter: blur(20px);
                    border-radius: 24px;
                    box-shadow: 
                        0 20px 60px rgba(0, 0, 0, 0.3),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    padding: 24px;
                    z-index: 10000;
                    color: #ffffff;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    overflow: hidden;
                    max-width: 380px;
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                    transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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
                    padding: 2px;
                    border-radius: 24px;
                    background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 25%,
                        #f093fb 50%,
                        #f5576c 75%,
                        #4facfe 100%
                    );
                    background-size: 400% 400%;
                    animation: gradientMove 6s ease infinite;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0.8;
                }

                .close-btn {
                    position: absolute;
                    top: 12px;
                    right: 16px;
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    backdrop-filter: blur(10px);
                }

                .close-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                }

                .install-content {
                    position: relative;
                    z-index: 5;
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                }

                .icon-container {
                    position: relative;
                    flex-shrink: 0;
                }

                .icon {
                    font-size: 28px;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
                    animation: float 3s ease-in-out infinite;
                }

                .pulse-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 40px;
                    height: 40px;
                    border: 2px solid rgba(102, 126, 234, 0.4);
                    border-radius: 50%;
                    animation: pulse 2s ease-out infinite;
                    pointer-events: none;
                }

                .text-content {
                    flex: 1;
                }

                h3 {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #fff 0%, #a8b1ff 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                p {
                    margin: 0 0 12px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: rgba(255, 255, 255, 0.9);
                    font-weight: 500;
                }

                .hint {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    background: rgba(255, 255, 255, 0.05);
                    padding: 8px 12px;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .keyboard-shortcut {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2px 6px;
                    border-radius: 6px;
                    font-weight: 600;
                    border: 1px solid rgba(255, 255, 255, 0.2);
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

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-4px);
                    }
                }

                @keyframes pulse {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1.4);
                        opacity: 0;
                    }
                }

                /* Responsive design */
                @media (max-width: 480px) {
                    .install-box {
                        top: 16px;
                        left: 16px;
                        right: 16px;
                        max-width: none;
                    }
                }

                /* Reduced motion for accessibility */
                @media (prefers-reduced-motion: reduce) {
                    .install-box,
                    .icon,
                    .pulse-ring,
                    .gradient-border {
                        animation: none;
                        transition: none;
                    }
                }
            `}</style>
        </div>
    );
}