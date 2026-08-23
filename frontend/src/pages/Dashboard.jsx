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
    if (!token) return;

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

    if (!confirmed) return;

    try {
      await cancelAppointment(id, token);

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

  const filteredDoctors = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return doctors;

    return doctors.filter((doctor) =>
      `${doctor.name} ${doctor.specialization} ${doctor.email}`
        .toLowerCase()
        .includes(value)
    );
  }, [doctors, search]);

  const bookedAppointments = appointments.filter(
    (appointment) => appointment.status === "BOOKED"
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
              HealthCare<span style={styles.brandAccent}>+</span>
            </div>

            <div style={styles.brandSub}>
              Your health, our priority
            </div>
          </div>
        </div>

        <div style={styles.navRight}>

          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.name?.charAt(0)?.toUpperCase() || "P"}
            </div>

            <div>
              <div style={styles.userName}>
                {user?.name || "Patient"}
              </div>

              <div style={styles.userRole}>
                Patient
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

        {/* HERO */}

        <section style={styles.hero}>

          <div>
            <div style={styles.eyebrow}>
              PATIENT PORTAL
            </div>

            <h1 style={styles.heroTitle}>
              Good to see you,{" "}
              <span style={styles.heroName}>
                {user?.name?.split(" ")[0] || "there"}
              </span>{" "}
              👋
            </h1>

            <p style={styles.heroSubtitle}>
              Manage your appointments and find the right
              healthcare professional for you.
            </p>
          </div>

          <div style={styles.heroIcon}>
            🩺
          </div>

        </section>

        {/* =====================================================
            STATS
        ===================================================== */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>
            <div style={styles.statIconBlue}>
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
            <div style={styles.statIconPurple}>
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

        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>
              <div style={styles.sectionEyebrow}>
                YOUR SCHEDULE
              </div>

              <h2 style={styles.sectionTitle}>
                My Appointments
              </h2>

              <p style={styles.sectionSubtitle}>
                View and manage your upcoming consultations.
              </p>
            </div>

            <div style={styles.countBadge}>
              {bookedAppointments.length} active
            </div>

          </div>

          {appointmentsLoading && (
            <div style={styles.loadingCard}>
              <div style={styles.spinner}>
                ⟳
              </div>

              <p>Loading your appointments...</p>
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
                  Find a doctor below and book your
                  first consultation.
                </p>

              </div>
            )}

          {!appointmentsLoading &&
            appointments.length > 0 && (

              <div style={styles.appointmentGrid}>

                {appointments.map((appointment) => {

                  const isBooked =
                    appointment.status === "BOOKED";

                  return (
                    <div
                      key={appointment.id}
                      style={{
                        ...styles.appointmentCard,
                        borderLeft: isBooked
                          ? "4px solid #2563eb"
                          : "4px solid #94a3b8",
                      }}
                    >

                      <div style={styles.appointmentHeader}>

                        <div style={styles.doctorMini}>

                          <div style={styles.doctorMiniAvatar}>
                            {appointment.doctorName
                              ?.charAt(0)
                              ?.toUpperCase() || "D"}
                          </div>

                          <div>

                            <h3 style={styles.appointmentDoctor}>
                              {appointment.doctorName}
                            </h3>

                            <span style={styles.doctorId}>
                              Doctor ID #{appointment.doctorId}
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

                      <div style={styles.appointmentInfo}>

                        <div style={styles.infoItem}>
                          <span style={styles.infoIcon}>
                            📅
                          </span>

                          <div>
                            <span style={styles.infoLabel}>
                              Date
                            </span>

                            <strong>
                              {appointment.appointmentDate}
                            </strong>
                          </div>
                        </div>

                        <div style={styles.infoItem}>
                          <span style={styles.infoIcon}>
                            🕐
                          </span>

                          <div>
                            <span style={styles.infoLabel}>
                              Time
                            </span>

                            <strong>
                              {appointment.appointmentTime}
                            </strong>
                          </div>
                        </div>

                      </div>

                      {appointment.notes && (
                        <div style={styles.notes}>
                          <span>📝</span>

                          <div>
                            <span style={styles.infoLabel}>
                              Notes
                            </span>

                            <div>
                              {appointment.notes}
                            </div>
                          </div>
                        </div>
                      )}

                      {isBooked && (
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
                  );
                })}

              </div>
            )}

        </section>

        {/* =====================================================
            FIND DOCTOR
        ===================================================== */}

        <section style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>
              <div style={styles.sectionEyebrow}>
                HEALTHCARE PROFESSIONALS
              </div>

              <h2 style={styles.sectionTitle}>
                Find a Doctor
              </h2>

              <p style={styles.sectionSubtitle}>
                Browse our healthcare professionals and
                book an appointment.
              </p>
            </div>

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
              <div style={styles.spinner}>
                ⟳
              </div>

              <p>Loading doctors...</p>
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
                  Try a different name or specialization.
                </p>
              </div>
            )}

          {!loading &&
            filteredDoctors.length > 0 && (

              <div style={styles.doctorGrid}>

                {filteredDoctors.map((doctor) => (

                  <div
                    key={doctor.id}
                    style={styles.doctorCard}
                  >

                    <div style={styles.doctorCardTop}>

                      <div style={styles.doctorAvatar}>
                        {doctor.name
                          ?.replace("Dr. ", "")
                          ?.charAt(0)
                          ?.toUpperCase() || "D"}
                      </div>

                      <span style={styles.availableBadge}>
                        ● Available
                      </span>

                    </div>

                    <h3 style={styles.doctorName}>
                      {doctor.name}
                    </h3>

                    <div style={styles.specialization}>
                      {doctor.specialization}
                    </div>

                    <div style={styles.doctorDetails}>

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
                      style={styles.bookButton}
                      onClick={() =>
                        navigate(`/book/${doctor.id}`)
                      }
                    >
                      <span>
                        View Availability
                      </span>

                      <span style={styles.arrow}>
                        →
                      </span>
                    </button>

                  </div>

                ))}

              </div>
            )}

        </section>

      </main>

      {/* FOOTER */}

      <footer style={styles.footer}>
        <div>
          <strong>
            HealthCare<span style={styles.brandAccent}>+</span>
          </strong>

          <span style={styles.footerText}>
            &nbsp; • &nbsp; Your trusted healthcare companion
          </span>
        </div>
      </footer>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #f1f5f9 100%)",
    fontFamily:
      "Inter, Arial, sans-serif",
    color: "#0f172a",
  },

  /* NAV */

  nav: {
    height: "76px",
    padding: "0 7%",
    background: "rgba(255,255,255,0.96)",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 20,
    boxShadow:
      "0 2px 12px rgba(15,23,42,0.04)",
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
    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    boxShadow:
      "0 6px 15px rgba(37,99,235,0.25)",
  },

  brand: {
    fontSize: "21px",
    fontWeight: "800",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "#2563eb",
  },

  brandSub: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "1px",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  userAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  userName: {
    fontSize: "14px",
    fontWeight: "700",
  },

  userRole: {
    fontSize: "11px",
    color: "#64748b",
    marginTop: "2px",
  },

  logout: {
    border: "1px solid #fecaca",
    background: "#fff1f2",
    color: "#dc2626",
    padding: "9px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
  },

  /* MAIN */

  container: {
    width: "min(1180px, 92%)",
    margin: "0 auto",
    padding: "42px 0 70px",
  },

  hero: {
    background:
      "linear-gradient(135deg,#1d4ed8,#2563eb 55%,#3b82f6)",
    borderRadius: "22px",
    padding: "38px 42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "white",
    boxShadow:
      "0 20px 45px rgba(37,99,235,0.22)",
    overflow: "hidden",
    position: "relative",
    marginBottom: "25px",
  },

  eyebrow: {
    fontSize: "11px",
    letterSpacing: "1.5px",
    fontWeight: "800",
    opacity: 0.75,
    marginBottom: "10px",
  },

  heroTitle: {
    fontSize: "34px",
    margin: 0,
    color: "white",
    letterSpacing: "-1px",
  },

  heroName: {
    color: "#bfdbfe",
  },

  heroSubtitle: {
    color: "#dbeafe",
    maxWidth: "650px",
    margin: "12px 0 0",
    fontSize: "15px",
  },

  heroIcon: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    flexShrink: 0,
  },

  /* STATS */

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
    marginBottom: "55px",
  },

  statCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "21px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow:
      "0 7px 22px rgba(15,23,42,0.05)",
  },

  statIconBlue: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statIconGreen: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#f0fdf4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statIconPurple: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    background: "#faf5ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  statNumber: {
    fontSize: "25px",
    fontWeight: "800",
    lineHeight: 1,
  },

  statLabel: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "6px",
  },

  /* SECTIONS */

  section: {
    marginBottom: "58px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "22px",
  },

  sectionEyebrow: {
    color: "#2563eb",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "6px",
  },

  sectionTitle: {
    fontSize: "27px",
    margin: 0,
    letterSpacing: "-0.7px",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "14px",
  },

  countBadge: {
    background: "#eff6ff",
    color: "#2563eb",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "800",
  },

  /* APPOINTMENTS */

  appointmentGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(370px,1fr))",
    gap: "18px",
  },

  appointmentCard: {
    background: "white",
    padding: "22px",
    borderRadius: "16px",
    borderTop: "1px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
    boxShadow:
      "0 8px 25px rgba(15,23,42,0.06)",
  },

  appointmentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  doctorMini: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  doctorMiniAvatar: {
    width: "46px",
    height: "46px",
    borderRadius: "13px",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "800",
  },

  appointmentDoctor: {
    margin: 0,
    fontSize: "16px",
  },

  doctorId: {
    color: "#94a3b8",
    fontSize: "11px",
  },

  booked: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
  },

  cancelled: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
  },

  appointmentInfo: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #f1f5f9",
  },

  infoItem: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
  },

  infoIcon: {
    fontSize: "17px",
  },

  infoLabel: {
    display: "block",
    color: "#94a3b8",
    fontSize: "10px",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "3px",
  },

  notes: {
    display: "flex",
    gap: "9px",
    marginTop: "16px",
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
    color: "#475569",
    fontSize: "13px",
  },

  cancelButton: {
    width: "100%",
    marginTop: "17px",
    padding: "11px",
    border: "1px solid #fecaca",
    borderRadius: "9px",
    background: "#fff1f2",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
  },

  /* SEARCH */

  searchWrapper: {
    position: "relative",
    marginBottom: "22px",
  },

  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "17px",
    zIndex: 1,
  },

  searchInput: {
    width: "100%",
    padding: "15px 45px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    background: "white",
    boxShadow:
      "0 5px 15px rgba(15,23,42,0.04)",
  },

  clearSearch: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    border: "none",
    background: "#e2e8f0",
    color: "#475569",
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: "1",
  },

  /* DOCTORS */

  doctorGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(280px,1fr))",
    gap: "18px",
  },

  doctorCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "17px",
    padding: "23px",
    boxShadow:
      "0 7px 22px rgba(15,23,42,0.05)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  doctorCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  doctorAvatar: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background:
      "linear-gradient(135deg,#dbeafe,#bfdbfe)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "800",
  },

  availableBadge: {
    color: "#15803d",
    background: "#f0fdf4",
    padding: "6px 9px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: "800",
  },

  doctorName: {
    fontSize: "18px",
    margin: "17px 0 5px",
  },

  specialization: {
    color: "#2563eb",
    fontWeight: "800",
    fontSize: "13px",
  },

  doctorDetails: {
    marginTop: "17px",
    paddingTop: "15px",
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    color: "#64748b",
    fontSize: "12px",
  },

  bookButton: {
    width: "100%",
    marginTop: "18px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#2563eb,#1d4ed8)",
    color: "white",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "800",
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
  },

  arrow: {
    fontSize: "18px",
  },

  /* STATES */

  loadingCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "30px",
    textAlign: "center",
    color: "#64748b",
  },

  spinner: {
    fontSize: "25px",
    color: "#2563eb",
  },

  error: {
    background: "#fff1f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  emptyCard: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "42px 25px",
    textAlign: "center",
    boxShadow:
      "0 7px 22px rgba(15,23,42,0.04)",
  },

  emptyIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 12px",
    borderRadius: "15px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  emptyTitle: {
    margin: "0 0 5px",
    fontSize: "17px",
  },

  emptyText: {
    margin: 0,
    fontSize: "13px",
  },

  /* FOOTER */

  footer: {
    borderTop: "1px solid #e2e8f0",
    background: "white",
    padding: "25px 7%",
    color: "#475569",
    fontSize: "13px",
  },

  footerText: {
    color: "#94a3b8",
  },
};

export default Dashboard;
