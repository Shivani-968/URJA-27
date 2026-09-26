const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    sport: {
      type: String,
      required: true,
      trim: true,
      // e.g. "Athletics", "Cricket", "Football", "Badminton", etc.
    },
    gender: {
      type: String,
      required: true,
      enum: ["Boys", "Girls"],
    },
    event: {
      type: String,
      required: true,
      trim: true,
      // For Athletics: "100m", "200m", "Shot Put", etc.
      // For other sports: "Pool A", "Pool B", "Knockout"
    },
    stage: {
      type: String,
      default: "Group Stage",
      trim: true,
    },
    // Points table data (for group stage / athletics events)
    pointsTable: {
      headings: {
        type: [String],
        default: [],
      },
      data: {
        type: [[mongoose.Schema.Types.Mixed]],
        default: [],
        // Each row is an array, e.g. ['CSE', 3, 2, 1, 4, 0.804]
      },
    },
    // Match details
    matches: [
      {
        date: { type: String, default: "" },
        time: { type: String, default: "" },
        teams: { type: [String], default: [] },
        scores: { type: [String], default: [] },
        winner: { type: String, default: "" },
        winBy: { type: String, default: "" },
        venue: { type: String, default: "" },
      },
    ],
    // Knockout bracket data (for knockout stage)
    knockout: {
      rounds: [
        {
          name: { type: String, default: "" },
          matches: [
            {
              id: { type: String, default: "" },
              date: { type: String, default: "" },
              venue: { type: String, default: "" },
              team1: { type: String, default: "" },
              team2: { type: String, default: "" },
              score1: { type: String, default: "" },
              score2: { type: String, default: "" },
              winner: { type: String, default: "" },
            },
          ],
        },
      ],
      thirdPlace: {
        match: {
          id: { type: String, default: "" },
          date: { type: String, default: "" },
          venue: { type: String, default: "" },
          team1: { type: String, default: "" },
          team2: { type: String, default: "" },
          score1: { type: String, default: "" },
          score2: { type: String, default: "" },
          winner: { type: String, default: "" },
        },
      },
    },
    // Who last updated this record
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

// Compound index: one document per sport+gender+event+stage combination
scoreSchema.index({ sport: 1, gender: 1, event: 1, stage: 1 }, { unique: true });

module.exports = mongoose.model("Score", scoreSchema);
