import React, { useState, useEffect } from 'react';
import { LiveGameInfo, GeminiMatchAnalysis, ChatMessage } from '../types/lol';
import { GeminiService } from '../services/geminiService';
import { RiotApiService } from '../services/riotApi';
import { Radio, ShieldAlert, Sparkles, MapPin, Send, Zap, MessageSquare, RefreshCw, ChevronRight, Award, Compass, Lock } from 'lucide-react';
import { CryptoVault } from '../services/cryptoVault';

interface LiveMatchCoachProps {
  liveGame: LiveGameInfo;
  onRefreshLiveMatch: () => void;
  isPro: boolean;
  onUpgradePro: () => void;
}

export const LiveMatchCoach: React.FC<LiveMatchCoachProps> = ({
  liveGame,
  onRefreshLiveMatch,
  isPro,
  onUpgradePro
}) => {
  const [analysis, setAnalysis] = useState<GeminiMatchAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'build' | 'jungle' | 'matchup' | 'chat'>('build');
  
  // Interactive Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'gemini',
      text: `¡Hola! Soy tu Gemini LoL Coach en tiempo real. Estás jugando ${liveGame.userParticipant.championName} (${liveGame.userParticipant.role}). ¿Tienes alguna consulta específica sobre la partida?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const runAnalysis = async () => {
      setLoading(true);
      const creds = CryptoVault.getCredentials();
      const result = await GeminiService.analyzeLiveGame(liveGame, creds?.geminiApiKey);
      if (isMounted) {
        setAnalysis(result);
        setLoading(false);
      }
    };

    runAnalysis();
    return () => { isMounted = false; };
  }, [liveGame]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    const creds = CryptoVault.getCredentials();
    const geminiReply = await GeminiService.askGeminiCoach(userText, liveGame, creds?.geminiApiKey);

    const coachMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'gemini',
      text: geminiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, coachMsg]);
    setChatLoading(false);
  };

  const user = liveGame.userParticipant;
  const isJungle = user.role === 'JUNGLE';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Live Match Top Status Header */}
      <div className="glass-panel-cyan" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={user.championIcon}
            alt={user.championName}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              border: '2px solid var(--accent-cyan)',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-pulse" style={{
                padding: '3px 10px',
                borderRadius: '999px',
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Radio size={12} /> GEMINI LIVE COACH ACTIVE
              </span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Map: {liveGame.gameMode}
              </span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
              {user.championName} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 600 }}>({user.role})</span>
            </h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={onRefreshLiveMatch} className="apple-button apple-button-secondary">
            <RefreshCw size={16} /> Actualizar Partida
          </button>
        </div>
      </div>

      {/* 10-Player Matchup Matrix */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Matriz de Jugadores en Partida (Blue vs Red)
        </h3>

        <div className="grid-2">
          {/* Blue Team */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700, paddingBottom: '4px', borderBottom: '1px solid rgba(56, 189, 248, 0.2)' }}>
              EQUIPO AZUL (ALIADO)
            </div>
            {liveGame.blueTeam.map((p, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '10px',
                background: p.riotId === user.riotId ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                border: p.riotId === user.riotId ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={p.championIcon} alt={p.championName} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.championName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.summonerName} ({p.role})</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f0b90b', fontWeight: 600 }}>
                  {p.tier} {p.rank}
                </div>
              </div>
            ))}
          </div>

          {/* Red Team */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: 700, paddingBottom: '4px', borderBottom: '1px solid rgba(244, 63, 94, 0.2)' }}>
              EQUIPO ROJO (RIVAL)
            </div>
            {liveGame.redTeam.map((p, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={p.championIcon} alt={p.championName} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{p.championName}</div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{p.summonerName} ({p.role})</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#fb7185', fontWeight: 600 }}>
                  {p.tier} {p.rank}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('build')}
          className={`apple-button ${activeTab === 'build' ? 'apple-button-gold' : 'apple-button-secondary'}`}
        >
          <Zap size={16} /> Build & Runes por Gemini
        </button>

        {isJungle && (
          <button
            onClick={() => setActiveTab('jungle')}
            className={`apple-button ${activeTab === 'jungle' ? 'apple-button-gold' : 'apple-button-secondary'}`}
          >
            <Compass size={16} /> Ruta de Jungla Interactiva
          </button>
        )}

        <button
          onClick={() => setActiveTab('matchup')}
          className={`apple-button ${activeTab === 'matchup' ? 'apple-button-gold' : 'apple-button-secondary'}`}
        >
          <ShieldAlert size={16} /> Consejos de Matchup & Timings
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`apple-button ${activeTab === 'chat' ? 'apple-button-gold' : 'apple-button-secondary'}`}
        >
          <MessageSquare size={16} /> Pregunta a Gemini Coach
        </button>
      </div>

      {/* Content Panels */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Sparkles size={36} color="#38bdf8" className="live-pulse" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analizando partida con Gemini AI...</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
            Generando build situacional, rutas y estrategia contra la composición enemiga.
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: Recommended Build & Runes */}
          {activeTab === 'build' && analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0b90b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={20} /> Ruta de Ítems Recomendada para esta Partida
                </h3>

                <div className="grid-3">
                  {analysis.itemBuild.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '14px',
                      borderRadius: '14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <img src={item.iconUrl} alt={item.name} style={{ width: '44px', height: '44px', borderRadius: '10px' }} />
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#f0b90b' }}>{item.gold} Gold • {item.category.toUpperCase()}</div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                        {item.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Runes Optimization */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={20} /> Configuración de Runas por Gemini AI
                </h3>
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#f0b90b', fontWeight: 700 }}>Rama Principal: {analysis.runes.primaryTree}</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: '2px' }}>{analysis.runes.keystone}</div>
                    <ul style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', paddingLeft: '16px' }}>
                      {analysis.runes.primaryRunes.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>

                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>Rama Secundaria: {analysis.runes.secondaryTree}</div>
                    <ul style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '6px', paddingLeft: '16px' }}>
                      {analysis.runes.secondaryRunes.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>

                  <div style={{ flex: 2, minWidth: '260px', padding: '12px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>¿Por qué usar estas runas?</div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
                      {analysis.runes.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Jungle Clearance Route */}
          {activeTab === 'jungle' && isJungle && analysis?.junglePath && (
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} /> Ruta de Limpieza de Jungla Optimizada
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysis.junglePath.map((step) => (
                  <div key={step.step} style={{
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        #{step.step}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>{step.campName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>{step.action}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', maxWidth: '300px' }}>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px', color: '#f0b90b' }}>
                        {step.timing}
                      </span>
                      <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '4px' }}>
                        {step.tip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Matchup & Timings */}
          {activeTab === 'matchup' && analysis && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '10px' }}>
                  Resumen Táctico de Línea
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {analysis.matchupSummary}
                </p>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0b90b', marginTop: '16px', marginBottom: '8px' }}>
                  Reglas de Oro para la Fase de Líneas:
                </h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '20px' }}>
                  {analysis.lanePhaseAdvice.map((advice, i) => (
                    <li key={i} style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Power Spikes */}
              <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0b90b', marginBottom: '14px' }}>
                  Picos de Poder (Power Spikes)
                </h3>
                <div className="grid-3">
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>Nivel 2</div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>{analysis.powerSpikes.level2}</p>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#f0b90b', fontWeight: 700 }}>Nivel 6 (Ultimate)</div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>{analysis.powerSpikes.level6}</p>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>Ítem Core</div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px' }}>{analysis.powerSpikes.itemSpike}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Ask Gemini Coach Chat Widget */}
          {activeTab === 'chat' && (
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '480px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> Chat de Coach en Tiempo Real con Gemini AI
              </h3>

              {/* Chat Messages Log */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                paddingRight: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {messages.map((m) => (
                  <div key={m.id} style={{
                    display: 'flex',
                    justifyContent: m.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '80%',
                      padding: '12px 16px',
                      borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      background: m.sender === 'user' ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'rgba(255,255,255,0.06)',
                      border: m.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      fontSize: '0.88rem',
                      lineHeight: 1.45
                    }}>
                      <div style={{ fontSize: '0.7rem', color: m.sender === 'user' ? 'rgba(255,255,255,0.7)' : '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                        {m.sender === 'user' ? 'Tú' : 'Gemini LoL Coach'} • {m.timestamp}
                      </div>
                      {m.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    Gemini escribiendo respuesta...
                  </div>
                )}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Pregunta a tu coach (ej: ¿Qué hago si me campean en mid?)..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--glass-border)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="apple-button apple-button-primary">
                  <Send size={16} /> Enviar
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};
