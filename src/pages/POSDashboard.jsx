// ./src/pages/POSDashboard.jsx
import React, { useState, useEffect } from 'react';
import { usePos } from '../components/contexts/PosContext';

const POSDashboard = () => {
  const { menuItems, categories, loading, error, fetchMenuItems, clearError } = usePos();
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    const initializePOS = async () => {
      try {
        await fetchMenuItems();
      } catch (err) {
        console.error('Failed to initialize POS:', err);
      } finally {
        setLocalLoading(false);
      }
    };

    initializePOS();
  }, [fetchMenuItems]);

  const handleRetry = async () => {
    setLocalLoading(true);
    clearError();
    try {
      await fetchMenuItems();
    } catch (err) {
      console.error('Retry failed:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  if (localLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading POS Data...</p>
        </div>
      </div>
    );
  }

  if (error && menuItems.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center bg-yellow-50 p-6 rounded-lg max-w-md">
          <div className="text-yellow-500 text-2xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            POS System Loaded with Demo Data
          </h3>
          <p className="text-yellow-600 mb-4">
            Could not connect to backend: {error}
          </p>
          <p className="text-sm text-yellow-700 mb-4">
            Using demo menu items. Full functionality may be limited.
          </p>
          <button
            onClick={handleRetry}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">POS Dashboard</h1>
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded text-sm">
            Using demo data - Backend connection issue
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="col-span-3">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow border">
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
                <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                <button className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                  Add to Order
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-white p-4 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="text-center text-gray-500 py-8">
              <p>No items in order</p>
              <p className="text-sm mt-2">Select items from the menu to start an order</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSDashboard;