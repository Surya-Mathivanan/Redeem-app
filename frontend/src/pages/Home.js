import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Layout from '../components/Layout';
import CodeCard from '../components/CodeCard';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch, faGift, faPlus, faTimes, faFilter
} from '@fortawesome/free-solid-svg-icons';

const CATEGORY_ICONS = {
  'Food & Dining':        '🍔',
  'Travel':               '✈️',
  'Cosmetics & Beauty':   '💄',
  'Electronics':          '📱',
  'Fashion & Clothing':   '👗',
  'Entertainment':        '🎬',
  'Health & Fitness':     '💪',
  'Shopping':             '🛍️',
  'Gaming':               '🎮',
  'Other':                '🎁',
};

const HARDCODED_CATEGORIES = [
  'Food & Dining','Travel','Cosmetics & Beauty','Electronics',
  'Fashion & Clothing','Entertainment','Health & Fitness',
  'Shopping','Gaming','Other',
];

const Home = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Fetch codes — primary, must succeed
    const fetchCodes = async () => {
      try {
        const res = await api.get('/codes');
        setCodes(res.data);
      } catch (error) {
        console.error('Error fetching codes:', error);
        toast.error('Failed to load redeem codes');
      } finally {
        setLoading(false);
      }
    };

    // Fetch categories — optional, fall back to hardcoded list
    const fetchCategories = async () => {
      try {
        const res = await api.get('/codes/categories');
        setCategories(['All', ...res.data]);
      } catch {
        // Backend might not have this endpoint yet (old deployment) — use fallback
        setCategories(['All', ...HARDCODED_CATEGORIES]);
      }
    };

    fetchCodes();
    fetchCategories();
  }, []);

  const handleCodeUpdate = (updatedCodeId) => {
    setCodes(prevCodes =>
      prevCodes.map(code =>
        code._id === updatedCodeId ? { ...code, hasCopied: true } : code
      )
    );
  };

  // Client-side filter (fast UX, no extra API call)
  const filteredCodes = useMemo(() => {
    let result = codes;
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
  }, [codes, activeCategory, searchQuery]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('All');
  };

  const hasFilters = searchQuery.trim() || activeCategory !== 'All';

  return (
    <Layout>
      <div className="home-container">
        {/* Header */}
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
            <div>
              <h1 className="page-title">
                <span className="title-accent-red">Available</span>{' '}
                <span className="title-accent-yellow">Redeem Codes</span>
              </h1>
              <p className="page-subtitle">Discover and redeem exclusive codes</p>
            </div>
            <Link to="/add-code" className="btn btn-primary">
              <FontAwesomeIcon icon={faPlus} className="me-2" />Add New Code
            </Link>
          </div>

          {/* Search bar */}
          <div className="home-search-bar">
            <div className="home-search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="home-search-icon" />
              <input
                type="text"
                className="home-search-input"
                placeholder="Search by title, description, or category…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                id="home-search"
              />
              {searchQuery && (
                <button
                  className="home-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>

          {/* Category filter chips */}
          <div className="category-chips-wrapper">
            <div className="category-chips">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat !== 'All' && (
                    <span className="chip-emoji">{CATEGORY_ICONS[cat] || '🎁'}</span>
                  )}
                  {cat}
                </button>
              ))}
            </div>
            {hasFilters && (
              <button className="btn-clear-filters" onClick={clearFilters}>
                <FontAwesomeIcon icon={faTimes} className="me-1" />Clear
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading redeem codes…</p>
            </div>
          </div>
        ) : filteredCodes.length > 0 ? (
          <>
            <div className="codes-result-info">
              <FontAwesomeIcon icon={faFilter} className="me-2" style={{ color: '#8b949e' }} />
              <span>
                Showing <strong>{filteredCodes.length}</strong> of{' '}
                <strong>{codes.length}</strong> codes
                {activeCategory !== 'All' && (
                  <span className="ms-1">
                    in <span className="result-cat-badge">{activeCategory}</span>
                  </span>
                )}
                {searchQuery && (
                  <span className="ms-1">
                    matching <em>"{searchQuery}"</em>
                  </span>
                )}
              </span>
            </div>
            <div className="codes-grid">
              <div className="row g-4">
                {filteredCodes.map(code => (
                  <div className="col-md-6 col-lg-4" key={code._id}>
                    <div className="code-card">
                      <CodeCard code={code} onCopySuccess={handleCodeUpdate} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <FontAwesomeIcon icon={hasFilters ? faSearch : faGift} className="empty-state-icon" />
              <h3 className="empty-state-title">
                {hasFilters ? 'No matching codes found' : 'No redeem codes available'}
              </h3>
              <p className="empty-state-description">
                {hasFilters
                  ? 'Try adjusting your search or selecting a different category.'
                  : 'Be the first to share a redeem code with the community!'}
              </p>
              {hasFilters ? (
                <button className="btn btn-secondary" onClick={clearFilters}>
                  <FontAwesomeIcon icon={faTimes} className="me-2" />Clear Filters
                </button>
              ) : (
                <Link to="/add-code" className="btn btn-primary btn-lg">
                  <FontAwesomeIcon icon={faPlus} className="me-2" />Add Redeem Code
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;