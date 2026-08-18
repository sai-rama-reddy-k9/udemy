import { useNavigate } from "react-router-dom";

import { getAllCourses } from "../../api/course.api";
import { useState, useEffect } from "react";

import { LogoutUser } from "../../api/auth.api";

import { useAuth } from "../../context/AuthContext";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [myCourses, setMyCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const { logoutState ,user} = useAuth();

  useEffect(() => {
    const helper = async () => {
      setLoading(true);

      try {
        const response = await getAllCourses();
        setMyCourses(response.data.courses);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    helper();
  }, []);

  const handleCourse = async (id) => {
    navigate(`/student/course/${id}`);
  };

  const handleLogout = async () => {
    try {
      await LogoutUser();

      logoutState();

      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Filter courses based on title
  const filteredCourses = myCourses.filter((course) =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase().trim()),
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user.name} 's dashboard
            </h1>

            <p className="text-sm text-gray-500">
              Discover courses and start learning.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/my-enrollments")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              My Enrollments
            </button>

            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Explore Courses</h2>

          <p className="text-gray-500 mt-1">
            Choose a course and start learning today.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses by title..."
            className="w-full md:w-96 px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Loading */}
          {loading && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">
                Loading courses...
              </h3>
            </div>
          )}

          {/* No courses at all */}
          {!loading && myCourses.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">
                No courses available
              </h3>

              <p className="text-gray-500 mt-2">
                Check back later for new courses.
              </p>
            </div>
          )}

          {/* No search results */}
          {!loading && myCourses.length > 0 && filteredCourses.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-xl font-semibold text-gray-700">
                No courses found
              </h3>

              <p className="text-gray-500 mt-2">
                No course matches "{searchTerm}".
              </p>
            </div>
          )}

          {/* Filtered Course Cards */}
          {!loading &&
            filteredCourses.map((course) => (
              <div
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                key={course._id}
              >
                <div className="h-48 bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                    alt="Course"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {course.title || "Course Title"}
                  </h3>

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {course.description ||
                      "Learn frontend, backend and database development from scratch."}
                  </p>

                  <div className="flex items-center justify-between mb-5">
                    <span className="text-sm text-gray-500">
                      {course.category || "Development"}
                    </span>

                    <span className="text-lg font-bold text-gray-800">
                      {course.price || "₹999"}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCourse(course._id)}
                    className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    View Course
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
