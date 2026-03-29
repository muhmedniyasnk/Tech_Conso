const express = require("express");
const router = express.Router();
const {
  verifyToken,
  authorizeRoles
} = require("../middleware/authMiddleware");

// Only ADMIN can access this
router.get(
  "/admin-test",
  verifyToken,
  authorizeRoles("ADMIN"),
  (req, res) => {
    res.json({
      message: "Welcome Admin",
      user: req.user
    });
  }
);

module.exports = router;
