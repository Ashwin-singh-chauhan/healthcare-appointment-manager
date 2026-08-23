import { Link } from "react-router-dom";

function Home() {
  return (
    <div style={styles.page}>

      <nav style={styles.nav}>
        <h2>HealthCare+</h2>

        <div>
          <Link to="/login" style={styles.link}>
            Login
          </Link>

          <Link to="/register" style={styles.button}>
            Get Started
          </Link>
        </div>
      </nav>

      <main style={styles.hero}>

        <div>
          <p style={styles.badge}>
            ONLINE HEALTHCARE PLATFORM
          </p>

          <h1 style={styles.title}>
            Book your healthcare
            <br />
            appointment easily.
          </h1>

          <p style={styles.subtitle}>
            Find trusted doctors, check available
            time slots, and book appointments
            securely from one place.
          </p>

          <div>
            <Link to="/register" style={styles.primary}>
              Book an Appointment
            </Link>

            <Link to="/login" style={styles.secondary}>
              Login
            </Link>
          </div>
        </div>

      </main>

    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#F5FAF7",
  },

  nav: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 8%",
    background: "white",
    borderBottom: "1px solid #DCEBE2",
  },

  link: {
    marginRight: "20px",
    textDecoration: "none",
    color: "#334155",
  },

  button: {
    textDecoration: "none",
    background: "#4C9B6E",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
  },

  badge: {
    color: "#4C9B6E",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  primary: {
    display: "inline-block",
    textDecoration: "none",
    background: "#4C9B6E",
    color: "white",
    padding: "14px 24px",
    borderRadius: "8px",
  },

  secondary: {
    display: "inline-block",
    textDecoration: "none",
    color: "#4C9B6E",
    padding: "14px 24px",
  },
};
export default Home;
