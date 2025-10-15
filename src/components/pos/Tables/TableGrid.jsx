// src/components/pos/Tables/TableGrid.jsx
import React from 'react';
import { usePos } from '../../contexts/PosContext.jsx';
import Table from './Table.jsx';

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
      <div className="table-stats">
        <div className="stat-card">
          <div className="stat-number">{tableStatusCounts.available}</div>
          <div className="stat-label">Available</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{tableStatusCounts.occupied}</div>
          <div className="stat-label">Occupied</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{tableStatusCounts.reserved}</div>
          <div className="stat-label">Reserved</div>
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

      {/* Current Table Info */}
      {currentTable && (
        <div className="current-table-info">
          <h3>Selected Table: {currentTable.table_number}</h3>
          <p>Capacity: {currentTable.capacity} seats</p>
        </div>
      )}

      {/* No Tables Selected Message */}
      {!currentTable && (
        <div className="no-table-selected">
          <p>Please select an available table to start taking orders</p>
        </div>
      )}
    </div>
  );
};

export default TableGrid;
