const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");

const getInstructorDashboardStats = async (req, res) => {
  try {
    const instructorId = req.user?.id;

    if (!instructorId) {
      return res.status(400).json({
        message: "Instructor ID is required.",
      });
    }

    const instructorCourses = await Course.find({
      instructor: instructorId,
      isDeleted: { $ne: true },
    }).select("_id price isPublished");

    if (!instructorCourses.length) {
      return res.status(200).json({
        totalRevenue: 0,
        totalEnrolledStudents: 0,
        publishedCourses: 0,
        draftCourses: 0,
      });
    }

    const courseIds = instructorCourses.map((course) => course._id);

    const enrollmentCounts = await Enrollment.aggregate([
      {
        $match: {
          course: { $in: courseIds },
        },
      },
      {
        $group: {
          _id: "$course",
          enrollments: { $sum: 1 },
        },
      },
    ]);

    const enrollmentsByCourse = new Map(
      enrollmentCounts.map((item) => [item._id.toString(), item.enrollments]),
    );

    const totalEnrolledStudents = enrollmentCounts.reduce(
      (sum, item) => sum + Number(item.enrollments || 0),
      0,
    );

    const totalRevenue = instructorCourses.reduce((sum, course) => {
      const enrollmentCount = Number(
        enrollmentsByCourse.get(course._id.toString()) || 0,
      );
      const price = Number(course.price || 0);

      return sum + price * enrollmentCount;
    }, 0);

    const publishedCourses = instructorCourses.filter(
      (course) => course.isPublished === true,
    ).length;
    const draftCourses = instructorCourses.length - publishedCourses;

    return res.status(200).json({
      totalRevenue,
      totalEnrolledStudents,
      publishedCourses,
      draftCourses,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching instructor dashboard stats.",
      error: error.message,
    });
  }
};

module.exports = {
  getInstructorDashboardStats,
};
