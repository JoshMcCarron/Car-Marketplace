import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/login", formData);
      onLogin(response.data);
      navigate("/catalog");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-card__title">Welcome back!</h2>
        <p className="auth-card__lede">Sign in to access your cart and saved searches.</p>
        {error && <p className="auth-card__error">{error}</p>}
        <div className="auth-card__form">
          <label className="field">
            <span className="field__label">Email Address</span>
            <input className="input" type="email" name="email" placeholder="you@email.com"
              value={formData.email} onChange={handleChange} required />
          </label>
          <label className="field">
            <span className="field__label">Password</span>
            <input className="input" type="password" name="password" placeholder="••••••••"
              value={formData.password} onChange={handleChange} required />
          </label>
          <button type="submit" className="btn btn--primary btn--lg" style={{ marginTop: 6 }}>
            Login
          </button>
        </div>
        <div className="auth-card__foot">
          Don't have an account?{" "}
          <Link to="/register">Sign up here</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
