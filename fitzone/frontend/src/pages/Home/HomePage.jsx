import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const disciplines = [
    { name: 'Boxe Anglaise', icon: '/icons/kickboxing.png', desc: 'Technique, endurance et puissance de frappe.' },
    { name: 'MMA', icon: '/icons/Lock Neck.png', desc: 'Le combat ultime mêlant debout, lutte et sol.' },
    { name: 'Kickboxing', icon: '/icons/Kickboxing (1).png', desc: 'Dynamisme, agilité et coordination des frappes.' },
    { name: 'Judo', icon: '/icons/icons8-kimono-50.png', desc: 'L\'art des projections et du contrôle de l\'adversaire.' },
    { name: 'JJB (Jiu-Jitsu Brésilien)', icon: '/icons/jiu-jitsu.png', desc: 'Maîtrise absolue du combat au sol et soumissions.' },
    { name: 'Musculation & Cardio', icon: 'energy', desc: 'Équipements de pointe pour optimiser vos performances.' },
  ];

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            DÉPASSEZ VOS <br />
            <span>LIMITES</span> CHEZ FITZONE
          </h1>
          <p className="hero-subtitle">
            Entraînez-vous dans une ambiance d'élite avec des coachs certifiés, des équipements haut de gamme et des programmes adaptés à vos objectifs.
          </p>
          <div className="hero-actions">
            <button className="fz-btn primary pill lg" onClick={handleStart}>
              {user ? 'Accéder au Dashboard' : 'Rejoindre le Club'} <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>+500</h3>
            <p>Membres Actifs</p>
          </div>
          <div className="stat-card">
            <h3>6</h3>
            <p>Disciplines de Combat</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Accès Membres</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Motivation</p>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="disciplines-section">
        <h2 className="section-main-title">NOS DISCIPLINES ELITE</h2>
        <p className="section-main-subtitle">Des entraînements de haut niveau encadrés par des experts</p>
        <div className="disciplines-grid">
          {disciplines.map((d, index) => {
            const isImage = typeof d.icon === 'string' && d.icon.startsWith('/');
            return (
              <div className="discipline-card" key={index}>
                <div className="discipline-icon-wrapper">
                  {d.icon === 'energy' ? (
                    <i className="bi bi-lightning-charge-fill" style={{ fontSize: '28px', color: 'var(--red-light)' }}></i>
                  ) : isImage ? (
                    <img src={d.icon} alt={d.name} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                  ) : (
                    <span style={{ fontSize: '28px' }}>{d.icon}</span>
                  )}
                </div>
                <h4>{d.name}</h4>
                <p>{d.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>PRÊT À FORGER VOTRE MEILLEURE VERSION ?</h2>
          <p>
            Inscrivez-vous dès aujourd'hui ou connectez-vous à votre espace personnel pour suivre vos cours, vos visites et vos paiements.
          </p>
          <button className="fz-btn primary pill lg mt-3" onClick={handleStart}>
            {user ? 'Aller sur mon Espace' : 'Se Connecter Maintenant'} <i className="bi bi-box-arrow-in-right ms-2"></i>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <p>&copy; {new Date().getFullYear()} FiTzone. Tous droits réservés. Conçu pour les athlètes.</p>
      </footer>
    </div>
  );
}
