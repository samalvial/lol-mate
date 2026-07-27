import React from 'react';
import { UserAccount, RankedTierInfo, ChampionMastery, MatchSummary } from '../types/lol';
import { RiotApiService } from '../services/riotApi';
import { Trophy, Swords, Shield, Target, Flame, Key, Radio, RefreshCw, CheckCircle2, Lock, ExternalLink, Globe } from 'lucide-react';
import { MonetizationAdBanner } from './MonetizationAdBanner';
import { CryptoVault } from '../services/cryptoVault';

interface ProfileViewProps {
  account: UserAccount | null;
  rankedStats: RankedTierInfo[];
  masteries: ChampionMastery[];
  matches: MatchSummary[];
  isPro: boolean;
  onUpgradePro: () => void;
  onOpenAccountModal: () => void;
  onOpenVault: () => void;
  onCheckLiveGame: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  account,
  rankedStats,
  masteries,
  matches,
  isPro,
  onUpgradePro,
  onOpenAccountModal,
  onOpenVault,
  onCheckLiveGame
}) => {
  const soloQ = rankedStats.find(s => s.queueType === 'RANKED_SOLO_5x5') || rankedStats[0];
  const creds = CryptoVault.getCredentials();
  const hasRiotApiKey = !!(creds?.riotApiKey && creds.riotApiKey.startsWith('RGAPI-'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Riot API Connection Status Widget */}
      <div className="glass-panel-cyan" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        border: '1px solid var(--glass-border-cyan)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: hasRiotApiKey ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
            border: `1px solid ${hasRiotApiKey ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: hasRiotApiKey ? '#10b981' : '#38bdf8'
          }}>
            <Globe size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                Integración Riot Games API
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '999px',
                background: hasRiotApiKey ? 'rgba(16, 185, 129, 0.2)' : 'rgba(240, 185, 11, 0.2)',
                color: hasRiotApiKey ? '#34d399' : '#f0b90b',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} /> {hasRiotApiKey ? 'API Key Oficial Activa' : 'Modo Invocador Conectado'}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
              Riot ID vinculado: <strong style={{ color: '#38bdf8' }}>{account?.riotId || 'Sebam#LoL'}</strong> ({account?.region?.toUpperCase() || 'LA2'})
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onOpenAccountModal} className="apple-button apple-button-secondary" style={{ fontSize: '0.8rem' }}>
            Cambiar Riot ID
          </button>

          <button onClick={onOpenVault} className="apple-button apple-button-secondary" style={{ fontSize: '0.8rem' }}>
            <Key size={14} color="#f0b90b" /> {hasRiotApiKey ? 'Gestionar API Key' : 'Ingresar Riot API Key'}
          </button>

          <button onClick={onCheckLiveGame} className="apple-button apple-button-primary" style={{ fontSize: '0.8rem' }}>
            <Radio size={14} /> Buscar Partida en Vivo
          </button>
        </div>
      </div>

      {/* Main Profile Header Banner */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(13, 16, 23, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: '1px solid var(--glass-border-cyan)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.15.1/img/profileicon/${account?.profileIconId || 588}.png`}
              alt="Profile Icon"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '22px',
                border: '2px solid var(--accent-cyan)',
                boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              Lv. {account?.summonerLevel || 418}
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
                {account?.gameName || 'Sebam'}
              </h2>
              <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>
                #{account?.tagLine || 'LoL'}
              </span>
              <span style={{
                fontSize: '0.7rem',
                padding: '3px 8px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                color: '#38bdf8',
                fontWeight: 700,
                textTransform: 'uppercase'
              }}>
                {account?.region || 'LA2'}
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
              Cuenta de LoL Conectada • Roles: Jungla & Mid
            </p>
          </div>
        </div>

        {/* SoloQ Rank Badge */}
        {soloQ && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <img
              src={RiotApiService.getRankEmblem(soloQ.tier)}
              alt={soloQ.tier}
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>RANKED SOLO/DUO</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
                {soloQ.tier} {soloQ.rank} <span style={{ fontSize: '0.85rem', color: '#f0b90b' }}>({soloQ.leaguePoints} LP)</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 600 }}>
                {soloQ.wins}W {soloQ.losses}L • {soloQ.winrate}% Winrate
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Champion Masteries */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="#f0b90b" /> Campeones Principales (Maestría)
        </h3>

        <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {masteries.map(m => (
            <div key={m.championId} className="glass-panel" style={{
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <img
                src={m.iconUrl}
                alt={m.championName}
                style={{ width: '50px', height: '50px', borderRadius: '14px', border: '1px solid rgba(240, 185, 11, 0.4)' }}
              />
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{m.championName}</h4>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Nivel <strong style={{ color: '#f0b90b' }}>{m.masteryLevel}</strong> • {m.masteryPoints.toLocaleString()} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monetization Ad Slot */}
      <MonetizationAdBanner type="banner" isPro={isPro} onUpgradePro={onUpgradePro} />

      {/* Recent Match History */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Swords size={18} color="#38bdf8" /> Historial de Partidas Recientes
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {matches.map(m => (
            <div key={m.matchId} className="glass-panel" style={{
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              background: m.win ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
              borderLeft: `4px solid ${m.win ? '#10b981' : '#f43f5e'}`
            }}>
              {/* Champion & Outcome */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={m.championIcon}
                  alt={m.championName}
                  style={{ width: '52px', height: '52px', borderRadius: '14px' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: m.win ? '#34d399' : '#fb7185'
                    }}>
                      {m.win ? 'VICTORIA' : 'DERROTA'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>• {m.gameMode}</span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '2px' }}>
                    {m.championName} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>({m.role})</span>
                  </div>
                </div>
              </div>

              {/* KDA & CS */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  {m.kills} / <span style={{ color: '#fb7185' }}>{m.deaths}</span> / {m.assists}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                  {m.kdaRatio}:1 KDA • {m.cs} CS ({m.csPerMin}/m)
                </div>
              </div>

              {/* Items Built */}
              <div style={{ display: 'flex', gap: '4px' }}>
                {m.items.map((item, idx) => (
                  <img
                    key={idx}
                    src={RiotApiService.getItemIcon(item)}
                    alt="item"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
