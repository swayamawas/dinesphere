'use client';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Restaurant } from '@/data/mockData';
import { useAuth } from '@/context/AuthContext';
import './BookingWidget.css';

interface BookingWidgetProps {
  restaurant: Restaurant;
}

// Generate some default time slots
const DEFAULT_SLOTS = [
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00'
];

export default function BookingWidget({ restaurant }: BookingWidgetProps) {
  const router = useRouter();

const { data: session } = useSession();
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('2');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Helper to check if a slot has a discount
  const getDiscountForTime = (time: string) => {
    return restaurant.discounts.find(d => d.time === time);
  };

  const handleConfirmClick = () => {
    // Require login before booking
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (date && guests && selectedTime) {
      setShowModal(true);
    }
  };

  const handleFinalConfirm = async () => {
    const discount = getDiscountForTime(selectedTime);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: (session?.user as any)?.id,
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          restaurantCuisine: restaurant.cuisine,
          restaurantImage: restaurant.imageUrl,
          date,
          time: selectedTime,
          guests,
          discount: discount ? discount.percentage : null
        })
      });

      if (!response.ok) {
        throw new Error('Booking failed');
      }

      setIsBooked(true);
    } catch (error) {
      console.error('[BOOKING_CONFIRM_ERROR]', error);
      alert('Failed to create booking. Please try again.');
    }
    // Hide modal after a short delay
    setTimeout(() => {
      setShowModal(false);
    }, 2000);
  };

  if (isBooked && !showModal) {
    return (
      <div className="booking-widget glass-panel success-state">
        <div className="success-icon">🎉</div>
        <h3>Booking Confirmed!</h3>
        <p>Your table at {restaurant.name} is reserved for {date} at {selectedTime}.</p>
        <button className="btn-primary w-full mt-4" onClick={() => router.push('/bookings')}>
          View My Bookings
        </button>
        <button className="btn-secondary w-full mt-4" onClick={() => setIsBooked(false)}>
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <div className="booking-widget glass-panel">
      <h3>Book a Table</h3>
      
      <div className="input-group">
        <label>Date</label>
        <input 
          type="date" 
          className="booking-input"
          value={date}
          min={new Date().toISOString().split('T')[0]}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Party Size</label>
        <select 
          className="booking-input"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
          ))}
          <option value="10+">10+ Guests</option>
        </select>
      </div>

      <div className="time-slots-section">
        <label>Available Times</label>
        <div className="time-grid">
          {DEFAULT_SLOTS.map((time) => {
            const discount = getDiscountForTime(time);
            const isSelected = selectedTime === time;
            
            return (
              <button 
                key={time}
                className={`time-slot ${discount ? 'has-discount' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                <span className="time-text">{time}</span>
                {discount && <span className="discount-badge">-{discount.percentage}%</span>}
              </button>
            );
          })}
        </div>
      </div>

      <button 
        className="btn-primary w-full mt-4" 
        disabled={!date || !guests || !selectedTime}
        onClick={handleConfirmClick}
      >
        {!isAuthenticated ? '🔒 Sign in to Book' : 'Confirm Booking'}
      </button>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Confirm Details</h2>
            
            <div className="summary-card">
              <div className="summary-row"><span>Restaurant</span> <strong>{restaurant.name}</strong></div>
              <div className="summary-row"><span>Date</span> <strong>{date}</strong></div>
              <div className="summary-row"><span>Time</span> <strong>{selectedTime}</strong></div>
              <div className="summary-row"><span>Guests</span> <strong>{guests}</strong></div>
              
              {getDiscountForTime(selectedTime) && (
                <div className="summary-row discount-row">
                  <span>Special Offer Applied</span> 
                  <strong>{getDiscountForTime(selectedTime)?.percentage}% OFF food bill</strong>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleFinalConfirm}>
                {isBooked ? 'Processing...' : 'Confirm Reservation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
