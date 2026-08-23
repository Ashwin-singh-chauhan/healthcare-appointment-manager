import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://healthcare-appointment-manager-nlir.onrender.com";

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


  /* =========================
     LOAD DOCTORS
  ========================= */

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


  /* =========================
     FORM
  ========================= */

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


  /* =========================
     ADD / EDIT
  ========================= */

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
          text ||
          `Request failed: ${response.status}`
        );

      }

      closeForm();

      await loadDoctors();

    } catch (err) {

      setError(err.message);

    }
  }


  /* =========================
     TOGGLE STATUS
  ========================= */

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
          text ||
          `Request failed: ${response.status}`
        );

      }

      await loadDoctors();

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
              HealthCare
              <span style={styles.brandAccent}>+</span>
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
            style={styles.backButton}
            onClick={() =>
              navigate("/admin")
            }
          >
            ← Back to Admin
          </button>

        </div>

      </nav>


      {/* =========================
          MAIN
      ========================= */}

      <main style={styles.container}>

        {/* HEADER */}

        <div style={styles.header}>

          <div>

            <div style={styles.eyebrow}>
              STAFF MANAGEMENT
            </div>

            <h1 style={styles.title}>
              Manage Doctors
            </h1>

            <p style={styles.subtitle}>
              Add, edit and manage healthcare
              professionals across your hospital.
            </p>

          </div>


          <div style={styles.headerRight}>

            <div style={styles.doctorCount}>

              <strong>
                {doctors.length}
              </strong>

              <span>
                Doctors
              </span>

            </div>

            <button
              style={styles.addButton}
              onClick={openAddForm}
            >
              <span style={styles.plus}>
                +
              </span>
              Add Doctor
            </button>

          </div>

        </div>


        {/* ERROR */}

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


        {/* =========================
            FORM
        ========================= */}

        {showForm && (

          <div style={styles.formCard}>

            <div style={styles.formHeader}>

              <div style={styles.formIcon}>
                {editingDoctor
                  ? "✎"
                  : "+"}
              </div>

              <div>

                <div style={styles.formEyebrow}>
                  DOCTOR PROFILE
                </div>

                <h2 style={styles.formTitle}>
                  {editingDoctor
                    ? "Edit Doctor"
                    : "Add New Doctor"}
                </h2>

                <p style={styles.formSubtitle}>
                  {editingDoctor
                    ? "Update the doctor's professional information."
                    : "Enter the doctor's details to create a new profile."}
                </p>

              </div>

            </div>


            <form onSubmit={handleSubmit}>

              <div style={styles.formGrid}>

                {/* NAME */}

                <div style={styles.field}>

                  <label style={styles.label}>
                    Doctor Name
                  </label>

                  <div style={styles.inputWrapper}>

                    <span style={styles.inputIcon}>
                      👨‍⚕️
                    </span>

                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Dr. Priya Mehta"
                      required
                      style={styles.input}
                    />

                  </div>

                </div>


                {/* SPECIALIZATION */}

                <div style={styles.field}>

                  <label style={styles.label}>
                    Specialization
                  </label>

                  <div style={styles.inputWrapper}>

                    <span style={styles.inputIcon}>
                      🩺
                    </span>

                    <input
                      name="specialization"
                      value={form.specialization}
                      onChange={handleChange}
                      placeholder="Cardiology"
                      required
                      style={styles.input}
                    />

                  </div>

                </div>


                {/* EMAIL */}

                <div style={styles.field}>

                  <label style={styles.label}>
                    Email Address
                  </label>

                  <div style={styles.inputWrapper}>

                    <span style={styles.inputIcon}>
                      ✉
                    </span>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="doctor@healthcare.com"
                      required
                      style={styles.input}
                    />

                  </div>

                </div>


                {/* PHONE */}

                <div style={styles.field}>

                  <label style={styles.label}>
                    Phone Number
                  </label>

                  <div style={styles.inputWrapper}>

                    <span style={styles.inputIcon}>
                      ☎
                    </span>

                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      required
                      style={styles.input}
                    />

                  </div>

                </div>

              </div>


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


        {/* =========================
            DOCTOR LIST
        ========================= */}

        <div style={styles.listHeader}>

          <div>

            <div style={styles.listEyebrow}>
              MEDICAL STAFF
            </div>

            <h2 style={styles.listTitle}>
              Doctor Directory
            </h2>

          </div>

          <div style={styles.directoryInfo}>
            {doctors.filter(
              (doctor) => doctor.active
            ).length}{" "}
            active doctors
          </div>

        </div>


        {loading ? (

          <div style={styles.loading}>

            <div style={styles.spinner}></div>

            <h3 style={styles.loadingTitle}>
              Loading doctors
            </h3>

            <p style={styles.loadingText}>
              Fetching the latest doctor directory...
            </p>

          </div>

        ) : doctors.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              👨‍⚕️
            </div>

            <h3 style={styles.emptyTitle}>
              No doctors found
            </h3>

            <p style={styles.emptyText}>
              Add your first doctor to start managing
              the medical staff.
            </p>

            <button
              onClick={openAddForm}
              style={styles.emptyButton}
            >
              + Add Doctor
            </button>

          </div>

        ) : (

          <div style={styles.grid}>

            {doctors.map((doctor) => (

              <div
                key={doctor.id}
                style={styles.card}
              >

                {/* CARD TOP */}

                <div style={styles.cardTop}>

                  <div style={styles.doctorIdentity}>

                    <div style={styles.avatar}>

                      {doctor.name
                        ?.charAt(0)
                        ?.toUpperCase()}

                    </div>

                    <div>

                      <div style={styles.doctorId}>
                        DOCTOR #{doctor.id}
                      </div>

                      <h2 style={styles.doctorName}>
                        {doctor.name}
                      </h2>

                    </div>

                  </div>


                  <span
                    style={{
                      ...styles.status,
                      background: doctor.active
                        ? "#CBEBDD"
                        : "#F7DCDC",
                      color: doctor.active
                        ? "#126442"
                        : "#963D3D",
                      borderColor: doctor.active
                        ? "#9DD3B7"
                        : "#E5B6B6",
                    }}
                  >

                    <span
                      style={{
                        ...styles.statusDot,
                        background: doctor.active
                          ? "#16805C"
                          : "#C94C4C",
                      }}
                    ></span>

                    {doctor.active
                      ? "ACTIVE"
                      : "INACTIVE"}

                  </span>

                </div>


                {/* SPECIALIZATION */}

                <div style={styles.specializationBox}>

                  <span style={styles.specializationIcon}>
                    🩺
                  </span>

                  <div>

                    <div style={styles.specializationLabel}>
                      SPECIALIZATION
                    </div>

                    <div style={styles.specialization}>
                      {doctor.specialization}
                    </div>

                  </div>

                </div>


                {/* CONTACT */}

                <div style={styles.contactList}>

                  <div style={styles.contactItem}>

                    <span style={styles.contactIcon}>
                      ✉
                    </span>

                    <span>
                      {doctor.email}
                    </span>

                  </div>


                  <div style={styles.contactItem}>

                    <span style={styles.contactIcon}>
                      ☎
                    </span>

                    <span>
                      {doctor.phone}
                    </span>

                  </div>

                </div>


                {/* ACTIONS */}

                <div style={styles.actions}>

                  <button
                    style={styles.editButton}
                    onClick={() =>
                      openEditForm(doctor)
                    }
                  >
                    ✎ Edit
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "46px 30px 70px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
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

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  doctorCount: {
    minWidth: "75px",
    padding: "9px 13px",
    borderRadius: "11px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  doctorCountStrong: {
    color: "#123B4A",
    fontSize: "21px",
    fontWeight: "800",
  },

  addButton: {
    border: "none",
    background: "#087F8C",
    color: "#FFFFFF",
    padding: "12px 19px",
    borderRadius: "9px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "750",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.25)",
    display: "flex",
    alignItems: "center",
    gap: "7px",
  },

  plus: {
    fontSize: "20px",
    lineHeight: "1",
  },


  /* =========================
     ERROR
  ========================= */

  error: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "#F7DCDC",
    color: "#8E3838",
    padding: "14px 17px",
    borderRadius: "12px",
    border: "1px solid #E6B5B5",
    marginBottom: "24px",
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

  errorText: {
    marginTop: "3px",
    fontSize: "12px",
  },


  /* =========================
     FORM
  ========================= */

  formCard: {
    background: "#C9E4E5",
    padding: "29px",
    borderRadius: "18px",
    border: "1px solid #9CCBCD",
    boxShadow:
      "0 8px 25px rgba(18,59,74,0.10)",
    marginBottom: "36px",
  },

  formHeader: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    marginBottom: "24px",
  },

  formIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "12px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.22)",
  },

  formEyebrow: {
    color: "#087F8C",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "1.4px",
  },

  formTitle: {
    margin: "2px 0 0",
    color: "#123B4A",
    fontSize: "21px",
  },

  formSubtitle: {
    margin: "4px 0 0",
    color: "#557078",
    fontSize: "12px",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
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
    background: "#EAF7F6",
    border: "1px solid #8DBFC2",
    borderRadius: "10px",
    overflow: "hidden",
  },

  inputIcon: {
    paddingLeft: "12px",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 12px 12px 9px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#123B4A",
    fontSize: "14px",
  },

  formButtons: {
    display: "flex",
    gap: "10px",
    marginTop: "23px",
  },

  saveButton: {
    border: "none",
    background: "#087F8C",
    color: "#FFFFFF",
    padding: "11px 19px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "750",
    fontSize: "13px",
    boxShadow:
      "0 4px 10px rgba(8,127,140,0.2)",
  },

  cancelButton: {
    border: "1px solid #8DBFC2",
    background: "#EAF7F6",
    color: "#45636B",
    padding: "11px 19px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
  },


  /* =========================
     LIST
  ========================= */

  listHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "19px",
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
    fontSize: "24px",
    fontWeight: "750",
  },

  directoryInfo: {
    color: "#16805C",
    background: "#CBEBDD",
    border: "1px solid #9DD3B7",
    padding: "7px 11px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "750",
  },


  /* =========================
     DOCTOR GRID
  ========================= */

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#EAF7F6",
    padding: "23px",
    borderRadius: "17px",
    border: "1px solid #A8D2D4",
    boxShadow:
      "0 8px 24px rgba(18,59,74,0.08)",
  },

  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  doctorIdentity: {
    display: "flex",
    alignItems: "center",
    gap: "11px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    borderRadius: "15px",
    background: "#087F8C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    fontWeight: "800",
    boxShadow:
      "0 5px 13px rgba(8,127,140,0.2)",
  },

  doctorId: {
    color: "#6B858B",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "1px",
    marginBottom: "2px",
  },

  doctorName: {
    margin: 0,
    color: "#123B4A",
    fontSize: "18px",
    fontWeight: "750",
  },

  status: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 9px",
    borderRadius: "20px",
    border: "1px solid",
    fontSize: "9px",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
  },


  /* =========================
     SPECIALIZATION
  ========================= */

  specializationBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "11px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
  },

  specializationIcon: {
    width: "33px",
    height: "33px",
    borderRadius: "9px",
    background: "#B8DCDD",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  specializationLabel: {
    color: "#6A8389",
    fontSize: "8px",
    fontWeight: "800",
    letterSpacing: "0.8px",
  },

  specialization: {
    marginTop: "2px",
    color: "#087F8C",
    fontWeight: "750",
    fontSize: "13px",
  },


  /* =========================
     CONTACT
  ========================= */

  contactList: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },

  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    color: "#557078",
    fontSize: "12px",
    overflow: "hidden",
  },

  contactIcon: {
    width: "26px",
    height: "26px",
    borderRadius: "7px",
    background: "#C9E4E5",
    color: "#087F8C",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    fontSize: "12px",
  },


  /* =========================
     ACTIONS
  ========================= */

  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "9px",
    marginTop: "20px",
    paddingTop: "17px",
    borderTop: "1px solid #C2DDDE",
  },

  editButton: {
    border: "1px solid #8DBFC2",
    background: "#C9E4E5",
    color: "#123B4A",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "750",
  },

  deactivateButton: {
    border: "1px solid #E5B6B6",
    background: "#F7DCDC",
    color: "#963D3D",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "750",
  },

  activateButton: {
    border: "1px solid #9DD3B7",
    background: "#CBEBDD",
    color: "#126442",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "750",
  },


  /* =========================
     LOADING
  ========================= */

  loading: {
    background: "#EAF7F6",
    border: "1px solid #A8D2D4",
    borderRadius: "17px",
    padding: "60px 20px",
    textAlign: "center",
  },

  spinner: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "4px solid #B8DCDD",
    borderTop: "4px solid #087F8C",
    margin: "0 auto 17px",
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
    padding: "60px 25px",
    textAlign: "center",
  },

  emptyIcon: {
    width: "70px",
    height: "70px",
    borderRadius: "19px",
    background: "#C9E4E5",
    border: "1px solid #A8D2D4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 15px",
    fontSize: "29px",
  },

  emptyTitle: {
    margin: 0,
    color: "#123B4A",
    fontSize: "19px",
  },

  emptyText: {
    margin: "7px 0 17px",
    color: "#60777E",
    fontSize: "13px",
  },

  emptyButton: {
    border: "none",
    background: "#087F8C",
    color: "#FFFFFF",
    padding: "10px 17px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "750",
  },

};

export default AdminDoctors;
