import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";
import { FaSearch, FaPlus } from "react-icons/fa";

const MenuContainer = ({ menus = [] }) => {
  const dispatch = useDispatch();
  const menuArray = Array.isArray(menus) ? menus : [];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  // Auto-select first category
  useEffect(() => {
    if (menuArray.length > 0 && !selectedCategory) {
      setSelectedCategory(menuArray[0].name);
    }
  }, [menuArray, selectedCategory]);

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
      {/* Categories Sidebar */}
      <aside className="categories-sidebar">
        <div className="sidebar-header">
          <h3>Categories</h3>
          <span className="count">{menuArray.length}</span>
        </div>

        <div className="categories-list">
          {menuArray.map((cat) => (
            <button
              key={cat.id || cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`cat-btn ${selectedCategory === cat.name ? "active" : ""}`}
            >
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.items?.length || 0}</span>
            </button>
          ))}
        </div>
      </aside>

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
            />
            {search && (
              <button onClick={() => setSearch("")} className="clear-btn">
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
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* PREMIUM BLUE STYLING */}
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-light: #3b82f6;
          --primary-dark: #1d4ed8;
          --accent: #0ea5e9;
          --bg: #f0f9ff;
          --card: #ffffff;
          --border: #bae6fd;
          --text: #0c4a6e;
          --text-light: #0369a1;
          --shadow: 0 10px 30px rgba(37, 99, 235, 0.12);
          --radius: 20px;
        }

        .menu-container {
          display: flex;
          gap: 2rem;
          height: 100%;
          font-family: 'Inter', sans-serif;
          padding: 0.5rem;
        }

        /* Sidebar */
        .categories-sidebar {
          width: 300px;
          background: var(--card);
          border-radius: var(--radius);
          padding: 1.8rem 1.5rem;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          height: fit-content;
          position: sticky;
          top: 2rem;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          color: var(--text);
          font-weight: 700;
          font-size: 1.3rem;
        }

        .count {
          background: var(--primary-light);
          color: white;
          font-size: 0.8rem;
          padding: 0.4rem 0.8rem;
          border-radius: 50px;
          font-weight: 600;
        }

        .categories-list {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }

        .cat-btn {
          padding: 1rem 1.2rem;
          border: 2px solid transparent;
          background: #f8fbff;
          border-radius: 16px;
          text-align: left;
          font-weight: 600;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cat-btn:hover {
          background: #e0f2fe;
          border-color: var(--primary-light);
          transform: translateX(4px);
        }

        .cat-btn.active {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border-color: var(--primary);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
          transform: translateY(-2px);
        }

        .cat-name { 
          font-size: 1rem; 
        }

        .cat-count {
          background: rgba(255,255,255,0.3);
          padding: 0.3rem 0.7rem;
          border-radius: 50px;
          font-size: 0.8rem;
        }

        /* Main Area */
        .menu-main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .menu-header-bar {
          background: var(--card);
          padding: 1.8rem 2rem;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .title-section h2 {
          font-size: 1.9rem;
          font-weight: 800;
          color: var(--text);
          margin: 0;
        }

        .title-section p {
          color: var(--text-light);
          margin: 0.5rem 0 0;
          font-size: 0.95rem;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
          background: #f0f9ff;
          border: 2px solid var(--border);
          border-radius: 16px;
          padding: 0.9rem 1.2rem;
          min-width: 340px;
          transition: all 0.3s ease;
        }

        .search-bar:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2);
        }

        .icon { 
          color: var(--text-light); 
          margin-right: 0.8rem; 
        }

        .search-bar input {
          border: none;
          background: none;
          outline: none;
          flex: 1;
          font-size: 1rem;
          color: var(--text);
        }

        .search-bar input::placeholder {
          color: var(--text-light);
          opacity: 0.7;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-weight: 600;
          cursor: pointer;
          padding: 0.2rem 0.6rem;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .clear-btn:hover { 
          background: #fee2e2; 
        }

        /* Grid */
        .items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.8rem;
          padding: 1rem 0;
        }

        .dish-card {
          background: var(--card);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          border: 1px solid var(--border);
          transition: all 0.4s ease;
        }

        .dish-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(37, 99, 235, 0.22);
          border-color: var(--primary-light);
        }

        .dish-image {
          height: 180px;
          background: #f0f9ff;
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
          transform: scale(1.08);
        }

        .dish-image.placeholder {
          background: linear-gradient(135deg, #e0f2fe, #bae6fd);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .placeholder-content {
          text-align: center;
        }

        .placeholder-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .placeholder-text {
          color: var(--text-light);
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .dish-info {
          padding: 1.4rem;
        }

        .dish-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.8rem;
        }

        .dish-title-row h4 {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text);
          flex: 1;
          line-height: 1.3;
        }

        .index-badge {
          background: var(--primary-light);
          color: white;
          font-size: 0.75rem;
          padding: 0.4rem 0.7rem;
          border-radius: 50px;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .dish-desc {
          color: var(--text-light);
          font-size: 0.92rem;
          line-height: 1.5;
          margin: 0 0 1.2rem 0;
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
          gap: 0.4rem;
        }

        .price span {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .price strong {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
        }

        .add-btn {
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          color: white;
          border: none;
          padding: 0.9rem 1.4rem;
          border-radius: 14px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
        }

        .add-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 30px rgba(37, 99, 235, 0.4);
        }

        /* Empty States */
        .empty-menu-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
        }

        .empty-content {
          max-width: 400px;
        }

        .empty-illustration {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.7;
        }

        .empty-content h3 {
          color: var(--text);
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .empty-content p {
          color: var(--text-light);
          font-size: 1rem;
        }

        .no-results {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-light);
        }

        .no-results-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.6;
        }

        .no-results h3 {
          color: var(--text);
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }

        .no-results p {
          font-size: 1rem;
          opacity: 0.8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .menu-container { 
            flex-direction: column; 
            gap: 1rem;
          }
          .categories-sidebar { 
            width: 100; 
            position: static;
          }
          .categories-list { 
            flex-direction: row; 
            overflow-x: auto; 
            padding-bottom: 1rem; 
          }
          .cat-btn { 
            min-width: 160px; 
            white-space: nowrap;
          }
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
            padding: 1.5rem;
          }
          .items-grid { 
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
            gap: 1.5rem;
          }
          .dish-image { 
            height: 160px; 
          }
        }

        @media (max-width: 640px) {
          .items-grid { 
            grid-template-columns: 1fr; 
          }
          .categories-sidebar {
            padding: 1.5rem 1rem;
          }
          .menu-header-bar {
            padding: 1.2rem;
          }
          .title-section h2 {
            font-size: 1.6rem;
          }
        }

        /* Scrollbar styling */
        .categories-list::-webkit-scrollbar {
          height: 6px;
        }

        .categories-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb {
          background: var(--primary-light);
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb:hover {
          background: var(--primary);
        }
      `}</style>
    </div>
  );
};

export default MenuContainer;