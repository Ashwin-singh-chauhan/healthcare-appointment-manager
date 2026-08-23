import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://healthcare-appointment-manager-nlir.onrender.com";

function AdminDoctors() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  async function loadDoctors() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/doctors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Request failed: ${response.status}`
        );
      }

      const data = await response.json();

      setDoctors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function openAddForm() {
    setEditingDoctor(null);

    setForm({
      name: "",
      specialization: "",
      email: "",
      phone: "",
    });

    setShowForm(true);
    setError("");
  }

  function openEditForm(doctor) {
    setEditingDoctor(doctor);

    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      email: doctor.email,
      phone: doctor.phone,
    });

    setShowForm(true);
    setError("");
  }

  function closeForm() {
    setShowForm(false);
    setEditingDoctor(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");

      const url = editingDoctor
        ? `${API_URL}/api/admin/doctors/${editingDoctor.id}`
        : `${API_URL}/api/admin/doctors`;

      const method = editingDoctor
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text || `Request failed: ${response.status}`
        );
      }

      closeForm();

      await loadDoctors();

    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleStatus(doctor) {
    const action = doctor.active
      ? "deactivate"
      : "activate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${doctor.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/api/admin/doctors/${doctor.id}/status?active=${!doctor.active}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();

      if (!response.ok) {
        throw new Error(
          text || `Request failed: ${response.status}`
        );
      }

      await loadDoctors();

    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={styles.page}>

      <nav style={styles.nav}>

        <h2>HealthCare+ Admin</h2>

        <button
          style={styles.backButton}
          onClick={() => navigate("/admin")}
        >
          ← Back to Admin
        </button>

      </nav>

      <main style={styles.container}>

        <div style={styles.header}>

          <div>
            <h1>Manage Doctors</h1>

            <p style={styles.subtitle}>
              Add, edit and manage healthcare professionals.
            </p>
          </div>

          <button
            style={styles.addButton}
            onClick={openAddForm}
          >
            + Add Doctor
          </button>

        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {showForm && (
          <div style={styles.formCard}>

            <h2>
              {editingDoctor
                ? "Edit Doctor"
                : "Add New Doctor"}
            </h2>

            <form onSubmit={handleSubmit}>

              <label style={styles.label}>
                Doctor Name
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Priya Mehta"
                required
                style={styles.input}
              />

              <label style={styles.label}>
                Specialization
              </label>

              <input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Dermatology"
                required
                style={styles.input}
              />

              <label style={styles.label}>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="doctor@healthcare.com"
                required
                style={styles.input}
              />

              <label style={styles.label}>
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                required
                style={styles.input}
              />

              <div style={styles.formButtons}>

                <button
                  type="submit"
                  style={styles.saveButton}
                >
                  {editingDoctor
                    ? "Update Doctor"
                    : "Add Doctor"}
                </button>

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={closeForm}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {loading ? (
          <p>Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <div style={styles.empty}>
            No doctors found.
          </div>
        ) : (

          <div style={styles.grid}>

            {doctors.map((doctor) => (

              <div
                key={doctor.id}
                style={styles.card}
              >

                <div style={styles.cardTop}>

                  <div style={styles.avatar}>
                    {doctor.name?.charAt(0)}
                  </div>

                  <span
                    style={{
                      ...styles.status,
                      background: doctor.active
                        ? "#dcfce7"
                        : "#fee2e2",
                      color: doctor.active
                        ? "#166534"
                        : "#991b1b",
                    }}
                  >
                    {doctor.active
                      ? "ACTIVE"
                      : "INACTIVE"}
                  </span>

                </div>

                <h2>{doctor.name}</h2>

                <p style={styles.specialization}>
                  {doctor.specialization}
                </p>

                <p>
                  📧 {doctor.email}
                </p>

                <p>
                  📞 {doctor.phone}
                </p>

                <div style={styles.actions}>

                  <button
                    style={styles.editButton}
                    onClick={() =>
                      openEditForm(doctor)
                    }
                  >
                    Edit
                  </button>

                  <button
                    style={
                      doctor.active
                        ? styles.deactivateButton
                        : styles.activateButton
                    }
                    onClick={() =>
                      toggleStatus(doctor)
                    }
                  >
                    {doctor.active
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  subtitle: {
    color: "#64748b",
    fontSize: "17px",
  },

  addButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "12px 20px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "15px",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "7px",
    marginBottom: "20px",
  },

  formCard: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    marginTop: "15px",
    marginBottom: "6px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "15px",
  },

  formButtons: {
    display: "flex",
    gap: "12px",
    marginTop: "25px",
  },

  saveButton: {
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  cancelButton: {
    border: "none",
    background: "#64748b",
    color: "white",
    padding: "11px 20px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.07)",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    background: "#dbeafe",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
  },

  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  specialization: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  editButton: {
    flex: 1,
    border: "none",
    background: "#2563eb",
    color: "white",
    padding: "10px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  deactivateButton: {
    flex: 1,
    border: "none",
    background: "#ef4444",
    color: "white",
    padding: "10px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  activateButton: {
    flex: 1,
    border: "none",
    background: "#16a34a",
    color: "white",
    padding: "10px",
    borderRadius: "7px",
    cursor: "pointer",
  },

  empty: {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default AdminDoctors;
