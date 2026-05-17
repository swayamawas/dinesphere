'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, openAuthModal } = useAuth();

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-content">
      <Link href="/" className="logo">
  Dine<span className="logo-accent">Sphere</span>
</Link>
        
        <div className="nav-links">
          <Link href="/" className="nav-item">Explore</Link>
          <Link href="/bookings" className="nav-item">Bookings</Link>
        </div>
        
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <span className="user-greeting">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
              <button className="btn-secondary" onClick={logout}>Log Out</button>
            </>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => openAuthModal('login')}>Log In</button>
              <button className="btn-primary" onClick={() => openAuthModal('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
