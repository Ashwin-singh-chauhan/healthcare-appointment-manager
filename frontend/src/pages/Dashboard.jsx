import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDoctors,
  getMyAppointments,
  cancelAppointment,
} from "../api";

function Dashboard() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [error, setError] = useState("");
  const [appointmentError, setAppointmentError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadDoctors();
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function loadAppointments() {
      try {
        setAppointmentsLoading(true);
        setAppointmentError("");

        const data = await getMyAppointments(token);

        setAppointments(data);
      } catch (err) {
        console.error(err);
        setAppointmentError(err.message);
      } finally {
        setAppointmentsLoading(false);
      }
    }

    loadAppointments();
  }, [token]);

  async function handleCancel(id) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelAppointment(id, token);

      // Refresh appointments after cancellation
      const data = await getMyAppointments(token);
      setAppointments(data);

    } catch (err) {
      console.error(err);
      setAppointmentError(err.message);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div style={styles.page}>

      {/* ================= NAVBAR ================= */}

      <nav style={styles.nav}>

        <h2>HealthCare+</h2>

        <div>

          <span style={styles.welcome}>
            Hello, {user?.name || "Patient"}
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

        {/* ================= MY APPOINTMENTS ================= */}

        <section style={styles.appointmentsSection}>

          <h1>My Appointments</h1>

          <p style={styles.subtitle}>
            View and manage your booked appointments.
          </p>

          {appointmentsLoading && (
            <p>Loading appointments...</p>
          )}

          {appointmentError && (
            <div style={styles.error}>
              {appointmentError}
            </div>
          )}

          {!appointmentsLoading &&
            !appointmentError &&
            appointments.length === 0 && (
              <div style={styles.empty}>
                <h3>No appointments yet</h3>

                <p>
                  Book an appointment with a doctor below.
                </p>
              </div>
            )}

          {!appointmentsLoading &&
            appointments.length > 0 && (

              <div style={styles.appointmentGrid}>

                {appointments.map((appointment) => (

                  <div
                    key={appointment.id}
                    style={styles.appointmentCard}
                  >

                    <div style={styles.appointmentTop}>

                      <div>

                        <h2>
                          {appointment.doctorName}
                        </h2>

                        <p style={styles.doctorId}>
                          Doctor ID: {appointment.doctorId}
                        </p>

                      </div>

                      <span
                        style={
                          appointment.status === "BOOKED"
                            ? styles.booked
                            : styles.cancelled
                        }
                      >
                        {appointment.status}
                      </span>

                    </div>

                    <div style={styles.appointmentDetails}>

                      <p>
                        📅{" "}
                        <strong>Date:</strong>{" "}
                        {appointment.appointmentDate}
                      </p>

                      <p>
                        🕐{" "}
                        <strong>Time:</strong>{" "}
                        {appointment.appointmentTime}
                      </p>

                      {appointment.notes && (
                        <p>
                          📝{" "}
                          <strong>Notes:</strong>{" "}
                          {appointment.notes}
                        </p>
                      )}

                    </div>

                    {appointment.status === "BOOKED" && (
                      <button
                        style={styles.cancelButton}
                        onClick={() =>
                          handleCancel(appointment.id)
                        }
                      >
                        Cancel Appointment
                      </button>
                    )}

                  </div>

                ))}

              </div>

            )}

        </section>


        {/* ================= FIND A DOCTOR ================= */}

        <section style={styles.doctorsSection}>

          <h1>Find a Doctor</h1>

          <p style={styles.subtitle}>
            Choose a doctor to view available
            appointment slots.
          </p>

          {loading && (
            <p>Loading doctors...</p>
          )}

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <div style={styles.grid}>

            {doctors.map((doctor) => (

              <div
                key={doctor.id}
                style={styles.card}
              >

                <div style={styles.avatar}>
                  {doctor.name?.charAt(0)}
                </div>

                <h2>
                  {doctor.name}
                </h2>

                <p style={styles.specialization}>
                  {doctor.specialization}
                </p>

                <p>
                  📧 {doctor.email}
                </p>

                <p>
                  📞 {doctor.phone}
                </p>

                <button
                  style={styles.bookButton}
                  onClick={() =>
                    navigate(`/book/${doctor.id}`)
                  }
                >
                  View Availability
                </button>

              </div>

            ))}

          </div>

        </section>

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

  appointmentsSection: {
    marginBottom: "60px",
  },

  doctorsSection: {
    marginTop: "20px",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "30px",
  },

  appointmentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
  },

  appointmentCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    borderLeft: "5px solid #2563eb",
  },

  appointmentTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  doctorId: {
    color: "#64748b",
    fontSize: "13px",
  },

  appointmentDetails: {
    marginTop: "20px",
    color: "#334155",
    lineHeight: "1.5",
  },

  booked: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  cancelButton: {
    width: "100%",
    marginTop: "15px",
    padding: "11px",
    border: "none",
    borderRadius: "7px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  empty: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.05)",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  specialization: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  bookButton: {
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

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },
};

export default Dashboard;