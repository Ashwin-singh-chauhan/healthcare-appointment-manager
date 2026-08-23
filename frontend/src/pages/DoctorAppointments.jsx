import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

function DoctorAppointments() {

  const navigate = useNavigate();

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  async function loadAppointments() {

    if (!user) return;

    setLoading(true);
    setError("");

    try {

      /*
       * IMPORTANT:
       * The logged-in doctor ID comes from the JWT login response.
       */

      const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/api/appointments/doctor/my?date=${date}`,
            {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            }
        );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          `Request failed: ${response.status}`
        );
      }

      setAppointments(data);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => {
    loadAppointments();
  }, [date]);

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}

      <header style={styles.header}>

        <h2>HealthCare+ Doctor</h2>

        <div style={styles.headerRight}>

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


      {/* MAIN */}

      <main style={styles.main}>

        <button
          onClick={() => navigate("/doctor")}
          style={styles.backButton}
        >
          ← Back to Doctor Dashboard
        </button>

        <h1 style={styles.title}>
          My Appointments
        </h1>

        <p style={styles.subtitle}>
          View your appointments and patient details.
        </p>


        {/* DATE FILTER */}

        <div style={styles.filterCard}>

          <label style={styles.label}>
            Select Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            style={styles.dateInput}
          />

        </div>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* LOADING */}

        {loading && (
          <div style={styles.message}>
            Loading appointments...
          </div>
        )}


        {/* APPOINTMENTS */}

        {!loading && !error && (
          <div style={styles.card}>

            <h2>
              Appointments for{" "}
              {new Date(date).toLocaleDateString()}
            </h2>

            {appointments.length === 0 ? (

              <div style={styles.empty}>

                <div style={styles.emptyIcon}>
                  📅
                </div>

                <h3>
                  No appointments
                </h3>

                <p>
                  You don't have any appointments
                  scheduled for this date.
                </p>

              </div>

            ) : (

              <div style={styles.list}>

                {appointments.map(
                  (appointment) => (

                    <div
                      key={appointment.id}
                      style={styles.appointment}
                    >

                      <div style={styles.time}>

                        {appointment.appointmentTime
                          ? appointment.appointmentTime
                              .slice(0, 5)
                          : "--:--"}

                      </div>


                      <div style={styles.details}>

                        <h3>
                          {appointment.patientName}
                        </h3>

                        <p>
                          Patient ID:{" "}
                          {appointment.patientId}
                        </p>

                        {appointment.notes && (
                          <p>
                            <strong>
                              Notes:
                            </strong>{" "}
                            {appointment.notes}
                          </p>
                        )}

                      </div>


                      <div>

                        <span
                          style={{
                            ...styles.status,
                            ...(appointment.status ===
                            "BOOKED"
                              ? styles.booked
                              : styles.cancelled),
                          }}
                        >
                          {appointment.status}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

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

  header: {
    height: "70px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 70px",
  },

  headerRight: {
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
    padding: "50px 70px",
  },

  backButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "30px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "18px",
    marginBottom: "35px",
  },

  filterCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "10px",
  },

  dateInput: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.06)",
  },

  list: {
    marginTop: "25px",
  },

  appointment: {
    display: "grid",
    gridTemplateColumns:
      "100px 1fr 120px",
    alignItems: "center",
    gap: "20px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    marginBottom: "15px",
  },

  time: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
  },

  details: {
    borderLeft: "1px solid #e2e8f0",
    paddingLeft: "20px",
  },

  status: {
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  booked: {
    background: "#dcfce7",
    color: "#166534",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "50px",
    marginBottom: "15px",
  },

  message: {
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    textAlign: "center",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
};

export default DoctorAppointments;