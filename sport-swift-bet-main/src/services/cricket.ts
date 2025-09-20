// Cricket API service (RapidAPI - Unofficial Cricbuzz)
// Reads credentials from environment variables
// - VITE_RAPIDAPI_KEY
// - VITE_CRICKET_HOST (e.g., unofficial-cricbuzz.p.rapidapi.com)

export type CricketMatch = {
  id: string;
  series?: string;
  teamA: string;
  teamB: string;
  startTime: number; // epoch ms
  state: "live" | "upcoming" | "completed";
  scoreA?: string;
  scoreB?: string;
  overs?: string;
  wicketsA?: number;
  wicketsB?: number;
  winProbabilityA?: number;
  winProbabilityB?: number;
};

const RAPID_KEY = import.meta.env.VITE_RAPIDAPI_KEY as string | undefined;
const RAPID_HOST = import.meta.env.VITE_CRICKET_HOST as string | undefined;
const TZ = (import.meta.env.VITE_TZ as string | undefined) || "Asia/Kolkata";

if (!RAPID_KEY || !RAPID_HOST) {
  // eslint-disable-next-line no-console
  console.warn("Cricket API env not configured: VITE_RAPIDAPI_KEY / VITE_CRICKET_HOST");
}

type RapidOptions = {
  path: string;
  query?: Record<string, string | number | undefined>;
};

const buildUrl = ({ path, query }: RapidOptions) => {
  const base = `https://${RAPID_HOST}${path.startsWith("/") ? "" : "/"}${path}`;
  const url = new URL(base);
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
};

const rapidGet = async <T>(opts: RapidOptions): Promise<T> => {
  const url = buildUrl(opts);
  const res = await fetch(url, {
    headers: {
      "x-rapidapi-key": RAPID_KEY || "",
      "x-rapidapi-host": RAPID_HOST || "",
    },
  });
  if (!res.ok) throw new Error(`Cricket API error ${res.status}`);
  return (await res.json()) as T;
};

// Normalizers — since free endpoints differ, we defensively parse known shapes
const safeNum = (v: any): number | undefined => {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

// Public helpers
export const formatTime = (epochMs: number) =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: TZ,
  }).format(new Date(epochMs));

// Fetch live matches (DISABLED - returns mock data)
export const fetchLiveMatches = async (): Promise<CricketMatch[]> => {
  // Live cricket feature disabled - returning mock data
  return [
    {
      id: "mock-1",
      series: "Demo Series",
      teamA: "Team A",
      teamB: "Team B", 
      startTime: Date.now(),
      state: "live",
      scoreA: "120/3",
      scoreB: "95/2",
      overs: "15.2",
      wicketsA: 3,
      wicketsB: 2,
    }
  ];
};

export const fetchUpcomingMatches = async (days = 10): Promise<CricketMatch[]> => {
  // Upcoming matches feature disabled - returning mock data
  return [
    {
      id: "mock-upcoming-1",
      series: "Demo Series",
      teamA: "Team C",
      teamB: "Team D",
      startTime: Date.now() + 2 * 60 * 60 * 1000, // 2 hours from now
      state: "upcoming",
    },
    {
      id: "mock-upcoming-2", 
      series: "Demo Series",
      teamA: "Team E",
      teamB: "Team F",
      startTime: Date.now() + 24 * 60 * 60 * 1000, // 1 day from now
      state: "upcoming",
    }
  ];
};

export const fetchMatchDetail = async (matchId: string): Promise<any> => {
  // Match detail feature disabled - returning mock data
  return {
    matchId,
    series: "Demo Series",
    teamA: "Team A",
    teamB: "Team B",
    status: "Live",
    score: {
      teamA: "120/3 (15.2)",
      teamB: "95/2 (12.0)"
    },
    message: "Live cricket API disabled - showing demo data"
  };
};


