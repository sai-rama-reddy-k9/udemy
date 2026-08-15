const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");

// 1. SIMULATE PURCHASE / ENROLL IN A COURSE
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id; // From verifyToken middleware

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    // Check if course exists and is published
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Prevent duplicate enrollments
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course." });
    }

    // Simulate payment process here (e.g., status = "paid")
    const newEnrollment = new Enrollment({
      student: studentId,
      course: courseId,
      completedLessons: [],
    });

    await newEnrollment.save();

    res.status(201).json({
      message: "Enrolled successfully!",
      enrollment: newEnrollment,
    });
  } catch (error) {
    // Catch duplicate key error if concurrent requests bypass the check
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this course." });
    }
    res
      .status(500)
      .json({ message: "Error enrolling in course.", error: error.message });
  }
};

// 2. GET ALL ENROLLED COURSES FOR LOGGED-IN STUDENT
const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const enrollments = await Enrollment.find({ student: studentId })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name profilePicture" },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ count: enrollments.length, enrollments });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrolled courses.",
      error: error.message,
    });
  }
};

// 3. TOGGLE LESSON COMPLETION STATUS
const toggleLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const studentId = req.user.id;

    if (!courseId || !lessonId) {
      return res
        .status(400)
        .json({ message: "Course ID and Lesson ID are required." });
    }

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course." });
    }

    // Check if lesson is already completed
    const lessonIndex = enrollment.completedLessons.indexOf(lessonId);

    if (lessonIndex > -1) {
      // Unmark lesson as completed
      enrollment.completedLessons.splice(lessonIndex, 1);
    } else {
      // Mark lesson as completed
      enrollment.completedLessons.push(lessonId);
    }

    await enrollment.save();

    res.status(200).json({
      message: "Progress updated successfully.",
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating lesson progress.",
      error: error.message,
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
  toggleLessonComplete,
};

// How to Calculate Progress Percentage on Frontend/API
// When returning course details to an enrolled student, you can compute progress on the fly:
// const totalLessons = await Lesson.countDocuments({
//   section: { $in: sectionIds },
// });
// const completedCount = enrollment.completedLessons.length;

// const progressPercentage =
//   totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;