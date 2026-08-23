import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDoctors,
  getAdminAppointments,
} from "../api";

function AdminAppointments() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingAppointments, setLoadingAppointments] =
    useState(false);

  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // =========================
  // LOAD DOCTORS
  // =========================

  useEffect(() => {

    async function loadDoctors() {

      try {

        setLoading(true);
        setError("");

        const data = await getDoctors();

        setDoctors(data);

        if (data.length > 0) {
          setDoctorId(String(data[0].id));
        }

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }
    }

    loadDoctors();

  }, []);


  // =========================
  // LOAD APPOINTMENTS
  // =========================

  useEffect(() => {

    if (!doctorId || !date) {
      setAppointments([]);
      return;
    }

    async function loadAppointments() {

      try {

        setLoadingAppointments(true);
        setError("");

        const data =
          await getAdminAppointments(
            doctorId,
            date,
            token
          );

        setAppointments(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoadingAppointments(false);

      }
    }

    loadAppointments();

  }, [doctorId, date]);


  // =========================
  // LOGOUT
  // =========================

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }


  return (
    <div style={styles.page}>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav style={styles.nav}>

        <h2>HealthCare+ Admin</h2>

        <div>

          <button
            onClick={() => navigate("/admin")}
            style={styles.backButton}
          >
            ← Back to Admin
          </button>

          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        <h1>Manage Appointments</h1>

        <p style={styles.subtitle}>
          View appointments booked with doctors.
        </p>


        {/* =========================
            FILTERS
        ========================= */}

        <div style={styles.filterCard}>

          <div style={styles.field}>

            <label>Doctor</label>

            <select
              value={doctorId}
              onChange={(e) =>
                setDoctorId(e.target.value)
              }
              style={styles.input}
              disabled={loading}
            >

              <option value="">
                Select Doctor
              </option>

              {doctors.map((doctor) => (

                <option
                  key={doctor.id}
                  value={doctor.id}
                >
                  Dr. {doctor.name}
                </option>

              ))}

            </select>

          </div>


          <div style={styles.field}>

            <label>Date</label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={styles.input}
            />

          </div>

        </div>


        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* =========================
            APPOINTMENTS
        ========================= */}

        <div style={styles.card}>

          <div style={styles.cardHeader}>

            <div>

              <h2>Appointments</h2>

              <p style={styles.muted}>
                {date}
              </p>

            </div>

            <div style={styles.count}>
              {appointments.length}
            </div>

          </div>


          {loadingAppointments ? (

            <p style={styles.muted}>
              Loading appointments...
            </p>

          ) : appointments.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                📅
              </div>

              <h3>No appointments</h3>

              <p>
                There are no appointments for this
                doctor on the selected date.
              </p>

            </div>

          ) : (

            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>

                  <tr>

                    <th style={styles.th}>
                      Time
                    </th>

                    <th style={styles.th}>
                      Patient
                    </th>

                    <th style={styles.th}>
                      Status
                    </th>

                    <th style={styles.th}>
                      Notes
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {appointments.map(
                    (appointment) => (

                      <tr
                        key={appointment.id}
                        style={styles.row}
                      >

                        <td style={styles.td}>
                          <strong>
                            {formatTime(
                              appointment.appointmentTime
                            )}
                          </strong>
                        </td>

                        <td style={styles.td}>

                          <div style={styles.patientName}>
                            {appointment.patientName}
                          </div>

                          <div style={styles.patientId}>
                            Patient ID:{" "}
                            {appointment.patientId}
                          </div>

                        </td>

                        <td style={styles.td}>

                          <span
                            style={
                              appointment.status ===
                              "BOOKED"
                                ? styles.booked
                                : styles.cancelled
                            }
                          >
                            {appointment.status}
                          </span>

                        </td>

                        <td style={styles.td}>

                          {appointment.notes
                            ? appointment.notes
                            : "—"}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}


// =========================
// HELPER
// =========================

function formatTime(time) {

  if (!time) {
    return "";
  }

  return time.substring(0, 5);
}


// =========================
// STYLES
// =========================

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
    maxWidth: "1150px",
    margin: "0 auto",
    padding: "50px 30px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
    marginBottom: "30px",
  },

  filterCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    marginTop: "7px",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    background: "white",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  count: {
    minWidth: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "17px",
  },

  muted: {
    color: "#64748b",
  },

  tableWrapper: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px",
    borderBottom: "2px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
  },

  td: {
    padding: "17px 14px",
    borderBottom: "1px solid #e2e8f0",
    color: "#334155",
  },

  row: {
    background: "white",
  },

  patientName: {
    fontWeight: "600",
  },

  patientId: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
  },

  booked: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#dcfce7",
    color: "#166534",
    fontSize: "13px",
    fontWeight: "bold",
  },

  cancelled: {
    display: "inline-block",
    padding: "5px 10px",
    borderRadius: "20px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: "bold",
  },

  empty: {
    textAlign: "center",
    padding: "50px 20px",
    color: "#64748b",
  },

  emptyIcon: {
    fontSize: "45px",
    marginBottom: "10px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },
};

export default AdminAppointments;