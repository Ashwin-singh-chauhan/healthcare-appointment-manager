import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://healthcare-appointment-manager-nlir.onrender.com";

function DoctorLeaves() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingLeaves, setLoadingLeaves] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* =====================================================
     LOAD LEAVES
  ===================================================== */

  async function loadLeaves() {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      setLoadingLeaves(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/doctor/leaves`,
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

      setLeaves(data);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoadingLeaves(false);

    }
  }


  useEffect(() => {
    loadLeaves();
  }, []);


  /* =====================================================
     ADD LEAVE
  ===================================================== */

  async function addLeave(e) {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!leaveDate) {

      setError(
        "Please select a leave date."
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

      const response = await fetch(
        `${API_URL}/api/doctor/leaves`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            leaveDate: leaveDate,
            reason: reason,
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

      setMessage(
        "Leave added successfully."
      );

      setLeaveDate("");
      setReason("");

      await loadLeaves();

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }
  }


  /* =====================================================
     DELETE LEAVE
  ===================================================== */

  async function deleteLeave(id) {

    if (
      !window.confirm(
        "Are you sure you want to delete this leave?"
      )
    ) {
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/doctor/leaves/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {

        const data =
          await response.json();

        throw new Error(
          data?.message ||
          `Request failed: ${response.status}`
        );
      }

      setLeaves(
        leaves.filter(
          (leave) =>
            leave.id !== id
        )
      );

      setMessage(
        "Leave removed successfully."
      );

    } catch (err) {

      console.error(err);
      setError(err.message);

    }
  }


  /* =====================================================
     LOGOUT
  ===================================================== */

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }


  /* =====================================================
     FORMAT DATE
  ===================================================== */

  function formatDate(dateString) {

    if (!dateString) {
      return "";
    }

    const date =
      new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }


  /* =====================================================
     MAIN UI
  ===================================================== */

  return (

    <div style={styles.page}>


      {/* =================================================
          HEADER
      ================================================= */}

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


      {/* =================================================
          MAIN
      ================================================= */}

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
              Manage Leaves
            </h1>

            <p style={styles.subtitle}>
              Schedule unavailable dates so patients
              cannot book appointments during your leave.
            </p>

          </div>


          <div style={styles.leaveBadge}>

            <div style={styles.leaveBadgeIcon}>
              🏖️
            </div>

            <div>

              <div style={styles.leaveBadgeLabel}>
                SCHEDULED LEAVES
              </div>

              <div style={styles.leaveBadgeNumber}>
                {leaves.length}
              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            ALERTS
        ================================================= */}

        {message && (

          <div style={styles.success}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <div>

              <strong>
                Success
              </strong>

              <div style={styles.successText}>
                {message}
              </div>

            </div>

          </div>

        )}


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


        {/* =================================================
            CONTENT GRID
        ================================================= */}

        <section style={styles.layout}>


          {/* =================================================
              ADD LEAVE FORM
          ================================================= */}

          <form
            onSubmit={addLeave}
            style={styles.formCard}
          >

            <div style={styles.cardHeader}>

              <div>

                <div style={styles.cardEyebrow}>
                  TIME OFF
                </div>

                <h2 style={styles.cardTitle}>
                  Add Leave
                </h2>

              </div>

              <div style={styles.cardIcon}>
                📅
              </div>

            </div>


            <p style={styles.cardDescription}>
              Select a date when you will be unavailable
              for patient appointments.
            </p>


            {/* DATE */}

            <div style={styles.field}>

              <label style={styles.label}>
                Leave Date
              </label>

              <span style={styles.fieldHint}>
                Patients will not be able to book
                appointments on this date.
              </span>

              <input
                type="date"
                value={leaveDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) =>
                  setLeaveDate(
                    e.target.value
                  )
                }
                style={styles.input}
                required
              />

            </div>


            {/* REASON */}

            <div style={styles.field}>

              <label style={styles.label}>
                Reason
                <span style={styles.optional}>
                  OPTIONAL
                </span>
              </label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(
                    e.target.value
                  )
                }
                placeholder="e.g. Personal leave, conference, holiday..."
                style={styles.textarea}
              />

            </div>


            {/* INFO */}

            <div style={styles.infoBox}>

              <div style={styles.infoIcon}>
                ℹ
              </div>

              <div>
                <strong style={styles.infoTitle}>
                  Important
                </strong>

                <p style={styles.infoText}>
                  Adding a leave date makes you
                  unavailable for new bookings.
                </p>
              </div>

            </div>


            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.addButton,
                opacity: loading ? 0.65 : 1,
              }}
            >

              {loading ? (
                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>

                  Adding Leave...
                </>
              ) : (
                <>
                  Add Leave

                  <span style={styles.buttonArrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* =================================================
              LEAVE LIST
          ================================================= */}

          <div style={styles.listCard}>

            <div style={styles.listHeader}>

              <div>

                <div style={styles.cardEyebrow}>
                  YOUR SCHEDULE
                </div>

                <h2 style={styles.cardTitle}>
                  My Leaves
                </h2>

              </div>

              <div style={styles.countBadge}>
                {leaves.length}
              </div>

            </div>


            {/* LOADING */}

            {loadingLeaves ? (

              <div style={styles.loading}>

                <div style={styles.loadingIcon}>
                  ⟳
                </div>

                <h3 style={styles.loadingTitle}>
                  Loading your leaves
                </h3>

                <p style={styles.loadingText}>
                  Fetching your scheduled unavailable dates...
                </p>

              </div>

            ) : leaves.length === 0 ? (

              /* EMPTY */

              <div style={styles.empty}>

                <div style={styles.emptyIcon}>
                  📅
                </div>

                <h3 style={styles.emptyTitle}>
                  No leaves scheduled
                </h3>

                <p style={styles.emptyText}>
                  You currently have no leave dates.
                  Add a leave using the form.
                </p>

              </div>

            ) : (

              /* LEAVES */

              <div style={styles.leaveList}>

                {leaves.map((leave) => (

                  <div
                    key={leave.id}
                    style={styles.leave}
                  >

                    <div style={styles.dateIcon}>

                      <span style={styles.dateMonth}>
                        {leave.leaveDate
                          ? new Date(
                              `${leave.leaveDate}T00:00:00`
                            )
                              .toLocaleDateString(
                                "en-IN",
                                { month: "short" }
                              )
                              .toUpperCase()
                          : "---"}
                      </span>

                      <span style={styles.dateDay}>
                        {leave.leaveDate
                          ? new Date(
                              `${leave.leaveDate}T00:00:00`
                            ).getDate()
                          : "--"}
                      </span>

                    </div>


                    <div style={styles.leaveDetails}>

                      <h3 style={styles.leaveDate}>
                        {formatDate(
                          leave.leaveDate
                        )}
                      </h3>

                      <p style={styles.leaveReason}>
                        {leave.reason ||
                          "No reason provided"}
                      </p>

                    </div>


                    <button
                      onClick={() =>
                        deleteLeave(
                          leave.id
                        )
                      }
                      style={styles.deleteButton}
                    >
                      <span>
                        Delete
                      </span>

                      <span>
                        ×
                      </span>
                    </button>

                  </div>

                ))}

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            SECURITY BANNER
        ================================================= */}

        <div style={styles.securityBanner}>

          <div style={styles.securityIcon}>
            🔒
          </div>

          <div>

            <div style={styles.securityTitle}>
              Your schedule is protected
            </div>

            <div style={styles.securityText}>
              Only your authenticated doctor account
              can create or remove your leave dates.
            </div>

          </div>

          <div style={styles.securityBadge}>
            SECURE
          </div>

        </div>

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


  /* HEADER */

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


  /* MAIN */

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


  /* PAGE HEADER */

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

  leaveBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    padding: "11px 14px",
    borderRadius: "13px",
    minWidth: "125px",
  },

  leaveBadgeIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  leaveBadgeLabel: {
    color: "#789096",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  leaveBadgeNumber: {
    color: "#087F8C",
    fontSize: "20px",
    fontWeight: "800",
    marginTop: "2px",
  },


  /* ALERTS */

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


  /* CONTENT */

  layout: {
    display: "grid",
    gridTemplateColumns:
      "minmax(340px, 0.85fr) minmax(420px, 1.15fr)",
    gap: "20px",
    alignItems: "start",
  },


  /* FORM */

  formCard: {
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
    marginBottom: "17px",
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

  cardIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  cardDescription: {
    color: "#60777E",
    fontSize: "11px",
    lineHeight: "1.6",
    margin: "0 0 20px",
  },


  /* FIELDS */

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

  optional: {
    color: "#8AA1A5",
    fontSize: "7px",
    marginLeft: "7px",
    letterSpacing: "0.8px",
    fontWeight: "800",
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

  textarea: {
    width: "100%",
    minHeight: "105px",
    boxSizing: "border-box",
    padding: "12px 13px",
    border: "1px solid #8DBFC2",
    borderRadius: "9px",
    background: "#D8EBEC",
    color: "#123B4A",
    fontSize: "12px",
    outline: "none",
    resize: "vertical",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
  },


  /* INFO */

  infoBox: {
    display: "flex",
    gap: "10px",
    padding: "12px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "10px",
    marginBottom: "18px",
  },

  infoIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  infoTitle: {
    color: "#123B4A",
    fontSize: "10px",
  },

  infoText: {
    color: "#60777E",
    fontSize: "9px",
    lineHeight: "1.5",
    margin: "3px 0 0",
  },


  /* ADD BUTTON */

  addButton: {
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


  /* LEAVE LIST */

  listCard: {
    background: "#EAF7F6",
    padding: "28px",
    borderRadius: "17px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 10px 30px rgba(18,59,74,0.08)",
  },

  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "18px",
    marginBottom: "5px",
    borderBottom: "1px solid #C2DDDE",
  },

  countBadge: {
    minWidth: "32px",
    height: "32px",
    padding: "0 7px",
    borderRadius: "50%",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
  },

  leaveList: {
    marginTop: "12px",
  },

  leave: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    padding: "14px",
    border: "1px solid #B7D6D8",
    background: "#DCEFF0",
    borderRadius: "12px",
    marginTop: "12px",
  },

  dateIcon: {
    width: "48px",
    height: "52px",
    borderRadius: "10px",
    background: "#123B4A",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  dateMonth: {
    fontSize: "7px",
    fontWeight: "800",
    color: "#8FD5D7",
    letterSpacing: "0.7px",
  },

  dateDay: {
    fontSize: "18px",
    fontWeight: "800",
    lineHeight: "20px",
  },

  leaveDetails: {
    flex: 1,
    minWidth: 0,
  },

  leaveDate: {
    color: "#123B4A",
    fontSize: "13px",
    margin: 0,
    fontWeight: "750",
  },

  leaveReason: {
    color: "#60777E",
    fontSize: "10px",
    margin: "4px 0 0",
    lineHeight: "1.4",
    wordBreak: "break-word",
  },

  deleteButton: {
    padding: "8px 10px",
    border: "1px solid #C78B91",
    borderRadius: "8px",
    background: "#F1D9DC",
    color: "#963F49",
    cursor: "pointer",
    fontSize: "9px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    flexShrink: 0,
  },


  /* LOADING */

  loading: {
    textAlign: "center",
    padding: "55px 20px",
  },

  loadingIcon: {
    color: "#087F8C",
    fontSize: "30px",
    marginBottom: "10px",
  },

  loadingTitle: {
    color: "#123B4A",
    fontSize: "15px",
    margin: 0,
  },

  loadingText: {
    color: "#789096",
    fontSize: "10px",
  },


  /* EMPTY */

  empty: {
    textAlign: "center",
    padding: "55px 20px",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 15px",
    borderRadius: "18px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },

  emptyTitle: {
    color: "#123B4A",
    fontSize: "16px",
    margin: 0,
  },

  emptyText: {
    color: "#789096",
    fontSize: "10px",
    marginTop: "6px",
  },


  /* SECURITY */

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


  /* FOOTER */

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

export default DoctorLeaves;
