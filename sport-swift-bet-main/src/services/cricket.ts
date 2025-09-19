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

// Fetch live matches (best-effort across common endpoints)
export const fetchLiveMatches = async (): Promise<CricketMatch[]> => {
  try {
    // Attempt 1: /matches/list?matchState=live (common in cricbuzz-based APIs)
    const data: any = await rapidGet({ path: "/matches/list", query: { matchState: "live" } });
    const matches: CricketMatch[] = (data?.matches || data?.typeMatches || [])
      .flatMap((tm: any) => tm?.seriesMatches || [])
      .flatMap((sm: any) => sm?.seriesAdWrapper?.matches || [])
      .map((m: any) => ({
        id: String(m?.matchInfo?.matchId ?? m?.id ?? Math.random()),
        series: m?.matchInfo?.seriesName,
        teamA: m?.matchInfo?.team1?.teamSName ?? m?.teamA ?? "T1",
        teamB: m?.matchInfo?.team2?.teamSName ?? m?.teamB ?? "T2",
        startTime: safeNum(m?.matchInfo?.startDate) ?? Date.now(),
        state: "live",
        scoreA: m?.matchScore?.team1Score?.inngs1?.score ? `${m.matchScore.team1Score.inngs1.score}/${m.matchScore.team1Score.inngs1.wickets}` : undefined,
        scoreB: m?.matchScore?.team2Score?.inngs1?.score ? `${m.matchScore.team2Score.inngs1.score}/${m.matchScore.team2Score.inngs1.wickets}` : undefined,
        overs: m?.matchScore?.team1Score?.inngs1?.overs ?? m?.matchScore?.team2Score?.inngs1?.overs,
        wicketsA: safeNum(m?.matchScore?.team1Score?.inngs1?.wickets),
        wicketsB: safeNum(m?.matchScore?.team2Score?.inngs1?.wickets),
      })) as CricketMatch[];
    if (matches.length) return matches;
  } catch (_) {
    // ignore and try alternative endpoint
  }

  try {
    // Attempt 2: /match/live (some variants)
    const data: any = await rapidGet({ path: "/match/live" });
    const matches: CricketMatch[] = (data?.data || data || []).map((m: any) => ({
      id: String(m?.matchId ?? m?.id ?? Math.random()),
      series: m?.seriesName,
      teamA: m?.teamA?.name ?? m?.team1?.name ?? "T1",
      teamB: m?.teamB?.name ?? m?.team2?.name ?? "T2",
      startTime: safeNum(m?.startTime) ?? Date.now(),
      state: "live",
      scoreA: m?.scoreA ?? m?.team1Score,
      scoreB: m?.scoreB ?? m?.team2Score,
      overs: m?.overs,
    }));
    return matches;
  } catch (e) {
    return [];
  }
};

export const fetchUpcomingMatches = async (days = 10): Promise<CricketMatch[]> => {
  try {
    const from = Date.now();
    const to = from + days * 24 * 60 * 60 * 1000;
    const data: any = await rapidGet({ path: "/matches/list", query: { matchState: "upcoming" } });
    const matches: CricketMatch[] = (data?.matches || data?.typeMatches || [])
      .flatMap((tm: any) => tm?.seriesMatches || [])
      .flatMap((sm: any) => sm?.seriesAdWrapper?.matches || [])
      .map((m: any) => ({
        id: String(m?.matchInfo?.matchId ?? m?.id ?? Math.random()),
        series: m?.matchInfo?.seriesName,
        teamA: m?.matchInfo?.team1?.teamSName ?? m?.teamA ?? "T1",
        teamB: m?.matchInfo?.team2?.teamSName ?? m?.teamB ?? "T2",
        startTime: safeNum(m?.matchInfo?.startDate) ?? Date.now(),
        state: "upcoming",
      }))
      .filter((m: CricketMatch) => m.startTime >= from && m.startTime <= to);
    return matches;
  } catch (e) {
    return [];
  }
};

export const fetchMatchDetail = async (matchId: string): Promise<any> => {
  try {
    // Common patterns: /match/get-scorecard?matchId=xxxx or /scorecards/get?matchId=xxx
    try {
      const scorecard: any = await rapidGet({ path: "/match/get-scorecard", query: { matchId } });
      return scorecard;
    } catch (_) {
      const alt: any = await rapidGet({ path: "/scorecards/get", query: { matchId } });
      return alt;
    }
  } catch (e) {
    return null;
  }
};


