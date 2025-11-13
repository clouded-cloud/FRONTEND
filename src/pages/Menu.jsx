// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";  // ← ADD useState HERE
import { MdRestaurantMenu, MdCategory } from "react-icons/md";
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

  // DEBUG LOGS
  console.log("Menu.jsx – Redux state.menu:", menus);
  console.log("Menu.jsx – Is array?", Array.isArray(menus));
  console.log("Menu.jsx – Length:", menus?.length);
  console.log("Menu.jsx – First category:", menus?.[0]);

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

            <div className="bg-white p-4 rounded-xl border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(customerData.customerName || "C")[0].toUpperCase()}
                </div>
                <div>
                  {!showCustomerForm ? (
                    <>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {customerData.customerName || "Customer Name"}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Table: {customerData.table?.tableNo || "N/A"}
                      </p>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="Customer name"
                        className="border px-3 py-2 rounded w-56"
                      />
                      <input
                        value={custPhone}
                        onChange={(e) => setCustPhone(e.target.value)}
                        placeholder="Phone number"
                        className="border px-3 py-2 rounded w-56"
                      />
                      <input
                        value={custGuests}
                        onChange={(e) => setCustGuests(Number(e.target.value))}
                        type="number"
                        min={0}
                        placeholder="Number of guests"
                        className="border px-3 py-2 rounded w-56"
                      />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex items-start gap-2">
                  <div>
                    <div className="text-sm text-gray-600">Cart</div>
                    <div className="text-lg font-bold">{cart.length} items</div>
                  </div>
                  <div className="ml-4">
                    {!showCustomerForm ? (
                      <button
                        onClick={() => setShowCustomerForm(true)}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Save to Redux
                            dispatch(setCustomer({ name: custName, phone: custPhone, guests: custGuests }));
                            enqueueSnackbar("Customer details saved", { variant: "success" });
                            setShowCustomerForm(false);
                          }}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            // revert local values and close
                            setCustName(customerData.customerName || "");
                            setCustPhone(customerData.customerPhone || "");
                            setCustGuests(customerData.guests || 0);
                            setShowCustomerForm(false);
                          }}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories & Add Buttons */}
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

        {/* MENU ITEMS + CART */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-3/4">
            <MenuContainer menus={menus} />
          </div>
          <div className="lg:w-1/4">
            <CartSidebar />
          </div>
        </div>

        {/* Modals */}
        {isCategoryModalOpen && (
          <Modal
            setIsTableModalOpen={setIsCategoryModalOpen}
            type="category"
            onSubmit={(data) => {
              dispatch(addCategory(data));
              enqueueSnackbar(`Category "${data.name}" added!`, { variant: "success" });
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
              enqueueSnackbar(`Dish "${data.name}" added!`, { variant: "success" });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Menu;