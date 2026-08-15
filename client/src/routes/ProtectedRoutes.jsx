import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Wait for AuthContext to finish checking /api/auth/me on refresh
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 font-medium">Checking authentication...</p>
      </div>
    );
  }

  // 2. If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If role restriction exists, ensure user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If student tries to visit instructor page, send to student dashboard (or vice-versa)
    return user.role === "instructor" ? (
      <Navigate to="/instructor-dashboard" replace />
    ) : (
      <Navigate to="/student-dashboard" replace />
    );
  }

  // 4. Authorized! Render child routes via Outlet
  return <Outlet />;
};

export default ProtectedRoute;
