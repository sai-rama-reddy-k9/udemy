import API from "./axios";

export const EnrollCourse = (courseId) =>
  API.post("/enrollments/enroll", { courseId });

export const GetMyEnrollments = () => API.get("/enrollments/my-courses");

export const GetEnrolledCourse = (courseId) =>
  API.get(`/enrollments/course/${courseId}`);