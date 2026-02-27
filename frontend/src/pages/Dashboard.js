import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy, faPlus, faArchive, faGift, faChartBar, faTrophy,
  faFire, faHistory, faUser, faClock, faExternalLinkAlt, faStar
} from '@fortawesome/free-solid-svg-icons';

const CONTRIBUTION_LEVELS = [
  { min: 0,  max: 2,  label: 'Newcomer',      color: '#8b949e', icon: faStar },
  { min: 3,  max: 9,  label: 'Contributor',   color: '#3fb950', icon: faStar },
  { min: 10, max: 24, label: 'Active Sharer', color: '#58a6ff', icon: faTrophy },
  { min: 25, max: 49, label: 'Code Guru',     color: '#f9c513', icon: faTrophy },
  { min: 50, max: Infinity, label: 'Legends Club', color: '#f85149', icon: faFire },
];

const getLevel = (addedCodes) =>
  CONTRIBUTION_LEVELS.find(l => addedCodes >= l.min && addedCodes <= l.max) || CONTRIBUTION_LEVELS[0];

const formatRelative = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalCopies: 0, addedCodes: 0, archivedCodes: 0, activeCodes: 0 });
  const [activity, setActivity] = useState({ recentCopies: [], recentCodes: [] });
  const [loading, setLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/codes/stats');
        setStats(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };
    const fetchActivity = async () => {
      try {
        const res = await api.get('/users/activity');
        setActivity(res.data);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setActivityLoading(false);
      }
    };
    fetchStats();
    fetchActivity();
  }, []);

  const level = getLevel(stats.addedCodes);
  const nextLevel = CONTRIBUTION_LEVELS.find(l => l.min > stats.addedCodes);
  const progressPct = nextLevel
    ? Math.min(100, ((stats.addedCodes - level.min) / (nextLevel.min - level.min)) * 100)
    : 100;
  const contributionScore = stats.addedCodes * 10 + stats.totalCopies * 2;

  const statCards = [
    {
      label: 'Codes Copied',
      value: stats.totalCopies,
      icon: faCopy,
      color: '#58a6ff',
      bg: 'rgba(88,166,255,0.1)',
      link: '/',
    },
    {
      label: 'Codes Added',
      value: stats.addedCodes,
      icon: faPlus,
      color: '#3fb950',
      bg: 'rgba(63,185,80,0.1)',
      link: '/add-code',
    },
    {
      label: 'Active Codes',
      value: stats.activeCodes,
      icon: faGift,
      color: '#f9c513',
      bg: 'rgba(249,197,19,0.1)',
      link: '/',
    },
    {
      label: 'Archived Codes',
      value: stats.archivedCodes,
      icon: faArchive,
      color: '#f85149',
      bg: 'rgba(248,81,73,0.1)',
      link: '/archive',
    },
  ];

  return (
    <Layout>
      {/* Greeting */}
      <div className="dashboard-greeting mb-4">
        <div>
          <h2 className="page-title mb-1">
            <span className="title-accent-red">Your</span>{' '}
            <span className="title-accent-yellow">Dashboard</span>
          </h2>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong> 👋
          </p>
        </div>
        <Link to="/add-code" className="btn btn-primary">
          <FontAwesomeIcon icon={faPlus} className="me-2" />Share a Code
        </Link>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status" />
            <p className="loading-text">Loading dashboard…</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="row g-3 mb-4">
            {statCards.map(card => (
              <div className="col-6 col-lg-3" key={card.label}>
                <Link to={card.link} className="stat-card" style={{ '--card-color': card.color, '--card-bg': card.bg }}>
                  <div className="stat-card-icon">
                    <FontAwesomeIcon icon={card.icon} />
                  </div>
                  <div className="stat-card-value">{card.value}</div>
                  <div className="stat-card-label">{card.label}</div>
                </Link>
              </div>
            ))}
          </div>

          {/* Contribution Score + Level */}
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <div className="dashboard-level-card">
                <div className="level-card-header">
                  <div>
                    <div className="level-label">Contributor Level</div>
                    <div className="level-name" style={{ color: level.color }}>
                      <FontAwesomeIcon icon={level.icon} className="me-2" />
                      {level.label}
                    </div>
                  </div>
                  <div className="score-pill" style={{ borderColor: level.color, color: level.color }}>
                    {contributionScore} pts
                  </div>
                </div>
                <div className="level-progress-track">
                  <div
                    className="level-progress-fill"
                    style={{ width: `${progressPct}%`, background: level.color }}
                  />
                </div>
                <div className="level-progress-labels">
                  <span style={{ color: level.color }}>{level.label} ({level.min}+)</span>
                  {nextLevel && (
                    <span style={{ color: '#8b949e' }}>
                      Next: {nextLevel.label} at {nextLevel.min} codes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="dashboard-score-card">
                <FontAwesomeIcon icon={faChartBar} className="score-card-icon" />
                <div>
                  <div className="score-card-value">{contributionScore}</div>
                  <div className="score-card-label">Total Contribution Score</div>
                  <div className="score-card-breakdown">
                    <span>{stats.addedCodes} × 10 pts (added)</span>
                    <span className="ms-2">{stats.totalCopies} × 2 pts (copied)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="row g-3">
            {/* Recent Copies */}
            <div className="col-md-6">
              <div className="activity-card">
                <div className="activity-card-header">
                  <FontAwesomeIcon icon={faCopy} className="me-2" style={{ color: '#58a6ff' }} />
                  Codes You Recently Copied
                </div>
                {activityLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  </div>
                ) : activity.recentCopies.length === 0 ? (
                  <div className="activity-empty">
                    <FontAwesomeIcon icon={faCopy} className="me-2" />
                    No copies yet. <Link to="/">Browse codes →</Link>
                  </div>
                ) : (
                  <ul className="activity-list">
                    {activity.recentCopies.map(c => (
                      <li className="activity-item" key={c._id}>
                        <div className="activity-item-left">
                          <span className="activity-dot copy-dot" />
                          <div>
                            <div className="activity-title">
                              {c.redeemCode?.title || 'Unknown Code'}
                            </div>
                            <div className="activity-sub">
                              <FontAwesomeIcon icon={faUser} className="me-1" />
                              by {c.redeemCode?.user?.name || '—'}
                            </div>
                          </div>
                        </div>
                        <div className="activity-time">
                          <FontAwesomeIcon icon={faClock} className="me-1" />
                          {formatRelative(c.createdAt)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Codes Posted */}
            <div className="col-md-6">
              <div className="activity-card">
                <div className="activity-card-header">
                  <FontAwesomeIcon icon={faHistory} className="me-2" style={{ color: '#3fb950' }} />
                  Codes You Recently Shared
                </div>
                {activityLoading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border spinner-border-sm text-primary" role="status" />
                  </div>
                ) : activity.recentCodes.length === 0 ? (
                  <div className="activity-empty">
                    <FontAwesomeIcon icon={faGift} className="me-2" />
                    None yet. <Link to="/add-code">Add one →</Link>
                  </div>
                ) : (
                  <ul className="activity-list">
                    {activity.recentCodes.map(c => (
                      <li className="activity-item" key={c._id}>
                        <div className="activity-item-left">
                          <span className={`activity-dot ${c.isArchived ? 'archive-dot' : 'share-dot'}`} />
                          <div>
                            <div className="activity-title">{c.title}</div>
                            <div className="activity-sub">
                              <FontAwesomeIcon icon={faCopy} className="me-1" />
                              {c.copyCount} copies &nbsp;·&nbsp;
                              <span style={{ color: c.isArchived ? '#f85149' : '#3fb950' }}>
                                {c.isArchived ? 'Archived' : 'Active'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="activity-time">
                          <FontAwesomeIcon icon={faClock} className="me-1" />
                          {formatRelative(c.createdAt)}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="dashboard-quick-links mt-4">
            <div className="quick-links-label">Quick Actions</div>
            <div className="quick-links-row">
              <Link to="/add-code" className="quick-link-btn">
                <FontAwesomeIcon icon={faPlus} className="me-2" />Add Code
              </Link>
              <Link to="/" className="quick-link-btn">
                <FontAwesomeIcon icon={faGift} className="me-2" />Browse Feed
              </Link>
              <Link to="/archive" className="quick-link-btn">
                <FontAwesomeIcon icon={faArchive} className="me-2" />Archive
              </Link>
              <Link to="/account" className="quick-link-btn">
                <FontAwesomeIcon icon={faUser} className="me-2" />Profile
              </Link>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;