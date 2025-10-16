import React from 'react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        aria-label="Search menu items"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBar;
