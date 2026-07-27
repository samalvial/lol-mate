export type LoLRegion = 'na1' | 'euw1' | 'eun1' | 'kr' | 'br1' | 'la1' | 'la2' | 'jp1' | 'oc1' | 'ru' | 'tr1';

export interface UserAccount {
  riotId: string; // e.g. "Faker#KR1"
  gameName: string;
  tagLine: string;
  region: LoLRegion;
  summonerLevel: number;
  profileIconId: number;
  puuid: string;
  linkedAt: string;
}

export interface RankedTierInfo {
  queueType: 'RANKED_SOLO_5x5' | 'RANKED_FLEX_SR';
  tier: 'IRON' | 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'EMERALD' | 'DIAMOND' | 'MASTER' | 'GRANDMASTER' | 'CHALLENGER';
  rank: 'I' | 'II' | 'III' | 'IV';
  leaguePoints: number;
  wins: number;
  losses: number;
  winrate: number;
}

export interface ChampionMastery {
  championId: number;
  championName: string;
  championTitle: string;
  masteryLevel: number;
  masteryPoints: number;
  chestGranted: boolean;
  iconUrl: string;
}

export interface MatchSummary {
  matchId: string;
  gameMode: string;
  gameDurationSeconds: number;
  gameCreationTimestamp: number;
  championName: string;
  championIcon: string;
  role: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  kdaRatio: number;
  cs: number;
  csPerMin: number;
  items: number[]; // Item IDs
  spells: string[];
  runes: {
    primaryStyle: string;
    keystone: string;
  };
  damageDealt: number;
  visionScore: number;
}

export interface PlayerParticipant {
  summonerName: string;
  riotId: string;
  championName: string;
  championIcon: string;
  team: 'blue' | 'red';
  role: 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';
  tier: string;
  rank: string;
  spell1: string;
  spell2: string;
  keystoneRune: string;
}

export interface LiveGameInfo {
  gameId: string;
  gameMode: string;
  gameStartTime: number;
  gameLengthSeconds: number;
  mapId: number;
  userParticipant: PlayerParticipant;
  blueTeam: PlayerParticipant[];
  redTeam: PlayerParticipant[];
}

export interface ItemRecommendation {
  id: number;
  name: string;
  category: 'starter' | 'core' | 'situational' | 'boots';
  reasoning: string;
  iconUrl: string;
  gold: number;
}

export interface RuneRecommendation {
  primaryTree: string;
  keystone: string;
  primaryRunes: string[];
  secondaryTree: string;
  secondaryRunes: string[];
  statShards: string[];
  explanation: string;
}

export interface JungleStep {
  step: number;
  campName: string;
  action: string;
  timing: string;
  tip: string;
  icon: string;
}

export interface GeminiMatchAnalysis {
  matchupSummary: string;
  lanePhaseAdvice: string[];
  powerSpikes: {
    level2: string;
    level6: string;
    itemSpike: string;
  };
  teamfightRole: string;
  itemBuild: ItemRecommendation[];
  runes: RuneRecommendation;
  junglePath?: JungleStep[];
  counterWarnings: string[];
  timestamp: string;
}

export interface VaultCredentials {
  riotApiKey?: string;
  geminiApiKey?: string;
  userNotes?: string;
  isUnlocked: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'gemini';
  text: string;
  timestamp: string;
}
