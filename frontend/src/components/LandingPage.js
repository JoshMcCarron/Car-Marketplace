import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllUsers } from "../services/userService";
import lebronImage from '../img/lebron.jpg';

function LandingPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user) {
      navigate("/catalog"); // Redirect logged-in users to the catalog
    } else {
      getAllUsers().then(setUsers); // Fetch registered users only if not logged in
    }
  }, [user, navigate]);

  return (
    <div style={styles.homeContainer}>
      <h1 style={styles.heading}>Welcome to Lebron James' Cars</h1>

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

      <img
        src={lebronImage}
        alt="Lebron"
        style={styles.lebronImage}
      />
    </div>
  );
}

const styles = {
  homeContainer: {
    textAlign: "center",
    padding: "40px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  heading: {
    fontSize: "60px",
    fontWeight: "600",
    marginBottom: "50px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "200px",
    marginBottom: "0px", 
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
    ":hover": {
      transform: "scale(1.05)",
    },
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
    ":hover": {
      transform: "scale(1.05)",
    },
  },
  lebronImage: {
    width: "1000px",
    maxWidth: "90%",
    marginTop: "0px", 
  },
};

export default LandingPage;