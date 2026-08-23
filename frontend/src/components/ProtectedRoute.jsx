import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  adminOnly = false,
  doctorOnly = false,
  patientOnly = false,
}) {

  const token = localStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =========================
  // ADMIN ONLY
  // =========================

  if (
    adminOnly &&
    user.role !== "ADMIN"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // =========================
  // DOCTOR ONLY
  // =========================

  if (
    doctorOnly &&
    user.role !== "DOCTOR"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // =========================
  // PATIENT ONLY
  // =========================

  if (
    patientOnly &&
    user.role !== "PATIENT"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;