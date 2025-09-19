import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d60ea7df05124c09bae0e15d63df7641',
  appName: 'ARENAEXCH',
  webDir: 'dist',
  server: {
    url: "https://d60ea7df-0512-4c09-bae0-e15d63df7641.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ff6b35',
      showSpinner: false
    }
  }
};

export default config;