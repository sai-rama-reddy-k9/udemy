import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetMyEnrollments } from "../../api/enrollment.api";

const MyEnrollments = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await GetMyEnrollments();
        setEnrollments(response.data.enrollments);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Enrollments</h1>

            <p className="text-sm text-gray-500">
              Courses you have enrolled in.
            </p>
          </div>

          <button
            onClick={() => navigate("/student-dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition"
          >
           {"< ---- "} Cancle
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {loading && (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-700">
              Loading your enrollments...
            </h2>
          </div>
        )}

        {!loading && enrollments.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm text-center py-20 px-6">
            <h2 className="text-2xl font-bold text-gray-800">
              No Enrollments Yet
            </h2>

            <p className="text-gray-500 mt-2 mb-6">
              You haven't enrolled in any courses yet.
            </p>

            <button
              onClick={() => navigate("/student-dashboard")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Explore Courses
            </button>
          </div>
        )}

        {!loading && enrollments.length > 0 && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Your Courses</h2>

              <p className="text-gray-500 mt-1">
                Continue learning from where you left off.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-48 bg-gray-200">
                    <img
                      src={
                        enrollment.course?.thumbnail ||
                        "https://via.placeholder.com/800x400"
                      }
                      alt={enrollment.course?.title || "Course"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {enrollment.course?.title}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {enrollment.course?.description}
                    </p>

                    <div className="flex items-center justify-between mb-5">
                      <span className="text-sm text-gray-500">
                        {enrollment.course?.category}
                      </span>

                      <span className="text-sm font-semibold text-green-600">
                        Enrolled
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/student/course/${enrollment.course?._id}`)
                      }
                      className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MyEnrollments;
