import React from "react";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {

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

      <header style={styles.header}>

        <h2>HealthCare+ Doctor</h2>

        <div style={styles.right}>

          <span>
            Hello, {user?.name || "Doctor"}
          </span>

          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </header>

      <main style={styles.main}>

        <h1>Doctor Dashboard</h1>

        <p style={styles.subtitle}>
          Manage your appointments and availability.
        </p>

        <div style={styles.grid}>

            {/* APPOINTMENTS */}

            <div style={styles.card}>

                <div style={styles.icon}>
                📅
                </div>

                <h2>Appointments</h2>

                <p>
                View your upcoming patient appointments.
                </p>

                <button
                style={styles.button}
                onClick={() =>
                    navigate("/doctor/appointments")
                }
                >
                View Appointments
                </button>

            </div>


            {/* AVAILABILITY */}

            <div style={styles.card}>

                <div style={styles.icon}>
                🕐
                </div>

                <h2>Availability</h2>

                <p>
                Manage your working schedule and available slots.
                </p>

                <button
                style={styles.button}
                onClick={() =>
                    navigate("/doctor/availability")
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

                <h2>Leaves</h2>

                <p>
                Manage your unavailable dates and leave schedule.
                </p>

                <button
                style={styles.button}
                onClick={() =>
                    navigate("/doctor/leaves")
                }
                >
                Manage Leaves
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

  header: {
    height: "70px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 70px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    color: "#475569",
  },

  logout: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  main: {
    padding: "70px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "18px",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "25px",
    maxWidth: "1000px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "14px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "15px",
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontSize: "15px",
    cursor: "pointer",
  },
};

export default DoctorDashboard;