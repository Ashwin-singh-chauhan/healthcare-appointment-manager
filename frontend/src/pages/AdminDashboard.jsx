import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

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
              HealthCare
              <span style={styles.brandAccent}>+</span>
            </h2>

            <div style={styles.adminLabel}>
              ADMIN PORTAL
            </div>

          </div>

        </div>


        <div style={styles.navRight}>

          <div style={styles.adminProfile}>

            <div style={styles.avatar}>
              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "A"}
            </div>

            <div>

              <div style={styles.profileName}>
                {user?.name || "Admin"}
              </div>

              <div style={styles.profileRole}>
                Administrator
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


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        {/* HERO */}

        <section style={styles.hero}>

          <div>

            <div style={styles.eyebrow}>
              ADMINISTRATION CENTER
            </div>

            <h1 style={styles.title}>
              Admin Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome back,{" "}
              <strong style={styles.name}>
                {user?.name || "Admin"}
              </strong>
              . Manage your healthcare operations
              from one central workspace.
            </p>

          </div>


          <div style={styles.heroVisual}>

            <div style={styles.heroCircle}>
              🏥
            </div>

            <div style={styles.heroStatus}>

              <span style={styles.greenDot}></span>

              System Active

            </div>

          </div>

        </section>


        {/* =========================
            QUICK STATS
        ========================= */}

        <section style={styles.statsGrid}>

          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#B8DCDD",
              }}
            >
              👨‍⚕️
            </div>

            <div>

              <div style={styles.statLabel}>
                DOCTOR MANAGEMENT
              </div>

              <div style={styles.statText}>
                Manage medical staff
              </div>

            </div>

          </div>


          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#C9E4E5",
              }}
            >
              📅
            </div>

            <div>

              <div style={styles.statLabel}>
                SCHEDULING
              </div>

              <div style={styles.statText}>
                Configure availability
              </div>

            </div>

          </div>


          <div style={styles.statCard}>

            <div
              style={{
                ...styles.statIcon,
                background: "#CBEBDD",
              }}
            >
              ✓
            </div>

            <div>

              <div style={styles.statLabel}>
                OPERATIONS
              </div>

              <div style={styles.statText}>
                Monitor appointments
              </div>

            </div>

          </div>

        </section>


        {/* =========================
            MANAGEMENT
        ========================= */}

        <section>

          <div style={styles.sectionHeader}>

            <div>

              <div style={styles.sectionEyebrow}>
                MANAGEMENT TOOLS
              </div>

              <h2 style={styles.sectionTitle}>
                Healthcare Operations
              </h2>

              <p style={styles.sectionSubtitle}>
                Select a module to manage your healthcare platform.
              </p>

            </div>

          </div>


          <div style={styles.grid}>

            {/* =========================
                DOCTORS
            ========================= */}

            <div style={styles.card}>

              <div style={styles.cardTop}>

                <div
                  style={{
                    ...styles.iconBox,
                    background: "#B8DCDD",
                    color: "#087F8C",
                  }}
                >
                  👨‍⚕️
                </div>

                <span style={styles.moduleTag}>
                  STAFF
                </span>

              </div>


              <h2 style={styles.cardTitle}>
                Doctors
              </h2>

              <p style={styles.cardDescription}>
                Add, edit and manage doctors,
                specializations and contact information.
              </p>


              <div style={styles.cardDivider}></div>


              <button
                style={styles.button}
                onClick={() =>
                  navigate("/admin/doctors")
                }
              >
                <span>
                  Manage Doctors
                </span>

                <span style={styles.arrow}>
                  →
                </span>

              </button>

            </div>


            {/* =========================
                AVAILABILITY
            ========================= */}

            <div style={styles.card}>

              <div style={styles.cardTop}>

                <div
                  style={{
                    ...styles.iconBox,
                    background: "#C9E4E5",
                    color: "#087F8C",
                  }}
                >
                  📅
                </div>

                <span style={styles.moduleTag}>
                  SCHEDULE
                </span>

              </div>


              <h2 style={styles.cardTitle}>
                Availability
              </h2>

              <p style={styles.cardDescription}>
                Configure doctor working hours
                and appointment slot schedules.
              </p>


              <div style={styles.cardDivider}></div>


              <button
                style={styles.button}
                onClick={() =>
                  navigate("/admin/availability")
                }
              >
                <span>
                  Manage Availability
                </span>

                <span style={styles.arrow}>
                  →
                </span>

              </button>

            </div>


            {/* =========================
                LEAVES
            ========================= */}

            <div style={styles.card}>

              <div style={styles.cardTop}>

                <div
                  style={{
                    ...styles.iconBox,
                    background: "#D8EBDD",
                    color: "#16805C",
                  }}
                >
                  🏖️
                </div>

                <span style={styles.moduleTag}>
                  STAFF
                </span>

              </div>


              <h2 style={styles.cardTitle}>
                Doctor Leaves
              </h2>

              <p style={styles.cardDescription}>
                Manage doctor leave dates and
                keep schedules up to date.
              </p>


              <div style={styles.cardDivider}></div>


              <button
                style={styles.button}
                onClick={() =>
                  navigate("/admin/leaves")
                }
              >
                <span>
                  Manage Leaves
                </span>

                <span style={styles.arrow}>
                  →
                </span>

              </button>

            </div>


            {/* =========================
                APPOINTMENTS
            ========================= */}

            <div
              style={{
                ...styles.card,
                border:
                  "1px solid #77BFC2",
                background:
                  "linear-gradient(145deg,#EAF7F6,#D9EFF0)",
              }}
            >

              <div style={styles.cardTop}>

                <div
                  style={{
                    ...styles.iconBox,
                    background: "#087F8C",
                    color: "#FFFFFF",
                    boxShadow:
                      "0 5px 13px rgba(8,127,140,0.22)",
                  }}
                >
                  📋
                </div>

                <span
                  style={{
                    ...styles.moduleTag,
                    background: "#CBEBDD",
                    color: "#16805C",
                  }}
                >
                  OPERATIONS
                </span>

              </div>


              <h2 style={styles.cardTitle}>
                Appointments
              </h2>

              <p style={styles.cardDescription}>
                View, monitor and manage patient
                appointments across the hospital.
              </p>


              <div style={styles.cardDivider}></div>


              <button
                style={styles.buttonPrimary}
                onClick={() =>
                  navigate("/admin/appointments")
                }
              >
                <span>
                  View Appointments
                </span>

                <span style={styles.arrow}>
                  →
                </span>

              </button>

            </div>

          </div>

        </section>


        {/* =========================
            FOOTER NOTE
        ========================= */}

        <div style={styles.footerNote}>

          <div style={styles.footerIcon}>
            ✓
          </div>

          <div>

            <strong style={styles.footerTitle}>
              Healthcare Management System
            </strong>

            <p style={styles.footerText}>
              All administrative tools are available
              from this dashboard.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}


const styles = {

  /* =========================
     PAGE
  ========================= */

  page: {
    minHeight: "100vh",
    background: "#DCEFF0",
    color: "#12313B",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
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
    boxShadow:
      "0 4px 18px rgba(18,59,74,0.18)",
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
    boxShadow:
      "0 5px 15px rgba(18,168,168,0.35)",
  },

  brand: {
    margin: 0,
    fontSize: "23px",
    fontWeight: "750",
    color: "#F4FFFF",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "#62D3D1",
  },

  adminLabel: {
    marginTop: "2px",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    color: "#8FD5D7",
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "17px",
  },

  adminProfile: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
  },

  avatar: {
    width: "37px",
    height: "37px",
    borderRadius: "50%",
    background: "#2D6170",
    border: "1px solid #4A7E89",
    color: "#DDF7F7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "14px",
  },

  profileName: {
    color: "#F2FFFF",
    fontSize: "13px",
    fontWeight: "700",
  },

  profileRole: {
    color: "#8FBCC2",
    fontSize: "10px",
    marginTop: "2px",
  },

  logout: {
    border: "1px solid #B84A4A",
    background: "#C94C4C",
    color: "#FFFFFF",
    padding: "9px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
    boxShadow:
      "0 4px 10px rgba(201,76,76,0.2)",
  },


  /* =========================
     MAIN
  ========================= */

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "45px 30px 70px",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    background:
      "linear-gradient(135deg,#123B4A 0%,#15586A 60%,#087F8C 100%)",
    borderRadius: "22px",
    padding: "38px 42px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#FFFFFF",
    boxShadow:
      "0 15px 35px rgba(18,59,74,0.20)",
    marginBottom: "24px",
    overflow: "hidden",
    position: "relative",
  },

  eyebrow: {
    color: "#72D2D0",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    marginBottom: "9px",
  },

  title: {
    margin: 0,
    color: "#FFFFFF",
    fontSize: "35px",
    lineHeight: "1.15",
    fontWeight: "750",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    margin: "11px 0 0",
    maxWidth: "650px",
    color: "#C9E8E9",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  name: {
    color: "#7BE0D5",
  },

  heroVisual: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "9px",
  },

  heroCircle: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
  },

  heroStatus: {
    padding: "6px 10px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.10)",
    color: "#D4F4EF",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  greenDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#55D69A",
    boxShadow:
      "0 0 8px rgba(85,214,154,0.8)",
  },


  /* =========================
     STATS
  ========================= */

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "48px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "17px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "14px",
    boxShadow:
      "0 5px 15px rgba(18,59,74,0.07)",
  },

  statIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  statLabel: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  statText: {
    marginTop: "4px",
    color: "#315662",
    fontSize: "13px",
    fontWeight: "650",
  },


  /* =========================
     SECTION
  ========================= */

  sectionHeader: {
    marginBottom: "21px",
  },

  sectionEyebrow: {
    color: "#087F8C",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.6px",
    marginBottom: "5px",
  },

  sectionTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "26px",
    fontWeight: "750",
    letterSpacing: "-0.5px",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#557078",
    fontSize: "14px",
  },


  /* =========================
     CARDS
  ========================= */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, 1fr)",
    gap: "20px",
  },

  card: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 8px 24px rgba(18,59,74,0.08)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  moduleTag: {
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#C9E4E5",
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.7px",
  },

  cardTitle: {
    margin: "18px 0 6px",
    color: "#123B4A",
    fontSize: "20px",
    fontWeight: "750",
  },

  cardDescription: {
    margin: 0,
    color: "#557078",
    fontSize: "13px",
    lineHeight: "1.6",
    minHeight: "42px",
  },

  cardDivider: {
    height: "1px",
    background: "#C2DDDE",
    margin: "20px 0 15px",
  },

  button: {
    width: "100%",
    padding: "12px 15px",
    border: "1px solid #8DBFC2",
    borderRadius: "9px",
    background: "#C9E4E5",
    color: "#123B4A",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "750",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  buttonPrimary: {
    width: "100%",
    padding: "12px 15px",
    border: "none",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "750",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.22)",
  },

  arrow: {
    fontSize: "18px",
    lineHeight: "1",
  },


  /* =========================
     FOOTER NOTE
  ========================= */

  footerNote: {
    marginTop: "28px",
    padding: "16px 18px",
    borderRadius: "13px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  footerIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "9px",
    background: "#16805C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  footerTitle: {
    color: "#244C58",
    fontSize: "12px",
  },

  footerText: {
    margin: "3px 0 0",
    color: "#60777E",
    fontSize: "11px",
  },

};

export default AdminDashboard;
