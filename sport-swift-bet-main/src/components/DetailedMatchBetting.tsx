import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackLayOdds } from "./BackLayOdds";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface DetailedMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeFlag: string;
  awayFlag: string;
  tournament: string;
  startTime: string;
  timeRemaining: string;
  matched: string;
  odds: {
    [team: string]: {
      back: { price: number; size: string }[];
      lay: { price: number; size: string }[];
    };
  };
  lines?: {
    name: string;
    odds: {
      [option: string]: {
        back: { price: number; size: string }[];
        lay: { price: number; size: string }[];
      };
    };
  }[];
}

interface DetailedMatchBettingProps {
  match: DetailedMatch;
  onBetSelect: (bet: any) => void;
}

export const DetailedMatchBetting = ({ match, onBetSelect }: DetailedMatchBettingProps) => {
  const [expandedLines, setExpandedLines] = useState<string[]>([]);

  const toggleLine = (lineName: string) => {
    setExpandedLines(prev => 
      prev.includes(lineName) 
        ? prev.filter(name => name !== lineName)
        : [...prev, lineName]
    );
  };

  return (
    <div className="space-y-4">
      {/* Match Header */}
      <Card className="bg-card border-border shadow-card animate-fade-in">
        <CardContent className="p-4">
          <div className="grid grid-cols-12 gap-4 text-sm">
            <div className="col-span-4">
              <div className="mb-2">
                <span className="font-medium text-muted-foreground">StartTime:</span> 
                <span className="ml-2 text-foreground">{match.startTime}</span>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Time Remaining:</span> 
                <span className="ml-2 text-accent font-semibold">{match.timeRemaining}</span>
              </div>
            </div>
            <div className="col-span-4 text-center">
              <div className="font-medium text-muted-foreground">Number of Winner</div>
              <div className="text-lg font-bold text-primary">1</div>
            </div>
            <div className="col-span-4 text-right">
              <div className="font-medium text-muted-foreground">Market Liability</div>
              <div className="text-lg font-bold text-success">0.00</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Odds */}
      <Card className="border-border shadow-card animate-fade-in">
        <CardHeader className="bg-primary text-primary-foreground p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-primary-dark px-2 py-1 rounded text-xs font-semibold">Ladder</span>
              <span className="font-medium">Match Odds</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span>MATCHED: {match.matched}</span>
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-dark p-1 transition-smooth">
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid grid-cols-12 bg-muted text-sm font-medium text-muted-foreground py-2 px-4">
            <div className="col-span-6"></div>
            <div className="col-span-3 text-center">Back</div>
            <div className="col-span-3 text-center">Lay</div>
          </div>
          
          {/* Home Team */}
          <div className="grid grid-cols-12 items-center py-3 px-4 border-b border-border hover:bg-muted/50 transition-smooth">
            <div className="col-span-6 flex items-center gap-3">
              <span className="text-2xl">{match.homeFlag}</span>
              <span className="font-medium text-foreground">{match.homeTeam}</span>
            </div>
            <div className="col-span-6">
              <BackLayOdds 
                odds={match.odds[match.homeTeam]} 
                onBetSelect={onBetSelect}
                teamName={match.homeTeam}
                matchId={match.id}
              />
            </div>
          </div>
          
          {/* Away Team */}
          <div className="grid grid-cols-12 items-center py-3 px-4 hover:bg-muted/50 transition-smooth">
            <div className="col-span-6 flex items-center gap-3">
              <span className="text-2xl">{match.awayFlag}</span>
              <span className="font-medium text-foreground">{match.awayTeam}</span>
            </div>
            <div className="col-span-6">
              <BackLayOdds 
                odds={match.odds[match.awayTeam]} 
                onBetSelect={onBetSelect}
                teamName={match.awayTeam}
                matchId={match.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Betting Lines */}
      {match.lines?.map((line) => (
        <Card key={line.name} className="border-border shadow-card animate-fade-in">
          <CardHeader 
            className="bg-accent text-accent-foreground p-3 cursor-pointer hover:bg-accent/90 transition-smooth"
            onClick={() => toggleLine(line.name)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="font-medium">{line.name}</span>
                <Badge variant="secondary" className="bg-primary text-primary-foreground text-xs">
                  Ladder
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-accent-foreground hover:bg-accent/80 text-xs transition-smooth">
                  Book
                </Button>
                {expandedLines.includes(line.name) ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </div>
          </CardHeader>
          
          {expandedLines.includes(line.name) && (
            <CardContent className="p-0">
              <div className="grid grid-cols-12 bg-muted text-sm font-medium text-muted-foreground py-2 px-4">
                <div className="col-span-6"></div>
                <div className="col-span-3 text-center">Back</div>
                <div className="col-span-3 text-center">Lay</div>
              </div>
              
              {Object.entries(line.odds).map(([option, odds]) => (
                <div key={option} className="grid grid-cols-12 items-center py-3 px-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-smooth">
                  <div className="col-span-6">
                    <span className="font-medium text-foreground">{option}</span>
                  </div>
                  <div className="col-span-6">
                    <BackLayOdds 
                      odds={odds} 
                      onBetSelect={onBetSelect}
                      teamName={option}
                      matchId={match.id}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
};