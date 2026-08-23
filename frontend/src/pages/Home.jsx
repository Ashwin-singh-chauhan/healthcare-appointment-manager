import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.page}>

      {/* =========================
          NAVBAR
      ========================= */}

      <nav style={styles.nav}>

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
              SMART HEALTHCARE PLATFORM
            </div>

          </div>

        </div>


        <div style={styles.navRight}>

          <Link
            to="/login"
            style={styles.loginLink}
          >
            Login
          </Link>

          <Link
            to="/register"
            style={styles.navButton}
          >
            Get Started
          </Link>

        </div>

      </nav>


      {/* =========================
          HERO
      ========================= */}

      <main>

        <section style={styles.hero}>

          {/* LEFT */}

          <div style={styles.heroContent}>

            <div style={styles.badge}>
              <span style={styles.badgeDot}></span>
              ONLINE HEALTHCARE PLATFORM
            </div>


            <h1 style={styles.title}>
              Healthcare that
              <br />

              <span style={styles.titleAccent}>
                works around you.
              </span>
            </h1>


            <p style={styles.subtitle}>
              Find trusted doctors, check real-time
              availability and book appointments securely
              from one simple healthcare platform.
            </p>


            <div style={styles.actions}>

              <Link
                to="/register"
                style={styles.primary}
              >
                <span>
                  Book an Appointment
                </span>

                <span style={styles.arrow}>
                  →
                </span>
              </Link>


              <Link
                to="/login"
                style={styles.secondary}
              >
                Login to Portal
              </Link>

            </div>


            {/* TRUST */}

            <div style={styles.trust}>

              <div style={styles.trustItem}>

                <div style={styles.trustIcon}>
                  ✓
                </div>

                <div>
                  <strong>
                    Secure
                  </strong>

                  <span>
                    Protected access
                  </span>
                </div>

              </div>


              <div style={styles.trustDivider}></div>


              <div style={styles.trustItem}>

                <div style={styles.trustIcon}>
                  ✓
                </div>

                <div>
                  <strong>
                    Trusted
                  </strong>

                  <span>
                    Verified doctors
                  </span>
                </div>

              </div>


              <div style={styles.trustDivider}></div>


              <div style={styles.trustItem}>

                <div style={styles.trustIcon}>
                  ✓
                </div>

                <div>
                  <strong>
                    Simple
                  </strong>

                  <span>
                    Easy booking
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* RIGHT */}

          <div style={styles.heroVisual}>

            <div style={styles.glow}></div>


            <div style={styles.mainMedicalCard}>

              <div style={styles.medicalTop}>

                <div style={styles.medicalIcon}>
                  🩺
                </div>

                <div>

                  <div style={styles.medicalSmall}>
                    HEALTHCARE+
                  </div>

                  <div style={styles.medicalTitle}>
                    Your care, simplified
                  </div>

                </div>

              </div>


              <div style={styles.doctorPreview}>

                <div style={styles.doctorAvatar}>
                  👨‍⚕️
                </div>

                <div style={styles.doctorInfo}>

                  <div style={styles.available}>
                    <span style={styles.availableDot}></span>
                    Available
                  </div>

                  <h3>
                    Find your doctor
                  </h3>

                  <p>
                    Choose from available
                    specialists.
                  </p>

                </div>

              </div>


              <div style={styles.slotPreview}>

                <div>
                  <span style={styles.slotLabel}>
                    NEXT AVAILABLE
                  </span>

                  <strong>
                    Today · 10:30 AM
                  </strong>
                </div>

                <div style={styles.slotArrow}>
                  →
                </div>

              </div>


              <div style={styles.secureRow}>

                <span>
                  🔒 Secure appointment booking
                </span>

                <span style={styles.secureCheck}>
                  ✓
                </span>

              </div>

            </div>


            {/* FLOATING CARD */}

            <div style={styles.floatingCard}>

              <div style={styles.floatingIcon}>
                ✓
              </div>

              <div>

                <div style={styles.floatingTitle}>
                  Appointment confirmed
                </div>

                <div style={styles.floatingText}>
                  Your booking is secure
                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =========================
            FEATURES
        ========================= */}

        <section style={styles.featuresSection}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionEyebrow}>
              EVERYTHING IN ONE PLACE
            </div>

            <h2 style={styles.sectionTitle}>
              A simpler way to manage your care
            </h2>

            <p style={styles.sectionSubtitle}>
              Designed to make healthcare appointments
              easier for patients and doctors.
            </p>

          </div>


          <div style={styles.featureGrid}>


            {/* FEATURE 1 */}

            <div style={styles.featureCard}>

              <div style={styles.featureIcon}>
                👨‍⚕️
              </div>

              <h3>
                Find trusted doctors
              </h3>

              <p>
                Browse doctors by specialization
                and choose the right healthcare
                professional for your needs.
              </p>

            </div>


            {/* FEATURE 2 */}

            <div style={styles.featureCard}>

              <div style={styles.featureIcon}>
                📅
              </div>

              <h3>
                Check availability
              </h3>

              <p>
                View available appointment slots
                and select a convenient time
                without unnecessary calls.
              </p>

            </div>


            {/* FEATURE 3 */}

            <div style={styles.featureCard}>

              <div style={styles.featureIcon}>
                🔒
              </div>

              <h3>
                Secure booking
              </h3>

              <p>
                Your appointments are protected
                through authenticated and secure
                account access.
              </p>

            </div>


          </div>

        </section>


        {/* =========================
            CTA
        ========================= */}

        <section style={styles.cta}>

          <div>

            <div style={styles.ctaEyebrow}>
              READY TO GET STARTED?
            </div>

            <h2 style={styles.ctaTitle}>
              Take the next step in
              <br />
              managing your healthcare.
            </h2>

          </div>


          <Link
            to="/register"
            style={styles.ctaButton}
          >
            Create Your Account
            <span style={styles.arrow}>
              →
            </span>
          </Link>

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
              Smart healthcare appointment platform
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
     NAVBAR
  ========================= */

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

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  loginLink: {
    color: "#D4F4F4",
    textDecoration: "none",
    fontSize: "12px",
    fontWeight: "700",
  },

  navButton: {
    textDecoration: "none",
    background: "#12A8A8",
    color: "#FFFFFF",
    padding: "10px 17px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
    boxShadow:
      "0 5px 14px rgba(18,168,168,0.25)",
  },


  /* =========================
     HERO
  ========================= */

  hero: {
    width: "min(1180px, 90%)",
    minHeight: "590px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns:
      "1.05fr 0.95fr",
    alignItems: "center",
    gap: "50px",
    padding: "45px 0 65px",
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 11px",
    borderRadius: "20px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.3px",
    marginBottom: "20px",
  },

  badgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#12A8A8",
    boxShadow:
      "0 0 8px rgba(18,168,168,0.6)",
  },

  title: {
    margin: 0,
    color: "#123B4A",
    fontSize: "55px",
    lineHeight: "1.05",
    fontWeight: "800",
    letterSpacing: "-2px",
  },

  titleAccent: {
    color: "#087F8C",
  },

  subtitle: {
    maxWidth: "590px",
    color: "#60777E",
    fontSize: "15px",
    lineHeight: "1.7",
    marginTop: "22px",
    marginBottom: "28px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  primary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    textDecoration: "none",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    padding: "14px 18px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
    boxShadow:
      "0 8px 20px rgba(8,127,140,0.22)",
  },

  secondary: {
    display: "inline-block",
    textDecoration: "none",
    color: "#087F8C",
    background: "#EAF7F6",
    border: "1px solid #8DBFC2",
    padding: "13px 20px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
  },

  arrow: {
    fontSize: "17px",
  },


  /* TRUST */

  trust: {
    display: "flex",
    alignItems: "center",
    marginTop: "35px",
    gap: "18px",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  trustIcon: {
    width: "25px",
    height: "25px",
    borderRadius: "50%",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "900",
  },

  trustItemStrong: {
    color: "#123B4A",
  },

  trustDivider: {
    width: "1px",
    height: "28px",
    background: "#A8D2D4",
  },


  /* =========================
     HERO VISUAL
  ========================= */

  heroVisual: {
    position: "relative",
    minHeight: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  glow: {
    position: "absolute",
    width: "370px",
    height: "370px",
    borderRadius: "50%",
    background:
      "rgba(18,168,168,0.13)",
    filter: "blur(5px)",
  },

  mainMedicalCard: {
    position: "relative",
    width: "350px",
    padding: "25px",
    borderRadius: "22px",
    background:
      "linear-gradient(145deg,#123B4A,#087F8C)",
    boxShadow:
      "0 25px 55px rgba(18,59,74,0.25)",
    zIndex: 2,
  },

  medicalTop: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    paddingBottom: "22px",
    borderBottom:
      "1px solid rgba(255,255,255,0.14)",
  },

  medicalIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },

  medicalSmall: {
    color: "#7DE0DE",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1.3px",
  },

  medicalTitle: {
    color: "#FFFFFF",
    fontSize: "17px",
    fontWeight: "750",
    marginTop: "3px",
  },

  doctorPreview: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginTop: "23px",
    padding: "15px",
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.10)",
    borderRadius: "13px",
  },

  doctorAvatar: {
    width: "55px",
    height: "55px",
    borderRadius: "15px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "27px",
  },

  doctorInfo: {
    flex: 1,
  },

  available: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "#8FE3B4",
    fontSize: "8px",
    fontWeight: "800",
  },

  availableDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#55D69A",
  },

  doctorInfoH3: {
    color: "#FFFFFF",
  },

  slotPreview: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "14px",
    padding: "14px",
    borderRadius: "12px",
    background: "#C9E4E5",
    color: "#123B4A",
  },

  slotLabel: {
    display: "block",
    color: "#087F8C",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "3px",
  },

  slotArrow: {
    width: "31px",
    height: "31px",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  secureRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    color: "#BDEBED",
    fontSize: "8px",
    marginTop: "18px",
  },

  secureCheck: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#239B68",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },


  /* FLOATING CARD */

  floatingCard: {
    position: "absolute",
    zIndex: 3,
    right: "0",
    bottom: "55px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 14px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "12px",
    boxShadow:
      "0 12px 30px rgba(18,59,74,0.15)",
  },

  floatingIcon: {
    width: "29px",
    height: "29px",
    borderRadius: "50%",
    background: "#239B68",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  floatingTitle: {
    color: "#123B4A",
    fontSize: "9px",
    fontWeight: "800",
  },

  floatingText: {
    color: "#789096",
    fontSize: "8px",
    marginTop: "2px",
  },


  /* =========================
     FEATURES
  ========================= */

  featuresSection: {
    width: "min(1180px, 90%)",
    margin: "0 auto",
    padding: "60px 0",
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: "32px",
  },

  sectionEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.6px",
  },

  sectionTitle: {
    color: "#123B4A",
    fontSize: "28px",
    margin: "7px 0",
    fontWeight: "800",
  },

  sectionSubtitle: {
    color: "#60777E",
    fontSize: "12px",
    margin: 0,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, 1fr)",
    gap: "18px",
  },

  featureCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "16px",
    padding: "25px",
    boxShadow:
      "0 8px 25px rgba(18,59,74,0.06)",
  },

  featureIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    marginBottom: "16px",
  },

  featureCardH3: {
    color: "#123B4A",
  },

  featureCardP: {
    color: "#60777E",
  },


  /* =========================
     CTA
  ========================= */

  cta: {
    width: "min(1120px, 86%)",
    margin: "15px auto 65px",
    padding: "35px",
    borderRadius: "19px",
    background:
      "linear-gradient(135deg,#123B4A,#087F8C)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
    boxShadow:
      "0 15px 35px rgba(8,127,140,0.18)",
  },

  ctaEyebrow: {
    color: "#7DE0DE",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  ctaTitle: {
    color: "#FFFFFF",
    fontSize: "26px",
    lineHeight: "1.2",
    margin: "7px 0 0",
  },

  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "25px",
    textDecoration: "none",
    background: "#C9E4E5",
    color: "#087F8C",
    padding: "13px 17px",
    borderRadius: "9px",
    fontSize: "11px",
    fontWeight: "800",
    whiteSpace: "nowrap",
  },


  /* =========================
     FOOTER
  ========================= */

  footer: {
    borderTop: "1px solid #0E5363",
    background: "#123B4A",
    padding: "21px 7%",
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

export default Home;
