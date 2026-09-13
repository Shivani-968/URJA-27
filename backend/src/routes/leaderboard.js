const express = require("express");
const Score = require("../models/Score");

const router = express.Router();

/**
 * GET /api/leaderboard
 * Public - no auth required
 *
 * Aggregates all score documents to compute per-team points by sport.
 * Returns an array of: { name: "CSE", breakdown: { Cricket: 10, ... }, totalPoints: 15 }
 *
 * How points are determined:
 * - Athletics: Each event document has a pointsTable with a "Points" column per team.
 *   We sum all points for each team across all events/genders.
 * - Team sports: Points are derived from the "Pts" column in group stage pointsTable.
 *   (The admin can update these values via the API.)
 */
router.get("/", async (req, res) => {
  try {
    const allScores = await Score.find({});

    // teamBreakdown[teamName][sport] = totalPoints
    const teamBreakdown = {};

    for (const doc of allScores) {
      const { sport, pointsTable } = doc;

      if (
        !pointsTable ||
        !pointsTable.headings ||
        !pointsTable.data ||
        pointsTable.data.length === 0
      ) {
        continue;
      }

      const headings = pointsTable.headings.map((h) => h.toLowerCase());

      // Find the points/pts column
      const ptsIdx = headings.findIndex(
        (h) => h === "points" || h === "pts"
      );
      // Find the team/player column
      const teamIdx = headings.findIndex(
        (h) => h === "team" || h === "player" || h === "position"
      );

      if (ptsIdx === -1) continue;

      // For athletics, team is at index 1 (after Position)
      // For other sports, team is at index 0
      const actualTeamIdx =
        sport === "Athletics"
          ? headings.indexOf("team") !== -1
            ? headings.indexOf("team")
            : 1
          : teamIdx !== -1
          ? teamIdx
          : 0;

      for (const row of pointsTable.data) {
        const teamName = String(row[actualTeamIdx] || "").trim();
        const points = Number(row[ptsIdx]) || 0;

        if (!teamName || points === 0) continue;

        if (!teamBreakdown[teamName]) teamBreakdown[teamName] = {};
        if (!teamBreakdown[teamName][sport])
          teamBreakdown[teamName][sport] = 0;
        teamBreakdown[teamName][sport] += points;
      }
    }

    // Convert to the array format the frontend expects
    const leaderboard = Object.entries(teamBreakdown).map(
      ([name, breakdown]) => ({
        name,
        breakdown,
        totalPoints: Object.values(breakdown).reduce(
          (sum, pts) => sum + pts,
          0
        ),
      })
    );

    // Sort by totalPoints descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard aggregation error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
