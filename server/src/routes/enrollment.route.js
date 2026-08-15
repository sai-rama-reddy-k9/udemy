const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  toggleLessonComplete,
} = require("../controllers/enrollment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All enrollment endpoints require authentication
router.post("/enroll", verifyToken, enrollInCourse);
router.get("/my-courses", verifyToken, getMyCourses);
router.post("/toggle-lesson", verifyToken, toggleLessonComplete);

module.exports = router;
