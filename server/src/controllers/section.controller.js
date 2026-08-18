const Section = require("../models/section.model");
const Course = require("../models/course.model");

// Create section
const createSection = async (req, res) => {
  try {
    const { courseId, title, order } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        message: "Course ID and title are required.",
      });
    }

    const course = await Course.findById(courseId);

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

    const section = await Section.create({
      course: courseId,
      title,
      order: order ?? 0,
    });

    res.status(201).json({
      message: "Section created successfully.",
      section,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating section.",
      error: error.message,
    });
  }
};

// Get sections of a course
const getCourseSections = async (req, res) => {
  try {
    const { courseId } = req.params;

    const sections = await Section.find({
      course: courseId,
    }).sort({ order: 1 });

    res.status(200).json({ sections });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching sections.",
      error: error.message,
    });
  }
};

module.exports = {
  createSection,
  getCourseSections,
};
