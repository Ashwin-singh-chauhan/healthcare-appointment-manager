import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div style={styles.page}>

      <nav style={styles.nav}>

        <h2>HealthCare+ Admin</h2>

        <div>

          <span style={styles.welcome}>
            Hello, {user?.name || "Admin"}
          </span>

          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main style={styles.container}>

        <h1>Admin Dashboard</h1>

        <p style={styles.subtitle}>
          Manage doctors, availability, leaves and appointments.
        </p>

        <div style={styles.grid}>

          {/* DOCTORS */}

          <div style={styles.card}>

            <div style={styles.icon}>
              👨‍⚕️
            </div>

            <h2>Doctors</h2>

            <p>
              Add, edit and manage doctors.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/admin/doctors")
              }
            >
              Manage Doctors
            </button>

          </div>


          {/* AVAILABILITY */}

          <div style={styles.card}>

            <div style={styles.icon}>
              📅
            </div>

            <h2>Availability</h2>

            <p>
              Manage doctor working schedules.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/admin/availability")
              }
            >
              Manage Availability
            </button>

          </div>


          {/* LEAVES */}

          <div style={styles.card}>

            <div style={styles.icon}>
              🏖️
            </div>

            <h2>Doctor Leaves</h2>

            <p>
              Manage doctor leave dates.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/admin/leaves")
              }
            >
              Manage Leaves
            </button>

          </div>


          {/* APPOINTMENTS */}

          <div style={styles.card}>

            <div style={styles.icon}>
              📋
            </div>

            <h2>Appointments</h2>

            <p>
              View and manage appointments.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/admin/appointments")
              }
            >
              View Appointments
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  nav: {
    height: "70px",
    padding: "0 8%",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  welcome: {
    marginRight: "20px",
    color: "#475569",
  },

  logout: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "9px 16px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "50px 30px",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "35px",
    fontSize: "17px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  button: {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

};

export default AdminDashboard;