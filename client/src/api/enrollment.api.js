import API from "./axios";

export const EnrollCourse = (courseId) =>
  API.post("/enrollments/enroll", { courseId });

export const GetMyEnrollments = () => API.get("/enrollments/my-courses");

export const GetEnrolledCourse = (courseId) =>
  API.get(`/enrollments/course/${courseId}`);

export const GetLessonById = (courseId, lessonId) =>
  API.get(`/enrollments/course/${courseId}/lesson/${lessonId}`);

export const GetLesson = (courseId, lessonId) =>
  GetLessonById(courseId, lessonId);

export const MarkLessonComplete = async (courseId, lessonId) => {
  const url = `/enrollments/course/${courseId}/lessons/${lessonId}/complete`;

  console.log("[MarkLessonComplete] request", {
    courseId,
    lessonId,
    url,
  });

  try {
    const response = await API.patch(url);
    console.log("[MarkLessonComplete] success", response?.data);
    return response;
  } catch (error) {
    console.error("[MarkLessonComplete] error", error?.response?.data || error);
    throw error;
  }
};

export const CompleteLesson = (courseId, lessonId) =>
  MarkLessonComplete(courseId, lessonId);

export const ToggleLessonComplete = (courseId, lessonId) =>
  MarkLessonComplete(courseId, lessonId);

export const MarkLessonIncomplete = async (courseId, lessonId) => {
  const url = `/enrollments/course/${courseId}/lessons/${lessonId}/incomplete`;

  console.log("[MarkLessonIncomplete] request", {
    courseId,
    lessonId,
    url,
  });

  try {
    const response = await API.patch(url);
    console.log("[MarkLessonIncomplete] success", response?.data);
    return response;
  } catch (error) {
    console.error(
      "[MarkLessonIncomplete] error",
      error?.response?.data || error,
    );
    throw error;
  }
};

export const IncompleteLesson = (courseId, lessonId) =>
  MarkLessonIncomplete(courseId, lessonId);

export const GetCourseProgress = (courseId) =>
  API.get(`/enrollments/course/${courseId}/progress`);
