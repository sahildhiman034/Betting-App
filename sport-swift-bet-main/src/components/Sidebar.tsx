import { useState } from "react";
import { 
  Home, 
  PlayCircle, 
  Star, 
  Dice1, 
  HelpCircle, 
  User,
  ChevronDown,
  Search,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const sportsCategories = [
  { id: "cricket", name: "Cricket", icon: "🏏", count: 24 },
  { id: "soccer", name: "Soccer", icon: "⚽", count: 156 },
  { id: "tennis", name: "Tennis", icon: "🎾", count: 42 },
  { id: "horse-racing", name: "Horse Racing", icon: "🏇", count: 18 },
  { id: "greyhound", name: "Greyhound Racing", icon: "🐕", count: 12 },
  { id: "basketball", name: "Basketball", icon: "🏀", count: 38 },
  { id: "boxing", name: "Boxing", icon: "🥊", count: 8 },
  { id: "darts", name: "Darts", icon: "🎯", count: 6 },
  { id: "golf", name: "Golf", icon: "⛳", count: 15 },
  { id: "mma", name: "Mixed Martial Arts", icon: "🥋", count: 4 },
  { id: "casino", name: "Casino", icon: "🎰", count: 25 },
  { id: "esports", name: "Esports", icon: "🎮", count: 16 },
];

const topNavItems = [
  { id: "home", name: "Home", icon: Home },
  { id: "in-play", name: "In Play", icon: PlayCircle },
  { id: "premium", name: "Premium", icon: Star },
  { id: "casino", name: "Casino", icon: Dice1 },
  { id: "help", name: "Help & Support", icon: HelpCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
  activeSport: string;
  onSportChange: (sport: string) => void;
}

export const Sidebar = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange,
  activeSport,
  onSportChange 
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>(["sports"]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const filteredSports = sportsCategories.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] bg-sidebar text-sidebar-foreground z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed lg:z-auto
        w-80 flex flex-col shadow-elegant
      `}>
        {/* Header */}
        <div className="p-4 border-b bg-sidebar-accent border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-sidebar-foreground">ArenaX</h1>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent/60 transition-smooth"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-sm text-sidebar-foreground/80 mb-3">
            WELCOME TO ArenaX.
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/60" />
            <Input
              placeholder="Search Market..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/60 focus:bg-sidebar-accent/80 transition-smooth"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Top Navigation Items */}
          <div className="p-2">
            {topNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    sport-nav-item w-full text-left
                    ${activeSection === item.id ? 'active' : ''}
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Popular Sports Section */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection("popular")}
              className="sport-nav-item w-full text-left"
            >
              <Star className="h-5 w-5" />
              <span>Popular Sports</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${
                expandedSections.includes("popular") ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.includes("popular") && (
              <div className="ml-4 space-y-1 animate-fade-in">
                {['cricket', 'soccer', 'tennis'].map((sport) => {
                  const sportData = sportsCategories.find(s => s.id === sport);
                  return (
                     <button
                      key={sport}
                      onClick={() => onSportChange(sport)}
                      className={`
                        flex items-center gap-3 px-3 py-2 text-sidebar-foreground/90 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-smooth cursor-pointer rounded mx-2 w-full text-left text-sm
                        ${activeSport === sport ? 'bg-accent/80 text-accent-foreground' : ''}
                      `}
                    >
                      <span className="text-base">{sportData?.icon}</span>
                      <span className="flex-1">{sportData?.name}</span>
                      <span className="text-xs text-sidebar-foreground/80 bg-sidebar-accent px-2 py-0.5 rounded-full min-w-[24px] text-center">{sportData?.count}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* All Sports Section */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection("sports")}
              className="sport-nav-item w-full text-left"
            >
              <Dice1 className="h-5 w-5" />
              <span>All Sports</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${
                expandedSections.includes("sports") ? 'rotate-180' : ''
              }`} />
            </button>
            
            {expandedSections.includes("sports") && (
              <div className="ml-4 space-y-1 animate-fade-in">
                {filteredSports.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => onSportChange(sport.id)}
                    className={`
                      flex items-center gap-3 px-3 py-2 text-sidebar-foreground/90 hover:text-sidebar-foreground hover:bg-sidebar-accent/60 transition-smooth cursor-pointer rounded mx-2 w-full text-left text-sm
                      ${activeSport === sport.id ? 'bg-accent/80 text-accent-foreground' : ''}
                    `}
                  >
                    <span className="text-base">{sport.icon}</span>
                    <span className="flex-1">{sport.name}</span>
                    <span className="text-xs text-sidebar-foreground/80 bg-sidebar-accent px-2 py-0.5 rounded-full min-w-[24px] text-center">{sport.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Casino Section */}
          <div className="mt-4">
            <button
              onClick={() => toggleSection("casino")}
              className="sport-nav-item w-full text-left"
            >
              <Dice1 className="h-5 w-5" />
              <span>All Casinos</span>
              <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${
                expandedSections.includes("casino") ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-primary-foreground/20">
          <button 
            onClick={() => onSectionChange("profile")}
            className="sport-nav-item w-full text-left"
          >
            <User className="h-5 w-5" />
            <span>My Account</span>
          </button>
        </div>
      </div>
    </>
  );
};