import React, { useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";
import { enqueueSnackbar } from "notistack";

const MenuContainer = ({ menus = [] }) => {
  const dispatch = useDispatch();
  const menuArray = Array.isArray(menus) ? menus : [];
  const [selectedCategory, setSelectedCategory] = useState(menuArray[0]?.name ?? "");
  const searchRef = useRef(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (menuArray.length && !selectedCategory) setSelectedCategory(menuArray[0].name);
  }, [menuArray, selectedCategory]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.log("MenuContainer menus:", menuArray);
    }
  }, [menuArray]);

  const selectedItems = useMemo(() => {
    const category = menuArray.find((c) => c.name === selectedCategory);
    return category?.items || [];
  }, [menuArray, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return selectedItems;
    const q = search.toLowerCase();
    return selectedItems.filter((it) => (it.name || "").toLowerCase().includes(q) || (it.description || "").toLowerCase().includes(q));
  }, [selectedItems, search]);

  const handleAddToCart = (item) => {
    if (!item || !item.name) {
      enqueueSnackbar("Invalid item", { variant: "error" });
      return;
    }
    const payload = {
      id: item.id ?? Date.now(),
      name: item.name,
      price: Number(item.price) || 0,
      description: item.description || "",
      image: item.image || null,
    };
    dispatch(addToCart(payload));
    enqueueSnackbar(`${item.name} added to cart!`, { variant: "success" });
  };

  if (!Array.isArray(menuArray) || menuArray.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Menu data not loaded</h3>
        <p className="text-sm text-gray-600">No categories were found in the Redux `menu` slice. Check that the store is configured and that `Constants/Index.js` exports `menus`.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex gap-6">
      {/* Categories sidebar */}
      <aside className="w-56 md:w-64 lg:w-72 bg-gray-50 p-3 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          {menuArray.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`text-left px-3 py-2 rounded-lg transition-colors w-full ${
                selectedCategory === category.name
                  ? "bg-blue-600 text-white font-semibold"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="truncate">{category.name}</span>
                <span className="text-xs text-gray-400">{category.items?.length || 0}</span>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Items and search */}
      <main className="flex-1 flex flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{selectedCategory || "All Items"}</h3>
            <p className="text-sm text-gray-500">Press / to focus search — click Add to add item to cart</p>
          </div>

          <div className="flex items-center gap-2 w-72">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, i) => (
                <div key={item.id ?? i} className="bg-white rounded-lg shadow p-3 flex flex-col">
                  <div className="h-36 w-full mb-3 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="object-cover h-full w-full" />
                    ) : (
                      <div className="text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                      <div className="text-xs text-gray-500">#{i + 1}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm text-gray-500">KSH</div>
                      <div className="text-lg font-bold text-blue-600">{item.price}</div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MenuContainer;