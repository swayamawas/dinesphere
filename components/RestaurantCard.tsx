import React from 'react';
import Link from 'next/link';
import { Restaurant } from '../data/mockData';
import './RestaurantCard.css';

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  return (
    <Link href={`/restaurant/${restaurant.id}`} className="restaurant-card glass-panel">
      <div className="card-image-wrapper">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="card-image" />
        <div className="card-badge type-badge">
          {restaurant.type === 'veg' ? '🥦 Veg' : restaurant.type === 'non-veg' ? '🥩 Non-Veg' : '🍽️ Both'}
        </div>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{restaurant.name}</h3>
          <div className="rating">⭐ {restaurant.rating}</div>
        </div>
        
        <p className="card-subtitle">{restaurant.cuisine} • {restaurant.location}</p>
        
        {restaurant.discounts.length > 0 && (
          <div className="discounts-section">
            <span className="discount-label">🔥 Hot Deals:</span>
            <div className="discount-tags">
              {restaurant.discounts.map((d, idx) => (
                <span key={idx} className="discount-tag">
                  {d.percentage}% off @ {d.time}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
