import API from "./axios";

export const GetInstructorDashboardStats = () =>
  API.get("/instructor/dashboard-stats");
