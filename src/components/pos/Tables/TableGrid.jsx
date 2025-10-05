// src/components/pos/Tables/TableGrid.jsx
import React from 'react';
import { usePos } from '../../../contexts/PosContext';
import Table from './Table';
import './TableGrid.css';

const TableGrid = () => {
  const { tables, setCurrentTable, currentTable } = usePos();

  const handleTableClick = (table) => {
    if (table.status === 'available') {
      setCurrentTable(table);
    }
  };

  const tableStatusCounts = {
    available: tables.filter(t => t.status === 'available').length,
    occupied: tables.filter(t => t.status === 'occupied').length,
    reserved: tables.filter(t => t.status === 'reserved').length
  };

  return (
    <div className="table-grid-container">
      {/* Table Status Summary */}
      <div className="table-status-summary">
        <div className="status-item available">
          <span className="status-dot"></span>
          Available: {tableStatusCounts.available}
        </div>
        <div className="status-item occupied">
          <span className="status-dot"></span>
          Occupied: {tableStatusCounts.occupied}
        </div>
        <div className="status-item reserved">
          <span className="status-dot"></span>
          Reserved: {tableStatusCounts.reserved}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="table-grid">
        {tables.map(table => (
          <Table
            key={table.id}
            table={table}
            isSelected={currentTable?.id === table.id}
            onClick={() => handleTableClick(table)}
          />
        ))}
      </div>

      {/* No Tables Selected Message */}
      {!currentTable && (
        <div className="no-table-selected">
          <p>Please select a table to start taking orders</p>
        </div>
      )}
    </div>
  );
};

export default TableGrid;