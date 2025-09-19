import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, TrendingUp, Star, Eye, Calendar, Users } from "lucide-react";

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  odds: {
    home: number;
    draw?: number;
    away: number;
  };
  isLive?: boolean;
  timeLeft?: string;
  category: string;
  viewers?: number;
}

interface BettingMarketsProps {
  activeSport: string;
  onBetSelect: (bet: any) => void;
}

const sampleMatches: { [key: string]: Match[] } = {
  cricket: [
    {
      id: "wodi-1",
      homeTeam: "India W",
      awayTeam: "Australia W",
      homeFlag: "🇮🇳",
      awayFlag: "🇦🇺",
      odds: { home: 2.52, away: 1.65 },
      isLive: true,
      timeLeft: "Coming Up",
      category: "Women's One Day Internationals",
      viewers: 15420
    },
    {
      id: "asia-cup-1",
      homeTeam: "Pakistan W",
      awayTeam: "United Arab Emirates",
      homeFlag: "🇵🇰",
      awayFlag: "🇦🇪",
      odds: { home: 1.09, away: 11.5 },
      timeLeft: "Today 20:00",
      category: "Asia Cup",
      viewers: 8930
    },
    {
      id: "t20-intl-1",
      homeTeam: "Ireland",
      awayTeam: "England",
      homeFlag: "🇮🇪",
      awayFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
      odds: { home: 13.5, away: 1.07 },
      timeLeft: "Today 18:00",
      category: "International Twenty20 Matches",
      viewers: 25340
    },
    {
      id: "cpl-1",
      homeTeam: "St. Lucia Kings",
      awayTeam: "Guyana Amazon Warriors",
      homeFlag: "🏏",
      awayFlag: "🏏",
      odds: { home: 2.18, away: 1.85 },
      timeLeft: "Tomorrow 05:30",
      category: "Caribbean Premier League",
      viewers: 8760
    },
    {
      id: "wcpl-1",
      homeTeam: "Barbados Royals W",
      awayTeam: "Guyana Amazon Warriors W",
      homeFlag: "🏏",
      awayFlag: "🏏",
      odds: { home: 1.7, away: 2.38 },
      timeLeft: "Today 23:30",
      category: "Women's Caribbean Premier League",
      viewers: 12450
    }
  ],
  soccer: [
    {
      id: "s1",
      homeTeam: "Chelsea",
      awayTeam: "Arsenal",
      homeFlag: "🔵",
      awayFlag: "🔴",
      odds: { home: 2.5, draw: 3.2, away: 2.8 },
      isLive: true,
      timeLeft: "67'",
      category: "Premier League",
      viewers: 25670
    },
    {
      id: "s2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      homeFlag: "🔴",
      awayFlag: "⚪",
      odds: { home: 2.1, draw: 3.5, away: 3.1 },
      timeLeft: "Tomorrow 8:00 PM",
      category: "La Liga",
      viewers: 45230
    }
  ],
  tennis: [
    {
      id: "t1",
      homeTeam: "Novak Djokovic",
      awayTeam: "Rafael Nadal",
      homeFlag: "🇷🇸",
      awayFlag: "🇪🇸",
      odds: { home: 1.7, away: 2.3 },
      isLive: true,
      timeLeft: "Set 2",
      category: "ATP Masters",
      viewers: 12450
    }
  ]
};

// simple derived list of live matches
const getLiveMatches = (): Match[] => {
  return Object.values(sampleMatches).flat().filter(m => m.isLive);
};

export const BettingMarkets = ({ activeSport, onBetSelect }: BettingMarketsProps) => {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  
  const matches = sampleMatches[activeSport] || [];

  const renderOddsButton = (odds: number, label: string, matchId: string, type: string, tone: "back" | "lay" = "back") => (
    <button
      onClick={() => onBetSelect({ matchId, type, odds, label })}
      className={
        `px-3 py-2 rounded text-sm font-semibold min-w-[58px] border transition-smooth ` +
        (tone === "back"
          ? "bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300"
          : "bg-pink-100 hover:bg-pink-200 text-pink-900 border-pink-300")
      }
    >
      {odds.toFixed(2)}
    </button>
  );

  const buildLadder = (base: number) => {
    const b2 = +(base - 0.02).toFixed(2);
    const b3 = +(base - 0.04).toFixed(2);
    const l1 = +(base + 0.02).toFixed(2);
    const l2 = +(base + 0.04).toFixed(2);
    const l3 = +(base + 0.06).toFixed(2);
    return { b: [b3, b2, base], l: [l1, l2, l3] };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold capitalize">{activeSport} Markets</h2>
          <p className="text-muted-foreground">Live and upcoming matches</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Eye className="h-3 w-3" />
            {matches.filter(m => m.isLive).length} Live
          </Badge>
          <Badge variant="outline">
            {matches.length} Total Markets
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-3 mt-6">
          {matches.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">No markets available for {activeSport} at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back soon for exciting betting opportunities!</p>
              </CardContent>
            </Card>
          ) : (
            matches.map((match) => {
              const home = buildLadder(match.odds.home);
              const draw = match.odds.draw ? buildLadder(match.odds.draw) : null;
              const away = buildLadder(match.odds.away);
              return (
                <Card key={match.id} className="bg-card border-border rounded-lg overflow-hidden shadow-card animate-fade-in">
                  <div className="bg-primary text-primary-foreground px-3 sm:px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-xs sm:text-sm font-medium truncate">{match.category}</span>
                      <Badge variant={match.isLive ? "destructive" : "secondary"} className="text-xs">
                        {match.isLive ? "LIVE" : "Coming Up"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Clock className="h-3 w-3" />
                      <span>{match.timeLeft}</span>
                    </div>
                  </div>
                  <CardContent className="p-3 sm:p-4">
                    {/* Header row  Back / Lay */}
                    <div className="grid grid-cols-12 text-[11px] sm:text-xs font-medium text-muted-foreground mb-2">
                      <div className="col-span-6"></div>
                      <div className="col-span-3 text-center">Back</div>
                      <div className="col-span-3 text-center">Lay</div>
                    </div>
                    {/* Single match row with ladder of 3 back and 3 lay like exchange */}
                    <div className="grid grid-cols-12 items-center gap-2 py-2 border-b border-border">
                      <div className="col-span-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-base sm:text-lg">{match.homeFlag}</span>
                            <span className="truncate">{match.homeTeam}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-base sm:text-lg">{match.awayFlag}</span>
                            <span className="truncate">{match.awayTeam}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-3 flex justify-center gap-1 sm:gap-2">
                        {home.b.map((p, i) => (
                          <span key={`hb-${i}`}>{renderOddsButton(p, "Home", match.id, "home", "back")}</span>
                        ))}
                      </div>
                      <div className="col-span-3 flex justify-center gap-1 sm:gap-2">
                        {away.l.map((p, i) => (
                          <span key={`la-${i}`}>{renderOddsButton(p, "Away", match.id, "away", "lay")}</span>
                        ))}
                      </div>
                    </div>
                    {/* Optional draw line for 3-way markets */}
                    {draw && (
                      <div className="grid grid-cols-12 items-center gap-2 py-2 border-b border-border">
                        <div className="col-span-6 text-sm text-muted-foreground">Draw</div>
                        <div className="col-span-3 flex justify-center gap-1 sm:gap-2">
                          {draw.b.map((p, i) => (
                            <span key={`db-${i}`}>{renderOddsButton(p, "Draw", match.id, "draw", "back")}</span>
                          ))}
                        </div>
                        <div className="col-span-3 flex justify-center gap-1 sm:gap-2">
                          {draw.l.map((p, i) => (
                            <span key={`dl-${i}`}>{renderOddsButton(p, "Draw", match.id, "draw", "lay")}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Footer info */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        {match.viewers && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="hidden sm:inline">{match.viewers.toLocaleString()} viewers</span>
                            <span className="sm:hidden">{(match.viewers / 1000).toFixed(1)}k</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="hidden sm:inline">Exchange</span>
                          <span className="sm:hidden">EX</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        <span className="hidden sm:inline">Add to Favorites</span>
                        <span className="sm:hidden">Fav</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="live" className="space-y-4 mt-6">
          {getLiveMatches().map((match) => (
            <Card key={match.id} className="shadow-card border-destructive/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse-glow">
                    ● LIVE
                  </Badge>
                  <span className="text-sm text-muted-foreground">{match.category}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{match.homeFlag}</span>
                      <span className="font-semibold">{match.homeTeam}</span>
                    </div>
                    {renderOddsButton(match.odds.home, "Home", match.id, "home")}
                  </div>
                  
                  {match.odds.draw && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🤝</span>
                        <span className="text-muted-foreground">Draw</span>
                      </div>
                      {renderOddsButton(match.odds.draw, "Draw", match.id, "draw")}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{match.awayFlag}</span>
                      <span className="font-semibold">{match.awayTeam}</span>
                    </div>
                    {renderOddsButton(match.odds.away, "Away", match.id, "away")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {matches.filter(m => !m.isLive).map((match) => (
            <Card key={match.id} className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{match.homeFlag}</span>
                      <span className="font-semibold">{match.homeTeam}</span>
                      <span className="text-muted-foreground">vs</span>
                      <span className="text-xl">{match.awayFlag}</span>
                      <span className="font-semibold">{match.awayTeam}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {match.timeLeft}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {renderOddsButton(match.odds.home, "Home", match.id, "home")}
                    {match.odds.draw && renderOddsButton(match.odds.draw, "Draw", match.id, "draw")}
                    {renderOddsButton(match.odds.away, "Away", match.id, "away")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="popular" className="space-y-4 mt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Popular markets will be displayed here based on betting volume and user interest.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};