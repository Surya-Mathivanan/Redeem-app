import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendar,
  faCopy,
  faCheck,
  faEyeSlash,
  faGift,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';

const CodeCard = ({ code, onCopySuccess }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [copyCount, setCopyCount] = useState(code.copyCount);
  const [hasCopied, setHasCopied] = useState(code.hasCopied);
  const { checkSuspension } = useAuth();

  const handleCopy = async () => {
    try {
      setIsCopying(true);
      
      const isSuspended = await checkSuspension();
      if (isSuspended) {
        setIsCopying(false);
        return;
      }

      const response = await api.post(`/codes/${code._id}/copy`);
      
      navigator.clipboard.writeText(code.code);
      
      setIsBlurred(false);
      setHasCopied(true);
      setCopyCount(response.data.copyCount);
      
      toast.success('Code copied to clipboard!');
      
      if (onCopySuccess) {
        onCopySuccess(code._id);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to copy code';
      toast.error(message);
    } finally {
      setIsCopying(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffSeconds < 60) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="code-card-inner">
      <div className="code-card-header">
        <div className="d-flex align-items-center">
          <FontAwesomeIcon icon={faGift} className="code-icon me-2" />
          <h5 className="code-title">{code.title}</h5>
        </div>
        <span className="copy-badge">
          <FontAwesomeIcon icon={faCopy} className="me-1" />
          {copyCount}
        </span>
      </div>
      
      <div className="code-content">
        <div className="code-display-container">
          <div className={`code-display ${isBlurred ? 'blurred' : ''}`}>
            {code.code}
          </div>
          {isBlurred && (
            <div className="code-overlay">
              <div className="overlay-content">
                <FontAwesomeIcon icon={faEyeSlash} className="overlay-icon" />
                <span>Click copy to reveal</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="code-meta">
          <div className="meta-item">
            <FontAwesomeIcon icon={faUser} className="meta-icon" />
            <span className="meta-text">{code.user.name}</span>
          </div>
          <div className="meta-item">
            <FontAwesomeIcon icon={faClock} className="meta-icon" />
            <span className="meta-text">{formatDate(code.createdAt)}</span>
          </div>
        </div>
      </div>
      
      <div className="code-card-footer">
        <button
          className={`copy-btn ${hasCopied ? 'copied' : ''} ${isCopying ? 'loading' : ''}`}
          onClick={handleCopy}
          disabled={hasCopied || isCopying}
        >
          {isCopying ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Copying...
            </>
          ) : hasCopied ? (
            <>
              <FontAwesomeIcon icon={faCheck} className="me-2" />
              Copied!
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCopy} className="me-2" />
              Copy Code
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CodeCard;