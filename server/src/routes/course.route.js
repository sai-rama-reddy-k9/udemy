const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");
const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/auth.middleware");

// Public Routes
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected Routes (Instructors & Admins)
router.post(
  "/",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  createCourse,
);
router.put(
  "/edit/:id",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  updateCourse,
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("instructor", "admin"),
  deleteCourse,
);

module.exports = router;
