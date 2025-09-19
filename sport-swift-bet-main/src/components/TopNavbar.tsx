import { Button } from "@/components/ui/button";
import { Menu, LogIn, UserPlus, Bell } from "lucide-react";

interface TopNavbarProps {
  onMenuClick: () => void;
  onAuthClick: (type: 'login' | 'register') => void;
  user?: { name: string; balance: number } | null;
}

export const TopNavbar = ({ onMenuClick, onAuthClick, user }: TopNavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-background border-b border-border shadow-sm z-30">
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 h-16">
        {/* Left side - Menu toggle */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="hidden lg:block">
            <h1 className="text-lg sm:text-xl font-bold text-primary tracking-wide">Arena<span className="text-2xl sm:text-3xl ml-1">X</span></h1>
          </div>
          <div className="lg:hidden">
            <h1 className="text-lg font-bold text-primary tracking-wide">Arena<span className="text-2xl ml-1">X</span></h1>
          </div>
        </div>

        {/* Center - Top chips bar */}
        <div className="hidden md:flex items-center gap-2 lg:gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('set-section', { detail: { section: 'home' } }))}
          >
            <span>🏠</span>
            <span>Home</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 bg-success/10 hover:bg-success/20 text-success px-3 py-1.5 rounded-full text-xs font-medium transition-smooth"
            onClick={() => window.dispatchEvent(new CustomEvent('set-section', { detail: { section: 'in-play' } }))}
          >
            <div className="w-1.5 h-1.5 bg-current rounded-full animate-ping" />
            <span>35 Live</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.location.href = '/cricket'}
          >
            <span>🏏</span>
            <span>Cricket</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('quick-sport', { detail: { sport: 'soccer' } }))}
          >
            <span>⚽</span>
            <span>Soccer</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('quick-sport', { detail: { sport: 'tennis' } }))}
          >
            <span>🎾</span>
            <span>Tennis</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('set-section', { detail: { section: 'premium' } }))}
          >
            <span>🐎</span>
            <span>Premium Races</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('set-section', { detail: { section: 'casino' } }))}
          >
            <span>♠️</span>
            <span>Casino</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-smooth hover:bg-muted"
            onClick={() => window.dispatchEvent(new CustomEvent('set-section', { detail: { section: 'help' } }))}
          >
            <span>👤</span>
            <span>Help & Support</span>
          </Button>
        </div>

        {/* Right side - User actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 mr-2">
                <div className="text-right">
                  <p className="text-xs sm:text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-success font-bold">
                    ${user.balance.toFixed(2)}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <Button 
                onClick={() => {
                  try { localStorage.removeItem('arena_auth'); } catch {}
                  const evt = new CustomEvent('arena-logout');
                  window.dispatchEvent(evt);
                }}
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => onAuthClick('login')}
                variant="outline" 
                size="sm"
                className="hidden sm:flex items-center gap-1 text-xs px-2"
              >
                <LogIn className="h-3 w-3" />
                Login
              </Button>
              <Button 
                onClick={() => onAuthClick('register')}
                className="flex items-center gap-1 text-xs px-2 sm:px-4 bg-primary hover:bg-primary-dark"
                size="sm"
              >
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Register</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};