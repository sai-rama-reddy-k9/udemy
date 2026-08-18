const express = require("express");
const router = express.Router();
const {
  enrollInCourse,
  getMyCourses,
  getEnrolledCourse,
  getEnrolledLesson,
  markLessonComplete,
  getCourseProgress,
  markLessonIncomplete,
} = require("../controllers/enrollment.controller");
const { verifyToken } = require("../middleware/auth.middleware");

// All enrollment endpoints require authentication
router.post("/enroll", verifyToken, enrollInCourse);
router.get("/my-courses", verifyToken, getMyCourses);
router.get("/course/:courseId", verifyToken, getEnrolledCourse);
router.get("/course/:courseId/lesson/:lessonId", verifyToken, getEnrolledLesson);
router.patch(
  "/course/:courseId/lessons/:lessonId/complete",
  verifyToken,
  markLessonComplete
);
router.patch(
  "/course/:courseId/lessons/:lessonId/incomplete",
  verifyToken,
  markLessonIncomplete
);
router.get("/course/:courseId/progress", verifyToken, getCourseProgress);

module.exports = router;
