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

  const alertStyles = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 p-4 rounded shadow-lg ${alertStyles[alert.type] || alertStyles.info}`}>
      <div className="flex justify-between items-center">
        <span>{alert.message}</span>
        <button 
          onClick={alert.hide}
          className="ml-4 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Alert;