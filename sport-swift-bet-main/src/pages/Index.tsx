import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { HeroSection } from "@/components/HeroSection";
import { BettingMarkets } from "@/components/BettingMarkets";
import { HelpSupport } from "@/components/HelpSupport";
import { BetSlip } from "@/components/BetSlip";
import { MyBets } from "@/components/MyBets";
import { AuthModal } from "@/components/AuthModal";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeSection, setActiveSection] = useState("home");
  const [activeSport, setActiveSport] = useState("cricket");
  const [showHero, setShowHero] = useState(true);
  const [user, setUser] = useState<{ name: string; balance: number } | null>(() => {
    try {
      const raw = localStorage.getItem('arena_auth');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  // keep user in sync on logout from navbar
  if (typeof window !== 'undefined') {
    window.addEventListener('arena-logout', () => {
      setUser(null);
      try { localStorage.removeItem('arena_auth'); } catch {}
    });
  }
  const [bets, setBets] = useState<any[]>([]);
  const [myBets, setMyBets] = useState<any[]>([]);
  const { toast } = useToast();

  const handleBetSelect = (bet: any) => {
    const newBet = {
      ...bet,
      id: `${bet.matchId}-${bet.type}-${Date.now()}`,
      stake: 0
    };
    
    setBets(prev => [...prev, newBet]);
    setMyBets(prev => [...prev, { 
      id: newBet.id,
      runnerName: bet.label || `${bet.teamName || 'Unknown'}`,
      betPrice: bet.odds,
      betSize: bet.size || '0',
      type: 'unmatched'
    }]);
    setIsBetSlipOpen(true);
    
    toast({
      title: "Bet added to slip",
      description: `${bet.label} at odds ${bet.odds}`,
    });
  };

  const handleRemoveBet = (betId: string) => {
    setBets(prev => prev.filter(bet => bet.id !== betId));
    setMyBets(prev => prev.filter(bet => bet.id !== betId));
    toast({
      title: "Bet removed",
      description: "Selection removed from bet slip",
    });
  };

  const handleUpdateStake = (betId: string, stake: number) => {
    setBets(prev => prev.map(bet => 
      bet.id === betId ? { ...bet, stake } : bet
    ));
  };

  const handlePlaceBets = () => {
    const totalStake = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
    
    if (!user) {
      setIsAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    if (user.balance < totalStake) {
      toast({
        title: "Insufficient funds",
        description: "Please top up your account to place this bet",
        variant: "destructive",
      });
      return;
    }

    // Simulate bet placement
    setUser(prev => prev ? { ...prev, balance: prev.balance - totalStake } : null);
    setBets([]);
    setIsBetSlipOpen(false);
    
    toast({
      title: "Bets placed successfully!",
      description: `${bets.length} bet(s) placed for $${totalStake.toFixed(2)}`,
    });
  };

  const handleAuth = (userData: any) => {
    setUser(userData);
    localStorage.setItem('arena_auth', JSON.stringify(userData));
    toast({
      title: "Welcome to ArenaX!",
      description: `Successfully ${authMode === 'login' ? 'logged in' : 'registered'}`,
    });
  };

  const handleRemoveMyBet = (betId: string) => {
    setMyBets(prev => prev.filter(bet => bet.id !== betId));
    setBets(prev => prev.filter(bet => bet.id !== betId));
    toast({
      title: "Bet cancelled",
      description: "Bet removed from queue",
    });
  };

  const handleRefreshMyBets = () => {
    toast({
      title: "Refreshed",
      description: "Betting data updated",
    });
  };

  const handleAuthClick = (type: 'login' | 'register') => {
    setAuthMode(type);
    // navigate to login page route
    window.history.pushState({}, '', '/login');
    const navEvent = new PopStateEvent('popstate');
    dispatchEvent(navEvent);
  };

  const handleGetStarted = () => {
    setActiveSection("home");
    setActiveSport("cricket");
    setShowHero(false);
  };

  // Quick sport buttons listener
  if (typeof window !== 'undefined') {
    window.onquickSportHandler?.();
    // simple dedupe setup
    (window as any).onquickSportHandler = () => {};
    window.addEventListener('quick-sport', (e: any) => {
      const sport = e?.detail?.sport;
      if (sport) {
        setActiveSection('home');
        setActiveSport(sport);
        setShowHero(false);
      }
    });
    window.addEventListener('set-section', (e: any) => {
      const section = e?.detail?.section;
      if (section) {
        setActiveSection(section);
        setShowHero(section === 'home');
      }
    });
  }

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="h-full overflow-y-auto">
            {showHero && <HeroSection onGetStarted={handleGetStarted} />}
            <div className="p-2 sm:p-4 md:p-6">
              <BettingMarkets 
                activeSport={activeSport} 
                onBetSelect={handleBetSelect}
              />
            </div>
          </div>
        );
      case "in-play":
        return (
          <div className="h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="text-center py-8 sm:py-12">
              <div className="animate-pulse-glow mb-6">
                <div className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold">
                  <div className="w-2 h-2 bg-current rounded-full animate-ping"></div>
                  LIVE BETTING
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Live In-Play Betting</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Real-time betting on live sports events coming soon!</p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-card p-4 rounded-lg border animate-fade-in">
                  <div className="text-2xl mb-2">⚽</div>
                  <div className="text-sm font-medium">Football</div>
                  <div className="text-xs text-muted-foreground">12 Live</div>
                </div>
                <div className="bg-card p-4 rounded-lg border animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <div className="text-2xl mb-2">🏏</div>
                  <div className="text-sm font-medium">Cricket</div>
                  <div className="text-xs text-muted-foreground">8 Live</div>
                </div>
                <div className="bg-card p-4 rounded-lg border animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="text-2xl mb-2">🎾</div>
                  <div className="text-sm font-medium">Tennis</div>
                  <div className="text-xs text-muted-foreground">15 Live</div>
                </div>
              </div>
            </div>
          </div>
        );
      case "premium":
        return (
          <div className="h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="text-center py-8 sm:py-12">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-warning text-warning-foreground px-4 py-2 rounded-full font-bold">
                  ⭐ PREMIUM
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Premium Features</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8">Advanced analytics and premium betting markets</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border animate-fade-in">
                  <div className="text-3xl mb-3">📊</div>
                  <h3 className="font-bold mb-2">Live Statistics</h3>
                  <p className="text-sm text-muted-foreground">Real-time match analytics and data insights</p>
                </div>
                <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-6 rounded-lg border animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <div className="text-3xl mb-3">🎯</div>
                  <h3 className="font-bold mb-2">Expert Tips</h3>
                  <p className="text-sm text-muted-foreground">Professional betting recommendations</p>
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-lg border animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <div className="text-3xl mb-3">💰</div>
                  <h3 className="font-bold mb-2">Enhanced Odds</h3>
                  <p className="text-sm text-muted-foreground">Better odds for premium members</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "casino":
        return (
          <div className="h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="text-center py-8 sm:py-12">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold animate-pulse-glow">
                  🎰 CASINO
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Online Casino</h2>
              <p className="text-muted-foreground text-sm sm:text-base mb-8">Slots, table games, and live dealer experiences</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 p-4 sm:p-6 rounded-lg border animate-fade-in hover:scale-105 transition-smooth cursor-pointer">
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎰</div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2">Slots</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">500+ Games</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-4 sm:p-6 rounded-lg border animate-fade-in hover:scale-105 transition-smooth cursor-pointer" style={{animationDelay: '0.1s'}}>
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🃏</div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2">Poker</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Live Tables</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 p-4 sm:p-6 rounded-lg border animate-fade-in hover:scale-105 transition-smooth cursor-pointer" style={{animationDelay: '0.2s'}}>
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎲</div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2">Dice</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Classic Games</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 p-4 sm:p-6 rounded-lg border animate-fade-in hover:scale-105 transition-smooth cursor-pointer" style={{animationDelay: '0.3s'}}>
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
                  <h3 className="text-sm sm:text-base font-bold mb-1 sm:mb-2">Roulette</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">Live Dealers</p>
                </div>
              </div>
            </div>
          </div>
        );
      case "help":
        return <HelpSupport />;
      case "profile":
        return (
          <div className="h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <div className="text-center py-8 sm:py-12">
              <div className="mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold mx-auto mb-4 animate-fade-in">
                  {user ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">My Account</h2>
              {user ? (
                <div className="space-y-4 sm:space-y-6 max-w-md mx-auto">
                  <div className="bg-card p-4 sm:p-6 rounded-lg border animate-fade-in">
                    <p className="text-lg sm:text-xl font-medium mb-2">Welcome back, {user.name}!</p>
                    <div className="flex items-center justify-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full">
                      <span className="text-xl">💰</span>
                      <span className="font-bold text-lg sm:text-xl">Balance: ${user.balance.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="bg-primary/10 p-3 sm:p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">📊</div>
                      <div className="text-sm font-medium">Total Bets</div>
                      <div className="text-xs text-muted-foreground">{myBets.length}</div>
                    </div>
                    <div className="bg-accent/10 p-3 sm:p-4 rounded-lg text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
                      <div className="text-xl sm:text-2xl mb-1 sm:mb-2">🏆</div>
                      <div className="text-sm font-medium">Win Rate</div>
                      <div className="text-xs text-muted-foreground">85%</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 max-w-md mx-auto">
                  <p className="text-muted-foreground text-sm sm:text-base">Please log in to view your account</p>
                  <div className="bg-card p-4 sm:p-6 rounded-lg border animate-fade-in">
                    <h3 className="font-bold mb-2">Join ArenaX Today!</h3>
                    <p className="text-sm text-muted-foreground mb-4">Start betting with the best odds and promotions</p>
                    <button 
                      onClick={() => handleAuthClick('register')}
                      className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-medium hover:bg-primary-dark transition-smooth"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full overflow-y-auto p-2 sm:p-4 md:p-6">
            <BettingMarkets 
              activeSport={activeSport} 
              onBetSelect={handleBetSelect}
            />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar 
        onMenuClick={() => setIsSidebarOpen(true)}
        onAuthClick={handleAuthClick}
        user={user}
      />
      
      <div className="flex min-h-screen pt-16">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setShowHero(section === "home");
            setIsSidebarOpen(false);
          }}
          activeSport={activeSport}
          onSportChange={(sport) => {
            setActiveSport(sport);
            setActiveSection("home");
            setShowHero(false);
            setIsSidebarOpen(false);
          }}
        />
        
        <div className="flex flex-1 w-full max-w-full overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 min-w-0 lg:ml-80 max-w-full">
            <div className="w-full h-full overflow-y-auto no-scrollbar">
              {renderContent()}
            </div>
          </main>
          
          {/* Right Sidebar - My Bets - Desktop Only */}
          <div className="hidden xl:block w-80 2xl:w-96 bg-card border-l border-border flex-shrink-0">
            <div className="p-4 h-full overflow-y-auto no-scrollbar">
              <MyBets 
                bets={myBets}
                onRemoveBet={handleRemoveMyBet}
                onRefresh={handleRefreshMyBets}
              />
            </div>
          </div>
        </div>
      </div>

      
      <BetSlip
        bets={bets}
        onRemoveBet={handleRemoveBet}
        onUpdateStake={handleUpdateStake}
        onPlaceBets={handlePlaceBets}
        isOpen={isBetSlipOpen}
        onClose={() => setIsBetSlipOpen(false)}
      />

      {/* Floating Bet Slip Toggle - Mobile */}
      {bets.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40 xl:hidden">
          <button
            onClick={() => setIsBetSlipOpen(true)}
            className="bg-primary text-primary-foreground rounded-full p-4 shadow-elegant animate-pulse-glow transition-smooth"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">{bets.length}</span>
              <span className="text-sm">Bet{bets.length > 1 ? 's' : ''}</span>
            </div>
          </button>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onAuth={handleAuth}
      />
    </div>
  );
};

export default Index;
