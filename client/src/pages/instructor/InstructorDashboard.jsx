import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../api/auth.api"
import { useAuth } from "../../context/AuthContext";

import { getAllCourses, deleteCourse } from "../../api/course.api";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const { logoutState, user } = useAuth();
  const [myCourses, setMyCourses] = useState([]);

  const handleLogoutClick = async () => {
    try {
      await LogoutUser();
      logoutState();
      // Redirect back to login after cookie is cleared
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    const helper = async () => {
      const myCourses = await getAllCourses();
      setMyCourses(
        myCourses.data.courses.filter(
          (course) => course.instructor._id === user._id,
        ),
      );
      console.log(myCourses.data.courses);
    };
    helper();
  }, [user._id]);

  const handleCourse = async (id) => {
    navigate(`/${id}`);
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
      {/* Header */}
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">$2,550</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Enrolled Students
          </p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">462</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Active Courses</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            2 Published / 1 Draft
          </h2>
        </div>
      </div>

      {/* Course List Table */}
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
                {/* <th className="p-4">Students</th> */}
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {myCourses &&
                myCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 transition">
                    <td
                      className="p-4 font-semibold text-gray-800"
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
                    {/* <td className="p-4 text-gray-600">{course.students}</td> */}
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

// Mock Data (Replace with API call later)
// const myCourses = [
//   {
//     id: 101,
//     title: "Node.js & Express REST API Masterclass",
//     students: 342,
//     revenue: "$1,710",
//     status: "Published",
//   },
//   {
//     id: 102,
//     title: "Advanced React & Redux Toolkit",
//     students: 120,
//     revenue: "$840",
//     status: "Published",
//   },
//   {
//     id: 103,
//     title: "Docker & Kubernetes for Beginners",
//     students: 0,
//     revenue: "$0",
//     status: "Draft",
//   },
// ];
