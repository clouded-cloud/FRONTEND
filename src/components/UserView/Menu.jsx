import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePos } from '../contexts/PosContext';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import CategoryFilters from './CategoryFilters';
import MenuItemCard from './MenuItemCard';

// Category colors for styling
const categoryColors = {
  'American Classics': '#FF6B6B',
  'Italian Cuisine': '#4ECDC4',
  'Asian Fusion': '#45B7D1',
  'Mexican Favorites': '#FFA07A',
  'Healthy Options': '#98D8C8',
  'Beverages': '#F7DC6F',
  'Desserts': '#BB8FCE',
  default: '#95A5A6'
};

// Utility function to format price in KSH
const formatPrice = (price) => {
  const kshPrice = Math.round(price * 130);
  return `${kshPrice} KSH`;
};

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Custom hook for menu filtering
const useMenuFilters = (
  menuItems,
  selectedCategory,
  searchQuery,
  priceRange,
  dietaryFilters,
  favoritesOnly,
  likedCategories
) => {
  return useMemo(() => {
    let items = selectedCategory
      ? menuItems.filter(item => item.category === selectedCategory)
      : menuItems;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Price range filter
    items = items.filter(item =>
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Dietary filters
    if (dietaryFilters.vegetarian) {
      items = items.filter(item => item.vegetarian);
    }
    if (dietaryFilters.vegan) {
      items = items.filter(item => item.vegan);
    }
    if (dietaryFilters.glutenFree) {
      items = items.filter(item => item.glutenFree);
    }

    // Favorites only filter
    if (favoritesOnly) {
      const favoriteCategoryIds = likedCategories;
      items = items.filter(item => favoriteCategoryIds.includes(item.category));
    }

    return items;
  }, [
    menuItems,
    selectedCategory,
    searchQuery,
    priceRange,
    dietaryFilters,
    favoritesOnly,
    likedCategories
  ]);
};

const Menu = () => {
  const {
    menuItems,
    categories,
    selectedCategory,
    setSelectedCategory,
    likedCategories,
    toggleLikeCategory,
    fetchMenuItems,
    fetchCategories,
    addToCart
  } = usePos();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Debounce search input
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Data loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchMenuItems(), fetchCategories()]);
      } catch (error) {
        console.error('Failed to load menu data:', error);
        setError('Failed to load menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (isOnline) {
      loadData();
    }
  }, [fetchMenuItems, fetchCategories, isOnline]);

  // Enhanced mock data with dietary information
  const enhancedMockData = [
    // American Classics
    {
      id: 1,
      name: 'Classic Cheeseburger',
      description: 'Juicy beef patty with American cheese, lettuce, tomato, and pickles on a toasted bun',
      price: 12.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'BBQ Ribs',
      description: 'Slow-cooked pork ribs glazed with house-made BBQ sauce, served with coleslaw',
      price: 18.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'Chicken Wings',
      description: 'Crispy fried chicken wings tossed in buffalo sauce, served with ranch dip',
      price: 15.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Mac and Cheese',
      description: 'Creamy cheddar macaroni and cheese with crispy breadcrumb topping',
      price: 11.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315621?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 5,
      name: 'Hot Dog',
      description: 'Classic beef hot dog in a soft bun with mustard, ketchup, and onions',
      price: 8.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 6,
      name: 'Meatloaf',
      description: 'Homemade meatloaf with mashed potatoes and gravy',
      price: 16.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1551782450-17144efb5723?w=400&h=300&fit=crop&crop=center'
    },

    // Italian Cuisine
    {
      id: 7,
      name: 'Margherita Pizza',
      description: 'Fresh mozzarella, tomato sauce, and basil on a crispy wood-fired crust',
      price: 14.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 8,
      name: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta with pancetta, eggs, cheese, and black pepper',
      price: 16.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1551892376-c73ba244a88c?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 9,
      name: 'Lasagna',
      description: 'Layers of pasta, meat sauce, ricotta, and mozzarella cheese',
      price: 18.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 10,
      name: 'Pesto Pasta',
      description: 'Fettuccine tossed in fresh basil pesto with pine nuts and parmesan',
      price: 15.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 11,
      name: 'Risotto',
      description: 'Creamy Arborio rice with mushrooms, parmesan, and white wine',
      price: 17.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 12,
      name: 'Tiramisu',
      description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone',
      price: 9.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center'
    },

    // Asian Fusion
    {
      id: 13,
      name: 'Chicken Teriyaki Bowl',
      description: 'Grilled chicken with teriyaki sauce over steamed rice and vegetables',
      price: 14.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 14,
      name: 'Beef Stir Fry',
      description: 'Tender beef strips with mixed vegetables in oyster sauce over noodles',
      price: 16.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 15,
      name: 'Vegetable Fried Rice',
      description: 'Wok-tossed rice with mixed vegetables, eggs, and soy sauce',
      price: 12.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 16,
      name: 'Sushi Rolls',
      description: 'Fresh salmon and avocado rolls with wasabi and soy sauce',
      price: 18.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 17,
      name: 'Pad Thai',
      description: 'Rice noodles with shrimp, tofu, peanuts, and tamarind sauce',
      price: 15.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 18,
      name: 'Kimchi Fried Rice',
      description: 'Spicy Korean rice dish with kimchi, vegetables, and gochujang',
      price: 13.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&crop=center'
    },

    // Mexican Favorites
    {
      id: 19,
      name: 'Chicken Quesadilla',
      description: 'Grilled chicken, cheese, and peppers in a flour tortilla',
      price: 13.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 20,
      name: 'Beef Tacos',
      description: 'Three soft corn tortillas filled with seasoned beef, lettuce, and cheese',
      price: 12.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 21,
      name: 'Vegetable Burrito',
      description: 'Black beans, rice, cheese, and salsa wrapped in a flour tortilla',
      price: 11.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 22,
      name: 'Chicken Enchiladas',
      description: 'Corn tortillas filled with chicken, covered in red sauce and cheese',
      price: 15.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1532634726-5c5d5d9e7d0f?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 23,
      name: 'Guacamole & Chips',
      description: 'Fresh avocado dip with tortilla chips',
      price: 8.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1608039755401-5131b62f1455?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 24,
      name: 'Chili Con Carne',
      description: 'Spicy beef chili with beans, tomatoes, and spices',
      price: 14.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center'
    },

    // Healthy Options
    {
      id: 25,
      name: 'Quinoa Buddha Bowl',
      description: 'Quinoa base with roasted vegetables, avocado, chickpeas, and tahini dressing',
      price: 12.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 26,
      name: 'Grilled Salmon Salad',
      description: 'Fresh salmon fillet over mixed greens with lemon vinaigrette',
      price: 17.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 27,
      name: 'Veggie Stir Fry',
      description: 'Mixed seasonal vegetables stir-fried with ginger and garlic',
      price: 11.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 28,
      name: 'Turkey Wrap',
      description: 'Lean turkey breast with lettuce, tomato, and hummus in a whole wheat wrap',
      price: 10.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1541599468348-e96984315621?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 29,
      name: 'Greek Yogurt Parfait',
      description: 'Layers of Greek yogurt, granola, and fresh berries',
      price: 9.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 30,
      name: 'Smoothie Bowl',
      description: 'Acai base topped with granola, banana, and coconut flakes',
      price: 11.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop&crop=center'
    },

    // Beverages
    {
      id: 31,
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice, no added sugar',
      price: 4.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 32,
      name: 'Iced Coffee',
      description: 'Cold brewed coffee with milk and ice',
      price: 3.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 33,
      name: 'Green Smoothie',
      description: 'Blend of spinach, banana, apple, and ginger',
      price: 6.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1571771019784-3ff35f4f4277?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 34,
      name: 'Herbal Tea',
      description: 'Chamomile tea served hot or iced',
      price: 3.49,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 35,
      name: 'Protein Shake',
      description: 'Vanilla protein powder blended with almond milk and banana',
      price: 7.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 36,
      name: 'Sparkling Water',
      description: 'Carbonated mineral water with lemon',
      price: 2.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop&crop=center'
    },

    // Desserts
    {
      id: 37,
      name: 'Chocolate Cake',
      description: 'Rich chocolate cake with chocolate frosting',
      price: 7.99,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 38,
      name: 'Cheesecake',
      description: 'New York style cheesecake with berry compote',
      price: 8.99,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 39,
      name: 'Fruit Salad',
      description: 'Fresh seasonal fruits with mint garnish',
      price: 6.99,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 40,
      name: 'Ice Cream Sundae',
      description: 'Vanilla ice cream with chocolate sauce and whipped cream',
      price: 6.49,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 41,
      name: 'Brownie',
      description: 'Warm chocolate brownie with vanilla ice cream',
      price: 7.49,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 42,
      name: 'Panna Cotta',
      description: 'Italian custard dessert with berry sauce',
      price: 8.49,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&h=300&fit=crop&crop=center'
    },

    // Additional items to reach 50+
    {
      id: 43,
      name: 'Chicken Caesar Salad',
      description: 'Grilled chicken over romaine lettuce with Caesar dressing and croutons',
      price: 13.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 44,
      name: 'Beef Burger',
      description: 'Quarter pound beef patty with lettuce, tomato, and special sauce',
      price: 14.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 45,
      name: 'Vegetable Pizza',
      description: 'Margherita pizza topped with bell peppers, mushrooms, and olives',
      price: 15.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 46,
      name: 'Shrimp Scampi',
      description: 'Garlic butter shrimp over linguine pasta',
      price: 19.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1551892376-c73ba244a88c?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 47,
      name: 'Chicken Fried Rice',
      description: 'Wok-tossed rice with chicken, vegetables, and egg',
      price: 13.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 48,
      name: 'Fish Tacos',
      description: 'Grilled fish in corn tortillas with cabbage slaw and lime',
      price: 16.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 49,
      name: 'Mango Lassi',
      description: 'Sweet yogurt drink with mango and cardamom',
      price: 5.99,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1553909489-cd47e9c6e588?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 50,
      name: 'Apple Pie',
      description: 'Classic apple pie with cinnamon and lattice crust',
      price: 7.99,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 51,
      name: 'French Fries',
      description: 'Crispy golden fries with sea salt',
      price: 5.99,
      category: 'American Classics',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 52,
      name: 'Caprese Salad',
      description: 'Fresh mozzarella, tomatoes, and basil with balsamic glaze',
      price: 12.99,
      category: 'Italian Cuisine',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 53,
      name: 'Dumplings',
      description: 'Steamed pork dumplings with ginger soy dipping sauce',
      price: 11.99,
      category: 'Asian Fusion',
      is_available: true,
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 54,
      name: 'Nachos',
      description: 'Tortilla chips topped with cheese, jalapeños, and salsa',
      price: 10.99,
      category: 'Mexican Favorites',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d41?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 55,
      name: 'Avocado Toast',
      description: 'Whole grain toast topped with mashed avocado and cherry tomatoes',
      price: 9.99,
      category: 'Healthy Options',
      is_available: true,
      vegetarian: true,
      vegan: true,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 56,
      name: 'Latte',
      description: 'Espresso with steamed milk and latte art',
      price: 4.49,
      category: 'Beverages',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: true,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 57,
      name: 'Cookies',
      description: 'Freshly baked chocolate chip cookies',
      price: 4.99,
      category: 'Desserts',
      is_available: true,
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop&crop=center'
    }
  ];

  // Use custom filter hook
  const filteredItems = useMenuFilters(
    menuItems,
    selectedCategory,
    debouncedSearchQuery,
    priceRange,
    dietaryFilters,
    favoritesOnly,
    likedCategories
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange({ min: 0, max: 50 });
    setDietaryFilters({
      vegetarian: false,
      vegan: false,
      glutenFree: false
    });
    setFavoritesOnly(false);
    setShowFilters(false);
  }, [setSelectedCategory]);

  // Toggle dietary filter
  const toggleDietaryFilter = useCallback((filter) => {
    setDietaryFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  }, []);

  // Loading state
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

  // Error state
  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (filteredItems.length === 0 && !loading) {
    return (
      <div className="menu-container">
        {/* Category Filters */}
        <div className="category-filters top-filters">
          <button
            className={`category-btn all ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
            aria-pressed={!selectedCategory}
          >
            ✨ All Items
          </button>
          {categories.map(category => {
            const isLiked = likedCategories.includes(category.id);
            return (
              <div key={category.id} className="category-btn-container">
                <button
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  style={{
                    '--category-color': categoryColors[category.name] || categoryColors.default
                  }}
                  onClick={() => setSelectedCategory(category.id)}
                  aria-pressed={selectedCategory === category.id}
                  aria-label={`Filter by ${category.name}`}
                >
                  {category.name}
                </button>
                <button
                  className={`like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={() => toggleLikeCategory(category.id)}
                  title={isLiked ? 'Unlike this category' : 'Like this category'}
                  aria-label={isLiked ? `Unlike ${category.name}` : `Like ${category.name}`}
                >
                  {isLiked ? '❤️' : '🤍'}
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        <div className="empty-state">
          <div className="empty-icon">🍽️</div>
          <h3>No items found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button 
            className="clear-filters-btn"
            onClick={clearAllFilters}
          >
            Clear all filters
          </button>
        </div>
      </div>
    );
  }

  // Display items (fallback to mock data if no filtered items)
  const displayItems = filteredItems.length > 0 ? filteredItems : enhancedMockData;

  return (
    <div className="menu-container">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="offline-indicator" role="alert">
          ⚠️ You are currently offline. Some features may be limited.
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search menu items"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filters-panel"
          >
            🎛️ Filters
          </button>

          <button
            className={`favorites-toggle ${favoritesOnly ? 'active' : ''}`}
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            aria-pressed={favoritesOnly}
          >
            {favoritesOnly ? '❤️' : '🤍'} Favorites
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div id="filters-panel" className="filters-panel">
          <div className="filter-group">
            <label className="filter-label">Price Range</label>
            <div className="price-range">
              <span className="price-min">${priceRange.min}</span>
              <input
                type="range"
                min="0"
                max="50"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="price-slider"
                aria-label="Maximum price filter"
              />
              <span className="price-max">${priceRange.max}</span>
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Dietary Preferences</label>
            <div className="dietary-filters">
              {[
                { key: 'vegetarian', label: 'Vegetarian' },
                { key: 'vegan', label: 'Vegan' },
                { key: 'glutenFree', label: 'Gluten Free' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`dietary-filter ${dietaryFilters[key] ? 'active' : ''}`}
                  onClick={() => toggleDietaryFilter(key)}
                  aria-pressed={dietaryFilters[key]}
                >
                  {dietaryFilters[key] ? '✓' : ''} {label}
                </button>
              ))}
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearAllFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Category Filters */}
      <div className="category-filters top-filters">
        <button
          className={`category-btn all ${!selectedCategory ? 'active' : ''}`}
          onClick={() => setSelectedCategory(null)}
          aria-pressed={!selectedCategory}
        >
          ✨ All Items
        </button>
        {categories.map(category => {
          const isLiked = likedCategories.includes(category.id);
          return (
            <div key={category.id} className="category-btn-container">
              <button
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                style={{
                  '--category-color': categoryColors[category.name] || categoryColors.default
                }}
                onClick={() => setSelectedCategory(category.id)}
                aria-pressed={selectedCategory === category.id}
                aria-label={`Filter by ${category.name}`}
              >
                {category.name}
              </button>
              <button
                className={`like-btn ${isLiked ? 'liked' : ''}`}
                onClick={() => toggleLikeCategory(category.id)}
                title={isLiked ? 'Unlike this category' : 'Like this category'}
                aria-label={isLiked ? `Unlike ${category.name}` : `Like ${category.name}`}
              >
                {isLiked ? '❤️' : '🤍'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing <strong>{displayItems.length}</strong> item{displayItems.length !== 1 ? 's' : ''}
          {selectedCategory && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Menu Items Grid */}
      <div className="menu-grid">
        {displayItems.map(item => (
          <div 
            key={item.id} 
            className="menu-card"
            role="article"
            aria-label={`${item.name} - ${formatPrice(item.price)}`}
          >
            <div className="card-image">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-image-img"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="image-placeholder" 
                style={{ display: item.image ? 'none' : 'flex' }}
                aria-hidden="true"
              >
                <span className="food-emoji">
                  {item.category === 'American Classics' ? '🍔' :
                   item.category === 'Italian Cuisine' ? '🍝' :
                   item.category === 'Asian Fusion' ? '🥢' :
                   item.category === 'Mexican Favorites' ? '🌮' :
                   item.category === 'Healthy Options' ? '🥗' :
                   item.category === 'Beverages' ? '🥤' :
                   item.category === 'Desserts' ? '🍰' :
                   '🍽️'}
                </span>
              </div>
              <div className="card-badge">
                {item.category}
              </div>
              {item.is_available && (
                <div className="availability-badge" role="status">
                  ✓ Available
                </div>
              )}
            </div>

            <div className="card-content">
              <h3 className="item-name">{item.name}</h3>
              <p className="item-description">{item.description}</p>

              {/* Dietary badges */}
              <div className="dietary-badges">
                {item.vegetarian && <span className="dietary-badge veg">🌱 Vegetarian</span>}
                {item.vegan && <span className="dietary-badge vegan">💚 Vegan</span>}
                {item.glutenFree && <span className="dietary-badge gf">🌾 GF</span>}
              </div>

              <div className="item-footer">
                <div className="price-section">
                  <span className="price">{formatPrice(item.price)}</span>
                </div>

                <button
                  className={`add-to-cart-btn ${item.is_available ? '' : 'disabled'}`}
                  onClick={() => item.is_available && addToCart(item)}
                  disabled={!item.is_available}
                  aria-label={`Add ${item.name} to cart`}
                >
                  {item.is_available ? (
                    <>
                      <span className="btn-icon" aria-hidden="true">🛒</span>
                      Add to Cart
                    </>
                  ) : (
                    <>
                      <span className="btn-icon" aria-hidden="true">❌</span>
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

// Wrap with React.memo for performance
export default React.memo(Menu);