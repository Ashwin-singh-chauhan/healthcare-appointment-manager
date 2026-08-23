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

        <h2>HealthCare+ Admin</h2>

        <button
          onClick={() => navigate("/admin")}
          style={styles.backButton}
        >
          ← Back to Admin
        </button>

      </nav>


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        <div style={styles.headerRow}>

          <div>

            <h1>Manage Availability</h1>

            <p style={styles.subtitle}>
              Manage doctor working schedules and
              appointment slot timings.
            </p>

          </div>

        </div>


        {/* =========================
            MESSAGES
        ========================= */}

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* =========================
            ADD FORM
        ========================= */}

        <div style={styles.formCard}>

          <h2>Add Availability</h2>

          <form onSubmit={handleSubmit}>

            <div style={styles.formGrid}>

              {/* DOCTOR */}

              <div style={styles.field}>

                <label>Doctor</label>

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


              {/* DAY */}

              <div style={styles.field}>

                <label>Day</label>

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


              {/* START TIME */}

              <div style={styles.field}>

                <label>Start Time</label>

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


              {/* END TIME */}

              <div style={styles.field}>

                <label>End Time</label>

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


              {/* SLOT DURATION */}

              <div style={styles.field}>

                <label>
                  Slot Duration
                </label>

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


            <button
              type="submit"
              disabled={loading}
              style={styles.addButton}
            >

              {loading
                ? "Adding..."
                : "+ Add Availability"}

            </button>

          </form>

        </div>


        {/* =========================
            EXISTING AVAILABILITY
        ========================= */}

        <div style={styles.listSection}>

          <h2>Existing Availability</h2>

          {availability.length === 0 ? (

            <div style={styles.empty}>
              No availability configured for this
              doctor.
            </div>

          ) : (

            <div style={styles.cards}>

              {availability.map((item) => (

                <div
                  key={item.id}
                  style={styles.availabilityCard}
                >

                  <div>

                    <h3>
                      {formatDay(item.dayOfWeek)}
                    </h3>

                    <p style={styles.time}>
                      {formatTime(item.startTime)}
                      {" - "}
                      {formatTime(item.endTime)}
                    </p>

                    <p style={styles.duration}>
                      Slot duration:{" "}
                      {item.slotDurationMinutes}
                      {" minutes"}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(item.id)
                    }
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>

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
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  nav: {
    height: "70px",
    padding: "0 8%",
    background: "white",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "45px 30px",
  },

  headerRow: {
    marginBottom: "30px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
  },

  formCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    marginBottom: "40px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "25px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  input: {
    marginTop: "7px",
    padding: "11px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    background: "white",
  },

  addButton: {
    marginTop: "25px",
    padding: "12px 22px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  listSection: {
    marginTop: "20px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },

  availabilityCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  time: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "8px 0",
  },

  duration: {
    color: "#64748b",
  },

  deleteButton: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "9px 15px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  empty: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    color: "#64748b",
    marginTop: "20px",
  },

};

export default AdminAvailability;