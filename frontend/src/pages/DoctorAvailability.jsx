import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://healthcare-appointment-manager-nlir.onrender.com";


function DoctorAvailability() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [doctorId, setDoctorId] = useState(null);

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctor, setLoadingDoctor] = useState(true);


  /* =========================
     LOAD LOGGED-IN DOCTOR
  ========================= */

  useEffect(() => {

    async function loadDoctor() {

      const token =
        localStorage.getItem("token");

      if (!token || !user) {
        navigate("/login");
        return;
      }

      try {

        setLoadingDoctor(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/doctors/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {

          throw new Error(
            data?.message ||
            `Failed to load doctor: ${response.status}`
          );

        }

        console.log(
          "Logged-in doctor:",
          data
        );

        setDoctorId(data.id);

      } catch (err) {

        console.error(
          "Failed to load doctor:",
          err
        );

        setError(
          "Could not load doctor information. " +
          "Please make sure your doctor account exists."
        );

      } finally {

        setLoadingDoctor(false);

      }

    }

    loadDoctor();

  }, [navigate]);


  /* =========================
     SAVE AVAILABILITY
  ========================= */

  async function saveAvailability(e) {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!user) {

      setError(
        "Doctor information not found. Please login again."
      );

      return;

    }

    if (!doctorId) {

      setError(
        "Doctor ID not found. Please login again."
      );

      return;

    }

    if (startTime >= endTime) {

      setError(
        "End time must be after start time."
      );

      return;

    }

    const token =
      localStorage.getItem("token");

    if (!token) {

      navigate("/login");
      return;

    }

    setLoading(true);

    try {

      /* =========================
         DATE → DAY OF WEEK
      ========================= */

      const selectedDate =
        new Date(date + "T00:00:00");

      const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY"
      ];

      const dayOfWeek =
        days[selectedDate.getDay()];


      /* =========================
         SEND AVAILABILITY
      ========================= */

      const response = await fetch(
        `${API_URL}/api/availability/my`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            doctorId: doctorId,

            dayOfWeek: dayOfWeek,

            startTime: startTime,

            endTime: endTime,

            slotDurationMinutes: 30,

          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data?.message ||
          `Request failed: ${response.status}`
        );

      }

      console.log(
        "Availability response:",
        data
      );

      setMessage(
        `Availability saved for ${dayOfWeek}.`
      );

    } catch (err) {

      console.error(
        "Save availability failed:",
        err
      );

      setError(
        err.message ||
        "Failed to save availability."
      );

    } finally {

      setLoading(false);

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
     LOADING
  ========================= */

  if (loadingDoctor) {

    return (

      <div style={styles.page}>

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

        </header>


        <main style={styles.loadingPage}>

          <div style={styles.loadingCard}>

            <div style={styles.loadingIcon}>
              ⟳
            </div>

            <h2 style={styles.loadingTitle}>
              Loading your profile
            </h2>

            <p style={styles.loadingText}>
              Connecting to your doctor account...
            </p>

          </div>

        </main>

      </div>

    );

  }


  /* =========================
     UI
  ========================= */

  return (

    <div style={styles.page}>


      {/* =====================================================
          HEADER
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
              Manage Availability
            </h1>

            <p style={styles.subtitle}>
              Set your working hours and generate
              appointment slots for your patients.
            </p>

          </div>


          <div style={styles.doctorBadge}>

            <div style={styles.doctorBadgeIcon}>
              👨‍⚕️
            </div>

            <div>

              <div style={styles.doctorBadgeLabel}>
                DOCTOR ID
              </div>

              <div style={styles.doctorBadgeId}>
                #{doctorId || "---"}
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            SUCCESS
        ===================================================== */}

        {message && (

          <div style={styles.success}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <div>

              <strong>
                Availability saved
              </strong>

              <div style={styles.successText}>
                {message}
              </div>

            </div>

          </div>

        )}


        {/* =====================================================
            ERROR
        ===================================================== */}

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


        {/* =====================================================
            FORM
        ===================================================== */}

        <section style={styles.layout}>


          {/* LEFT INFO */}

          <div style={styles.infoPanel}>

            <div style={styles.infoIcon}>
              🩺
            </div>

            <h2 style={styles.infoTitle}>
              Your availability
            </h2>

            <p style={styles.infoText}>
              Set the hours during which patients
              can book appointments with you.
            </p>


            <div style={styles.infoDivider}></div>


            <div style={styles.infoRow}>

              <span style={styles.infoRowIcon}>
                ⏱
              </span>

              <div>

                <strong>
                  30 minute slots
                </strong>

                <p>
                  Appointments are automatically
                  divided into 30-minute slots.
                </p>

              </div>

            </div>


            <div style={styles.infoRow}>

              <span style={styles.infoRowIcon}>
                📅
              </span>

              <div>

                <strong>
                  Weekly schedule
                </strong>

                <p>
                  Your selected date determines
                  the working day.
                </p>

              </div>

            </div>


            <div style={styles.infoRow}>

              <span style={styles.infoRowIcon}>
                🔒
              </span>

              <div>

                <strong>
                  Secure access
                </strong>

                <p>
                  Only your authenticated doctor
                  account can manage availability.
                </p>

              </div>

            </div>

          </div>


          {/* FORM CARD */}

          <form
            onSubmit={saveAvailability}
            style={styles.card}
          >

            <div style={styles.cardHeader}>

              <div>

                <div style={styles.cardEyebrow}>
                  WORKING HOURS
                </div>

                <h2 style={styles.cardTitle}>
                  Set your schedule
                </h2>

              </div>

              <div style={styles.calendarSmall}>
                📅
              </div>

            </div>


            {/* DATE */}

            <div style={styles.field}>

              <label style={styles.label}>
                Select Date
              </label>

              <span style={styles.fieldHint}>
                Choose the day you want to configure.
              </span>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                style={styles.input}
                required
              />

            </div>


            {/* TIMES */}

            <div style={styles.timeGrid}>

              <div style={styles.field}>

                <label style={styles.label}>
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) =>
                    setStartTime(e.target.value)
                  }
                  style={styles.input}
                  required
                />

              </div>


              <div style={styles.field}>

                <label style={styles.label}>
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) =>
                    setEndTime(e.target.value)
                  }
                  style={styles.input}
                  required
                />

              </div>

            </div>


            {/* PREVIEW */}

            <div style={styles.preview}>

              <div style={styles.previewIcon}>
                🕐
              </div>

              <div>

                <div style={styles.previewLabel}>
                  SCHEDULE PREVIEW
                </div>

                <div style={styles.previewText}>

                  {startTime} — {endTime}

                  <span style={styles.previewSeparator}>
                    •
                  </span>

                  30 min slots

                </div>

              </div>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={
                loading ||
                !doctorId
              }
              style={{
                ...styles.saveButton,
                opacity:
                  loading || !doctorId
                    ? 0.6
                    : 1,
              }}
            >

              {loading ? (

                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>

                  Saving availability...

                </>

              ) : (

                <>
                  Save Availability
                  <span style={styles.buttonArrow}>
                    →
                  </span>
                </>

              )}

            </button>


          </form>

        </section>

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
     LOADING
  ========================= */

  loadingPage: {
    minHeight: "calc(100vh - 76px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  loadingCard: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "17px",
    padding: "45px",
    textAlign: "center",
    boxShadow:
      "0 12px 35px rgba(18,59,74,0.08)",
  },

  loadingIcon: {
    color: "#087F8C",
    fontSize: "30px",
    marginBottom: "10px",
  },

  loadingTitle: {
    color: "#123B4A",
    margin: 0,
    fontSize: "18px",
  },

  loadingText: {
    color: "#60777E",
    fontSize: "12px",
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

  doctorBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    padding: "11px 14px",
    borderRadius: "13px",
  },

  doctorBadgeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  doctorBadgeLabel: {
    color: "#789096",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  doctorBadgeId: {
    color: "#087F8C",
    fontSize: "15px",
    fontWeight: "800",
    marginTop: "2px",
  },


  /* =========================
     ALERTS
  ========================= */

  success: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#CBEBDD",
    color: "#126442",
    border: "1px solid #9DD3B7",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "12px",
  },

  successIcon: {
    width: "27px",
    height: "27px",
    borderRadius: "50%",
    background: "#239B68",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "900",
  },

  successText: {
    fontSize: "10px",
    marginTop: "2px",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "#F7DCDC",
    color: "#8E3838",
    border: "1px solid #E6B5B5",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "12px",
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
  },

  errorText: {
    fontSize: "10px",
    marginTop: "2px",
  },


  /* =========================
     CONTENT LAYOUT
  ========================= */

  layout: {
    display: "grid",
    gridTemplateColumns:
      "minmax(260px, 0.75fr) minmax(420px, 1.25fr)",
    gap: "20px",
    alignItems: "start",
  },


  /* =========================
     INFO PANEL
  ========================= */

  infoPanel: {
    background:
      "linear-gradient(145deg,#123B4A,#087F8C)",
    borderRadius: "17px",
    padding: "27px",
    color: "#FFFFFF",
    boxShadow:
      "0 12px 30px rgba(8,127,140,0.20)",
  },

  infoIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "rgba(255,255,255,0.13)",
    border: "1px solid rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    marginBottom: "17px",
  },

  infoTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "750",
  },

  infoText: {
    color: "#D4F4F4",
    fontSize: "12px",
    lineHeight: "1.6",
    marginTop: "8px",
  },

  infoDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.16)",
    margin: "22px 0",
  },

  infoRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "19px",
  },

  infoRowIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoRow strong: {
    fontSize: "11px",
  },

  infoRowText: {
    color: "#BDEBED",
    fontSize: "9px",
    lineHeight: "1.5",
    margin: "3px 0 0",
  },


  /* =========================
     FORM CARD
  ========================= */

  card: {
    background: "#EAF7F6",
    padding: "28px",
    borderRadius: "17px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 10px 30px rgba(18,59,74,0.08)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "18px",
    marginBottom: "19px",
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
    fontSize: "20px",
    margin: "4px 0 0",
    fontWeight: "750",
  },

  calendarSmall: {
    width: "39px",
    height: "39px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },


  /* =========================
     FORM FIELDS
  ========================= */

  field: {
    marginBottom: "19px",
  },

  label: {
    display: "block",
    color: "#244C58",
    fontWeight: "750",
    fontSize: "12px",
    marginBottom: "5px",
  },

  fieldHint: {
    display: "block",
    color: "#789096",
    fontSize: "9px",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #8DBFC2",
    borderRadius: "9px",
    background: "#D8EBEC",
    color: "#123B4A",
    fontSize: "13px",
    outline: "none",
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "13px",
  },


  /* =========================
     PREVIEW
  ========================= */

  preview: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "10px",
    marginTop: "2px",
    marginBottom: "18px",
  },

  previewIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  previewLabel: {
    color: "#789096",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  previewText: {
    color: "#123B4A",
    fontSize: "12px",
    fontWeight: "750",
    marginTop: "2px",
  },

  previewSeparator: {
    color: "#087F8C",
    margin: "0 6px",
  },


  /* =========================
     BUTTON
  ========================= */

  saveButton: {
    width: "100%",
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
    gap: "10px",
    boxShadow:
      "0 7px 17px rgba(8,127,140,0.22)",
  },

  spinner: {
    fontSize: "16px",
  },

  buttonArrow: {
    fontSize: "17px",
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

export default DoctorAvailability;
