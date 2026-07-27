import React, { useState } from 'react';
import { UserCheck, Globe, CheckCircle2, Sparkles } from 'lucide-react';
import { LoLRegion, UserAccount } from '../types/lol';
import { RiotApiService } from '../services/riotApi';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountLinked: (account: UserAccount) => void;
}

const REGIONS: { id: LoLRegion; label: string }[] = [
  { id: 'la2', label: 'LAS (Latinoamérica Sur)' },
  { id: 'la1', label: 'LAN (Latinoamérica Norte)' },
  { id: 'na1', label: 'NA (Norteamérica)' },
  { id: 'euw1', label: 'EUW (Europa Oeste)' },
  { id: 'eun1', label: 'EUNE (Europa Este)' },
  { id: 'kr', label: 'KR (Corea del Sur)' },
  { id: 'br1', label: 'BR (Brasil)' }
];

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onAccountLinked }) => {
  if (!isOpen) return null;

  const [riotIdInput, setRiotIdInput] = useState('Sebam#LoL');
  const [region, setRegion] = useState<LoLRegion>('la2');
  const [loading, setLoading] = useState(false);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riotIdInput.trim() || !riotIdInput.includes('#')) {
      alert('Por favor ingresa un Riot ID válido con el formato Nombre#TAG (ej: Faker#KR1 o tu Riot ID).');
      return;
    }

    setLoading(true);

    const account = await RiotApiService.fetchAccountByRiotId(riotIdInput.trim(), region);
    
    // Save linked Riot account locally for seamless return
    localStorage.setItem('riftcoach_linked_account', JSON.stringify(account));

    setLoading(false);
    onAccountLinked(account);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '28px',
        border: '1px solid var(--glass-border-cyan)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Conectar Cuenta de Riot Games</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleLink} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
              Tu Riot ID (Nombre#TAG):
            </label>
            <input
              type="text"
              placeholder="Ejemplo: Faker#KR1 o tu Riot ID personal..."
              value={riotIdInput}
              onChange={e => setRiotIdInput(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                fontSize: '0.95rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
              Servidor / Región:
            </label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value as LoLRegion)}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--glass-border)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            >
              {REGIONS.map(r => (
                <option key={r.id} value={r.id} style={{ background: '#0d1017' }}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="apple-button apple-button-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Conectando...' : 'Conectar Mi Cuenta de LoL'}
          </button>
        </form>
      </div>
    </div>
  );
};
