import React from 'react';

// Category colors mapping
const categoryColors = {
  'American Classics': '#FF6B6B',
  'Italian Cuisine': '#4ECDC4',
  'Asian Fusion': '#45B7D1',
  'Mexican Favorites': '#96CEB4',
  'Healthy Options': '#FFEAA7',
  'Beverages': '#DDA0DD',
  'Desserts': '#98D8C8',
  'default': '#6C5CE7'
};

const CategoryFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  likedCategories,
  toggleLikeCategory
}) => {
  return (
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
  );
};

export default CategoryFilters;
