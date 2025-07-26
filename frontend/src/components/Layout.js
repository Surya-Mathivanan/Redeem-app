import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faPlus,
  faChartBar,
  faArchive,
  faSignOutAlt,
  faGift
} from '@fortawesome/free-solid-svg-icons';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If user is not logged in, don't render the layout
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 sidebar p-0">
          <div className="p-4">
            <h4 style={{ marginBottom: '20px' }}>
              <FontAwesomeIcon
                icon={faGift}
                style={{ marginLeft: '65px', color: '#000000', fontSize: '24px' }}
              />
            </h4>
            <nav className="nav flex-column">
              <Link
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                to="/"
              >
                <FontAwesomeIcon icon={faHome} className="me-2" />Home
              </Link>
              <Link
                className={`nav-link ${location.pathname === '/account' ? 'active' : ''}`}
                to="/account"
              >
                <FontAwesomeIcon icon={faUser} className="me-2" />Account
              </Link>
              <Link
                className={`nav-link ${location.pathname === '/add-code' ? 'active' : ''}`}
                to="/add-code"
              >
                <FontAwesomeIcon icon={faPlus} className="me-2" />Add Redeem Code
              </Link>
              <Link
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                to="/dashboard"
              >
                <FontAwesomeIcon icon={faChartBar} className="me-2" />Dashboard
              </Link>
              <Link
                className={`nav-link ${location.pathname === '/archive' ? 'active' : ''}`}
                to="/archive"
              >
                <FontAwesomeIcon icon={faArchive} className="me-2" />Archive
              </Link>
              <a className="nav-link" href="#" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />Logout
              </a>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 main-content p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;