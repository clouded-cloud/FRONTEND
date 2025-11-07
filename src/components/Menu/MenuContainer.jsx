import React, { useState } from "react";
import { menus } from "../../Constants";
import { GrRadialSelected } from "react-icons/gr";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addItems } from "../../redux/slices/cartSlice";


const MenuContainer = ({ menus: propMenus }) => {
  const displayMenus = propMenus || menus;
  const [selected, setSelected] = useState(displayMenus[0]);
  const [itemCount, setItemCount] = useState(0);
  const [itemId, setItemId] = useState();
  const dispatch = useDispatch();

  const increment = (id) => {
    setItemId(id);
    if (itemCount >= 4) return;
    setItemCount((prev) => prev + 1);
  };

  const decrement = (id) => {
    setItemId(id);
    if (itemCount <= 0) return;
    setItemCount((prev) => prev - 1);
  };

  const handleAddToCart = (item) => {
    if(itemCount === 0) return;

    const {name, price} = item;
    const newObj = { id: new Date(), name, pricePerQuantity: price, quantity: itemCount, price: price * itemCount };

    dispatch(addItems(newObj));
    setItemCount(0);
  }


  return (
    <div className="space-y-8">
      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayMenus.map((menu) => {
          return (
            <div
              key={menu.id}
              className={`flex flex-col items-start justify-between p-6 rounded-lg h-24 cursor-pointer transition-all duration-200 border-2 ${
                selected.id === menu.id
                  ? "bg-blue-50 border-blue-300 shadow-md"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
              }`}
              onClick={() => {
                setSelected(menu);
                setItemId(0);
                setItemCount(0);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <h1 className={`text-lg font-semibold flex items-center ${
                  selected.id === menu.id ? "text-blue-700" : "text-gray-900"
                }`}>
                  {menu.icon} {menu.name}
                </h1>
                {selected.id === menu.id && (
                  <GrRadialSelected className="text-blue-600" size={20} />
                )}
              </div>
              <p className={`text-sm font-medium ${
                selected.id === menu.id ? "text-blue-600" : "text-gray-600"
              }`}>
                {menu.items.length} Items
              </p>
            </div>
          );
        })}
      </div>

      <hr className="border-gray-200" />

      {/* Menu Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selected?.items.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-gray-900 text-lg font-semibold flex-1">
                  {item.name}
                </h1>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200 ml-2"
                >
                  <FaShoppingCart size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-gray-900 text-xl font-bold">
                  KSH{item.price}
                </p>
                <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg gap-4">
                  <button
                    onClick={() => decrement(item.id)}
                    className="text-yellow-600 hover:text-yellow-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-gray-900 font-semibold min-w-[20px] text-center">
                    {itemId == item.id ? itemCount : "0"}
                  </span>
                  <button
                    onClick={() => increment(item.id)}
                    className="text-yellow-600 hover:text-yellow-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuContainer;