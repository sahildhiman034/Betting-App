import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, TrendingUp, Calculator, DollarSign } from "lucide-react";

interface Bet {
  id: string;
  matchId: string;
  type: string;
  odds: number;
  label: string;
  stake?: number;
}

interface BetSlipProps {
  bets: Bet[];
  onRemoveBet: (id: string) => void;
  onUpdateStake: (id: string, stake: number) => void;
  onPlaceBets: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const BetSlip = ({ 
  bets, 
  onRemoveBet, 
  onUpdateStake, 
  onPlaceBets, 
  isOpen, 
  onClose 
}: BetSlipProps) => {
  const [betType, setBetType] = useState<"single" | "accumulator">("single");
  
  const totalStake = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0);
  const totalOdds = bets.reduce((product, bet) => product * bet.odds, 1);
  const potentialWin = betType === "accumulator" ? 
    (bets.length > 0 ? totalStake * totalOdds : 0) :
    bets.reduce((sum, bet) => sum + ((bet.stake || 0) * bet.odds), 0);

  const handleStakeChange = (betId: string, value: string) => {
    const stake = parseFloat(value) || 0;
    onUpdateStake(betId, stake);
  };

  const quickStakeAmounts = [5, 10, 25, 50, 100];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Bet Slip */}
      <div className={`
        fixed right-0 top-0 h-full bg-card border-l border-border z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-80 flex flex-col shadow-elegant
      `}>
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Bet Slip
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{bets.length}</Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onClose}
                className="lg:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Bet Type Toggle */}
          {bets.length > 1 && (
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => setBetType("single")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  betType === "single" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Single Bets
              </button>
              <button
                onClick={() => setBetType("accumulator")}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  betType === "accumulator" 
                    ? "bg-white text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Accumulator
              </button>
            </div>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          {bets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Your bet slip is empty</p>
              <p className="text-sm">Click on odds to add selections</p>
            </div>
          ) : (
            <>
              {/* Individual Bets */}
              <div className="space-y-3">
                {bets.map((bet) => (
                  <Card key={bet.id} className="p-3">
                    <div className="space-y-3">
                      {/* Bet Details */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{bet.label}</p>
                          <p className="text-xs text-muted-foreground">Match ID: {bet.matchId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {bet.odds.toFixed(2)}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveBet(bet.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Stake Input (for single bets) */}
                      {betType === "single" && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Enter stake"
                              value={bet.stake || ""}
                              onChange={(e) => handleStakeChange(bet.id, e.target.value)}
                              className="h-8 text-sm"
                            />
                          </div>
                          
                          {/* Quick Stakes */}
                          <div className="flex gap-1">
                            {quickStakeAmounts.map((amount) => (
                              <Button
                                key={amount}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => onUpdateStake(bet.id, amount)}
                              >
                                ${amount}
                              </Button>
                            ))}
                          </div>
                          
                          {/* Potential Win */}
                          {bet.stake && bet.stake > 0 && (
                            <div className="text-xs text-muted-foreground">
                              Potential win: <span className="font-medium text-success">
                                ${(bet.stake * bet.odds).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Accumulator Stake (if accumulator type) */}
              {betType === "accumulator" && bets.length > 1 && (
                <Card className="p-3 bg-accent/10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-medium text-sm">Accumulator Bet</span>
                      <Badge variant="secondary" className="text-xs">
                        {bets.length} selections
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="Enter total stake"
                          value={totalStake || ""}
                          onChange={(e) => {
                            const stake = parseFloat(e.target.value) || 0;
                            // For accumulator, distribute stake evenly (or keep as total)
                            if (bets.length > 0) {
                              bets.forEach(bet => onUpdateStake(bet.id, stake / bets.length));
                            }
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Combined odds: <span className="font-medium">{totalOdds.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Separator />

              {/* Summary */}
              <div className="space-y-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Stake:</span>
                  <span className="font-medium">${totalStake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potential Return:</span>
                  <span className="font-medium text-success">${potentialWin.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Potential Profit:</span>
                  <span className="font-medium text-success">
                    ${Math.max(0, potentialWin - totalStake).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Place Bet Button */}
              <Button 
                onClick={onPlaceBets}
                disabled={totalStake === 0}
                className="w-full bg-success hover:bg-success/90 text-white font-semibold"
                size="lg"
              >
                Place Bet{bets.length > 1 ? "s" : ""} - ${totalStake.toFixed(2)}
              </Button>
            </>
          )}
        </CardContent>
      </div>
    </>
  );
};
