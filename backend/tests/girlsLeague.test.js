const test = require("node:test");
const assert = require("node:assert/strict");

const {
  OFFICIAL_BRANCHES,
  normalizeBranch,
  getConstituentBranches,
  getCanonicalTeamName,
  attributeMatchStats,
  calculateBranchStandings,
} = require("../src/utils/branchUtils");

test("Official Branches: exactly 8 original branches defined", () => {
  assert.equal(OFFICIAL_BRANCHES.length, 8);
  const expected = ["CSE", "ECE", "EE", "CE", "ME", "MME", "PIE+ECM", "PG"];
  for (const b of expected) {
    assert.ok(OFFICIAL_BRANCHES.includes(b), `Missing branch: ${b}`);
  }
});

test("Constituent Branches: resolves girls combined team 'ECE + EE' to both branches", () => {
  const branches = getConstituentBranches("ECE + EE", "Girls");
  assert.deepEqual(branches, ["ECE", "EE"]);
});

test("Constituent Branches: handles reversed branch-name order consistently", () => {
  const normal = getConstituentBranches("ECE + EE", "Girls");
  const reversed = getConstituentBranches("EE + ECE", "Girls");
  assert.deepEqual(reversed, normal);
  assert.deepEqual(reversed, ["ECE", "EE"]);
});

test("Constituent Branches: handles whitespace variations consistently", () => {
  assert.deepEqual(getConstituentBranches("ECE+EE", "Girls"), ["ECE", "EE"]);
  assert.deepEqual(getConstituentBranches("ECE   +   EE", "Girls"), ["ECE", "EE"]);
  assert.deepEqual(getConstituentBranches("  ECE + EE  ", "Girls"), ["ECE", "EE"]);
  assert.deepEqual(getConstituentBranches("EE+ECE", "Girls"), ["ECE", "EE"]);
});

test("Constituent Branches: handles PIE+ECM in combined teams with whitespace and parentheses", () => {
  assert.deepEqual(getConstituentBranches("CE + PIE + ECM", "Girls"), ["CE", "PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("CE+PIE+ECM", "Girls"), ["CE", "PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("(PIE+ECM) + ECE", "Girls"), ["ECE", "PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("ECE + (PIE+ECM)", "Girls"), ["ECE", "PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("PIE+ECM + CE", "Girls"), ["CE", "PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("(PIE + ECM) + ME", "Girls"), ["ME", "PIE+ECM"]);
});

test("Constituent Branches: girls athletics single branch returns single branch", () => {
  assert.deepEqual(getConstituentBranches("CSE", "Girls"), ["CSE"]);
  assert.deepEqual(getConstituentBranches("PIE+ECM", "Girls"), ["PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("PIE + ECM", "Girls"), ["PIE+ECM"]);
});

test("Gender isolation: unknown or missing gender is NEVER treated as girls", () => {
  // Combined team with missing/null/unknown gender must NOT be split
  assert.deepEqual(getConstituentBranches("ECE + EE"), []);
  assert.deepEqual(getConstituentBranches("ECE + EE", null), []);
  assert.deepEqual(getConstituentBranches("ECE + EE", undefined), []);
  assert.deepEqual(getConstituentBranches("ECE + EE", ""), []);
  assert.deepEqual(getConstituentBranches("ECE + EE", "Mixed"), []);
  assert.deepEqual(getConstituentBranches("ECE + EE", "Unknown"), []);

  // Single valid branch with missing/unknown gender resolves to single branch
  assert.deepEqual(getConstituentBranches("CSE"), ["CSE"]);
  assert.deepEqual(getConstituentBranches("CSE", "Unknown"), ["CSE"]);
});

test("Boys competitions: teams are single branches and never decomposed", () => {
  assert.deepEqual(getConstituentBranches("ECE", "Boys"), ["ECE"]);
  assert.deepEqual(getConstituentBranches("PIE+ECM", "Boys"), ["PIE+ECM"]);
  assert.deepEqual(getConstituentBranches("PIE + ECM", "Boys"), ["PIE+ECM"]);
  // A combined name in boys context should not split
  assert.deepEqual(getConstituentBranches("ECE + EE", "Boys"), []);
});

test("Canonical team name: consistent naming regardless of order", () => {
  assert.equal(getCanonicalTeamName("ECE + EE", "Girls"), "ECE + EE");
  assert.equal(getCanonicalTeamName("EE + ECE", "Girls"), "ECE + EE");
  assert.equal(getCanonicalTeamName("ECE+EE", "Girls"), "ECE + EE");
  assert.equal(getCanonicalTeamName("CSE", "Girls"), "CSE");
});

test("Match statistics attribution: attributes to both branches without double-counting PLD", () => {
  const stats = { pld: 1, w: 1, d: 0, l: 0, gd: 3, gs: 4, pts: 3 };
  const attributed = attributeMatchStats("ECE + EE", stats, "Girls");

  assert.equal(attributed.length, 2);
  const ece = attributed.find((a) => a.branch === "ECE");
  const ee = attributed.find((a) => a.branch === "EE");

  assert.ok(ece, "ECE must be present");
  assert.ok(ee, "EE must be present");

  // Each branch participated in 1 match (PLD=1, NOT 2)
  assert.equal(ece.pld, 1);
  assert.equal(ece.w, 1);
  assert.equal(ece.pts, 3);
  assert.equal(ece.gd, 3);
  assert.equal(ece.gs, 4);

  assert.equal(ee.pld, 1);
  assert.equal(ee.w, 1);
  assert.equal(ee.pts, 3);
});

test("Standings: empty documents always returns exactly 8 official branches with 0 points", () => {
  const standings = calculateBranchStandings([]);
  assert.equal(standings.length, 8);
  for (const s of standings) {
    assert.ok(OFFICIAL_BRANCHES.includes(s.branch));
    assert.equal(s.points, 0);
    assert.equal(s.totalPoints, 0);
  }
});

test("Standings: combined team win credits match points to BOTH original branches", () => {
  const mockDocs = [
    {
      sport: "Badminton",
      gender: "Girls",
      stage: "Group Stage",
      event: "Pool A",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [
          ["ECE + EE", 1, 1, 0, 3],
          ["ME + PG", 1, 0, 1, 0],
        ],
      },
    },
  ];

  const standings = calculateBranchStandings(mockDocs);

  // Exactly 8 branches must appear (no "ECE + EE" or "ME + PG" entries)
  assert.equal(standings.length, 8);
  assert.equal(standings.find((s) => s.branch === "ECE + EE"), undefined);
  assert.equal(standings.find((s) => s.branch === "ME + PG"), undefined);

  const ece = standings.find((s) => s.branch === "ECE");
  const ee = standings.find((s) => s.branch === "EE");
  const me = standings.find((s) => s.branch === "ME");
  const pg = standings.find((s) => s.branch === "PG");

  assert.equal(ece.points, 3, "ECE must receive 3 points");
  assert.equal(ee.points, 3, "EE must receive 3 points");
  assert.equal(ece.w, 1);
  assert.equal(ee.w, 1);
  assert.equal(ece.pld, 1);
  assert.equal(ee.pld, 1);

  assert.equal(me.points, 0, "ME must receive 0 points");
  assert.equal(pg.points, 0, "PG must receive 0 points");
  assert.equal(me.l, 1);
  assert.equal(pg.l, 1);
  assert.equal(me.pld, 1);
  assert.equal(pg.pld, 1);
});

test("Standings: reversed branch order credits the same branches", () => {
  const mockDocs = [
    {
      sport: "Volleyball",
      gender: "Girls",
      stage: "Group Stage",
      event: "Pool A",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [["EE + ECE", 1, 1, 0, 2]],
      },
    },
  ];

  const standings = calculateBranchStandings(mockDocs);
  assert.equal(standings.length, 8);
  const ece = standings.find((s) => s.branch === "ECE");
  const ee = standings.find((s) => s.branch === "EE");

  assert.equal(ece.points, 2);
  assert.equal(ee.points, 2);
});

test("Standings: boys competitions credit only single branch", () => {
  const mockDocs = [
    {
      sport: "Cricket",
      gender: "Boys",
      stage: "Group Stage",
      event: "Pool A",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [
          ["CSE", 3, 3, 0, 6],
          ["PIE + ECM", 3, 1, 2, 2],
        ],
      },
    },
  ];

  const standings = calculateBranchStandings(mockDocs);
  assert.equal(standings.length, 8);

  const cse = standings.find((s) => s.branch === "CSE");
  const pieEcm = standings.find((s) => s.branch === "PIE+ECM");

  assert.equal(cse.points, 6);
  assert.equal(pieEcm.points, 2);

  // Other branches must remain at 0
  const ece = standings.find((s) => s.branch === "ECE");
  assert.equal(ece.points, 0);
});

test("Standings: multi-sport aggregation with boys and girls combined teams", () => {
  const mockDocs = [
    // Boys Cricket: CSE wins 4 points
    {
      sport: "Cricket",
      gender: "Boys",
      stage: "Group Stage",
      event: "Pool A",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [["CSE", 2, 2, 0, 4]],
      },
    },
    // Girls Badminton: ECE + EE wins 3 points
    {
      sport: "Badminton",
      gender: "Girls",
      stage: "Group Stage",
      event: "Pool A",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [
          ["ECE + EE", 1, 1, 0, 3],
          ["ME + PG", 1, 0, 1, 0],
        ],
      },
    },
    // Girls Lawn Tennis: (PIE+ECM) + ECE wins 2 points
    {
      sport: "Lawn Tennis",
      gender: "Girls",
      stage: "Group Stage",
      event: "Pool B",
      pointsTable: {
        headings: ["Team", "Pld", "W", "L", "Pts"],
        data: [["(PIE+ECM) + ECE", 1, 1, 0, 2]],
      },
    },
    // Girls Athletics: CSE single branch wins 5 points
    {
      sport: "Athletics",
      gender: "Girls",
      stage: "Group Stage",
      event: "100m",
      pointsTable: {
        headings: ["Position", "Team", "Points"],
        data: [["1", "CSE", "5"]],
      },
    },
  ];

  const standings = calculateBranchStandings(mockDocs);

  assert.equal(standings.length, 8);

  // Standings must be sorted by points descending
  assert.ok(standings[0].points >= standings[1].points);
  assert.ok(standings[1].points >= standings[2].points);

  const cse = standings.find((s) => s.branch === "CSE");
  const ece = standings.find((s) => s.branch === "ECE");
  const ee = standings.find((s) => s.branch === "EE");
  const pieEcm = standings.find((s) => s.branch === "PIE+ECM");
  const me = standings.find((s) => s.branch === "ME");

  // CSE: 4 (boys cricket) + 5 (girls athletics) = 9
  assert.equal(cse.points, 9);
  assert.equal(cse.breakdown.Cricket, 4);
  assert.equal(cse.breakdown.Athletics, 5);

  // ECE: 3 (girls badminton) + 2 (girls tennis) = 5
  assert.equal(ece.points, 5);
  assert.equal(ece.breakdown.Badminton, 3);
  assert.equal(ece.breakdown["Lawn Tennis"], 2);

  // EE: 3 (girls badminton) = 3
  assert.equal(ee.points, 3);
  assert.equal(ee.breakdown.Badminton, 3);

  // PIE+ECM: 2 (girls tennis) = 2
  assert.equal(pieEcm.points, 2);
  assert.equal(pieEcm.breakdown["Lawn Tennis"], 2);

  // ME: 0 points, but 1 match played
  assert.equal(me.points, 0);
  assert.equal(me.pld, 1);
  assert.equal(me.l, 1);

  // Standings length must strictly be 8
  assert.equal(standings.length, 8);

  // Verify backend /api/leaderboard response compatibility
  const apiLeaderboard = standings.map((item) => ({
    name: item.name,
    breakdown: item.breakdown,
    totalPoints: item.totalPoints,
  }));

  assert.equal(apiLeaderboard.length, 8);
  assert.equal(apiLeaderboard[0].name, "CSE");
  assert.equal(apiLeaderboard[0].totalPoints, 9);
  assert.equal(apiLeaderboard[1].name, "ECE");
  assert.equal(apiLeaderboard[1].totalPoints, 5);
});
