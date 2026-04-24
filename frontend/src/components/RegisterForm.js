import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RegisterForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    postalCode: "",
    city: "",
    province: "",
    phoneNum: "",
    role: "USER",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://18.214.94.81:8080/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const loginResponse = await fetch("http://18.214.94.81:8080/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (loginResponse.ok) {
          const loggedInUser = await loginResponse.json();
          localStorage.setItem("user", JSON.stringify(loggedInUser));
          onLogin(loggedInUser);
        } else {
          setMessage("Registration successful, but auto login failed. Please login manually.");
        }

        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          postalCode: "",
          city: "",
          province: "",
          phoneNum: "",
          role: "USER",
        });
      } else {
        setMessage("Error registering user.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Failed to connect to the server.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.welcomeTitle}>Welcome to Lebron James’ Cars!</h2>
      <h3 style={styles.title}>Register</h3>
      <form style={styles.form} onSubmit={handleSubmit}>
        {Object.keys(formData).map((key) => (
          key !== "role" && (
            <input
              key={key}
              type={key === "email" ? "email" : key === "password" ? "password" : "text"}
              name={key}
              placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
              value={formData[key]}
              onChange={handleChange}
              required={key === "name" || key === "email" || key === "password"}
              style={styles.input}
            />
          )
        ))}
        <button type="submit" style={styles.registerButton}>Register</button>
      </form>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <p style={styles.loginText}>
        <Link to="/" style={styles.loginLink}>Already have an account?</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "450px",
    margin: "2rem auto",
    padding: "50px 50px",
    borderRadius: "20px",
    backgroundColor: "#FFF3B0",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  welcomeTitle: {
    fontSize: "22px",
    color: "#2c5d63",
    fontWeight: "500",
    marginBottom: "10px",
  },
  title: {
    fontSize: "28px",
    color: "#2c5d63",
    marginBottom: "25px",
    fontWeight: "600",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    padding: "0",
  },
  input: {
    width: "420px",
    padding: "12px",
    border: "1px solid black",
    borderRadius: "10px",
    fontSize: "16px",
    backgroundColor: "white",
  },
  registerButton: {
    width: "150px",
    padding: "12px",
    backgroundColor: "#9E2A2B",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginTop: "10px",
    alignSelf: "center",
  },
  loginText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#000",
  },
  loginLink: {
    color: "#000",
    textDecoration: "underline",
    fontWeight: "500",
    marginLeft: "5px",
  },
};

export default RegisterForm;