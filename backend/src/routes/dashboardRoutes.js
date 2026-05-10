const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getDashboardData,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  getDashboardData
);

module.exports = router;