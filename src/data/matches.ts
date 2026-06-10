import { TEAMS } from "./teams";
import { STADIUMS } from "./stadiums";
import type { Team } from "./teams";
import type { Stadium } from "./stadiums";

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  homeScorers: string[];
  awayScorers: string[];
  group: string;
  matchday: number;
  date: string; // ISO date string or local datetime representation (UTC/Local)
  stadiumId: string;
  finished: boolean;
  timeElapsed: number; // 0 for not started, up to 90+ for live
  status: "scheduled" | "live" | "finished";
  type: "group" | "round_of_32" | "round_of_16" | "quarter" | "semi" | "final";
}

export interface MatchWithDetails extends Match {
  homeTeam: Team;
  awayTeam: Team;
  stadium: Stadium;
}

export const MATCHES: Match[] = [
  // Group A
  {
    id: "1",
    homeTeamId: "MEX",
    awayTeamId: "RSA",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "A",
    matchday: 1,
    date: "2026-06-11T19:00:00Z",
    stadiumId: "1",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "2",
    homeTeamId: "KOR",
    awayTeamId: "CZE",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "A",
    matchday: 1,
    date: "2026-06-11T22:00:00Z",
    stadiumId: "2",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group B
  {
    id: "3",
    homeTeamId: "CAN",
    awayTeamId: "BIH",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "B",
    matchday: 1,
    date: "2026-06-12T19:00:00Z",
    stadiumId: "5",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "7",
    homeTeamId: "QAT",
    awayTeamId: "SUI",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "B",
    matchday: 1,
    date: "2026-06-13T22:00:00Z",
    stadiumId: "16",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group C
  {
    id: "5",
    homeTeamId: "BRA",
    awayTeamId: "MAR",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "C",
    matchday: 1,
    date: "2026-06-13T16:00:00Z",
    stadiumId: "7",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "6",
    homeTeamId: "HAI",
    awayTeamId: "SCO",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "C",
    matchday: 1,
    date: "2026-06-13T19:00:00Z",
    stadiumId: "9",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group D
  {
    id: "4",
    homeTeamId: "USA",
    awayTeamId: "PAR",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "D",
    matchday: 1,
    date: "2026-06-12T22:00:00Z",
    stadiumId: "6",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "8",
    homeTeamId: "AUS",
    awayTeamId: "TUR",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "D",
    matchday: 1,
    date: "2026-06-13T23:30:00Z",
    stadiumId: "4",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group E
  {
    id: "9",
    homeTeamId: "CIV",
    awayTeamId: "ECU",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "E",
    matchday: 1,
    date: "2026-06-14T15:00:00Z",
    stadiumId: "14",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "10",
    homeTeamId: "GER",
    awayTeamId: "CUW",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "E",
    matchday: 1,
    date: "2026-06-14T18:00:00Z",
    stadiumId: "11",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group F
  {
    id: "11",
    homeTeamId: "NED",
    awayTeamId: "JPN",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "F",
    matchday: 1,
    date: "2026-06-14T21:00:00Z",
    stadiumId: "10",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "12",
    homeTeamId: "SWE",
    awayTeamId: "TUN",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "F",
    matchday: 1,
    date: "2026-06-14T23:30:00Z",
    stadiumId: "3",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group G
  {
    id: "13",
    homeTeamId: "BEL",
    awayTeamId: "EGY",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "G",
    matchday: 1,
    date: "2026-06-15T15:00:00Z",
    stadiumId: "15",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "14",
    homeTeamId: "IRN",
    awayTeamId: "NZL",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "G",
    matchday: 1,
    date: "2026-06-15T18:00:00Z",
    stadiumId: "6",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group H
  {
    id: "15",
    homeTeamId: "ESP",
    awayTeamId: "CPV",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "H",
    matchday: 1,
    date: "2026-06-15T21:00:00Z",
    stadiumId: "8",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "16",
    homeTeamId: "KSA",
    awayTeamId: "URU",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "H",
    matchday: 1,
    date: "2026-06-15T23:30:00Z",
    stadiumId: "13",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group I
  {
    id: "17",
    homeTeamId: "FRA",
    awayTeamId: "SEN",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "I",
    matchday: 1,
    date: "2026-06-16T15:00:00Z",
    stadiumId: "7",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "18",
    homeTeamId: "IRQ",
    awayTeamId: "NOR",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "I",
    matchday: 1,
    date: "2026-06-16T18:00:00Z",
    stadiumId: "9",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group J
  {
    id: "19",
    homeTeamId: "ARG",
    awayTeamId: "ALG",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "J",
    matchday: 1,
    date: "2026-06-16T21:00:00Z",
    stadiumId: "12",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "20",
    homeTeamId: "AUT",
    awayTeamId: "JOR",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "J",
    matchday: 1,
    date: "2026-06-16T23:30:00Z",
    stadiumId: "16",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group K
  {
    id: "21",
    homeTeamId: "POR",
    awayTeamId: "COD",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "K",
    matchday: 1,
    date: "2026-06-17T15:00:00Z",
    stadiumId: "11",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "22",
    homeTeamId: "UZB",
    awayTeamId: "COL",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "K",
    matchday: 1,
    date: "2026-06-17T18:00:00Z",
    stadiumId: "1",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },

  // Group L
  {
    id: "23",
    homeTeamId: "ENG",
    awayTeamId: "CRO",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "L",
    matchday: 1,
    date: "2026-06-17T21:00:00Z",
    stadiumId: "10",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  },
  {
    id: "24",
    homeTeamId: "GHA",
    awayTeamId: "PAN",
    homeScore: 0,
    awayScore: 0,
    homeScorers: [],
    awayScorers: [],
    group: "L",
    matchday: 1,
    date: "2026-06-17T23:30:00Z",
    stadiumId: "5",
    finished: false,
    timeElapsed: 0,
    status: "scheduled",
    type: "group"
  }
];

export const getMatchesWithDetails = (matchesList: Match[]): MatchWithDetails[] => {
  return matchesList.map(match => {
    const homeTeam = TEAMS.find(t => t.id === match.homeTeamId) || {
      id: "TBD",
      name: "TBD",
      code: "TBD",
      iso: "un",
      group: match.group,
      flagUrl: "https://flagcdn.com/w80/un.png"
    };
    const awayTeam = TEAMS.find(t => t.id === match.awayTeamId) || {
      id: "TBD",
      name: "TBD",
      code: "TBD",
      iso: "un",
      group: match.group,
      flagUrl: "https://flagcdn.com/w80/un.png"
    };
    const stadium = STADIUMS.find(s => s.id === match.stadiumId) || {
      id: "0",
      name: "Estadio Desconocido",
      city: "TBD",
      country: "TBD",
      capacity: 0
    };
    return {
      ...match,
      homeTeam,
      awayTeam,
      stadium
    };
  });
};
