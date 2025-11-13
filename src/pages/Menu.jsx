// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import { MdRestaurantMenu, MdCategory } from "react-icons/md";
import { BiSolidDish } from "react-icons/bi";
import UnifiedMenuContainer from "../components/Menu/UnifiedMenuContainer";
import Modal from "../components/dashboard/Modal";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, addDish } from "../redux/slices/menuSlice";
import { enqueueSnackbar } from "notistack";

const Menu = () => {
  useEffect(() => {
    document.title = "POS | Menu";
  }, []);

  const customerData = useSelector((state) => state.customer);
  const user = useSelector((state) => state.user);
  const menus = useSelector((state) => state.menu);
  const cart = useSelector((state) => state.cart?.items ?? []); // ✅ Add this line
  const dispatch = useDispatch();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <MdRestaurantMenu className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Menu Selection</h1>
                <p className="text-gray-600">Choose delicious items for your order</p>
              </div>
            </div>

            {/* Customer Info Card */}
            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(customerData.customerName || "C")[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customerData.customerName || "Customer Name"}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Table: {customerData.table?.tableNo || "N/A"}
                  </p>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-gray-600">Cart</div>
                  <div className="text-lg font-bold">{cart.length} items</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Browse Categories</h2>
              <p className="text-gray-600">Select a category to view available items</p>
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

        {/* ✅ Main Content - Just render UnifiedMenuContainer */}
        <UnifiedMenuContainer />

        {/* ✅ Modals - Moved outside the main content flow */}
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
    </div>
  );
};

export default Menu;