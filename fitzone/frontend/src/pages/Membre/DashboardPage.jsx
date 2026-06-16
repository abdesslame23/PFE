import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coursService, paiementService, authService } from '../../services/api';
import { Spinner, PageHeader, Modal } from '../../components/UI';
import api from '../../services/api';

const TYPE_ICONS = { boxe:'', mma:'', kickboxing:'', judo:'', jjb:'', autre:'' };
const MOIS = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData]           = useState(null);
  const [cours, setCours]         = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [showCode, setShowCode]   = useState(false);
  const [codeData, setCodeData]   = useState(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [codeError, setCodeError] = useState(null);

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

  const ouvrirCode = async () => {
    setShowCode(true);
    setLoadingCode(true);
    setCodeError(null);
    try {
      const res = await api.get('/pointage/mon-code');
      setCodeData(res.data);
    } catch (e) {
      console.error(e);
      setCodeData(null);
      setCodeError(e.response?.data?.message || 'Erreur lors de la récupération du code');
    } finally {
      setLoadingCode(false);
    }
  };

  if (loading) return <Spinner />;

  const abonnement    = data?.abonnement_actif;
  const nbVisites     = data?.nb_visites || 0;
  const nbImpayes     = paiements.filter(p => p.statut === 'impaye').length;
  const prochainCours = cours[0];

  return (
    <div>
      <PageHeader eyebrow="Bienvenue" title={`${user?.prenom}`} accent={user?.nom}>
        <button className="fz-btn primary" onClick={ouvrirCode} style={{gap:8,padding:'10px 20px'}}>
          <i className="bi bi-123" style={{fontSize:18}}></i>
          Mon code d'entrée
        </button>
      </PageHeader>

      {/* Stats */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,padding:'24px 28px 0'}}>
        <div className="fz-stat">
          <div className="fz-stat-label"><i className="bi bi-door-open me-1"></i>Total visites</div>
          <div className="fz-stat-value">{nbVisites}</div>
          <div className="fz-stat-sub">Depuis inscription</div>
        </div>
        <div className={`fz-stat ${abonnement ? 'green' : 'orange'}`}>
          <div className="fz-stat-label"><i className="bi bi-patch-check me-1"></i>Abonnement</div>
          <div className="fz-stat-value" style={{fontSize:16,color:abonnement?'var(--green)':'var(--orange)'}}>
            {abonnement ? 'ACTIF' : 'INACTIF'}
          </div>
          <div className="fz-stat-sub">{abonnement ? `Expire le ${new Date(abonnement.date_fin).toLocaleDateString('fr-MA')}` : 'Aucun abonnement actif'}</div>
        </div>
        <div className="fz-stat blue">
          <div className="fz-stat-label"><i className="bi bi-calendar-event me-1"></i>Prochain cours</div>
          <div className="fz-stat-value" style={{fontSize:15}}>{prochainCours ? prochainCours.titre : '—'}</div>
          <div className="fz-stat-sub">{prochainCours ? `${new Date(prochainCours.date).toLocaleDateString('fr-MA')} à ${prochainCours.heure_debut?.slice(0,5)}` : 'Aucun cours à venir'}</div>
        </div>
        <div className={`fz-stat ${nbImpayes > 0 ? '' : 'green'}`}>
          <div className="fz-stat-label"><i className="bi bi-credit-card me-1"></i>Mois impayés</div>
          <div className="fz-stat-value" style={{color: nbImpayes > 0 ? 'var(--red-light)' : 'var(--green)'}}>{nbImpayes}</div>
          <div className="fz-stat-sub">{nbImpayes > 0 ? 'Paiements en attente' : 'Tout est à jour ✓'}</div>
        </div>
      </div>

      {/* Paiements */}
      <div style={{padding:'24px 28px 0'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-title"><i className="bi bi-calendar3 me-2"></i>Paiements {new Date().getFullYear()}</div>
          <button className="fz-btn ghost sm" onClick={() => navigate('/paiements')}>Voir tout <i className="bi bi-arrow-right ms-1"></i></button>
        </div>
        <div className="month-grid">
          {paiements.slice(0,8).map(p => (
            <div key={p.mois} className={`month-tile ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>
              <div className="month-name">{MOIS[p.mois-1]}</div>
              <div className="month-amount">{p.montant} DH</div>
              <span className={`fz-badge ${p.statut === 'paye' ? 'paye' : 'impaye'}`}>
                {p.statut === 'paye'
                  ? <><i className="bi bi-check-circle me-1"></i>Payé</>
                  : <><i className="bi bi-x-circle me-1"></i>Impayé</>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cours */}
      <div style={{padding:'24px 28px'}}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-title"><i className="bi bi-lightning me-2"></i>Prochains cours collectifs</div>
          <button className="fz-btn ghost sm" onClick={() => navigate('/cours')}>Voir tout <i className="bi bi-arrow-right ms-1"></i></button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>
          {cours.map(c => <CoursCard key={c.id} cours={c} />)}
        </div>
      </div>

      {/* Modal code */}
      <Modal show={showCode} title="" onClose={() => setShowCode(false)}>
        <div style={{textAlign:'center',padding:'16px 0'}}>
          <div style={{
            display:'inline-flex',alignItems:'center',justifyContent:'center',
            width:60,height:60,borderRadius:'50%',
            background:'rgba(192,57,43,.15)',border:'1px solid var(--red)',marginBottom:16
          }}>
            <i className="bi bi-123" style={{fontSize:28,color:'var(--red)'}}></i>
          </div>

          <div style={{fontFamily:'var(--font-heading)',fontSize:22,fontWeight:700,marginBottom:4}}>
            Mon code d'entrée
          </div>
          <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:28}}>
            Donnez ce code à la réception pour valider votre entrée
          </div>

          {loadingCode ? (
            <div className="spinner-border" style={{color:'var(--red)'}}></div>
          ) : codeError ? (
            <div style={{color:'var(--red)',padding:12,background:'rgba(192,57,43,.06)',borderRadius:8}}>
              {codeError}
            </div>
          ) : codeData && (
            <>
              {/* Le code bien lisible */}
              <div style={{
                background:'var(--surface2)',
                border:'2px solid var(--red)',
                borderRadius:16,padding:'24px 40px',
                marginBottom:20,display:'inline-block',
              }}>
                <div style={{
                  fontFamily:'monospace',
                  fontSize:52,
                  fontWeight:700,
                  letterSpacing:12,
                  color:'var(--text)',
                  lineHeight:1,
                }}>
                  {codeData.code}
                </div>
              </div>

              <div style={{
                background:'var(--surface2)',border:'0.5px solid var(--border)',
                borderRadius:10,padding:'10px 20px',marginBottom:16,
              }}>
                <div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:2}}>Abonné</div>
                <div style={{fontFamily:'var(--font-heading)',fontSize:17,fontWeight:700}}>{codeData.nom_complet}</div>
              </div>

              <div style={{
                background:'rgba(192,57,43,.08)',border:'0.5px solid rgba(192,57,43,.3)',
                borderRadius:8,padding:'10px 14px',
                fontSize:12,color:'var(--text-muted)',
                display:'flex',alignItems:'center',gap:8
              }}>
                <i className="bi bi-shield-lock" style={{color:'var(--red)'}}></i>
                Code personnel — ne le partagez pas
              </div>
            </>
          )}
        </div>
      </Modal>
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
        <span style={{fontSize:20}}>{TYPE_ICONS[cours.type] || ''}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600}}>{cours.titre}</div>
          <div style={{fontSize:10,color:'var(--text-muted)'}}>{cours.coach}</div>
        </div>
        <span className="fz-badge type">{cours.type.toUpperCase()}</span>
      </div>
      <div style={{padding:'12px 14px'}}>
        <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:4}}><i className="bi bi-calendar3 me-1"></i>{new Date(cours.date).toLocaleDateString('fr-MA',{weekday:'long',day:'numeric',month:'short'})}</div>
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