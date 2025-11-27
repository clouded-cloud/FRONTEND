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
            button: "w-8 h-8 p-1.5",
            icon: "text-lg",
            text: "text-sm"
        },
        medium: {
            button: "w-10 h-10 p-2",
            icon: "text-xl",
            text: "text-base"
        },
        large: {
            button: "w-12 h-12 p-2.5",
            icon: "text-2xl",
            text: "text-lg"
        }
    };

    const variants = {
        primary: "bg-primary hover:bg-primary-hover text-white",
        secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
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
            `}
        > 
            <IoArrowBackOutline className={sizes[size].icon} />
            {showLabel && (
                <span className={sizes[size].text}>
                    {label}
                </span>
            )}
        </button>
    )
}

export default BackButton