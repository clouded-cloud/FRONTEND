import React from 'react'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

const BackButton = ({ 
    showLabel = false, 
    label = "Back",
    size = "medium",
    variant = "primary" 
}) => {
    const navigate = useNavigate();

    const sizes = {
        small: {
            button: "p-1.5",
            icon: "text-lg",
            text: "text-sm"
        },
        medium: {
            button: "p-2",
            icon: "text-xl",
            text: "text-base"
        },
        large: {
            button: "p-2.5",
            icon: "text-2xl",
            text: "text-lg"
        }
    };

    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white",
        secondary: "bg-secondary hover:bg-secondary-light text-white",
        outline: "bg-transparent border border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-600"
    };

    return (
        <button 
            onClick={() => navigate(-1)} 
            className={`
                back-button 
                ${sizes[size].button} 
                ${variants[variant]}
                ${showLabel ? 'rounded-lg px-4' : 'rounded-full'}
                flex items-center justify-center gap-2
                font-semibold transition-all duration-200
                shadow-sm hover:shadow-md active:scale-95
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                min-w-8 min-h-8
            `}
        > 
            <IoArrowBackOutline className={sizes[size].icon} />
            {showLabel && (
                <span className={sizes[size].text}>
                    {label}
                </span>
            )}

            <style jsx>{`
                .back-button {
                    background: var(--primary);
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Inter', sans-serif;
                    font-weight: 600;
                }

                .back-button:hover {
                    background: var(--primary-hover);
                    transform: translateY(-1px);
                    box-shadow: var(--shadow);
                }

                .back-button:active {
                    transform: translateY(0);
                }

                /* Variant Styles */
                .back-button.bg-primary {
                    background: var(--primary);
                }

                .back-button.bg-primary:hover {
                    background: var(--primary-hover);
                }

                .back-button.bg-secondary {
                    background: var(--secondary);
                    color: white;
                }

                .back-button.bg-secondary:hover {
                    background: var(--secondary-light);
                }

                .back-button.bg-transparent.border {
                    background: transparent;
                    border: 2px solid var(--primary);
                    color: var(--primary);
                }

                .back-button.bg-transparent.border:hover {
                    background: var(--primary);
                    color: white;
                }

                .back-button.bg-transparent:not(.border) {
                    background: transparent;
                    color: var(--text-secondary);
                    border: none;
                }

                .back-button.bg-transparent:not(.border):hover {
                    background: var(--bg-body);
                    color: var(--text-primary);
                }

                /* Size Styles */
                .back-button.p-1\\.5 {
                    padding: 0.375rem;
                    min-width: 2rem;
                    min-height: 2rem;
                }

                .back-button.p-2 {
                    padding: 0.5rem;
                    min-width: 2.5rem;
                    min-height: 2.5rem;
                }

                .back-button.p-2\\.5 {
                    padding: 0.625rem;
                    min-width: 3rem;
                    min-height: 3rem;
                }

                .back-button.rounded-full {
                    border-radius: 50%;
                }

                .back-button.rounded-lg {
                    border-radius: 8px;
                }

                .back-button.px-4 {
                    padding-left: 1rem;
                    padding-right: 1rem;
                }

                /* Focus Styles */
                .back-button:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px var(--focus-ring);
                }

                /* Icon and Text Sizes */
                .text-lg { font-size: 1.125rem; }
                .text-xl { font-size: 1.25rem; }
                .text-2xl { font-size: 1.5rem; }

                .text-sm { font-size: 0.875rem; }
                .text-base { font-size: 1rem; }
                .text-lg { font-size: 1.125rem; }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .back-button.p-1\\.5 {
                        padding: 0.25rem;
                        min-width: 1.75rem;
                        min-height: 1.75rem;
                    }

                    .back-button.p-2 {
                        padding: 0.375rem;
                        min-width: 2rem;
                        min-height: 2rem;
                    }

                    .back-button.p-2\\.5 {
                        padding: 0.5rem;
                        min-width: 2.5rem;
                        min-height: 2.5rem;
                    }

                    .text-lg { font-size: 1rem; }
                    .text-xl { font-size: 1.125rem; }
                    .text-2xl { font-size: 1.25rem; }
                }

                @media (max-width: 480px) {
                    .back-button.px-4 {
                        padding-left: 0.75rem;
                        padding-right: 0.75rem;
                    }

                    .text-sm { font-size: 0.8rem; }
                    .text-base { font-size: 0.9rem; }
                    .text-lg { font-size: 1rem; }
                }

                /* Animation for active state */
                .back-button:active {
                    transition-duration: 0.1s;
                }

                /* Disabled state (if needed in future) */
                .back-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .back-button:disabled:hover {
                    background: var(--primary);
                    transform: none;
                    box-shadow: none;
                }
            `}</style>
        </button>
    )
}

export default BackButton