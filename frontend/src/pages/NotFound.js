import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <i className="fas fa-exclamation-triangle fa-5x text-warning mb-4"></i>
        <h1 className="display-4">404</h1>
        <h2>Page Not Found</h2>
        <p className="lead">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          <i className="fas fa-home me-2"></i>Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;