import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

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

  async function loadLeaves() {

    const token = localStorage.getItem("token");

    try {

      const response = await fetch(
        `${API_URL}/api/doctor/leaves`,
        {
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

  async function addLeave(e) {

    e.preventDefault();

    setMessage("");
    setError("");

    if (!leaveDate) {
      setError("Please select a leave date.");
      return;
    }

    const token = localStorage.getItem("token");

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

      const data = await response.json();

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

      loadLeaves();

    } catch (err) {

      console.error(err);
      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  async function deleteLeave(id) {

    if (!window.confirm(
      "Are you sure you want to delete this leave?"
    )) {
      return;
    }

    const token = localStorage.getItem("token");

    try {

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
          leave => leave.id !== id
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

  function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <div style={styles.page}>

      <header style={styles.header}>

        <h2>HealthCare+ Doctor</h2>

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
          onClick={() => navigate("/doctor")}
          style={styles.backButton}
        >
          ← Back to Doctor Dashboard
        </button>

        <h1 style={styles.title}>
          Manage Leaves
        </h1>

        <p style={styles.subtitle}>
          Add or remove your unavailable dates.
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
          onSubmit={addLeave}
          style={styles.formCard}
        >

          <h2>Add Leave</h2>

          <label style={styles.label}>
            Leave Date
          </label>

          <input
            type="date"
            value={leaveDate}
            onChange={(e) =>
              setLeaveDate(e.target.value)
            }
            style={styles.input}
            required
          />

          <label style={styles.label}>
            Reason
          </label>

          <textarea
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            placeholder="Optional reason"
            style={styles.textarea}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.addButton}
          >
            {loading
              ? "Adding..."
              : "Add Leave"}
          </button>

        </form>

        <div style={styles.listCard}>

          <h2>
            My Leaves
          </h2>

          {loadingLeaves ? (

            <p>Loading leaves...</p>

          ) : leaves.length === 0 ? (

            <div style={styles.empty}>
              <div style={styles.icon}>
                📅
              </div>

              <h3>
                No leaves scheduled
              </h3>

              <p>
                You currently have no leave dates.
              </p>
            </div>

          ) : (

            <div>

              {leaves.map((leave) => (

                <div
                  key={leave.id}
                  style={styles.leave}
                >

                  <div>

                    <h3>
                      {leave.leaveDate}
                    </h3>

                    <p>
                      {leave.reason ||
                        "No reason provided"}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      deleteLeave(leave.id)
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

  formCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
    maxWidth: "600px",
    marginBottom: "30px",
  },

  listCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
    maxWidth: "800px",
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
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    resize: "vertical",
  },

  addButton: {
    width: "100%",
    marginTop: "25px",
    padding: "13px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  leave: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    marginTop: "15px",
  },

  deleteButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "7px",
    background: "#ef4444",
    color: "white",
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
    color: "#991b1b",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    maxWidth: "600px",
  },

  empty: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },

  icon: {
    fontSize: "45px",
  },
};

export default DoctorLeaves;