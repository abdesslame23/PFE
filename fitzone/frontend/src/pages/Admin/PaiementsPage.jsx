import React, { useState, useEffect } from 'react';
import { paiementService } from '../../services/api';
import { PageHeader, Spinner, useToast } from '../../components/UI';

const MOIS_NOMS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const STATUT_LABELS = {
  paye: 'Payé',
  impaye: 'Impayé',
  en_attente: 'En attente',
};

const PaiementsPage = () => {
  const [abonnes, setAbonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [updating, setUpdating] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { show } = useToast();

  useEffect(() => {
    loadPaiements();
  }, [selectedMonth, selectedYear]);

  const loadPaiements = async () => {
    try {
      setLoading(true);
      const response = await paiementService.gestion({
        mois: selectedMonth,
        annee: selectedYear,
      });
      setAbonnes(response.data || []);
    } catch (error) {
      show('Impossible de charger les paiements', 'error');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, statut) => {
    try {
      setUpdating(userId);
      await paiementService.marquerMensuel({
        user_id: userId,
        mois: selectedMonth,
        annee: selectedYear,
        statut,
      });
      show(`Statut mis à jour : ${STATUT_LABELS[statut]}`, 'success');
      loadPaiements();
    } catch (error) {
      show('Erreur lors de la mise à jour du paiement', 'error');
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  const badgeClass = (statut) => {
    if (statut === 'paye') return 'fz-badge paye';
    if (statut === 'impaye') return 'fz-badge impaye';
    return 'fz-badge attente';
  };

  const filteredAbonnes = abonnes.filter((abonne) =>
    abonne.nom_complet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const nbPayes = filteredAbonnes.filter((a) => a.paiement?.statut === 'paye').length;
  const nbImpayes = filteredAbonnes.filter((a) => a.paiement?.statut === 'impaye').length;
  const nbAttente = filteredAbonnes.filter((a) => !a.paiement || a.paiement?.statut === 'en_attente').length;

  return (
    <div style={{ padding: '24px 28px' }}>
      <PageHeader eyebrow="Administration" title="Gestion des" accent="Paiements" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14, marginTop: 18, marginBottom: 26 }}>
        <div className="fz-stat green">
          <div className="fz-stat-label">Payés</div>
          <div className="fz-stat-value">{nbPayes}</div>
          <div className="fz-stat-sub">Mois validés</div>
        </div>
        <div className="fz-stat">
          <div className="fz-stat-label">Impayés</div>
          <div className="fz-stat-value" style={{ color: 'var(--red-light)' }}>{nbImpayes}</div>
          <div className="fz-stat-sub">À régler</div>
        </div>
        <div className="fz-stat orange">
          <div className="fz-stat-label">En attente</div>
          <div className="fz-stat-value">{nbAttente}</div>
          <div className="fz-stat-sub">Statut à définir</div>
        </div>
      </div>

      <div className="fz-card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'flex-end', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ minWidth: 180, flex: '1 1 180px' }}>
            <label className="fz-label">Mois</label>
            <select className="fz-input" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {MOIS_NOMS.map((m, index) => (
                <option key={m} value={index + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 180, flex: '1 1 180px' }}>
            <label className="fz-label">Année</label>
            <select className="fz-input" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
              {[2024, 2025, 2026, 2027].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div style={{ minWidth: 250, flex: '1 1 250px' }}>
            <label className="fz-label">Rechercher</label>
            <input
              type="text"
              className="fz-input"
              placeholder="Nom ou prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ marginLeft: 'auto', minWidth: 200 }}>
            <div className="fz-label">Abonnés</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{filteredAbonnes.length}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <Spinner />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="fz-table" style={{ minWidth: 920 }}>
              <thead>
                <tr>
                  <th>Abonné</th>
                  <th>Contact</th>
                  <th>Mois</th>
                  <th>Année</th>
                  <th>Statut</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAbonnes.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--text-dim)' }}>
                      {searchTerm ? 'Aucun abonné trouvé pour cette recherche.' : 'Aucun abonné trouvé pour ce mois.'}
                    </td>
                  </tr>
                ) : filteredAbonnes.map((abonne) => (
                  <tr key={abonne.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text)' }}>{abonne.nom_complet}</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{abonne.email}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{abonne.telephone}</div>
                    </td>
                    <td>{MOIS_NOMS[selectedMonth - 1]}</td>
                    <td>{selectedYear}</td>
                    <td>
                      <span className={badgeClass(abonne.paiement?.statut || 'en_attente')}>
                        {STATUT_LABELS[abonne.paiement?.statut || 'en_attente']}
                      </span>
                      {abonne.paiement?.date_paiement && (
                        <div style={{ marginTop: 6, fontSize: 11, color: 'var(--text-dim)' }}>
                          Payé le {new Date(abonne.paiement.date_paiement).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="fz-btn ghost sm" onClick={() => handleStatusChange(abonne.id, 'impaye')} disabled={updating === abonne.id}>
                        {updating === abonne.id ? '...' : 'Impayé'}
                      </button>
                      <button className="fz-btn primary sm" style={{ marginLeft: 8 }} onClick={() => handleStatusChange(abonne.id, 'paye')} disabled={updating === abonne.id}>
                        {updating === abonne.id ? '...' : 'Payé'}
                      </button>
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
};

export default PaiementsPage;
