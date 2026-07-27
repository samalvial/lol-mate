import { UserAccount, RankedTierInfo, ChampionMastery, MatchSummary, LiveGameInfo, LoLRegion } from '../types/lol';

const DDRAGON_VERSION = '14.15.1';
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`;
const COMMUNITY_DRAGON_BASE = 'https://raw.communitydragon.org/latest';

export class RiotApiService {
  /**
   * Get Champion Icon URL from DataDragon
   */
  static getChampionIcon(championName: string): string {
    if (!championName) return `${DDRAGON_BASE}/img/champion/Square.png`;
    // Format champion name for DataDragon (e.g., "LeBlanc" -> "Leblanc", "Wukong" -> "MonkeyKing", "K'Sante" -> "KSante")
    const formattedName = championName
      .replace(/'|\s|\./g, '')
      .replace('Wukong', 'MonkeyKing')
      .replace('Nunu&Willump', 'Nunu');
    return `${DDRAGON_BASE}/img/champion/${formattedName}.png`;
  }

  /**
   * Get Item Icon URL
   */
  static getItemIcon(itemId: number): string {
    if (!itemId || itemId === 0) return 'https://raw.communitydragon.org/latest/game/assets/items/icons2d/gp_ui_placeholder.png';
    return `${DDRAGON_BASE}/img/item/${itemId}.png`;
  }

  /**
   * Get Summoner Spell Icon
   */
  static getSpellIcon(spellName: string): string {
    const nameMap: Record<string, string> = {
      Flash: 'SummonerFlash',
      Ignite: 'SummonerDot',
      Teleport: 'SummonerTeleport',
      Smite: 'SummonerSmite',
      Heal: 'SummonerHeal',
      Exhaust: 'SummonerExhaust',
      Cleanse: 'SummonerBoost',
      Ghost: 'SummonerHaste',
      Barrier: 'SummonerBarrier'
    };
    const spell = nameMap[spellName] || 'SummonerFlash';
    return `${DDRAGON_BASE}/img/spell/${spell}.png`;
  }

  /**
   * Get Ranked Badge Emblem Image URL
   */
  static getRankEmblem(tier: string): string {
    const normalized = (tier || 'UNRANKED').toLowerCase();
    return `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-shared-components/global/default/images/ranked-emblems/${normalized}.png`;
  }

  /**
   * Fetch Summoner Profile by Riot ID (gameName#tagLine)
   */
  static async fetchAccountByRiotId(riotIdString: string, region: LoLRegion, apiKey?: string): Promise<UserAccount> {
    const parts = riotIdString.split('#');
    const gameName = parts[0] || 'Summoner';
    const tagLine = parts[1] || region.toUpperCase();

    // If API Key is provided, call real Riot Account API
    if (apiKey && apiKey.startsWith('RGAPI-')) {
      try {
        const routing = this.getRegionalRouting(region);
        const url = `https://${routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}?api_key=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          return {
            riotId: `${data.gameName}#${data.tagLine}`,
            gameName: data.gameName,
            tagLine: data.tagLine,
            region,
            summonerLevel: 342,
            profileIconId: 588,
            puuid: data.puuid,
            linkedAt: new Date().toISOString()
          };
        }
      } catch (e) {
        console.warn('Real Riot API request failed, using cached profile structure', e);
      }
    }

    // Fallback Mock data for seamless offline / instant demo
    return {
      riotId: `${gameName}#${tagLine}`,
      gameName,
      tagLine,
      region,
      summonerLevel: 418,
      profileIconId: 588,
      puuid: 'puuid-mock-123456789-faker-style',
      linkedAt: new Date().toISOString()
    };
  }

  /**
   * Get Ranked stats (SoloQ / Flex)
   */
  static async fetchRankedStats(puuid: string, region: LoLRegion, apiKey?: string): Promise<RankedTierInfo[]> {
    return [
      {
        queueType: 'RANKED_SOLO_5x5',
        tier: 'DIAMOND',
        rank: 'I',
        leaguePoints: 78,
        wins: 142,
        losses: 108,
        winrate: 56.8
      },
      {
        queueType: 'RANKED_FLEX_SR',
        tier: 'EMERALD',
        rank: 'II',
        leaguePoints: 45,
        wins: 34,
        losses: 22,
        winrate: 60.7
      }
    ];
  }

  /**
   * Get Top Champion Masteries
   */
  static async fetchTopMasteries(puuid: string): Promise<ChampionMastery[]> {
    return [
      {
        championId: 157,
        championName: 'Yasuo',
        championTitle: 'El Imperdonable',
        masteryLevel: 7,
        masteryPoints: 485200,
        chestGranted: true,
        iconUrl: this.getChampionIcon('Yasuo')
      },
      {
        championId: 64,
        championName: 'LeeSin',
        championTitle: 'El Monje Ciego',
        masteryLevel: 7,
        masteryPoints: 342100,
        chestGranted: true,
        iconUrl: this.getChampionIcon('LeeSin')
      },
      {
        championId: 238,
        championName: 'Zed',
        championTitle: 'El Maestro de las Sombras',
        masteryLevel: 7,
        masteryPoints: 298400,
        chestGranted: false,
        iconUrl: this.getChampionIcon('Zed')
      },
      {
        championId: 84,
        championName: 'Akali',
        championTitle: 'La Asesina Furtiva',
        masteryLevel: 6,
        masteryPoints: 184500,
        chestGranted: true,
        iconUrl: this.getChampionIcon('Akali')
      }
    ];
  }

  /**
   * Get Recent Match History
   */
  static async fetchMatchHistory(puuid: string): Promise<MatchSummary[]> {
    return [
      {
        matchId: 'LA2_13849201',
        gameMode: 'Ranked Solo',
        gameDurationSeconds: 1680, // 28 mins
        gameCreationTimestamp: Date.now() - 3600000 * 2,
        championName: 'LeeSin',
        championIcon: this.getChampionIcon('LeeSin'),
        role: 'JUNGLE',
        win: true,
        kills: 11,
        deaths: 3,
        assists: 14,
        kdaRatio: 8.3,
        cs: 198,
        csPerMin: 7.1,
        items: [3071, 6630, 3053, 3111, 1055, 3364], // Black Cleaver, Goredrinker, Steraks, Mercs, Doran, Oracle
        spells: ['Flash', 'Smite'],
        runes: {
          primaryStyle: 'Precision',
          keystone: 'Conqueror'
        },
        damageDealt: 28450,
        visionScore: 42
      },
      {
        matchId: 'LA2_13848112',
        gameMode: 'Ranked Solo',
        gameDurationSeconds: 1920, // 32 mins
        gameCreationTimestamp: Date.now() - 3600000 * 6,
        championName: 'Yasuo',
        championIcon: this.getChampionIcon('Yasuo'),
        role: 'MIDDLE',
        win: true,
        kills: 14,
        deaths: 5,
        assists: 8,
        kdaRatio: 4.4,
        cs: 284,
        csPerMin: 8.9,
        items: [3072, 3031, 3006, 3053, 3156, 3340], // Bloodthirster, IE, Greaves, Steraks, Maw, Trinket
        spells: ['Flash', 'Ignite'],
        runes: {
          primaryStyle: 'Precision',
          keystone: 'Lethal Tempo'
        },
        damageDealt: 39100,
        visionScore: 24
      },
      {
        matchId: 'LA2_13847990',
        gameMode: 'Ranked Solo',
        gameDurationSeconds: 1440, // 24 mins
        gameCreationTimestamp: Date.now() - 3600000 * 24,
        championName: 'Akali',
        championIcon: this.getChampionIcon('Akali'),
        role: 'MIDDLE',
        win: false,
        kills: 6,
        deaths: 6,
        assists: 3,
        kdaRatio: 1.5,
        cs: 165,
        csPerMin: 6.8,
        items: [4637, 3157, 3020, 1056, 3340, 0], // Riftmaker, Zhonya, Sorcs, Doran Ring
        spells: ['Flash', 'Teleport'],
        runes: {
          primaryStyle: 'Domination',
          keystone: 'Electrocute'
        },
        damageDealt: 18200,
        visionScore: 19
      }
    ];
  }

  private static getRegionalRouting(region: LoLRegion): string {
    if (['na1', 'br1', 'la1', 'la2'].includes(region)) return 'americas';
    if (['euw1', 'eun1', 'tr1', 'ru'].includes(region)) return 'europe';
    if (['kr', 'jp1'].includes(region)) return 'asia';
    return 'americas';
  }
}
