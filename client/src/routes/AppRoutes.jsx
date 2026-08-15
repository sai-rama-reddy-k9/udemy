import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";

import StudentDashboard from "../pages/StudentDashboard";
import InstructorDashboard from "../pages/InstructorDashboard";

import CourseCatalog from "../pages/CourseCatalog";
import CourseDetail from "../pages/CourseDetail";
import CoursePlayer from "../pages/CoursePlayer";

import ProtectedRoute from "./ProtectedRoutes";

import CreateCourse from "../pages/instructor/CreateCourse";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/course-catalog" element={<CourseCatalog />} />
      <Route path="/course-detail" element={<CourseDetail />} />

      {/* --- Protected Routes (Log in required: Any authenticated user) --- */}
      <Route element={<ProtectedRoute />}>
        <Route path="/course-player" element={<CoursePlayer />} />
      </Route>

      {/* --- Student-Only Routes --- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Route>

      {/* --- Instructor-Only Routes --- */}
      <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
      </Route>

      <Route path="*" element={<div>404 page not found</div>} />
    </Routes>
  );
};

export default AppRoutes;
