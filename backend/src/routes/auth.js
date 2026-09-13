const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, admin: { id, name, email } }
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Verify password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT (expires in 24 hours)
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

/**
 * GET /api/auth/me
 * Protected - requires JWT
 * Returns current admin info
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }
    res.json(admin);
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
