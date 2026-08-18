const Course = require("../models/course.model");

// 1. CREATE a new course (Instructor/Admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, thumbnail } = req.body;

    if (!title || !description || price === undefined || !category) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      category,
      thumbnail,
      instructor: req.user.id, // Extracted from verifyToken middleware
    });

    const savedCourse = await newCourse.save();
    res
      .status(201)
      .json({ message: "Course created successfully.", course: savedCourse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating course.", error: error.message });
  }
};

// 2. READ all published courses (Public with filtering & pagination)
const getAllCourses = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;

    const filter = { isDeleted: { $ne: true } };

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive title search
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email profilePicture")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCourses = await Course.countDocuments(filter);

    res.status(200).json({
      totalCourses,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: Number(page),
      courses,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching courses.", error: error.message });
  }
};

// 3. READ a single course by ID (Public)
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      _id: id,
      isDeleted: { $ne: true },
    }).populate("instructor", "name email bio profilePicture");

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    res.status(200).json({ course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching course.", error: error.message });
  }
};

// 4. UPDATE course details (Instructor owner / Admin only)
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course || course.isDeleted) {
      return res.status(404).json({ message: "Course not found." });
    }

    // Ensure the logged-in user is the course instructor or an admin
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this course." });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { $set: { ...req.body, isDeleted: false, deletedAt: null } },
      { new: true, runValidators: true },
    );

    res
      .status(200)
      .json({ message: "Course updated successfully.", course: updatedCourse });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating course.", error: error.message });
  }
};

// 5. DELETE course (Instructor owner / Admin only)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    if (course.isDeleted) {
      return res.status(200).json({ message: "Course already deleted." });
    }

    // Ownership check
    if (
      course.instructor.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You do not own this course." });
    }

    course.isDeleted = true;
    course.deletedAt = new Date();
    await course.save();

    res.status(200).json({
      message: "Course deleted successfully.",
      course: {
        _id: course._id,
        isDeleted: course.isDeleted,
        deletedAt: course.deletedAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting course.", error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
