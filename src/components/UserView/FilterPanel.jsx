import React from 'react';

const FilterPanel = ({
  showFilters,
  priceRange,
  setPriceRange,
  dietaryFilters,
  toggleDietaryFilter,
  clearAllFilters
}) => {
  if (!showFilters) return null;

  return (
    <div id="filters-panel" className="filters-panel">
      <div className="filter-group">
        <label className="filter-label">Price Range</label>
        <div className="price-range">
          <span className="price-min">${priceRange.min}</span>
          <input
            type="range"
            min="0"
            max="50"
            value={priceRange.max}
            onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
            className="price-slider"
            aria-label="Maximum price filter"
          />
          <span className="price-max">${priceRange.max}</span>
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Dietary Preferences</label>
        <div className="dietary-filters">
          {[
            { key: 'vegetarian', label: 'Vegetarian' },
            { key: 'vegan', label: 'Vegan' },
            { key: 'glutenFree', label: 'Gluten Free' }
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`dietary-filter ${dietaryFilters[key] ? 'active' : ''}`}
              onClick={() => toggleDietaryFilter(key)}
              aria-pressed={dietaryFilters[key]}
            >
              {dietaryFilters[key] ? '✓' : ''} {label}
            </button>
          ))}
        </div>
      </div>

      <button className="clear-filters-btn" onClick={clearAllFilters}>
        Clear All Filters
      </button>
    </div>
  );
};

export default FilterPanel;
