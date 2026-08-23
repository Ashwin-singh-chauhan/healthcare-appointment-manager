import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response)
      );


      /* =========================
         ROLE BASED REDIRECT
      ========================= */

      if (response.role === "ADMIN") {

        navigate("/admin");

      } else if (response.role === "DOCTOR") {

        navigate("/doctor");

      } else {

        navigate("/dashboard");

      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }


  return (

    <div style={styles.page}>

      {/* =========================
          LEFT BRAND PANEL
      ========================= */}

      <div style={styles.leftPanel}>

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
              SMART HEALTHCARE PLATFORM
            </div>

          </div>

        </div>


        <div style={styles.leftContent}>

          <div style={styles.eyebrow}>
            SECURE HEALTHCARE ACCESS
          </div>

          <h1 style={styles.leftTitle}>
            Your health.
            <br />
            <span style={styles.leftAccent}>
              Your care.
            </span>
          </h1>

          <p style={styles.leftText}>
            Access your healthcare appointments,
            connect with trusted doctors and manage
            your care securely from one place.
          </p>


          <div style={styles.features}>

            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                ✓
              </div>

              <div>

                <strong style={styles.featureTitle}>
                  Secure Access
                </strong>

                <span style={styles.featureText}>
                  Protected account authentication
                </span>

              </div>

            </div>


            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                ✓
              </div>

              <div>

                <strong style={styles.featureTitle}>
                  Easy Appointments
                </strong>

                <span style={styles.featureText}>
                  Book appointments in a few clicks
                </span>

              </div>

            </div>


            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                ✓
              </div>

              <div>

                <strong style={styles.featureTitle}>
                  Trusted Healthcare
                </strong>

                <span style={styles.featureText}>
                  Connect with verified doctors
                </span>

              </div>

            </div>

          </div>

        </div>


        <div style={styles.leftFooter}>
          🔒 Your information is protected
        </div>

      </div>


      {/* =========================
          RIGHT LOGIN PANEL
      ========================= */}

      <div style={styles.rightPanel}>

        <div style={styles.card}>

          {/* CARD HEADER */}

          <div style={styles.cardHeader}>

            <div style={styles.loginIcon}>
              🔐
            </div>

            <div>

              <div style={styles.cardEyebrow}>
                ACCOUNT ACCESS
              </div>

              <h2 style={styles.title}>
                Welcome back
              </h2>

            </div>

          </div>


          <p style={styles.subtitle}>
            Sign in to continue to your
            healthcare portal.
          </p>


          {/* ERROR */}

          {error && (

            <div style={styles.error}>

              <div style={styles.errorIcon}>
                !
              </div>

              <div>

                <strong>
                  Login failed
                </strong>

                <div style={styles.errorText}>
                  {error}
                </div>

              </div>

            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div style={styles.field}>

              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  required
                  style={styles.input}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div style={styles.field}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >

              {loading ? (
                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>

                  Signing in...
                </>
              ) : (
                <>
                  Sign In

                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div style={styles.register}>

            <span>
              Don't have an account?
            </span>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create an account
            </Link>

          </div>


          {/* SECURITY */}

          <div style={styles.security}>

            <span style={styles.securityIcon}>
              🔒
            </span>

            <span>
              Secure and encrypted authentication
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 0.9fr",
    background: "#DCEFF0",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  /* =========================
     LEFT PANEL
  ========================= */

  leftPanel: {
    position: "relative",
    minHeight: "100vh",
    boxSizing: "border-box",
    padding: "45px 8%",
    background:
      "linear-gradient(145deg,#123B4A,#087F8C)",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
  },

  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    position: "relative",
    zIndex: 2,
  },

  logo: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background: "#12A8A8",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "800",
    boxShadow:
      "0 5px 16px rgba(18,168,168,0.35)",
  },

  brand: {
    color: "#F4FFFF",
    fontSize: "22px",
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


  /* LEFT CONTENT */

  leftContent: {
    maxWidth: "570px",
    position: "relative",
    zIndex: 2,
  },

  eyebrow: {
    color: "#7DE0DE",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.7px",
    marginBottom: "14px",
  },

  leftTitle: {
    color: "#FFFFFF",
    fontSize: "52px",
    lineHeight: "1.04",
    fontWeight: "800",
    letterSpacing: "-2px",
    margin: 0,
  },

  leftAccent: {
    color: "#72DAD8",
  },

  leftText: {
    color: "#D5F3F3",
    fontSize: "14px",
    lineHeight: "1.7",
    maxWidth: "500px",
    marginTop: "20px",
  },


  /* FEATURES */

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "30px",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  featureIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.15)",
    color: "#72E1B0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "900",
  },

  featureTitle: {
    display: "block",
    color: "#FFFFFF",
    fontSize: "11px",
    fontWeight: "800",
  },

  featureText: {
    display: "block",
    color: "#A8DCDD",
    fontSize: "9px",
    marginTop: "3px",
  },


  leftFooter: {
    position: "relative",
    zIndex: 2,
    color: "#9ED0D2",
    fontSize: "9px",
    letterSpacing: "0.3px",
  },


  /* =========================
     RIGHT PANEL
  ========================= */

  rightPanel: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 7%",
    boxSizing: "border-box",
    background: "#DCEFF0",
  },


  /* CARD */

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#EAF7F6",
    border:
      "1px solid #A8D2D4",
    borderRadius: "20px",
    padding: "34px",
    boxSizing: "border-box",
    boxShadow:
      "0 18px 45px rgba(18,59,74,0.12)",
  },


  /* CARD HEADER */

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "10px",
  },

  loginIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },

  cardEyebrow: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.5px",
  },

  title: {
    color: "#123B4A",
    fontSize: "28px",
    fontWeight: "800",
    margin: "4px 0 0",
    letterSpacing: "-0.6px",
  },

  subtitle: {
    color: "#60777E",
    fontSize: "12px",
    lineHeight: "1.5",
    marginBottom: "25px",
  },


  /* =========================
     ERROR
  ========================= */

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#F7DCDC",
    color: "#8E3838",
    border:
      "1px solid #E6B5B5",
    padding: "12px",
    borderRadius: "9px",
    marginBottom: "18px",
    fontSize: "10px",
  },

  errorIcon: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    background: "#C94C4C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  errorText: {
    marginTop: "2px",
    fontSize: "9px",
  },


  /* =========================
     FORM
  ========================= */

  field: {
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#244C58",
    fontSize: "11px",
    fontWeight: "800",
    marginBottom: "7px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#D8EBEC",
    border:
      "1px solid #8DBFC2",
    borderRadius: "9px",
    padding: "0 12px",
    transition: "border 0.2s ease",
  },

  inputIcon: {
    color: "#087F8C",
    fontSize: "14px",
    width: "23px",
    flexShrink: 0,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 7px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "12px",
  },


  /* =========================
     BUTTON
  ========================= */

  button: {
    width: "100%",
    marginTop: "5px",
    padding: "13px",
    border: "none",
    borderRadius: "9px",
    background:
      "linear-gradient(135deg,#087F8C,#12A8A8)",
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    boxShadow:
      "0 7px 18px rgba(8,127,140,0.22)",
  },

  spinner: {
    fontSize: "16px",
  },

  arrow: {
    fontSize: "17px",
  },


  /* =========================
     REGISTER
  ========================= */

  register: {
    display: "flex",
    justifyContent: "center",
    gap: "5px",
    marginTop: "22px",
    color: "#71878C",
    fontSize: "10px",
  },

  registerLink: {
    color: "#087F8C",
    fontWeight: "800",
    textDecoration: "none",
  },


  /* =========================
     SECURITY
  ========================= */

  security: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    marginTop: "22px",
    paddingTop: "17px",
    borderTop:
      "1px solid #C2DDDE",
    color: "#789096",
    fontSize: "8px",
  },

  securityIcon: {
    fontSize: "10px",
  },

};

export default Login;
