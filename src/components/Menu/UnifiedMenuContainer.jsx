import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { enqueueSnackbar } from 'notistack';
import { FaSearch, FaPlus, FaUtensils } from 'react-icons/fa';

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
          <div className="empty-illustration">
            <FaUtensils />
          </div>
          <h3>No menu loaded</h3>
          <p>Add categories and dishes from admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-menu">
      {/* Category Tabs */}
      <div className="card categories-bar">
        <div className="card-header">
          <h2 className="card-title">Categories</h2>
          <span className="count-badge">{menus.length}</span>
        </div>
        <div className="categories-scroll">
          {menus.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
            >
              <span className="cat-icon">{cat.icon || <FaUtensils />}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.items?.length || 0}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Info */}
      <div className="card search-header">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="auth-input"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn btn-outline clear-btn">
              Clear
            </button>
          )}
        </div>

        <div className="info-section">
          <h3 className="current-cat">{selectedCategory}</h3>
          <p className="items-info text-secondary">
            {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} available
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      </div>

      {/* Items Grid */}
      <div className="card items-container">
        {filteredItems.length === 0 ? (
          <div className="no-results">
            <div className="empty-cart">
              <i>🔍</i>
              <p>
                {searchTerm
                  ? `No items found for "${searchTerm}"`
                  : 'This category is empty'}
              </p>
            </div>
          </div>
        ) : (
          <div className="menu-items">
            {filteredItems.map((item, idx) => (
              <div key={item.id || idx} className="menu-item">
                <div className="item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder">
                      <FaUtensils />
                    </div>
                  )}
                  <div className="price-tag">KSH {item.price}</div>
                </div>

                <div className="item-details">
                  <div className="dish-header">
                    <h3 className="item-name">{item.name}</h3>
                    <span className="index">#{idx + 1}</span>
                  </div>
                  {item.description && (
                    <p className="item-description">{item.description}</p>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="btn btn-primary add-btn"
                >
                  <FaPlus /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional CSS for component-specific styling */}
      <style jsx>{`
        .unified-menu {
          font-family: 'Inter', sans-serif;
          padding: 1.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .categories-bar {
          padding: 1.5rem !important;
          margin-bottom: 1.5rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }

        .count-badge {
          background: var(--primary);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .categories-scroll {
          display: flex;
          gap: 0.8rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.2rem;
          border: 2px solid var(--border-color);
          background: var(--card-bg);
          border-radius: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .category-btn:hover {
          background: var(--primary-light);
          color: white;
          border-color: var(--primary-light);
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
          box-shadow: var(--shadow);
        }

        .cat-icon { 
          font-size: 1.1rem;
          display: flex;
          align-items: center;
        }

        .cat-count {
          background: rgba(255,255,255,0.3);
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .category-btn.active .cat-count {
          background: rgba(255,255,255,0.2);
        }

        .search-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          min-width: 300px;
        }

        .search-icon { 
          position: absolute;
          left: 1rem;
          color: var(--text-muted);
          z-index: 2;
        }

        .search-box .auth-input {
          padding-left: 3rem;
          width: 100%;
          margin-top: 0;
        }

        .clear-btn {
          margin-left: 0.5rem;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        .info-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.3rem;
        }

        .items-info {
          font-size: 0.9rem;
          margin: 0;
        }

        .items-container {
          padding: 1.5rem !important;
        }

        .no-results {
          text-align: center;
          padding: 3rem 2rem;
        }

        .menu-item {
          position: relative;
          transition: all 0.3s ease;
        }

        .menu-item:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .item-image {
          position: relative;
          height: 160px;
          background-color: var(--bg-body);
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .menu-item:hover .item-image img {
          transform: scale(1.05);
        }

        .placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          font-size: 2rem;
        }

        .price-tag {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: var(--primary);
          color: white;
          padding: 0.5rem 0.8rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: var(--shadow);
        }

        .dish-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .index {
          background: var(--secondary);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .add-btn {
          width: calc(100% - 3rem);
          margin: 1rem 1.5rem 1.5rem;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .add-btn:hover {
          transform: translateY(-2px);
        }

        /* Empty State Styling */
        .empty-menu-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          text-align: center;
        }

        .empty-content .empty-illustration {
          font-size: 4rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .empty-content h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .empty-content p {
          color: var(--text-secondary);
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .search-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .search-box {
            min-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .unified-menu {
            padding: 1rem;
          }
          
          .categories-scroll {
            gap: 0.5rem;
          }
          
          .category-btn {
            padding: 0.6rem 1rem;
            font-size: 0.875rem;
          }
          
          .menu-items {
            grid-template-columns: 1fr;
          }
          
          .item-image {
            height: 140px;
          }
        }

        @media (max-width: 480px) {
          .card-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
          
          .search-box .auth-input {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default UnifiedMenuContainer;