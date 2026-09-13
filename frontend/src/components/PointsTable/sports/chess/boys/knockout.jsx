// src/components/PointsTable/sports/basketball/boys/knockout.js

export const tableTennisBoysKnockout = {
  rounds: [
    {
      name: "Semi-finals",
      matches: [
        {
          id: "SF1",
          date: "12 October",
          venue: "LHC",
          team1: "EE",
          score1: "",
          team2: "ECE",
          score2: "",
          winner: "EE",
        },
        {
          id: "SF2",
          date: "12 October",
          venue: "LHC",
          team1: "CSE",
          score1: "",
          team2: "PG",
          score2: "",
          winner: "CSE",
        },
      ],
    },
    {
      name: "Final",
      matches: [
        {
          id: "F1",
          date: "6 November",
          venue: "LHC",
          team1: "EE",
          score1: "3",
          score1_pen: "",
          team2: "CSE",
          score2: "1",
          score2_pen: "",
          winner: "EE",
        },
      ],
    },
  ],
  // 💡 NEW: Dedicated thirdPlace object
  thirdPlace: {
    name: "Third Place",
    match: {
      id: "TP1",
      date: "6 November",
      venue: "LHC",
      team1: "ECE",
      score1: "1.5",
      team2: "PG",
      score2: "2.5",
      winner: "PG",
    },
  },
};
