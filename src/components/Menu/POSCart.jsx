// src/components/Menu/POSCart.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice'; // Added clearCart import
import { enqueueSnackbar } from 'notistack';

const POSCart = () => {
  const cart = useSelector((state) => state.cart?.items ?? []);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart(itemId));
    enqueueSnackbar('Item removed from cart', { variant: 'info' });
  };

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(itemId);
      return;
    }
    dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    enqueueSnackbar('Cart cleared', { variant: 'info' });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>Your cart is empty</p>
            <p className="text-sm">Add items from the menu</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={handleClearCart}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold"
          >
            Clear Cart
          </button>
          <button
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-semibold"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default POSCart;