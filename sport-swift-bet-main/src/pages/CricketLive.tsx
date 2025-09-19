import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Trophy, TrendingUp } from 'lucide-react';
import { fetchLiveMatches, fetchUpcomingMatches, formatTime, CricketMatch } from '@/services/cricket';

const CricketLive: React.FC = () => {
  const [liveMatches, setLiveMatches] = useState<CricketMatch[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<CricketMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMatches();
    // Refresh every 30 seconds for live matches
    const interval = setInterval(() => {
      loadLiveMatches();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadLiveMatches = async () => {
    try {
      const matches = await fetchLiveMatches();
      setLiveMatches(matches);
    } catch (err) {
      console.error('Failed to load live matches:', err);
    }
  };

  const loadUpcomingMatches = async () => {
    try {
      const matches = await fetchUpcomingMatches(10);
      setUpcomingMatches(matches);
    } catch (err) {
      console.error('Failed to load upcoming matches:', err);
    }
  };

  const loadMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadLiveMatches(), loadUpcomingMatches()]);
    } catch (err) {
      setError('Failed to load cricket matches');
      console.error('Error loading matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const MatchCard: React.FC<{ match: CricketMatch; isLive?: boolean }> = ({ match, isLive = false }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
            <Badge variant={isLive ? "destructive" : "secondary"}>
              {isLive ? "LIVE" : "UPCOMING"}
            </Badge>
            {match.series && (
              <Badge variant="outline" className="text-xs">
                {match.series}
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(match.startTime)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Teams */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {match.teamA.charAt(0)}
              </div>
              <span className="font-medium">{match.teamA}</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">VS</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium">{match.teamB}</span>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {match.teamB.charAt(0)}
              </div>
            </div>
          </div>

          {/* Live Score */}
          {isLive && (match.scoreA || match.scoreB) && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{match.scoreA || "0/0"}</div>
                  <div className="text-sm text-muted-foreground">
                    {match.wicketsA !== undefined ? `${match.wicketsA} wickets` : ""}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{match.scoreB || "0/0"}</div>
                  <div className="text-sm text-muted-foreground">
                    {match.wicketsB !== undefined ? `${match.wicketsB} wickets` : ""}
                  </div>
                </div>
              </div>
              {match.overs && (
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  Overs: {match.overs}
                </div>
              )}
            </div>
          )}

          {/* Win Probability */}
          {(match.winProbabilityA || match.winProbabilityB) && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${match.winProbabilityA || 0}%` 
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {match.winProbabilityA || 0}% - {match.winProbabilityB || 0}%
              </span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              className="w-full" 
              variant={isLive ? "default" : "outline"}
              onClick={() => window.location.href = `/cricket/match/${match.id}`}
            >
              {isLive ? "View Live Score" : "View Details"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading cricket matches...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <Trophy className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Failed to load matches</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadMatches}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cricket Live</h1>
        <p className="text-muted-foreground">
          Live scores and upcoming matches for the next 10 days
        </p>
      </div>

      <Tabs defaultValue="live" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="live" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Live ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Upcoming ({upcomingMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="mt-6">
          {liveMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <Users className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No live matches</h3>
                <p className="text-muted-foreground">
                  There are currently no live cricket matches. Check back later!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {liveMatches.map((match) => (
                <MatchCard key={match.id} match={match} isLive={true} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingMatches.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <Clock className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No upcoming matches</h3>
                <p className="text-muted-foreground">
                  No cricket matches scheduled for the next 10 days.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingMatches.map((match) => (
                <MatchCard key={match.id} match={match} isLive={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CricketLive;
