import React, { useEffect, useState } from 'react';
import { paiementService, authService } from '../../services/api';
import { Spinner, PageHeader } from '../../components/UI';

const MOIS_NOMS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

export default function PaiementsPage() {
  const [paiements, setPaiements] = useState([]);
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const annee = new Date().getFullYear();

  useEffect(() => {
    Promise.all([
      paiementService.recap({ annee }),
      authService.me(),
    ]).then(([p, me]) => {
      setPaiements(p.data);
      setVisites(me.data.visites || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const nbPayes = paiements.filter(p => p.statut === 'paye').length;
  const nbImpayes = paiements.filter(p => p.statut === 'impaye').length;
  const totalPaye = paiements.filter(p => p.statut === 'paye').reduce((s, p) => s + parseFloat(p.montant || 0), 0);

  return (
    <div>
      <PageHeader eyebrow="Mon espace" title="Mes" accent="Paiements" />

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,padding:'24px 28px 0'}}>
        <div className="fz-stat green">
          <div className="fz-stat-label">Mois payés</div>
          <div className="fz-stat-value">{nbPayes}</div>
          <div className="fz-stat-sub">Sur {annee}</div>
        </div>
        <div className="fz-stat">
          <div className="fz-stat-label">Mois impayés</div>
          <div className="fz-stat-value" style={{color:'var(--red-light)'}}>{nbImpayes}</div>
          <div className="fz-stat-sub">Règlement requis</div>
        </div>
        <div className="fz-stat blue">
          <div className="fz-stat-label">Total réglé</div>
          <div className="fz-stat-value" style={{fontSize:20}}>{totalPaye} DH</div>
          <div className="fz-stat-sub">En {annee}</div>
        </div>
        <div className="fz-stat orange">
          <div className="fz-stat-label">Total visites</div>
          <div className="fz-stat-value">{visites.length}</div>
          <div className="fz-stat-sub">Depuis inscription</div>
        </div>
      </div>

      {/* Calendrier paiements */}
      <div style={{padding:'24px 28px 0'}}>
        <div className="section-title">Calendrier paiements {annee}</div>
        <div className="month-grid">
          {paiements.map(p => (
            <div key={p.mois} className={`month-tile ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>
              <div className="month-name">{MOIS_NOMS[p.mois - 1]}</div>
              <div className="month-amount">{p.montant} DH</div>
              <span className={`fz-badge ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>
                {p.statut === 'paye' ? '✓ Payé' : '✗ Impayé'}
              </span>
              {p.date_paiement && (
                <div style={{fontSize:9,color:'var(--text-dim)',marginTop:4}}>
                  {new Date(p.date_paiement).toLocaleDateString('fr-MA')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Historique visites */}
      <div style={{padding:'24px 28px'}}>
        <div className="section-title">Historique des visites</div>
        <div className="fz-card" style={{overflow:'hidden',padding:0}}>
          <div style={{background:'var(--surface2)',padding:'10px 16px',borderBottom:'0.5px solid var(--border)'}}>
            <div style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'.08em',color:'var(--text-muted)'}}>
              {visites.length} visite{visites.length !== 1 ? 's' : ''} enregistrée{visites.length !== 1 ? 's' : ''}
            </div>
          </div>
          {visites.length === 0 && (
            <div style={{padding:'40px',textAlign:'center',color:'var(--text-dim)',fontSize:13}}>Aucune visite enregistrée</div>
          )}
          {visites.slice(0, 20).map((v, i) => (
            <div key={v.id} style={{display:'flex',alignItems:'center',padding:'11px 16px',borderBottom: i < visites.length-1 ? '0.5px solid var(--border)' : 'none'}}>
              <div style={{width:110,fontSize:11,color:'var(--text-muted)'}}>
                {new Date(v.date_visite).toLocaleDateString('fr-MA',{day:'2-digit',month:'short',year:'numeric'})}
              </div>
              <div style={{flex:1,fontSize:12}}>
                {v.cours ? v.cours.titre : 'Entraînement libre'}
              </div>
              <span className={`fz-badge ${v.type === 'cours' ? 'type' : 'attente'}`}>
                {v.type === 'cours' ? 'Cours collectif' : 'Libre'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
