import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";

import StudentDashboard from "../pages/student/StudentDashboard";
import InstructorDashboard from "../pages/instructor/InstructorDashboard";

// import CourseCatalog from "../pages/CourseCatalog";
// import CoursePlayer from "../pages/CoursePlayer";

import ProtectedRoute from "./ProtectedRoutes";

import CreateCourse from "../pages/instructor/CreateCourse";
import CourseDetails from "../pages/instructor/CourseDetails";
import EditCourse from "../pages/instructor/EditCourse";

import StudentCourseDetails from "../pages/student/StudentCourseDetails";
import MyEnrollments from "../pages/student/MyEnrollments";

import StudentLearning from "../pages/student/StudentLearning";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* --- Student-Only Routes --- */}
      <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student/course/:id" element={<StudentCourseDetails />} />
        <Route path="/student/learn/:id" element={<StudentLearning />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
      </Route>

      {/* --- Instructor-Only Routes --- */}
      <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
        <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/edit/:id" element={<EditCourse />} />
        <Route path="/instructor/course/:id" element={<CourseDetails />} />
      </Route>

      <Route path="*" element={<div>404 page not found</div>} />
    </Routes>
  );
};

export default AppRoutes;

{
  /* <Route path="/course-catalog" element={<CourseCatalog />} /> */
}
{
  /* --- Protected Routes (Log in required: Any authenticated user) --- */
}
{
  /* <Route element={<ProtectedRoute />}>
        <Route path="/course-player" element={<CoursePlayer />} />
      </Route> */
}
