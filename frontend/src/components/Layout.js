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

      {/* Custom Styles */}
      <style jsx>{`
        .app-container {
          display: flex;
          min-height: 100vh;
          background-color: #f6f8fa;
        }

        .mobile-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .sidebar {
          width: 280px;
          background-color: #ffffff;
          border-right: 1px solid #e1e4e8;
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          z-index: 1000;
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .sidebar-content {
          padding: 2rem;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .sidebar-nav {
          flex: 1;
        }

        .sidebar-nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1rem;
          margin-bottom: 0.5rem;
          text-decoration: none;
          color: #24292e;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sidebar-nav-item:hover {
          background-color: #f1f3f4;
          color: #0366d6;
        }

        .sidebar-nav-item.active {
          background-color: #e3f2fd;
          color: #0366d6;
          font-weight: 600;
        }

        .logout-btn {
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          margin-top: auto;
          color: #d73a49;
        }

        .logout-btn:hover {
          background-color: #ffeaea;
          color: #d73a49;
        }

        .main-content {
          flex: 1;
          margin-left: 280px;
          padding-top: 0;
        }

        .content-wrapper {
          padding: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          z-index: 999;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            width: 100%;
            max-width: 320px;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .main-content {
            margin-left: 0;
            padding-top: 60px;
          }

          .content-wrapper {
            padding: 1rem;
          }
        }

        /* Trendy Color Titles */
        .trendy-title-red {
          color: #ff6b6b !important;
          font-weight: 700;
        }

        .trendy-title-yellow {
          color: #ffd93d !important;
          font-weight: 700;
        }

        /* Enhanced card styling */
        .github-card {
          background: white;
          border: 1px solid #e1e4e8;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.12);
          transition: all 0.2s ease;
        }

        .github-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.12);
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Layout;