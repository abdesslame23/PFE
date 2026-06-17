import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initiales = user ? (user.prenom[0] + user.nom[0]).toUpperCase() : 'FZ';

  return (
    <nav className="fz-navbar">
      <NavLink to="/" className="brand">FIT<span>ZONE</span></NavLink>

      {user && (
        <>
          <NavLink to="/dashboard" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
            <i className="bi bi-grid me-1"></i>Dashboard
          </NavLink>
          <NavLink to="/cours" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
            <i className="bi bi-calendar-week me-1"></i>Cours
          </NavLink>
          <NavLink to="/musculation" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
            <i className="bi bi-lightning me-1"></i>Muscles
          </NavLink>
          <NavLink to={isAdmin() ? "/admin/paiements" : "/paiements"} className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
            <i className="bi bi-credit-card me-1"></i>Paiements
          </NavLink>
          {isAdmin() && (
            <NavLink to="/admin" end className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
              <i className="bi bi-shield-lock me-1"></i>Admin
            </NavLink>
          )}
        </>
      )}

      <div className="fz-nav-spacer" />

      {user ? (
        <div className="fz-nav-user">
          <div className="fz-avatar">{initiales}</div>
          <span>{user.prenom}</span>
          {isAdmin() && <span className="fz-badge admin">Admin</span>}
          <button className="fz-nav-link" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      ) : (
        <NavLink to="/login" className="fz-btn primary sm">Connexion</NavLink>
      )}
    </nav>
  );
}
