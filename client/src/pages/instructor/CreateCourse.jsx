import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  // Form State (Swap with backend payload later)
  const [courseData, setCourseData] = useState({
    title: "",
    subtitle: "",
    category: "Development",
    price: "",
    description: "",
    thumbnail: "",
  });

  const [sections, setSections] = useState([
    {
      id: 1,
      title: "Introduction to the Course",
      lessons: [
        {
          id: 101,
          title: "Course Overview",
          videoUrl: "",
          isFreePreview: true,
        },
      ],
    },
  ]);

  // Handlers for Course Details
  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  // Handlers for Curriculum Management
  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        title: `Section ${sections.length + 1}`,
        lessons: [],
      },
    ]);
  };

  const addLesson = (sectionId) => {
    setSections(
      sections.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            lessons: [
              ...sec.lessons,
              {
                id: Date.now(),
                title: "New Lesson",
                videoUrl: "",
                isFreePreview: false,
              },
            ],
          };
        }
        return sec;
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting Payload:", { ...courseData, sections });
      // TODO: Call API.post("/courses", payload)
      await API.post("/course/create-course", payload);
      navigate("/instructor-dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => navigate("/instructor-dashboard")}
              className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Course
            </h1>
          </div>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-sm"
          >
            Publish Course
          </button>
        </div>

        {/* Step Navigation Bar */}
        <div className="flex border-b border-gray-200 mb-8 bg-white rounded-xl p-2 shadow-sm">
          <button
            onClick={() => setActiveStep(1)}
            className={`flex-1 py-3 text-center rounded-lg font-semibold text-sm transition ${
              activeStep === 1
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            1. Basic Information
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`flex-1 py-3 text-center rounded-lg font-semibold text-sm transition ${
              activeStep === 2
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            2. Curriculum & Lessons
          </button>
        </div>

        {/* STEP 1: Basic Info & Details */}
        {activeStep === 1 && (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleChange}
                placeholder="e.g., Ultimate React & Node.js Bootcamp"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subtitle / Short Summary
              </label>
              <input
                type="text"
                name="subtitle"
                value={courseData.subtitle}
                onChange={handleChange}
                placeholder="e.g., Master full-stack web development from scratch"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={courseData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($ USD)
                </label>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleChange}
                  placeholder="e.g., 49.99"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course Description
              </label>
              <textarea
                name="description"
                rows="5"
                value={courseData.description}
                onChange={handleChange}
                placeholder="Detailed explanation of what students will learn..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Thumbnail Image URL
              </label>
              <input
                type="text"
                name="thumbnail"
                value={courseData.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg or Cloudinary link"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Next: Build Curriculum →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Curriculum Builder */}
        {activeStep === 2 && (
          <div className="space-y-6">
            {sections.map((section, sIdx) => (
              <div
                key={section.id}
                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3 w-full max-w-md">
                    <span className="font-bold text-gray-400">#{sIdx + 1}</span>
                    <input
                      type="text"
                      defaultValue={section.title}
                      className="font-bold text-lg text-gray-800 w-full outline-none border-b border-transparent focus:border-blue-500 px-1 py-0.5"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => addLesson(section.id)}
                    className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    + Add Lesson
                  </button>
                </div>

                {/* Lessons inside Section */}
                <div className="space-y-3 pl-4 border-l-2 border-gray-100">
                  {section.lessons.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">
                      No lessons added to this section yet.
                    </p>
                  ) : (
                    section.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson.id}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-xs text-gray-400 font-mono">
                            {sIdx + 1}.{lIdx + 1}
                          </span>
                          <input
                            type="text"
                            defaultValue={lesson.title}
                            placeholder="Lesson title"
                            className="bg-white px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-800 flex-1 outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            defaultValue={lesson.videoUrl}
                            placeholder="Video Embed/Cloudinary URL"
                            className="bg-white px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-800 w-48 outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                            <input
                              type="checkbox"
                              defaultChecked={lesson.isFreePreview}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Free Preview
                          </label>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}

            {/* Add Section Button */}
            <button
              type="button"
              onClick={addSection}
              className="w-full py-4 border-2 border-dashed border-gray-300 text-gray-600 font-semibold rounded-2xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 transition flex items-center justify-center gap-2"
            >
              + Add New Section
            </button>

            <div className="flex justify-between pt-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                ← Back to Basic Info
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md"
              >
                Save & Publish Course
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateCourse;
