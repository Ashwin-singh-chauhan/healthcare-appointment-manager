import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getDoctors,
  getDoctorAvailability,
  createAvailability,
  deleteAvailability,
} from "../api";

function AdminAvailability() {

  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [availability, setAvailability] = useState([]);

  const [doctorId, setDoctorId] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("13:00");
  const [slotDurationMinutes, setSlotDurationMinutes] =
    useState(30);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* =========================
     LOAD DOCTORS
  ========================= */

  useEffect(() => {

    async function loadDoctors() {

      try {

        const data = await getDoctors();

        setDoctors(data);

        if (data.length > 0) {
          setDoctorId(data[0].id);
        }

      } catch (err) {

        setError(err.message);

      }
    }

    loadDoctors();

  }, []);


  /* =========================
     LOAD AVAILABILITY
  ========================= */

  useEffect(() => {

    if (!doctorId) {
      setAvailability([]);
      return;
    }

    async function loadAvailability() {

      try {

        setError("");

        const data =
          await getDoctorAvailability(doctorId);

        setAvailability(data);

      } catch (err) {

        setError(err.message);

      }
    }

    loadAvailability();

  }, [doctorId]);


  /* =========================
     ADD AVAILABILITY
  ========================= */

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {

      const data = {
        doctorId: Number(doctorId),
        dayOfWeek,
        startTime,
        endTime,
        slotDurationMinutes:
          Number(slotDurationMinutes),
      };

      const created =
        await createAvailability(data, token);

      setAvailability((prev) => [
        ...prev,
        created,
      ]);

      setMessage(
        "Availability added successfully."
      );

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }


  /* =========================
     DELETE AVAILABILITY
  ========================= */

  async function handleDelete(id) {

    const confirmed = window.confirm(
      "Are you sure you want to delete this availability?"
    );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setMessage("");

      await deleteAvailability(id, token);

      setAvailability((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setMessage(
        "Availability deleted successfully."
      );

    } catch (err) {

      setError(err.message);

    }
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
              HealthCare<span style={styles.brandAccent}>+</span>
            </h2>

            <div style={styles.adminLabel}>
              ADMIN PORTAL
            </div>

          </div>

        </div>


        <div style={styles.navRight}>

          <div style={styles.navStatus}>
            <span style={styles.statusDot}></span>
            System Active
          </div>

          <button
            onClick={() => navigate("/admin")}
            style={styles.backButton}
          >
            ← Back to Admin
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        {/* PAGE HEADER */}

        <div style={styles.headerRow}>

          <div>

            <div style={styles.eyebrow}>
              SCHEDULE MANAGEMENT
            </div>

            <h1 style={styles.title}>
              Doctor Availability
            </h1>

            <p style={styles.subtitle}>
              Configure working hours and appointment
              slot schedules for your doctors.
            </p>

          </div>

          <div style={styles.headerIllustration}>

            <div style={styles.calendarIcon}>
              📅
            </div>

            <div>
              <strong style={styles.headerIllustrationTitle}>
                Availability
              </strong>

              <span style={styles.headerIllustrationText}>
                Manage schedules
              </span>
            </div>

          </div>

        </div>


        {/* =========================
            MESSAGES
        ========================= */}

        {message && (

          <div style={styles.success}>

            <div style={styles.successIcon}>
              ✓
            </div>

            <div>
              <strong>Success</strong>

              <div style={styles.messageText}>
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
              <strong>Unable to complete request</strong>

              <div style={styles.messageText}>
                {error}
              </div>
            </div>

          </div>

        )}


        {/* =========================
            ADD AVAILABILITY
        ========================= */}

        <section style={styles.formCard}>

          <div style={styles.sectionHeader}>

            <div style={styles.sectionIcon}>
              +
            </div>

            <div>

              <div style={styles.sectionEyebrow}>
                CREATE SCHEDULE
              </div>

              <h2 style={styles.sectionTitle}>
                Add Availability
              </h2>

              <p style={styles.sectionSubtitle}>
                Define when a doctor can accept appointments.
              </p>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* DOCTOR */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Doctor
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    👨‍⚕️
                  </span>

                  <select
                    value={doctorId}
                    onChange={(e) =>
                      setDoctorId(e.target.value)
                    }
                    required
                    style={styles.input}
                  >

                    <option value="">
                      Select Doctor
                    </option>

                    {doctors.map((doctor) => (

                      <option
                        key={doctor.id}
                        value={doctor.id}
                      >
                        {doctor.name}
                      </option>

                    ))}

                  </select>

                </div>

              </div>


              {/* DAY */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Day of Week
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    📆
                  </span>

                  <select
                    value={dayOfWeek}
                    onChange={(e) =>
                      setDayOfWeek(e.target.value)
                    }
                    style={styles.input}
                  >

                    <option value="MONDAY">
                      Monday
                    </option>

                    <option value="TUESDAY">
                      Tuesday
                    </option>

                    <option value="WEDNESDAY">
                      Wednesday
                    </option>

                    <option value="THURSDAY">
                      Thursday
                    </option>

                    <option value="FRIDAY">
                      Friday
                    </option>

                    <option value="SATURDAY">
                      Saturday
                    </option>

                    <option value="SUNDAY">
                      Sunday
                    </option>

                  </select>

                </div>

              </div>


              {/* START TIME */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Start Time
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    🕐
                  </span>

                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) =>
                      setStartTime(e.target.value)
                    }
                    required
                    style={styles.input}
                  />

                </div>

              </div>


              {/* END TIME */}

              <div style={styles.field}>

                <label style={styles.label}>
                  End Time
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    🕐
                  </span>

                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) =>
                      setEndTime(e.target.value)
                    }
                    required
                    style={styles.input}
                  />

                </div>

              </div>


              {/* SLOT DURATION */}

              <div style={styles.field}>

                <label style={styles.label}>
                  Slot Duration
                </label>

                <div style={styles.inputWrapper}>

                  <span style={styles.inputIcon}>
                    ⏱
                  </span>

                  <select
                    value={slotDurationMinutes}
                    onChange={(e) =>
                      setSlotDurationMinutes(
                        e.target.value
                      )
                    }
                    style={styles.input}
                  >

                    <option value={15}>
                      15 minutes
                    </option>

                    <option value={30}>
                      30 minutes
                    </option>

                    <option value={45}>
                      45 minutes
                    </option>

                    <option value={60}>
                      60 minutes
                    </option>

                  </select>

                </div>

              </div>

            </div>


            {/* SCHEDULE PREVIEW */}

            <div style={styles.preview}>

              <div style={styles.previewIcon}>
                ✓
              </div>

              <div>

                <div style={styles.previewTitle}>
                  Schedule Preview
                </div>

                <div style={styles.previewText}>
                  {formatDay(dayOfWeek)} •{" "}
                  {formatTime(startTime)}
                  {" – "}
                  {formatTime(endTime)}
                  {" • "}
                  {slotDurationMinutes} minute slots
                </div>

              </div>

            </div>


            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.addButton,
                opacity: loading ? 0.7 : 1,
              }}
            >

              <span style={styles.addButtonIcon}>
                {loading ? "..." : "+"}
              </span>

              {loading
                ? "Adding Availability..."
                : "Add Availability"}

            </button>

          </form>

        </section>


        {/* =========================
            EXISTING AVAILABILITY
        ========================= */}

        <section style={styles.listSection}>

          <div style={styles.listHeader}>

            <div>

              <div style={styles.sectionEyebrow}>
                CURRENT SCHEDULE
              </div>

              <h2 style={styles.listTitle}>
                Existing Availability
              </h2>

              <p style={styles.sectionSubtitle}>
                Active working schedules for the selected doctor.
              </p>

            </div>


            <div style={styles.scheduleCount}>

              <strong>
                {availability.length}
              </strong>

              <span>
                {availability.length === 1
                  ? "Schedule"
                  : "Schedules"}
              </span>

            </div>

          </div>


          {availability.length === 0 ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>
                📅
              </div>

              <h3 style={styles.emptyTitle}>
                No availability configured
              </h3>

              <p style={styles.emptyText}>
                Add a working schedule above to make
                appointment slots available.
              </p>

            </div>

          ) : (

            <div style={styles.cards}>

              {availability.map((item) => (

                <div
                  key={item.id}
                  style={styles.availabilityCard}
                >

                  <div style={styles.cardTop}>

                    <div style={styles.dayIcon}>
                      📆
                    </div>

                    <div>

                      <div style={styles.dayLabel}>
                        WORKING DAY
                      </div>

                      <h3 style={styles.dayTitle}>
                        {formatDay(item.dayOfWeek)}
                      </h3>

                    </div>

                    <div style={styles.activeBadge}>
                      <span>●</span>
                      Active
                    </div>

                  </div>


                  <div style={styles.timePanel}>

                    <div style={styles.timeBlock}>

                      <span style={styles.timeLabel}>
                        START
                      </span>

                      <strong style={styles.time}>
                        {formatTime(item.startTime)}
                      </strong>

                    </div>


                    <div style={styles.timeLine}>
                      <div style={styles.line}></div>
                      <span>→</span>
                      <div style={styles.line}></div>
                    </div>


                    <div style={styles.timeBlock}>

                      <span style={styles.timeLabel}>
                        END
                      </span>

                      <strong style={styles.time}>
                        {formatTime(item.endTime)}
                      </strong>

                    </div>

                  </div>


                  <div style={styles.cardFooter}>

                    <div style={styles.durationBox}>

                      <span style={styles.durationIcon}>
                        ⏱
                      </span>

                      <div>

                        <span style={styles.durationLabel}>
                          SLOT DURATION
                        </span>

                        <strong style={styles.duration}>
                          {item.slotDurationMinutes} minutes
                        </strong>

                      </div>

                    </div>


                    <button
                      onClick={() =>
                        handleDelete(item.id)
                      }
                      style={styles.deleteButton}
                    >
                      <span>
                        🗑
                      </span>
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
}


/* =========================
   HELPERS
========================= */

function formatDay(day) {

  if (!day) {
    return "";
  }

  return (
    day.charAt(0) +
    day.slice(1).toLowerCase()
  );
}


function formatTime(time) {

  if (!time) {
    return "";
  }

  return time.substring(0, 5);
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
    gap: "12px",
  },

  navStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#BDEBED",
    fontSize: "12px",
    fontWeight: "650",
    padding: "8px 12px",
    background: "#1A4B5B",
    border:
      "1px solid #387080",
    borderRadius: "20px",
  },

  statusDot: {
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
    padding: "10px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "650",
  },


  /* =========================
     MAIN
  ========================= */

  container: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "48px 30px 70px",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "34px",
  },

  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1.8px",
    color: "#087F8C",
    marginBottom: "8px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: "1.15",
    fontWeight: "750",
    letterSpacing: "-1px",
    color: "#123B4A",
  },

  subtitle: {
    marginTop: "10px",
    marginBottom: 0,
    color: "#45636B",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  headerIllustration: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "13px 17px",
    borderRadius: "15px",
    background: "#C9E4E5",
    border: "1px solid #9BCACC",
  },

  calendarIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  headerIllustrationTitle: {
    display: "block",
    color: "#123B4A",
    fontSize: "13px",
  },

  headerIllustrationText: {
    display: "block",
    marginTop: "3px",
    color: "#557078",
    fontSize: "11px",
  },


  /* =========================
     MESSAGES
  ========================= */

  success: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#CBEBDD",
    color: "#126442",
    padding: "14px 17px",
    borderRadius: "12px",
    border: "1px solid #9DD3B7",
    marginBottom: "20px",
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

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#F7DCDC",
    color: "#8E3838",
    padding: "14px 17px",
    borderRadius: "12px",
    border: "1px solid #E6B5B5",
    marginBottom: "20px",
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

  messageText: {
    marginTop: "3px",
    fontSize: "13px",
  },


  /* =========================
     FORM
  ========================= */

  formCard: {
    background: "#C9E4E5",
    padding: "30px",
    borderRadius: "19px",
    border: "1px solid #9CCBCD",
    boxShadow:
      "0 9px 28px rgba(18,59,74,0.10)",
    marginBottom: "48px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "26px",
  },

  sectionIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "25px",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.25)",
  },

  sectionEyebrow: {
    fontSize: "10px",
    letterSpacing: "1.5px",
    fontWeight: "800",
    color: "#087F8C",
    marginBottom: "4px",
  },

  sectionTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "22px",
    fontWeight: "750",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#557078",
    fontSize: "13px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "18px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    color: "#244C58",
    fontSize: "12px",
    fontWeight: "750",
    marginBottom: "7px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #8DBFC2",
    borderRadius: "10px",
    background: "#EAF7F6",
    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "12px",
    fontSize: "15px",
  },

  input: {
    flex: 1,
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 12px 12px 8px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#123B4A",
    background: "transparent",
  },

  preview: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
    marginTop: "22px",
    padding: "13px 15px",
    borderRadius: "11px",
    background: "#B7DCDD",
    border: "1px solid #91C8CA",
  },

  previewIcon: {
    width: "29px",
    height: "29px",
    borderRadius: "8px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  previewTitle: {
    color: "#123B4A",
    fontSize: "11px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },

  previewText: {
    marginTop: "2px",
    color: "#45636B",
    fontSize: "13px",
  },

  addButton: {
    marginTop: "22px",
    padding: "13px 21px",
    border: "none",
    borderRadius: "9px",
    background: "#087F8C",
    color: "#FFFFFF",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "750",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.25)",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  addButtonIcon: {
    fontSize: "20px",
    lineHeight: "1",
  },


  /* =========================
     EXISTING SCHEDULES
  ========================= */

  listSection: {
    marginTop: "20px",
  },

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "22px",
  },

  listTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "25px",
    fontWeight: "750",
  },

  scheduleCount: {
    minWidth: "82px",
    padding: "10px 14px",
    borderRadius: "12px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.20)",
  },

  scheduleCountStrong: {
    fontSize: "21px",
    fontWeight: "800",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "20px",
  },

  availabilityCard: {
    background: "#EAF7F6",
    padding: "22px",
    borderRadius: "17px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 8px 23px rgba(18,59,74,0.09)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  dayIcon: {
    width: "43px",
    height: "43px",
    borderRadius: "12px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  dayLabel: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  dayTitle: {
    margin: "2px 0 0",
    color: "#123B4A",
    fontSize: "18px",
  },

  activeBadge: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "5px 9px",
    borderRadius: "20px",
    background: "#CBEBDD",
    color: "#16805C",
    border: "1px solid #9DD3B7",
    fontSize: "10px",
    fontWeight: "800",
  },

  timePanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "22px",
    padding: "17px",
    borderRadius: "12px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
  },

  timeBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: "72px",
  },

  timeLabel: {
    color: "#5D7980",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.8px",
    marginBottom: "4px",
  },

  time: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#123B4A",
  },

  timeLine: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#087F8C",
    fontWeight: "800",
  },

  line: {
    width: "25px",
    height: "1px",
    background: "#7FBABD",
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "17px",
    paddingTop: "15px",
    borderTop: "1px solid #BDD9DB",
  },

  durationBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  durationIcon: {
    width: "31px",
    height: "31px",
    borderRadius: "8px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  durationLabel: {
    display: "block",
    color: "#6B8187",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.6px",
  },

  duration: {
    display: "block",
    marginTop: "2px",
    color: "#244C58",
    fontSize: "12px",
  },

  deleteButton: {
    border: "1px solid #E5B6B6",
    background: "#F7DCDC",
    color: "#963D3D",
    padding: "9px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "750",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },


  /* =========================
     EMPTY STATE
  ========================= */

  empty: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    padding: "55px 25px",
    borderRadius: "17px",
    color: "#557078",
    marginTop: "20px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "68px",
    height: "68px",
    margin: "0 auto 15px",
    borderRadius: "19px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
  },

  emptyTitle: {
    margin: "0 0 7px",
    color: "#123B4A",
    fontSize: "18px",
  },

  emptyText: {
    margin: 0,
    color: "#60777E",
    fontSize: "13px",
  },

};

export default AdminAvailability;
