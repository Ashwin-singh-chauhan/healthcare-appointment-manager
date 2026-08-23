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

        <div style={styles.brandSection}>

          <div style={styles.brandIcon}>
            +
          </div>

          <div>
            <h2 style={styles.brand}>
              HealthCare<span>+</span>
            </h2>

            <div style={styles.adminLabel}>
              ADMIN PORTAL
            </div>
          </div>

        </div>


        <div style={styles.navActions}>

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

        {/* PAGE HEADER */}

        <div style={styles.pageHeader}>

          <div>

            <div style={styles.eyebrow}>
              ADMINISTRATION
            </div>

            <h1 style={styles.title}>
              Manage Appointments
            </h1>

            <p style={styles.subtitle}>
              Monitor and manage appointments across your healthcare team.
            </p>

          </div>

          <div style={styles.headerIcon}>
            📅
          </div>

        </div>


        {/* =========================
            FILTERS
        ========================= */}

        <section style={styles.filterCard}>

          <div style={styles.filterHeader}>

            <div style={styles.filterIcon}>
              ⚙
            </div>

            <div>

              <h2 style={styles.filterTitle}>
                Appointment Filters
              </h2>

              <p style={styles.filterSubtitle}>
                Select a doctor and date to view appointments.
              </p>

            </div>

          </div>


          <div style={styles.filterFields}>

            {/* DOCTOR */}

            <div style={styles.field}>

              <label style={styles.label}>
                Doctor
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  👨‍⚕️
                </span>

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

            </div>


            {/* DATE */}

            <div style={styles.field}>

              <label style={styles.label}>
                Appointment Date
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  📅
                </span>

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

          </div>

        </section>


        {/* =========================
            ERROR
        ========================= */}

        {error && (

          <div style={styles.error}>

            <div style={styles.errorIcon}>
              !
            </div>

            <div>

              <strong>
                Something went wrong
              </strong>

              <div style={styles.errorText}>
                {error}
              </div>

            </div>

          </div>

        )}


        {/* =========================
            APPOINTMENTS
        ========================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>

              <div style={styles.sectionLabel}>
                APPOINTMENT SCHEDULE
              </div>

              <h2 style={styles.cardTitle}>
                Appointments
              </h2>

              <p style={styles.muted}>
                {formatDate(date)}
              </p>

            </div>


            <div style={styles.countBox}>

              <span style={styles.countNumber}>
                {appointments.length}
              </span>

              <span style={styles.countLabel}>
                {appointments.length === 1
                  ? "Appointment"
                  : "Appointments"}
              </span>

            </div>

          </div>


          {/* LOADING */}

          {loadingAppointments ? (

            <div style={styles.loadingState}>

              <div style={styles.spinner}></div>

              <h3 style={styles.loadingTitle}>
                Loading appointments
              </h3>

              <p style={styles.muted}>
                Fetching the latest appointment data...
              </p>

            </div>


          ) : appointments.length === 0 ? (

            /* EMPTY */

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                📅
              </div>

              <h3 style={styles.emptyTitle}>
                No appointments
              </h3>

              <p style={styles.emptyText}>
                There are no appointments for this
                doctor on the selected date.
              </p>

            </div>


          ) : (

            /* TABLE */

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

                        {/* TIME */}

                        <td style={styles.td}>

                          <div style={styles.timeCell}>

                            <div style={styles.timeIcon}>
                              🕐
                            </div>

                            <strong style={styles.time}>
                              {formatTime(
                                appointment.appointmentTime
                              )}
                            </strong>

                          </div>

                        </td>


                        {/* PATIENT */}

                        <td style={styles.td}>

                          <div style={styles.patientCell}>

                            <div style={styles.avatar}>
                              {appointment.patientName
                                ?.charAt(0)
                                ?.toUpperCase() || "P"}
                            </div>

                            <div>

                              <div style={styles.patientName}>
                                {appointment.patientName}
                              </div>

                              <div style={styles.patientId}>
                                Patient ID:{" "}
                                {appointment.patientId}
                              </div>

                            </div>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td style={styles.td}>

                          <span
                            style={
                              appointment.status ===
                              "BOOKED"
                                ? styles.booked
                                : styles.cancelled
                            }
                          >

                            <span style={styles.statusDot}>
                              ●
                            </span>

                            {appointment.status}

                          </span>

                        </td>


                        {/* NOTES */}

                        <td style={styles.td}>

                          <div style={styles.notes}>

                            {appointment.notes
                              ? appointment.notes
                              : "No notes"}

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


// =========================
// HELPERS
// =========================

function formatTime(time) {

  if (!time) {
    return "";
  }

  return time.substring(0, 5);
}


function formatDate(date) {

  if (!date) {
    return "";
  }

  const parsed = new Date(
    `${date}T00:00:00`
  );

  return parsed.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}


// =========================
// STYLES
// =========================

const styles = {

  // ==========================================
  // PAGE
  // ==========================================

  page: {
    minHeight: "100vh",
    background: "#DCEFF0",
    color: "#12313B",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  // ==========================================
  // NAVBAR
  // ==========================================

  nav: {
    minHeight: "76px",
    padding: "0 6%",
    background: "#123B4A",
    borderBottom: "1px solid #0E5363",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
    boxShadow: "0 4px 18px rgba(18, 59, 74, 0.18)",
  },

  brandSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  brandIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#12A8A8",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
    fontWeight: "800",
    boxShadow: "0 5px 15px rgba(18, 168, 168, 0.35)",
  },

  brand: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "750",
    color: "#F4FFFF",
    letterSpacing: "-0.5px",
  },

  adminLabel: {
    marginTop: "2px",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    color: "#8FD5D7",
  },

  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  backButton: {
    border: "1px solid #387080",
    background: "#1A4B5B",
    color: "#E8FAFA",
    padding: "10px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "650",
  },

  logout: {
    border: "none",
    background: "#D65A5A",
    color: "#FFFFFF",
    padding: "10px 18px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "650",
    boxShadow: "0 4px 10px rgba(214, 90, 90, 0.25)",
  },


  // ==========================================
  // MAIN
  // ==========================================

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "48px 30px 70px",
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "34px",
  },

  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    color: "#087F8C",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: "1.15",
    fontWeight: "750",
    letterSpacing: "-1px",
    color: "#123B4A",
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#45636B",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  headerIcon: {
    width: "68px",
    height: "68px",
    borderRadius: "18px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
    border: "1px solid #91C8CA",
    boxShadow: "0 5px 15px rgba(18, 59, 74, 0.08)",
  },


  // ==========================================
  // FILTER CARD
  // ==========================================

  filterCard: {
    background: "#C9E4E5",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #9CCBCD",
    boxShadow: "0 8px 25px rgba(18, 59, 74, 0.10)",
    marginBottom: "25px",
  },

  filterHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "24px",
  },

  filterIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    boxShadow: "0 5px 12px rgba(8, 127, 140, 0.25)",
  },

  filterTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "18px",
    fontWeight: "750",
  },

  filterSubtitle: {
    margin: "4px 0 0",
    color: "#45636B",
    fontSize: "13px",
  },

  filterFields: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    color: "#244C58",
    fontSize: "13px",
    fontWeight: "750",
    marginBottom: "8px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #8DBFC2",
    borderRadius: "10px",
    background: "#EAF7F6",
    overflow: "hidden",
    boxShadow: "inset 0 1px 2px rgba(18, 59, 74, 0.04)",
  },

  inputIcon: {
    paddingLeft: "13px",
    fontSize: "16px",
  },

  input: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: "13px 13px 13px 9px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#123B4A",
    background: "transparent",
  },


  // ==========================================
  // ERROR
  // ==========================================

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#F7DCDC",
    color: "#8E3838",
    padding: "15px 17px",
    borderRadius: "12px",
    border: "1px solid #E6B5B5",
    marginBottom: "25px",
  },

  errorIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#C94C4C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  errorText: {
    marginTop: "3px",
    fontSize: "13px",
  },


  // ==========================================
  // APPOINTMENTS CARD
  // ==========================================

  card: {
    background: "#EAF7F6",
    padding: "30px",
    borderRadius: "18px",
    border: "1px solid #A8D2D4",
    boxShadow: "0 8px 25px rgba(18, 59, 74, 0.10)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    paddingBottom: "20px",
    borderBottom: "1px solid #BBDCDD",
  },

  sectionLabel: {
    fontSize: "10px",
    letterSpacing: "1.5px",
    fontWeight: "800",
    color: "#087F8C",
    marginBottom: "5px",
  },

  cardTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "23px",
    fontWeight: "750",
  },

  muted: {
    color: "#557078",
    fontSize: "13px",
    margin: "5px 0 0",
  },

  countBox: {
    minWidth: "85px",
    padding: "11px 15px",
    borderRadius: "13px",
    background: "#087F8C",
    border: "1px solid #08737E",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 5px 13px rgba(8, 127, 140, 0.22)",
  },

  countNumber: {
    color: "#FFFFFF",
    fontSize: "22px",
    fontWeight: "800",
    lineHeight: "1",
  },

  countLabel: {
    marginTop: "4px",
    color: "#CDEFF0",
    fontSize: "9px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },


  // ==========================================
  // TABLE
  // ==========================================

  tableWrapper: {
    overflowX: "auto",
    border: "1px solid #A8D2D4",
    borderRadius: "13px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
  },

  th: {
    textAlign: "left",
    padding: "14px 17px",
    background: "#C9E4E5",
    borderBottom: "1px solid #A8D2D4",
    color: "#244C58",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.7px",
  },

  td: {
    padding: "17px",
    borderBottom: "1px solid #C5DFE0",
    color: "#294B55",
    fontSize: "14px",
    background: "#EAF7F6",
  },

  row: {
    transition: "background 0.2s ease",
  },

  timeCell: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  timeIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },

  time: {
    color: "#123B4A",
    fontSize: "14px",
  },

  patientCell: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
    flexShrink: 0,
  },

  patientName: {
    fontWeight: "750",
    color: "#123B4A",
  },

  patientId: {
    fontSize: "11px",
    color: "#678087",
    marginTop: "3px",
  },

  booked: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#CBEBDD",
    color: "#126442",
    border: "1px solid #9DD3B7",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  cancelled: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 11px",
    borderRadius: "20px",
    background: "#F7DCDC",
    color: "#963D3D",
    border: "1px solid #E5B6B6",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "0.3px",
  },

  statusDot: {
    fontSize: "8px",
  },

  notes: {
    color: "#557078",
    maxWidth: "280px",
    lineHeight: "1.5",
  },


  // ==========================================
  // EMPTY
  // ==========================================

  empty: {
    textAlign: "center",
    padding: "65px 20px",
    color: "#557078",
  },

  emptyIcon: {
    width: "72px",
    height: "72px",
    margin: "0 auto 16px",
    borderRadius: "20px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    color: "#123B4A",
    fontSize: "18px",
  },

  emptyText: {
    margin: 0,
    color: "#60777E",
    fontSize: "14px",
  },


  // ==========================================
  // LOADING
  // ==========================================

  loadingState: {
    textAlign: "center",
    padding: "65px 20px",
  },

  spinner: {
    width: "34px",
    height: "34px",
    border: "4px solid #B8DCDD",
    borderTop: "4px solid #087F8C",
    borderRadius: "50%",
    margin: "0 auto 18px",
    animation: "spin 1s linear infinite",
  },

  loadingTitle: {
    margin: "0 0 5px",
    color: "#123B4A",
    fontSize: "17px",
  },

};
export default AdminAppointments;
