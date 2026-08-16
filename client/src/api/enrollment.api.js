import API from "./axios";

export const EnrollCourse = (courseId) => API.post("/enrollments", { courseId });

export const GetMyEnrollments = () => API.get("/enrollments/my-courses");
