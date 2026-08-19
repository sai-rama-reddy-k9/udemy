import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllCourses } from "../api/course.api";
import { useEffect, useState } from "react";
import { EnrollCourse } from "../api/enrollment.api";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState("");
  const [enrollmentError, setEnrollmentError] = useState("");
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesError("");
        const response = await getAllCourses({ limit: 100 });

        const publishedCourses = Array.isArray(response?.data?.courses)
          ? response.data.courses.filter(
              (course) => course.isPublished === true,
            )
          : [];

        setFeaturedCourses(publishedCourses.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured courses:", error);
        setCoursesError(
          error?.response?.data?.message ||
            "Unable to load featured courses right now.",
        );
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollmentError("");

    if (!user) {
      navigate("/login", {
        state: {
          redirectAfterLogin: "enroll",
          courseId,
        },
      });
      return;
    }

    try {
      setEnrollingCourseId(courseId);
      await EnrollCourse(courseId);
      navigate("/my-enrollments");
    } catch (error) {
      const message =
        error?.response?.data?.message || "Unable to enroll in this course.";

      if (message.toLowerCase().includes("already enrolled")) {
        navigate("/my-enrollments");
      } else {
        setEnrollmentError(message);
      }
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const categories = [
    "Development",
    "Design",
    "Business",
    "Data Science",
    "Marketing",
    "Personal Growth",
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 1. Hero Section */}
      <section className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-20 px-6 md:px-12 text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Master New Skills with Industry Experts
            </h1>
            <p className="text-lg text-blue-100">
              Access hundreds of high-quality courses in web development,
              design, business, and more. Learn at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold shadow-md hover:bg-gray-100 transition text-center"
              >
                Get Started for Free
              </Link>
              <a
                href="#courses"
                className="px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold hover:bg-blue-900 transition text-center"
              >
                Explore Courses
              </a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-72 bg-blue-500/30 border-2 border-dashed border-blue-300/50 rounded-2xl flex items-center justify-center text-blue-100">
              {/* [ Hero Illustration / Banner ] */}
              <img
                src="banner.png"
                alt="Hero Illustration"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats */}
      <section className="bg-white border-b border-gray-200 py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-blue-600">10,000+</h3>
            <p className="text-sm text-gray-500 mt-1">Active Students</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-blue-600">500+</h3>
            <p className="text-sm text-gray-500 mt-1">Quality Courses</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-blue-600">120+</h3>
            <p className="text-sm text-gray-500 mt-1">Expert Instructors</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-blue-600">4.8 / 5</h3>
            <p className="text-sm text-gray-500 mt-1">Average Satisfaction</p>
          </div>
        </div>
      </section>

      {/* 3. Categories */}
      <section className="py-12 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Top Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-full font-medium text-sm text-gray-700 hover:border-blue-600 hover:text-blue-600 transition shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Featured Courses */}
      <section id="courses" className="py-12 px-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Featured Courses
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Hand-picked courses by our editorial team
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loadingCourses && (
            <p className="md:col-span-3 text-center text-gray-500 py-12">
              Loading featured courses...
            </p>
          )}

          {!loadingCourses && coursesError && (
            <p className="md:col-span-3 text-center text-red-600 py-12">
              {coursesError}
            </p>
          )}

          {!loadingCourses && !coursesError && featuredCourses.length === 0 && (
            <p className="md:col-span-3 text-center text-gray-500 py-12">
              No published courses are available yet.
            </p>
          )}

          {!loadingCourses &&
            !coursesError &&
            featuredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-44 bg-gray-200 w-full flex items-center justify-center text-gray-400 font-medium">
                    <img
                      src={
                        course.thumbnail ||
                        "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                      }
                      alt={course.title || "Course"}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {course.instructor?.name || "Instructor"}
                    </p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-900">
                    ₹{course.price}
                  </span>
                  <button
                    onClick={() => handleEnroll(course._id)}
                    disabled={enrollingCourseId === course._id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {enrollingCourseId === course._id
                      ? "Enrolling..."
                      : "Enroll Now"}
                  </button>
                </div>
              </div>
            ))}
        </div>

        {enrollmentError && (
          <p className="mt-6 text-center text-red-600">{enrollmentError}</p>
        )}
      </section>

      {/* 5. Why Choose Us (About Section) */}
      <section className="bg-white py-16 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Why Learn With Us?
            </h2>
            <p className="text-gray-500 mt-2">
              We provide an immersive, flexible, and affordable learning
              experience designed to help you reach your goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                ⚡
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Learn at Your Own Pace
              </h3>
              <p className="text-sm text-gray-600">
                Lifetime access to all enrolled courses. Study whenever and
                wherever you want.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                🎓
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Expert Instructors
              </h3>
              <p className="text-sm text-gray-600">
                Learn from industry practitioners with real-world experience in
                their fields.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 border border-gray-100 text-center">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                📜
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Certificates of Completion
              </h3>
              <p className="text-sm text-gray-600">
                Earn verifiable certificates upon finishing courses to highlight
                on your resume.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Become an Instructor CTA */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Become an Instructor Today</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Join thousands of instructors teaching millions of students
            worldwide. We provide the tools to share your knowledge.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Start Teaching
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
