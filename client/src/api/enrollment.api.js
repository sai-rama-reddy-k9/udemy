import API from "./axios";

export const EnrollCourse = (courseId) => API.post("/enrollment", { courseId });

export const GetMyEnrollments = () => API.get("/enrollment");
