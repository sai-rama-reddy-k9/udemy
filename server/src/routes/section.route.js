const express = require("express");

const router = express.Router();

const {
  createSection,
  getCourseSections,
} = require("../controllers/section.controller");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

router.post(
  "/",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  createSection
);

router.get("/:courseId", verifyToken, getCourseSections);

module.exports = router;
