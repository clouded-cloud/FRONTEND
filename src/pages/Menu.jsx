import React, { useEffect, useState } from "react";
import { MdRestaurantMenu, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import MenuContainer from "../components/Menu/MenuContainer";
import CustomerInfo from "../components/menu/CustomerInfo";
import CartInfo from "../components/menu/CartInfo";
import Bill from "../components/menu/Bill";
import Modal from "../components/dashboard/Modal";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, addDish } from "../redux/slices/menuSlice";
import { enqueueSnackbar } from "notistack";
import "../menu.css";

const Menu = () => {

    useEffect(() => {
      document.title = "POS | Menu"
    }, [])

  const customerData = useSelector((state) => state.customer);
  const user = useSelector((state) => state.user);
  const menus = useSelector((state) => state.menu);
  const dispatch = useDispatch();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="pos-heading-secondary text-gray-900 mb-2">Browse Categories</h2>
              <p className="pos-body-small text-gray-600">Select a category to view available items</p>
            </div>
            {user.role === "admin" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2"
                >
                  <MdCategory />
                  Add Category
                </button>
                <button
                  onClick={() => setIsDishModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2"
                >
                  <BiSolidDish />
                  Add Dish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main POS Grid Layout */}
        <div className="pos-grid-horizontal pos-animate-fade-in">
          {/* Menu Container */}
          <div className="pos-card">
            <MenuContainer menus={menus} />
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

      {isCategoryModalOpen && (
        <Modal
          setIsTableModalOpen={setIsCategoryModalOpen}
          type="category"
          onSubmit={(data) => {
            dispatch(addCategory(data));
            enqueueSnackbar(`Category "${data.name}" added successfully!`, { variant: "success" });
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
            enqueueSnackbar(`Dish "${data.name}" added to ${data.category}!`, { variant: "success" });
          }}
        />
      )}
    </div>
  );
};

export default Menu;
