// src/components/Menu/UnifiedMenuContainer.jsx
import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { enqueueSnackbar } from 'notistack';

const UnifiedMenuContainer = () => {
  const dispatch = useDispatch();
  const menus = useSelector(state => state.menu);
  const cart = useSelector(state => state.cart.items || []);

  // Set first category as default (no delay!)
  const [selectedCategory, setSelectedCategory] = useState(() => {
    return Array.isArray(menus) && menus.length > 0 ? menus[0].name : '';
  });

  const [searchTerm, setSearchTerm] = useState('');

  const currentCategory = menus?.find(m => m.name === selectedCategory);
  const items = currentCategory?.items || [];

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const term = searchTerm.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.description?.toLowerCase().includes(term)
    );
  }, [items, searchTerm]);

  const handleAddToCart = (item) => {
    const payload = {
      id: item.id ?? Date.now(),
      name: item.name,
      price: Number(item.price) || 0,
      description: item.description || "",
      image: item.image || null,
    };
    dispatch(addToCart(payload));
    enqueueSnackbar(`${item.name} added!`, { variant: 'success' });
  };

  if (!Array.isArray(menus) || menus.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No menu items available</p>
      </div>
    );
  }

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {menus.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {item.image && (
              <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-md mb-3" />
            )}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{item.name}</h3>
              <span className="text-green-600 font-bold">KSH{item.price}</span>
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            )}
            <button
              onClick={() => handleAddToCart(item)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No items found</p>
        </div>
      )}
    </div>
  );
};

export default UnifiedMenuContainer;