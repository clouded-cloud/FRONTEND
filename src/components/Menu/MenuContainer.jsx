// src/components/Menu/MenuContainer.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { enqueueSnackbar } from 'notistack';

const MenuContainer = ({ menus }) => {
  const [selectedCategory, setSelectedCategory] = useState((Array.isArray(menus) && menus[0]?.name) || '');
  const dispatch = useDispatch();

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    enqueueSnackbar(`${item.name} added to cart!`, { variant: 'success' });
  };

  const currentCategory = Array.isArray(menus) ? menus.find(menu => menu.name === selectedCategory) : null;

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {Array.isArray(menus) && menus.map((category) => (
          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              selectedCategory === category.name
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategory?.items?.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-32 object-cover rounded-md mb-3"
              />
            )}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{item.name}</h3>
              <span className="text-green-600 font-bold">${item.price.toFixed(2)}</span>
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            )}
            <button
              onClick={() => handleAddToCart(item)}
              disabled={!item.available}
              className={`w-full py-2 rounded-lg font-medium ${
                item.available
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {item.available ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {(!currentCategory || currentCategory.items.length === 0) && (
        <div className="text-center py-8 text-gray-500">
          <p>No items available in this category</p>
        </div>
      )}
    </div>
  );
};

export default MenuContainer;