import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen, faTrash, faSearch, faTimes, faArchive,
  faUser, faCalendar, faCopy, faGift, faInfoCircle, faFilter
} from '@fortawesome/free-solid-svg-icons';

const CATEGORY_ICONS = {
  'Food & Dining': '🍔', 'Travel': '✈️', 'Cosmetics & Beauty': '💄',
  'Electronics': '📱', 'Fashion & Clothing': '👗', 'Entertainment': '🎬',
  'Health & Fitness': '💪', 'Shopping': '🛍️', 'Gaming': '🎮', 'Other': '🎁',
};

const Archive = () => {
  const [archivedCodes, setArchivedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [unarchivingId, setUnarchivingId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArchivedCodes = async () => {
      try {
        const res = await api.get('/codes/archive');
        setArchivedCodes(res.data);
      } catch (error) {
        console.error('Error fetching archived codes:', error);
        toast.error('Failed to load archived codes');
      } finally {
        setLoading(false);
      }
    };
    fetchArchivedCodes();
  }, []);

  const handleUnarchive = async (id) => {
    setUnarchivingId(id);
    try {
      await api.put(`/codes/${id}/unarchive`);
      setArchivedCodes(prev => prev.filter(code => code._id !== id));
      toast.success('Code unarchived and moved back to active feed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unarchive code');
    } finally {
      setUnarchivingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this code?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/codes/${id}`);
      setArchivedCodes(prev => prev.filter(code => code._id !== id));
      toast.success('Code deleted permanently');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete code');
    } finally {
      setDeletingId(null);
    }
  };

  // Collect unique categories from actual archived codes
  const availableCategories = useMemo(() => {
    const cats = [...new Set(archivedCodes.map(c => c.category).filter(Boolean))];
    return ['All', ...cats];
  }, [archivedCodes]);

  // Client-side filtering
  const filteredCodes = useMemo(() => {
    let result = archivedCodes;
    if (activeCategory !== 'All') {
      result = result.filter(c => c.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)) ||
          (c.category && c.category.toLowerCase().includes(q))
      );
    }
    return result;
  }, [archivedCodes, activeCategory, searchQuery]);

  const hasFilters = searchQuery.trim() || activeCategory !== 'All';
  const clearFilters = () => { setSearchQuery(''); setActiveCategory('All'); };

  // ── FIX: compare as strings to avoid ObjectId vs string mismatch ──
  const isOwner = (code) => {
    return user && code.user && code.user._id
      ? String(code.user._id) === String(user._id)
      : false;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getArchiveReason = (code) => {
    if (code.copyCount >= 5) return { label: 'Exhausted (5 copies reached)', color: '#f85149' };
    const age = (Date.now() - new Date(code.createdAt)) / (1000 * 60 * 60 * 24);
    if (age > 14) return { label: 'Expired (older than 14 days)', color: '#f9c513' };
    return { label: 'Manually archived', color: '#8b949e' };
  };

  return (
    <Layout>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="page-title mb-1">
            <span className="title-accent-red">Archived</span>{' '}
            <span className="title-accent-yellow">Codes</span>
          </h2>
          <p className="page-subtitle">Exhausted or expired codes are stored here</p>
        </div>
        <span className="archive-count-badge">
          <FontAwesomeIcon icon={faArchive} className="me-2" />
          {archivedCodes.length} Archived
        </span>
      </div>

      {/* Info Banner */}
      <div className="archive-info-banner mb-4">
        <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
        Codes appear here when they are&nbsp;<strong>manually archived</strong>,&nbsp;
        <strong>reach 5 copies</strong>, or are&nbsp;<strong>older than 14 days</strong>.
        Only the original poster can unarchive or delete a code.
      </div>

      {/* Search + Filter */}
      {!loading && archivedCodes.length > 0 && (
        <div className="archive-filters mb-4">
          <div className="home-search-input-wrapper mb-3">
            <FontAwesomeIcon icon={faSearch} className="home-search-icon" />
            <input
              type="text"
              className="home-search-input"
              placeholder="Search archived codes…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              id="archive-search"
            />
            {searchQuery && (
              <button className="home-search-clear" onClick={() => setSearchQuery('')}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
          </div>
          {availableCategories.length > 2 && (
            <div className="category-chips">
              {availableCategories.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat !== 'All' && <span className="chip-emoji">{CATEGORY_ICONS[cat] || '🎁'}</span>}
                  {cat}
                </button>
              ))}
              {hasFilters && (
                <button className="btn-clear-filters" onClick={clearFilters}>
                  <FontAwesomeIcon icon={faTimes} className="me-1" />Clear
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading…</span>
            </div>
            <p className="loading-text">Loading archived codes…</p>
          </div>
        </div>
      ) : archivedCodes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <FontAwesomeIcon icon={faArchive} className="empty-state-icon" />
            <h3 className="empty-state-title">No archived codes yet</h3>
            <p className="empty-state-description">
              Codes will appear here when they expire or reach the copy limit.
            </p>
            <Link to="/" className="btn btn-primary">
              <FontAwesomeIcon icon={faGift} className="me-2" />Browse Active Codes
            </Link>
          </div>
        </div>
      ) : filteredCodes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <FontAwesomeIcon icon={faSearch} className="empty-state-icon" />
            <h3 className="empty-state-title">No matching archived codes</h3>
            <p className="empty-state-description">Try adjusting your search or category filter.</p>
            <button className="btn btn-secondary" onClick={clearFilters}>
              <FontAwesomeIcon icon={faTimes} className="me-2" />Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="codes-result-info mb-3">
            <FontAwesomeIcon icon={faFilter} className="me-2" style={{ color: '#8b949e' }} />
            Showing <strong>{filteredCodes.length}</strong> of <strong>{archivedCodes.length}</strong> archived codes
          </div>
          <div className="row g-4">
            {filteredCodes.map(code => {
              const reason = getArchiveReason(code);
              const owned = isOwner(code);
              return (
                <div className="col-md-6 col-lg-4" key={code._id}>
                  <div className="archive-card">
                    {/* Status ribbon */}
                    <div className="archive-card-ribbon" style={{ background: reason.color }}>
                      {reason.label}
                    </div>

                    <div className="archive-card-body">
                      {/* Title + category */}
                      <div className="archive-card-header">
                        <div className="d-flex align-items-center gap-2">
                          <span className="chip-emoji" style={{ fontSize: '1.4rem' }}>
                            {CATEGORY_ICONS[code.category] || '🎁'}
                          </span>
                          <div>
                            <h5 className="archive-code-title">{code.title}</h5>
                            {code.category && (
                              <span className="archive-category-tag">{code.category}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {code.description && (
                        <p className="archive-description">{code.description}</p>
                      )}

                      {/* Code value (always visible in archive) */}
                      <div className="archive-code-display">{code.code}</div>

                      {/* Meta */}
                      <div className="archive-meta">
                        <span className="meta-item">
                          <FontAwesomeIcon icon={faUser} className="meta-icon" />
                          {code.user?.name || 'Unknown'}
                        </span>
                        <span className="meta-item">
                          <FontAwesomeIcon icon={faCalendar} className="meta-icon" />
                          {formatDate(code.createdAt)}
                        </span>
                        <span className="meta-item">
                          <FontAwesomeIcon icon={faCopy} className="meta-icon" />
                          {code.copyCount} / 5 copies
                        </span>
                      </div>
                    </div>

                    {/* Actions (owner only) */}
                    {owned && (
                      <div className="archive-card-actions">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleUnarchive(code._id)}
                          disabled={unarchivingId === code._id}
                          title="Move back to active feed"
                        >
                          {unarchivingId === code._id ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                          ) : (
                            <FontAwesomeIcon icon={faBoxOpen} className="me-1" />
                          )}
                          Unarchive
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(code._id)}
                          disabled={deletingId === code._id}
                          title="Permanently delete"
                        >
                          {deletingId === code._id ? (
                            <span className="spinner-border spinner-border-sm me-1" />
                          ) : (
                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
};

export default Archive;
