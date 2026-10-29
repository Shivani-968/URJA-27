/**
 * Official Branch and Team Mapping Utilities for URJA-27 (Frontend)
 *
 * Enforces the fixed 8 original branches, canonical combined-team mappings
 * for girls' competitions, and attribution of match statistics/points without
 * duplication.
 */

export const OFFICIAL_BRANCHES = [
  "CSE",
  "ECE",
  "EE",
  "CE",
  "ME",
  "MME",
  "PIE+ECM",
  "PG",
];

/**
 * Normalize single branch name representations.
 * Handles variations such as "PIE + ECM", "(PIE+ECM)", and case differences.
 */
export function normalizeBranch(name) {
  if (!name || typeof name !== "string") return "";
  const cleaned = name.trim();

  if (/^\(?\s*PIE\s*\+\s*ECM\s*\)?$/i.test(cleaned)) {
    return "PIE+ECM";
  }

  const found = OFFICIAL_BRANCHES.find(
    (b) => b.toLowerCase() === cleaned.toLowerCase()
  );
  return found || "";
}

/**
 * Extract constituent original branches from a team name.
 *
 * Rules:
 * - Only records where gender is explicitly "Girls" (case-insensitive) are treated
 *   as girls' competitions. Records with missing, undefined, or other gender values
 *   are NEVER treated as girls' competitions and are not decomposed into combined branches.
 * - For girls' competitions:
 *   - Combined teams such as "ECE + EE", "EE + ECE", "CE + PIE + ECM", "(PIE+ECM) + ECE"
 *     are decomposed into their two constituent original branches.
 *   - Single branch teams (e.g. in Girls' Athletics) return [branch].
 *   - Handles arbitrary whitespace, parens, and reversed branch-name order.
 * - For boys' or non-girls competitions:
 *   - Teams are individual branches (e.g. "PIE+ECM" or "PIE + ECM" is one branch).
 *   - Never decomposes boys' teams into multiple branches.
 *
 * Returns an array of valid branches from OFFICIAL_BRANCHES (empty array if unknown).
 */
export function getConstituentBranches(teamName, gender = "") {
  if (!teamName || typeof teamName !== "string") return [];
  const trimmed = teamName.trim();
  if (!trimmed) return [];

  const isGirls = String(gender || "").trim().toLowerCase() === "girls";

  // For non-girls or missing-gender competitions, teams are single branches
  if (!isGirls) {
    const single = normalizeBranch(trimmed);
    return single ? [single] : [];
  }

  // Girls competition: check if it's already a single direct official branch (e.g. Athletics)
  const directBranch = normalizeBranch(trimmed);
  if (directBranch) {
    return [directBranch];
  }

  // Girls competition: check for combined team
  const matched = [];
  let remaining = trimmed;

  // 1. Check for PIE+ECM (with or without parens and whitespace)
  const pieEcmRegex = /\(?\s*PIE\s*\+\s*ECM\s*\)?/i;
  if (pieEcmRegex.test(remaining)) {
    matched.push("PIE+ECM");
    remaining = remaining.replace(pieEcmRegex, " ");
  }

  // 2. Check for the other 7 branches: order longer names first (ECE, CSE, MME before CE, ME, EE, PG)
  // to prevent accidental substring collisions (e.g. CE in ECE or ME in MME)
  const otherBranches = ["CSE", "ECE", "MME", "CE", "ME", "EE", "PG"];
  for (const branch of otherBranches) {
    const regex = new RegExp(`(^|[^A-Za-z])${branch}([^A-Za-z]|$)`, "i");
    if (regex.test(remaining)) {
      matched.push(branch);
      remaining = remaining.replace(regex, "$1 $2");
    }
  }

  // Filter only to valid official branches and deduplicate
  const unique = Array.from(new Set(matched)).filter((b) =>
    OFFICIAL_BRANCHES.includes(b)
  );

  return unique.sort();
}

/**
 * Returns a canonical representation for a team name.
 * e.g. "EE + ECE" -> "ECE + EE"
 */
export function getCanonicalTeamName(teamName, gender = "") {
  const constituents = getConstituentBranches(teamName, gender);
  if (constituents.length === 2) {
    return `${constituents[0]} + ${constituents[1]}`;
  }
  if (constituents.length === 1) {
    return constituents[0];
  }
  return String(teamName).trim();
}

/**
 * Attribute match statistics to constituent branches.
 *
 * Rules:
 * - A combined girls' team (e.g. "ECE + EE") represents one team for match scheduling and results.
 * - When attributing statistics (PLD, W, D, L, GD, GS, Pts) to constituent original branches:
 *   - Each constituent branch participated in that 1 match (PLD = stats.pld, typically 1).
 *   - The match is counted ONCE for each branch (never multiplied by number of branches).
 *   - Match outcome (W, D, L) and goal metrics (GD, GS) are attributed identically to each branch.
 *   - Points (Pts) are credited in full to both constituent original branches.
 * - The combined team itself is never added as a separate entry in branch standings.
 */
export function attributeMatchStats(teamName, rawStats = {}, gender = "") {
  const branches = getConstituentBranches(teamName, gender);
  if (!branches || branches.length === 0) return [];

  const pld = Number(rawStats.pld ?? rawStats.Pld ?? 0) || 0;
  const w = Number(rawStats.w ?? rawStats.W ?? 0) || 0;
  const d = Number(rawStats.d ?? rawStats.D ?? 0) || 0;
  const l = Number(rawStats.l ?? rawStats.L ?? 0) || 0;
  const gd = Number(rawStats.gd ?? rawStats.GD ?? 0) || 0;
  const gs = Number(rawStats.gs ?? rawStats.GS ?? 0) || 0;
  const pts =
    Number(
      rawStats.pts ?? rawStats.Pts ?? rawStats.points ?? rawStats.Points ?? 0
    ) || 0;

  return branches.map((branch) => ({
    branch,
    pld,
    w,
    d,
    l,
    gd,
    gs,
    pts,
  }));
}

/**
 * Calculate the branch standings from an array of Score documents.
 * Guarantees exactly 8 original branches are returned, correctly distributing
 * combined girls' team points and stats without duplicate counting.
 */
export function calculateBranchStandings(documents) {
  // Initialize all 8 official branches with 0
  const branchMap = {};
  for (const branch of OFFICIAL_BRANCHES) {
    branchMap[branch] = {
      name: branch,
      branch,
      breakdown: {},
      points: 0,
      totalPoints: 0,
      pld: 0,
      w: 0,
      d: 0,
      l: 0,
      gd: 0,
      gs: 0,
    };
  }

  if (!Array.isArray(documents)) {
    return Object.values(branchMap);
  }

  for (const doc of documents) {
    const stage = String(doc?.stage || "").trim().toLowerCase();
    // Only Group Stage points table contributes to overall standings
    if (stage !== "group stage") continue;

    const pointsTable = doc?.pointsTable;
    if (
      !pointsTable ||
      !Array.isArray(pointsTable.headings) ||
      !Array.isArray(pointsTable.data) ||
      pointsTable.data.length === 0
    ) {
      continue;
    }

    const sport = String(doc.sport || "").trim();
    const gender = String(doc.gender || "").trim();
    const headings = pointsTable.headings.map((h) =>
      String(h).trim().toLowerCase()
    );

    const ptsIdx = headings.findIndex(
      (h) => h === "points" || h === "pts"
    );
    const teamIdx = headings.findIndex(
      (h) => h === "team" || h === "player" || h === "position"
    );
    const pldIdx = headings.findIndex((h) => h === "pld");
    const wIdx = headings.findIndex((h) => h === "w");
    const dIdx = headings.findIndex((h) => h === "d");
    const lIdx = headings.findIndex((h) => h === "l");
    const gdIdx = headings.findIndex((h) => h === "gd");
    const gsIdx = headings.findIndex((h) => h === "gs");

    if (ptsIdx === -1) continue;

    const actualTeamIdx =
      sport === "Athletics"
        ? headings.indexOf("team") !== -1
          ? headings.indexOf("team")
          : 1
        : teamIdx !== -1
        ? teamIdx
        : 0;

    for (const row of pointsTable.data) {
      if (!Array.isArray(row)) continue;

      const teamName = String(row[actualTeamIdx] || "").trim();
      const points = Number(row[ptsIdx]) || 0;
      const pld = pldIdx !== -1 ? Number(row[pldIdx]) || 0 : 0;
      const w = wIdx !== -1 ? Number(row[wIdx]) || 0 : 0;
      const d = dIdx !== -1 ? Number(row[dIdx]) || 0 : 0;
      const l = lIdx !== -1 ? Number(row[lIdx]) || 0 : 0;
      const gd = gdIdx !== -1 ? Number(row[gdIdx]) || 0 : 0;
      const gs = gsIdx !== -1 ? Number(row[gsIdx]) || 0 : 0;

      const constituents = getConstituentBranches(teamName, gender);

      for (const branch of constituents) {
        if (!branchMap[branch]) continue;

        branchMap[branch].points += points;
        branchMap[branch].totalPoints += points;
        branchMap[branch].pld += pld;
        branchMap[branch].w += w;
        branchMap[branch].d += d;
        branchMap[branch].l += l;
        branchMap[branch].gd += gd;
        branchMap[branch].gs += gs;

        if (sport && points > 0) {
          branchMap[branch].breakdown[sport] =
            (branchMap[branch].breakdown[sport] || 0) + points;
        }
      }
    }
  }

  const result = Object.values(branchMap);

  // Sort by total points descending, then branch name ascending
  result.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    return a.branch.localeCompare(b.branch);
  });

  return result.map((item, index) => ({
    ...item,
    position: index + 1,
  }));
}
