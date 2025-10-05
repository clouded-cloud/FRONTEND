// src/components/pos/Tables/Table.jsx
import React from 'react';
import './Table.css';

const Table = ({ table, isSelected, onClick }) => {
  const getTableClassName = () => {
    let className = `table ${table.status}`;
    if (isSelected) className += ' selected';
    if (table.status === 'available') className += ' clickable';
    return className;
  };

  const getStatusText = () => {
    switch (table.status) {
      case 'available': return 'Available';
      case 'occupied': return 'Occupied';
      case 'reserved': return 'Reserved';
      default: return 'Unknown';
    }
  };

  return (
    <div className={getTableClassName()} onClick={onClick}>
      <div className="table-number">{table.table_number}</div>
      <div className="table-capacity">{table.capacity} seats</div>
      <div className="table-status">{getStatusText()}</div>
      
      {table.current_order && (
        <div className="table-order-info">
          Order: #{table.current_order}
        </div>
      )}
      
      {table.reservation_time && (
        <div className="table-reservation">
          {table.reservation_time}
        </div>
      )}
    </div>
  );
};

export default Table;