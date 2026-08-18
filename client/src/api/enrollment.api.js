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

export const MarkLessonComplete = (courseId, lessonId) =>
  API.patch(`/enrollments/course/${courseId}/lesson/${lessonId}/complete`);

export const CompleteLesson = (courseId, lessonId) =>
  MarkLessonComplete(courseId, lessonId);

export const ToggleLessonComplete = (courseId, lessonId) =>
  MarkLessonComplete(courseId, lessonId);

export const MarkLessonIncomplete = (courseId, lessonId) =>
  API.patch(`/enrollments/course/${courseId}/lesson/${lessonId}/incomplete`);

export const IncompleteLesson = (courseId, lessonId) =>
  MarkLessonIncomplete(courseId, lessonId);

export const GetCourseProgress = (courseId) =>
  API.get(`/enrollments/course/${courseId}/progress`);
