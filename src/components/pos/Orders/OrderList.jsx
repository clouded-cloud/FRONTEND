// src/components/pos/Orders/OrderList.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext';
import OrderTicket from './OrderTicket';

const OrderList = () => {
  const { activeOrders, loading, updateOrderStatus } = usePos();

  const getOrdersByStatus = (status) => {
    return activeOrders.filter(order => order.status === status);
  };

  const statusGroups = [
    { status: 'pending', title: 'Pending Orders', color: '#f39c12' },
    { status: 'preparing', title: 'In Kitchen', color: '#3498db' },
    { status: 'ready', title: 'Ready to Serve', color: '#27ae60' }
  ];

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  if (loading) {
    return <div className="orders-loading">Loading orders...</div>;
  }

  return (
    <div className="order-list">
      <div className="order-list-header">
        <h2>Active Orders</h2>
        <span className="order-count">{activeOrders.length} orders</span>
      </div>

      <div className="order-status-groups">
        {statusGroups.map(group => {
          const orders = getOrdersByStatus(group.status);

          return (
            <div key={group.status} className="status-group">
              <div
                className="status-header"
                style={{ borderLeftColor: group.color }}
              >
                <h3>{group.title}</h3>
                <span className="status-count">{orders.length}</span>
              </div>

              <div className="orders-container">
                {orders.length === 0 ? (
                  <div className="no-orders">No orders</div>
                ) : (
                  orders.map(order => (
                    <OrderTicket
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderList;
