import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";
import { FaSearch, FaPlus } from "react-icons/fa";

const MenuContainer = ({ menus = [], selectedCategory }) => {
  const dispatch = useDispatch();
  const menuArray = Array.isArray(menus) ? menus : [];
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  const selectedItems = useMemo(() => {
    const cat = menuArray.find((c) => c.name === selectedCategory);
    return cat?.items || [];
  }, [menuArray, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return selectedItems;
    const q = search.toLowerCase();
    return selectedItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
    );
  }, [selectedItems, search]);

  const handleAddToCart = (item) => {
    if (!item?.name) {
      enqueueSnackbar("Invalid item", { variant: "error" });
      return;
    }

    dispatch(
      addToCart({
        id: item.id || Date.now(),
        name: item.name,
        price: Number(item.price) || 0,
        description: item.description || "",
        image: item.image || null,
      })
    );
    enqueueSnackbar(`${item.name} added to cart!`, { variant: "success" });
  };

  if (menuArray.length === 0) {
    return (
      <div className="empty-menu-state">
        <div className="empty-content">
          <div className="empty-illustration">🍽️</div>
          <h3>No menu loaded</h3>
          <p>Add categories and dishes from the menu settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Main Content */}
      <main className="menu-main-content">
        <header className="menu-header-bar">
          <div className="title-section">
            <h2>{selectedCategory || "Menu"}</h2>
            <p>{filteredItems.length} items available</p>
          </div>

          <div className="search-bar">
            <FaSearch className="icon" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="clear-btn"
              >
                Clear
              </button>
            )}
          </div>
        </header>

        <div className="items-grid">
          {filteredItems.length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No items found</h3>
              <p>
                {search
                  ? `No items match "${search}"`
                  : "This category is empty"}
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div key={item.id || idx} className="dish-card">
                <div className={`dish-image ${item.image ? "has-image" : "placeholder"}`}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="placeholder-content">
                      <span className="placeholder-icon">🍽️</span>
                      <span className="placeholder-text">No Image</span>
                    </div>
                  )}
                </div>

                <div className="dish-info">
                  <div className="dish-title-row">
                    <h4>{item.name}</h4>
                    <span className="index-badge">#{idx + 1}</span>
                  </div>
                  <p className="dish-desc">
                    {item.description || "No description available"}
                  </p>

                  <div className="dish-footer">
                    <div className="price">
                      <span>KSH</span>
                      <strong>{item.price}</strong>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="add-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <style jsx>{`
        .menu-container {
          height: 100%;
          font-family: 'Inter', sans-serif;
          padding: 0.5rem;
        }

        /* Main Area */
        .menu-main-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .menu-header-bar {
          background: var(--card-bg);
          padding: 1.5rem 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .title-section h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .title-section p {
          color: var(--text-secondary);
          margin: 0.5rem 0 0;
          font-size: 0.95rem;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--input-bg);
          border: 1.5px solid var(--border-color);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          min-width: 300px;
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        .icon { 
          color: var(--text-muted); 
          margin-right: 0.75rem; 
          font-size: 0.9rem;
        }

        .search-bar input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 0.95rem;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
        }

        .search-bar input::placeholder {
          color: var(--text-muted);
        }

        .clear-btn {
          background: none;
          border: none;
          color: #dc3545;
          font-weight: 600;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          transition: all 0.2s ease;
          margin-left: 0.5rem;
        }

        .clear-btn:hover { 
          background: #fef2f2; 
        }

        /* Grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 1rem 0;
        }

        .dish-card {
          background: var(--card-bg);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .dish-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary-light);
        }

        .dish-image {
          height: 160px;
          background: #f8f9fa;
          position: relative;
          overflow: hidden;
        }

        .dish-image.has-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .dish-card:hover .has-image img {
          transform: scale(1.05);
        }

        .dish-image.placeholder {
          background: linear-gradient(135deg, #e9ecef, #f8f9fa);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .placeholder-content {
          text-align: center;
        }

        .placeholder-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
          opacity: 0.6;
        }

        .placeholder-text {
          color: var(--text-muted);
          font-size: 0.8rem;
        }

        .dish-info {
          padding: 1.25rem;
        }

        .dish-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .dish-title-row h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          flex: 1;
          line-height: 1.3;
        }

        .index-badge {
          background: var(--primary-light);
          color: white;
          font-size: 0.7rem;
          padding: 0.3rem 0.6rem;
          border-radius: 20px;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .dish-desc {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.4;
          margin: 0 0 1rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .dish-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .price {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .price span {
          color: var(--text-secondary);
          font-size: 0.8rem;
        }

        .price strong {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .add-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .add-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
        }

        /* Empty States */
        .empty-menu-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .empty-content {
          max-width: 400px;
        }

        .empty-illustration {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-content h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .empty-content p {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 3rem 2rem;
          color: var(--text-secondary);
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .no-results h3 {
          color: var(--text-primary);
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .no-results p {
          font-size: 0.95rem;
          opacity: 0.8;
        }

        /* Animations */
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dish-card {
          animation: slideIn 0.4s ease-out;
        }

        /* Stagger animation for dish cards */
        .dish-card:nth-child(1) { animation-delay: 0.1s; }
        .dish-card:nth-child(2) { animation-delay: 0.2s; }
        .dish-card:nth-child(3) { animation-delay: 0.3s; }
        .dish-card:nth-child(4) { animation-delay: 0.4s; }
        .dish-card:nth-child(5) { animation-delay: 0.5s; }

        /* Responsive */
        @media (max-width: 1024px) {
          .menu-header-bar {
            flex-direction: column;
            text-align: left;
            align-items: flex-start;
          }
          .search-bar {
            min-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .menu-container {
            padding: 0.25rem;
          }
          .menu-header-bar {
            padding: 1.25rem;
          }
          .items-grid {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 1.25rem;
          }
          .dish-image {
            height: 140px;
          }
          .dish-info {
            padding: 1rem;
          }
        }

        @media (max-width: 640px) {
          .items-grid {
            grid-template-columns: 1fr;
          }
          .menu-header-bar {
            padding: 1rem;
          }
          .title-section h2 {
            font-size: 1.5rem;
          }
          .search-bar {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuContainer;