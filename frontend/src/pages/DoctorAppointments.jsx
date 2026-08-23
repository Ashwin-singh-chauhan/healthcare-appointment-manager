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


  /* =========================
     LOAD APPOINTMENTS
  ========================= */

  async function loadAppointments() {

    if (!user) return;

    setLoading(true);
    setError("");

    try {

      const token =
        localStorage.getItem("token");

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


  /* =========================
     LOGOUT
  ========================= */

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }


  const bookedCount =
    appointments.filter(
      (appointment) =>
        appointment.status === "BOOKED"
    ).length;


  return (

    <div style={styles.page}>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <header style={styles.header}>

        <div style={styles.brandArea}>

          <div style={styles.logo}>
            +
          </div>

          <div>

            <div style={styles.brand}>
              HealthCare
              <span style={styles.brandAccent}>
                +
              </span>
            </div>

            <div style={styles.brandSub}>
              DOCTOR PORTAL
            </div>

          </div>

        </div>


        <div style={styles.headerRight}>

          <div style={styles.secureBadge}>

            <span style={styles.greenDot}></span>

            Secure Portal

          </div>


          <div style={styles.userInfo}>

            <div style={styles.avatar}>

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "D"}

            </div>

            <div>

              <div style={styles.userName}>
                {user?.name || "Doctor"}
              </div>

              <div style={styles.userRole}>
                DOCTOR
              </div>

            </div>

          </div>


          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main style={styles.main}>


        {/* BACK */}

        <button
          onClick={() =>
            navigate("/doctor")
          }
          style={styles.backButton}
        >
          ← Back to Doctor Dashboard
        </button>


        {/* PAGE HEADER */}

        <section style={styles.pageHeader}>

          <div>

            <div style={styles.eyebrow}>
              DOCTOR SCHEDULE
            </div>

            <h1 style={styles.title}>
              My Appointments
            </h1>

            <p style={styles.subtitle}>
              View your consultations and patient
              details for the selected date.
            </p>

          </div>


          <div style={styles.headerStat}>

            <div style={styles.headerStatIcon}>
              📋
            </div>

            <div>

              <div style={styles.headerStatNumber}>
                {bookedCount}
              </div>

              <div style={styles.headerStatLabel}>
                Active appointments
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            DATE FILTER
        ===================================================== */}

        <div style={styles.filterCard}>

          <div style={styles.filterLeft}>

            <div style={styles.calendarIcon}>
              📅
            </div>

            <div>

              <div style={styles.filterEyebrow}>
                SCHEDULE DATE
              </div>

              <label style={styles.label}>
                Select appointment date
              </label>

            </div>

          </div>


          <div style={styles.dateWrapper}>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={styles.dateInput}
            />

          </div>

        </div>


        {/* ERROR */}

        {error && (

          <div style={styles.error}>

            <div style={styles.errorIcon}>
              !
            </div>

            <div>

              <strong>
                Unable to load appointments
              </strong>

              <div style={styles.alertText}>
                {error}
              </div>

            </div>

          </div>

        )}


        {/* LOADING */}

        {loading && (

          <div style={styles.loadingCard}>

            <div style={styles.loadingIcon}>
              ⟳
            </div>

            <h3 style={styles.loadingTitle}>
              Loading appointments
            </h3>

            <p style={styles.loadingText}>
              Checking your schedule...
            </p>

          </div>

        )}


        {/* =====================================================
            APPOINTMENTS
        ===================================================== */}

        {!loading &&
          !error && (

            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div>

                  <div style={styles.cardEyebrow}>
                    DAILY SCHEDULE
                  </div>

                  <h2 style={styles.cardTitle}>
                    Appointments for{" "}
                    {new Date(
                      date + "T00:00:00"
                    ).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </h2>

                </div>


                <div style={styles.countBadge}>
                  {appointments.length} total
                </div>

              </div>


              {appointments.length === 0 ? (

                <div style={styles.empty}>

                  <div style={styles.emptyIcon}>
                    🗓️
                  </div>

                  <h3 style={styles.emptyTitle}>
                    No appointments
                  </h3>

                  <p style={styles.emptyText}>
                    You don't have any appointments
                    scheduled for this date.
                  </p>

                  <button
                    onClick={() =>
                      navigate("/doctor/availability")
                    }
                    style={styles.emptyButton}
                  >
                    Manage Availability →
                  </button>

                </div>

              ) : (

                <div style={styles.list}>

                  {appointments.map(
                    (appointment) => {

                      const isBooked =
                        appointment.status ===
                        "BOOKED";

                      return (

                        <div
                          key={appointment.id}
                          style={{
                            ...styles.appointment,
                            borderLeft:
                              isBooked
                                ? "4px solid #087F8C"
                                : "4px solid #94A8AC",
                          }}
                        >

                          {/* TIME */}

                          <div style={styles.timeBlock}>

                            <div style={styles.timeIcon}>
                              🕐
                            </div>

                            <div>

                              <div style={styles.time}>
                                {appointment
                                  .appointmentTime
                                  ? appointment
                                      .appointmentTime
                                      .slice(0, 5)
                                  : "--:--"}
                              </div>

                              <div style={styles.timeLabel}>
                                Appointment
                              </div>

                            </div>

                          </div>


                          {/* PATIENT */}

                          <div style={styles.details}>

                            <div style={styles.patientHeader}>

                              <div
                                style={
                                  styles.patientAvatar
                                }
                              >

                                {appointment
                                  .patientName
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "P"}

                              </div>

                              <div>

                                <h3
                                  style={
                                    styles.patientName
                                  }
                                >
                                  {appointment.patientName}
                                </h3>

                                <span
                                  style={
                                    styles.patientId
                                  }
                                >
                                  Patient ID #
                                  {
                                    appointment.patientId
                                  }
                                </span>

                              </div>

                            </div>


                            {appointment.notes && (

                              <div style={styles.notes}>

                                <span>
                                  📝
                                </span>

                                <div>

                                  <span
                                    style={
                                      styles.infoLabel
                                    }
                                  >
                                    NOTES
                                  </span>

                                  <div>
                                    {appointment.notes}
                                  </div>

                                </div>

                              </div>

                            )}

                          </div>


                          {/* STATUS */}

                          <div style={styles.statusBlock}>

                            <span
                              style={{
                                ...styles.status,
                                ...(isBooked
                                  ? styles.booked
                                  : styles.cancelled),
                              }}
                            >

                              <span>
                                {isBooked
                                  ? "●"
                                  : "●"}
                              </span>

                              {appointment.status}

                            </span>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              )}

            </section>

          )}

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer style={styles.footer}>

        <div style={styles.footerBrand}>

          <div style={styles.footerLogo}>
            +
          </div>

          <div>

            <strong>
              HealthCare
              <span style={styles.brandAccent}>
                +
              </span>
            </strong>

            <div style={styles.footerText}>
              Doctor management portal
            </div>

          </div>

        </div>


        <div style={styles.footerRight}>
          🔒 Secure & Private
        </div>

      </footer>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    background: "#DCEFF0",
    color: "#12313B",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  /* =========================
     HEADER
  ========================= */

  header: {
    minHeight: "76px",
    padding: "0 6%",
    background: "#123B4A",
    borderBottom: "1px solid #0E5363",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 4px 18px rgba(18,59,74,0.18)",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  logo: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#12A8A8",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    boxShadow:
      "0 5px 15px rgba(18,168,168,0.35)",
  },

  brand: {
    color: "#F4FFFF",
    fontSize: "21px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "#62D3D1",
  },

  brandSub: {
    color: "#8FD5D7",
    fontSize: "8px",
    marginTop: "2px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 11px",
    borderRadius: "20px",
    background: "#1A4B5B",
    border: "1px solid #387080",
    color: "#BDEBED",
    fontSize: "9px",
    fontWeight: "800",
  },

  greenDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#55D69A",
    boxShadow:
      "0 0 8px rgba(85,214,154,0.8)",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  userName: {
    color: "#F4FFFF",
    fontSize: "13px",
    fontWeight: "700",
  },

  userRole: {
    color: "#8FD5D7",
    fontSize: "8px",
    marginTop: "2px",
    letterSpacing: "1px",
    fontWeight: "800",
  },

  logout: {
    padding: "9px 15px",
    border: "1px solid #A85B64",
    borderRadius: "9px",
    background: "#5A3540",
    color: "#FFDDE0",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "700",
  },


  /* =========================
     MAIN
  ========================= */

  main: {
    width: "min(1120px, 92%)",
    margin: "0 auto",
    padding: "38px 0 65px",
  },

  backButton: {
    padding: "10px 15px",
    border: "1px solid #8DBFC2",
    borderRadius: "9px",
    background: "#C9E4E5",
    color: "#244C58",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "750",
    marginBottom: "25px",
  },


  /* =========================
     PAGE HEADER
  ========================= */

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "25px",
  },

  eyebrow: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    marginBottom: "7px",
  },

  title: {
    margin: 0,
    color: "#123B4A",
    fontSize: "35px",
    fontWeight: "750",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    color: "#60777E",
    fontSize: "14px",
    marginTop: "8px",
    lineHeight: "1.5",
  },

  headerStat: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    padding: "13px 16px",
    borderRadius: "13px",
  },

  headerStatIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  headerStatNumber: {
    color: "#123B4A",
    fontSize: "20px",
    fontWeight: "800",
  },

  headerStatLabel: {
    color: "#60777E",
    fontSize: "9px",
    marginTop: "2px",
  },


  /* =========================
     FILTER
  ========================= */

  filterCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "15px",
    padding: "19px 22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "20px",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.06)",
  },

  filterLeft: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  calendarIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "11px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  filterEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.2px",
  },

  label: {
    display: "block",
    color: "#244C58",
    fontWeight: "750",
    fontSize: "12px",
    marginTop: "3px",
  },

  dateWrapper: {
    background: "#C9E4E5",
    border: "1px solid #8DBFC2",
    borderRadius: "9px",
    overflow: "hidden",
  },

  dateInput: {
    padding: "11px 13px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "13px",
    cursor: "pointer",
  },


  /* =========================
     ERROR
  ========================= */

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "12px",
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
    fontWeight: "900",
    flexShrink: 0,
  },

  alertText: {
    marginTop: "3px",
    fontSize: "11px",
  },


  /* =========================
     LOADING
  ========================= */

  loadingCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "15px",
    padding: "50px 20px",
    textAlign: "center",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.05)",
  },

  loadingIcon: {
    color: "#087F8C",
    fontSize: "30px",
    marginBottom: "8px",
  },

  loadingTitle: {
    color: "#123B4A",
    margin: 0,
    fontSize: "16px",
  },

  loadingText: {
    color: "#60777E",
    fontSize: "11px",
    marginTop: "5px",
  },


  /* =========================
     CARD
  ========================= */

  card: {
    background: "#EAF7F6",
    padding: "26px",
    borderRadius: "17px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 8px 25px rgba(18,59,74,0.07)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "15px",
    paddingBottom: "19px",
    borderBottom: "1px solid #C2DDDE",
  },

  cardEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  cardTitle: {
    color: "#123B4A",
    fontSize: "19px",
    margin: "4px 0 0",
    fontWeight: "750",
  },

  countBadge: {
    background: "#C9E4E5",
    color: "#087F8C",
    border: "1px solid #A8D2D4",
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: "800",
  },


  /* =========================
     APPOINTMENT LIST
  ========================= */

  list: {
    marginTop: "19px",
  },

  appointment: {
    display: "grid",
    gridTemplateColumns:
      "145px 1fr 110px",
    alignItems: "center",
    gap: "20px",
    padding: "18px",
    background: "#D8EBEC",
    borderTop: "1px solid #A8D2D4",
    borderRight: "1px solid #A8D2D4",
    borderBottom: "1px solid #A8D2D4",
    borderRadius: "11px",
    marginBottom: "11px",
  },

  timeBlock: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  timeIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  time: {
    color: "#087F8C",
    fontSize: "20px",
    fontWeight: "800",
  },

  timeLabel: {
    color: "#789096",
    fontSize: "8px",
    marginTop: "2px",
    fontWeight: "700",
  },

  details: {
    borderLeft: "1px solid #A8C9CB",
    paddingLeft: "20px",
  },

  patientHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  patientAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "11px",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  patientName: {
    color: "#123B4A",
    margin: 0,
    fontSize: "15px",
    fontWeight: "750",
  },

  patientId: {
    color: "#71888E",
    fontSize: "9px",
  },

  notes: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    padding: "9px 11px",
    background: "#C9E4E5",
    borderRadius: "8px",
    color: "#45616A",
    fontSize: "10px",
  },

  infoLabel: {
    display: "block",
    color: "#789096",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "0.7px",
    marginBottom: "2px",
  },

  statusBlock: {
    display: "flex",
    justifyContent: "flex-end",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 10px",
    borderRadius: "999px",
    fontSize: "8px",
    fontWeight: "800",
  },

  booked: {
    background: "#CBEBDD",
    color: "#126442",
    border: "1px solid #9DD3B7",
  },

  cancelled: {
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
  },


  /* =========================
     EMPTY
  ========================= */

  empty: {
    textAlign: "center",
    padding: "55px 20px 35px",
    color: "#60777E",
  },

  emptyIcon: {
    width: "62px",
    height: "62px",
    borderRadius: "17px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 13px",
    fontSize: "25px",
  },

  emptyTitle: {
    color: "#123B4A",
    margin: 0,
    fontSize: "18px",
  },

  emptyText: {
    fontSize: "12px",
    margin: "7px 0 0",
  },

  emptyButton: {
    marginTop: "17px",
    padding: "10px 15px",
    border: "none",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "800",
  },


  /* =========================
     FOOTER
  ========================= */

  footer: {
    borderTop: "1px solid #0E5363",
    background: "#123B4A",
    padding: "21px 6%",
    color: "#D4F4F4",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "10px",
  },

  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  footerLogo: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "#12A8A8",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    fontSize: "17px",
  },

  footerText: {
    color: "#8FBBC0",
    fontSize: "8px",
    marginTop: "2px",
  },

  footerRight: {
    color: "#8FBBC0",
    fontSize: "9px",
    fontWeight: "700",
  },

};

export default DoctorAppointments;
