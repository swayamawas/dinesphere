'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import './SearchBox.css';

export interface SearchCriteria {
  keyword: string;
  location: string;
  type: string;
  mealOption: string;
}

interface SearchBoxProps {
  onSearch: (criteria: SearchCriteria) => void;
}

const INDIAN_LOCATIONS = [
  'Connaught Place, New Delhi',
  'Hauz Khas, New Delhi',
  'Bandra West, Mumbai',
  'Colaba, Mumbai',
  'Indiranagar, Bangalore',
  'Koramangala, Bangalore',
  'Koregaon Park, Pune',
  'T Nagar, Chennai',
  'Park Street, Kolkata',
  'Banjara Hills, Hyderabad'
];

export default function SearchBox({ onSearch }: SearchBoxProps) {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [mealOption, setMealOption] = useState('');
  
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch real-time restaurant autocomplete suggestions as user types (debounced)
  useEffect(() => {
    if (keyword.trim().length >= 1) {
      const fetchSuggestions = async () => {
        try {
          const res = await fetch(`/api/restaurants?keyword=${encodeURIComponent(keyword.trim())}`);
          if (res.ok) {
            const data = await res.json();
            setSuggestions(data.slice(0, 5)); // top 5 matches
            setShowSuggestions(true);
          }
        } catch (err) {
          console.error("Failed to fetch search suggestions:", err);
        }
      };
      const debounceTimer = setTimeout(fetchSuggestions, 250);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [keyword]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Could not parse search history");
      }
    }
  }, []);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false);
        setShowLocationSuggestions(false);
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    // Save to history if keyword exists
    if (keyword.trim() && !history.includes(keyword.trim())) {
      const newHistory = [keyword.trim(), ...history].slice(0, 5); // Keep last 5
      setHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
    
    setShowHistory(false);
    setShowLocationSuggestions(false);
    setShowSuggestions(false);
    
    onSearch({ keyword, location, type, mealOption });
  };

  const handleHistoryClick = (item: string) => {
    setKeyword(item);
    setShowHistory(false);
    setShowSuggestions(false);
    
    // Save to history to re-order/persist
    if (item.trim() && !history.includes(item.trim())) {
      const newHistory = [item.trim(), ...history.filter(h => h !== item.trim())].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }

    onSearch({ keyword: item, location, type, mealOption });
  };

  const handleSuggestionClick = (id: string) => {
    setShowSuggestions(false);
    setShowHistory(false);
    router.push(`/restaurant/${id}`);
  };

  const handleLocationClick = (loc: string) => {
    setLocation(loc);
    setShowLocationSuggestions(false);
    onSearch({ keyword, location: loc, type, mealOption });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('searchHistory');
  };

  // Precise Haversine Formula to calculate distance between coordinates in km
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Known premium dining hubs mapping center coordinates
          const RESTAURANT_HUBS = [
            { name: 'Murthal, Delhi NCR', lat: 28.98, lng: 77.07 },
            { name: 'Connaught Place, New Delhi', lat: 28.63, lng: 77.22 },
            { name: 'Bandra West, Mumbai', lat: 19.06, lng: 72.83 },
            { name: 'Indiranagar, Bangalore', lat: 12.97, lng: 77.64 },
            { name: 'Koregaon Park, Pune', lat: 18.53, lng: 73.89 },
            { name: 'T Nagar, Chennai', lat: 13.04, lng: 80.23 },
            { name: 'Secunderabad, Hyderabad', lat: 17.44, lng: 78.50 }
          ];

          // Determine closest hub based on coordinates
          let closestHub = RESTAURANT_HUBS[0];
          let minDistance = Infinity;

          for (const hub of RESTAURANT_HUBS) {
            const distance = getDistance(lat, lng, hub.lat, hub.lng);
            if (distance < minDistance) {
              minDistance = distance;
              closestHub = hub;
            }
          }

          // Use closest hub if within a reasonable regional radius (150 km)
          const detectedCity = minDistance < 150 ? closestHub.name : 'Connaught Place, New Delhi';
          
          setTimeout(() => {
            setLocation(detectedCity);
            setIsDetectingLocation(false);
            onSearch({ keyword, location: detectedCity, type, mealOption });
          }, 800);
        },
        (error) => {
          console.error("Location access failed, falling back to top hub", error);
          setTimeout(() => {
            setLocation('Connaught Place, New Delhi');
            setIsDetectingLocation(false);
            onSearch({ keyword, location: 'Connaught Place, New Delhi', type, mealOption });
          }, 800);
        }
      );
    } else {
      setIsDetectingLocation(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="search-box-container" ref={searchContainerRef}>
      <div className="search-bar glass-panel expanded-search">
        
        {/* Keyword Search with Autocomplete suggestions */}
        <div className="search-input-group">
          <span className="search-input-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Cuisine, restaurant..." 
            className="search-input" 
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => {
              if (keyword.trim().length >= 1) {
                setShowSuggestions(true);
              } else {
                setShowHistory(true);
              }
            }}
          />
          
          {/* 1. Live Restaurant Autocomplete suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="dropdown-panel suggestions-panel">
              <div className="dropdown-header">Matching Restaurants</div>
              <ul className="dropdown-list">
                {suggestions.map((item) => (
                  <li key={item.id} onClick={() => handleSuggestionClick(item.id)} className="suggestion-item">
                    <span className="suggestion-item-icon">🍽️</span>
                    <div className="suggestion-details">
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-meta">{item.cuisine} • {item.location}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 2. History Dropdown (only when empty input is focused) */}
          {!showSuggestions && showHistory && history.length > 0 && (
            <div className="dropdown-panel history-panel">
              <div className="dropdown-header">Recent Searches</div>
              <ul className="dropdown-list">
                {history.map((item, idx) => (
                  <li key={idx} onClick={() => handleHistoryClick(item)}>
                    <span className="history-icon">🕒</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* Location Search with Geolocation Detection */}
        <div className="search-input-group location-input-wrapper">
          <span className="search-input-icon">📍</span>
          <input 
            type="text" 
            placeholder="Location (e.g. Mumbai)" 
            className="search-input location-input" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onFocus={() => setShowLocationSuggestions(true)}
          />
          <button 
            type="button" 
            className={`detect-location-btn ${isDetectingLocation ? 'loading' : ''}`}
            onClick={handleDetectLocation}
            title="Detect location near me"
          >
            {isDetectingLocation ? <span className="spinner-dots"></span> : 'Near Me'}
          </button>
          
          {showLocationSuggestions && (
            <div className="dropdown-panel location-panel">
              <div className="dropdown-header">Popular Locations</div>
              <ul className="dropdown-list">
                <li className="detect-location-dropdown-item" onClick={handleDetectLocation}>
                  <span>📍</span> <strong>Detect location near me</strong>
                </li>
                {INDIAN_LOCATIONS.filter(loc => loc.toLowerCase().includes(location.toLowerCase())).map((loc, idx) => (
                  <li key={idx} onClick={() => handleLocationClick(loc)}>
                    <span>📍</span> {loc}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="divider"></div>

        {/* Dietary Preference */}
        <select 
          className="search-select" 
          value={type} 
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Diet: Any</option>
          <option value="veg">Veg Only</option>
          <option value="non-veg">Non-Veg</option>
        </select>

        <div className="divider"></div>

        {/* Meal Options */}
        <select 
          className="search-select" 
          value={mealOption} 
          onChange={(e) => setMealOption(e.target.value)}
        >
          <option value="">Meal: Any</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Buffet">Buffet</option>
        </select>

        <button className="btn-primary search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Classy & Modern Recent Searches Pills Section */}
      {history.length > 0 && (
        <div className="recent-searches-row animate-fade-in">
          <span className="recent-label">🕒 Recent:</span>
          <div className="recent-pills">
            {history.map((item, idx) => (
              <button 
                key={idx} 
                className="recent-pill-btn"
                onClick={() => handleHistoryClick(item)}
                type="button"
              >
                {item}
              </button>
            ))}
            <button 
              className="clear-pills-btn" 
              onClick={clearHistory}
              type="button"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
