import { Button } from "@/components/ui/button";
import { Play, Trophy, TrendingUp } from "lucide-react";
import heroSports from "@/assets/hero-sports.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/35 via-primary-dark/30 to-accent/35">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroSports} 
          alt="Sports action collage"
          className="w-full h-full object-cover mix-blend-overlay opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-primary/55 to-accent/55" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-10 lg:py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h1 className="hero-title text-4xl lg:text-6xl font-bold leading-tight">
                  Arena
                  <span className="text-6xl lg:text-7xl ml-2">X</span>
                </h1>
                <div className="hero-subtitle text-2xl lg:text-4xl font-semibold">
                  <span className="text-accent">VIRTUAL</span>
                  <br />
                  <span>SPORTS</span>
                </div>
              </div>
              
              <p className="hero-copy text-xl text-white/90 max-w-lg">
                Experience the thrill of live sports betting with real-time odds, 
                virtual sports action, and the best betting platform in the industry.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90 font-semibold text-lg px-8 py-6"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Betting Now
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary font-semibold text-lg px-8 py-6 bg-white/10 backdrop-blur-sm"
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  View Live Markets
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">24/7</div>
                  <div className="text-sm text-white/80">Live Betting</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">500+</div>
                  <div className="text-sm text-white/80">Daily Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">99.9%</div>
                  <div className="text-sm text-white/80">Uptime</div>
                </div>
              </div>
            </div>

            {/* Visual Elements */}
            <div className="hidden lg:block relative">
              <div className="space-y-6">
                {/* Floating Cards */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform rotate-3 animate-pulse-glow">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-sm opacity-80">Live Match</div>
                      <div className="font-semibold">Chelsea vs Arsenal</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">2.5</div>
                      <div className="text-xs opacity-80">ODDS</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform -rotate-2 ml-8 animate-pulse-glow">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="text-sm opacity-80">Virtual Cricket</div>
                      <div className="font-semibold">India vs Australia</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">1.8</div>
                      <div className="text-xs opacity-80">ODDS</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 transform rotate-1 animate-pulse-glow">
                  <div className="flex items-center gap-3 text-white">
                    <TrendingUp className="h-8 w-8 text-accent" />
                    <div>
                      <div className="text-sm opacity-80">Today's Hot Pick</div>
                      <div className="font-semibold">Manchester United Win</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-auto">
          <path 
            d="M0,60 C300,120 600,0 1200,60 L1200,120 L0,120 Z" 
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
};