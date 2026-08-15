import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { logoutState } = useAuth();

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

  // Mock Data (Replace with API call later)
  const enrolledCourses = [
    {
      id: 1,
      title: "Full-Stack Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      progress: 65,
      totalLectures: 40,
      completedLectures: 26,
      image: "https://via.placeholder.com/300x160",
    },
    {
      id: 2,
      title: "React & Tailwind CSS Masterclass",
      instructor: "Brad Traversy",
      progress: 30,
      totalLectures: 20,
      completedLectures: 6,
      image: "https://via.placeholder.com/300x160",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Learning</h1>
          <p className="text-gray-500">
            Welcome back! Pick up where you left off.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Browse Courses
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            onClick={handleLogoutClick}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">2</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Completed Lessons</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">32</h2>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm font-medium text-gray-500">Hours Learned</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">18.5 hrs</h2>
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">In Progress</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="h-40 bg-gray-200 w-full flex items-center justify-center text-gray-400">
                Course Thumbnail
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Course
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-1 line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Instructor: {course.instructor}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-50 bg-gray-50/50">
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                Continue Watching
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
