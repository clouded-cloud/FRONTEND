// components/common/Alert.jsx
import React, { useContext } from 'react';

// Create a safe default context
const AlertContext = React.createContext({
  show: () => {},
  hide: () => {},
  alert: null
});

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    console.warn('AlertContext not found. Using default implementation.');
    return {
      show: (message, type = 'info') => console.log(`Alert: ${type} - ${message}`),
      hide: () => {},
      alert: null
    };
  }
  return context;
};

const Alert = () => {
  const { alert } = useAlert();

  // Safe check for alert
  if (!alert || !alert.show) {
    return null;
  }

  return (
    <div className="alert-container">
      <div className={`alert ${alert.type || 'info'}`}>
        <div className="alert-content">
          <div className="alert-icon">
            {alert.type === 'success' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            )}
            {alert.type === 'error' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            )}
            {alert.type === 'warning' && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01"/>
              </svg>
            )}
            {(alert.type === 'info' || !alert.type) && (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            )}
          </div>
          <div className="alert-message">
            {alert.message}
          </div>
          <button 
            onClick={alert.hide}
            className="alert-close"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {alert.autoHide && (
          <div className="alert-progress">
            <div className="alert-progress-bar"></div>
          </div>
        )}
      </div>

      <style jsx>{`
        .alert-container {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          z-index: 1000;
          max-width: 400px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .alert {
          background: var(--card-bg);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          border: 1px solid;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .alert.info {
          border-color: var(--primary);
          background: linear-gradient(135deg, var(--card-bg) 0%, #eff6ff 100%);
        }

        .alert.success {
          border-color: #16a34a;
          background: linear-gradient(135deg, var(--card-bg) 0%, #f0fdf4 100%);
        }

        .alert.warning {
          border-color: #eab308;
          background: linear-gradient(135deg, var(--card-bg) 0%, #fefce8 100%);
        }

        .alert.error {
          border-color: #dc2626;
          background: linear-gradient(135deg, var(--card-bg) 0%, #fef2f2 100%);
        }

        .alert-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .alert.info .alert-icon {
          color: var(--primary);
        }

        .alert.success .alert-icon {
          color: #16a34a;
        }

        .alert.warning .alert-icon {
          color: #eab308;
        }

        .alert.error .alert-icon {
          color: #dc2626;
        }

        .alert-message {
          flex: 1;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.95rem;
          line-height: 1.4;
          margin: 0;
        }

        .alert-close {
          flex-shrink: 0;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-close:hover {
          color: var(--text-primary);
          background: var(--border-color);
        }

        .alert-progress {
          width: 100%;
          height: 3px;
          background: var(--border-color);
        }

        .alert-progress-bar {
          height: 100%;
          background: currentColor;
          animation: progress 3s linear forwards;
          transform-origin: left;
        }

        .alert.info .alert-progress-bar {
          background: var(--primary);
        }

        .alert.success .alert-progress-bar {
          background: #16a34a;
        }

        .alert.warning .alert-progress-bar {
          background: #eab308;
        }

        .alert.error .alert-progress-bar {
          background: #dc2626;
        }

        @keyframes progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }

        /* Stacking multiple alerts */
        .alert-container .alert:nth-child(1) {
          transform: translateY(0);
        }

        .alert-container .alert:nth-child(2) {
          transform: translateY(calc(100% + 0.75rem));
        }

        .alert-container .alert:nth-child(3) {
          transform: translateY(calc(200% + 1.5rem));
        }

        /* Hover pause for progress bar */
        .alert:hover .alert-progress-bar {
          animation-play-state: paused;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .alert-container {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
          }

          .alert-content {
            padding: 0.875rem 1rem;
          }

          .alert-message {
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .alert-container {
            top: 0.5rem;
            right: 0.5rem;
            left: 0.5rem;
          }

          .alert-content {
            padding: 0.75rem;
            gap: 0.5rem;
          }

          .alert-icon {
            width: 18px;
            height: 18px;
          }

          .alert-close {
            padding: 0.125rem;
          }
        }

        /* Accessibility */
        @media (prefers-reduced-motion: reduce) {
          .alert-container {
            animation: none;
          }

          .alert-progress-bar {
            animation: none;
          }
        }

        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .alert {
            border-width: 2px;
          }

          .alert-message {
            font-weight: 600;
          }
        }
      `}</style>
    </div>
  );
};

// Alert Provider Component for managing alert state
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = React.useState(null);

  const show = React.useCallback((message, type = 'info', options = {}) => {
    const { autoHide = true, duration = 5000 } = options;
    
    setAlert({
      message,
      type,
      show: true,
      autoHide,
      hide: () => setAlert(null)
    });

    if (autoHide) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  }, []);

  const hide = React.useCallback(() => {
    setAlert(null);
  }, []);

  const value = React.useMemo(() => ({
    show,
    hide,
    alert
  }), [show, hide, alert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Alert />
    </AlertContext.Provider>
  );
};

export default Alert;