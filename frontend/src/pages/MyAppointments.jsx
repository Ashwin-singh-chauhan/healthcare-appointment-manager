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

      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav style={styles.nav}>

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
              PATIENT PORTAL
            </div>

          </div>

        </div>


        <div style={styles.navActions}>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
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


      {/* =================================================
          MAIN
      ================================================= */}

      <main style={styles.container}>

        {/* HEADER */}

        <div style={styles.pageHeader}>

          <div>

            <div style={styles.eyebrow}>
              PATIENT PORTAL
            </div>

            <h1 style={styles.title}>
              My Appointments
            </h1>

            <p style={styles.subtitle}>
              View and manage your upcoming and
              past healthcare appointments.
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.bookButton}
          >
            + Book Appointment
          </button>

        </div>


        {/* =================================================
            ALERTS
        ================================================= */}

        {error && (

          <div style={styles.error}>

            <div style={styles.alertIcon}>
              !
            </div>

            <div>
              <strong>
                Something went wrong
              </strong>

              <p style={styles.alertText}>
                {error}
              </p>
            </div>

          </div>

        )}


        {success && (

          <div style={styles.success}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <div>
              <strong>
                Appointment Updated
              </strong>

              <p style={styles.alertText}>
                {success}
              </p>
            </div>

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div style={styles.loadingCard}>

            <div style={styles.loadingIcon}>
              ⟳
            </div>

            <h3>
              Loading your appointments
            </h3>

            <p>
              Please wait while we retrieve
              your appointment details.
            </p>

          </div>


        ) : appointments.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div style={styles.empty}>

            <div style={styles.emptyCircle}>
              📅
            </div>

            <div style={styles.emptyEyebrow}>
              NO BOOKINGS YET
            </div>

            <h2>
              No appointments yet
            </h2>

            <p>
              You haven't booked any appointments.
              Find a doctor and schedule your first
              consultation.
            </p>

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              style={styles.primaryButton}
            >
              Find a Doctor
              <span style={styles.arrow}>
                →
              </span>
            </button>

          </div>


        ) : (

          /* =================================================
             APPOINTMENT LIST
          ================================================= */

          <div style={styles.list}>

            <div style={styles.listHeader}>

              <div>

                <span style={styles.listEyebrow}>
                  YOUR BOOKINGS
                </span>

                <h2 style={styles.listTitle}>
                  {appointments.length}{" "}
                  {appointments.length === 1
                    ? "Appointment"
                    : "Appointments"}
                </h2>

              </div>

              <div style={styles.secureBadge}>
                🔒 Secure
              </div>

            </div>


            {appointments.map((appointment) => {

              const isCancelled =
                appointment.status === "CANCELLED";

              return (

                <div
                  key={appointment.id}
                  style={styles.card}
                >

                  {/* TOP */}

                  <div style={styles.cardTop}>

                    <div style={styles.doctorSection}>

                      <div style={styles.doctorAvatar}>
                        👨‍⚕️
                      </div>

                      <div>

                        <div style={styles.doctorLabel}>
                          YOUR DOCTOR
                        </div>

                        <h2 style={styles.doctorName}>
                          Dr. {appointment.doctorName}
                        </h2>

                        <p style={styles.doctorId}>
                          Doctor ID: {appointment.doctorId}
                        </p>

                      </div>

                    </div>


                    <span
                      style={
                        isCancelled
                          ? styles.cancelled
                          : styles.booked
                      }
                    >

                      <span
                        style={{
                          ...styles.statusDot,
                          background:
                            isCancelled
                              ? "#C94C4C"
                              : "#239B68",
                        }}
                      ></span>

                      {appointment.status}

                    </span>

                  </div>


                  {/* DETAILS */}

                  <div style={styles.details}>

                    {/* DATE */}

                    <div style={styles.detail}>

                      <div style={styles.detailIcon}>
                        📅
                      </div>

                      <div>

                        <span style={styles.detailLabel}>
                          DATE
                        </span>

                        <strong style={styles.detailValue}>
                          {formatDate(
                            appointment.appointmentDate
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* TIME */}

                    <div style={styles.detail}>

                      <div style={styles.detailIcon}>
                        🕘
                      </div>

                      <div>

                        <span style={styles.detailLabel}>
                          TIME
                        </span>

                        <strong style={styles.detailValue}>
                          {formatTime(
                            appointment.appointmentTime
                          )}
                        </strong>

                      </div>

                    </div>


                    {/* PATIENT */}

                    <div style={styles.detail}>

                      <div style={styles.detailIcon}>
                        👤
                      </div>

                      <div>

                        <span style={styles.detailLabel}>
                          PATIENT
                        </span>

                        <strong style={styles.detailValue}>
                          {appointment.patientName}
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* NOTES */}

                  {appointment.notes && (

                    <div style={styles.notes}>

                      <span style={styles.notesIcon}>
                        ℹ
                      </span>

                      <div>

                        <strong>
                          Appointment Notes
                        </strong>

                        <p>
                          {appointment.notes}
                        </p>

                      </div>

                    </div>

                  )}


                  {/* ACTION */}

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
                        style={{
                          ...styles.cancelButton,
                          opacity:
                            cancelling ===
                            appointment.id
                              ? 0.65
                              : 1,
                        }}
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


      {/* =================================================
          FOOTER
      ================================================= */}

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

            <div style={styles.footerSub}>
              Smart healthcare appointment platform
            </div>

          </div>

        </div>

        <div style={styles.footerSecure}>
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
    color: "#123B4A",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  /* =================================================
     NAV
  ================================================= */

  nav: {
    minHeight: "76px",
    padding: "0 7%",
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

  navActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  backButton: {
    border: "1px solid #2A6674",
    background: "rgba(255,255,255,0.07)",
    color: "#D7F3F3",
    padding: "9px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },

  logout: {
    border: "1px solid #D65C5C",
    background: "#C94C4C",
    color: "#FFFFFF",
    padding: "9px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "700",
  },


  /* =================================================
     MAIN
  ================================================= */

  container: {
    width: "min(1050px, 88%)",
    margin: "0 auto",
    padding: "45px 0 70px",
  },

  pageHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "30px",
  },

  eyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    marginBottom: "7px",
  },

  title: {
    margin: 0,
    color: "#123B4A",
    fontSize: "36px",
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  subtitle: {
    color: "#60777E",
    fontSize: "12px",
    lineHeight: "1.6",
    marginTop: "9px",
    marginBottom: 0,
  },

  bookButton: {
    border: "none",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    padding: "12px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "10px",
    fontWeight: "800",
    whiteSpace: "nowrap",
    boxShadow:
      "0 7px 18px rgba(8,127,140,0.2)",
  },


  /* =================================================
     ALERTS
  ================================================= */

  error: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "18px",
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#DDF3E9",
    color: "#176345",
    border: "1px solid #A9D9C1",
    padding: "12px 15px",
    borderRadius: "10px",
    marginBottom: "18px",
  },

  alertIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#C94C4C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  successIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#239B68",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  alertText: {
    margin: "2px 0 0",
    fontSize: "9px",
  },


  /* =================================================
     LOADING
  ================================================= */

  loadingCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "16px",
    padding: "65px 30px",
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(18,59,74,0.07)",
  },

  loadingIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "24px",
  },


  /* =================================================
     LIST
  ================================================= */

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#123B4A",
    color: "#FFFFFF",
    padding: "18px 22px",
    borderRadius: "14px",
    boxShadow:
      "0 9px 25px rgba(18,59,74,0.14)",
  },

  listEyebrow: {
    color: "#72DAD8",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  listTitle: {
    margin: "4px 0 0",
    color: "#FFFFFF",
    fontSize: "19px",
  },

  secureBadge: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#BDEBED",
    padding: "7px 10px",
    borderRadius: "20px",
    fontSize: "8px",
    fontWeight: "700",
  },


  /* =================================================
     APPOINTMENT CARD
  ================================================= */

  card: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 8px 25px rgba(18,59,74,0.07)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    paddingBottom: "19px",
    borderBottom: "1px solid #C4DDDE",
  },

  doctorSection: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  doctorAvatar: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
  },

  doctorLabel: {
    color: "#087F8C",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1.2px",
    marginBottom: "3px",
  },

  doctorName: {
    margin: 0,
    color: "#123B4A",
    fontSize: "18px",
    fontWeight: "800",
  },

  doctorId: {
    margin: "4px 0 0",
    color: "#789096",
    fontSize: "9px",
  },


  /* STATUS */

  booked: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#DDF3E9",
    color: "#176345",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "8px",
    fontWeight: "800",
    border: "1px solid #A9D9C1",
  },

  cancelled: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#F7DCDC",
    color: "#8E3838",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "8px",
    fontWeight: "800",
    border: "1px solid #E6B5B5",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },


  /* =================================================
     DETAILS
  ================================================= */

  details: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    padding: "21px 0",
  },

  detail: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px",
    background: "#D8EBEC",
    borderRadius: "10px",
    border: "1px solid #B8D5D7",
  },

  detailIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },

  detailLabel: {
    display: "block",
    color: "#087F8C",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "4px",
  },

  detailValue: {
    display: "block",
    color: "#123B4A",
    fontSize: "11px",
    fontWeight: "800",
  },


  /* =================================================
     NOTES
  ================================================= */

  notes: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    background: "#D8EBEC",
    border:
      "1px solid #B8D5D7",
    padding: "12px 14px",
    borderRadius: "9px",
    color: "#365963",
    marginBottom: "18px",
    fontSize: "9px",
  },

  notesIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontWeight: "900",
  },


  /* =================================================
     ACTION
  ================================================= */

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    paddingTop: "2px",
  },

  cancelButton: {
    border: "1px solid #D65C5C",
    background: "#C94C4C",
    color: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "9px",
    fontWeight: "800",
  },


  /* =================================================
     EMPTY
  ================================================= */

  empty: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    textAlign: "center",
    padding: "70px 30px",
    borderRadius: "17px",
    boxShadow:
      "0 10px 30px rgba(18,59,74,0.07)",
  },

  emptyCircle: {
    width: "70px",
    height: "70px",
    borderRadius: "20px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 17px",
    fontSize: "30px",
  },

  emptyEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "18px",
    border: "none",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    padding: "12px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    marginTop: "15px",
    fontSize: "10px",
    fontWeight: "800",
    boxShadow:
      "0 7px 18px rgba(8,127,140,0.2)",
  },

  arrow: {
    fontSize: "16px",
  },


  /* =================================================
     FOOTER
  ================================================= */

  footer: {
    borderTop: "1px solid #0E5363",
    background: "#123B4A",
    padding: "20px 7%",
    color: "#D4F4F4",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "9px",
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

  footerSub: {
    color: "#8FBBC0",
    fontSize: "7px",
    marginTop: "2px",
  },

  footerSecure: {
    color: "#8FBBC0",
    fontSize: "8px",
    fontWeight: "700",
  },

};

export default MyAppointments;
