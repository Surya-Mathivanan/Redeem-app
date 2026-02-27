import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faGift, faTag, faAlignLeft, faLightbulb,
  faCheckCircle, faInfoCircle
} from '@fortawesome/free-solid-svg-icons';

const CATEGORY_ICONS = {
  'Food & Dining': '🍔', 'Travel': '✈️', 'Cosmetics & Beauty': '💄',
  'Electronics': '📱', 'Fashion & Clothing': '👗', 'Entertainment': '🎬',
  'Health & Fitness': '💪', 'Shopping': '🛍️', 'Gaming': '🎮', 'Other': '🎁',
};

const TIPS = [
  '💡 Include the platform name in the title (e.g., "Amazon ₹100 Off")',
  '💡 Add a clear description so users know what the code is for',
  '💡 Choose the correct category so others can find your code easily',
  '💡 Codes are visible for 14 days or until 5 people copy them',
  '💡 You can archive your own codes any time from the Archive page',
];

const HARDCODED_CATEGORIES = [
  'Food & Dining','Travel','Cosmetics & Beauty','Electronics',
  'Fashion & Clothing','Entertainment','Health & Fitness',
  'Shopping','Gaming','Other',
];

const AddCode = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    category: 'Other',
  });
  const [categories, setCategories] = useState(HARDCODED_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentTip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const navigate = useNavigate();
  const { checkSuspension } = useAuth();

  useEffect(() => {
    api.get('/codes/categories')
      .then(res => setCategories(res.data))
      .catch(() => setCategories(HARDCODED_CATEGORIES)); // silent fallback
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuspended = await checkSuspension();
    if (isSuspended) return;

    if (formData.code.trim().length < 3) {
      toast.error('Redeem code is too short');
      return;
    }

    setLoading(true);
    try {
      await api.post('/codes', { ...formData, code: formData.code.trim() });
      setSubmitted(true);
      toast.success('🎉 Redeem code shared with the community!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add redeem code');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', code: '', category: 'Other' });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <Layout>
        <div className="add-code-success">
          <div className="success-icon">🎉</div>
          <h2 className="success-title">Code Shared Successfully!</h2>
          <p className="success-sub">
            Your code is now live on the feed. The community can copy it until it reaches
            5 copies or expires in 14 days.
          </p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              <FontAwesomeIcon icon={faGift} className="me-2" />View Feed
            </button>
            <button className="btn btn-secondary" onClick={resetForm}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />Share Another
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="add-code-page">
        {/* Header */}
        <div className="mb-4">
          <h2 className="page-title mb-1">
            <span className="title-accent-red">Share a</span>{' '}
            <span className="title-accent-yellow">Redeem Code</span>
          </h2>
          <p className="page-subtitle">Help the community by sharing your unused codes</p>
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-7">
            <div className="add-code-form-card">
              <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="add-field mb-4">
                  <label className="add-label" htmlFor="code-title">
                    <FontAwesomeIcon icon={faTag} className="me-2 label-icon" />
                    Code Title <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="code-title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder='e.g. "Zomato ₹50 Off on First Order"'
                    required
                    maxLength={80}
                  />
                  <div className="field-hint">
                    <span>{formData.title.length}/80 characters</span>
                  </div>
                </div>

                {/* Category */}
                <div className="add-field mb-4">
                  <label className="add-label" htmlFor="code-category">
                    <FontAwesomeIcon icon={faGift} className="me-2 label-icon" />
                    Category <span className="required-star">*</span>
                  </label>
                  <div className="category-select-grid">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        className={`category-select-btn ${formData.category === cat ? 'active' : ''}`}
                        onClick={() => setFormData({ ...formData, category: cat })}
                        id={`cat-${cat.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                      >
                        <span className="cat-btn-emoji">{CATEGORY_ICONS[cat] || '🎁'}</span>
                        <span className="cat-btn-label">{cat}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="add-field mb-4">
                  <label className="add-label" htmlFor="code-description">
                    <FontAwesomeIcon icon={faAlignLeft} className="me-2 label-icon" />
                    Description <span className="optional-tag">(optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="code-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="e.g. Get ₹50 off on orders above ₹199. Valid for new users only."
                    rows={3}
                    maxLength={200}
                  />
                  <div className="field-hint">
                    <span>{formData.description.length}/200 characters</span>
                  </div>
                </div>

                {/* Code */}
                <div className="add-field mb-4">
                  <label className="add-label" htmlFor="code-value">
                    <FontAwesomeIcon icon={faGift} className="me-2 label-icon" />
                    Redeem Code <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control code-input"
                    id="code-value"
                    name="code"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="PROMO2024"
                    required
                    style={{ fontFamily: 'monospace', letterSpacing: '0.1em', fontSize: '1.1rem' }}
                  />
                  <div className="field-hint">The actual code that users will copy and use</div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Sharing…</>
                    ) : (
                      <><FontAwesomeIcon icon={faPlus} className="me-2" />Share Code with Community</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar info */}
          <div className="col-lg-5">
            {/* Live Preview */}
            <div className="add-code-preview-card mb-4">
              <div className="preview-header">
                <FontAwesomeIcon icon={faCheckCircle} className="me-2" style={{ color: '#3fb950' }} />
                Live Preview
              </div>
              <div className="preview-body">
                <div className="preview-title">
                  {formData.title || <span className="preview-placeholder">Your title here…</span>}
                </div>
                {formData.category && (
                  <div className="preview-category">
                    {CATEGORY_ICONS[formData.category]} {formData.category}
                  </div>
                )}
                {formData.description && (
                  <div className="preview-description">{formData.description}</div>
                )}
                <div className="preview-code">
                  {formData.code || <span className="preview-placeholder">CODE HERE</span>}
                </div>
                <div className="preview-meta">0 copies · Just now</div>
              </div>
            </div>

            {/* Tip */}
            <div className="add-code-tip-card mb-4">
              <div className="tip-header">
                <FontAwesomeIcon icon={faLightbulb} className="me-2" />Tip
              </div>
              <p className="tip-body">{currentTip}</p>
            </div>

            {/* Rules */}
            <div className="add-code-rules-card">
              <div className="rules-header">
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />How It Works
              </div>
              <ul className="rules-list">
                <li>Your code is visible in the feed immediately after posting</li>
                <li>It stays active for <strong>14 days</strong></li>
                <li>After <strong>5 copies</strong>, it moves to the archive automatically</li>
                <li>Rapid copying is detected and violators are suspended</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCode;