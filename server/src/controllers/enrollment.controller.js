const Enrollment = require("../models/enrollment.model");
const Course = require("../models/course.model");
const Lesson = require("../models/lesson.model");
const Section = require("../models/section.model");

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

const getEnrolledCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    const course = await Course.findById(courseId).populate(
      "instructor",
      "name profilePicture"
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    const sections = await Section.find({
      course: courseId,
    }).sort({ order: 1 });

    const sectionsWithLessons = await Promise.all(
      sections.map(async (section) => {
        const lessons = await Lesson.find({
          section: section._id,
        }).sort({ order: 1 });

        return {
          ...section.toObject(),
          lessons,
        };
      })
    );

    res.status(200).json({
      course,
      sections: sectionsWithLessons,
      completedLessons: enrollment.completedLessons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching enrolled course.",
      error: error.message,
    });
  }
};


// 4. GET A SPECIFIC LESSON WITHIN AN ENROLLED COURSE
const getEnrolledLesson = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;

    // Verify enrollment exists
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found.",
      });
    }

    // Verify the lesson belongs to the requested course through its section
    const section = await Section.findById(lesson.section);
    if (!section) {
      return res.status(404).json({
        message: "Lesson's section not found.",
      });
    }

    if (section.course.toString() !== courseId) {
      return res.status(403).json({
        message: "This lesson does not belong to the requested course.",
      });
    }

    // Check if lesson is a preview or if student has access (enrolled)
    // Since we already verified enrollment, student has access to all lessons
    // But we can include isPreview flag in response for frontend

    res.status(200).json({
      lesson,
      isPreview: lesson.isPreview,
      isCompleted: enrollment.completedLessons.some(
        (completedId) => completedId.toString() === lessonId
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lesson.",
      error: error.message,
    });
  }
};

// 5. MARK LESSON AS COMPLETE
const markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;

    // Verify enrollment exists
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found.",
      });
    }

    // Verify the lesson belongs to the requested course through its section
    const section = await Section.findById(lesson.section);
    if (!section) {
      return res.status(404).json({
        message: "Lesson's section not found.",
      });
    }

    if (section.course.toString() !== courseId) {
      return res.status(403).json({
        message: "This lesson does not belong to the requested course.",
      });
    }

    // Check if already completed
    const isAlreadyCompleted = enrollment.completedLessons.some(
      (completedId) => completedId.toString() === lessonId
    );

    if (isAlreadyCompleted) {
      return res.status(400).json({
        message: "Lesson already completed.",
        completedLessonsCount: enrollment.completedLessons.length,
      });
    }

    // Add lesson to completedLessons using $addToSet to prevent duplicates atomically
    enrollment.completedLessons.push(lessonId);
    await enrollment.save();

    // Get total lessons in course for progress calculation
    const sections = await Section.find({ course: courseId });
    const sectionIds = sections.map((s) => s._id);
    const totalLessons = await Lesson.countDocuments({ section: { $in: sectionIds } });

    res.status(200).json({
      message: "Lesson marked as complete.",
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        section: lesson.section,
      },
      completedLessonsCount: enrollment.completedLessons.length,
      totalLessons,
      progressPercentage:
        totalLessons > 0
          ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking lesson complete.",
      error: error.message,
    });
  }
};

// 6. GET COURSE PROGRESS FOR ENROLLED STUDENT
const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    // Verify enrollment exists
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Find all sections belonging to the course
    const sections = await Section.find({ course: courseId });
    const sectionIds = sections.map((s) => s._id);

    // Find all lessons belonging to those sections
    const lessons = await Lesson.find({ section: { $in: sectionIds } });
    const totalLessons = lessons.length;

    // Get valid lesson IDs that currently belong to the course
    const validLessonIds = new Set(lessons.map((l) => l._id.toString()));

    // Filter completedLessons to only count those that still belong to the course
    const validCompletedLessons = enrollment.completedLessons.filter((id) =>
      validLessonIds.has(id.toString())
    );

    const completedLessons = validCompletedLessons.length;

    // Calculate progress percentage
    const progressPercentage =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    res.status(200).json({
      totalLessons,
      completedLessons,
      progressPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching course progress.",
      error: error.message,
    });
  }
};

// 7. MARK LESSON AS INCOMPLETE
const markLessonIncomplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.params;
    const studentId = req.user.id;

    // Verify enrollment exists
    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You are not enrolled in this course.",
      });
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    // Verify lesson exists
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        message: "Lesson not found.",
      });
    }

    // Verify the lesson belongs to the requested course through its section
    const section = await Section.findById(lesson.section);
    if (!section) {
      return res.status(404).json({
        message: "Lesson's section not found.",
      });
    }

    if (section.course.toString() !== courseId) {
      return res.status(403).json({
        message: "This lesson does not belong to the requested course.",
      });
    }

    // Remove lesson from completedLessons (no error if not present)
    const initialLength = enrollment.completedLessons.length;
    enrollment.completedLessons = enrollment.completedLessons.filter(
      (completedId) => completedId.toString() !== lessonId
    );

    // Only save if something was actually removed
    if (enrollment.completedLessons.length !== initialLength) {
      await enrollment.save();
    }

    // Get total lessons in course for progress calculation
    const sections = await Section.find({ course: courseId });
    const sectionIds = sections.map((s) => s._id);
    const totalLessons = await Lesson.countDocuments({ section: { $in: sectionIds } });

    res.status(200).json({
      message: "Lesson marked as incomplete.",
      lesson: {
        _id: lesson._id,
        title: lesson.title,
        section: lesson.section,
      },
      completedLessonsCount: enrollment.completedLessons.length,
      totalLessons,
      progressPercentage:
        totalLessons > 0
          ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
          : 0,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error marking lesson incomplete.",
      error: error.message,
    });
  }
};

module.exports = {
  enrollInCourse,
  getMyCourses,
  getEnrolledCourse,
  getEnrolledLesson,
  markLessonComplete,
  getCourseProgress,
  markLessonIncomplete,
};
