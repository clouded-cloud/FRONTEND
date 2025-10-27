import React, { useEffect } from "react";
import { MdRestaurantMenu } from "react-icons/md";
import MenuContainer from "../components/Menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import { useSelector } from "react-redux";
import "../menu.css";

const Menu = () => {

    useEffect(() => {
      document.title = "POS | Menu"
    }, [])

  const customerData = useSelector((state) => state.customer);

  return (
    <div className="menu-background min-h-screen">
      <div className="pos-container">
        {/* Professional POS Header */}
        <div className="pos-header pos-animate-fade-in">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-xl shadow-lg menu-header-icon">
                <MdRestaurantMenu className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="pos-heading-primary text-white mb-1">Menu Selection</h1>
                <p className="text-white text-opacity-90 pos-body">Choose delicious items for your order</p>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="menu-customer-info p-4 rounded-xl border shadow-sm pos-customer-card">
              <div className="flex items-center gap-3">
                <div className="pos-customer-avatar">
                  <span className="text-white font-bold text-lg">
                    {(customerData.customerName || "C")[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="pos-heading-tertiary text-gray-900">
                    {customerData.customerName || "Customer Name"}
                  </h3>
                  <p className="pos-body-small text-gray-600 flex items-center gap-1">
                    <span className="pos-status-indicator"></span>
                    Table: {customerData.table?.tableNo || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="pos-menu-categories pos-animate-fade-in">
          <h2 className="pos-heading-secondary text-gray-900 mb-2">Browse Categories</h2>
          <p className="pos-body-small text-gray-600">Select a category to view available items</p>
        </div>

        {/* Main POS Grid Layout */}
        <div className="pos-grid-horizontal pos-animate-fade-in">
          {/* Menu Container */}
          <div className="pos-card">
            <MenuContainer />
          </div>

          {/* Cart Section */}
          <div className="pos-card overflow-hidden">
            <div className="menu-cart-header pos-card-header">
              <span className="text-2xl">🛒</span>
              <span className="pos-heading-tertiary">Your Order</span>
            </div>
            <div className="p-6">
              <CartInfo />
            </div>
          </div>

          {/* Order Summary */}
          <div className="pos-card overflow-hidden">
            <div className="menu-order-summary-header pos-card-header">
              <span className="text-2xl">💰</span>
              <span className="pos-heading-tertiary">Order Summary</span>
            </div>
            <div className="p-6">
              <Bill />
            </div>
          </div>
        </div>

        {/* Customer Details Section */}
        <div className="pos-customer-details pos-animate-fade-in">
          <div className="pos-card overflow-hidden">
            <div className="menu-customer-details-header pos-card-header">
              <span className="text-2xl">👤</span>
              <span className="pos-heading-tertiary">Customer Details</span>
            </div>
            <div className="p-6">
              <CustomerInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
