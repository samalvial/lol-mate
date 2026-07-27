import React, { useState } from 'react';
import { Sparkles, Key, ExternalLink, Save, CheckCircle2, Lock, Unlock, ShieldCheck, AlertCircle } from 'lucide-react';
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
  const [geminiApiKey, setGeminiApiKey] = useState(existingCreds?.geminiApiKey || '');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSaveAndEncrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode || passcode.length < 4) {
      setMessage({ text: 'Define un PIN de al menos 4 caracteres para encriptar tu llave de Gemini AI.', type: 'error' });
      return;
    }

    const payload: EncryptedDataPayload = {
      geminiApiKey: geminiApiKey.trim(),
    };

    const success = await CryptoVault.saveVault(passcode, payload);
    if (success) {
      setMessage({ text: '¡Llave de Gemini AI encriptada con AES-256 y guardada exitosamente!', type: 'success' });
      onVaultUpdated();
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setMessage({ text: 'Error al encriptar las credenciales.', type: 'error' });
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await CryptoVault.unlockVault(passcode);
    if (data) {
      setGeminiApiKey(data.geminiApiKey || '');
      setMessage({ text: '¡Bóveda desencriptada!', type: 'success' });
      onVaultUpdated();
    } else {
      setMessage({ text: 'Código PIN incorrecto.', type: 'error' });
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
        maxWidth: '540px',
        width: '100%',
        padding: '28px',
        border: '1px solid var(--glass-border-cyan)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8'
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Configuración de Gemini AI</h3>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Coach Virtual en Tiempo Real (Encriptado AES-256)</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '1.4rem', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Tutorial Card: How to get a Gemini API Key */}
        <div style={{
          padding: '14px 18px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(240, 185, 11, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)',
          border: '1px solid rgba(240, 185, 11, 0.3)',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f0b90b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            💡 ¿Cómo obtener tu Gemini API Key 100% Gratis en 30 segundos?
          </h4>
          <ol style={{ fontSize: '0.82rem', color: '#cbd5e1', paddingLeft: '18px', lineHeight: 1.55 }}>
            <li>Abre <strong><a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 700 }}>Google AI Studio <ExternalLink size={11} /></a></strong> e inicia sesión con tu cuenta de Google.</li>
            <li>Haz clic en el botón azul <strong>"Create API Key"</strong>.</li>
            <li>Copia la clave (empieza por <code>AIzaSy...</code>) y pégala a continuación.</li>
          </ol>
        </div>

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

        {!isUnlocked && CryptoVault.hasVault() ? (
          <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Código PIN Maestro de Desencriptación:
              </label>
              <input
                type="password"
                placeholder="Ingresa tu PIN de seguridad..."
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
              Desencriptar y Ver Clave de Gemini
            </button>
          </form>
        ) : (
          <form onSubmit={handleSaveAndEncrypt} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Tu Google Gemini API Key:
              </label>
              <input
                type="password"
                placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--glass-border)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Crea / Confirma tu PIN Maestro de Seguridad (AES-256):
              </label>
              <input
                type="password"
                placeholder="Ingresa un PIN (mínimo 4 dígitos)..."
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

            <button type="submit" className="apple-button apple-button-primary" style={{ width: '100%', marginTop: '6px' }}>
              <Save size={18} /> Encriptar y Guardar Gemini Key
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
