import React from 'react';
import { Sparkles, ExternalLink, Zap } from 'lucide-react';

interface MonetizationAdBannerProps {
  type?: 'banner' | 'sidebar' | 'live-hud';
  isPro?: boolean;
  onUpgradePro?: () => void;
}

export const MonetizationAdBanner: React.FC<MonetizationAdBannerProps> = ({
  type = 'banner',
  isPro = false,
  onUpgradePro
}) => {
  if (isPro) return null; // Pro users see zero ads!

  if (type === 'sidebar') {
    return (
      <div className="glass-panel" style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(30, 41, 59, 0.4) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', fontWeight: 700 }}>
            Publicidad Patrocinada
          </span>
          <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', color: '#94a3b8' }}>
            AdSlot #02
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <Zap size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>
              Logitech G PRO X Wireless
            </h4>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.3 }}>
              Latencia ultrasónica para jugadores competitivos de League.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <a
            href="https://www.logitechg.com"
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
          >
            Ver Oferta <ExternalLink size={12} />
          </a>

          {onUpgradePro && (
            <button
              onClick={onUpgradePro}
              style={{
                background: 'none',
                border: 'none',
                color: '#f0b90b',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 600
              }}
            >
              <Sparkles size={12} /> Quitar Anuncios
            </button>
          )}
        </div>
      </div>
    );
  }

  // Default Horizontal Banner
  return (
    <div className="glass-panel" style={{
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      flexWrap: 'wrap',
      background: 'linear-gradient(135deg, rgba(240, 185, 11, 0.05) 0%, rgba(15, 23, 42, 0.7) 100%)',
      border: '1px solid var(--glass-border-gold)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          padding: '8px 12px',
          borderRadius: '12px',
          background: 'rgba(240, 185, 11, 0.15)',
          border: '1px solid rgba(240, 185, 11, 0.3)',
          color: '#f0b90b',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.8rem',
          fontWeight: 700
        }}>
          <Sparkles size={16} /> RIFTCOACH PRO
        </div>
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc' }}>
            Desbloquea Análisis Ilimitados de Gemini AI en Vivo
          </h4>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Experiencia 100% libre de anuncios, rutas de jungla avanzadas y coaching personalizado en tiempo real por solo $4.99/mes.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {onUpgradePro && (
          <button onClick={onUpgradePro} className="apple-button apple-button-gold">
            Mejorar a Pro
          </button>
        )}
      </div>
    </div>
  );
};
