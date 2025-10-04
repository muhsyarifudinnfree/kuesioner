// src/components/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default ProtectedRoute;
