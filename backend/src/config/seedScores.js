/**
 * Seed all sports score data into MongoDB.
 *
 * Usage:
 *   1. Ensure backend/.env has MONGO_URI set
 *   2. Run: npm run seed:scores
 *
 * This script inserts all the hardcoded data that was previously in the
 * frontend/src/components/PointsTable/sports/ .jsx files.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Score = require("../models/Score");

dotenv.config();

/* ====================================================================
   ALL SPORTS DATA
   ==================================================================== */

// Helper: standard athletics event template
const athTeams = ["CSE", "ECE", "EE", "PIE+ECM", "CE", "MME", "ME", "PG"];
const athHeadings = ["Position", "Team", "Points"];

function athEvent(pointsMap) {
  return {
    headings: athHeadings,
    data: athTeams.map((team, i) => [
      String(i + 1),
      team,
      String(pointsMap[team] || "0"),
    ]),
  };
}

// ─── ATHLETICS BOYS ────────────────────────────────────────
const athleticsBoysEvents = {
  "100m": athEvent({}),
  "200m": athEvent({ ECE: 1, CE: 8 }),
  "400m": athEvent({}),
  "800m": athEvent({}),
  "1500m": athEvent({ CE: 5, MME: 3, PG: 1 }),
  Discus: athEvent({ EE: 3, CE: 1, ME: 5 }),
  "4x400m Relay": athEvent({}),
  "Cross Country": athEvent({}),
  "3000m": athEvent({}),
  "Tug Of War": athEvent({}),
  "Triple Jump": athEvent({ ECE: 5, "PIE+ECM": 3, MME: 1 }),
  Medley: athEvent({}),
  "Long Jump": athEvent({ ECE: 3, CE: 5, ME: 1 }),
  "High Jump": athEvent({}),
  "Shot Put": athEvent({}),
  "Javelin Throw": athEvent({ CE: 5, ME: 4 }),
  "4x100m Relay": athEvent({}),
};

// ─── ATHLETICS GIRLS ───────────────────────────────────────
const athleticsGirlsEvents = {
  "100m": athEvent({}),
  "200m": athEvent({ MME: 3, PG: 6 }),
  "400m": athEvent({}),
  "800m": athEvent({}),
  "1500m": athEvent({ EE: 1, PG: 8 }),
  Discus: athEvent({ CSE: 3, CE: 5, MME: 1 }),
  "4x400m Relay": athEvent({}),
  "Cross Country": athEvent({}),
  "3000m": athEvent({}),
  "Tug Of War": athEvent({}),
  "Triple Jump": athEvent({ ECE: 3, CE: 1, PG: 5 }),
  Medley: athEvent({}),
  "Long Jump": athEvent({ CSE: 3, ECE: 1, PG: 5 }),
  "High Jump": athEvent({}),
  "Shot Put": athEvent({}),
  "Javelin Throw": athEvent({ CSE: 1, CE: 5, MME: 3 }),
  "4x100m Relay": athEvent({}),
};

// ─── BADMINTON ─────────────────────────────────────────────
const badmintonBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME", 2, 0, 2, 0],
      ["MME", 2, 0, 2, 0],
      ["ECE", 3, 3, 0, 3],
      ["PG", 3, 2, 1, 2],
    ],
  },
  matches: [],
};

const badmintonBoysPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["EE", 3, 2, 1, 2],
      ["CSE", 3, 3, 0, 3],
      ["PIE + ECM", 3, 0, 3, 0],
      ["CE", 3, 1, 2, 1],
    ],
  },
  matches: [],
};

const badmintonBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "5 November", venue: "Ups Badminton Court", team1: "ECE", score1: "", team2: "CSE", score2: "", winner: "ECE" },
        { id: "SF2", date: "5 November", venue: "Ups Badminton Court", team1: "EE", score1: "", team2: "ME", score2: "", winner: "EE" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "6 November", venue: "Ups Badminton Court", team1: "ECE", score1: "1", team2: "EE", score2: "3", winner: "EE" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third Place",
    match: { id: "TP1", date: "6 November", venue: "Ups Badminton Court", team1: "CSE", score1: "0", team2: "ME", score2: "3", winner: "ME" },
  },
};

const badmintonGirlsPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 1, 1, 0, 1],
      ["CE + PIE + ECM", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const badmintonGirlsPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["MME + ECE", 1, 1, 0, 1],
      ["EE + CSE", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const badmintonGirlsKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "5 November", venue: "Ups Badminton Court", team1: "ECE+MME", score1: "w/o", team2: "CE+PIE+ECM", score2: "", winner: "CE+PIE+ECM" },
      ],
    },
  ],
};

// ─── CHESS ─────────────────────────────────────────────────
const chessBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME", 2, 0, 2, 0],
      ["MME", 2, 0, 2, 0],
      ["ECE", 3, 3, 0, 3],
      ["PG", 3, 2, 1, 2],
    ],
  },
  matches: [],
};

const chessBoysPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["EE", 3, 2, 1, 2],
      ["CSE", 3, 3, 0, 3],
      ["PIE + ECM", 3, 0, 3, 0],
      ["CE", 3, 1, 2, 1],
    ],
  },
  matches: [],
};

const chessBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "12 October", venue: "LHC", team1: "EE", score1: "", team2: "ECE", score2: "", winner: "EE" },
        { id: "SF2", date: "12 October", venue: "LHC", team1: "CSE", score1: "", team2: "PG", score2: "", winner: "CSE" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "6 November", venue: "LHC", team1: "EE", score1: "3", team2: "CSE", score2: "1", winner: "EE" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third Place",
    match: { id: "TP1", date: "6 November", venue: "LHC", team1: "ECE", score1: "1.5", team2: "PG", score2: "2.5", winner: "PG" },
  },
};

const chessGirlsPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 1, 1, 0, 1],
      ["CE + PIE + ECM", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const chessGirlsPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["MME + ECE", 1, 1, 0, 1],
      ["EE + CSE", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const chessGirlsKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "6 NOV 2025", venue: "LHC", team1: "ECE+MME", score1: "2.5", team2: "PG+ME", score2: "1.5", winner: "ECE+MME" },
      ],
    },
  ],
};

// ─── CRICKET ───────────────────────────────────────────────
const cricketBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts", "NRR"],
    data: [
      ["ME", 3, 1, 2, 2, -0.113],
      ["MME", 3, 2, 1, 4, 0.804],
      ["ECE", 3, 2, 1, 2, 0.191],
      ["PG", 3, 1, 2, 2, -0.951],
    ],
  },
  matches: [],
};

const cricketBoysPoolB = {
  pointsTable: {
    headings: ["Player", "Pld", "W", "L", "Pts", "NRR"],
    data: [
      ["EE", 3, 1, 2, 2, -2.21],
      ["CSE", 3, 2, 1, 4, 0.545],
      ["PIE + ECM", 3, 2, 1, 4, 3.233],
      ["CE", 3, 1, 2, 2, -1.784],
    ],
  },
  matches: [],
};

const cricketBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "5 November", venue: "Downs Ground", team1: "CSE", score1: "65/4 (5.5)", team2: "MME", score2: "64/10 (9.0)", winner: "CSE" },
        { id: "SF2", date: "5 November", venue: "Downs Ground", team1: "PIE+ECM", score1: "76/9 (10.0)", team2: "ECE", score2: "82/1 (5.1)", winner: "ECE" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "6 November", venue: "Downs Ground", team1: "CSE", score1: "30/10 (7.0)", team2: "ECE", score2: "115/8 (12.0)", winner: "ECE" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third Place",
    match: { id: "TP1", date: "6 November", venue: "Downs Ground", team1: "MME", score1: "146/8(10.0)", team2: "PIE+ECM", score2: "85/10 (9.4)", winner: "MME" },
  },
};

// ─── FOOTBALL ──────────────────────────────────────────────
const footballBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "D", "L", "GD", "GS", "Pts"],
    data: [
      ["ME", 3, 0, 0, 3, -5, 1, 0],
      ["MME", 3, 1, 1, 1, +1, 1, 4],
      ["ECE", 3, 1, 2, 0, +2, 3, 5],
      ["PG", 3, 2, 1, 0, +2, 3, 7],
    ],
  },
  matches: [],
};

const footballBoysPoolB = {
  pointsTable: {
    headings: ["Player", "Pld", "W", "D", "L", "GD", "GS", "Pts"],
    data: [
      ["EE", 3, 0, 2, 1, -1, 1, 2],
      ["CSE", 3, 1, 1, 1, 0, 2, 4],
      ["PIE + ECM", 3, 1, 2, 0, +2, 2, 5],
      ["CE", 3, 1, 1, 1, -1, 3, 4],
    ],
  },
  matches: [],
};

const footballBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "6 November", venue: "CD Ground", team1: "PG", score1: "1", team2: "CSE", score2: "0", winner: "" },
        { id: "SF2", date: "5 November", venue: "CD Ground", team1: "PIE+ECM", score1: "2", team2: "ECE", score2: "0", winner: "PIE+ECM" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "7 November", venue: "CD Ground", team1: "PG", score1: "0", team2: "PIE+ECM", score2: "1", winner: "PIE+ECM" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third place play-off",
    match: { id: "TP1", date: "7 November", venue: "CD Ground", team1: "CSE", score1: "4", team2: "ECE", score2: "0", winner: "" },
  },
};

// ─── LAWN TENNIS ───────────────────────────────────────────
const lawnTennisBoysPoolA = {
  pointsTable: {
    headings: ["Player", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 3, 1, 2, 2],
      ["CE + PIE + ECM", 3, 2, 1, 4],
      ["ECE + MME", 3, 2, 1, 4],
      ["EE + CSE", 3, 0, 3, 0],
    ],
  },
  matches: [],
};

const lawnTennisBoysPoolB = {
  pointsTable: {
    headings: ["Player", "Pld", "W", "L", "Pts", "NRR"],
    data: [
      ["EE", 3, 1, 2, 2, -2.21],
      ["CSE", 3, 2, 1, 4, 0.545],
      ["PIE + ECM", 3, 2, 1, 4, 3.233],
      ["CE", 3, 1, 2, 2, -1.784],
    ],
  },
  matches: [],
};

const lawnTennisBoysKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "13 October", venue: "Lawn Tennis Court", team1: "CE+PIE+ECM", score1: "0", team2: "ECE+MME", score2: "2", winner: "ECE+MME" },
      ],
    },
  ],
};

const lawnTennisGirlsPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 1, 0, 1, 0],
      ["CE + PIE + ECM", 1, 1, 0, 2],
    ],
  },
  matches: [],
};

const lawnTennisGirlsPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["MME + ECE", 1, 0, 1, 0],
      ["EE + CSE", 1, 1, 0, 2],
    ],
  },
  matches: [],
};

const lawnTennisGirlsKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "13 October", venue: "Lawn Tennis Court", team1: "CE+PIE+ECM", score1: "0", team2: "CSE+EE", score2: "2", winner: "CSE+EE" },
      ],
    },
  ],
};

// ─── TABLE TENNIS ──────────────────────────────────────────
const tableTennisBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME", 3, 0, 3, 0],
      ["MME", 3, 2, 1, 4],
      ["ECE", 3, 3, 0, 6],
      ["PG", 3, 1, 2, 2],
    ],
  },
  matches: [],
};

const tableTennisBoysPoolB = {
  pointsTable: {
    headings: ["Player", "Pld", "W", "L", "Pts"],
    data: [
      ["EE", 3, 1, 2, 2],
      ["CSE", 3, 2, 1, 4],
      ["PIE+ECM", 3, 3, 0, 6],
      ["CE", 3, 0, 3, 0],
    ],
  },
  matches: [],
};

const tableTennisBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "6 November", venue: "TSG", team1: "PIE+ECM", score1: "3", team2: "MME", score2: "0", winner: "" },
        { id: "SF2", date: "6 November", venue: "TSG", team1: "CSE", score1: "0", team2: "ECE", score2: "3", winner: "" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "7 November", venue: "TSG", team1: "ECE", score1: "0", team2: "PIE+ECM", score2: "3", winner: "PIE+ECM" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third Place",
    match: { id: "TP1", date: "7 November", venue: "TSG", team1: "MME", score1: "0", team2: "CSE", score2: "3", winner: "" },
  },
};

const tableTennisGirlsPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 1, 1, 0, 2],
      ["CE + PIE + ECM", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const tableTennisGirlsPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["MME + ECE", 1, 1, 0, 2],
      ["EE + CSE", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const tableTennisGirlsKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "6 NOV 2025", venue: "TSG", team1: "ECE+MME", score1: "", team2: "ME+PG", score2: "", winner: "ECE+MME" },
      ],
    },
  ],
};

// ─── VOLLEYBALL ────────────────────────────────────────────
const volleyballBoysPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME", 3, 3, 0, 6],
      ["MME", 3, 1, 2, 2],
      ["ECE", 3, 0, 3, 0],
      ["PG", 3, 2, 1, 4],
    ],
  },
  matches: [],
};

const volleyballBoysPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["EE", 3, 1, 2, 2],
      ["CSE", 3, 3, 0, 6],
      ["PIE+ECM", 3, 2, 1, 4],
      ["CE", 3, 0, 3, 0],
    ],
  },
  matches: [],
};

const volleyballBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        { id: "SF1", date: "TBD", venue: "Volleyball Court", team1: "ME", score1: "", team2: "PIE+ECM", score2: "", winner: "" },
        { id: "SF2", date: "TBD", venue: "Volleyball Court", team1: "PG", score1: "", team2: "CSE", score2: "", winner: "" },
      ],
    },
    {
      name: "Final",
      matches: [
        { id: "F1", date: "TBD", venue: "Volleyball Court", team1: "Winner SF1", score1: "", team2: "Winner SF2", score2: "", winner: "" },
      ],
    },
  ],
  thirdPlace: {
    name: "Third place play-off",
    match: { id: "TP1", date: "TBD", venue: "Volleyball Court", team1: "Loser SF1", score1: "", team2: "Loser SF2", score2: "", winner: "" },
  },
};

const volleyballGirlsPoolA = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["ME + PG", 1, 1, 0, 2],
      ["CE + PIE + ECM", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const volleyballGirlsPoolB = {
  pointsTable: {
    headings: ["Team", "Pld", "W", "L", "Pts"],
    data: [
      ["MME + ECE", 1, 0, 1, 0],
      ["EE + CSE", 1, 0, 1, 0],
    ],
  },
  matches: [],
};

const volleyballGirlsKnockout = {
  rounds: [
    {
      name: "Final",
      matches: [
        { id: "F1", date: "TBD", venue: "Volleyball Court", team1: "Pool 1", score1: "", team2: "Pool 2", score2: "", winner: "" },
      ],
    },
  ],
};

// ─── BASKETBALL (placeholder — was marked "removed") ──────
const basketballBoysPoolA = { pointsTable: { headings: ["Team", "Pld", "W", "L", "Pts"], data: [] }, matches: [] };
const basketballBoysPoolB = { pointsTable: { headings: ["Team", "Pld", "W", "L", "Pts"], data: [] }, matches: [] };
const basketballBoysKnockout = { rounds: [] };
const basketballGirlsPoolA = { pointsTable: { headings: ["Team", "Pld", "W", "L", "Pts"], data: [] }, matches: [] };
const basketballGirlsKnockout = { rounds: [] };

// ─── HOCKEY (placeholder — was marked "removed") ──────────
const hockeyBoysPoolA = { pointsTable: { headings: ["Team", "Pld", "W", "L", "Pts"], data: [] }, matches: [] };
const hockeyBoysKnockout = { rounds: [] };

/* ====================================================================
   BUILD SCORE DOCUMENTS
   ==================================================================== */

const scoreDocuments = [];

// ── Athletics: each event is a separate Group Stage document ──
for (const [eventName, ptable] of Object.entries(athleticsBoysEvents)) {
  scoreDocuments.push({
    sport: "Athletics",
    gender: "Boys",
    event: eventName,
    stage: "Group Stage",
    pointsTable: ptable,
    matches: [],
    knockout: {},
  });
}
for (const [eventName, ptable] of Object.entries(athleticsGirlsEvents)) {
  scoreDocuments.push({
    sport: "Athletics",
    gender: "Girls",
    event: eventName,
    stage: "Group Stage",
    pointsTable: ptable,
    matches: [],
    knockout: {},
  });
}

// ── Helper to add a team sport ──
function addTeamSport(sportName, genderConfigs) {
  for (const { gender, pools, knockout } of genderConfigs) {
    // Group stage pools
    for (const [poolName, poolData] of Object.entries(pools)) {
      scoreDocuments.push({
        sport: sportName,
        gender,
        event: poolName,
        stage: "Group Stage",
        pointsTable: poolData.pointsTable || { headings: [], data: [] },
        matches: poolData.matches || [],
        knockout: {},
      });
    }
    // Knockout
    if (knockout) {
      scoreDocuments.push({
        sport: sportName,
        gender,
        event: "Knockout",
        stage: "Knockout",
        pointsTable: { headings: [], data: [] },
        matches: [],
        knockout: knockout,
      });
    }
  }
}

addTeamSport("Badminton", [
  { gender: "Boys", pools: { "Pool A": badmintonBoysPoolA, "Pool B": badmintonBoysPoolB }, knockout: badmintonBoysKnockout },
  { gender: "Girls", pools: { "Pool A": badmintonGirlsPoolA, "Pool B": badmintonGirlsPoolB }, knockout: badmintonGirlsKnockout },
]);

addTeamSport("Chess", [
  { gender: "Boys", pools: { "Pool A": chessBoysPoolA, "Pool B": chessBoysPoolB }, knockout: chessBoysKnockout },
  { gender: "Girls", pools: { "Pool A": chessGirlsPoolA, "Pool B": chessGirlsPoolB }, knockout: chessGirlsKnockout },
]);

addTeamSport("Cricket", [
  { gender: "Boys", pools: { "Pool A": cricketBoysPoolA, "Pool B": cricketBoysPoolB }, knockout: cricketBoysKnockout },
]);

addTeamSport("Football", [
  { gender: "Boys", pools: { "Pool A": footballBoysPoolA, "Pool B": footballBoysPoolB }, knockout: footballBoysKnockout },
]);

addTeamSport("Lawn Tennis", [
  { gender: "Boys", pools: { "Pool A": lawnTennisBoysPoolA, "Pool B": lawnTennisBoysPoolB }, knockout: lawnTennisBoysKnockout },
  { gender: "Girls", pools: { "Pool A": lawnTennisGirlsPoolA, "Pool B": lawnTennisGirlsPoolB }, knockout: lawnTennisGirlsKnockout },
]);

addTeamSport("Table Tennis", [
  { gender: "Boys", pools: { "Pool A": tableTennisBoysPoolA, "Pool B": tableTennisBoysPoolB }, knockout: tableTennisBoysKnockout },
  { gender: "Girls", pools: { "Pool A": tableTennisGirlsPoolA, "Pool B": tableTennisGirlsPoolB }, knockout: tableTennisGirlsKnockout },
]);

addTeamSport("Volleyball", [
  { gender: "Boys", pools: { "Pool A": volleyballBoysPoolA, "Pool B": volleyballBoysPoolB }, knockout: volleyballBoysKnockout },
  { gender: "Girls", pools: { "Pool A": volleyballGirlsPoolA, "Pool B": volleyballGirlsPoolB }, knockout: volleyballGirlsKnockout },
]);

addTeamSport("Basketball", [
  { gender: "Boys", pools: { "Pool A": basketballBoysPoolA, "Pool B": basketballBoysPoolB }, knockout: basketballBoysKnockout },
  { gender: "Girls", pools: { "Pool A": basketballGirlsPoolA }, knockout: basketballGirlsKnockout },
]);

addTeamSport("Hockey", [
  { gender: "Boys", pools: { "Pool A": hockeyBoysPoolA }, knockout: hockeyBoysKnockout },
]);

/* ====================================================================
   SEED INTO MONGODB
   ==================================================================== */

async function seedScores() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing scores
    const deleted = await Score.deleteMany({});
    console.log(`🗑️  Cleared ${deleted.deletedCount} existing score documents`);

    // Insert all documents
    const result = await Score.insertMany(scoreDocuments);
    console.log(`✅ Inserted ${result.length} score documents`);

    // Summary
    const sports = [...new Set(scoreDocuments.map((d) => d.sport))];
    console.log(`\n📊 Sports seeded: ${sports.join(", ")}`);
    console.log(`   Total documents: ${result.length}`);

    console.log("\n🎉 Score seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Score seeding failed:", error.message);
    process.exit(1);
  }
}

seedScores();
