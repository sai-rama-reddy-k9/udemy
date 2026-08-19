import API from "./axios";

export const createCourse = (courseData) => API.post("/course", courseData);

export const getAllCourses = (params = {}) =>
  API.get("/course", {
    params: {
      _t: Date.now(),
      ...params,
    },
  });

export const getCourseById = (id) => API.get(`/course/${id}`);

export const editCourse = (id, data) => API.put(`/course/edit/${id}`, data);

export const deleteCourse = (id) => API.delete(`/course/${id}`);
