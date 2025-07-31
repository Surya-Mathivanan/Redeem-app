import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../index.css';
import {
  faHome,
  faUser,
  faPlus,
  faChartBar,
  faArchive,
  faSignOutAlt,
  faGift,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // If user is not logged in, don't render the layout
  if (!user) {
    return <>{children}</>;
  }

  const navigationItems = [
    { path: '/', icon: faHome, label: 'Home' },
    { path: '/account', icon: faUser, label: 'Account' },
    { path: '/add-code', icon: faPlus, label: 'Add Code' },
    { path: '/dashboard', icon: faChartBar, label: 'Dashboard' },
    { path: '/archive', icon: faArchive, label: 'Archive' },
  ];

  return (
    <div className="app-container">
      {/* Mobile Header */}
      <div className="mobile-header d-md-none">
        <div className="d-flex align-items-center justify-content-between p-3 bg-dark">
          <h4 className="text-white mb-0">
            <FontAwesomeIcon icon={faGift} className="me-2" />
            <span style={{ color: '#ff6b6b' }}>Redeem</span>
            <span style={{ color: '#ffd93d' }}>Hub</span>
          </h4>
          <button
            className="btn btn-outline-light border-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-content">
          <div className="sidebar-header d-none d-md-block">
            <h4 className="mb-4">
              <FontAwesomeIcon icon={faGift} className="me-2" />
              <span style={{ color: '#ff6b6b' }}>Redeem</span>
              <span style={{ color: '#ffd93d' }}>Hub</span>
            </h4>
          </div>

          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FontAwesomeIcon icon={item.icon} className="me-3" />
                {item.label}
              </Link>
            ))}

            <button
              className="sidebar-nav-item logout-btn"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-3" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay d-md-none"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;