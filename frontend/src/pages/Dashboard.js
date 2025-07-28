import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCopies: 0,
    addedCodes: 0
  });
  const [loading, setLoading] = useState(true);
  // We might need user data in the future
  useAuth(); // Keep the auth context without extracting unused variables

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/codes/stats');
        setStats(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <Layout>
      <h2 className="mb-4">Dashboard</h2>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-copy fa-3x text-primary mb-3"></i>
                  <h3 className="card-title">{stats.totalCopies}</h3>
                  <p className="card-text text-muted">Total Codes Copied</p>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <i className="fas fa-plus-circle fa-3x text-success mb-3"></i>
                  <h3 className="card-title">{stats.addedCodes}</h3>
                  <p className="card-text text-muted">Codes Added by You</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="fas fa-info-circle me-2"></i>Your Activity Summary
                  </h5>
                  <p className="card-text">
                    You have copied <strong>{stats.totalCopies}</strong> redeem codes and contributed 
                    <strong> {stats.addedCodes}</strong> codes to the community.
                  </p>
                  {stats.totalCopies === 0 && stats.addedCodes === 0 && (
                    <div className="alert alert-info">
                      <i className="fas fa-lightbulb me-2"></i>
                      Get started by adding your first redeem code or copying codes from other users!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Dashboard;