import React from "react";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {

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
          HEADER
      ========================= */}

      <header style={styles.header}>

        <div style={styles.brandArea}>

          <div style={styles.logo}>
            +
          </div>

          <div>
            <div style={styles.brand}>
              HealthCare
              <span style={styles.brandAccent}>+</span>
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


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.main}>

        <section style={styles.hero}>

          <div>

            <div style={styles.eyebrow}>
              CLINICAL WORKSPACE
            </div>

            <h1 style={styles.title}>
              Doctor Dashboard
            </h1>

            <p style={styles.subtitle}>
              Welcome back,{" "}
              <strong style={styles.nameHighlight}>
                {user?.name || "Doctor"}
              </strong>.
              Manage your appointments, availability
              and leave schedule from one place.
            </p>

          </div>


          <div style={styles.heroIcon}>
            👨‍⚕️
          </div>

        </section>


        {/* =========================
            QUICK STATS
        ========================= */}

        <section style={styles.stats}>

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              📅
            </div>

            <div>
              <div style={styles.statLabel}>
                APPOINTMENTS
              </div>

              <div style={styles.statText}>
                Manage patients
              </div>
            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              🕐
            </div>

            <div>
              <div style={styles.statLabel}>
                AVAILABILITY
              </div>

              <div style={styles.statText}>
                Set working hours
              </div>
            </div>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              🏖️
            </div>

            <div>
              <div style={styles.statLabel}>
                LEAVE
              </div>

              <div style={styles.statText}>
                Manage time off
              </div>
            </div>

          </div>

        </section>


        {/* =========================
            SECTION TITLE
        ========================= */}

        <div style={styles.sectionHeader}>

          <div>

            <div style={styles.sectionEyebrow}>
              MANAGEMENT
            </div>

            <h2 style={styles.sectionTitle}>
              Your workspace
            </h2>

          </div>

          <div style={styles.sectionLine}></div>

        </div>


        {/* =========================
            ACTION CARDS
        ========================= */}

        <div style={styles.grid}>


          {/* APPOINTMENTS */}

          <div style={styles.card}>

            <div style={styles.cardTop}>

              <div style={styles.cardIcon}>
                📅
              </div>

              <span style={styles.cardNumber}>
                01
              </span>

            </div>

            <h2 style={styles.cardTitle}>
              Appointments
            </h2>

            <p style={styles.cardDescription}>
              View your scheduled appointments,
              patient details and consultation notes.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/doctor/appointments")
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


          {/* AVAILABILITY */}

          <div style={styles.card}>

            <div style={styles.cardTop}>

              <div style={styles.cardIcon}>
                🕐
              </div>

              <span style={styles.cardNumber}>
                02
              </span>

            </div>

            <h2 style={styles.cardTitle}>
              Availability
            </h2>

            <p style={styles.cardDescription}>
              Configure your working hours and
              control the appointment slots patients can book.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/doctor/availability")
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


          {/* LEAVES */}

          <div style={styles.card}>

            <div style={styles.cardTop}>

              <div style={styles.cardIcon}>
                🏖️
              </div>

              <span style={styles.cardNumber}>
                03
              </span>

            </div>

            <h2 style={styles.cardTitle}>
              Leave Management
            </h2>

            <p style={styles.cardDescription}>
              Add and manage unavailable dates
              when you will not be available for patients.
            </p>

            <button
              style={styles.button}
              onClick={() =>
                navigate("/doctor/leaves")
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

        </div>


        {/* =========================
            SECURITY BANNER
        ========================= */}

        <div style={styles.securityBanner}>

          <div style={styles.securityIcon}>
            🔒
          </div>

          <div>

            <div style={styles.securityTitle}>
              Your clinical workspace is secure
            </div>

            <div style={styles.securityText}>
              Healthcare information is protected
              through authenticated doctor access.
            </div>

          </div>

          <div style={styles.securityBadge}>
            SECURE
          </div>

        </div>

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
    padding: "45px 0 60px",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    padding: "32px",
    borderRadius: "20px",
    background:
      "linear-gradient(135deg,#123B4A,#087F8C)",
    boxShadow:
      "0 14px 35px rgba(8,127,140,0.20)",
    marginBottom: "22px",
  },

  eyebrow: {
    color: "#7DE0DE",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    color: "#FFFFFF",
    fontSize: "36px",
    fontWeight: "750",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    maxWidth: "650px",
    color: "#D5F3F3",
    fontSize: "14px",
    lineHeight: "1.6",
    marginTop: "10px",
  },

  nameHighlight: {
    color: "#FFFFFF",
  },

  heroIcon: {
    width: "100px",
    height: "100px",
    borderRadius: "25px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    flexShrink: 0,
  },


  /* =========================
     STATS
  ========================= */

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "15px",
    marginBottom: "40px",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "13px",
    padding: "15px",
  },

  statIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  statLabel: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.1px",
  },

  statText: {
    color: "#526F77",
    fontSize: "10px",
    marginTop: "3px",
  },


  /* =========================
     SECTION
  ========================= */

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "18px",
  },

  sectionEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  sectionTitle: {
    color: "#123B4A",
    fontSize: "21px",
    margin: "4px 0 0",
    fontWeight: "750",
  },

  sectionLine: {
    height: "1px",
    background: "#A8D2D4",
    flex: 1,
  },


  /* =========================
     CARDS
  ========================= */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
  },

  card: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "17px",
    padding: "25px",
    boxShadow:
      "0 9px 25px rgba(18,59,74,0.07)",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  cardIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "13px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },

  cardNumber: {
    color: "#91B5B9",
    fontSize: "22px",
    fontWeight: "800",
  },

  cardTitle: {
    color: "#123B4A",
    fontSize: "19px",
    margin: "0 0 8px",
    fontWeight: "750",
  },

  cardDescription: {
    color: "#60777E",
    fontSize: "11px",
    lineHeight: "1.6",
    minHeight: "54px",
    margin: 0,
  },

  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px 14px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 6px 15px rgba(8,127,140,0.18)",
  },

  arrow: {
    fontSize: "17px",
  },


  /* =========================
     SECURITY
  ========================= */

  securityBanner: {
    marginTop: "25px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    background: "#C9E4E5",
    border: "1px solid #9FCBCD",
    borderRadius: "13px",
    padding: "15px 18px",
  },

  securityIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  securityTitle: {
    color: "#123B4A",
    fontSize: "11px",
    fontWeight: "800",
  },

  securityText: {
    color: "#60777E",
    fontSize: "9px",
    marginTop: "3px",
  },

  securityBadge: {
    marginLeft: "auto",
    color: "#087F8C",
    background: "#EAF7F6",
    border: "1px solid #8DBFC2",
    padding: "6px 9px",
    borderRadius: "15px",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
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

export default DoctorDashboard;
