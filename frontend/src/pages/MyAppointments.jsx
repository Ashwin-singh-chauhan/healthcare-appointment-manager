import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyAppointments,
  cancelAppointment,
} from "../api";

function MyAppointments() {

  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {

    try {

      setLoading(true);
      setError("");

      const data = await getMyAppointments(token);

      setAppointments(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  async function handleCancel(id) {

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setCancelling(id);
      setError("");
      setSuccess("");

      await cancelAppointment(id, token);

      setSuccess(
        "Appointment cancelled successfully."
      );

      await loadAppointments();

    } catch (err) {

      setError(err.message);

    } finally {

      setCancelling(null);

    }
  }

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  function formatDate(date) {

    if (!date) {
      return "";
    }

    const d = new Date(date + "T00:00:00");

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatTime(time) {

    if (!time) {
      return "";
    }

    const [hours, minutes] =
      time.split(":").map(Number);

    const d = new Date();

    d.setHours(hours, minutes, 0, 0);

    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.nav}>

        <h2>HealthCare+</h2>

        <div>

          <button
            onClick={() => navigate("/dashboard")}
            style={styles.backButton}
          >
            ← Dashboard
          </button>

          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </nav>


      <main style={styles.container}>

        <h1>My Appointments</h1>

        <p style={styles.subtitle}>
          View and manage your upcoming and past appointments.
        </p>


        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}


        {loading ? (

          <div style={styles.message}>
            Loading appointments...
          </div>

        ) : appointments.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📅
            </div>

            <h2>No appointments yet</h2>

            <p>
              You haven't booked any appointments.
            </p>

            <button
              onClick={() => navigate("/dashboard")}
              style={styles.primaryButton}
            >
              Find a Doctor
            </button>

          </div>

        ) : (

          <div style={styles.list}>

            {appointments.map((appointment) => {

              const isCancelled =
                appointment.status === "CANCELLED";

              return (
                <div
                  key={appointment.id}
                  style={styles.card}
                >

                  <div style={styles.cardTop}>

                    <div>

                      <h2 style={styles.doctorName}>
                        Dr. {appointment.doctorName}
                      </h2>

                      <p style={styles.doctorId}>
                        Doctor ID: {appointment.doctorId}
                      </p>

                    </div>

                    <span
                      style={
                        isCancelled
                          ? styles.cancelled
                          : styles.booked
                      }
                    >
                      {appointment.status}
                    </span>

                  </div>


                  <div style={styles.details}>

                    <div style={styles.detail}>

                      <span style={styles.icon}>
                        📅
                      </span>

                      <div>
                        <small>Date</small>
                        <strong>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>
                      </div>

                    </div>


                    <div style={styles.detail}>

                      <span style={styles.icon}>
                        🕘
                      </span>

                      <div>
                        <small>Time</small>
                        <strong>
                          {formatTime(
                            appointment.appointmentTime
                          )}
                        </strong>
                      </div>

                    </div>


                    <div style={styles.detail}>

                      <span style={styles.icon}>
                        👤
                      </span>

                      <div>
                        <small>Patient</small>
                        <strong>
                          {appointment.patientName}
                        </strong>
                      </div>

                    </div>

                  </div>


                  {appointment.notes && (

                    <div style={styles.notes}>

                      <strong>Notes:</strong>{" "}
                      {appointment.notes}

                    </div>

                  )}


                  {!isCancelled && (

                    <div style={styles.actions}>

                      <button
                        onClick={() =>
                          handleCancel(
                            appointment.id
                          )
                        }
                        disabled={
                          cancelling ===
                          appointment.id
                        }
                        style={styles.cancelButton}
                      >
                        {cancelling ===
                        appointment.id
                          ? "Cancelling..."
                          : "Cancel Appointment"}
                      </button>

                    </div>

                  )}

                </div>
              );
            })}

          </div>

        )}

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

  backButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    marginRight: "10px",
  },

  logout: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "50px 30px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
    marginBottom: "30px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "18px",
  },

  doctorName: {
    margin: 0,
    color: "#1e293b",
  },

  doctorId: {
    margin: "6px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },

  booked: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
  },

  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "20px",
    padding: "22px 0",
  },

  detail: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  icon: {
    fontSize: "25px",
  },

  detailText: {
    display: "flex",
    flexDirection: "column",
  },

  detailSmall: {
    color: "#94a3b8",
  },

  notes: {
    background: "#f8fafc",
    padding: "14px",
    borderRadius: "7px",
    color: "#475569",
    marginBottom: "20px",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
  },

  cancelButton: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  empty: {
    background: "white",
    textAlign: "center",
    padding: "60px 30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
  },

  emptyIcon: {
    fontSize: "50px",
  },

  primaryButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "12px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    marginTop: "15px",
  },

  message: {
    background: "white",
    padding: "40px",
    textAlign: "center",
    borderRadius: "12px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },
};

export default MyAppointments;