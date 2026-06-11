import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/UI';
import LoginPage from './pages/Auth/LoginPage';
import DashboardPage from './pages/Membre/DashboardPage';
import CoursPage from './pages/Membre/CoursPage';
import MusculationPage from './pages/Membre/MusculationPage';
import PaiementsPage from './pages/Membre/PaiementsPage';
import GestionPaiementsPage from './pages/Admin/PaiementsPage';
import AdminPage from './pages/Admin/AdminPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles.css';

function PrivateRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="fz-spinner"><div className="spinner-border" style={{color:'var(--red)'}}></div></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />

        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/cours" element={<PrivateRoute><CoursPage /></PrivateRoute>} />
        <Route path="/musculation" element={<PrivateRoute><MusculationPage /></PrivateRoute>} />
        <Route path="/paiements" element={<PrivateRoute><PaiementsPage /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />
        <Route path="/admin/paiements" element={<PrivateRoute adminOnly><GestionPaiementsPage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
