import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import CodeCard from '../components/CodeCard';
import { toast } from 'react-toastify';

const Home = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await axios.get('/api/codes');
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

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Redeem Codes</h2>
        <Link to="/add-code" className="btn btn-primary">
          <i className="fas fa-plus me-2"></i>Add New Code
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading redeem codes...</p>
        </div>
      ) : codes.length > 0 ? (
        <div className="row">
          {codes.map((code) => (
            <div className="col-md-6 col-lg-4 mb-4" key={code._id}>
              <CodeCard code={code} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="fas fa-gift fa-5x text-muted mb-3"></i>
          <h4 className="text-muted">No redeem codes available</h4>
          <p className="text-muted">Be the first to add a redeem code!</p>
          <Link to="/add-code" className="btn btn-primary">
            <i className="fas fa-plus me-2"></i>Add Redeem Code
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default Home;