import React from 'react';
import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import { mockRestaurants } from '@/data/mockData';
import BookingWidget from '@/components/BookingWidget';
import './restaurant.css';

export default async function RestaurantPage({ params }: { params: { id: string } }) {
  let restaurant: any = null;

  try {
    restaurant = await prisma.restaurant.findUnique({
      where: { id: params.id },
      include: {
        discounts: true
      }
    });
  } catch (dbError) {
    console.warn('Database error fetching restaurant detail. Falling back to mockData:', dbError);
    restaurant = mockRestaurants.find(r => r.id === params.id) || null;
  }

  // Fallback if database succeeded but returned null (e.g. mock ID queried)
  if (!restaurant) {
    restaurant = mockRestaurants.find(r => r.id === params.id) || null;
  }

  if (!restaurant) {
    return (
      <main className="main-layout">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Restaurant not found</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="main-layout">
      <Navbar />
      
      <div className="restaurant-hero">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="restaurant-cover" />
        <div className="restaurant-hero-overlay">
          <div className="container">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <p className="restaurant-info">{restaurant.cuisine} • {restaurant.location}</p>
          </div>
        </div>
      </div>
      
      <div className="container booking-container">
        <BookingWidget restaurant={restaurant as any} />
      </div>
    </main>
  );
}

