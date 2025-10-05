import React, { useState, useEffect } from 'react';
import { useOrder } from '../contexts/OrderContext';

const Menu = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { addToCart } = useOrder();

  // Mock data for development
  const mockProducts = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce and mozzarella',
      price: 12.99,
      category_name: 'Kitchen',
      is_available: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      description: 'Pizza with pepperoni and cheese',
      price: 14.99,
      category_name: 'Pizza',
      is_available: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Caesar Salad',
      description: 'Fresh salad with caesar dressing',
      price: 8.99,
      category_name: 'Barista',
      is_available: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      name: 'Chicken Burger',
      description: 'Grilled chicken burger with fries',
      price: 10.99,
      category_name: 'Bar',
      is_available: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      name: 'BBQ Chicken Pizza',
      description: 'Pizza with BBQ sauce and chicken',
      price: 16.99,
      category_name: 'Pizza',
      is_available: true,
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      name: 'Cappuccino',
      description: 'Freshly brewed coffee with milk foam',
      price: 4.99,
      category_name: 'Barista',
      is_available: true,
      image: '/api/placeholder/300/200'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setProducts(mockProducts);
      
      // Extract categories
      const uniqueCategories = [...new Set(mockProducts.map(item => item.category_name))]
        .filter(Boolean)
        .map(name => ({ name, id: name.toLowerCase() }));
      
      setCategories(uniqueCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProducts = selectedCategory 
    ? products.filter(item => item.category_name === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl text-gray-600">Loading menu...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our delicious selection of freshly prepared meals and beverages
            </p>
          </div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <button
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  !selectedCategory 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.name 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {product.category_name && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full">
                        {product.category_name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                    </div>
                    
                    <button
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        product.is_available 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                      onClick={() => addToCart(product)}
                      disabled={!product.is_available}
                    >
                      {product.is_available ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                No menu items found in this category.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;