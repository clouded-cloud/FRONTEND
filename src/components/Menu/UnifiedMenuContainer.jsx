import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { enqueueSnackbar } from 'notistack';
import { FaSearch, FaPlus } from 'react-icons/fa';

const UnifiedMenuContainer = () => {
  const dispatch = useDispatch();
  const menus = useSelector(state => state.menu || []);
  const cart = useSelector(state => state.cart?.items || []);

  const [selectedCategory, setSelectedCategory] = useState(() => {
    return Array.isArray(menus) && menus.length > 0 ? menus[0].name : '';
  });

  const [searchTerm, setSearchTerm] = useState('');

  const currentCategory = menus.find(m => m.name === selectedCategory);
  const items = currentCategory?.items || [];

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const handleAddToCart = (item) => {
    const payload = {
      id: item.id ?? Date.now(),
      name: item.name,
      price: Number(item.price) || 0,
      description: item.description || "",
      image: item.image || null,
    };
    dispatch(addToCart(payload));
    enqueueSnackbar(`${item.name} added to cart!`, { variant: 'success' });
  };

  if (!Array.isArray(menus) || menus.length === 0) {
    return (
      <div className="empty-menu-state">
        <div className="empty-content">
          <div className="empty-illustration">Menu Empty</div>
          <h3>No menu loaded</h3>
          <p>Add categories and dishes from admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-menu">
      {/* Category Tabs */}
      <div className="categories-bar">
        <div className="categories-header">
          <h2>Categories</h2>
          <span className="count-badge">{menus.length}</span>
        </div>
        <div className="categories-scroll">
          {menus.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`cat-tab ${selectedCategory === cat.name ? 'active' : ''}`}
            >
              <span className="cat-icon">{cat.icon || 'Food'}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.items?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Info */}
      <div className="search-header">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="clear-btn">
              Clear
            </button>
          )}
        </div>

        <div className="info-section">
          <h3 className="current-cat">{selectedCategory}</h3>
          <p className="items-info">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="items-container">
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">No Items Found</div>
            <p>
              {searchTerm
                ? `No items found for "${searchTerm}"`
                : 'This category is empty'}
            </p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item, idx) => (
              <div key={item.id || idx} className="dish-card">
                <div className="dish-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">
                      <span></span>
                    </div>
                  )}
                  <div className="price-tag">KSH {item.price}</div>
                </div>

                <div className="dish-content">
                  <div className="dish-header">
                    <h3>{item.name}</h3>
                    <span className="index">#{idx + 1}</span>
                  </div>
                  {item.description && (
                    <p className="dish-desc">{item.description}</p>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="add-btn"
                >
                  <FaPlus /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GORGEOUS BLUE THEME */}
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --primary-dark: #1d4ed8;
          --accent: #0ea5e9;
          --bg: #f8fbff;
          --card: #ffffff;
          --border: #bae6fd;
          --text: #0c4a6e;
          --text-light: #0369a1;
          --shadow: 0 15px 35px rgba(37, 99, 235, 0.15);
          --radius: 22px;
        }

        .unified-menu {
          font-family: 'Inter', sans-serif;
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .categories-bar {
          background: var(--card);
          border-radius: var(--radius);
          padding: 1.8rem 2rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          margin-bottom: 1.8rem;
        }

        .categories-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .categories-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text);
          margin: 0;
        }

        .count-badge {
          background: var(--primary-light);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .categories-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .cat-tab {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 1rem 1.4rem;
          border: 2px solid transparent;
          background: #f0f7ff;
          border-radius: 18px;
          font-weight: 600;
          color: tcgvar(--text-light);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .cat-tab:hover {
          background: #e0f2fe;
          border-color: var(--primary-light);
          transform: translateY(-3px);
        }

        .cat-tab.active {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border-color: var(--primary);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.3);
          transform: translateY(-4px);
        }

        .cat-icon { font-size: 1.3rem; }
        .cat-count {
          background: rgba(255,255,255,0.3);
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
        }

        .search-header {
          background: var(--card);
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          margin-bottom: 1.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          background: #f0f9ff;
          border: 2.5px solid var(--border);
          border-radius: 18px;
          padding: 1rem 1.4rem;
          min-width: 380px;
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2);
        }

        .search-icon { color: var(--text-light); margin-right: 1rem; }

        .search-box input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 1.05rem;
          color: var(--text);
        }

        .clear-btn {
          background: #fee2e2;
          color: #ef4444;
          border: none;
          padding: 0.5rem 0.8rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        .info-section h3 {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text);
          margin: 0 0 0.5rem;
        }

        .items-info {
          color: var(--text-light);
          font-size: 1rem;
          margin: 0;
        }

        .items-container {
          background: var(--card);
          border-radius: var(--radius);
          padding: 2rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-light);
        }

        .no-results-icon {
          font-size: 4.5rem;
          margin-bottom: 1rem;
        }

        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
        }

        .dish-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          transition: all 0.5s ease;
          display: flex;
          flex-direction: column;
        }

        .dish-card:hover {
          transform: translateY(-15px);
          box-shadow: 0 25px 50px rgba(37, 99, 235, 0.25);
          border-color: var(--primary-light);
        }

        .dish-image {
          position: relative;
          height: 200px;
          background: #f0f9ff;
        }

        .dish-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .dish-card:hover img {
          transform: scale(1.1);
        }

        .placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-light);
          font-size: 1.2rem;
          font-weight: 600;
        }

        .price-tag {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: var(--primary);
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 1.1rem;
          box-shadow: 0 6px 20px rgba(37,99,235,0.4);
        }

        .dish-content {
          padding: 1.5rem;
          flex: 1;
        }

        .dish-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.8rem;
        }

        .dish-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text);
          flex: 1;
        }

        .index {
          background: var(--primary-light);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .dish-desc {
          color: var(--text-light);
          line-height: 1.5;
          margin: 0 0 1.5rem;
        }

        .add-btn {
          margin: 0 1.5rem 1.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(37,99,235,0.3);
        }

        .add-btn:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 15px 35px rgba(37,99,235,0.4);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .search-header { flex-direction: column; align-items: stretch; }
          .search-box { min-width: 100%; }
          .items-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        }

        @media (max-width: 640px) {
          .items-grid { grid-template-columns: 1fr; }
          .dish-image { height: 180px; }
          .categories-scroll { gap: 0.8rem; }
          .cat-tab { padding: 0.9rem 1.2rem; }
        }
      `}</style>
    </div>
  );
};

export default UnifiedMenuContainer;