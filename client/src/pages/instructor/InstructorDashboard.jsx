import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../api/auth.api";
import { useAuth } from "../../context/AuthContext";

import { getAllCourses, deleteCourse } from "../../api/course.api";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { logoutState, user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);

  const instructorId = user?._id ?? user?.id;

  const handleLogoutClick = async () => {
    try {
      await LogoutUser();
      logoutState();
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!instructorId) return;

      try {
        const response = await getAllCourses();
        const courses = Array.isArray(response?.data?.courses)
          ? response.data.courses
          : [];

        const instructorCourses = courses.filter((course) => {
          const courseInstructorId =
            course?.instructor?._id ??
            course?.instructor?.id ??
            course?.instructor;

          return String(courseInstructorId) === String(instructorId);
        });

        setMyCourses(instructorCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setMyCourses([]);
      }
    };

    fetchMyCourses();
  }, [instructorId]);

  const stats = useMemo(() => {
    const publishedCourses = myCourses.filter(
      (course) => course?.isPublished === true,
    ).length;
    const draftCourses = myCourses.length - publishedCourses;

    return {
      publishedCourses,
      draftCourses,
      totalRevenue: null,
      totalEnrolledStudents: null,
      totalCourses: myCourses.length,
    };
  }, [myCourses]);

  const handleCourse = async (id) => {
    navigate(`/instructor/course/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    setMyCourses((prevCourses) =>
      prevCourses.filter((course) => course._id !== id),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Instructor Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your courses and view performance analytics.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            onClick={() => navigate("/create-course")}
          >
            + Create New Course
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalRevenue === null ? "N/A" : `$${stats.totalRevenue}`}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Revenue is not exposed by the current course API.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Enrolled Students
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {stats.totalEnrolledStudents === null
              ? "N/A"
              : stats.totalEnrolledStudents}
          </h2>
          <p className="text-xs text-gray-500 mt-2">
            Enrollment counts are not returned by the current API.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Courses</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            {stats.publishedCourses} Published / {stats.draftCourses} Draft
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Your Courses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="p-4">Course Title</th>
                <th className="p-4">Status</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {myCourses.map((course) => (
                <tr key={course._id} className="hover:bg-gray-50 transition">
                  <td
                    className="p-4 font-semibold text-gray-800 cursor-pointer"
                    onClick={() => handleCourse(course._id)}
                  >
                    {course.title}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        course.isPublished === true
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{course.price}</td>
                  <td className="p-4 text-right space-x-4">
                    <button
                      className="text-blue-600 hover:underline font-medium"
                      onClick={() => handleEdit(course._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline font-medium"
                      onClick={() => handleDelete(course._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
