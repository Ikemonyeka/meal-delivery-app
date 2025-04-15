import React from "react";
import { Navigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const isAuthenticated = !!localStorage.getItem("user");

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}
