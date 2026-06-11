import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', telephone:'', password:'', password_confirmation:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      if (tab === 'login') {
        const user = await login(form.email, form.password);
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        if (form.password !== form.password_confirmation) { setError('Les mots de passe ne correspondent pas'); setLoading(false); return; }
        await register(form);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">FIT<span>ZONE</span></div>
        <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:28}}>Accédez à votre espace membre</p>

        <div style={{display:'flex',gap:8,marginBottom:24}}>
          {['login','register'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{flex:1,padding:'8px',borderRadius:8,border:'0.5px solid var(--border-light)',
                background: tab===t ? 'var(--red)' : 'var(--surface2)',
                color: tab===t ? '#fff' : 'var(--text-muted)',
                fontFamily:'var(--font)',fontSize:12,fontWeight:600,cursor:'pointer',
                textTransform:'uppercase',letterSpacing:'.05em'}}>
              {t === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{background:'rgba(192,57,43,.15)',border:'0.5px solid var(--red)',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#e74c3c',marginBottom:16}}>
            <i className="bi bi-exclamation-triangle me-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tab === 'register' && (
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
              <div>
                <label className="fz-label">Prénom</label>
                <input className="fz-input" value={form.prenom} onChange={e=>set('prenom',e.target.value)} placeholder="Mohamed" required />
              </div>
              <div>
                <label className="fz-label">Nom</label>
                <input className="fz-input" value={form.nom} onChange={e=>set('nom',e.target.value)} placeholder="Amine" required />
              </div>
            </div>
          )}

          <div style={{marginBottom:12}}>
            <label className="fz-label">Email</label>
            <input className="fz-input" type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="vous@email.com" required />
          </div>

          {tab === 'register' && (
            <div style={{marginBottom:12}}>
              <label className="fz-label">Téléphone</label>
              <input className="fz-input" value={form.telephone} onChange={e=>set('telephone',e.target.value)} placeholder="+212 6xx xxx xxx" />
            </div>
          )}

          <div style={{marginBottom:12}}>
            <label className="fz-label">Mot de passe</label>
            <input className="fz-input" type="password" value={form.password} onChange={e=>set('password',e.target.value)} placeholder="••••••••" required />
          </div>

          {tab === 'register' && (
            <div style={{marginBottom:16}}>
              <label className="fz-label">Confirmer le mot de passe</label>
              <input className="fz-input" type="password" value={form.password_confirmation} onChange={e=>set('password_confirmation',e.target.value)} placeholder="••••••••" required />
            </div>
          )}

          <button className="fz-btn primary" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8,padding:'12px'}}>
            {loading ? <span className="spinner-border spinner-border-sm"></span> : (tab === 'login' ? 'Se connecter' : 'Créer mon compte')}
          </button>
        </form>

        {tab === 'login' && (
          <p style={{fontSize:12,color:'var(--text-dim)',textAlign:'center',marginTop:16}}>
            Compte démo admin : <strong style={{color:'var(--text-muted)'}}>admin@fitzone.ma</strong> / admin123
          </p>
        )}
      </div>
    </div>
  );
}
