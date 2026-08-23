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


  // ==========================================
  // LOAD LOGGED-IN DOCTOR
  // ==========================================

  useEffect(() => {

    async function loadDoctor() {

      const token = localStorage.getItem("token");

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

        console.log("Logged-in doctor:", data);

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


  // ==========================================
  // SAVE AVAILABILITY
  // ==========================================

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

    const token = localStorage.getItem("token");

    if (!token) {

      navigate("/login");

      return;
    }

    setLoading(true);

    try {

      // ==========================================
      // CONVERT DATE → DAY OF WEEK
      // ==========================================

      const selectedDate = new Date(
        date + "T00:00:00"
      );

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


      // ==========================================
      // SEND AVAILABILITY
      // ==========================================

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

            slotDurationMinutes: 30

          }),
        }
      );


      const data = await response.json();


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
        "Availability saved successfully."
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


  // ==========================================
  // LOGOUT
  // ==========================================

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  }


  // ==========================================
  // LOADING DOCTOR
  // ==========================================

  if (loadingDoctor) {

    return (
      <div style={styles.page}>

        <header style={styles.header}>

          <h2>
            HealthCare+ Doctor
          </h2>

        </header>

        <main style={styles.main}>

          <h1 style={styles.title}>
            Manage Availability
          </h1>

          <p style={styles.subtitle}>
            Loading doctor information...
          </p>

        </main>

      </div>
    );
  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div style={styles.page}>

      <header style={styles.header}>

        <h2>
          HealthCare+ Doctor
        </h2>

        <div style={styles.headerRight}>

          <span>
            Hello, {user?.name || "Doctor"}
          </span>

          <button
            onClick={logout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </header>


      <main style={styles.main}>

        <button
          onClick={() =>
            navigate("/doctor")
          }
          style={styles.backButton}
        >
          ← Back to Doctor Dashboard
        </button>


        <h1 style={styles.title}>
          Manage Availability
        </h1>


        <p style={styles.subtitle}>
          Set your working hours and available
          appointment slots.
        </p>


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


        <form
          onSubmit={saveAvailability}
          style={styles.card}
        >

          <h2>
            Set Working Hours
          </h2>


          <label style={styles.label}>
            Select Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            style={styles.input}
            required
          />


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


          <button
            type="submit"
            disabled={
              loading ||
              !doctorId
            }
            style={styles.saveButton}
          >

            {loading
              ? "Saving..."
              : "Save Availability"}

          </button>

        </form>

      </main>

    </div>

  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    height: "70px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 70px",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    color: "#475569",
  },

  logout: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "7px",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
  },

  main: {
    padding: "50px 70px",
  },

  backButton: {
    padding: "11px 18px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    marginBottom: "30px",
  },

  title: {
    fontSize: "36px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "18px",
    marginBottom: "35px",
  },

  card: {
    background: "white",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
    maxWidth: "600px",
  },

  label: {
    display: "block",
    fontWeight: "bold",
    marginTop: "20px",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },

  saveButton: {
    width: "100%",
    padding: "13px",
    marginTop: "30px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    maxWidth: "600px",
  },

  error: {
    background: "#fee2e2",
    color: "#991b1c",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    maxWidth: "600px",
  },

};

export default DoctorAvailability;
