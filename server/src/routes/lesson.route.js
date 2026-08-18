const express = require("express");

const router = express.Router();

const {
  createLesson,
  getSectionLessons,
} = require("../controllers/lesson.controller");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

router.post(
  "/",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  createLesson
);

router.get("/:sectionId", verifyToken, getSectionLessons);

module.exports = router;
