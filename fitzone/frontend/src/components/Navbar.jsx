import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initiales = user ? (user.prenom[0] + user.nom[0]).toUpperCase() : 'FZ';

  return (
    <>
      <nav className="fz-navbar">
        <div className="fz-navbar-left">
          <NavLink to="/" className="brand" onClick={() => setIsOpen(false)}>
            <svg className="brand-logo-icon" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 15 L85 15 L70 35 L35 35 Z" fill="currentColor" />
              <path d="M15 45 L65 45 L50 65 L20 65 Z" fill="currentColor" />
            </svg>
            <span className="brand-text">FiT<span>zone</span></span>
          </NavLink>
        </div>

        <div className="fz-navbar-center">
          {user && (
            <div className="fz-nav-links-wrapper">
              <NavLink to="/dashboard" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
                <i className="bi bi-grid"></i>Dashboard
              </NavLink>
              <NavLink to="/cours" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
                <i className="bi bi-calendar-week"></i>Cours
              </NavLink>
              <NavLink to="/musculation" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
                <i className="bi bi-lightning"></i>Muscles
              </NavLink>
              <NavLink to={isAdmin() ? "/admin/paiements" : "/paiements"} className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
                <i className="bi bi-credit-card"></i>Paiements
              </NavLink>
              {isAdmin() && (
                <NavLink to="/admin" end className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')}>
                  <i className="bi bi-shield-lock"></i>Admin
                </NavLink>
              )}
            </div>
          )}
        </div>

        <div className="fz-navbar-right">
          {user ? (
            <div className="fz-nav-user">
              <div className="fz-avatar">{initiales}</div>
              <span className="fz-username">{user.prenom}</span>
              {isAdmin() && <span className="fz-badge admin">Admin</span>}
              <button className="fz-nav-link logout-btn" onClick={handleLogout} title="Déconnexion">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="fz-btn primary pill sm">Connexion</NavLink>
          )}
        </div>

        {/* Mobile toggle button */}
        <button className="fz-nav-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <i className={`bi bi-${isOpen ? 'x-lg' : 'list'}`}></i>
        </button>
      </nav>

      {/* Mobile Drawer menu */}
      <div className={`fz-nav-mobile-menu ${isOpen ? 'active' : ''}`}>
        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')} onClick={() => setIsOpen(false)}>
              <i className="bi bi-grid me-2"></i>Dashboard
            </NavLink>
            <NavLink to="/cours" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')} onClick={() => setIsOpen(false)}>
              <i className="bi bi-calendar-week me-2"></i>Cours
            </NavLink>
            <NavLink to="/musculation" className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')} onClick={() => setIsOpen(false)}>
              <i className="bi bi-lightning me-2"></i>Muscles
            </NavLink>
            <NavLink to={isAdmin() ? "/admin/paiements" : "/paiements"} className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')} onClick={() => setIsOpen(false)}>
              <i className="bi bi-credit-card me-2"></i>Paiements
            </NavLink>
            {isAdmin() && (
              <NavLink to="/admin" end className={({ isActive }) => 'fz-nav-link' + (isActive ? ' active' : '')} onClick={() => setIsOpen(false)}>
                <i className="bi bi-shield-lock me-2"></i>Admin
              </NavLink>
            )}

            <div className="fz-nav-user">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div className="fz-avatar">{initiales}</div>
                <span className="fz-username">{user.prenom} {user.nom}</span>
              </div>
              {isAdmin() && <div className="mb-2"><span className="fz-badge admin">Admin</span></div>}
              <button className="fz-btn danger w-100" onClick={() => { handleLogout(); setIsOpen(false); }}>
                <i className="bi bi-box-arrow-right"></i> Déconnexion
              </button>
            </div>
          </>
        ) : (
          <NavLink to="/login" className="fz-btn primary pill w-100 text-center justify-content-center" onClick={() => setIsOpen(false)}>
            Connexion
          </NavLink>
        )}
      </div>
    </>
  );
}
