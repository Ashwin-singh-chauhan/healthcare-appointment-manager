import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setError("");
    setLoading(true);

    try {

      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "token",
        response.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response)
      );

      // =========================
      // ROLE BASED REDIRECT
      // =========================

      if (response.role === "ADMIN") {

        navigate("/admin");

      } else if (response.role === "DOCTOR") {

        navigate("/doctor");

      } else {

        navigate("/dashboard");

      }

    } catch (err) {

      setError(err.message);

    } finally {

      setLoading(false);

    }
  }

  return (
    <div style={styles.page}>

      <form
        onSubmit={handleSubmit}
        style={styles.card}
      >

        <h1>Welcome Back</h1>

        <p style={styles.subtitle}>
          Login to manage your appointments.
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <label>Email</label>

        <input
          type="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={styles.input}
        />

        <label>Password</label>

        <input
          type="password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={styles.input}
        />

        <button
          type="submit"
          disabled={loading}
          style={styles.button}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8fafc",
    fontFamily: "Arial, sans-serif",
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "white",
    borderRadius: "12px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  subtitle: {
    color: "#64748b",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "18px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
  },

  button: {
    width: "100%",
    padding: "13px",
    border: "none",
    borderRadius: "7px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
  },
};

export default Login;