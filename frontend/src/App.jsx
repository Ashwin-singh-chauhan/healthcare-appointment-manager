import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import AdminDashboard from "./pages/AdminDashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminDoctors from "./pages/AdminDoctors";

import AdminAvailability from "./pages/AdminAvailability";
import AdminLeaves from "./pages/AdminLeaves";
import AdminAppointments from "./pages/AdminAppointments";
import MyAppointments from "./pages/MyAppointments";

import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorAvailability from "./pages/DoctorAvailability";
import DoctorLeaves from "./pages/DoctorLeaves";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            DEFAULT
        ========================= */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

        {/* =========================
            PUBLIC
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            PATIENT
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book/:doctorId"
          element={
            <ProtectedRoute patientOnly={true} >
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute patientOnly={true}>
              <MyAppointments />
            </ProtectedRoute>
          }
        />
        {/* =========================
            ADMIN
        ========================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/availability"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminLeaves />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminAppointments />
            </ProtectedRoute>
          }
        />
        {/* =========================
            UNKNOWN ROUTES
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />
        <Route
          path="/doctor"
          element={
            <ProtectedRoute doctorOnly={true}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute doctorOnly={true}>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/availability"
          element={
            <ProtectedRoute doctorOnly={true}>
              <DoctorAvailability />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/leaves"
          element={
            <ProtectedRoute doctorOnly={true}>
              <DoctorLeaves />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;