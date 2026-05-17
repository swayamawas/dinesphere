'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import './AuthModal.css';

type ForgotStep = 'email' | 'otp' | 'newpassword' | 'success';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authMode, openAuthModal, login, signup } = useAuth();

  // Login / Signup fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<ForgotStep>('email');
  const [devOtp, setDevOtp] = useState(''); // For showing OTP in dev mode

  // Shared state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setForgotEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotStep('email');
    setDevOtp('');
    setError('');
    setSuccessMsg('');
    setIsSubmitting(false);
  };

  const handleSwitchMode = (mode: 'login' | 'signup' | 'forgot') => {
    setError('');
    setSuccessMsg('');
    if (mode === 'forgot') {
      setForgotStep('email');
      setDevOtp('');
    }
    openAuthModal(mode);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  // ── Login / Signup Submit ─────────────────────────────────────
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;

      if (authMode === 'signup') {
        result = await signup(name, email, password);
      } else {
        result = await login(email, password);
      }

      if (!result.ok) {
        setError(result.error || 'An error occurred');
        setIsSubmitting(false);
      } else {
        resetForm();
      }
    } catch (_err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ── Forgot Password: Send OTP ────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to send OTP');
        setIsSubmitting(false);
        return;
      }

      // In dev mode, show the OTP to the user
      if (data.devOtp) {
        setDevOtp(data.devOtp);
      }

      setSuccessMsg('OTP sent! Check your email (or see below in dev mode).');
      setForgotStep('otp');
      setIsSubmitting(false);
    } catch (_err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ── Forgot Password: Verify OTP & Reset ──────────────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to reset password');
        setIsSubmitting(false);
        return;
      }

      setForgotStep('success');
      setIsSubmitting(false);
    } catch (_err) {
      setError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  // ── Render: Forgot Password Flow ─────────────────────────────
  if (authMode === 'forgot') {
    return (
      <div className="modal-backdrop" onClick={handleClose}>
        <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
          <button className="modal-close" onClick={handleClose}>&times;</button>

          {forgotStep === 'success' ? (
            <div className="forgot-success">
              <div className="success-check">✅</div>
              <h2 className="modal-title">Password Reset!</h2>
              <p className="forgot-desc">Your password has been successfully updated. You can now log in with your new password.</p>
              <button
                className="btn-primary auth-submit"
                onClick={() => handleSwitchMode('login')}
              >
                Go to Login
              </button>
            </div>
          ) : (
            <>
              <h2 className="modal-title">Reset Password</h2>

              {/* Step indicator */}
              <div className="step-indicator">
                <div className={`step ${forgotStep === 'email' ? 'active' : 'done'}`}>
                  <span className="step-num">1</span>
                  <span className="step-label">Email</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${forgotStep === 'otp' ? 'active' : forgotStep === 'newpassword' ? 'done' : ''}`}>
                  <span className="step-num">2</span>
                  <span className="step-label">Verify OTP</span>
                </div>
                <div className="step-line"></div>
                <div className={`step ${forgotStep === 'newpassword' ? 'active' : ''}`}>
                  <span className="step-num">3</span>
                  <span className="step-label">New Password</span>
                </div>
              </div>

              {error && (
                <div className="auth-error">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              {successMsg && !error && (
                <div className="auth-success">
                  <span className="success-icon-sm">✉️</span>
                  {successMsg}
                </div>
              )}

              {/* Step 1: Enter Email */}
              {forgotStep === 'email' && (
                <form onSubmit={handleSendOtp} className="auth-form">
                  <p className="forgot-desc">Enter your email address and we&apos;ll send you a verification code to reset your password.</p>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary auth-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Send Verification Code'}
                  </button>
                </form>
              )}

              {/* Step 2: Enter OTP */}
              {forgotStep === 'otp' && (
                <form onSubmit={(e) => { e.preventDefault(); setError(''); setForgotStep('newpassword'); }} className="auth-form">
                  <p className="forgot-desc">Enter the 6-digit code sent to <strong>{forgotEmail}</strong></p>

                  {/* Dev mode: Show OTP */}
                  {devOtp && (
                    <div className="dev-otp-banner">
                      <span className="dev-label">🔧 Dev Mode — Your OTP:</span>
                      <span className="dev-otp-code">{devOtp}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Verification Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => {
                        // Only allow digits, max 6
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(val);
                      }}
                      required
                      maxLength={6}
                      pattern="[0-9]{6}"
                      className="otp-input"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary auth-submit"
                    disabled={otp.length !== 6}
                  >
                    Verify Code
                  </button>
                  <button
                    type="button"
                    className="btn-link resend-btn"
                    onClick={() => { setForgotStep('email'); setSuccessMsg(''); setDevOtp(''); }}
                  >
                    Didn&apos;t receive it? Resend code
                  </button>
                </form>
              )}

              {/* Step 3: New Password */}
              {forgotStep === 'newpassword' && (
                <form onSubmit={handleResetPassword} className="auth-form">
                  <p className="forgot-desc">Create a new password for your account.</p>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={isSubmitting}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary auth-submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="auth-toggle">
            <p>
              Remember your password?{' '}
              <span onClick={() => handleSwitchMode('login')}>Back to Login</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Render: Login / Signup ────────────────────────────────────
  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>&times;</button>
        <h2 className="modal-title">{authMode === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isSubmitting}
            />
          </div>

          {authMode === 'login' && (
            <div className="forgot-link-wrapper">
              <span className="forgot-link" onClick={() => handleSwitchMode('forgot')}>
                Forgot password?
              </span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (authMode === 'login' ? 'Logging in...' : 'Creating account...')
              : (authMode === 'login' ? 'Log In' : 'Sign Up')
            }
          </button>

          <div className="auth-toggle">
            {authMode === 'login' ? (
              <p>Don&apos;t have an account? <span onClick={() => handleSwitchMode('signup')}>Sign up</span></p>
            ) : (
              <p>Already have an account? <span onClick={() => handleSwitchMode('login')}>Log in</span></p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
