import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  GetCourseProgress,
  GetEnrolledCourse,
  MarkLessonComplete,
  MarkLessonIncomplete,
} from "../../api/enrollment.api";
import VideoPlayer from "../../components/player/VideoPlayer";
import SidebarPlaylist from "../../components/player/SidebarPlaylist";

const StudentLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressLoading, setProgressLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({
    totalLessons: 0,
    completedLessons: 0,
    percentage: 0,
  });

  const normalizeLessonIds = (ids = []) =>
    ids.map((id) =>
      id && typeof id === "object" ? id.toString() : String(id),
    );

  const isLessonCompleted = (lessonId) =>
    completedLessons.some(
      (completedId) => String(completedId) === String(lessonId),
    );

  const currentLessonIndex = useMemo(() => {
    if (!selectedLesson || !lessons.length) return -1;
    return lessons.findIndex((lesson) => lesson._id === selectedLesson._id);
  }, [lessons, selectedLesson]);

  const prevDisabled = currentLessonIndex <= 0;
  const nextDisabled =
    currentLessonIndex === -1 || currentLessonIndex >= lessons.length - 1;

  const fetchProgress = async (courseId) => {
    if (!courseId) return;

    try {
      setProgressLoading(true);
      const response = await GetCourseProgress(courseId);
      const payload = response?.data ?? {};
      const totalLessons = Number(payload.totalLessons ?? payload.total ?? 0);
      const completedCount = Number(
        payload.completedLessons ?? payload.completed ?? 0,
      );
      const percentage =
        totalLessons > 0
          ? Math.round((completedCount / totalLessons) * 100)
          : 0;

      setProgress({
        totalLessons,
        completedLessons: completedCount,
        percentage,
      });
    } catch (err) {
      console.error("Error fetching course progress:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load course progress right now.",
      );
    } finally {
      setProgressLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setLoading(false);
        setError("Course ID is missing.");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await GetEnrolledCourse(id);
        const courseData = response?.data?.course || null;
        const sectionsData = Array.isArray(response?.data?.sections)
          ? response.data.sections
          : [];
        const completed = Array.isArray(response?.data?.completedLessons)
          ? normalizeLessonIds(response.data.completedLessons)
          : [];

        const flattenedLessons = sectionsData.flatMap((section) =>
          Array.isArray(section.lessons) ? section.lessons : [],
        );

        setCourse(courseData);
        setSections(sectionsData);
        setLessons(flattenedLessons);
        setCompletedLessons(completed);

        const firstLesson =
          flattenedLessons.find((lesson) => lesson?._id) || null;
        setSelectedLesson(firstLesson);

        await fetchProgress(id);
      } catch (err) {
        console.error("Error fetching enrolled course:", err);

        if (err.response?.status === 403) {
          alert("You are not enrolled in this course.");
          navigate("/my-enrollments");
          return;
        }

        setError(
          err.response?.data?.message ||
            "Unable to load this course right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, navigate]);

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };

  const goToPreviousLesson = () => {
    if (prevDisabled || currentLessonIndex <= 0) return;
    setSelectedLesson(lessons[currentLessonIndex - 1]);
  };

  const goToNextLesson = () => {
    if (nextDisabled || currentLessonIndex === -1) return;
    setSelectedLesson(lessons[currentLessonIndex + 1]);
  };

  const handleComplete = async (lessonId) => {
    if (!id || !lessonId || isLessonCompleted(lessonId)) return;

    console.log("[StudentLearning] handleComplete", {
      courseId: id,
      lessonId,
      completedLessons,
    });

    try {
      const response = await MarkLessonComplete(id, lessonId);
      console.log("[StudentLearning] mark complete response", response?.data);

      const updatedCompletedLessons = Array.from(
        new Set([
          ...completedLessons.map((item) => String(item)),
          String(lessonId),
        ]),
      );

      setCompletedLessons(updatedCompletedLessons);
      await fetchProgress(id);
    } catch (err) {
      console.error("Error marking lesson complete:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update lesson progress right now.",
      );
    }
  };

  const handleIncomplete = async (lessonId) => {
    if (!id || !lessonId || !isLessonCompleted(lessonId)) return;

    try {
      const response = await MarkLessonIncomplete(id, lessonId);
      console.log("[StudentLearning] mark incomplete response", response?.data);

      const updatedCompletedLessons = completedLessons.filter(
        (item) => String(item) !== String(lessonId),
      );

      setCompletedLessons(updatedCompletedLessons);
      await fetchProgress(id);
    } catch (err) {
      console.error("Error marking lesson incomplete:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update lesson progress right now.",
      );
    }
  };

  const selectedLessonVideo =
    selectedLesson?.videoUrl ||
    selectedLesson?.video ||
    selectedLesson?.contentUrl ||
    selectedLesson?.url ||
    selectedLesson?.link;

  const selectedLessonContent =
    selectedLesson?.description ||
    selectedLesson?.content ||
    "No lesson description is available for this lesson.";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Loading course...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/my-enrollments")}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Back to Enrollments
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Course not found
          </h2>
          <button
            onClick={() => navigate("/my-enrollments")}
            className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Go to My Enrollments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{course.title || "Course"}</h1>
          <p className="text-sm text-gray-400">
            Instructor: {course.instructor?.name || "Instructor"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">
            {progress.completedLessons || completedLessons.length}/
            {progress.totalLessons || lessons.length} complete
          </span>
          <button
            onClick={() => navigate("/my-enrollments")}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)] flex-col lg:flex-row">
        <SidebarPlaylist
          sections={sections}
          selectedLessonId={selectedLesson?._id}
          completedLessons={completedLessons}
          onSelectLesson={handleSelectLesson}
        />

        <main className="flex-1 p-6 lg:p-8">
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Course Progress
                </p>
                <p className="text-sm text-gray-600">
                  {progressLoading
                    ? "Loading..."
                    : `${progress.completedLessons || completedLessons.length} / ${progress.totalLessons || lessons.length} lessons`}
                </p>
              </div>

              <div className="text-sm font-semibold text-gray-700">
                {progressLoading
                  ? "Updating..."
                  : `${progress.percentage || 0}%`}
              </div>
            </div>

            <div className="mt-3 h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${progress.percentage || 0}%` }}
              />
            </div>
          </div>

          {selectedLesson && (
            <VideoPlayer
              lesson={selectedLesson}
              lessonDescription={selectedLessonContent}
              videoUrl={selectedLessonVideo}
              isCompleted={isLessonCompleted(selectedLesson._id)}
              onMarkComplete={() => handleComplete(selectedLesson._id)}
              onMarkIncomplete={() => handleIncomplete(selectedLesson._id)}
              onPrevious={goToPreviousLesson}
              onNext={goToNextLesson}
              previousDisabled={prevDisabled}
              nextDisabled={nextDisabled}
            />
          )}

          {!selectedLesson && !lessons.length && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No lessons available
              </h2>
              <p className="text-gray-500">
                This course has not published any lessons yet.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentLearning;
