const Lesson = require("../models/lesson.model");
const Section = require("../models/section.model");
const Course = require("../models/course.model");

// Create lesson
const createLesson = async (req, res) => {
  try {
    const {
      sectionId,
      title,
      videoUrl,
      duration,
      order,
      isPreview,
    } = req.body;

    if (!sectionId || !title || !videoUrl || duration === undefined) {
      return res.status(400).json({
        message: "Section, title, video URL and duration are required.",
      });
    }

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        message: "Section not found.",
      });
    }

    const course = await Course.findById(section.course);

    if (!course) {
      return res.status(404).json({
        message: "Course not found.",
      });
    }

    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not allowed to modify this course.",
      });
    }

    const lesson = await Lesson.create({
      section: sectionId,
      title,
      videoUrl,
      duration,
      order: order ?? 0,
      isPreview: isPreview ?? false,
    });

    res.status(201).json({
      message: "Lesson created successfully.",
      lesson,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating lesson.",
      error: error.message,
    });
  }
};

// Get lessons of a section
const getSectionLessons = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const lessons = await Lesson.find({
      section: sectionId,
    }).sort({ order: 1 });

    res.status(200).json({ lessons });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lessons.",
      error: error.message,
    });
  }
};

module.exports = {
  createLesson,
  getSectionLessons,
};
