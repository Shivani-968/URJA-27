const express = require("express");
const Score = require("../models/Score");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * GET /api/scores
 * Public - no auth required
 * Query params: ?sport=Cricket&gender=Boys&event=Pool A&stage=Group Stage
 * Returns matching score documents
 */
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.sport) filter.sport = req.query.sport;
    if (req.query.gender) filter.gender = req.query.gender;
    if (req.query.event) filter.event = req.query.event;
    if (req.query.stage) filter.stage = req.query.stage;

    const scores = await Score.find(filter).sort({ sport: 1, gender: 1, event: 1 });
    res.json(scores);
  } catch (error) {
    console.error("Fetch scores error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * GET /api/scores/:id
 * Public - no auth required
 * Returns a single score document by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ message: "Score not found." });
    }
    res.json(score);
  } catch (error) {
    console.error("Fetch score error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * POST /api/scores
 * Protected - admin only
 * Creates a new score document
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { sport, gender, event, stage, pointsTable, matches, knockout } = req.body;

    const score = new Score({
      sport,
      gender,
      event,
      stage: stage || "Group Stage",
      pointsTable: pointsTable || { headings: [], data: [] },
      matches: matches || [],
      knockout: knockout || {},
      updatedBy: req.admin.id,
    });

    const saved = await score.save();
    res.status(201).json(saved);
  } catch (error) {
    // Handle duplicate key error (compound index)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "A score entry for this sport/gender/event/stage already exists. Use PUT to update.",
      });
    }
    console.error("Create score error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * PUT /api/scores/:id
 * Protected - admin only
 * Updates an existing score document
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { pointsTable, matches, knockout } = req.body;

    const score = await Score.findById(req.params.id);
    if (!score) {
      return res.status(404).json({ message: "Score not found." });
    }

    // Update only the fields that are provided
    if (pointsTable) score.pointsTable = pointsTable;
    if (matches) score.matches = matches;
    if (knockout) score.knockout = knockout;
    score.updatedBy = req.admin.id;

    const updated = await score.save();
    res.json(updated);
  } catch (error) {
    console.error("Update score error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * PUT /api/scores/by-filter
 * Protected - admin only
 * Upserts a score document by sport+gender+event+stage filter
 * This is convenient so the frontend doesn't need to know MongoDB _id
 */
router.put("/by-filter/upsert", authMiddleware, async (req, res) => {
  try {
    const { sport, gender, event, stage, pointsTable, matches, knockout } = req.body;

    if (!sport || !gender || !event) {
      return res.status(400).json({ message: "sport, gender, and event are required." });
    }

    const filter = { sport, gender, event, stage: stage || "Group Stage" };
    const update = {
      ...filter,
      updatedBy: req.admin.id,
    };
    if (pointsTable) update.pointsTable = pointsTable;
    if (matches) update.matches = matches;
    if (knockout) update.knockout = knockout;

    const score = await Score.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    res.json(score);
  } catch (error) {
    console.error("Upsert score error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
