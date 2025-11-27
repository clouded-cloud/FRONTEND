import React from 'react'

const FullScreenLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fullscreen-loader">
        <div className="loader-content">
            <div className="spinner-container">
                <div className="spinner"></div>
            </div>
            <p className="loader-text">{message}</p>
        </div>
        
        <style jsx>{`
            .fullscreen-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--card-bg);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(8px);
            }

            .loader-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1.5rem;
                text-align: center;
            }

            .spinner-container {
                position: relative;
                width: 80px;
                height: 80px;
            }

            .spinner {
                width: 64px;
                height: 64px;
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            .spinner::before {
                content: '';
                position: absolute;
                top: -3px;
                left: -3px;
                right: -3px;
                bottom: -3px;
                border: 3px solid transparent;
                border-top: 3px solid var(--primary);
                border-radius: 50%;
                animation: spin 1.5s linear infinite;
                opacity: 0.7;
            }

            .spinner::after {
                content: '';
                position: absolute;
                top: -6px;
                left: -6px;
                right: -6px;
                bottom: -6px;
                border: 3px solid transparent;
                border-top: 3px solid var(--primary);
                border-radius: 50%;
                animation: spin 2s linear infinite;
                opacity: 0.4;
            }

            .loader-text {
                color: var(--text-secondary);
                font-size: 1.125rem;
                font-weight: 500;
                margin: 0;
                font-family: 'Inter', sans-serif;
            }

            @keyframes spin {
                0% { 
                    transform: translate(-50%, -50%) rotate(0deg); 
                }
                100% { 
                    transform: translate(-50%, -50%) rotate(360deg); 
                }
            }

            /* Pulse animation alternative */
            .spinner.pulse {
                animation: pulse 1.5s ease-in-out infinite;
                border: none;
                background: var(--primary);
            }

            @keyframes pulse {
                0%, 100% { 
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                50% { 
                    opacity: 0.7;
                    transform: translate(-50%, -50%) scale(1.1);
                }
            }

            /* Dots animation alternative */
            .dots-loader {
                display: flex;
                gap: 0.5rem;
            }

            .dots-loader .dot {
                width: 12px;
                height: 12px;
                background: var(--primary);
                border-radius: 50%;
                animation: dots 1.4s ease-in-out infinite both;
            }

            .dots-loader .dot:nth-child(1) { animation-delay: -0.32s; }
            .dots-loader .dot:nth-child(2) { animation-delay: -0.16s; }
            .dots-loader .dot:nth-child(3) { animation-delay: 0s; }

            @keyframes dots {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .spinner-container {
                    width: 64px;
                    height: 64px;
                }

                .spinner {
                    width: 48px;
                    height: 48px;
                }

                .loader-text {
                    font-size: 1rem;
                }
            }

            @media (max-width: 480px) {
                .spinner-container {
                    width: 56px;
                    height: 56px;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                }

                .loader-content {
                    gap: 1.25rem;
                }
            }

            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .spinner {
                    animation: none;
                    border: 3px solid var(--border-color);
                    border-top: 3px solid var(--primary);
                }

                .spinner::before,
                .spinner::after {
                    display: none;
                }
            }

            /* Dark mode support */
            @media (prefers-color-scheme: dark) {
                .fullscreen-loader {
                    background: rgba(0, 0, 0, 0.8);
                }
            }
        `}</style>
    </div>
  )
}

// Alternative version with different loader styles
export const FullScreenLoaderWithOptions = ({ 
    message = "Loading...", 
    type = "spinner",
    size = "medium" 
}) => {
    const sizes = {
        small: { container: "w-12 h-12", text: "text-base" },
        medium: { container: "w-16 h-16", text: "text-lg" },
        large: { container: "w-20 h-20", text: "text-xl" }
    };

    const renderLoader = () => {
        switch (type) {
            case "dots":
                return (
                    <div className="dots-loader">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                );
            case "pulse":
                return <div className="spinner pulse"></div>;
            default:
                return <div className="spinner"></div>;
        }
    };

    return (
        <div className="fullscreen-loader">
            <div className="loader-content">
                <div className={`spinner-container ${sizes[size].container}`}>
                    {renderLoader()}
                </div>
                <p className={`loader-text ${sizes[size].text}`}>{message}</p>
            </div>
        </div>
    );
};

export default FullScreenLoader;