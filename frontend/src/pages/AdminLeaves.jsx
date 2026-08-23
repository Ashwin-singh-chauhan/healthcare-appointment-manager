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

  // =========================
  // LOAD DOCTORS
  // =========================

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

  // =========================
  // LOAD LEAVES
  // =========================

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

  // =========================
  // ADD LEAVE
  // =========================

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

      setSuccess("Doctor leave added successfully.");

      setLeaveDate("");
      setReason("");

      await loadLeaves(selectedDoctor);

    } catch (err) {

      setError(err.message);

    } finally {

      setSaving(false);

    }
  }

  // =========================
  // DELETE LEAVE
  // =========================

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

      await deleteDoctorLeave(id, token);

      setSuccess("Leave removed successfully.");

      await loadLeaves(selectedDoctor);

    } catch (err) {

      setError(err.message);

    }
  }

  // =========================
  // LOGOUT
  // =========================

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.nav}>

        <h2>HealthCare+ Admin</h2>

        <div>

          <button
            onClick={() => navigate("/admin")}
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


      <main style={styles.container}>

        <h1>Manage Doctor Leaves</h1>

        <p style={styles.subtitle}>
          Manage doctor leave dates and reasons.
        </p>


        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        {/* SUCCESS */}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}


        {/* ADD LEAVE */}

        <div style={styles.card}>

          <h2>Add Doctor Leave</h2>

          <form onSubmit={handleAddLeave}>

            <div style={styles.formGrid}>

              {/* DOCTOR */}

              <div style={styles.field}>

                <label>Doctor</label>

                <select
                  value={selectedDoctor}
                  onChange={(e) =>
                    setSelectedDoctor(e.target.value)
                  }
                  style={styles.input}
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


              {/* DATE */}

              <div style={styles.field}>

                <label>Leave Date</label>

                <input
                  type="date"
                  value={leaveDate}
                  onChange={(e) =>
                    setLeaveDate(e.target.value)
                  }
                  style={styles.input}
                />

              </div>

            </div>


            {/* REASON */}

            <div style={styles.field}>

              <label>Reason</label>

              <input
                type="text"
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                placeholder="e.g. Personal leave"
                style={styles.input}
              />

            </div>


            <button
              type="submit"
              disabled={saving || !selectedDoctor}
              style={styles.button}
            >
              {saving
                ? "Adding..."
                : "+ Add Leave"}
            </button>

          </form>

        </div>


        {/* EXISTING LEAVES */}

        <div style={styles.card}>

          <h2>Existing Leaves</h2>

          {loadingLeaves ? (

            <p style={styles.muted}>
              Loading leaves...
            </p>

          ) : leaves.length === 0 ? (

            <p style={styles.muted}>
              No leave dates found for this doctor.
            </p>

          ) : (

            <div style={styles.list}>

              {leaves.map((leave) => (

                <div
                  key={leave.id}
                  style={styles.leaveCard}
                >

                  <div>

                    <div style={styles.date}>
                      📅 {leave.leaveDate}
                    </div>

                    <div style={styles.reason}>

                      {leave.reason
                        ? leave.reason
                        : "No reason provided"}

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      handleDeleteLeave(leave.id)
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


// =========================
// STYLES
// =========================

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

  navButtons: {
    display: "flex",
    gap: "10px",
  },

  backButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    marginRight: "10px",
  },

  logout: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "10px 18px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "50px 30px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
    marginBottom: "30px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
    marginBottom: "30px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },

  input: {
    marginTop: "8px",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
    boxSizing: "border-box",
    width: "100%",
    background: "white",
  },

  button: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: "15px",
  },

  leaveCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  date: {
    fontSize: "17px",
    fontWeight: "bold",
    marginBottom: "6px",
  },

  reason: {
    color: "#64748b",
  },

  deleteButton: {
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "9px 16px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  success: {
    background: "#dcfce7",
    color: "#166534",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  muted: {
    color: "#64748b",
  },

  list: {
    marginTop: "20px",
  },
};

export default AdminLeaves;