import React, { useState, useCallback } from 'react';

// ─── Spinner ────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="fz-spinner">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
}

// ─── Toast ──────────────────────────────────────────────────
let _addToast = null;
export function useToast() {
  const show = useCallback((msg, type = 'info') => {
    if (_addToast) _addToast(msg, type);
  }, []);
  return { show };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  _addToast = (msg, type) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  return (
    <div className="fz-toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`fz-toast ${t.type}`}>
          {t.type === 'success' && <i className="bi bi-check-circle me-2" style={{color:'#27ae60'}}></i>}
          {t.type === 'error' && <i className="bi bi-x-circle me-2" style={{color:'#e74c3c'}}></i>}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── ConfirmDialog ──────────────────────────────────────────
export function ConfirmDialog({ show, title, message, onConfirm, onCancel }) {
  if (!show) return null;
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.7)',zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'var(--surface)',border:'0.5px solid var(--border-light)',borderRadius:12,padding:'28px 32px',maxWidth:400,width:'90%'}}>
        <h6 style={{fontFamily:'var(--font-heading)',fontSize:18,marginBottom:8}}>{title}</h6>
        <p style={{fontSize:13,color:'var(--text-muted)',marginBottom:24}}>{message}</p>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button className="fz-btn secondary" onClick={onCancel}>Annuler</button>
          <button className="fz-btn danger" onClick={onConfirm}>Confirmer</button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────
export function Modal({ show, title, children, onClose, size = '' }) {
  if (!show) return null;
  const w = size === 'lg' ? 700 : size === 'xl' ? 900 : 500;
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,.75)',zIndex:8000,display:'flex',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{background:'var(--surface)',border:'0.5px solid var(--border-light)',borderRadius:14,width:'100%',maxWidth:w,maxHeight:'90vh',overflow:'auto'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 24px',borderBottom:'1px solid var(--border)'}}>
          <h6 style={{margin:0,fontFamily:'var(--font-heading)',fontSize:18}}>{title}</h6>
          <button className="fz-btn ghost sm" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <div style={{padding:24}}>{children}</div>
      </div>
    </div>
  );
}

// ─── Page Header ────────────────────────────────────────────
export function PageHeader({ eyebrow, title, accent, children }) {
  return (
    <div className="page-header d-flex align-items-center justify-content-between">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title} {accent && <span>{accent}</span>}</h1>
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
