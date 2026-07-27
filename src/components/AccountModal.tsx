import React, { useState } from 'react';
import { UserCheck, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
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
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riotIdInput.trim() || !riotIdInput.includes('#')) {
      setErrorMsg('Por favor ingresa un Riot ID válido con el formato Nombre#TAG (ej: Faker#KR1).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const account = await RiotApiService.fetchAccountByRiotId(riotIdInput.trim(), region);
      
      // Save linked Riot account locally
      localStorage.setItem('riftcoach_linked_account', JSON.stringify(account));

      setSuccessMsg(`¡Cuenta ${account.riotId} conectada exitosamente!`);
      
      setTimeout(() => {
        setLoading(false);
        onAccountLinked(account);
        onClose();
        setSuccessMsg(null);
      }, 700);
    } catch (err) {
      setLoading(false);
      setErrorMsg('Ocurrió un problema al conectar con la cuenta.');
    }
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

        {errorMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={16} /> {successMsg}
          </div>
        )}

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
            style={{ width: '100%', marginTop: '4px', gap: '8px' }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="live-pulse" /> Conectando Cuenta...
              </>
            ) : (
              'Conectar Mi Cuenta de LoL'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
