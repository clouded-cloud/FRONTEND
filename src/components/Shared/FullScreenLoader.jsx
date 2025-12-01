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
          background: var(--bg-body);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
        }

        .loader-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner-container {
          width: 4rem;
          height: 4rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid var(--border-color);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loader-text {
          color: var(--text-primary);
          font-size: 1.125rem;
          font-weight: 500;
          margin: 0;
          text-align: center;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .loader-content {
            padding: 1.5rem;
            gap: 1.25rem;
            border-radius: 12px;
            margin: 1rem;
          }

          .spinner-container {
            width: 3.5rem;
            height: 3.5rem;
          }

          .spinner {
            width: 2.5rem;
            height: 2.5rem;
          }

          .loader-text {
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .loader-content {
            padding: 1.25rem;
            gap: 1rem;
          }

          .spinner-container {
            width: 3rem;
            height: 3rem;
          }

          .spinner {
            width: 2rem;
            height: 2rem;
            border-width: 2.5px;
          }

          .loader-text {
            font-size: 0.9rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .spinner {
            animation: none;
            border-top-color: transparent;
          }

          .loader-content {
            animation: none;
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
        small: { 
          container: "w-12 h-12", 
          text: "text-sm",
          spinner: "w-8 h-8 border-2",
          dot: "w-2 h-2"
        },
        medium: { 
          container: "w-16 h-16", 
          text: "text-base",
          spinner: "w-12 h-12 border-3",
          dot: "w-3 h-3"
        },
        large: { 
          container: "w-20 h-20", 
          text: "text-lg",
          spinner: "w-16 h-16 border-4",
          dot: "w-4 h-4"
        }
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
                return <div className="pulse-loader"></div>;
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

            <style jsx>{`
                .fullscreen-loader {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: var(--bg-body);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    font-family: 'Inter', sans-serif;
                }

                .loader-content {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 2rem;
                    background: var(--card-bg);
                    border-radius: 16px;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-color);
                    animation: fadeIn 0.3s ease-out;
                }

                .spinner-container {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Spinner Style */
                .spinner {
                    border: 3px solid var(--border-color);
                    border-top: 3px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                .w-8.h-8.border-2 {
                    width: 2rem;
                    height: 2rem;
                    border-width: 2px;
                }

                .w-12.h-12.border-3 {
                    width: 3rem;
                    height: 3rem;
                    border-width: 3px;
                }

                .w-16.h-16.border-4 {
                    width: 4rem;
                    height: 4rem;
                    border-width: 4px;
                }

                /* Dots Loader Style */
                .dots-loader {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }

                .dot {
                    background: var(--primary);
                    border-radius: 50%;
                    animation: dotsBounce 1.4s ease-in-out infinite both;
                }

                .dot:nth-child(1) { animation-delay: -0.32s; }
                .dot:nth-child(2) { animation-delay: -0.16s; }
                .dot:nth-child(3) { animation-delay: 0s; }

                .w-2.h-2 { width: 0.5rem; height: 0.5rem; }
                .w-3.h-3 { width: 0.75rem; height: 0.75rem; }
                .w-4.h-4 { width: 1rem; height: 1rem; }

                @keyframes dotsBounce {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }

                /* Pulse Loader Style */
                .pulse-loader {
                    background: var(--primary);
                    border-radius: 50%;
                    animation: pulse 1.5s ease-in-out infinite both;
                }

                .w-8.h-8.border-2 + .pulse-loader {
                    width: 2rem;
                    height: 2rem;
                }

                .w-12.h-12.border-3 + .pulse-loader {
                    width: 3rem;
                    height: 3rem;
                }

                .w-16.h-16.border-4 + .pulse-loader {
                    width: 4rem;
                    height: 4rem;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(0.8);
                        opacity: 0.7;
                    }
                    50% {
                        transform: scale(1.2);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0.8);
                        opacity: 0.7;
                    }
                }

                /* Common Animations */
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .loader-text {
                    color: var(--text-primary);
                    font-weight: 500;
                    margin: 0;
                    text-align: center;
                }

                .text-sm { font-size: 0.875rem; }
                .text-base { font-size: 1rem; }
                .text-lg { font-size: 1.125rem; }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .loader-content {
                        padding: 1.5rem;
                        gap: 1.25rem;
                        border-radius: 12px;
                        margin: 1rem;
                    }

                    .w-16.h-16 { width: 3.5rem; height: 3.5rem; }
                    .w-20.h-20 { width: 4rem; height: 4rem; }
                }

                @media (max-width: 480px) {
                    .loader-content {
                        padding: 1.25rem;
                        gap: 1rem;
                    }

                    .w-12.h-12 { width: 2.5rem; height: 2.5rem; }
                    .w-16.h-16 { width: 3rem; height: 3rem; }
                    .w-20.h-20 { width: 3.5rem; height: 3.5rem; }
                }

                /* Accessibility */
                @media (prefers-reduced-motion: reduce) {
                    .spinner, .dot, .pulse-loader {
                        animation: none;
                    }

                    .spinner {
                        border-top-color: transparent;
                    }

                    .dot {
                        opacity: 1;
                        transform: scale(1);
                    }

                    .pulse-loader {
                        opacity: 1;
                        transform: scale(1);
                    }

                    .loader-content {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default FullScreenLoader;