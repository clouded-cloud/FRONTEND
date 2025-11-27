import React, { useEffect, useState } from "react";
import { MdRestaurantMenu, MdCategory, MdSearch } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import MenuContainer from "../components/Menu/MenuContainer";
import CartSidebar from "../components/Menu/CartSidebar";
import Modal from "../components/dashboard/Modal";
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

  return (
    <div className="menu-page">
      <div className="menu-wrapper">
        <header className="menu-header">
          {/* Top Blue Gradient Bar */}
          <div className="header-top-bar">
            <div className="brand-section">
              <MdRestaurantMenu className="brand-icon" />
              <h1 className="page-title">Menu</h1>
            </div>

            <div className="header-actions">
              {/* Customer Card */}
              <div className="customer-card">
                <div className="customer-avatar">
                  {(customerData.customerName || "C").charAt(0).toUpperCase()}
                </div>
                <div className="customer-info">
                  {!showCustomerForm ? (
                    <>
                      <p className="customer-name">
                        {customerData.customerName || "Walk-in Customer"}
                      </p>
                      <p className="customer-meta">
                        Table {customerData.table?.tableNo || "—"} • {custGuests || 1} guest
                        {custGuests !== 1 ? "s" : ""}
                      </p>
                    </>
                  ) : (
                    <div className="customer-edit-form">
                      <input
                        type="text"
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="Customer name"
                        className="input-sm"
                      />
                      <input
                        type="tel"
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="Phone (optional)"
                        className="input-sm"
                      />
                    </div>
                  )}
                </div>

                <div className="customer-controls">
                  {!showCustomerForm ? (
                    <button onClick={() => setShowCustomerForm(true)} className="btn-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button
                        onClick={() => {
                          dispatch(setCustomer({
                            name: custName || "Walk-in Customer",
                            phone: custPhone,
                            guests: custGuests
                          }));
                          enqueueSnackbar("Customer updated", { variant: "success" });
                          setShowCustomerForm(false);
                        }}
                        className="btn-check"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setCustName(customerData.customerName || "");
                          setCustPhone(customerData.customerPhone || "");
                          setShowCustomerForm(false);
                        }}
                        className="btn-cross"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="cart-badge">{cart.length}</div>
                <span className="cart-text">items in cart</span>
              </div>
            </div>
          </div>

          {/* Category Bar */}
          <div className="category-bar">
            <div className="category-info">
              <h2>Categories</h2>
              <p>Select a category to browse dishes</p>
            </div>

            <div className="category-controls">
              <div className="search-box">
                <MdSearch className="search-icon" />
                <input type="text" placeholder="Search dishes..." className="search-input" />
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
          </div>
        </header>

        {/* Main Content */}
        <main className="menu-main">
          <section className="menu-grid">
            <MenuContainer menus={menus} />
          </section>

          <aside className="cart-panel">
            <CartSidebar />
          </aside>
        </main>

        {/* Modals */}
        {isCategoryModalOpen && (
          <Modal
            setIsTableModalOpen={setIsCategoryModalOpen}
            type="category"
            onSubmit={(data) => {
              dispatch(addCategory(data));
              enqueueSnackbar(`Category "${data.name}" created`, { variant: "success" });
            }}
          />
        )}

        {isDishModalOpen && (
          <Modal
            setIsTableModalOpen={setIsDishModalOpen}
            type="dish"
            menus={menus}
            onSubmit={(data) => {
              dispatch(addDish({ categoryName: data.category, dish: data }));
              enqueueSnackbar(`"${data.name}" added to menu`, { variant: "success" });
            }}
          />
        )}
      </div>

      {/* GORGEOUS BLUE THEME */}
      <style jsx>{`
        :root {
          --primary: #2563eb;        /* Blue-600 */
          --primary-dark: #1d4ed8;   /* Blue-700 */
          --primary-light: #3b82f6;  /* Blue-500 */
          --primary-bg: #dbeafe;     /* Blue-100 */
          --accent: #0ea5e9;         /* Sky-500 – for highlights */
          --success: #10b981;
          --bg-body: #f0f9ff;        /* Very light blue tint */
          --card-bg: #ffffff;
          --border-color: #bae6fd;
          --text-primary: #0c4a6e;
          --text-secondary: #0369a1;
          --shadow: 0 10px 30px rgba(37, 99, 235, 0.15);
          --radius: 18px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .menu-page {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
          font-family: 'Inter', system-ui, sans-serif;
        }

        .menu-wrapper { max-width: 1400px; margin: 0 auto; }

        .menu-header {
          background: var(--card-bg);
          border-radius: 0 0 var(--radius) var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
        }

        /* Stunning Blue Gradient Header */
        .header-top-bar {
          padding: 1.5rem 2rem;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-icon { font-size: 2.4rem; }

        .page-title {
          font-size: 2.1rem;
          font-weight: 800;
          margin: 0;
          letter-spacing: -0.8px;
        }

        .customer-card {
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
          padding: 1rem 1.4rem;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          gap: 1.2rem;
          transition: var(--transition);
        }

        .customer-card:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-4px);
        }

        .customer-avatar {
          width: 48px;
          height: 48px;
          background: white;
          color: var(--primary);
          border-radius: 50%;
          font-weight: 800;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(37,99,235,0.3);
        }

        .customer-name { font-weight: 600; margin: 0; font-size: 1.02rem; }
        .customer-meta { font-size: 0.88rem; opacity: 0.95; margin-top: 4px; }

        .input-sm {
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.95);
          color: #1e293b;
          font-size: 0.9rem;
        }

        .btn-check { background: #10b981; }
        .btn-cross { background: rgba(255,255,255,0.25); }

        .cart-summary {
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(10px);
          padding: 1rem 1.4rem;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .cart-badge {
          background: white;
          color: var(--primary);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-weight: 800;
          font-size: 1rem;
        }

        .category-bar {
          padding: 1.8rem 2.5rem;
          background: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .category-info h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.4rem;
        }

        .search-box {
          background: #f0f9ff;
          border: 2px solid #bae6fd;
          min-width: 340px;
          padding: 0.8rem 1.2rem;
          border-radius: var(--radius);
        }

        .search-box:focus-within {
          border-color: var(--primary);
          box-shadow: 0 0 0 5px rgba(37,99,235,0.25);
        }

        .btn-admin {
          padding: 0.9rem 1.6rem;
          border-radius: var(--radius);
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          transition: var(--transition);
        }

        .btn-add-category { background: var(--primary); }
        .btn-add-dish { background: var(--accent); }

        .btn-admin:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(37,99,235,0.3);
        }

        .menu-main {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: 0 2rem 3rem;
        }

        @media (min-width: 1024px) {
          .menu-main { flex-direction: row; }
          .menu-grid { width: 70%; }
          .cart-panel { width: 30%; position: sticky; top: 2rem; }
        }
      `}</style>
    </div>
  );
};

export default Menu;