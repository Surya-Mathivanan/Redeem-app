import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';

const Archive = () => {
  const [archivedCodes, setArchivedCodes] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      await api.put(`/codes/${id}/unarchive`);
      setArchivedCodes((prev) => prev.filter((code) => code._id !== id));
      toast.success('Code unarchived successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unarchive code');
    }
  };

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Archived Codes</h2>
        <span className="badge bg-secondary fs-6">{archivedCodes.length} Archived Codes</span>
      </div>

      <div className="alert alert-info">
        <i className="fas fa-info-circle me-2"></i>
        This page shows codes that are no longer active – either expired (older than 7 days) or exhausted (5 or more copies).
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading archived codes...</p>
        </div>
      ) : archivedCodes.length > 0 ? (
        <div className="row">
          {archivedCodes.map((code) => (
            <div className="col-md-6 col-lg-4 mb-4" key={code._id}>
              <div className="card h-100 border-0 shadow-sm" style={{ opacity: 0.7 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title text-muted">{code.title}</h5>
                    <span className="badge bg-secondary">Archived</span>
                  </div>
                  <div className="code-display mb-3 p-2 bg-light rounded">{code.code}</div>
                  <p className="card-text">
                    <small className="text-muted">
                      <i className="fas fa-user me-1"></i>Added by: {code.user.name}<br />
                      <i className="fas fa-calendar me-1"></i>Date: {new Date(code.createdAt).toLocaleString()}
                    </small>
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="badge bg-secondary">
                      <i className="fas fa-copy me-1"></i>Copies: {code.copyCount}
                    </span>
                    {code.user._id === user._id && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleUnarchive(code._id)}
                      >
                        <i className="fas fa-box-open me-1"></i>Unarchive
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-archive fa-5x text-muted mb-3"></i>
          <h4 className="text-muted">No archived codes</h4>
          <p className="text-muted">Codes will appear here when they expire or reach the copy limit.</p>
          <Link to="/" className="btn btn-primary">
            <i className="fas fa-home me-2"></i>Back to Home
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Archive;
