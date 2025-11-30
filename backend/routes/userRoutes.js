// backend/routes/userRoutes.js
const express = require("express");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/users/me
router.get("/me", auth, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
});

module.exports = router;
