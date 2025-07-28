import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { toast } from 'react-toastify';
import api from '../services/api';

const AddCode = () => {
  const [formData, setFormData] = useState({
    title: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkSuspension } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is suspended
    const isSuspended = await checkSuspension();
    if (isSuspended) {
      return;
    }
    
    setLoading(true);
    try {
      await api.post('/codes', formData);
      toast.success('Redeem code added successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add redeem code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Add Redeem Code</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive title"
                    required
                  />
                  <div className="form-text">A descriptive name for the redeem code</div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">Redeem Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Enter the redeem code"
                    required
                  />
                  <div className="form-text">Enter the actual redeem code</div>
                </div>
                
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus me-2"></i>Add Redeem Code
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCode;