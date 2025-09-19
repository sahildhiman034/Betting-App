import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Clock, Users, Trophy, TrendingUp, Target } from 'lucide-react';
import { fetchMatchDetail, formatTime, CricketMatch } from '@/services/cricket';

interface Player {
  id: string;
  name: string;
  role: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strikeRate?: number;
  overs?: number;
  wickets?: number;
  economy?: number;
}

interface Team {
  id: string;
  name: string;
  shortName: string;
  players: Player[];
}

interface MatchDetailData {
  match: CricketMatch;
  teams: Team[];
  scorecard?: any;
  commentary?: any;
}

const MatchDetail: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [matchData, setMatchData] = useState<MatchDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (matchId) {
      loadMatchDetail();
    }
  }, [matchId]);

  const loadMatchDetail = async () => {
    if (!matchId) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMatchDetail(matchId);
      if (data) {
        setMatchData(data);
      } else {
        setError('Match details not found');
      }
    } catch (err) {
      setError('Failed to load match details');
      console.error('Error loading match details:', err);
    } finally {
      setLoading(false);
    }
  };

  const PlayerCard: React.FC<{ player: Player; teamColor: string }> = ({ player, teamColor }) => (
    <Card className="mb-2">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${teamColor}`}>
              {player.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">{player.name}</div>
              <div className="text-sm text-muted-foreground">{player.role}</div>
            </div>
          </div>
          <div className="text-right">
            {player.runs !== undefined && (
              <div className="text-lg font-bold">{player.runs}</div>
            )}
            {player.balls !== undefined && (
              <div className="text-sm text-muted-foreground">{player.balls} balls</div>
            )}
            {player.strikeRate !== undefined && (
              <div className="text-sm text-muted-foreground">SR: {player.strikeRate}</div>
            )}
          </div>
        </div>
        {(player.fours || player.sixes || player.wickets || player.economy) && (
          <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
            {player.fours !== undefined && <span>4s: {player.fours}</span>}
            {player.sixes !== undefined && <span>6s: {player.sixes}</span>}
            {player.wickets !== undefined && <span>W: {player.wickets}</span>}
            {player.economy !== undefined && <span>Econ: {player.economy}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading match details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-red-500 mb-4">
              <Trophy className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Match not found</h3>
            <p className="text-muted-foreground mb-4">{error || 'The requested match could not be found.'}</p>
            <Button onClick={() => navigate('/cricket')}>Back to Cricket</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { match, teams } = matchData;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/cricket')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cricket
        </Button>
        
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={match.state === 'live' ? "destructive" : "secondary"}>
            {match.state === 'live' ? "LIVE" : match.state === 'upcoming' ? "UPCOMING" : "COMPLETED"}
          </Badge>
          {match.series && (
            <Badge variant="outline">
              {match.series}
            </Badge>
          )}
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatTime(match.startTime)}
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {match.teamA} vs {match.teamB}
        </h1>
      </div>

      {/* Live Score */}
      {match.state === 'live' && (match.scoreA || match.scoreB) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Live Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{match.scoreA || "0/0"}</div>
                <div className="text-lg font-medium">{match.teamA}</div>
                {match.wicketsA !== undefined && (
                  <div className="text-sm text-muted-foreground">{match.wicketsA} wickets</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{match.scoreB || "0/0"}</div>
                <div className="text-lg font-medium">{match.teamB}</div>
                {match.wicketsB !== undefined && (
                  <div className="text-sm text-muted-foreground">{match.wicketsB} wickets</div>
                )}
              </div>
            </div>
            {match.overs && (
              <div className="text-center mt-4 text-lg text-muted-foreground">
                Overs: {match.overs}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Win Probability */}
      {(match.winProbabilityA || match.winProbabilityB) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Win Probability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{match.teamA}</span>
                <span className="text-lg font-bold text-blue-600">{match.winProbabilityA || 0}%</span>
              </div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${match.winProbabilityA || 0}%` 
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">{match.teamB}</span>
                <span className="text-lg font-bold text-green-600">{match.winProbabilityB || 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="squads" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="squads">Squads</TabsTrigger>
          <TabsTrigger value="scorecard">Scorecard</TabsTrigger>
          <TabsTrigger value="commentary">Commentary</TabsTrigger>
        </TabsList>

        <TabsContent value="squads" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team, index) => (
              <Card key={team.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    {team.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {team.players.map((player) => (
                      <PlayerCard 
                        key={player.id} 
                        player={player} 
                        teamColor={index === 0 ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-green-500 to-green-600"}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scorecard" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Scorecard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="w-12 h-12 mx-auto mb-4" />
                <p>Detailed scorecard will be available during the match</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commentary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Commentary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <p>Live commentary will be available during the match</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchDetail;
