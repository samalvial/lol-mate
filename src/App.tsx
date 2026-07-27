import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProfileView } from './components/ProfileView';
import { LiveMatchCoach } from './components/LiveMatchCoach';
import { ChampionDatabase } from './components/ChampionDatabase';
import { VaultModal } from './components/VaultModal';
import { AccountModal } from './components/AccountModal';
import { UserAccount, RankedTierInfo, ChampionMastery, MatchSummary, LiveGameInfo } from './types/lol';
import { RiotApiService } from './services/riotApi';
import { MOCK_LIVE_GAME_JUNGLE, MOCK_LIVE_GAME_MID } from './data/mockLiveGame';
import { CryptoVault } from './services/cryptoVault';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'live' | 'champions'>('profile');
  
  // App States
  const [userAccount, setUserAccount] = useState<UserAccount | null>(null);
  const [rankedStats, setRankedStats] = useState<RankedTierInfo[]>([]);
  const [masteries, setMasteries] = useState<ChampionMastery[]>([]);
  const [matches, setMatches] = useState<MatchSummary[]>([]);
  const [liveGame, setLiveGame] = useState<LiveGameInfo>(MOCK_LIVE_GAME_JUNGLE);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  
  // Pro Subscription State
  const [isPro, setIsPro] = useState<boolean>(false);

  // Modals
  const [isVaultOpen, setIsVaultOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    const loadDefaultAccount = async () => {
      const creds = CryptoVault.getCredentials();
      const account = await RiotApiService.fetchAccountByRiotId('Sebam#LoL', 'la2', creds?.riotApiKey);
      setUserAccount(account);

      const [rStats, mList, mHist] = await Promise.all([
        RiotApiService.fetchRankedStats(account.puuid, account.region, creds?.riotApiKey),
        RiotApiService.fetchTopMasteries(account.puuid),
        RiotApiService.fetchMatchHistory(account.puuid)
      ]);

      setRankedStats(rStats);
      setMasteries(mList);
      setMatches(mHist);
    };

    loadDefaultAccount();
  }, []);

  const handleAccountLinked = async (newAccount: UserAccount) => {
    setUserAccount(newAccount);
    const creds = CryptoVault.getCredentials();

    const [rStats, mList, mHist] = await Promise.all([
      RiotApiService.fetchRankedStats(newAccount.puuid, newAccount.region, creds?.riotApiKey),
      RiotApiService.fetchTopMasteries(newAccount.puuid),
      RiotApiService.fetchMatchHistory(newAccount.puuid)
    ]);

    setRankedStats(rStats);
    setMasteries(mList);
    setMatches(mHist);
  };

  const handleRefreshLiveMatch = async () => {
    if (!userAccount) return;
    const creds = CryptoVault.getCredentials();
    const activeGame = await RiotApiService.fetchActiveLiveGame(userAccount.puuid, userAccount.region, creds?.riotApiKey);
    
    if (activeGame) {
      setLiveGame(activeGame);
    } else {
      // Toggle demo game state if no active client match is detected
      if (liveGame.userParticipant.role === 'JUNGLE') {
        setLiveGame(MOCK_LIVE_GAME_MID);
      } else {
        setLiveGame(MOCK_LIVE_GAME_JUNGLE);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userAccount={userAccount}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenAccountModal={() => setIsAccountModalOpen(true)}
        isLiveGameActive={isLiveActive}
        isPro={isPro}
        onTogglePro={() => setIsPro(!isPro)}
      />

      {/* Main Tab Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'profile' && (
          <ProfileView
            account={userAccount}
            rankedStats={rankedStats}
            masteries={masteries}
            matches={matches}
            isPro={isPro}
            onUpgradePro={() => setIsPro(true)}
            onOpenAccountModal={() => setIsAccountModalOpen(true)}
            onOpenVault={() => setIsVaultOpen(true)}
            onCheckLiveGame={() => setActiveTab('live')}
          />
        )}

        {activeTab === 'live' && (
          <LiveMatchCoach
            liveGame={liveGame}
            onRefreshLiveMatch={handleRefreshLiveMatch}
            isPro={isPro}
            onUpgradePro={() => setIsPro(true)}
          />
        )}

        {activeTab === 'champions' && (
          <ChampionDatabase />
        )}
      </main>

      {/* Security Vault Modal */}
      <VaultModal
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        onVaultUpdated={() => {}}
      />

      {/* Account Link Modal */}
      <AccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onAccountLinked={handleAccountLinked}
      />
    </div>
  );
};
