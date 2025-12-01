import React from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl'
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`modal-container ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            className="modal-close-button"
            onClick={onClose}
          >
            <IoClose className="close-icon" />
          </button>
        </div>
        <div className="modal-content">
          {children}
        </div>
      </motion.div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .modal-close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .modal-close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .close-icon {
          font-size: 1.5rem;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: var(--card-bg);
        }

        /* Custom scrollbar for modal content */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: var(--bg-body);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-container {
            border-radius: 12px;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.25rem 1.5rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .close-icon {
            font-size: 1.375rem;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 1rem 1.25rem;
          }

          .modal-content {
            padding: 1.25rem;
          }

          .modal-title {
            font-size: 1.125rem;
          }

          .close-icon {
            font-size: 1.25rem;
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .modal-container {
            animation: none;
          }
          
          .modal-close-button:hover {
            transform: none;
          }
        }

        /* Focus states for accessibility */
        .modal-close-button:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Enhanced backdrop for better contrast */
        .modal-overlay {
          background: rgba(44, 85, 48, 0.8);
        }
      `}</style>
    </div>
  );
};

// Enhanced Modal with additional features
export const EnhancedModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  showHeader = true,
  showCloseButton = true,
  closeOnOverlayClick = true,
  footer,
  className = ''
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleOverlayClick}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`modal-container ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showHeader && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            {showCloseButton && (
              <button
                className="modal-close-button"
                onClick={onClose}
                aria-label="Close modal"
              >
                <IoClose className="close-icon" />
              </button>
            )}
          </div>
        )}
        
        <div className="modal-content">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </motion.div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(44, 85, 48, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
          backdrop-filter: blur(4px);
        }

        .modal-container {
          background: var(--card-bg);
          border-radius: 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border-color);
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--border-color);
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
        }

        .modal-close-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .modal-close-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .close-icon {
          font-size: 1.5rem;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          background: var(--card-bg);
        }

        .modal-footer {
          padding: 1.5rem 2rem;
          border-top: 1px solid var(--border-color);
          background: var(--bg-body);
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        /* Custom scrollbar */
        .modal-content::-webkit-scrollbar {
          width: 6px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: var(--bg-body);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 3px;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0.5rem;
          }

          .modal-container {
            border-radius: 12px;
            max-height: 95vh;
          }

          .modal-header {
            padding: 1.25rem 1.5rem;
          }

          .modal-title {
            font-size: 1.25rem;
          }

          .modal-content {
            padding: 1.5rem;
          }

          .modal-footer {
            padding: 1.25rem 1.5rem;
          }

          .close-icon {
            font-size: 1.375rem;
          }
        }

        @media (max-width: 480px) {
          .modal-header {
            padding: 1rem 1.25rem;
          }

          .modal-content {
            padding: 1.25rem;
          }

          .modal-footer {
            padding: 1rem 1.25rem;
            flex-direction: column;
          }

          .modal-title {
            font-size: 1.125rem;
          }

          .close-icon {
            font-size: 1.25rem;
          }

          .modal-footer {
            gap: 0.75rem;
          }
        }

        /* Enhanced footer styling */
        .modal-footer :global(.btn) {
          margin: 0;
        }

        .modal-footer :global(.btn-primary) {
          background: var(--primary);
        }

        .modal-footer :global(.btn-primary:hover) {
          background: var(--primary-hover);
        }

        .modal-footer :global(.btn-outline) {
          border-color: var(--primary);
          color: var(--primary);
        }

        .modal-footer :global(.btn-outline:hover) {
          background: var(--primary);
          color: white;
        }

        /* Focus management */
        .modal-container:focus {
          outline: none;
        }

        /* High contrast mode */
        @media (prefers-contrast: high) {
          .modal-header {
            background: var(--primary);
          }
          
          .modal-container {
            border-width: 2px;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .modal-close-button:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;