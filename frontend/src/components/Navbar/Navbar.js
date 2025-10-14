import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiUsers, 
  FiDollarSign, 
  FiLogOut, 
  FiUser,
  FiBook
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Sai LMS</h2>
          <span className="role-badge">{user?.role === 'admin' ? 'Admin' : 'Accountant'}</span>
        </div>

        <ul className="navbar-menu">
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard">
              <FiHome /> Dashboard
            </Link>
          </li>
          <li className={isActive('/students') ? 'active' : ''}>
            <Link to="/students">
              <FiUsers /> Students
            </Link>
          </li>
          <li className={isActive('/payments') ? 'active' : ''}>
            <Link to="/payments">
              <FiDollarSign /> Payments
            </Link>
          </li>
          {user?.role === 'admin' && (
            <li className={isActive('/courses') ? 'active' : ''}>
              <Link to="/courses">
                <FiBook /> Courses
              </Link>
            </li>
          )}
        </ul>

        <div className="navbar-user">
          <div className="user-info">
            <FiUser />
            <span>{user?.fullName}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
