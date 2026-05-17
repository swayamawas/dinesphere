'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import RestaurantCard from '@/components/RestaurantCard';
import SearchBox, { SearchCriteria } from '@/components/SearchBox';
import './page.css';

export interface DbRestaurant {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  city: string;
  rating: number;
  imageUrl: string;
  type: 'veg' | 'non-veg' | 'both';
  mealOptions: string;
  discounts: { time: string; percentage: number }[];
}

export default function Home() {
  const [restaurants, setRestaurants] = useState<DbRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial restaurants on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch('/api/restaurants');
        if (res.ok) {
          const data = await res.json();
          setRestaurants(data);
        }
      } catch (err) {
        console.error('[FETCH_RESTAURANTS_ERROR]', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleSearch = async (criteria: SearchCriteria) => {
    setIsLoading(true);
    const { keyword, location, type, mealOption } = criteria;
    
    const params = new URLSearchParams();
    if (keyword) params.append('keyword', keyword);
    if (location) params.append('location', location);
    if (type) params.append('type', type);
    if (mealOption) params.append('mealOption', mealOption);

    try {
      const res = await fetch(`/api/restaurants?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (err) {
      console.error('[SEARCH_RESTAURANTS_ERROR]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-layout">
      <Navbar />
      
      <header className="hero">
        <div className="container hero-content">
          <h1 className="hero-title gradient-text">Discover & Book <br/> Premium Tables.</h1>
          <p className="hero-subtitle">Find exclusive dining experiences with special discounts at odd hours.</p>
          
          <SearchBox onSearch={handleSearch} />
        </div>
      </header>
      
      <section className="container trending-section">
        <div className="section-header">
          <h2>
            {isLoading 
              ? "Finding Indian Restaurants..." 
              : restaurants.length > 0 
                ? "Trending with Discounts 🔥" 
                : "No Restaurants Found 😔"}
          </h2>
          <button className="btn-secondary btn-sm">View All</button>
        </div>
        
        {isLoading ? (
          <div className="bookings-loading">
            <div className="loading-spinner"></div>
            <p>Fetching top Indian spots...</p>
          </div>
        ) : (
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant as any} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

