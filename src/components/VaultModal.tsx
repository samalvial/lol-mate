import React, { useState } from 'react';
import { ShieldCheck, Lock, Unlock, Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { CryptoVault, EncryptedDataPayload } from '../services/cryptoVault';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVaultUpdated: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({ isOpen, onClose, onVaultUpdated }) => {
  if (!isOpen) return null;

  const isUnlocked = CryptoVault.isUnlocked();
  const existingCreds = CryptoVault.getCredentials();

  const [passcode, setPasscode] = useState('');
  const [riotApiKey, setRiotApiKey] = useState(existingCreds?.riotApiKey || '');
  const [geminiApiKey, setGeminiApiKey] = useState(existingCreds?.geminiApiKey || '');
  const [showRiotKey, setShowRiotKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) {
      setMessage({ text: 'Por favor ingresa tu código PIN de seguridad.', type: 'error' });
      return;
    }

    const data = await CryptoVault.unlockVault(passcode);
    if (data) {
      setRiotApiKey(data.riotApiKey || '');
      setGeminiApiKey(data.geminiApiKey || '');
      setMessage({ text: '¡Bóveda desencriptada con éxito!', type: 'success' });
      onVaultUpdated();
    } else {
      setMessage({ text: 'Código PIN incorrecto o datos corruptos.', type: 'error' });
    }
  };

  const handleSaveAndEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 4) {
      setMessage({ text: 'Define un PIN de al menos 4 caracteres para encriptar tus datos.', type: 'error' });
      return;
    }

    const payload: EncryptedDataPayload = {
      riotApiKey: riotApiKey.trim(),
      geminiApiKey: geminiApiKey.trim(),
    };

    const success = await CryptoVault.saveVault(passcode, payload);
    if (success) {
      setMessage({ text: '¡Llaves encriptadas con AES-256-GCM y guardadas de forma segura!', type: 'success' });
      onVaultUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setMessage({ text: 'Error al encriptar las credenciales.', type: 'error' });
    }
  };

  const handleLockNow = () => {
    CryptoVault.lockVault();
    setPasscode('');
    setRiotApiKey('');
    setGeminiApiKey('');
    setMessage({ text: 'Bóveda bloqueada. Credenciales purgadas de la memoria.', type: 'success' });
    onVaultUpdated();
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
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        position: 'relative',
        border: '1px solid var(--glass-border-cyan)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: isUnlocked ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              border: `1px solid ${isUnlocked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isUnlocked ? '#10b981' : '#38bdf8'
            }}>
              {isUnlocked ? <Unlock size={22} /> : <Lock size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Bóveda de Seguridad AES-256</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Zero-Trust Client-Side Encryption</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '1.4rem',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        {/* Security Alert Badge */}
        <div style={{
          padding: '12px 16px',
          borderRadius: '14px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={20} color="#38bdf8" style={{ marginTop: '2px', flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
            Tus API keys y datos personales son encriptados en tu navegador mediante <strong>WebCrypto AES-GCM (256-bits)</strong>. Ningún servidor ni tercero puede acceder a tus llaves sin tu PIN maestro.
          </div>
        </div>

        {/* Feedback message */}
        {message && (
          <div style={{
            padding: '10px 14px',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: message.type === 'success' ? '#34d399' : '#fb7185'
          }}>
            {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Forms */}
        {!isUnlocked && CryptoVault.hasVault() ? (
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Código PIN Maestro de Desencriptación:
              </label>
              <input
                type="password"
                placeholder="Ingresa tu PIN de autorización..."
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
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
            <button type="submit" className="apple-button apple-button-primary" style={{ width: '100%' }}>
              <Unlock size={18} /> Desencriptar Bóveda
            </button>
          </form>
        ) : (
          <form onSubmit={handleSaveAndEncrypt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Riot Games API Key (Opcional - Formato RGAPI-xxxxx):
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showRiotKey ? 'text' : 'password'}
                  placeholder="RGAPI-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={riotApiKey}
                  onChange={e => setRiotApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowRiotKey(!showRiotKey)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showRiotKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Gemini AI API Key (Google AI Studio Key):
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                  value={geminiApiKey}
                  onChange={e => setGeminiApiKey(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Definir / Confirmar PIN Maestro de Encriptación:
              </label>
              <input
                type="password"
                placeholder="PIN o contraseña de autorización (mínimo 4 caracteres)..."
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
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

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="apple-button apple-button-primary" style={{ flex: 1 }}>
                <Save size={18} /> Encriptar y Guardar
              </button>

              {isUnlocked && (
                <button type="button" onClick={handleLockNow} className="apple-button apple-button-secondary">
                  <Lock size={18} /> Bloquear
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
