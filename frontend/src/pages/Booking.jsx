import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSlots, createAppointment } from "../api";

function Booking() {

  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("2026-08-24");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");


  /* =========================
     LOAD SLOTS
  ========================= */

  const loadSlots = async () => {

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getSlots(
        doctorId,
        date
      );

      setSlots(data);

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadSlots();
  }, [doctorId, date]);


  /* =========================
     BOOK APPOINTMENT
  ========================= */

  const handleBook = async (time) => {

    if (!token) {
      navigate("/login");
      return;
    }

    try {

      setBooking(true);
      setError("");
      setSuccess("");

      const response =
        await createAppointment(
          {
            doctorId: Number(doctorId),
            appointmentDate: date,
            appointmentTime: time,
            notes: "Regular consultation",
          },
          token
        );

      console.log(
        "Appointment booked:",
        response
      );

      setSuccess(
        `Appointment booked successfully for ${date} at ${time}`
      );

      await loadSlots();

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setBooking(false);

    }
  };


  return (

    <div style={styles.page}>

      {/* =========================
          NAVBAR
      ========================= */}

      <header style={styles.header}>

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

            <div style={styles.brandSubtitle}>
              PATIENT PORTAL
            </div>

          </div>

        </div>


        <div style={styles.headerRight}>

          <div style={styles.secureStatus}>

            <span style={styles.greenDot}></span>

            Secure Booking

          </div>

          <button
            style={styles.backButton}
            onClick={() =>
              navigate("/dashboard")
            }
          >
            ← Back to Doctors
          </button>

        </div>

      </header>


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        {/* PAGE HEADER */}

        <div style={styles.pageHeader}>

          <div>

            <div style={styles.eyebrow}>
              APPOINTMENT SCHEDULING
            </div>

            <h1 style={styles.title}>
              Book an Appointment
            </h1>

            <p style={styles.subtitle}>
              Select a convenient date and choose
              an available appointment slot.
            </p>

          </div>


          <div style={styles.stepBadge}>

            <div style={styles.stepNumber}>
              01
            </div>

            <div>

              <div style={styles.stepLabel}>
                BOOKING STEP
              </div>

              <div style={styles.stepText}>
                Choose date & time
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
                Booking unavailable
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
                Appointment confirmed
              </strong>

              <div style={styles.alertText}>
                {success}
              </div>

            </div>

          </div>

        )}


        {/* =========================
            BOOKING CARD
        ========================= */}

        <div style={styles.card}>

          {/* CARD HEADER */}

          <div style={styles.cardHeader}>

            <div style={styles.calendarIcon}>
              📅
            </div>

            <div>

              <div style={styles.cardEyebrow}>
                SELECT DATE
              </div>

              <h2 style={styles.cardTitle}>
                Choose your appointment date
              </h2>

              <p style={styles.cardSubtitle}>
                Available slots will update automatically.
              </p>

            </div>

          </div>


          {/* DATE */}

          <div style={styles.dateSection}>

            <label style={styles.label}>
              Appointment Date
            </label>

            <div style={styles.dateWrapper}>

              <span style={styles.dateIcon}>
                📅
              </span>

              <input
                type="date"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
                style={styles.dateInput}
              />

            </div>

          </div>


          {/* DIVIDER */}

          <div style={styles.divider}></div>


          {/* SLOT HEADER */}

          <div style={styles.slotHeader}>

            <div>

              <div style={styles.cardEyebrow}>
                AVAILABLE TIMES
              </div>

              <h2 style={styles.slotTitle}>
                Choose an appointment slot
              </h2>

            </div>


            {!loading &&
              slots.length > 0 && (

                <div style={styles.slotCount}>

                  {slots.filter(
                    (slot) =>
                      slot.available !== false
                  ).length}{" "}
                  available

                </div>

              )}

          </div>


          {/* LOADING */}

          {loading && (

            <div style={styles.loading}>

              <div style={styles.spinner}></div>

              <h3 style={styles.loadingTitle}>
                Loading available slots
              </h3>

              <p style={styles.loadingText}>
                Checking the doctor's schedule...
              </p>

            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            !error &&
            slots.length === 0 && (

              <div style={styles.empty}>

                <div style={styles.emptyIcon}>
                  🕐
                </div>

                <h3 style={styles.emptyTitle}>
                  No slots available
                </h3>

                <p style={styles.emptyText}>
                  There are no appointment slots
                  available for this date.
                  Try selecting another date.
                </p>

              </div>

            )}


          {/* SLOTS */}

          {!loading &&
            !error &&
            slots.length > 0 && (

              <div style={styles.slots}>

                {slots.map(
                  (slot, index) => {

                    const time =
                      slot.time ||
                      slot.startTime ||
                      slot.start ||
                      slot;

                    const available =
                      slot.available !== undefined
                        ? slot.available
                        : true;

                    return (

                      <button
                        key={index}
                        disabled={
                          !available ||
                          booking
                        }
                        onClick={() =>
                          handleBook(time)
                        }
                        style={{
                          ...styles.slot,
                          ...(available
                            ? styles.available
                            : styles.unavailable),
                        }}
                      >

                        <span style={styles.slotClock}>
                          🕐
                        </span>

                        <span>
                          {booking
                            ? "Booking..."
                            : time}
                        </span>

                        {available && !booking && (
                          <span style={styles.slotArrow}>
                            →
                          </span>
                        )}

                        {!available && (
                          <span style={styles.bookedLabel}>
                            BOOKED
                          </span>
                        )}

                      </button>

                    );

                  }
                )}

              </div>

            )}


          {/* INFO */}

          <div style={styles.infoBox}>

            <div style={styles.infoIcon}>
              ℹ
            </div>

            <div>

              <div style={styles.infoTitle}>
                Before you book
              </div>

              <div style={styles.infoText}>
                Please arrive 10–15 minutes before
                your scheduled appointment.
              </div>

            </div>

          </div>

        </div>


        {/* BOTTOM NAVIGATION */}

        <div style={styles.bottomActions}>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            style={styles.secondaryButton}
          >
            ← Choose another doctor
          </button>

          <button
            onClick={() =>
              navigate("/my-appointments")
            }
            style={styles.appointmentsButton}
          >
            View My Appointments →
          </button>

        </div>

      </main>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

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
    color: "#F4FFFF",
    fontSize: "23px",
    fontWeight: "750",
    letterSpacing: "-0.5px",
  },

  brandAccent: {
    color: "#62D3D1",
  },

  brandSubtitle: {
    marginTop: "2px",
    color: "#8FD5D7",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1.6px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  secureStatus: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    padding: "8px 12px",
    background: "#1A4B5B",
    border: "1px solid #387080",
    borderRadius: "20px",
    color: "#BDEBED",
    fontSize: "10px",
    fontWeight: "700",
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
    padding: "10px 16px",
    border: "1px solid #387080",
    borderRadius: "9px",
    background: "#1A4B5B",
    color: "#E8FAFA",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "650",
  },


  /* =========================
     MAIN
  ========================= */

  container: {
    maxWidth: "1080px",
    margin: "0 auto",
    padding: "45px 30px 60px",
  },

  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
    lineHeight: "1.6",
  },


  /* =========================
     STEP BADGE
  ========================= */

  stepBadge: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "13px",
  },

  stepNumber: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
  },

  stepLabel: {
    color: "#087F8C",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  stepText: {
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
     BOOKING CARD
  ========================= */

  card: {
    background: "#EAF7F6",
    padding: "30px",
    borderRadius: "18px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 8px 25px rgba(18,59,74,0.09)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
  },

  calendarIcon: {
    width: "49px",
    height: "49px",
    borderRadius: "13px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.22)",
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
    fontSize: "20px",
    fontWeight: "750",
  },

  cardSubtitle: {
    margin: "4px 0 0",
    color: "#60777E",
    fontSize: "12px",
  },


  /* =========================
     DATE
  ========================= */

  dateSection: {
    marginTop: "26px",
    maxWidth: "420px",
  },

  label: {
    display: "block",
    color: "#244C58",
    fontSize: "12px",
    fontWeight: "750",
    marginBottom: "7px",
  },

  dateWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#C9E4E5",
    border: "1px solid #8DBFC2",
    borderRadius: "10px",
    overflow: "hidden",
  },

  dateIcon: {
    paddingLeft: "12px",
    fontSize: "16px",
  },

  dateInput: {
    width: "100%",
    padding: "12px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "14px",
    cursor: "pointer",
  },


  /* =========================
     DIVIDER
  ========================= */

  divider: {
    height: "1px",
    background: "#C2DDDE",
    margin: "30px 0",
  },


  /* =========================
     SLOT HEADER
  ========================= */

  slotHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "15px",
  },

  slotTitle: {
    margin: "4px 0 0",
    color: "#123B4A",
    fontSize: "20px",
    fontWeight: "750",
  },

  slotCount: {
    padding: "7px 11px",
    borderRadius: "20px",
    background: "#CBEBDD",
    border: "1px solid #9DD3B7",
    color: "#126442",
    fontSize: "10px",
    fontWeight: "800",
  },


  /* =========================
     SLOTS
  ========================= */

  slots: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(155px, 1fr))",
    gap: "12px",
    marginTop: "20px",
  },

  slot: {
    minHeight: "52px",
    padding: "12px 13px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "750",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    transition: "all 0.15s ease",
  },

  available: {
    background: "#087F8C",
    color: "#FFFFFF",
    border: "1px solid #087F8C",
    boxShadow:
      "0 4px 10px rgba(8,127,140,0.18)",
  },

  unavailable: {
    background: "#D4E2E3",
    color: "#72878C",
    cursor: "not-allowed",
    border: "1px solid #B8CBCC",
  },

  slotClock: {
    fontSize: "13px",
  },

  slotArrow: {
    fontSize: "15px",
    opacity: 0.8,
  },

  bookedLabel: {
    fontSize: "8px",
    letterSpacing: "0.6px",
  },


  /* =========================
     LOADING
  ========================= */

  loading: {
    marginTop: "20px",
    padding: "50px 20px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "14px",
    textAlign: "center",
  },

  spinner: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "4px solid #B8DCDD",
    borderTop: "4px solid #087F8C",
    margin: "0 auto 15px",
  },

  loadingTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "16px",
  },

  loadingText: {
    margin: "5px 0 0",
    color: "#60777E",
    fontSize: "11px",
  },


  /* =========================
     EMPTY
  ========================= */

  empty: {
    marginTop: "20px",
    padding: "45px 20px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    borderRadius: "14px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 13px",
    fontSize: "23px",
  },

  emptyTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "17px",
  },

  emptyText: {
    maxWidth: "400px",
    margin: "6px auto 0",
    color: "#60777E",
    fontSize: "12px",
    lineHeight: "1.6",
  },


  /* =========================
     INFO
  ========================= */

  infoBox: {
    marginTop: "27px",
    padding: "13px 15px",
    borderRadius: "11px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  infoIcon: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
  },

  infoTitle: {
    color: "#244C58",
    fontSize: "11px",
    fontWeight: "800",
  },

  infoText: {
    marginTop: "2px",
    color: "#647B82",
    fontSize: "10px",
  },


  /* =========================
     BOTTOM
  ========================= */

  bottomActions: {
    marginTop: "22px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
  },

  secondaryButton: {
    border: "1px solid #8DBFC2",
    background: "#C9E4E5",
    color: "#244C58",
    padding: "11px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },

  appointmentsButton: {
    border: "none",
    background: "#123B4A",
    color: "#FFFFFF",
    padding: "11px 17px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
  },

};

export default Booking;
