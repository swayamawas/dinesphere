'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { mockRestaurants } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import './bookings.css';

export interface BookingRecord {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantCuisine: string;
  restaurantImage: string;
  date: string;
  time: string;
  guests: string;
  discount: number | null;
  status: 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export default function BookingsPage() {
  const { isAuthenticated, isLoading, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [isFetching, setIsFetching] = useState(false);

  // Load bookings from Database
  useEffect(() => {
    if (!isAuthenticated) {
      setBookings([]);
      return;
    }

    const fetchBookings = async () => {
      setIsFetching(true);
      try {
        const res = await fetch('/api/bookings');
        if (res.ok) {
          const data: BookingRecord[] = await res.json();
          // Auto-mark past bookings as completed
          const now = new Date();
          const updated = data.map(b => {
            if (b.status === 'confirmed') {
              const bookingDate = new Date(`${b.date}T${b.time}`);
              if (bookingDate < now) {
                return { ...b, status: 'completed' as const };
              }
            }
            return b;
          });
          setBookings(updated);
        }
      } catch (error) {
        console.error('[FETCH_BOOKINGS_ERROR]', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const handleCancel = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        setBookings(prev => 
          prev.map(b => 
            b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
          )
        );
      } else {
        alert('Failed to cancel the booking. Please try again.');
      }
    } catch (error) {
      console.error('[CANCEL_BOOKING_ERROR]', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading || isFetching) {
    return (
      <main className="main-layout">
        <Navbar />
        <div className="container bookings-loading">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="main-layout">
        <Navbar />
        <div className="container bookings-empty-state">
          <div className="empty-icon">🔒</div>
          <h2>Sign in to view your bookings</h2>
          <p>Create an account or log in to see your reservation history.</p>
          <button className="btn-primary" onClick={() => openAuthModal('login')}>
            Log In
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-layout">
      <Navbar />
      
      <div className="container bookings-page">
        <div className="bookings-header">
          <h1 className="gradient-text">My Bookings</h1>
          <p className="bookings-subtitle">Manage your restaurant reservations</p>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          {(['all', 'confirmed', 'completed', 'cancelled'] as const).map(f => (
            <button 
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '📋 All' : f === 'confirmed' ? '✅ Upcoming' : f === 'completed' ? '🎉 Completed' : '❌ Cancelled'}
              <span className="tab-count">
                {f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bookings-empty-state">
            <div className="empty-icon">📭</div>
            <h2>{filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}</h2>
            <p>
              {filter === 'all' 
                ? 'Start exploring restaurants and make your first reservation!' 
                : `You don't have any ${filter} reservations.`
              }
            </p>
            {filter === 'all' && (
              <Link href="/" className="btn-primary">
                Explore Restaurants
              </Link>
            )}
          </div>
        ) : (
          <div className="bookings-list">
            {filteredBookings.map(booking => {
              const restaurant = mockRestaurants.find(r => r.id === booking.restaurantId);
              
              return (
                <div key={booking.id} className={`booking-card glass-panel ${booking.status}`}>
                  <div className="booking-card-image">
                    <img 
                      src={booking.restaurantImage} 
                      alt={booking.restaurantName} 
                    />
                    <div className={`booking-status-badge ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                  </div>

                  <div className="booking-card-details">
                    <div className="booking-card-top">
                      <h3 className="booking-restaurant-name">{booking.restaurantName}</h3>
                      <p className="booking-cuisine">{booking.restaurantCuisine}</p>
                    </div>

                    <div className="booking-info-grid">
                      <div className="booking-info-item">
                        <span className="info-label">📅 Date</span>
                        <span className="info-value">{formatDate(booking.date)}</span>
                      </div>
                      <div className="booking-info-item">
                        <span className="info-label">🕐 Time</span>
                        <span className="info-value">{booking.time}</span>
                      </div>
                      <div className="booking-info-item">
                        <span className="info-label">👥 Guests</span>
                        <span className="info-value">{booking.guests}</span>
                      </div>
                      {booking.discount && (
                        <div className="booking-info-item discount-info">
                          <span className="info-label">🔥 Discount</span>
                          <span className="info-value discount-value">{booking.discount}% OFF</span>
                        </div>
                      )}
                    </div>

                    <div className="booking-card-actions">
                      {restaurant && (
                        <Link href={`/restaurant/${booking.restaurantId}`} className="btn-secondary btn-sm">
                          View Restaurant
                        </Link>
                      )}
                      {booking.status === 'confirmed' && (
                        <button 
                          className="btn-cancel btn-sm"
                          onClick={() => handleCancel(booking.id)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
