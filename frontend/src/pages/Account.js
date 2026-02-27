import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import Pagination from '../components/Pagination';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faEnvelope, faLock, faShieldAlt, faHistory,
  faCopy, faGift, faCalendar, faClock, faCheckCircle, faTimesCircle
} from '@fortawesome/free-solid-svg-icons';

const PAGE_SIZE = 5;

const relTime = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const formatDate = (str) => str
  ? new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  : '—';

const Account = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [suspension, setSuspension] = useState(null);
  const [suspLoading, setSuspLoading] = useState(true);
  const [activity, setActivity] = useState({ recentCopies: [], recentCodes: [] });
  const [activityLoading, setActivityLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [copiesPage, setCopiesPage] = useState(1);
  const [codesPage, setCodesPage] = useState(1);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [suspRes, actRes] = await Promise.all([
          api.get('/users/suspension'),
          api.get('/users/activity'),
        ]);
        setSuspension(suspRes.data);
        setActivity(actRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setSuspLoading(false);
        setActivityLoading(false);
      }
    };
    fetchExtras();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password && formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) updateData.password = formData.password;
      await updateProfile(updateData);
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const formatRelative = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const tabs = [
    { id: 'profile',    label: 'Profile',    icon: faUser },
    { id: 'security',   label: 'Security',   icon: faShieldAlt },
    { id: 'activity',   label: 'Activity',   icon: faHistory },
  ];

  return (
    <Layout>
      <div className="account-page">
        {/* Page header */}
        <div className="mb-4">
          <h2 className="page-title mb-1">
            <span className="title-accent-red">Account</span>{' '}
            <span className="title-accent-yellow">Settings</span>
          </h2>
          <p className="page-subtitle">Manage your profile and view your activity</p>
        </div>

        {/* Avatar + info card */}
        <div className="account-hero mb-4">
          <div className="account-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="account-hero-info">
            <div className="account-hero-name">{user?.name}</div>
            <div className="account-hero-email">{user?.email}</div>
            <div className="account-hero-meta">
              <span>
                <FontAwesomeIcon icon={faCalendar} className="me-1" />
                Member since {formatDate(user?.createdAt)}
              </span>
              <span className={`account-status-badge ${suspension?.isSuspended ? 'suspended' : 'active'}`}>
                <FontAwesomeIcon
                  icon={suspension?.isSuspended ? faTimesCircle : faCheckCircle}
                  className="me-1"
                />
                {suspension?.isSuspended ? 'Suspended' : 'Active Account'}
              </span>
            </div>
          </div>
        </div>

        {/* Suspension warning */}
        {!suspLoading && suspension?.isSuspended && (
          <div className="account-suspension-banner mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="me-2" />
            Your account is suspended until{' '}
            <strong>
              {new Date(suspension.suspendedUntil).toLocaleString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric',
                hour: '2-digit', minute: '2-digit', hour12: true,
              })}
            </strong>
            {suspension.reason && <span className="ms-2">· Reason: {suspension.reason}</span>}
          </div>
        )}

        {/* Tabs */}
        <div className="account-tabs mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`account-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="account-card">
            <div className="account-card-header">
              <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#58a6ff' }} />
              Personal Information
            </div>
            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#8b949e' }} />
                    Display Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    id="account-name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your display name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" style={{ color: '#8b949e' }} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    id="account-email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Saving…</>
                  ) : (
                    <><FontAwesomeIcon icon={faCheckCircle} className="me-2" />Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="account-card">
            <div className="account-card-header">
              <FontAwesomeIcon icon={faLock} className="me-2" style={{ color: '#f9c513' }} />
              Change Password
            </div>
            <form onSubmit={handleSubmit} className="account-form">
              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faLock} className="me-2" style={{ color: '#8b949e' }} />
                  New Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    name="password"
                    id="account-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="form-hint">Minimum 6 characters</div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FontAwesomeIcon icon={faLock} className="me-2" style={{ color: '#8b949e' }} />
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  name="confirmPassword"
                  id="account-confirm-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your new password"
                />
                {formData.password && formData.confirmPassword && (
                  <div className={`password-match ${formData.password === formData.confirmPassword ? 'match' : 'no-match'}`}>
                    {formData.password === formData.confirmPassword
                      ? '✅ Passwords match'
                      : '❌ Passwords do not match'}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !formData.password || formData.password !== formData.confirmPassword}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Updating…</>
                  ) : (
                    <><FontAwesomeIcon icon={faLock} className="me-2" />Update Password</>
                  )}
                </button>
              </div>
            </form>

            {/* Account status info */}
            <div className="security-info-section mt-4">
              <div className="security-info-title">Account Status</div>
              <div className="security-info-row">
                <span>Status</span>
                <span className={suspension?.isSuspended ? 'text-danger' : 'text-success'}>
                  {suspension?.isSuspended ? '🔴 Suspended' : '🟢 Active'}
                </span>
              </div>
              {suspension?.isSuspended && (
                <div className="security-info-row">
                  <span>Suspended Until</span>
                  <span>{formatDate(suspension.suspendedUntil)}</span>
                </div>
              )}
              <div className="security-info-row">
                <span>JWT Token</span>
                <span style={{ color: '#8b949e' }}>Active (30-day expiry)</span>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (() => {
          const copiesTotalPages = Math.ceil(activity.recentCopies.length / PAGE_SIZE);
          const codesTotalPages  = Math.ceil(activity.recentCodes.length  / PAGE_SIZE);
          const pagedCopies = activity.recentCopies.slice((copiesPage - 1) * PAGE_SIZE, copiesPage * PAGE_SIZE);
          const pagedCodes  = activity.recentCodes.slice((codesPage  - 1) * PAGE_SIZE, codesPage  * PAGE_SIZE);
          return (
            <div className="row g-4">
              <div className="col-md-6">
                <div className="activity-card">
                  <div className="activity-card-header">
                    <FontAwesomeIcon icon={faCopy} className="me-2" style={{ color: '#58a6ff' }} />
                    Recently Copied
                    {activity.recentCopies.length > 0 && (
                      <span className="activity-count-badge ms-auto">{activity.recentCopies.length} total</span>
                    )}
                  </div>
                  {activityLoading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status" />
                    </div>
                  ) : activity.recentCopies.length === 0 ? (
                    <div className="activity-empty">No copies yet.</div>
                  ) : (
                    <>
                      <ul className="activity-list">
                        {pagedCopies.map(c => (
                          <li className="activity-item" key={c._id}>
                            <div className="activity-item-left">
                              <span className="activity-dot copy-dot" />
                              <div>
                                <div className="activity-title">{c.redeemCode?.title || 'Unknown'}</div>
                                <div className="activity-sub">by {c.redeemCode?.user?.name || '—'}</div>
                              </div>
                            </div>
                            <div className="activity-time">
                              <FontAwesomeIcon icon={faClock} className="me-1" />
                              {relTime(c.createdAt)}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {copiesTotalPages > 1 && (
                        <div className="activity-pagination">
                          <Pagination currentPage={copiesPage} totalPages={copiesTotalPages} onPageChange={setCopiesPage} compact />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="activity-card">
                  <div className="activity-card-header">
                    <FontAwesomeIcon icon={faGift} className="me-2" style={{ color: '#3fb950' }} />
                    Codes You Shared
                    {activity.recentCodes.length > 0 && (
                      <span className="activity-count-badge ms-auto">{activity.recentCodes.length} total</span>
                    )}
                  </div>
                  {activityLoading ? (
                    <div className="text-center py-3">
                      <div className="spinner-border spinner-border-sm text-primary" role="status" />
                    </div>
                  ) : activity.recentCodes.length === 0 ? (
                    <div className="activity-empty">No codes shared yet.</div>
                  ) : (
                    <>
                      <ul className="activity-list">
                        {pagedCodes.map(c => (
                          <li className="activity-item" key={c._id}>
                            <div className="activity-item-left">
                              <span className={`activity-dot ${c.isArchived ? 'archive-dot' : 'share-dot'}`} />
                              <div>
                                <div className="activity-title">{c.title}</div>
                                <div className="activity-sub">
                                  {c.copyCount} copies ·{' '}
                                  <span style={{ color: c.isArchived ? '#f85149' : '#3fb950' }}>
                                    {c.isArchived ? 'Archived' : 'Active'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="activity-time">
                              <FontAwesomeIcon icon={faClock} className="me-1" />
                              {relTime(c.createdAt)}
                            </div>
                          </li>
                        ))}
                      </ul>
                      {codesTotalPages > 1 && (
                        <div className="activity-pagination">
                          <Pagination currentPage={codesPage} totalPages={codesTotalPages} onPageChange={setCodesPage} compact />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </Layout>
  );
};

export default Account;