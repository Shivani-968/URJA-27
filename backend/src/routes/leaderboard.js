const express = require("express");
const Score = require("../models/Score");
const { calculateBranchStandings } = require("../utils/branchUtils");

const router = express.Router();

/**
 * GET /api/leaderboard
 * Public - no auth required
 *
 * Aggregates all score documents to compute per-team points by sport.
 * Returns an array of: { name: "CSE", breakdown: { Cricket: 10, ... }, totalPoints: 15 }
 *
 * Rules:
 * - Fixed official 8 original branches (CSE, ECE, EE, CE, ME, MME, PIE+ECM, PG).
 * - Girls' combined teams (e.g. "ECE + EE") credit points to both constituent branches.
 * - Single/Boys' teams credit to their respective branch.
 * - Exactly 8 branches are returned, sorted by totalPoints descending.
 */
router.get("/", async (req, res) => {
  try {
    const allScores = await Score.find({});
    const standings = calculateBranchStandings(allScores);

    // Convert to the exact array format the frontend/API expects
    const leaderboard = standings.map((item) => ({
      name: item.name,
      breakdown: item.breakdown,
      totalPoints: item.totalPoints,
    }));

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard aggregation error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
