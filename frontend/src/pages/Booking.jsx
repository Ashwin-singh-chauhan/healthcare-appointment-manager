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

  const loadSlots = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await getSlots(doctorId, date);
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

  const handleBook = async (time) => {

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setBooking(true);
      setError("");
      setSuccess("");

      const response = await createAppointment(
        {
          doctorId: Number(doctorId),
          appointmentDate: date,
          appointmentTime: time,
          notes: "Regular consultation",
        },
        token
      );

      console.log("Appointment booked:", response);

      setSuccess(
        `Appointment booked successfully for ${date} at ${time}`
      );

      // Refresh slots so the booked slot becomes unavailable
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

      <header style={styles.header}>
        <h2>HealthCare+</h2>

        <button
          style={styles.backButton}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Doctors
        </button>
      </header>

      <main style={styles.container}>

        <h1>Book an Appointment</h1>

        <p style={styles.subtitle}>
          Select a date and choose an available appointment slot.
        </p>

        <div style={styles.card}>

          <label style={styles.label}>
            Select Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={styles.dateInput}
          />

          <h2 style={styles.heading}>
            Available Slots
          </h2>

          {loading && (
            <p>Loading available slots...</p>
          )}

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          {success && (
            <div style={styles.success}>
              {success}
            </div>
          )}

          {!loading && !error && slots.length === 0 && (
            <p>No slots available for this date.</p>
          )}

          {!loading && !error && slots.length > 0 && (

            <div style={styles.slots}>

              {slots.map((slot, index) => {

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
                    disabled={!available || booking}
                    onClick={() => handleBook(time)}
                    style={{
                      ...styles.slot,
                      ...(available
                        ? styles.available
                        : styles.unavailable),
                    }}
                  >
                    {booking
                      ? "Booking..."
                      : time}
                  </button>
                );

              })}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f7fa",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    height: "80px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8%",
  },

  backButton: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  },

  container: {
    maxWidth: "1000px",
    margin: "50px auto",
    padding: "0 25px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
  },

  card: {
    marginTop: "30px",
    background: "white",
    padding: "35px",
    borderRadius: "16px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.08)",
  },

  label: {
    display: "block",
    fontWeight: "600",
    marginBottom: "10px",
  },

  dateInput: {
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "16px",
  },

  heading: {
    marginTop: "35px",
  },

  slots: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px",
    marginTop: "20px",
  },

  slot: {
    padding: "15px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    border: "1px solid #2563eb",
  },

  available: {
    background: "#2563eb",
    color: "white",
  },

  unavailable: {
    background: "#e5e7eb",
    color: "#64748b",
    cursor: "not-allowed",
    border: "1px solid #cbd5e1",
  },

  error: {
    padding: "15px",
    background: "#fee2e2",
    color: "#b91c1c",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  success: {
    padding: "15px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};

export default Booking;