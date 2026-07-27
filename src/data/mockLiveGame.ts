import { LiveGameInfo } from '../types/lol';
import { RiotApiService } from '../services/riotApi';

export const MOCK_LIVE_GAME_JUNGLE: LiveGameInfo = {
  gameId: 'LIVE_GAME_8839210',
  gameMode: 'Ranked Solo/Duo',
  gameStartTime: Date.now() - 640000, // 10 mins 40s in game
  gameLengthSeconds: 640,
  mapId: 11, // Summoner's Rift
  userParticipant: {
    summonerName: 'Sebam #LoL',
    riotId: 'Sebam#LoL',
    championName: 'LeeSin',
    championIcon: RiotApiService.getChampionIcon('LeeSin'),
    team: 'blue',
    role: 'JUNGLE',
    tier: 'DIAMOND',
    rank: 'I',
    spell1: 'Flash',
    spell2: 'Smite',
    keystoneRune: 'Conqueror'
  },
  blueTeam: [
    {
      summonerName: 'AlphaTop #NA1',
      riotId: 'AlphaTop#NA1',
      championName: 'Aatrox',
      championIcon: RiotApiService.getChampionIcon('Aatrox'),
      team: 'blue',
      role: 'TOP',
      tier: 'DIAMOND',
      rank: 'II',
      spell1: 'Flash',
      spell2: 'Teleport',
      keystoneRune: 'Conqueror'
    },
    {
      summonerName: 'Sebam #LoL',
      riotId: 'Sebam#LoL',
      championName: 'LeeSin',
      championIcon: RiotApiService.getChampionIcon('LeeSin'),
      team: 'blue',
      role: 'JUNGLE',
      tier: 'DIAMOND',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Smite',
      keystoneRune: 'Conqueror'
    },
    {
      summonerName: 'FakerFan #KR1',
      riotId: 'FakerFan#KR1',
      championName: 'Ahri',
      championIcon: RiotApiService.getChampionIcon('Ahri'),
      team: 'blue',
      role: 'MIDDLE',
      tier: 'MASTER',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Ignite',
      keystoneRune: 'Electrocute'
    },
    {
      summonerName: 'Vaynard #LA2',
      riotId: 'Vaynard#LA2',
      championName: 'Kaisa',
      championIcon: RiotApiService.getChampionIcon('Kaisa'),
      team: 'blue',
      role: 'BOTTOM',
      tier: 'DIAMOND',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Heal',
      keystoneRune: 'Lethal Tempo'
    },
    {
      summonerName: 'ThreshGod #EUW',
      riotId: 'ThreshGod#EUW',
      championName: 'Nautilus',
      championIcon: RiotApiService.getChampionIcon('Nautilus'),
      team: 'blue',
      role: 'UTILITY',
      tier: 'EMERALD',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Exhaust',
      keystoneRune: 'Aftershock'
    }
  ],
  redTeam: [
    {
      summonerName: 'DariusKing #EUW',
      riotId: 'DariusKing#EUW',
      championName: 'Darius',
      championIcon: RiotApiService.getChampionIcon('Darius'),
      team: 'red',
      role: 'TOP',
      tier: 'DIAMOND',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Ghost',
      keystoneRune: 'Conqueror'
    },
    {
      summonerName: 'ShadowJg #KR1',
      riotId: 'ShadowJg#KR1',
      championName: 'Viego',
      championIcon: RiotApiService.getChampionIcon('Viego'),
      team: 'red',
      role: 'JUNGLE',
      tier: 'MASTER',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Smite',
      keystoneRune: 'Conqueror'
    },
    {
      summonerName: 'SyndraBot #NA1',
      riotId: 'SyndraBot#NA1',
      championName: 'Syndra',
      championIcon: RiotApiService.getChampionIcon('Syndra'),
      team: 'red',
      role: 'MIDDLE',
      tier: 'DIAMOND',
      rank: 'II',
      spell1: 'Flash',
      spell2: 'Teleport',
      keystoneRune: 'First Strike'
    },
    {
      summonerName: 'CaitlynPro #BR1',
      riotId: 'CaitlynPro#BR1',
      championName: 'Caitlyn',
      championIcon: RiotApiService.getChampionIcon('Caitlyn'),
      team: 'red',
      role: 'BOTTOM',
      tier: 'DIAMOND',
      rank: 'I',
      spell1: 'Flash',
      spell2: 'Cleanse',
      keystoneRune: 'Lethal Tempo'
    },
    {
      summonerName: 'MorganaMain #LA1',
      riotId: 'MorganaMain#LA1',
      championName: 'Morgana',
      championIcon: RiotApiService.getChampionIcon('Morgana'),
      team: 'red',
      role: 'UTILITY',
      tier: 'DIAMOND',
      rank: 'III',
      spell1: 'Flash',
      spell2: 'Ignite',
      keystoneRune: 'Arcane Comet'
    }
  ]
};

export const MOCK_LIVE_GAME_MID: LiveGameInfo = {
  ...MOCK_LIVE_GAME_JUNGLE,
  gameId: 'LIVE_GAME_9940121',
  userParticipant: {
    summonerName: 'Sebam #LoL',
    riotId: 'Sebam#LoL',
    championName: 'Yasuo',
    championIcon: RiotApiService.getChampionIcon('Yasuo'),
    team: 'blue',
    role: 'MIDDLE',
    tier: 'DIAMOND',
    rank: 'I',
    spell1: 'Flash',
    spell2: 'Ignite',
    keystoneRune: 'Lethal Tempo'
  }
};
