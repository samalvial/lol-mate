import React, { useState } from 'react';
import { Search, UserCheck, Key, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoLRegion, UserAccount } from '../types/lol';
import { RiotApiService } from '../services/riotApi';
import { CryptoVault } from '../services/cryptoVault';

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
  const [error, setError] = useState<string | null>(null);

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riotIdInput.trim() || !riotIdInput.includes('#')) {
      setError('Por favor ingresa un Riot ID válido con el formato Nombre#TAG (ej: Faker#KR1 o tu Riot ID).');
      return;
    }

    setLoading(true);
    setError(null);

    const creds = CryptoVault.getCredentials();
    const account = await RiotApiService.fetchAccountByRiotId(riotIdInput.trim(), region, creds?.riotApiKey);

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
        maxWidth: '500px',
        width: '100%',
        padding: '28px',
        border: '1px solid var(--glass-border-cyan)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <UserCheck size={22} color="#38bdf8" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Vincular Cuenta de League of Legends</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        {error && (
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
            <AlertCircle size={16} /> {error}
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
              Región del Servidor:
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

          <div style={{
            padding: '12px 14px',
            borderRadius: '12px',
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.2)',
            fontSize: '0.8rem',
            color: '#cbd5e1',
            lineHeight: 1.45
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
              <ShieldCheck size={16} /> Conexión Directa con Riot Games API
            </div>
            Puedes conectar tu cuenta ingresando tu Riot ID. Para consultas en vivo con Riot API de producción, puedes agregar tu Riot API Key en la <strong>Bóveda de Seguridad</strong>.
            <div style={{ marginTop: '6px' }}>
              <a
                href="https://developer.riotgames.com/"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#f0b90b', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Obtener Riot API Key gratis <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="apple-button apple-button-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '4px' }}
          >
            {loading ? 'Buscando Cuenta de Riot...' : 'Vincular y Buscar Estadísticas'}
          </button>
        </form>
      </div>
    </div>
  );
};
