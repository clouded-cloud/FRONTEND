// src/components/pos/Orders/OrderTicket.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext.jsx';


const OrderTicket = ({ order }) => {
  const { updateOrderStatus } = usePos();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f39c12';
      case 'preparing': return '#3498db';
      case 'ready': return '#27ae60';
      case 'completed': return '#95a5a6';
      default: return '#bdc3c7';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'preparing';
      case 'preparing': return 'ready';
      case 'ready': return 'completed';
      default: return currentStatus;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrderStatus(order.id, newStatus);
      // Context will refresh the orders
    } catch (error) {
      alert('Error updating order: ' + error.message);
    }
  };

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const preparationTime = Math.floor(totalItems * 3); // 3 minutes per item

  return (
    <div className="order-ticket" style={{ borderLeftColor: getStatusColor(order.status) }}>
      <div className="order-header">
        <div className="order-info">
          <h4>Order #{order.id.slice(-4)}</h4>
          <span className="table-number">Table {order.table_number}</span>
        </div>
        <div className="order-time">
          {new Date(order.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>

      <div className="order-items">
        {order.items.slice(0, 3).map((item, index) => (
          <div key={index} className="order-item">
            <span className="item-quantity">{item.quantity}x</span>
            <span className="item-name">{item.name}</span>
          </div>
        ))}
        {order.items.length > 3 && (
          <div className="more-items">+{order.items.length - 3} more items</div>
        )}
      </div>

      {order.special_instructions && (
        <div className="special-instructions">
          <strong>Note:</strong> {order.special_instructions}
        </div>
      )}

      <div className="order-footer">
        <div className="order-meta">
          <span className="total-amount">${parseFloat(order.total_amount).toFixed(2)}</span>
          <span className="item-count">{totalItems} items</span>
          <span className="prep-time">~{preparationTime} min</span>
        </div>

        <div className="order-actions">
          {order.status !== 'completed' && (
            <button
              className="status-btn"
              onClick={() => handleStatusUpdate(getNextStatus(order.status))}
            >
              Mark as {getNextStatus(order.status)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTicket;