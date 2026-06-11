import React, { useState } from 'react';
import { PageHeader, Modal } from '../../components/UI';
import { exercisesDatabase } from '../../data/exerciseGifs-POPULATED';

const buildMuscleGroups = () => {
  const groupIcons = {
    biceps: 'bi-lightning-charge',
    triceps: 'bi-lightning',
    chest: 'bi-person-arms-up',
    back: 'bi-arrows-expand-vertical',
    shoulders: 'bi-award',
    legs: 'bi-activity',
    abs: 'bi-grid-3x3',
    calves: 'bi-arrow-up-circle'
  };

  const groupNames = {
    biceps: 'Biceps',
    triceps: 'Triceps',
    chest: 'Pectoraux',
    back: 'Dos',
    shoulders: 'Épaules',
    legs: 'Jambes',
    abs: 'Abdominaux',
    calves: 'Mollets'
  };

  const groupZones = {
    biceps: 'Bras',
    triceps: 'Bras',
    chest: 'Buste',
    back: 'Dos',
    shoulders: 'Épaules',
    legs: 'Jambes',
    abs: 'Core',
    calves: 'Jambes'
  };

  return Object.entries(exercisesDatabase).map(([key, exercises], id) => ({
    id: id + 1,
    nom: groupNames[key] || key,
    icon: groupIcons[key] || 'bi-lightning-charge',
    zone: groupZones[key] || 'Muscle',
    gif: exercises[0]?.gif || '',
    exercices: exercises.map(ex => ({
      nom: ex.frName,
      series: ex.series,
      gif: ex.gif,
      desc: ex.desc
    }))
  }));
};

const muscles = buildMuscleGroups();

function GifImg({ src, alt, style = {} }) {
  const [err, setErr] = useState(false);
  if (err || !src) return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
      <i className="bi bi-image" style={{ fontSize: 28, color: 'var(--red)', opacity: .4 }} />
      <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{alt}</span>
    </div>
  );
  return <img src={src} alt={alt} onError={() => setErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...style }} />;
}

export default function Musculation() {
  const [selected, setSelected] = useState(null);
  const [activeExo, setActiveExo] = useState(null);

  const openMuscle = (m) => { setSelected(m); setActiveExo(null); };
  const displayedGif = activeExo?.gif ?? selected?.gif;

  return (
    <div>
      <PageHeader eyebrow="Guide d'entraînement" title="Exercices par" accent="Groupe Musculaire" />

      <div style={{ padding: '16px 28px 8px', fontSize: 13, color: 'var(--text-muted)' }}>
        Cliquez sur un groupe musculaire pour voir les exercices. Cliquez sur un exercice pour voir son GIF.
      </div>

      {/* Grille muscles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, padding: '12px 28px 32px' }}>
        {muscles.map(m => (
          <div key={m.id} className="fz-card hoverable" style={{ overflow: 'hidden', padding: 0 }} onClick={() => openMuscle(m)}>
            <div className="muscle-img-placeholder" style={{ overflow: 'hidden', background: '#111' }}>
              <GifImg src={m.gif} alt={m.nom} />
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{m.nom}</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8 }}>{m.zone} · {m.exercices.length} exercices</div>
              {m.exercices.slice(0, 2).map(e => (
                <div key={e.nom} style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
                  <i className="bi bi-chevron-right me-1" style={{ fontSize: 9, color: 'var(--red)' }}></i>{e.nom}
                </div>
              ))}
              <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 4 }}>+{m.exercices.length - 2} autres...</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modale */}
      <Modal show={!!selected} title={selected?.nom} onClose={() => setSelected(null)} size="lg">
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <span className="fz-badge type">{selected.zone}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{selected.exercices.length} exercices</span>
              {activeExo && (
                <span onClick={() => setActiveExo(null)} style={{ fontSize: 11, color: 'var(--red)', marginLeft: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <i className="bi bi-arrow-left" style={{ fontSize: 10 }}></i> Groupe
                </span>
              )}
            </div>

            {/* GIF principal */}
            <div style={{ marginBottom: 20, borderRadius: 10, border: '1px solid var(--border)', height: 250, overflow: 'hidden', background: '#0d0d0d', position: 'relative' }}>
              <GifImg src={displayedGif} alt={activeExo?.nom ?? selected.nom} style={{ objectFit: 'contain' }} />
              {activeExo && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent,rgba(0,0,0,0.85))',
                  padding: '30px 16px 12px',
                  fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: '#fff',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <i className="bi bi-play-circle-fill" style={{ color: 'var(--red)', fontSize: 16 }}></i>
                  {activeExo.nom}
                </div>
              )}
            </div>

            {/* Liste exercices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selected.exercices.map((e) => {
                const isActive = activeExo?.nom === e.nom;
                return (
                  <div
                    key={e.nom}
                    onClick={() => setActiveExo(isActive ? null : e)}
                    style={{
                      background: isActive ? 'rgba(220,38,38,0.08)' : 'var(--surface2)',
                      borderRadius: 10, padding: '14px 16px',
                      borderLeft: '3px solid var(--red)', cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      outline: isActive ? '1px solid rgba(220,38,38,0.3)' : '1px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: '50%',
                          background: isActive ? 'var(--red)' : 'rgba(255,255,255,0.06)',
                          border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <i className={`bi bi-${isActive ? 'pause-fill' : 'play-fill'}`}
                            style={{ fontSize: 10, color: isActive ? '#fff' : 'var(--red)', marginLeft: isActive ? 0 : 1 }} />
                        </div>
                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 700, color: isActive ? '#fff' : 'inherit' }}>
                          {e.nom}
                        </div>
                      </div>
                      <span className="fz-badge type">{e.series}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, paddingLeft: 36 }}>
                      {e.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}