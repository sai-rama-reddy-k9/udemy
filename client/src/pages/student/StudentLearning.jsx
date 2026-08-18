import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  GetEnrolledCourse,
  ToggleLessonComplete,
} from "../../api/enrollment.api";

const StudentLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await GetEnrolledCourse(id);

        setCourse(response.data.course);
        setSections(response.data.sections);
        setCompletedLessons(response.data.completedLessons || []);

        const firstLesson = response.data.sections?.[0]?.lessons?.[0];

        if (firstLesson) {
          setSelectedLesson(firstLesson);
        }
      } catch (error) {
        console.error(error);

        if (error.response?.status === 403) {
          alert("You are not enrolled in this course.");
          navigate("/my-enrollments");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleComplete = async (lessonId) => {
    try {
      const response = await ToggleLessonComplete(id, lessonId);

      setCompletedLessons(response.data.completedLessons);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading course...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{course.title}</h1>

          <p className="text-sm text-gray-400">
            Instructor: {course.instructor?.name}
          </p>
        </div>

        <button
          onClick={() => navigate("/my-enrollments")}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r p-5 overflow-y-auto">
          <h2 className="text-lg font-bold mb-5">Course Content</h2>

          {sections.map((section) => (
            <div key={section._id} className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.lessons.map((lesson) => {
                  const completed = completedLessons.includes(lesson._id);

                  return (
                    <button
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left p-3 rounded-lg text-sm ${
                        selectedLesson?._id === lesson._id
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{lesson.title}</span>

                        {completed && <span className="text-green-600">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Learning Area */}
        <main className="flex-1 p-8">
          {selectedLesson ? (
            <>
              <h2 className="text-2xl font-bold mb-5">
                {selectedLesson.title}
              </h2>

              <div className="bg-black rounded-xl overflow-hidden">
                <video
                  key={selectedLesson._id}
                  src={selectedLesson.videoUrl}
                  controls
                  className="w-full max-h-150"
                />
              </div>

              <button
                onClick={() => handleComplete(selectedLesson._id)}
                className={`mt-5 px-5 py-3 rounded-lg font-semibold ${
                  completedLessons.includes(selectedLesson._id)
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                {completedLessons.includes(selectedLesson._id)
                  ? "Completed ✓"
                  : "Mark as Complete"}
              </button>
            </>
          ) : (
            <div className="text-center mt-20">
              <h2 className="text-xl font-semibold">No lessons available.</h2>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentLearning;
