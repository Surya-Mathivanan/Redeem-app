import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner, faEye, faEyeSlash, faGift,
  faUser, faEnvelope, faLock, faArrowRight, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

const FEATURES = [
  { emoji: '🎁', text: 'Share and discover exclusive redeem codes for free' },
  { emoji: '🏆', text: 'Earn contribution points every time you share a code' },
  { emoji: '⚡', text: 'Instant access to the community code feed' },
  { emoji: '🛡️', text: 'Your account is secure with JWT authentication' },
];

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    const success = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    setIsLoading(false);
    if (success) navigate('/');
  };

  const passwordsMatch =
    formData.password && formData.confirmPassword &&
    formData.password === formData.confirmPassword;
  const passwordsMismatch =
    formData.password && formData.confirmPassword &&
    formData.password !== formData.confirmPassword;

  const fields = [
    {
      id: 'reg-name', name: 'name', type: 'text',
      label: 'Display Name', placeholder: 'What should we call you?',
      icon: faUser, autoComplete: 'name',
      value: formData.name,
    },
    {
      id: 'reg-email', name: 'email', type: 'email',
      label: 'Email Address', placeholder: 'you@example.com',
      icon: faEnvelope, autoComplete: 'email',
      value: formData.email,
    },
  ];

  return (
    <div className="login-page">
      {/* Animated blobs — same as Login */}
      <div className="login-blob login-blob-1" />
      <div className="login-blob login-blob-2" />
      <div className="login-blob login-blob-3" />

      <div className="login-layout">
        {/* Left panel — branding */}
        <div className="login-left">
          <div className="login-brand">
            <span className="login-brand-icon">
              <FontAwesomeIcon icon={faGift} />
            </span>
            <span className="login-brand-name">RedeemHub</span>
          </div>
          <h2 className="login-tagline">
            Join the <span className="login-tag-accent">community</span><br />
            and start sharing codes
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
              <h1 className="login-title">Create an account ✨</h1>
              <p className="login-subtitle">It's free and takes less than a minute</p>
            </div>

            {/* Error */}
            {error && (
              <div className="register-error-banner">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="login-form">
              {/* Name + Email */}
              {fields.map(f => (
                <div
                  key={f.id}
                  className={`login-field ${focusedField === f.name ? 'focused' : ''} ${f.value ? 'filled' : ''}`}
                >
                  <label className="login-field-label" htmlFor={f.id}>{f.label}</label>
                  <div className="login-field-wrapper">
                    <FontAwesomeIcon icon={f.icon} className="login-field-icon" />
                    <input
                      type={f.type}
                      id={f.id}
                      name={f.name}
                      className="login-input"
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={onChange}
                      onFocus={() => setFocusedField(f.name)}
                      onBlur={() => setFocusedField('')}
                      required
                      autoComplete={f.autoComplete}
                    />
                  </div>
                </div>
              ))}

              {/* Password */}
              <div className={`login-field ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}>
                <label className="login-field-label" htmlFor="reg-password">Password</label>
                <div className="login-field-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-field-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="reg-password"
                    name="password"
                    className="login-input"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={onChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                {formData.password && formData.password.length < 6 && (
                  <div className="register-field-hint error">Password must be at least 6 characters</div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={`login-field ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formData.confirmPassword ? 'filled' : ''}`}>
                <label className="login-field-label" htmlFor="reg-confirm">Confirm Password</label>
                <div className="login-field-wrapper">
                  <FontAwesomeIcon icon={faLock} className="login-field-icon" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    id="reg-confirm"
                    name="confirmPassword"
                    className="login-input"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={onChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField('')}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    tabIndex={-1}
                  >
                    <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                  </button>
                </div>
                {passwordsMatch && (
                  <div className="register-field-hint success">
                    <FontAwesomeIcon icon={faCheckCircle} className="me-1" />Passwords match
                  </div>
                )}
                {passwordsMismatch && (
                  <div className="register-field-hint error">⚠️ Passwords do not match</div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                id="register-submit"
                className="login-submit-btn"
                disabled={isLoading || !formData.name || !formData.email || !formData.password || passwordsMismatch}
              >
                {isLoading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Free Account
                    <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="login-link">Sign in →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;