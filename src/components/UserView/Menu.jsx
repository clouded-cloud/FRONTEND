import React, { useState, useEffect } from 'react';
import { usePos } from '../contexts/PosContext';

const Menu = () => {
  const { menuItems, categories, selectedCategory, setSelectedCategory, fetchMenuItems, fetchCategories, addToCart } = usePos();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchMenuItems(), fetchCategories()]);
      } catch (error) {
        console.error('Failed to load menu data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [fetchMenuItems, fetchCategories]);

  const filteredItems = selectedCategory
    ? menuItems.filter(item => item.category === selectedCategory)
    : menuItems;

  const categoryColors = {
    'Pizza': '#FF6B6B',
    'Pasta': '#4ECDC4',
    'Salads': '#45B7D1',
    'Beverages': '#96CEB4',
    'Desserts': '#FFEAA7',
    'Appetizers': '#DDA0DD',
    'Main Course': '#98D8C8',
    'default': '#6C5CE7'
  };

  // Enhanced mock data with images and descriptions
  const enhancedMockData = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil on a crispy crust',
      price: 12.99,
      category: 'Pizza',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Pepperoni Pizza',
      description: 'Classic pepperoni with mozzarella and tomato sauce',
      price: 14.99,
      category: 'Pizza',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'BBQ Chicken Pizza',
      description: 'Grilled chicken, BBQ sauce, red onions, and cilantro',
      price: 16.99,
      category: 'Pizza',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Cheese Burger',
      description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and pickles',
      price: 10.99,
      category: 'Main Course',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Grilled Chicken Burger',
      description: 'Marinated chicken breast with avocado, lettuce, and chipotle mayo',
      price: 11.99,
      category: 'Main Course',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      name: 'Caesar Salad',
      description: 'Crisp romaine lettuce, parmesan cheese, croutons, and Caesar dressing',
      price: 8.99,
      category: 'Salads',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 7,
      name: 'Greek Salad',
      description: 'Mixed greens, feta cheese, olives, cucumbers, and Greek dressing',
      price: 9.99,
      category: 'Salads',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 8,
      name: 'Spaghetti Carbonara',
      description: 'Creamy pasta with pancetta, eggs, parmesan, and black pepper',
      price: 13.99,
      category: 'Pasta',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1551892376-c73ba8b86727?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 9,
      name: 'Penne Arrabbiata',
      description: 'Penne pasta in spicy tomato sauce with garlic and red chili flakes',
      price: 11.99,
      category: 'Pasta',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1551892376-2c0c5c3f1b9c?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 10,
      name: 'French Fries',
      description: 'Golden crispy fries served with ketchup and mayo',
      price: 4.99,
      category: 'Appetizers',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 11,
      name: 'Chicken Wings',
      description: 'Crispy wings tossed in buffalo sauce with celery and blue cheese',
      price: 12.99,
      category: 'Appetizers',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 12,
      name: 'Mozzarella Sticks',
      description: 'Breaded mozzarella cheese sticks with marinara sauce',
      price: 7.99,
      category: 'Appetizers',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315621?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 13,
      name: 'Coca Cola',
      description: 'Classic Coca Cola served ice cold',
      price: 2.49,
      category: 'Beverages',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 14,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, no preservatives',
      price: 4.99,
      category: 'Beverages',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 15,
      name: 'Cappuccino',
      description: 'Rich espresso with steamed milk and foam',
      price: 4.49,
      category: 'Beverages',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 16,
      name: 'Chocolate Brownie',
      description: 'Warm chocolate brownie with vanilla ice cream',
      price: 6.99,
      category: 'Desserts',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 17,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      price: 7.99,
      category: 'Desserts',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 18,
      name: 'Ice Cream Sundae',
      description: 'Vanilla ice cream with chocolate syrup, nuts, and whipped cream',
      price: 5.99,
      category: 'Desserts',
      is_available: true,
      image: 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400&h=300&fit=crop&crop=center'
    }
  ];

  if (loading) {
    return (
      <div className="menu-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-container">
      {/* Hero Section */}
      <div className="menu-hero">
        <div className="hero-content">
          <h1 className="hero-title">🍽️ Our Menu</h1>
          <p className="hero-subtitle">Fresh, delicious, and made with love</p>
        </div>
        <div className="hero-decoration">
          <div className="floating-food">🍕</div>
          <div className="floating-food">🥗</div>
          <div className="floating-food">☕</div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="category-filters">
        <button
          className={`category-btn all ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
        >
          ✨ All Items
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            style={{
              '--category-color': categoryColors[category.name] || categoryColors.default
            }}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="menu-grid">
        {(filteredItems.length > 0 ? filteredItems : enhancedMockData).map(item => (
          <div key={item.id} className="menu-card">
            <div className="card-image">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="image-placeholder" style={{ display: item.image ? 'none' : 'flex' }}>
                <span className="food-emoji">
                  {item.category === 'Pizza' ? '🍕' :
                   item.category === 'Pasta' ? '🍝' :
                   item.category === 'Salads' ? '🥗' :
                   item.category === 'Beverages' ? '☕' :
                   item.category === 'Desserts' ? '🍰' :
                   item.category === 'Appetizers' ? '🥟' :
                   item.category === 'Main Course' ? '🍔' :
                   '🍽️'}
                </span>
              </div>
              <div className="card-badge">
                {item.category}
              </div>
              {item.is_available && (
                <div className="availability-badge">
                  ✓ Available
                </div>
              )}
            </div>

            <div className="card-content">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>

              <div className="item-footer">
                <div className="price-section">
                  <span className="price">${parseFloat(item.price).toFixed(2)}</span>
                </div>

                <button
                  className={`add-to-cart-btn ${item.is_available ? '' : 'disabled'}`}
                  onClick={() => item.is_available && addToCart(item)}
                  disabled={!item.is_available}
                >
                  {item.is_available ? (
                    <>
                      <span className="btn-icon">🛒</span>
                      Add to Cart
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">❌</span>
                      Out of Stock
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
