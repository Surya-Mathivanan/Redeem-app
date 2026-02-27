import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash, faGift, faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const FEATURES = [
  { emoji: '🎁', text: 'Discover exclusive redeem codes shared by the community' },
  { emoji: '⚡', text: 'Copy codes instantly and track your activity' },
  { emoji: '🏆', text: 'Earn contribution points as you share and collect codes' },
  { emoji: '🛡️', text: 'Safe, fast, and completely free to use' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    setIsLoading(true);
    const success = await login(formData);
    setIsLoading(false);
    if (success) navigate('/');
  };

  return (
    <div className="login-page">
      {/* Animated background blobs */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-layout">
        {/* Left panel — branding */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-brand-icon"><FontAwesomeIcon icon={faGift} /></span>
            <span className="login-brand-name">RedeemHub</span>
          </div>
          <h2 className="login-tagline">
            Your <span className="login-tag-accent">community</span> for<br />
            exclusive redeem codes
          </h2>
          <div className="login-features">
            {FEATURES.map((f, i) => (
              <div className="login-feature-item" key={i}>
                <span className="login-feature-emoji">{f.emoji}</span>
                <span className="login-feature-text">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-right">
          <div className="login-card">
            {/* Header */}
            <div className="login-card-header">
              <h1 className="login-title">Welcome back 👋</h1>
              <p className="login-subtitle">Sign in to access your redeem codes</p>
            </div>

            <form onSubmit={onSubmit} className="login-form">
              {/* Email */}
              <div className={`login-field ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}>
                <label className="login-field-label" htmlFor="login-email">Email Address</label>
                <div className="login-field-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} className="login-field-icon" />
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    className="login-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={onChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`login-field ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
                <label className="login-field-label" htmlFor="login-password">Password</label>
                <div className="login-field-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    className="login-input"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={onChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="login-submit"
                className="login-submit-btn"
                disabled={isLoading || !formData.email || !formData.password}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="login-link">Create one free →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;