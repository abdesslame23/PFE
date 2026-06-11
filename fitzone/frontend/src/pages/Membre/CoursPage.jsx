import React, { useEffect, useState } from 'react';
import { coursService } from '../../services/api';
import { Spinner, PageHeader } from '../../components/UI';
import { useToast } from '../../components/UI';

const TYPE_ICONS = { 
  boxe:{icon:'/icons/kickboxing.png',label:'Boxe'}, 
  mma:{icon:'/icons/Lock Neck.png',label:'MMA'}, 
  kickboxing:{icon:'/icons/Kickboxing (1).png',label:'Kickboxing'}, 
  judo:{icon:'/icons/icons8-kimono-50.png',label:'Judo'}, 
  jjb:{icon:'/icons/jiu-jitsu.png',label:'JJB'}, 
  autre:{icon:'💪',label:'Autre'} 
};
const TYPES = ['tous','boxe','mma','kickboxing','judo','jjb'];

const IconDisplay = ({type}) => {
  const item = TYPE_ICONS[type];
  if (item.icon.startsWith('/')) {
    return <img src={item.icon} alt={type} style={{width:16,height:16,objectFit:'contain',display:'inline-block',marginRight:4}} />;
  }
  return <span>{item.icon}</span>;
};

export default function CoursPage() {
  const [cours, setCours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('tous');
  const { show } = useToast();

  const load = () => {
    setLoading(true);
    const params = filter !== 'tous' ? { type: filter } : {};
    coursService.getAll(params).then(r => setCours(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const inscrire = async (id) => {
    try {
      await coursService.inscrire(id);
      show('Inscription confirmée !', 'success');
      load();
    } catch (e) { show(e.response?.data?.message || 'Erreur', 'error'); }
  };

  return (
    <div>
      <PageHeader eyebrow="Planning" title="Cours" accent="Collectifs" />

      <div style={{padding:'20px 28px 0',display:'flex',gap:8,flexWrap:'wrap'}}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            style={{padding:'6px 14px',borderRadius:20,border:'0.5px solid var(--border-light)',
              background: filter===t ? 'var(--red)' : 'var(--surface2)',
              color: filter===t ? '#fff' : 'var(--text-muted)',
              fontFamily:'var(--font)',fontSize:11,fontWeight:600,cursor:'pointer',
              textTransform:'uppercase',letterSpacing:'.05em',display:'flex',alignItems:'center',gap:6}}>
            {t === 'tous' ? 'Tous' : <><IconDisplay type={t} /> {TYPE_ICONS[t].label}</>}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,padding:'20px 28px'}}>
          {cours.length === 0 && <p style={{color:'var(--text-muted)',gridColumn:'1/-1'}}>Aucun cours disponible.</p>}
          {cours.map(c => {
            const pct = Math.round((c.places_reservees / c.places_max) * 100);
            const complet = c.places_disponibles === 0;
            const iconValue = TYPE_ICONS[c.type]?.icon || '💪';
            const isImage = typeof iconValue === 'string' && iconValue.startsWith('/');
            return (
              <div key={c.id} className="fz-card" style={{overflow:'hidden'}}>
                <div style={{background:'var(--red)',borderBottom:'0.5px solid var(--border)',padding:'14px 16px',display:'flex',alignItems:'center',gap:10}}>
                  {isImage ? (
                    <img src={iconValue} alt={c.type} style={{width:24,height:24,objectFit:'contain'}} />
                  ) : (
                    <span style={{fontSize:24}}>{iconValue}</span>
                  )}
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:'#fff'}}>{c.titre}</div>
                    <div style={{fontSize:11,color:'#ddd'}}>{c.coach}</div>
                  </div>
                  <span className="fz-badge type">{c.type.toUpperCase()}</span>
                </div>
                <div style={{padding:'14px 16px'}}>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:5}}><i className="bi bi-calendar3 me-2"></i>{new Date(c.date).toLocaleDateString('fr-MA',{weekday:'long',day:'numeric',month:'long'})}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:5}}><i className="bi bi-clock me-2"></i>{c.heure_debut?.slice(0,5)} – {c.heure_fin?.slice(0,5)}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:5}}><i className="bi bi-building me-2"></i>{c.salle?.nom}</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:10}}><i className="bi bi-bar-chart me-2"></i>{c.niveau?.charAt(0).toUpperCase() + c.niveau?.slice(1)}</div>
                  {c.description && <p style={{fontSize:11,color:'var(--text-dim)',marginBottom:12}}>{c.description}</p>}

                  <div className="cours-places-bar">
                    <div className={`cours-places-fill ${complet ? 'danger' : pct < 60 ? 'ok' : ''}`} style={{width:`${pct}%`}}></div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-dim)',marginBottom:14}}>
                    <span>{c.places_reservees}/{c.places_max} inscrits</span>
                    <span style={{color: complet ? 'var(--red-light)' : 'var(--green)'}}>{complet ? '🔴 Complet' : `${c.places_disponibles} places dispo`}</span>
                  </div>

                  <button className={`fz-btn ${complet ? 'secondary' : 'primary'} sm`} disabled={complet} onClick={() => inscrire(c.id)} style={{width:'100%',justifyContent:'center'}}>
                    {complet ? 'Complet' : "S'inscrire"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
