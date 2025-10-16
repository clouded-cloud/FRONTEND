import React from 'react';

// Price formatting utility
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

const MenuItemCard = ({ item, addToCart }) => {
  return (
    <div
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
  );
};

export default MenuItemCard;
