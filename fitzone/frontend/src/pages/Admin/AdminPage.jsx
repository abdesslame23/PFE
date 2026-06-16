import React, { useEffect, useState } from 'react';
import { abonneService, coursService, salleService, paiementService } from '../../services/api';
import { Spinner, Modal, ConfirmDialog, PageHeader } from '../../components/UI';
import { useToast } from '../../components/UI';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function AdminPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('abonnes');

  const tabs = [
    
  { id:'pointage',  label:'Pointage',  icon:'bi-123' },  
  
  
    { id:'abonnes',   label:'Abonnés',    icon:'bi-people' },
    { id:'cours',     label:'Cours',       icon:'bi-calendar-event' },
    { id:'salles',    label:'Salles',      icon:'bi-building' },
    { id:'paiements', label:'Paiements',   icon:'bi-credit-card' },
  ];

  const handleTabChange = (tabId) => {
    if (tabId === 'paiements') {
      navigate('/admin/paiements');
      return;
    }
    setTab(tabId);
  };

  return (
    <div className="fz-layout">
      {/* Sidebar */}
      <aside className="fz-sidebar">
        <div className="fz-sidebar-title">Administration</div>
        {tabs.map(t => (
          <button key={t.id} className={`fz-sidebar-link ${tab===t.id?'active':''}`} onClick={() => handleTabChange(t.id)}>
            <i className={`bi ${t.icon}`}></i>{t.label}
          </button>
        ))}
      </aside>

      <main className="fz-main">
        {tab === 'pointage' && <PointageTab />}
        {tab === 'abonnes'   && <AbonnesTab />}
        {tab === 'cours'     && <CoursTab />}
        {tab === 'salles'    && <SallesTab />}
      </main>
    </div>
  );
}

function PointageTab() {
  const [code, setCode]               = useState('');
  const [resultat, setResultat]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [visitesDuJour, setVisitesDuJour] = useState(null);
  const [loadingJour, setLoadingJour] = useState(true);
  const { show } = useToast();

  const chargerJour = () => {
    setLoadingJour(true);
    api.get('/pointage/aujourd-hui')
      .then(r => setVisitesDuJour(r.data))
      .finally(() => setLoadingJour(false));
  };

  useEffect(() => { chargerJour(); }, []);

  const valider = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResultat(null);
    try {
      const res = await api.post('/pointage/valider', { code: code.trim() });
      setResultat({ ...res.data, success: true });
      if (!res.data.deja_pointe) {
        show(`✓ Entrée validée — ${res.data.user?.nom}`, 'success');
        chargerJour();
      } else {
        show(`⚠ ${res.data.user?.nom} déjà pointé aujourd'hui`, 'info');
      }
    } catch (e) {
      setResultat({ message: e.response?.data?.message || 'Code invalide', success: false });
      show('Code invalide', 'error');
    } finally {
      setLoading(false);
      setCode('');
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Système de" accent="Pointage" />

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,padding:'24px 28px'}}>

        {/* Colonne gauche — saisie code */}
        <div className="fz-card" style={{padding:28,textAlign:'center'}}>
          <div style={{
            width:64,height:64,borderRadius:'50%',margin:'0 auto 16px',
            background:'rgba(192,57,43,.12)',border:'2px solid var(--red)',
            display:'flex',alignItems:'center',justifyContent:'center'
          }}>
            <i className="bi bi-123" style={{fontSize:28,color:'var(--red)'}}></i>
          </div>

          <div style={{fontFamily:'var(--font-heading)',fontSize:20,fontWeight:700,marginBottom:4}}>
            Valider une entrée
          </div>
          <div style={{fontSize:12,color:'var(--text-muted)',marginBottom:24}}>
            Tapez le code à 6 chiffres de l'abonné
          </div>

          <input
            className="fz-input"
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g,'').slice(0,6))}
            onKeyDown={e => e.key === 'Enter' && valider()}
            placeholder="_ _ _ _ _ _"
            maxLength={6}
            style={{
              fontSize:32,fontWeight:700,letterSpacing:12,
              textAlign:'center',marginBottom:16,fontFamily:'monospace',
              padding:'14px'
            }}
            autoFocus
          />

          <button
            className="fz-btn primary"
            onClick={valider}
            disabled={loading || code.length !== 6}
            style={{width:'100%',justifyContent:'center',padding:'12px',fontSize:13}}
          >
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2"></span>Vérification...</>
              : <><i className="bi bi-check2-circle me-2"></i>Valider l'entrée</>
            }
          </button>

          {/* Résultat */}
          {resultat && (
            <div style={{
              marginTop:20,borderRadius:12,padding:20,
              background: resultat.success && !resultat.deja_pointe
                ? 'rgba(39,174,96,.1)'
                : resultat.deja_pointe
                ? 'rgba(230,126,34,.1)'
                : 'rgba(192,57,43,.1)',
              border: `1px solid ${
                resultat.success && !resultat.deja_pointe
                  ? 'var(--green)'
                  : resultat.deja_pointe ? 'var(--orange)' : 'var(--red)'
              }`,
            }}>
              {resultat.success ? (
                <>
                  <i className={`bi ${resultat.deja_pointe ? 'bi-exclamation-triangle' : 'bi-check-circle-fill'}`}
                    style={{fontSize:32,color:resultat.deja_pointe?'var(--orange)':'var(--green)',display:'block',marginBottom:8}}></i>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:18,fontWeight:700,marginBottom:4,
                    color:resultat.deja_pointe?'var(--orange)':'var(--green)'}}>
                    {resultat.deja_pointe ? 'Déjà pointé aujourd\'hui' : 'Entrée validée !'}
                  </div>
                  <div style={{fontSize:15,fontWeight:600}}>{resultat.user?.nom}</div>
                  {!resultat.deja_pointe && (
                    <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>
                      <i className="bi bi-door-open me-1"></i>
                      {resultat.user?.nb_visites} visite{resultat.user?.nb_visites > 1 ? 's' : ''} au total
                    </div>
                  )}
                </>
              ) : (
                <>
                  <i className="bi bi-x-circle-fill" style={{fontSize:32,color:'var(--red)',display:'block',marginBottom:8}}></i>
                  <div style={{fontFamily:'var(--font-heading)',fontSize:18,fontWeight:700,color:'var(--red)'}}>Code invalide</div>
                  <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>{resultat.message}</div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Colonne droite — entrées du jour */}
        <div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
            <div className="section-title" style={{margin:0}}>
              <i className="bi bi-calendar-check me-2"></i>Entrées du jour
            </div>
            <button className="fz-btn ghost sm" onClick={chargerJour}>
              <i className="bi bi-arrow-clockwise me-1"></i>Actualiser
            </button>
          </div>

          {visitesDuJour && (
            <div style={{
              background:'var(--surface)',border:'0.5px solid var(--border)',
              borderRadius:10,padding:'14px 18px',marginBottom:14,
              display:'flex',alignItems:'center',gap:14
            }}>
              <div style={{
                width:48,height:48,borderRadius:10,
                background:'rgba(192,57,43,.12)',border:'1px solid var(--red)',
                display:'flex',alignItems:'center',justifyContent:'center'
              }}>
                <i className="bi bi-people" style={{fontSize:22,color:'var(--red)'}}></i>
              </div>
              <div>
                <div style={{fontSize:28,fontFamily:'var(--font-heading)',fontWeight:700,lineHeight:1}}>
                  {visitesDuJour.total}
                </div>
                <div style={{fontSize:11,color:'var(--text-muted)'}}>
                  présence{visitesDuJour.total > 1 ? 's' : ''} — {visitesDuJour.date}
                </div>
              </div>
            </div>
          )}

          <div className="fz-card" style={{overflow:'hidden',padding:0,maxHeight:400,overflowY:'auto'}}>
            {loadingJour ? <Spinner /> : (
              visitesDuJour?.visites?.length === 0 ? (
                <div style={{padding:32,textAlign:'center',color:'var(--text-dim)'}}>
                  <i className="bi bi-inbox" style={{fontSize:32,display:'block',marginBottom:8}}></i>
                  Aucune entrée aujourd'hui
                </div>
              ) : (
                <table className="fz-table">
                  <thead>
                    <tr>
                      <th><i className="bi bi-clock me-1"></i>Heure</th>
                      <th>Abonné</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitesDuJour?.visites?.map(v => (
                      <tr key={v.id}>
                        <td>
                          <span style={{
                            fontFamily:'monospace',fontSize:14,fontWeight:700,
                            color:'var(--red)',background:'rgba(192,57,43,.1)',
                            padding:'3px 8px',borderRadius:5
                          }}>{v.heure}</span>
                        </td>
                        <td>
                          <div style={{fontWeight:600}}>{v.nom}</div>
                          <div style={{fontSize:10,color:'var(--text-dim)'}}>{v.email}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ABONNÉS ────────────────────────────────────────────────
function AbonnesTab() {
  const [list, setList] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { show } = useToast();
  const [form, setForm] = useState({ nom:'', prenom:'', email:'', telephone:'', password:'' });

  const load = () => {
    setLoading(true);
    Promise.all([abonneService.getAll({ search }), abonneService.stats()])
      .then(([r, s]) => { setList(r.data.data || r.data); setStats(s.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search]);

  const openAdd = () => { setEditing(null); setForm({ nom:'', prenom:'', email:'', telephone:'', password:'' }); setModal(true); };
  const openEdit = (a) => { setEditing(a); setForm({ nom:a.nom, prenom:a.prenom, email:a.email, telephone:a.telephone||'', password:'' }); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await abonneService.update(editing.id, form);
      else await abonneService.create(form);
      show(editing ? 'Abonné modifié' : 'Abonné créé', 'success');
      setModal(false); load();
    } catch (err) { show(err.response?.data?.message || 'Erreur', 'error'); }
  };

  const remove = async (id) => {
    try { await abonneService.delete(id); show('Abonné supprimé', 'success'); load(); }
    catch { show('Erreur suppression', 'error'); }
    setConfirm(null);
  };

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Gestion des" accent="Abonnés">
        <button className="fz-btn primary" onClick={openAdd}><i className="bi bi-plus"></i>Ajouter</button>
      </PageHeader>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,padding:'20px 28px 0'}}>
        <div className="fz-stat"><div className="fz-stat-label">Total abonnés</div><div className="fz-stat-value">{stats.total_abonnes||0}</div></div>
        <div className="fz-stat green"><div className="fz-stat-label">Actifs</div><div className="fz-stat-value">{stats.abonnes_actifs||0}</div></div>
        <div className="fz-stat blue"><div className="fz-stat-label">Visites ce mois</div><div className="fz-stat-value">{stats.visites_ce_mois||0}</div></div>
        <div className="fz-stat orange"><div className="fz-stat-label">Revenus ce mois</div><div className="fz-stat-value" style={{fontSize:18}}>{stats.revenus_ce_mois||0} DH</div></div>
      </div>

      <div style={{padding:'20px 28px'}}>
        <div style={{display:'flex',gap:10,marginBottom:16}}>
          <input className="fz-input" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{maxWidth:300}} />
        </div>

        {loading ? <Spinner /> : (
          <div className="fz-card" style={{overflow:'hidden',padding:0}}>
            <table className="fz-table">
              <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Visites</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.prenom} {a.nom}</strong></td>
                    <td style={{color:'var(--text-muted)'}}>{a.email}</td>
                    <td style={{color:'var(--text-muted)'}}>{a.telephone || '—'}</td>
                    <td><span className="fz-badge type">{a.visites_count||0}</span></td>
                    <td>
                      <button className="fz-btn ghost sm me-1" onClick={() => openEdit(a)}><i className="bi bi-pencil"></i></button>
                      <button className="fz-btn danger sm" onClick={() => setConfirm(a.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={modal} title={editing ? 'Modifier abonné' : 'Nouvel abonné'} onClose={() => setModal(false)}>
        <form onSubmit={save}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div><label className="fz-label">Prénom</label><input className="fz-input" value={form.prenom} onChange={e => setForm(f=>({...f,prenom:e.target.value}))} required /></div>
            <div><label className="fz-label">Nom</label><input className="fz-input" value={form.nom} onChange={e => setForm(f=>({...f,nom:e.target.value}))} required /></div>
          </div>
          <div style={{marginBottom:12}}><label className="fz-label">Email</label><input className="fz-input" type="email" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} required /></div>
          <div style={{marginBottom:12}}><label className="fz-label">Téléphone</label><input className="fz-input" value={form.telephone} onChange={e => setForm(f=>({...f,telephone:e.target.value}))} /></div>
          <div style={{marginBottom:20}}><label className="fz-label">{editing ? 'Nouveau mot de passe (laisser vide)' : 'Mot de passe'}</label><input className="fz-input" type="password" value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))} required={!editing} /></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" className="fz-btn secondary" onClick={() => setModal(false)}>Annuler</button>
            <button type="submit" className="fz-btn primary">Enregistrer</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog show={!!confirm} title="Supprimer l'abonné" message="Cette action est irréversible." onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

// ─── COURS ──────────────────────────────────────────────────
function CoursTab() {
  const [list, setList] = useState([]);
  const [salles, setSalles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { show } = useToast();
  const empty = { titre:'', type:'boxe', salle_id:'', coach:'', date:'', heure_debut:'', heure_fin:'', places_max:15, niveau:'tous', description:'' };
  const [form, setForm] = useState(empty);

  const load = () => { setLoading(true); Promise.all([coursService.getAll(), salleService.getAll()]).then(([c,s]) => { setList(c.data); setSalles(s.data); }).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c) => { setEditing(c); setForm({...c, salle_id: c.salle_id, date: c.date?.slice(0,10), heure_debut: c.heure_debut?.slice(0,5), heure_fin: c.heure_fin?.slice(0,5)}); setModal(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await coursService.update(editing.id, form);
      else await coursService.create(form);
      show(editing ? 'Cours modifié' : 'Cours créé', 'success');
      setModal(false); load();
    } catch (err) { show(err.response?.data?.message || 'Erreur', 'error'); }
  };

  const remove = async (id) => { try { await coursService.delete(id); show('Cours supprimé','success'); load(); } catch { show('Erreur','error'); } setConfirm(null); };

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Gestion des" accent="Cours">
        <button className="fz-btn primary" onClick={openAdd}><i className="bi bi-plus"></i>Ajouter cours</button>
      </PageHeader>
      <div style={{padding:'20px 28px'}}>
        {loading ? <Spinner /> : (
          <div className="fz-card" style={{overflow:'hidden',padding:0}}>
            <table className="fz-table">
              <thead><tr><th>Titre</th><th>Type</th><th>Salle</th><th>Date</th><th>Horaire</th><th>Places</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.titre}</strong></td>
                    <td><span className="fz-badge type">{c.type}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{c.salle?.nom}</td>
                    <td style={{color:'var(--text-muted)'}}>{new Date(c.date).toLocaleDateString('fr-MA')}</td>
                    <td style={{color:'var(--text-muted)'}}>{c.heure_debut?.slice(0,5)}–{c.heure_fin?.slice(0,5)}</td>
                    <td>{c.places_reservees}/{c.places_max}</td>
                    <td>
                      <button className="fz-btn ghost sm me-1" onClick={() => openEdit(c)}><i className="bi bi-pencil"></i></button>
                      <button className="fz-btn danger sm" onClick={() => setConfirm(c.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={modal} title={editing ? 'Modifier cours' : 'Nouveau cours'} onClose={() => setModal(false)} size="lg">
        <form onSubmit={save}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
            <div><label className="fz-label">Titre</label><input className="fz-input" value={form.titre} onChange={e=>setForm(f=>({...f,titre:e.target.value}))} required /></div>
            <div><label className="fz-label">Type</label>
              <select className="fz-input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                {['boxe','mma','kickboxing','judo','jjb','autre'].map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
              </select>
            </div>
            <div><label className="fz-label">Coach</label><input className="fz-input" value={form.coach} onChange={e=>setForm(f=>({...f,coach:e.target.value}))} required /></div>
            <div><label className="fz-label">Salle</label>
              <select className="fz-input" value={form.salle_id} onChange={e=>setForm(f=>({...f,salle_id:e.target.value}))} required>
                <option value="">Choisir...</option>
                {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
              </select>
            </div>
            <div><label className="fz-label">Date</label><input className="fz-input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} required /></div>
            <div><label className="fz-label">Places max</label><input className="fz-input" type="number" value={form.places_max} onChange={e=>setForm(f=>({...f,places_max:e.target.value}))} required /></div>
            <div><label className="fz-label">Heure début</label><input className="fz-input" type="time" value={form.heure_debut} onChange={e=>setForm(f=>({...f,heure_debut:e.target.value}))} required /></div>
            <div><label className="fz-label">Heure fin</label><input className="fz-input" type="time" value={form.heure_fin} onChange={e=>setForm(f=>({...f,heure_fin:e.target.value}))} required /></div>
            <div><label className="fz-label">Niveau</label>
              <select className="fz-input" value={form.niveau} onChange={e=>setForm(f=>({...f,niveau:e.target.value}))}>
                {['tous','debutant','intermediaire','avance'].map(n => <option key={n} value={n}>{n.charAt(0).toUpperCase()+n.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div style={{marginBottom:20}}><label className="fz-label">Description</label><textarea className="fz-input" rows={3} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}></textarea></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" className="fz-btn secondary" onClick={() => setModal(false)}>Annuler</button>
            <button type="submit" className="fz-btn primary">Enregistrer</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog show={!!confirm} title="Supprimer le cours" message="Cette action est irréversible." onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

// ─── SALLES ─────────────────────────────────────────────────
function SallesTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { show } = useToast();
  const empty = { nom:'', description:'', capacite:'', equipements:'', actif:true };
  const [form, setForm] = useState(empty);

  const load = () => { setLoading(true); salleService.getAll().then(r => setList(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s) => { setEditing(s); setForm({nom:s.nom, description:s.description||'', capacite:s.capacite, equipements:s.equipements||'', actif:s.actif}); setModal(true); };
  const save = async (e) => { e.preventDefault(); try { if(editing) await salleService.update(editing.id,form); else await salleService.create(form); show('Salle enregistrée','success'); setModal(false); load(); } catch { show('Erreur','error'); } };
  const remove = async (id) => { try { await salleService.delete(id); show('Salle supprimée','success'); load(); } catch { show('Erreur','error'); } setConfirm(null); };

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Gestion des" accent="Salles">
        <button className="fz-btn primary" onClick={openAdd}><i className="bi bi-plus"></i>Ajouter salle</button>
      </PageHeader>
      <div style={{padding:'20px 28px'}}>
        {loading ? <Spinner /> : (
          <div className="fz-card" style={{overflow:'hidden',padding:0}}>
            <table className="fz-table">
              <thead><tr><th>Nom</th><th>Capacité</th><th>Équipements</th><th>Statut</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map(s => (
                  <tr key={s.id}>
                    <td><strong>{s.nom}</strong></td>
                    <td>{s.capacite} pers.</td>
                    <td style={{color:'var(--text-muted)',fontSize:11}}>{s.equipements}</td>
                    <td><span className={`fz-badge ${s.actif ? 'actif' : 'inactif'}`}>{s.actif ? 'Disponible' : 'Indispo'}</span></td>
                    <td>
                      <button className="fz-btn ghost sm me-1" onClick={() => openEdit(s)}><i className="bi bi-pencil"></i></button>
                      <button className="fz-btn danger sm" onClick={() => setConfirm(s.id)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={modal} title={editing ? 'Modifier salle' : 'Nouvelle salle'} onClose={() => setModal(false)}>
        <form onSubmit={save}>
          <div style={{marginBottom:12}}><label className="fz-label">Nom</label><input className="fz-input" value={form.nom} onChange={e=>setForm(f=>({...f,nom:e.target.value}))} required /></div>
          <div style={{marginBottom:12}}><label className="fz-label">Capacité</label><input className="fz-input" type="number" value={form.capacite} onChange={e=>setForm(f=>({...f,capacite:e.target.value}))} required /></div>
          <div style={{marginBottom:12}}><label className="fz-label">Équipements</label><input className="fz-input" value={form.equipements} onChange={e=>setForm(f=>({...f,equipements:e.target.value}))} /></div>
          <div style={{marginBottom:20}}><label className="fz-label">Description</label><textarea className="fz-input" rows={2} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}></textarea></div>
          <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
            <button type="button" className="fz-btn secondary" onClick={() => setModal(false)}>Annuler</button>
            <button type="submit" className="fz-btn primary">Enregistrer</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog show={!!confirm} title="Supprimer la salle" message="Cette action est irréversible." onConfirm={() => remove(confirm)} onCancel={() => setConfirm(null)} />
    </div>
  );
}

// ─── PAIEMENTS ADMIN ────────────────────────────────────────
function PaiementsTab() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatut, setFilterStatut] = useState('');
  const { show } = useToast();

  const load = () => { setLoading(true); paiementService.getAll(filterStatut ? {statut:filterStatut} : {}).then(r => setList(r.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, [filterStatut]);

  const payer = async (id) => { try { await paiementService.marquerPaye(id); show('Marqué comme payé','success'); load(); } catch { show('Erreur','error'); } };

  const MOIS = ['','Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

  return (
    <div>
      <PageHeader eyebrow="Administration" title="Gestion des" accent="Paiements" />
      <div style={{padding:'20px 28px'}}>
        <div style={{display:'flex',gap:8,marginBottom:16}}>
          {['','paye','impaye','en_attente'].map(s => (
            <button key={s} onClick={() => setFilterStatut(s)}
              style={{padding:'6px 14px',borderRadius:6,border:'0.5px solid var(--border-light)',
                background:filterStatut===s?'var(--red)':'var(--surface2)',
                color:filterStatut===s?'#fff':'var(--text-muted)',
                fontFamily:'var(--font)',fontSize:11,fontWeight:600,cursor:'pointer',textTransform:'uppercase'}}>
              {s===''?'Tous':s==='paye'?'Payés':s==='impaye'?'Impayés':'En attente'}
            </button>
          ))}
        </div>

        {loading ? <Spinner /> : (
          <div className="fz-card" style={{overflow:'hidden',padding:0}}>
            <table className="fz-table">
              <thead><tr><th>Abonné</th><th>Période</th><th>Montant</th><th>Statut</th><th>Date paiement</th><th>Actions</th></tr></thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.user?.prenom} {p.user?.nom}</strong></td>
                    <td>{MOIS[p.mois]} {p.annee}</td>
                    <td>{p.montant} DH</td>
                    <td><span className={`fz-badge ${p.statut === 'paye' ? 'paye' : p.statut === 'en_attente' ? 'attente' : 'impaye'}`}>{p.statut}</span></td>
                    <td style={{color:'var(--text-muted)'}}>{p.date_paiement ? new Date(p.date_paiement).toLocaleDateString('fr-MA') : '—'}</td>
                    <td>
                      {p.statut !== 'paye' && (
                        <button className="fz-btn success sm" onClick={() => payer(p.id)}><i className="bi bi-check-circle"></i>Marquer payé</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
