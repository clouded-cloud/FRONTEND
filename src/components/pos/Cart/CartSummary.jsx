// src/components/pos/Cart/CartSummary.jsx
import React, { useState } from 'react';
import { usePos } from '../../contexts/PosContext';
import PaymentModal from '../Payments/PaymentModal';
import './CartSummary.css';

const CartSummary = () => {
  const { cart, currentTable, placeOrder } = usePos();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleCheckout = () => {
    setShowPaymentModal(true);
  };

  const handlePayment = async (paymentData) => {
    try {
      const orderData = {
        items: cart,
        tableId: currentTable.id,
        subtotal,
        tax,
        total,
        paymentMethod: paymentData.method,
        tip: paymentData.tip
      };

      await placeOrder(orderData);
      setShowPaymentModal(false);
      alert('Order placed successfully!');
    } catch (error) {
      alert('Error placing order: ' + error.message);
    }
  };

  return (
    <div className="cart-summary">
      <div className="summary-line">
        <span>Subtotal:</span>
        <span>${parseFloat(subtotal).toFixed(2)}</span>
      </div>
      
      <div className="summary-line">
        <span>Tax (8%):</span>
        <span>${parseFloat(tax).toFixed(2)}</span>
      </div>
      
      <div className="summary-line total">
        <span>Total:</span>
        <span>${parseFloat(total).toFixed(2)}</span>
      </div>

      <div className="cart-actions">
        <button 
          className="checkout-btn"
          onClick={handleCheckout}
        >
          Checkout
        </button>
      </div>

      {showPaymentModal && (
        <PaymentModal
          total={total}
          onPayment={handlePayment}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};

export default CartSummary;