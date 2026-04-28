import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LandingPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/catalog");
    }
  }, [user, navigate]);

  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.heading}>Welcome to Car Marketplace</h1>
      <p style={styles.tagline}>Browse and purchase quality vehicles</p>

      {!user && (
        <div style={styles.buttonGroup}>
          <Link to="/login">
            <button style={styles.loginButton}>Login</button>
          </Link>
          <Link to="/register">
            <button style={styles.registerButton}>Register</button>
          </Link>
        </div>
      )}
    </div>
  );
}

const styles = {
  homeContainer: {
    textAlign: "center",
    padding: "80px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "60px",
    fontWeight: "600",
    marginBottom: "20px",
  },
  tagline: {
    fontSize: "22px",
    color: "#5A5A5A",
    marginBottom: "50px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "200px",
  },
  loginButton: {
    padding: "16px 32px",
    backgroundColor: "#9E2A2B",
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  registerButton: {
    padding: "16px 32px",
    backgroundColor: "#E09F3E",
    color: "white",
    fontSize: "20px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};

export default LandingPage;
