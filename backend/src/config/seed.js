/**
 * Seed script to create the 2 admin accounts.
 *
 * Usage:
 *   1. Create a .env file in backend/ with your MONGO_URI
 *   2. Run: npm run seed
 *
 * ⚠️  Edit the admins array below with your actual names/emails/passwords
 *     before running this script.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");

dotenv.config();

// ========== EDIT THESE ==========
const admins = [
  {
    name: "Admin 1",
    email: process.env.ADMIN1_email,
    password: process.env.ADMIN1_pass,
  },
  {
    name: "Admin 2",
    email: process.env.ADMIN2_email,
    password: process.env.ADMIN2_pass,
  },
];
// =================================

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const adminData of admins) {
      // Check if admin already exists
      const existing = await Admin.findOne({ email: adminData.email });
      if (existing) {
        console.log(`⏭️  Admin "${adminData.email}" already exists, skipping.`);
        continue;
      }

      const admin = new Admin(adminData);
      await admin.save(); // password gets hashed by the pre-save hook
      console.log(`✅ Created admin: ${adminData.email}`);
    }

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();
