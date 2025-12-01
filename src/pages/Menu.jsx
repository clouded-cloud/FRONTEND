import React, { useEffect, useState } from "react";
import { MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import MenuContainer from "../components/Menu/MenuContainer";
import CartSidebar from "../components/Menu/CartSidebar";
import Modal from "../components/dashboard/Modal";
import OrderCardNew from "../components/Orders/OrderCardNew";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, addDish } from "../redux/slices/menuSlice";
import { setCustomer } from "../redux/slices/customerSlice";
import { enqueueSnackbar } from "notistack";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const menus = useSelector((state) => state.menu);
  const customerData = useSelector((state) => state.customer);
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart?.items ?? []);
  const dispatch = useDispatch();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [custName, setCustName] = useState(customerData.customerName || "");
  const [custPhone, setCustPhone] = useState(customerData.customerPhone || "");
  const [custGuests, setCustGuests] = useState(customerData.guests || 0);
  const [selectedCategory, setSelectedCategory] = useState(menus.length > 0 ? menus[0].name : "");

  return (
    <div className="menu-page">
      <div className="menu-wrapper">
        <header className="menu-header">
          {/* Horizontal Categories Bar */}
          <div className="horizontal-categories-bar">
            <div className="categories">
              {menus.map((cat) => (
                <button
                  key={cat.id || cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`category-btn ${selectedCategory === cat.name ? "active" : ""}`}
                >
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">{cat.items?.length || 0}</span>
                </button>
              ))}
            </div>

            {user.role === "admin" && (
              <div className="admin-actions">
                <button onClick={() => setIsCategoryModalOpen(true)} className="btn-admin btn-add-category">
                  <MdCategory size={18} />
                  Add Category
                </button>
                <button onClick={() => setIsDishModalOpen(true)} className="btn-admin btn-add-dish">
                  <BiSolidDish size={19} />
                  Add Dish
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="menu-main">
          <section className="menu-grid">
            <MenuContainer menus={menus} selectedCategory={selectedCategory} />
          </section>

          <aside className="right-panel">
            {/* Cart Sidebar positioned at top right */}
            <div className="cart-panel">
              <CartSidebar />
            </div>

            {/* Order Card positioned below cart */}
            <div className="order-card-container">
              <OrderCardNew
                order={{
                  _id: "sample-order-123",
                  customer: "John Doe",
                  customerPhone: "+1234567890",
                  tableNo: "5",
                  status: "pending",
                  total: 45.50,
                  items: [
                    { id: "1", name: "Burger", price: 15.00, qty: 2 },
                    { id: "2", name: "Fries", price: 8.00, qty: 1 },
                    { id: "3", name: "Soda", price: 4.50, qty: 1 }
                  ],
                  createdAt: new Date().toISOString()
                }}
              />
            </div>
          </aside>
        </main>

        {/* Modals */}
        {isCategoryModalOpen && (
          <Modal
            setIsOpen={setIsCategoryModalOpen}
            type="category"
            onSubmit={(data) => {
              console.debug("Menu: addCategory payload:", data);
              dispatch(addCategory(data));
              // immediately select the new category so user sees it
              // Note: You might want to add setSelectedCategory state if needed

              // Keep a short list of recent categories (by name) in localStorage
              try {
                const key = "recentCategories";
                const existing = JSON.parse(localStorage.getItem(key) || "[]");
                const next = [data.name, ...existing.filter((n) => n !== data.name)].slice(0, 5);
                localStorage.setItem(key, JSON.stringify(next));
              } catch (e) {
                // ignore localStorage failures (e.g., private mode)
                console.warn("Unable to persist recent categories", e);
              }

              enqueueSnackbar(`Category "${data.name}" created`, { variant: "success" });
            }}
          />
        )}

        {isDishModalOpen && (
          <Modal
            setIsOpen={setIsDishModalOpen}
            type="dish"
            menus={menus}
            onSubmit={(data) => {
              // Ensure categoryId is numeric and payload shape matches reducer expectations
              const payload = {
                categoryId: Number(data.categoryId || data.category),
                name: data.name,
                price: Number(data.price) || 0,
                icon: data.icon || "",
                available: data.available ?? true,
                description: data.description || "",
              };

              console.debug("Menu: addDish payload:", payload);
              dispatch(addDish(payload));
              // Select the category just added to, so the user sees the new dish
              // Note: You might want to add setSelectedCategory state if needed
              const cat = menus.find((m) => Number(m.id || m._id) === payload.categoryId);
              if (cat) {
                // setSelectedCategory(cat.name); // Uncomment if you have this state
              }
              enqueueSnackbar(`"${data.name}" added to menu`, { variant: "success" });
            }}
          />
        )}

        {/* Customer Info Modal */}
        {showCustomerForm && (
          <div className="customer-modal-overlay" onClick={() => setShowCustomerForm(false)}>
            <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Customer Information</h3>
                <button
                  onClick={() => setShowCustomerForm(false)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="custName">Customer Name</label>
                  <input
                    id="custName"
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="custPhone">Phone Number</label>
                  <input
                    id="custPhone"
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="custGuests">Number of Guests</label>
                  <input
                    id="custGuests"
                    type="number"
                    min="1"
                    value={custGuests}
                    onChange={(e) => setCustGuests(Number(e.target.value))}
                    placeholder="Enter number of guests"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => {
                    dispatch(setCustomer({
                      customerName: custName,
                      customerPhone: custPhone,
                      guests: custGuests,
                    }));
                    enqueueSnackbar("Customer information saved", { variant: "success" });
                    setShowCustomerForm(false);
                  }}
                  className="save-btn"
                >
                  Save Customer Info
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .menu-page {
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(to bottom, var(--bg-body), #e8f5e8);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .menu-wrapper {
          max-width: 1400px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          flex-direction: column;
        }



        /* Category Section */
        .category-section {
          padding: 1rem 1rem;
          background: var(--card-bg);
        }

        .category-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .category-title h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.25rem 0;
        }

        .category-title p {
          color: var(--text-secondary);
          margin: 0;
          font-size: 0.95rem;
        }

        .categories {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 10px;
        }

        .category-btn {
          padding: 8px 16px;
          background: white;
          border: 1px solid var(--gray-light);
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition);
          white-space: nowrap;
        }

        .category-btn.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .admin-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-admin {
          padding: 0.75rem 1.5rem;
          border-radius: 10px;
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .btn-add-category { 
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
        }

        .btn-add-dish { 
          background: linear-gradient(135deg, var(--secondary), var(--secondary-light));
          box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
        }

        .btn-admin:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(44, 85, 48, 0.4);
        }

        .btn-add-dish:hover {
          box-shadow: 0 6px 20px rgba(212, 165, 116, 0.4);
        }

        /* Main Content */
        .menu-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0 2rem 3rem;
          flex: 1;
          overflow: hidden;
        }

        .menu-grid {
          flex: 1;
          overflow-y: auto;
        }

        .right-panel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .order-card-container {
          flex-shrink: 0;
        }

        .cart-panel {
          width: 100%;
          flex: 1;
        }

        /* Responsive Design */
        @media (min-width: 1024px) {
          .menu-main {
            flex-direction: row;
            height: 100%;
            padding: 0 2rem 0;
          }

          .menu-grid {
            width: 75%;
            height: 100%;
            overflow-y: auto;
          }

          .right-panel {
            width: 25%;
            height: 100%;
            position: sticky;
            top: 2rem;
          }

          .order-card-container {
            margin-bottom: 1rem;
          }

          .cart-panel {
            flex: 1;
            height: auto;
          }
        }

        @media (max-width: 768px) {
          .category-section {
            padding: 1.25rem 1.5rem;
          }

          .category-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .admin-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .menu-main {
            padding: 0 1.5rem 2rem;
            max-height: calc(100vh - 200px);
            overflow-y: auto;
          }
        }

        @media (max-width: 640px) {
          .customer-card,
          .cart-summary {
            width: 100%;
            justify-content: center;
          }

          .admin-actions {
            flex-direction: column;
          }

          .btn-admin {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .category-section {
            padding: 1rem;
          }

          .menu-main {
            padding: 0 1rem 1.5rem;
          }

          .category-title h2 {
            font-size: 1.25rem;
          }
        }

        /* Focus states for accessibility */
        .btn-admin:focus,
        .customer-card:focus,
        .cart-summary:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--focus-ring);
        }

        /* Cart Styles */
        .side-cart {
            width: 350px;
            background: white;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            display: flex;
            flex-direction: column;
            height: calc(100vh - 40px);
            position: sticky;
            top: 20px;
        }

        .cart-header {
            padding: 20px;
            border-bottom: 1px solid var(--gray-light);
            background: var(--primary);
            color: white;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .cart-header h3 {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .cart-body {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        }

        .cart-items {
            flex: 1;
            overflow-y: auto;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid var(--gray-light);
        }

        .cart-item:last-child {
            border-bottom: none;
        }

        .item-controls {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 5px;
        }

        .quantity-btn {
            width: 25px;
            height: 25px;
            border-radius: 50%;
            border: none;
            background: var(--gray-light);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: var(--transition);
        }

        .quantity-btn:hover {
            background: var(--primary);
            color: white;
        }

        .cart-footer {
            padding: 20px;
            border-top: 1px solid var(--gray-light);
        }

        .cart-total {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            font-size: 1.1rem;
            margin-bottom: 15px;
        }

        .cart-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .btn {
            padding: 12px 15px;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .btn-primary {
            background: var(--primary);
            color: white;
        }

        .btn-primary:hover {
            background: var(--primary-light);
        }

        .btn-secondary {
            background: var(--secondary);
            color: white;
        }

        .btn-secondary:hover {
            background: #c1915e;
        }

        .btn-outline {
            background: transparent;
            border: 1px solid var(--primary);
            color: var(--primary);
        }

        .btn-outline:hover {
            background: var(--primary);
            color: white;
        }

        .btn-danger {
            background: var(--danger);
            color: white;
        }

        .btn-danger:hover {
            background: #c82333;
        }

        .empty-cart {
            text-align: center;
            padding: 40px 20px;
            color: var(--gray);
        }

        .empty-cart i {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.5;
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .customer-card,
          .cart-summary,
          .btn-admin,
          .quantity-btn,
          .btn {
            transition: none;
          }

          .customer-card:hover,
          .cart-summary:hover,
          .btn-admin:hover,
          .quantity-btn:hover,
          .btn:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;