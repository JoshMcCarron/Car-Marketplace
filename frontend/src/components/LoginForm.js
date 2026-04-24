import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    try {
      const response = await fetch("http://18.214.94.81:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const user = await response.json();
        onLogin(user);
        navigate("/catalog");
      } else {
        setMessage("Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.welcome}>Welcome back!</h2>
      <h3 style={styles.loginTitle}>Login</h3>
      {message && <p style={styles.message}>{message}</p>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>Email Address</label>
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button style={styles.loginButton} type="submit">
          Login
        </button>
      </form>

      <p style={styles.signupText}>
        Don't have an account?{" "}
        <Link to="/register" style={styles.signupLink}>
          Sign up here!
        </Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "auto",
    padding: "30px",
    borderRadius: "12px",
    backgroundColor: "#FFF3B0",
    textAlign: "center",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    marginTop: "30px",
  },
  welcome: {
    fontSize: "24px",
    color: "#5A5A5A",
  },
  loginTitle: {
    fontSize: "20px",
    color: "#5A5A5A",
    marginBottom: "15px",
  },
  message: {
    color: "red",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
  },
  label: {
    textAlign: "left",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  loginButton: {
    width: "150px",
    padding: "10px",
    borderRadius: "5px",
    backgroundColor: "#9E2A2B",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    marginTop: "10px",
    transition: "0.3s",
    alignSelf: "center",
  },
  signupText: {
    marginTop: "10px",
    fontSize: "14px",
    color: "#333",
  },
  signupLink: {
    color: "#007bff",
    textDecoration: "underline",
    fontWeight: "bold",
  },
};

export default LoginForm;