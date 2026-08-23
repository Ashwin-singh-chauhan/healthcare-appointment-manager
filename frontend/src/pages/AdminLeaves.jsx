import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDoctors,
  getDoctorLeaves,
  createDoctorLeave,
  deleteDoctorLeave,
} from "../api";

function AdminLeaves() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");


  /* =========================
     LOAD DOCTORS
  ========================= */

  useEffect(() => {
    loadDoctors();
  }, []);


  async function loadDoctors() {

    try {

      setLoading(true);
      setError("");

      const data = await getDoctors();

      setDoctors(data);

      if (data.length > 0) {
        setSelectedDoctor(String(data[0].id));
      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================
     LOAD LEAVES
  ========================= */

  useEffect(() => {

    if (selectedDoctor) {
      loadLeaves(selectedDoctor);
    }

  }, [selectedDoctor]);


  async function loadLeaves(doctorId) {

    try {

      setLoadingLeaves(true);
      setError("");

      const data = await getDoctorLeaves(
        doctorId,
        token
      );

      setLeaves(data);

    } catch (err) {

      setError(err.message);

    } finally {

      setLoadingLeaves(false);

    }
  }


  /* =========================
     ADD LEAVE
  ========================= */

  async function handleAddLeave(e) {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedDoctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!leaveDate) {
      setError("Please select a leave date.");
      return;
    }

    try {

      setSaving(true);

      await createDoctorLeave(
        {
          doctorId: Number(selectedDoctor),
          leaveDate: leaveDate,
          reason: reason,
        },
        token
      );

      setSuccess(
        "Doctor leave added successfully."
      );

      setLeaveDate("");
      setReason("");

      await loadLeaves(selectedDoctor);

    } catch (err) {

      setError(err.message);

    } finally {

      setSaving(false);

    }
  }


  /* =========================
     DELETE LEAVE
  ========================= */

  async function handleDeleteLeave(id) {

    const confirmed = window.confirm(
      "Are you sure you want to remove this leave?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setSuccess("");

      await deleteDoctorLeave(
        id,
        token
      );

      setSuccess(
        "Leave removed successfully."
      );

      await loadLeaves(selectedDoctor);

    } catch (err) {

      setError(err.message);

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


  const selectedDoctorObject =
    doctors.find(
      (doctor) =>
        String(doctor.id) ===
        String(selectedDoctor)
    );


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
              <span style={styles.brandAccent}>
                +
              </span>
            </h2>

            <div style={styles.adminLabel}>
              ADMIN PORTAL
            </div>

          </div>

        </div>


        <div style={styles.navRight}>

          <div style={styles.systemStatus}>

            <span style={styles.greenDot}></span>

            System Active

          </div>


          <button
            onClick={() =>
              navigate("/admin")
            }
            style={styles.backButton}
          >
            ← Back to Admin
          </button>


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

        {/* HEADER */}

        <div style={styles.pageHeader}>

          <div>

            <div style={styles.eyebrow}>
              STAFF MANAGEMENT
            </div>

            <h1 style={styles.title}>
              Doctor Leaves
            </h1>

            <p style={styles.subtitle}>
              Manage doctor leave dates and keep
              appointment schedules up to date.
            </p>

          </div>


          <div style={styles.headerBadge}>

            <div style={styles.badgeIcon}>
              🏖️
            </div>

            <div>

              <div style={styles.badgeLabel}>
                LEAVE MANAGEMENT
              </div>

              <div style={styles.badgeText}>
                Schedule & availability
              </div>

            </div>

          </div>

        </div>


        {/* =========================
            ALERTS
        ========================= */}

        {error && (

          <div style={styles.error}>

            <div style={styles.errorIcon}>
              !
            </div>

            <div>

              <strong>
                Action failed
              </strong>

              <div style={styles.alertText}>
                {error}
              </div>

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
                Success
              </strong>

              <div style={styles.alertText}>
                {success}
              </div>

            </div>

          </div>

        )}


        {/* =========================
            ADD LEAVE
        ========================= */}

        <div style={styles.mainCard}>

          <div style={styles.cardHeader}>

            <div style={styles.cardIcon}>
              📅
            </div>

            <div>

              <div style={styles.cardEyebrow}>
                SCHEDULE MANAGEMENT
              </div>

              <h2 style={styles.cardTitle}>
                Add Doctor Leave
              </h2>

              <p style={styles.cardSubtitle}>
                Mark a date when a doctor will be unavailable.
              </p>

            </div>

          </div>


          <form onSubmit={handleAddLeave}>

            <div style={styles.formGrid}>

              {/* DOCTOR */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Select Doctor
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    👨‍⚕️
                  </span>

                  <select
                    value={selectedDoctor}
                    onChange={(e) =>
                      setSelectedDoctor(
                        e.target.value
                      )
                    }
                    style={styles.select}
                    disabled={loading}
                  >

                    {doctors.map((doctor) => (

                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        Dr. {doctor.name}
                      </option>

                    ))}

                  </select>

                </div>

                {selectedDoctorObject && (

                  <div style={styles.selectedDoctor}>

                    <span style={styles.selectedDot}></span>

                    {selectedDoctorObject.specialization}

                  </div>

                )}

              </div>


              {/* DATE */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Leave Date
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    📅
                  </span>

                  <input
                    type="date"
                    value={leaveDate}
                    onChange={(e) =>
                      setLeaveDate(
                        e.target.value
                      )
                    }
                    style={styles.input}
                    required
                  />

                </div>

                <div style={styles.helper}>
                  Select the date the doctor will be unavailable.
                </div>

              </div>

            </div>


            {/* REASON */}

            <div style={styles.field}>

              <label style={styles.label}>
                Reason
                <span style={styles.optional}>
                  Optional
                </span>
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  📝
                </span>

                <input
                  type="text"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Personal leave, conference, medical leave"
                  style={styles.input}
                />

              </div>

            </div>


            <div style={styles.formFooter}>

              <div style={styles.formInfo}>

                <span style={styles.infoIcon}>
                  ℹ
                </span>

                <span>
                  Existing appointments may be affected by this leave.
                </span>

              </div>


              <button
                type="submit"
                disabled={
                  saving ||
                  !selectedDoctor
                }
                style={{
                  ...styles.addButton,
                  opacity:
                    saving ||
                    !selectedDoctor
                      ? 0.6
                      : 1,
                }}
              >

                {saving
                  ? "Adding..."
                  : "+ Add Leave"}

              </button>

            </div>

          </form>

        </div>


        {/* =========================
            EXISTING LEAVES
        ========================= */}

        <div style={styles.listSection}>

          <div style={styles.listHeader}>

            <div>

              <div style={styles.listEyebrow}>
                CURRENT SCHEDULE
              </div>

              <h2 style={styles.listTitle}>
                Existing Leaves
              </h2>

            </div>


            {selectedDoctorObject && (

              <div style={styles.doctorBadge}>

                <div style={styles.smallAvatar}>
                  {selectedDoctorObject.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>

                  <div style={styles.doctorBadgeLabel}>
                    SELECTED DOCTOR
                  </div>

                  <div style={styles.doctorBadgeName}>
                    Dr. {selectedDoctorObject.name}
                  </div>

                </div>

              </div>

            )}

          </div>


          {loadingLeaves ? (

            <div style={styles.loading}>

              <div style={styles.spinner}></div>

              <h3 style={styles.loadingTitle}>
                Loading leave records
              </h3>

              <p style={styles.loadingText}>
                Fetching the latest schedule...
              </p>

            </div>

          ) : leaves.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                ✓
              </div>

              <h3 style={styles.emptyTitle}>
                No leave dates
              </h3>

              <p style={styles.emptyText}>
                This doctor currently has no
                scheduled leave dates.
              </p>

            </div>

          ) : (

            <div style={styles.leaveList}>

              {leaves.map((leave) => (

                <div
                  key={leave.id}
                  style={styles.leaveCard}
                >

                  <div style={styles.leaveLeft}>

                    <div style={styles.calendarIcon}>
                      📅
                    </div>

                    <div>

                      <div style={styles.leaveDateLabel}>
                        LEAVE DATE
                      </div>

                      <div style={styles.date}>
                        {leave.leaveDate}
                      </div>

                      <div style={styles.reason}>

                        {leave.reason
                          ? leave.reason
                          : "No reason provided"}

                      </div>

                    </div>

                  </div>


                  <div style={styles.leaveRight}>

                    <span style={styles.leaveStatus}>
                      UNAVAILABLE
                    </span>

                    <button
                      onClick={() =>
                        handleDeleteLeave(
                          leave.id
                        )
                      }
                      style={styles.deleteButton}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}


/* =========================
   STYLES
========================= */

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
    gap: "10px",
  },

  systemStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#BDEBED",
    fontSize: "11px",
    fontWeight: "650",
    padding: "8px 12px",
    background: "#1A4B5B",
    border:
      "1px solid #387080",
    borderRadius: "20px",
  },

  greenDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#55D69A",
    boxShadow:
      "0 0 8px rgba(85,214,154,0.8)",
  },

  backButton: {
    border: "1px solid #387080",
    background: "#1A4B5B",
    color: "#E8FAFA",
    padding: "10px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
  },

  logout: {
    border: "1px solid #B84A4A",
    background: "#C94C4C",
    color: "#FFFFFF",
    padding: "10px 16px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "700",
  },


  /* =========================
     MAIN
  ========================= */

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "45px 30px 70px",
  },

  pageHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "25px",
    marginBottom: "28px",
  },

  eyebrow: {
    color: "#087F8C",
    fontSize: "10px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    color: "#123B4A",
    fontSize: "37px",
    lineHeight: "1.15",
    fontWeight: "750",
    letterSpacing: "-0.8px",
  },

  subtitle: {
    color: "#557078",
    fontSize: "15px",
    marginTop: "9px",
    marginBottom: 0,
    lineHeight: "1.6",
  },

  headerBadge: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    padding: "13px 16px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "13px",
    flexShrink: 0,
  },

  badgeIcon: {
    width: "39px",
    height: "39px",
    borderRadius: "10px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  badgeLabel: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  badgeText: {
    marginTop: "3px",
    color: "#4C6870",
    fontSize: "11px",
  },


  /* =========================
     ALERTS
  ========================= */

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    background: "#F7DCDC",
    color: "#8E3838",
    padding: "13px 16px",
    borderRadius: "11px",
    border: "1px solid #E6B5B5",
    marginBottom: "18px",
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
    fontWeight: "800",
    flexShrink: 0,
  },

  success: {
    display: "flex",
    alignItems: "flex-start",
    gap: "11px",
    background: "#CBEBDD",
    color: "#126442",
    padding: "13px 16px",
    borderRadius: "11px",
    border: "1px solid #9DD3B7",
    marginBottom: "18px",
  },

  successIcon: {
    width: "23px",
    height: "23px",
    borderRadius: "50%",
    background: "#16805C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    flexShrink: 0,
  },

  alertText: {
    marginTop: "3px",
    fontSize: "12px",
  },


  /* =========================
     MAIN CARD
  ========================= */

  mainCard: {
    background: "#EAF7F6",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 8px 24px rgba(18,59,74,0.08)",
    marginBottom: "42px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "25px",
  },

  cardIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "13px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.2)",
  },

  cardEyebrow: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  cardTitle: {
    margin: "3px 0 0",
    color: "#123B4A",
    fontSize: "21px",
    fontWeight: "750",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#60777E",
    fontSize: "12px",
  },


  /* =========================
     FORM
  ========================= */

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "19px",
  },

  label: {
    color: "#244C58",
    fontSize: "12px",
    fontWeight: "750",
    marginBottom: "7px",
  },

  optional: {
    marginLeft: "7px",
    color: "#7B9398",
    fontSize: "9px",
    fontWeight: "500",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#C9E4E5",
    border: "1px solid #8DBFC2",
    borderRadius: "10px",
    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "12px",
    fontSize: "15px",
    flexShrink: 0,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 12px 12px 9px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "13px",
  },

  select: {
    width: "100%",
    padding: "12px 12px 12px 9px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "13px",
    cursor: "pointer",
  },

  helper: {
    marginTop: "6px",
    color: "#71888D",
    fontSize: "10px",
  },

  selectedDoctor: {
    marginTop: "7px",
    color: "#087F8C",
    fontSize: "10px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },

  selectedDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#16805C",
  },

  formFooter: {
    borderTop: "1px solid #C2DDDE",
    paddingTop: "18px",
    marginTop: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
  },

  formInfo: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#687F85",
    fontSize: "10px",
  },

  infoIcon: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  addButton: {
    border: "none",
    background: "#087F8C",
    color: "#FFFFFF",
    padding: "11px 19px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "750",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.22)",
    flexShrink: 0,
  },


  /* =========================
     EXISTING LEAVES
  ========================= */

  listSection: {
    marginTop: "5px",
  },

  listHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: "18px",
  },

  listEyebrow: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.5px",
    marginBottom: "4px",
  },

  listTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "25px",
    fontWeight: "750",
  },

  doctorBadge: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "8px 12px",
    borderRadius: "11px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
  },

  smallAvatar: {
    width: "31px",
    height: "31px",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "12px",
  },

  doctorBadgeLabel: {
    color: "#087F8C",
    fontSize: "7px",
    fontWeight: "800",
    letterSpacing: "0.8px",
  },

  doctorBadgeName: {
    marginTop: "2px",
    color: "#244C58",
    fontSize: "11px",
    fontWeight: "700",
  },


  /* =========================
     LEAVE LIST
  ========================= */

  leaveList: {
    display: "flex",
    flexDirection: "column",
    gap: "11px",
  },

  leaveCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    padding: "17px 19px",
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "13px",
    boxShadow:
      "0 5px 15px rgba(18,59,74,0.06)",
  },

  leaveLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  calendarIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#C9E4E5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },

  leaveDateLabel: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  date: {
    marginTop: "2px",
    color: "#123B4A",
    fontSize: "16px",
    fontWeight: "750",
  },

  reason: {
    marginTop: "3px",
    color: "#647B82",
    fontSize: "11px",
  },

  leaveRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  leaveStatus: {
    padding: "6px 9px",
    borderRadius: "20px",
    background: "#F7DCDC",
    border: "1px solid #E5B6B6",
    color: "#963D3D",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.6px",
  },

  deleteButton: {
    border: "1px solid #E5B6B6",
    background: "#F7DCDC",
    color: "#963D3D",
    padding: "8px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "750",
  },


  /* =========================
     LOADING
  ========================= */

  loading: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "17px",
    padding: "55px 20px",
    textAlign: "center",
  },

  spinner: {
    width: "33px",
    height: "33px",
    borderRadius: "50%",
    border: "4px solid #B8DCDD",
    borderTop: "4px solid #087F8C",
    margin: "0 auto 15px",
  },

  loadingTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "17px",
  },

  loadingText: {
    margin: "5px 0 0",
    color: "#60777E",
    fontSize: "12px",
  },


  /* =========================
     EMPTY
  ========================= */

  empty: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "17px",
    padding: "55px 20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "65px",
    height: "65px",
    borderRadius: "18px",
    background: "#CBEBDD",
    color: "#16805C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    fontSize: "26px",
    fontWeight: "800",
  },

  emptyTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "18px",
  },

  emptyText: {
    margin: "6px 0 0",
    color: "#60777E",
    fontSize: "12px",
  },

};

export default AdminLeaves;
