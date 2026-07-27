import React, { useState } from 'react';
import { Radio, Shield, UserCheck, Search, Sparkles, Menu, X, BookOpen, Lock, Unlock, Crown } from 'lucide-react';
import { UserAccount } from '../types/lol';
import { CryptoVault } from '../services/cryptoVault';

interface HeaderProps {
  activeTab: 'profile' | 'live' | 'champions';
  setActiveTab: (tab: 'profile' | 'live' | 'champions') => void;
  userAccount: UserAccount | null;
  onOpenVault: () => void;
  onOpenAccountModal: () => void;
  isLiveGameActive: boolean;
  isPro: boolean;
  onTogglePro: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userAccount,
  onOpenVault,
  onOpenAccountModal,
  isLiveGameActive,
  isPro,
  onTogglePro
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isVaultUnlocked = CryptoVault.isUnlocked();

  return (
    <header className="glass-panel" style={{
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 'calc(8px + var(--sat))',
      zIndex: 50,
      background: 'rgba(13, 16, 23, 0.85)',
      borderColor: isLiveGameActive ? 'rgba(56, 189, 248, 0.4)' : 'var(--glass-border)'
    }}>
      {/* Brand Logo & Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(56, 189, 248, 0.4)'
        }}>
          <Sparkles size={20} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em' }} className="gradient-text">
              RiftCoach AI
            </h1>
            {isPro && (
              <span style={{
                fontSize: '0.65rem',
                padding: '2px 6px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #f0b90b 0%, #d97706 100%)',
                color: '#0f172a',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <Crown size={10} /> PRO
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Real-Time LoL Companion</p>
        </div>
      </div>

      {/* Dynamic Island Live Match Widget */}
      {isLiveGameActive && (
        <div onClick={() => setActiveTab('live')} style={{
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(56, 189, 248, 0.12)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          boxShadow: '0 0 16px rgba(56, 189, 248, 0.25)'
        }} className="live-pulse">
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#38bdf8'
          }}></span>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>
            EN PARTIDA (LIVE COACH ACTIVO)
          </span>
        </div>
      )}

      {/* Desktop Navigation Tabs */}
      <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`apple-button ${activeTab === 'profile' ? 'apple-button-primary' : 'apple-button-secondary'}`}
        >
          <UserCheck size={16} /> Perfil & Stats
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`apple-button ${activeTab === 'live' ? 'apple-button-primary' : 'apple-button-secondary'}`}
          style={{ position: 'relative' }}
        >
          <Radio size={16} color={isLiveGameActive ? '#38bdf8' : 'currentColor'} /> Coach en Vivo
        </button>

        <button
          onClick={() => setActiveTab('champions')}
          className={`apple-button ${activeTab === 'champions' ? 'apple-button-primary' : 'apple-button-secondary'}`}
        >
          <BookOpen size={16} /> Campeones & Builds
        </button>
      </nav>

      {/* User Actions & Vault Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Account Badge */}
        <button
          onClick={onOpenAccountModal}
          className="apple-button apple-button-secondary"
          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
        >
          <Search size={14} />
          <span>{userAccount ? userAccount.riotId : 'Vincular Cuenta LoL'}</span>
        </button>

        {/* Security Vault Button */}
        <button
          onClick={onOpenVault}
          style={{
            padding: '8px 12px',
            borderRadius: '9999px',
            background: isVaultUnlocked ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.08)',
            border: `1px solid ${isVaultUnlocked ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.12)'}`,
            color: isVaultUnlocked ? '#34d399' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          {isVaultUnlocked ? <Unlock size={14} /> : <Lock size={14} />}
          <span className="vault-text">{isVaultUnlocked ? 'Bóveda Activa' : 'Bóveda PIN'}</span>
        </button>

        {/* Pro Mode Switch */}
        <button
          onClick={onTogglePro}
          style={{
            padding: '8px',
            borderRadius: '50%',
            background: isPro ? 'rgba(240, 185, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isPro ? 'rgba(240, 185, 11, 0.4)' : 'transparent'}`,
            color: isPro ? '#f0b90b' : '#64748b',
            cursor: 'pointer'
          }}
          title={isPro ? 'RiftCoach Pro Activo' : 'Mejorar a RiftCoach Pro'}
        >
          <Crown size={16} />
        </button>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px'
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: 'rgba(13, 16, 23, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '16px',
          borderRadius: '20px',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          <button
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
            className={`apple-button ${activeTab === 'profile' ? 'apple-button-primary' : 'apple-button-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <UserCheck size={18} /> Perfil & Estadísticas
          </button>
          <button
            onClick={() => { setActiveTab('live'); setMobileMenuOpen(false); }}
            className={`apple-button ${activeTab === 'live' ? 'apple-button-primary' : 'apple-button-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <Radio size={18} /> Coach en Vivo (Gemini AI)
          </button>
          <button
            onClick={() => { setActiveTab('champions'); setMobileMenuOpen(false); }}
            className={`apple-button ${activeTab === 'champions' ? 'apple-button-primary' : 'apple-button-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start' }}
          >
            <BookOpen size={18} /> Base de Campeones & Builds
          </button>
        </div>
      )}
    </header>
  );
};
