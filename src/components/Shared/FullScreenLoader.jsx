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