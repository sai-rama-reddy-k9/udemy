const express = require("express");
const router = express.Router();

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");
const {
  getInstructorDashboardStats,
} = require("../controllers/instructor.controller");

router.get(
  "/dashboard-stats",
  verifyToken,
  authorizeRoles("instructor"),
  getInstructorDashboardStats,
);

module.exports = router;
