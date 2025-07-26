import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faCalendar,
  faCopy,
  faCheck,
  faEyeSlash
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
      
      // Check if user is suspended before proceeding
      const isSuspended = await checkSuspension();
      if (isSuspended) {
        setIsCopying(false);
        return;
      }

      // Call API to record the copy
      const response = await axios.post(`/api/codes/${code._id}/copy`);
      
      // Copy to clipboard
      navigator.clipboard.writeText(code.code);
      
      // Update state
      setIsBlurred(false);
      setHasCopied(true);
      setCopyCount(response.data.copyCount);
      
      // Notify success
      toast.success('Code copied to clipboard!');
      
      // Call parent callback if provided
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

  return (
    <div className="uiverse-card-responsive h-100">
      <div className="card-body">
        <h5 className="card-title text-primary">{code.title}</h5>
        
        {/* Code display with blur overlay */}
        <div className="position-relative">
          <div className={`code-display mb-3 ${isBlurred ? 'blurred' : ''}`}>
            {code.code}
          </div>
          {isBlurred && (
            <div className="blur-overlay">
              <small className="text-muted">
                <FontAwesomeIcon icon={faEyeSlash} className="me-1" />
                Click copy to reveal code
              </small>
            </div>
          )}
        </div>
        
        <p className="card-text">
          <small className="text-muted">
            <FontAwesomeIcon icon={faUser} className="me-1" />
            Added by: {code.user.name}<br />
            <FontAwesomeIcon icon={faCalendar} className="me-1" />
            Date: {new Date(code.createdAt).toLocaleString()}
          </small>
        </p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="badge bg-info">
            <FontAwesomeIcon icon={faCopy} className="me-1" />
            Copies: {copyCount}
          </span>
          <button
            className="btn btn-copy btn-sm"
            onClick={handleCopy}
            disabled={hasCopied || isCopying}
          >
            {isCopying ? (
              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
            ) : hasCopied ? (
              <>
                <FontAwesomeIcon icon={faCheck} className="me-1" />
                Copied
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCopy} className="me-1" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeCard;