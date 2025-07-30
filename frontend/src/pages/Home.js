import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Layout from '../components/Layout';
import CodeCard from '../components/CodeCard';
import { toast } from 'react-toastify';

const Home = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await api.get('/codes');
        setCodes(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching codes:', error);
        toast.error('Failed to load redeem codes');
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const handleCodeUpdate = (updatedCodeId) => {
    setCodes(prevCodes => 
      prevCodes.map(code => 
        code._id === updatedCodeId ? { ...code, hasCopied: true } : code
      )
    );
  };

  return (
    <Layout>
      <div className="home-container">
        <div className="page-header">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="page-title">
                <span className="title-accent-red">Available</span>{' '}
                <span className="title-accent-yellow">Redeem Codes</span>
              </h1>
              <p className="page-subtitle">Discover and redeem exclusive codes</p>
            </div>
            <Link to="/add-code" className="btn btn-primary btn-lg">
              <i className="fas fa-plus me-2"></i>Add New Code
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Loading redeem codes...</p>
            </div>
          </div>
        ) : codes.length > 0 ? (
          <div className="codes-grid">
            <div className="row g-4">
              {codes.map((code) => (
                <div className="col-md-6 col-lg-4" key={code._id}>
                  <div className="code-card">
                    <CodeCard code={code} onCopySuccess={handleCodeUpdate} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <i className="fas fa-gift empty-state-icon"></i>
              <h3 className="empty-state-title">No redeem codes available</h3>
              <p className="empty-state-description">
                Be the first to share a redeem code with the community!
              </p>
              <Link to="/add-code" className="btn btn-primary btn-lg">
                <i className="fas fa-plus me-2"></i>Add Redeem Code
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;