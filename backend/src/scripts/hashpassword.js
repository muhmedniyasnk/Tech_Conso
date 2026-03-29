const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/User");

async function fixPasswords() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const users = await User.find();

    for (let user of users) {
      // 🔥 skip already hashed passwords
      if (user.password.startsWith("$2b$")) {
        console.log(`✔ Already hashed: ${user.email}`);
        continue;
      }

      console.log(`⚠ Fixing password for: ${user.email}`);

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(user.password, salt);

      user.password = hashed;
      await user.save();

      console.log(`✅ Updated: ${user.email}`);
    }

    console.log("🎉 All users fixed");
    process.exit();

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

fixPasswords();