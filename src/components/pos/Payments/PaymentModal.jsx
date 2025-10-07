// src/components/pos/Payments/PaymentModal.jsx
import React, { useState } from 'react';


const PaymentModal = ({ total, onPayment, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [tipAmount, setTipAmount] = useState(0);
  const [customTip, setCustomTip] = useState('');

  const tipOptions = [0, 5, 10, 15, 20];
  const finalTotal = parseFloat(total) + parseFloat(tipAmount);

  const handleTipSelect = (percentage) => {
    const tip = total * (percentage / 100);
    setTipAmount(tip);
    setCustomTip('');
  };

  const handleCustomTip = (value) => {
    setCustomTip(value);
    const tip = parseFloat(value) || 0;
    setTipAmount(tip);
  };

  const handleSubmit = () => {
    onPayment({
      method: paymentMethod,
      tip: tipAmount,
      total: finalTotal
    });
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Process Payment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-content">
          <div className="amount-section">
            <h3>Amount Due: ${parseFloat(total).toFixed(2)}</h3>
          </div>

          {/* Tip Selection */}
          <div className="tip-section">
            <h4>Add Tip</h4>
            <div className="tip-options">
              {tipOptions.map(percentage => (
                <button
                  key={percentage}
                  className={`tip-option ${tipAmount === total * (percentage / 100) ? 'selected' : ''}`}
                  onClick={() => handleTipSelect(percentage)}
                >
                  {percentage}%
                </button>
              ))}
            </div>
            <div className="custom-tip">
              <input
                type="number"
                placeholder="Custom amount"
                value={customTip}
                onChange={(e) => handleCustomTip(e.target.value)}
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="payment-method">
            <h4>Payment Method</h4>
            <div className="method-options">
              <label>
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Cash
              </label>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="mobile"
                  checked={paymentMethod === 'mobile'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                Mobile Payment
              </label>
            </div>
          </div>

          {/* Final Total */}
          <div className="final-total">
            <div className="final-line">
              <span>Subtotal:</span>
              <span>${parseFloat(total).toFixed(2)}</span>
            </div>
            <div className="final-line">
              <span>Tip:</span>
              <span>${parseFloat(tipAmount).toFixed(2)}</span>
            </div>
            <div className="final-line total">
              <span>Final Total:</span>
              <span>${parseFloat(finalTotal).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="payment-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="process-btn" onClick={handleSubmit}>
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;