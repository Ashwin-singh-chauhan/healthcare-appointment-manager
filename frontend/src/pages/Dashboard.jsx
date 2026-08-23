import React, { useEffect, useMemo, useState } from "react";
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

  const [search, setSearch] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");


  /* =========================
     LOAD DOCTORS
  ========================= */

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


  /* =========================
     LOAD APPOINTMENTS
  ========================= */

  useEffect(() => {

    if (!token) return;

    async function loadAppointments() {

      try {

        setAppointmentsLoading(true);
        setAppointmentError("");

        const data =
          await getMyAppointments(token);

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


  /* =========================
     CANCEL
  ========================= */

  async function handleCancel(id) {

    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmed) return;

    try {

      await cancelAppointment(
        id,
        token
      );

      const data =
        await getMyAppointments(token);

      setAppointments(data);

    } catch (err) {

      console.error(err);
      setAppointmentError(err.message);

    }
  }


  /* =========================
     LOGOUT
  ========================= */

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }


  /* =========================
     SEARCH
  ========================= */

  const filteredDoctors = useMemo(() => {

    const value =
      search.toLowerCase().trim();

    if (!value) return doctors;

    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialization} ${doctor.email}`
        .toLowerCase()
        .includes(value)
    );

  }, [doctors, search]);


  const bookedAppointments =
    appointments.filter(
      (appointment) =>
        appointment.status === "BOOKED"
    );


  return (

    <div style={styles.page}>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

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
              YOUR HEALTH, OUR PRIORITY
            </div>

          </div>

        </div>


        <div style={styles.navRight}>

          <div style={styles.secureBadge}>
            <span style={styles.greenDot}></span>
            Secure Portal
          </div>


          <div style={styles.userInfo}>

            <div style={styles.userAvatar}>
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "P"}
            </div>

            <div>

              <div style={styles.userName}>
                {user?.name || "Patient"}
              </div>

              <div style={styles.userRole}>
                PATIENT
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

      </nav>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main style={styles.container}>


        {/* =========================
            HERO
        ========================= */}

        <section style={styles.hero}>

          <div style={styles.heroContent}>

            <div style={styles.eyebrow}>
              PATIENT PORTAL
            </div>

            <h1 style={styles.heroTitle}>
              Good to see you,{" "}
              <span style={styles.heroName}>
                {user?.name?.split(" ")[0] ||
                  "there"}
              </span>
            </h1>

            <p style={styles.heroSubtitle}>
              Manage your appointments and find
              the right healthcare professional for
              your needs.
            </p>


            <div style={styles.heroActions}>

              <button
                style={styles.heroButton}
                onClick={() => {
                  document
                    .getElementById("doctors")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                Find a Doctor
                <span>→</span>
              </button>

              <button
                style={styles.heroSecondary}
                onClick={() => {
                  document
                    .getElementById("appointments")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    });
                }}
              >
                My Appointments
              </button>

            </div>

          </div>


          <div style={styles.heroVisual}>

            <div style={styles.heroCircleLarge}>
              🩺
            </div>

            <div style={styles.heroCircleSmall}>
              ✓
            </div>

          </div>

        </section>


        {/* =========================
            STATS
        ========================= */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>

            <div style={styles.statIconTeal}>
              📅
            </div>

            <div>

              <div style={styles.statNumber}>
                {bookedAppointments.length}
              </div>

              <div style={styles.statLabel}>
                Upcoming Appointments
              </div>

            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIconGreen}>
              👨‍⚕️
            </div>

            <div>

              <div style={styles.statNumber}>
                {doctors.length}
              </div>

              <div style={styles.statLabel}>
                Available Doctors
              </div>

            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIconNavy}>
              ✓
            </div>

            <div>

              <div style={styles.statNumber}>
                {appointments.length}
              </div>

              <div style={styles.statLabel}>
                Total Appointments
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            APPOINTMENTS
        ===================================================== */}

        <section
          id="appointments"
          style={styles.section}
        >

          <div style={styles.sectionHeader}>

            <div>

              <div style={styles.sectionEyebrow}>
                YOUR SCHEDULE
              </div>

              <h2 style={styles.sectionTitle}>
                My Appointments
              </h2>

              <p style={styles.sectionSubtitle}>
                View and manage your upcoming
                consultations.
              </p>

            </div>


            <div style={styles.countBadge}>
              {bookedAppointments.length} active
            </div>

          </div>


          {appointmentsLoading && (

            <div style={styles.loadingCard}>

              <div style={styles.loadingIcon}>
                ⟳
              </div>

              <p>
                Loading your appointments...
              </p>

            </div>

          )}


          {appointmentError && (

            <div style={styles.error}>
              ⚠️ {appointmentError}
            </div>

          )}


          {!appointmentsLoading &&
            !appointmentError &&
            appointments.length === 0 && (

              <div style={styles.emptyCard}>

                <div style={styles.emptyIcon}>
                  📅
                </div>

                <h3 style={styles.emptyTitle}>
                  No appointments yet
                </h3>

                <p style={styles.emptyText}>
                  Find a doctor below and book
                  your first consultation.
                </p>

                <button
                  style={styles.emptyButton}
                  onClick={() =>
                    document
                      .getElementById("doctors")
                      ?.scrollIntoView({
                        behavior: "smooth",
                      })
                  }
                >
                  Find a Doctor →
                </button>

              </div>

            )}


          {!appointmentsLoading &&
            appointments.length > 0 && (

              <div style={styles.appointmentGrid}>

                {appointments.map(
                  (appointment) => {

                    const isBooked =
                      appointment.status ===
                      "BOOKED";

                    return (

                      <div
                        key={appointment.id}
                        style={{
                          ...styles.appointmentCard,
                          borderLeft:
                            isBooked
                              ? "4px solid #087F8C"
                              : "4px solid #94A8AC",
                        }}
                      >

                        <div
                          style={
                            styles.appointmentHeader
                          }
                        >

                          <div
                            style={
                              styles.doctorMini
                            }
                          >

                            <div
                              style={
                                styles.doctorMiniAvatar
                              }
                            >
                              {appointment
                                .doctorName
                                ?.charAt(0)
                                ?.toUpperCase() ||
                                "D"}
                            </div>

                            <div>

                              <h3
                                style={
                                  styles.appointmentDoctor
                                }
                              >
                                {appointment.doctorName}
                              </h3>

                              <span
                                style={
                                  styles.doctorId
                                }
                              >
                                Doctor ID #
                                {appointment.doctorId}
                              </span>

                            </div>

                          </div>


                          <span
                            style={
                              isBooked
                                ? styles.booked
                                : styles.cancelled
                            }
                          >
                            {appointment.status}
                          </span>

                        </div>


                        <div
                          style={
                            styles.appointmentInfo
                          }
                        >

                          <div
                            style={
                              styles.infoItem
                            }
                          >

                            <span
                              style={
                                styles.infoIcon
                              }
                            >
                              📅
                            </span>

                            <div>

                              <span
                                style={
                                  styles.infoLabel
                                }
                              >
                                DATE
                              </span>

                              <strong>
                                {
                                  appointment
                                    .appointmentDate
                                }
                              </strong>

                            </div>

                          </div>


                          <div
                            style={
                              styles.infoItem
                            }
                          >

                            <span
                              style={
                                styles.infoIcon
                              }
                            >
                              🕐
                            </span>

                            <div>

                              <span
                                style={
                                  styles.infoLabel
                                }
                              >
                                TIME
                              </span>

                              <strong>
                                {
                                  appointment
                                    .appointmentTime
                                }
                              </strong>

                            </div>

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


                        {isBooked && (

                          <button
                            style={
                              styles.cancelButton
                            }
                            onClick={() =>
                              handleCancel(
                                appointment.id
                              )
                            }
                          >
                            Cancel Appointment
                          </button>

                        )}

                      </div>

                    );

                  }
                )}

              </div>

            )}

        </section>


        {/* =====================================================
            FIND DOCTOR
        ===================================================== */}

        <section
          id="doctors"
          style={styles.section}
        >

          <div style={styles.sectionHeader}>

            <div>

              <div style={styles.sectionEyebrow}>
                HEALTHCARE PROFESSIONALS
              </div>

              <h2 style={styles.sectionTitle}>
                Find a Doctor
              </h2>

              <p style={styles.sectionSubtitle}>
                Browse our healthcare professionals
                and book your consultation.
              </p>

            </div>

            {!loading &&
              !error && (
                <div style={styles.doctorCount}>
                  {filteredDoctors.length} doctors
                </div>
              )}

          </div>


          {/* SEARCH */}

          <div style={styles.searchWrapper}>

            <span style={styles.searchIcon}>
              🔎
            </span>

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by doctor name or specialization..."
              style={styles.searchInput}
            />

            {search && (

              <button
                onClick={() => setSearch("")}
                style={styles.clearSearch}
              >
                ×
              </button>

            )}

          </div>


          {loading && (

            <div style={styles.loadingCard}>

              <div style={styles.loadingIcon}>
                ⟳
              </div>

              <p>
                Loading doctors...
              </p>

            </div>

          )}


          {error && (

            <div style={styles.error}>
              ⚠️ {error}
            </div>

          )}


          {!loading &&
            !error &&
            filteredDoctors.length === 0 && (

              <div style={styles.emptyCard}>

                <div style={styles.emptyIcon}>
                  🔎
                </div>

                <h3 style={styles.emptyTitle}>
                  No doctors found
                </h3>

                <p style={styles.emptyText}>
                  Try a different name or
                  specialization.
                </p>

              </div>

            )}


          {!loading &&
            filteredDoctors.length > 0 && (

              <div style={styles.doctorGrid}>

                {filteredDoctors.map(
                  (doctor) => (

                    <div
                      key={doctor.id}
                      style={styles.doctorCard}
                    >

                      <div
                        style={
                          styles.doctorCardTop
                        }
                      >

                        <div
                          style={
                            styles.doctorAvatar
                          }
                        >
                          {doctor.name
                            ?.replace(
                              "Dr. ",
                              ""
                            )
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "D"}
                        </div>

                        <span
                          style={
                            styles.availableBadge
                          }
                        >
                          ● Available
                        </span>

                      </div>


                      <h3
                        style={
                          styles.doctorName
                        }
                      >
                        {doctor.name}
                      </h3>


                      <div
                        style={
                          styles.specialization
                        }
                      >
                        {doctor.specialization}
                      </div>


                      <div
                        style={
                          styles.doctorDetails
                        }
                      >

                        <div>
                          <span>✉️</span>
                          {doctor.email}
                        </div>

                        <div>
                          <span>📞</span>
                          {doctor.phone}
                        </div>

                      </div>


                      <button
                        style={
                          styles.bookButton
                        }
                        onClick={() =>
                          navigate(
                            `/book/${doctor.id}`
                          )
                        }
                      >

                        <span>
                          View Availability
                        </span>

                        <span
                          style={
                            styles.arrow
                          }
                        >
                          →
                        </span>

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

        </section>

      </main>


      {/* =========================
          FOOTER
      ========================= */}

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
              Your trusted healthcare companion
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
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    color: "#12313B",
  },


  /* =========================
     NAVBAR
  ========================= */

  nav: {
    minHeight: "76px",
    padding: "0 6%",
    background: "#123B4A",
    borderBottom: "1px solid #0E5363",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
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
    fontSize: "21px",
    fontWeight: "800",
    color: "#F4FFFF",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "#62D3D1",
  },

  brandSub: {
    fontSize: "8px",
    color: "#8FD5D7",
    marginTop: "2px",
    letterSpacing: "1.3px",
    fontWeight: "700",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  secureBadge: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#1A4B5B",
    border: "1px solid #387080",
    color: "#BDEBED",
    padding: "8px 11px",
    borderRadius: "20px",
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

  userAvatar: {
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
    fontWeight: "800",
    letterSpacing: "1px",
  },

  logout: {
    border: "1px solid #A85B64",
    background: "#5A3540",
    color: "#FFDDE0",
    padding: "9px 15px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "11px",
  },


  /* =========================
     MAIN
  ========================= */

  container: {
    width: "min(1180px, 92%)",
    margin: "0 auto",
    padding: "42px 0 65px",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    background:
      "linear-gradient(135deg,#123B4A,#087F8C 58%,#12A8A8)",
    borderRadius: "22px",
    padding: "38px 42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#FFFFFF",
    boxShadow:
      "0 20px 45px rgba(8,127,140,0.25)",
    overflow: "hidden",
    position: "relative",
    marginBottom: "22px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  eyebrow: {
    fontSize: "10px",
    letterSpacing: "1.8px",
    fontWeight: "800",
    color: "#9DE2E1",
    marginBottom: "9px",
  },

  heroTitle: {
    fontSize: "34px",
    margin: 0,
    color: "#FFFFFF",
    letterSpacing: "-1px",
    fontWeight: "750",
  },

  heroName: {
    color: "#72E0DD",
  },

  heroSubtitle: {
    color: "#D4F4F4",
    maxWidth: "650px",
    margin: "12px 0 0",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  heroActions: {
    display: "flex",
    gap: "10px",
    marginTop: "22px",
  },

  heroButton: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "11px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#FFFFFF",
    color: "#087F8C",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
  },

  heroSecondary: {
    padding: "11px 16px",
    border: "1px solid #5BA6AD",
    borderRadius: "9px",
    background: "#1A5360",
    color: "#E5FFFF",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },

  heroVisual: {
    width: "135px",
    height: "135px",
    position: "relative",
    flexShrink: 0,
  },

  heroCircleLarge: {
    width: "115px",
    height: "115px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "52px",
  },

  heroCircleSmall: {
    position: "absolute",
    right: 0,
    bottom: 5,
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#55D69A",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    border: "4px solid #087F8C",
  },


  /* =========================
     STATS
  ========================= */

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "52px",
  },

  statCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "15px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.07)",
  },

  statIconTeal: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  statIconGreen: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#CBEBDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
  },

  statIconNavy: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#D0E1E5",
    color: "#123B4A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "900",
  },

  statNumber: {
    color: "#123B4A",
    fontSize: "25px",
    fontWeight: "800",
    lineHeight: 1,
  },

  statLabel: {
    color: "#60777E",
    fontSize: "11px",
    marginTop: "6px",
    fontWeight: "600",
  },


  /* =========================
     SECTIONS
  ========================= */

  section: {
    marginBottom: "55px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  sectionEyebrow: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    marginBottom: "6px",
  },

  sectionTitle: {
    color: "#123B4A",
    fontSize: "27px",
    margin: 0,
    letterSpacing: "-0.6px",
    fontWeight: "750",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#60777E",
    fontSize: "13px",
  },

  countBadge: {
    background: "#CBEBDD",
    color: "#126442",
    border: "1px solid #9DD3B7",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
  },

  doctorCount: {
    background: "#C9E4E5",
    color: "#087F8C",
    border: "1px solid #A8D2D4",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
  },


  /* =========================
     APPOINTMENTS
  ========================= */

  appointmentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(350px,1fr))",
    gap: "16px",
  },

  appointmentCard: {
    background: "#EAF7F6",
    padding: "21px",
    borderRadius: "15px",
    borderTop: "1px solid #A8D2D4",
    borderRight: "1px solid #A8D2D4",
    borderBottom: "1px solid #A8D2D4",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.07)",
  },

  appointmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  doctorMini: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  doctorMiniAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
  },

  appointmentDoctor: {
    margin: 0,
    color: "#123B4A",
    fontSize: "15px",
    fontWeight: "750",
  },

  doctorId: {
    color: "#71888E",
    fontSize: "9px",
  },

  booked: {
    background: "#CBEBDD",
    color: "#126442",
    border: "1px solid #9DD3B7",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "8px",
    fontWeight: "800",
  },

  cancelled: {
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "8px",
    fontWeight: "800",
  },

  appointmentInfo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "20px",
    paddingTop: "17px",
    borderTop: "1px solid #C7DDDE",
  },

  infoItem: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  infoIcon: {
    fontSize: "15px",
  },

  infoLabel: {
    display: "block",
    color: "#789096",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.5px",
    marginBottom: "3px",
  },

  notes: {
    display: "flex",
    gap: "9px",
    marginTop: "14px",
    padding: "11px",
    background: "#D8EBEC",
    borderRadius: "9px",
    color: "#45616A",
    fontSize: "12px",
  },

  cancelButton: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    border: "1px solid #D8A6AC",
    borderRadius: "9px",
    background: "#F7DCDC",
    color: "#9A3C48",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "750",
  },


  /* =========================
     SEARCH
  ========================= */

  searchWrapper: {
    position: "relative",
    marginBottom: "20px",
  },

  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "16px",
    zIndex: 1,
  },

  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 43px",
    border: "1px solid #8DBFC2",
    borderRadius: "11px",
    fontSize: "13px",
    outline: "none",
    background: "#EAF7F6",
    color: "#123B4A",
    boxShadow:
      "0 5px 15px rgba(18,59,74,0.05)",
  },

  clearSearch: {
    position: "absolute",
    right: "11px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    border: "none",
    background: "#C5DDDE",
    color: "#45616A",
    cursor: "pointer",
    fontSize: "17px",
    lineHeight: "1",
  },


  /* =========================
     DOCTORS
  ========================= */

  doctorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(275px,1fr))",
    gap: "16px",
  },

  doctorCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "16px",
    padding: "22px",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.06)",
  },

  doctorCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  doctorAvatar: {
    width: "57px",
    height: "57px",
    borderRadius: "15px",
    background:
      "linear-gradient(135deg,#C9E4E5,#A9D9DB)",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    fontWeight: "800",
  },

  availableBadge: {
    color: "#126442",
    background: "#CBEBDD",
    border: "1px solid #9DD3B7",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "9px",
    fontWeight: "800",
  },

  doctorName: {
    color: "#123B4A",
    fontSize: "17px",
    margin: "16px 0 5px",
    fontWeight: "750",
  },

  specialization: {
    color: "#087F8C",
    fontWeight: "800",
    fontSize: "12px",
  },

  doctorDetails: {
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #C7DDDE",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    color: "#60777E",
    fontSize: "11px",
  },

  bookButton: {
    width: "100%",
    marginTop: "17px",
    padding: "11px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "800",
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "15px",
    paddingRight: "15px",
  },

  arrow: {
    fontSize: "17px",
  },


  /* =========================
     STATES
  ========================= */

  loadingCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "14px",
    padding: "30px",
    textAlign: "center",
    color: "#60777E",
  },

  loadingIcon: {
    fontSize: "25px",
    color: "#087F8C",
    marginBottom: "7px",
  },

  error: {
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "18px",
    fontSize: "12px",
    fontWeight: "650",
  },

  emptyCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "15px",
    padding: "42px 25px",
    textAlign: "center",
    boxShadow:
      "0 7px 22px rgba(18,59,74,0.05)",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 12px",
    borderRadius: "15px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  emptyTitle: {
    margin: "0 0 5px",
    color: "#123B4A",
    fontSize: "17px",
  },

  emptyText: {
    margin: 0,
    color: "#60777E",
    fontSize: "12px",
  },

  emptyButton: {
    marginTop: "15px",
    padding: "10px 16px",
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
    borderTop: "1px solid #A8D2D4",
    background: "#123B4A",
    padding: "22px 6%",
    color: "#D4F4F4",
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: "9px",
    marginTop: "2px",
  },

  footerRight: {
    color: "#8FBBC0",
    fontSize: "9px",
    fontWeight: "700",
  },

};

export default Dashboard;
