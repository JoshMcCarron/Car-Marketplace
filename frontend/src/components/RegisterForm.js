import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const FIELDS = [
  { name: "name",       label: "Full Name",     type: "text",     placeholder: "Alex Rivera", required: true },
  { name: "email",      label: "Email Address", type: "email",    placeholder: "you@email.com", required: true },
  { name: "password",   label: "Password",      type: "password", placeholder: "••••••••", required: true },
  { name: "address",    label: "Address",       type: "text",     placeholder: "123 Main St" },
  { name: "postalCode", label: "Postal Code",   type: "text",     placeholder: "K1A 0A6" },
  { name: "city",       label: "City",          type: "text",     placeholder: "Ottawa" },
  { name: "province",   label: "Province",      type: "text",     placeholder: "ON" },
  { name: "phoneNum",   label: "Phone Number",  type: "text",     placeholder: "613-555-0100" },
];

const RegisterForm = ({ onLogin }) => {
  const [formData, setFormData] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.name, ""]))
  );
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/auth/register", formData);
      onLogin(response.data);
    } catch (err) {
      setError(
        err.response?.status === 409
          ? "An account with that email already exists."
          : "Error registering. Please try again."
      );
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-card__title">Create your account</h2>
        <p className="auth-card__lede">Save vehicles, track orders, and chat with sellers.</p>
        {error && <p className="auth-card__error">{error}</p>}
        <div className="auth-card__form">
          {FIELDS.map((f) => (
            <label key={f.name} className="field">
              <span className="field__label">{f.label}</span>
              <input
                className="input"
                type={f.type}
                name={f.name}
                placeholder={f.placeholder}
                value={formData[f.name]}
                onChange={handleChange}
                required={f.required}
              />
            </label>
          ))}
          <button type="submit" className="btn btn--primary btn--lg" style={{ marginTop: 6 }}>
            Create account
          </button>
        </div>
        <div className="auth-card__foot">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
