import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  // Mock Featured Courses
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Dr. Angela Yu",
      category: "Development",
      rating: "4.8",
      students: "12,400",
      price: "$19.99",
    },
    {
      id: 2,
      title: "UI/UX Design Essentials with Figma",
      instructor: "Daniel Walter Scott",
      category: "Design",
      rating: "4.9",
      students: "8,150",
      price: "$14.99",
    },
    {
      id: 3,
      title: "Data Science & Machine Learning A-Z",
      instructor: "Kirill Eremenko",
      category: "Data Science",
      rating: "4.7",
      students: "15,300",
      price: "$24.99",
    },
  ];

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
              [ Hero Illustration / Banner ]
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
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="h-44 bg-gray-200 w-full flex items-center justify-center text-gray-400 font-medium">
                  Course Thumbnail
                </div>
                <div className="p-6">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {course.category}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.instructor}
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-600">
                    <span className="font-bold text-amber-500">
                      ★ {course.rating}
                    </span>
                    <span>({course.students} students)</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">
                  {course.price}
                </span>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
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
