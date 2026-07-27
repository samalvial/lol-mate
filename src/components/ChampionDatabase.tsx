import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, Zap, BookOpen, Swords } from 'lucide-react';
import { RiotApiService } from '../services/riotApi';

interface ChampionInfo {
  id: string;
  name: string;
  title: string;
  roles: string[];
  winrate: number;
  pickrate: number;
  counters: string[];
  synergies: string[];
}

const CHAMPIONS_LIST: ChampionInfo[] = [
  { id: 'LeeSin', name: 'Lee Sin', title: 'El Monje Ciego', roles: ['JUNGLE'], winrate: 51.4, pickrate: 14.2, counters: ['Poppy', 'RekSai'], synergies: ['Ahri', 'Yasuo'] },
  { id: 'Yasuo', name: 'Yasuo', title: 'El Imperdonable', roles: ['MIDDLE', 'TOP'], winrate: 50.8, pickrate: 12.8, counters: ['Renekton', 'Pantheon'], synergies: ['Malphite', 'Gragas'] },
  { id: 'Akali', name: 'Akali', title: 'La Asesina Furtiva', roles: ['MIDDLE', 'TOP'], winrate: 49.6, pickrate: 9.5, counters: ['Galio', 'Kassadin'], synergies: ['Sejuani', 'JarvanIV'] },
  { id: 'Aatrox', name: 'Aatrox', title: 'La Espada de los Oscuros', roles: ['TOP'], winrate: 51.1, pickrate: 11.0, counters: ['Irelia', 'Fiora'], synergies: ['Orianna', 'Lulu'] },
  { id: 'Ahri', name: 'Ahri', title: 'La Gumiho de Nueve Colas', roles: ['MIDDLE'], winrate: 52.3, pickrate: 13.5, counters: ['Tristana', 'Sylas'], synergies: ['LeeSin', 'Viego'] },
  { id: 'Kaisa', name: 'Kai\'Sa', title: 'La Hija del Vacío', roles: ['BOTTOM'], winrate: 51.8, pickrate: 22.4, counters: ['Caitlyn', 'Draven'], synergies: ['Nautilus', 'Leona'] },
  { id: 'Nautilus', name: 'Nautilus', title: 'El Titán de las Profundidades', roles: ['UTILITY'], winrate: 51.9, pickrate: 10.8, counters: ['Morgana', 'Sivir'], synergies: ['Kaisa', 'Samira'] },
  { id: 'Viego', name: 'Viego', title: 'El Rey Arruinado', roles: ['JUNGLE'], winrate: 50.5, pickrate: 11.6, counters: ['Jax', 'Rammus'], synergies: ['Vex', 'Syndra'] },
  { id: 'Sylas', name: 'Sylas', title: 'El Desencadenado', roles: ['MIDDLE', 'JUNGLE'], winrate: 51.0, pickrate: 10.2, counters: ['Cassiopeia', 'Heimerdinger'], synergies: ['Sejuani', 'Malphite'] },
  { id: 'Jinx', name: 'Jinx', title: 'La Bala Perdida', roles: ['BOTTOM'], winrate: 52.0, pickrate: 18.2, counters: ['Twitch', 'Lucian'], synergies: ['Thresh', 'Lulu'] },
  { id: 'Thresh', name: 'Thresh', title: 'El Carcelero de las Cadenas', roles: ['UTILITY'], winrate: 51.2, pickrate: 15.0, counters: ['Morgana', 'Zyra'], synergies: ['Jinx', 'Draven'] },
  { id: 'Darius', name: 'Darius', title: 'La Mano de Noxus', roles: ['TOP'], winrate: 51.7, pickrate: 8.9, counters: ['Vayne', 'Quinn'], synergies: ['Ghost', 'Conqueror'] }
];

export const ChampionDatabase: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedChamp, setSelectedChamp] = useState<ChampionInfo>(CHAMPIONS_LIST[0]);

  const filteredChamps = CHAMPIONS_LIST.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'ALL' || c.roles.includes(selectedRole);
    return matchesSearch && matchesRole;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Search & Filter Bar */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Buscar campeón (ej: Lee Sin, Yasuo, Kai'Sa)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 42px',
              borderRadius: '12px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--glass-border)',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>

        {/* Role Filters */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['ALL', 'TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY'].map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                background: selectedRole === role ? 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' : 'rgba(255,255,255,0.06)',
                border: selectedRole === role ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: '#fff'
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(320px, 1.4fr)', gap: '20px' }}>
        {/* Champion List Grid */}
        <div className="glass-panel" style={{ padding: '16px', maxHeight: '620px', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '12px', textTransform: 'uppercase' }}>
            Campeones ({filteredChamps.length})
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredChamps.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedChamp(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: selectedChamp.id === c.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: selectedChamp.id === c.id ? '1px solid rgba(56, 189, 248, 0.4)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={RiotApiService.getChampionIcon(c.id)}
                    alt={c.name}
                    style={{ width: '40px', height: '40px', borderRadius: '10px' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700 }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.title}</div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399' }}>
                    {c.winrate}% WR
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    {c.pickrate}% PR
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Champion Detail View */}
        <div className="glass-panel-cyan" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={RiotApiService.getChampionIcon(selectedChamp.id)}
              alt={selectedChamp.name}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                border: '2px solid var(--accent-cyan)',
                boxShadow: '0 0 24px rgba(56, 189, 248, 0.3)'
              }}
            />
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{selectedChamp.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{selectedChamp.title}</p>
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                {selectedChamp.roles.map(r => (
                  <span key={r} style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontWeight: 700
                  }}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Winrate Global</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{selectedChamp.winrate}%</div>
            </div>
            <div style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Pickrate Global</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f0b90b' }}>{selectedChamp.pickrate}%</div>
            </div>
          </div>

          {/* Hard Counters & Synergies */}
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fb7185', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert size={16} /> Hard Counters (Enemigos Difíciles)
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedChamp.counters.map(ctr => (
                <div key={ctr} style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <img src={RiotApiService.getChampionIcon(ctr)} alt={ctr} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fca5a5' }}>{ctr}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Swords size={16} /> Mejores Sinergias (Compañeros de Equipo)
            </h4>
            <div style={{ display: 'flex', gap: '10px' }}>
              {selectedChamp.synergies.map(syn => (
                <div key={syn} style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <img src={RiotApiService.getChampionIcon(syn)} alt={syn} style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc' }}>{syn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
