const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, role: 'client' });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", authController.login);

module.exports = router;
