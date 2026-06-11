import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursService, paiementService, authService } from '../../services/api';
import { Spinner, PageHeader } from '../../components/UI';

const TYPE_ICONS = { boxe:'🥊', mma:'🤼', kickboxing:'🦵', judo:'🥋', jjb:'🤸', autre:'💪' };
const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [cours, setCours] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authService.me(),
      coursService.getAll(),
      paiementService.recap({ annee: new Date().getFullYear() }),
    ]).then(([me, c, p]) => {
      setData(me.data);
      setCours(c.data.slice(0, 3));
      setPaiements(p.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const abonnement = data?.abonnement_actif;
  const nbVisites = data?.nb_visites || 0;
  const nbImpayes = paiements.filter(p => p.statut === 'impaye').length;
  const prochainCours = cours[0];

  return (
    <div>
      <PageHeader eyebrow="Bienvenue" title={`${user?.prenom}`} accent={user?.nom} />

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,padding:'24px 28px 0'}}>
        <div className="fz-stat">
          <div className="fz-stat-label">Visites ce mois</div>
          <div className="fz-stat-value">{nbVisites}</div>
          <div className="fz-stat-sub">Total depuis inscription</div>
        </div>
        <div className={`fz-stat ${abonnement ? 'green' : 'orange'}`}>
          <div className="fz-stat-label">Abonnement</div>
          <div className="fz-stat-value" style={{fontSize:16,color:abonnement ? 'var(--green)' : 'var(--orange)'}}>
            {abonnement ? 'ACTIF' : 'INACTIF'}
          </div>
          <div className="fz-stat-sub">{abonnement ? `Expire le ${new Date(abonnement.date_fin).toLocaleDateString('fr-MA')}` : 'Aucun abonnement actif'}</div>
        </div>
        <div className="fz-stat blue">
          <div className="fz-stat-label">Prochain cours</div>
          <div className="fz-stat-value" style={{fontSize:15}}>{prochainCours ? prochainCours.titre : '—'}</div>
          <div className="fz-stat-sub">{prochainCours ? `${new Date(prochainCours.date).toLocaleDateString('fr-MA')} à ${prochainCours.heure_debut?.slice(0,5)}` : 'Aucun cours à venir'}</div>
        </div>
        <div className={`fz-stat ${nbImpayes > 0 ? '' : 'green'}`}>
          <div className="fz-stat-label">Mois impayés</div>
          <div className="fz-stat-value" style={{color: nbImpayes > 0 ? 'var(--red-light)' : 'var(--green)'}}>{nbImpayes}</div>
          <div className="fz-stat-sub">{nbImpayes > 0 ? 'Paiements en attente' : 'Tout est à jour ✓'}</div>
        </div>
      </div>

      {/* Paiements recap */}
      <div style={{padding:'24px 28px 0'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-title">Paiements {new Date().getFullYear()}</div>
          <button className="fz-btn ghost sm" onClick={() => navigate('/paiements')}>Voir tout</button>
        </div>
        <div className="month-grid">
          {paiements.slice(0,8).map(p => (
            <div key={p.mois} className={`month-tile ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>
              <div className="month-name">{MOIS[p.mois-1]}</div>
              <div className="month-amount">{p.montant} DH</div>
              <span className={`fz-badge ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>{p.statut === 'paye' ? '✓ Payé' : '✗ Impayé'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cours */}
      <div style={{padding:'24px 28px'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-title">Prochains cours collectifs</div>
          <button className="fz-btn ghost sm" onClick={() => navigate('/cours')}>Voir tout</button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {cours.map(c => <CoursCard key={c.id} cours={c} />)}
        </div>
      </div>
    </div>
  );
}

function CoursCard({ cours }) {
  const navigate = useNavigate();
  const pct = Math.round((cours.places_reservees / cours.places_max) * 100);
  const complet = cours.places_disponibles === 0;
  return (
    <div className="fz-card hoverable p-0" onClick={() => navigate('/cours')} style={{overflow:'hidden'}}>
      <div style={{background:'var(--surface2)',borderBottom:'0.5px solid var(--border)',padding:'12px 14px',display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:20}}>{TYPE_ICONS[cours.type] || '💪'}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600}}>{cours.titre}</div>
          <div style={{fontSize:10,color:'var(--text-muted)'}}>{cours.coach}</div>
        </div>
        <span className="fz-badge type">{cours.type.toUpperCase()}</span>
      </div>
      <div style={{padding:'12px 14px'}}>
        <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:4}}><i className="bi bi-calendar me-1"></i>{new Date(cours.date).toLocaleDateString('fr-MA',{weekday:'long',day:'numeric',month:'short'})}</div>
        <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:4}}><i className="bi bi-clock me-1"></i>{cours.heure_debut?.slice(0,5)} – {cours.heure_fin?.slice(0,5)}</div>
        <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:8}}><i className="bi bi-geo-alt me-1"></i>{cours.salle?.nom}</div>
        <div className="cours-places-bar">
          <div className={`cours-places-fill ${complet ? 'danger' : pct < 60 ? 'ok' : ''}`} style={{width:`${pct}%`}}></div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--text-dim)'}}>
          <span>{cours.places_reservees}/{cours.places_max} inscrits</span>
          <span style={{color: complet ? 'var(--red-light)' : 'var(--green)'}}>{complet ? 'Complet' : `${cours.places_disponibles} places`}</span>
        </div>
      </div>
    </div>
  );
}
