import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const Payment = () => {
  const { state } = useLocation();
  const navigate  = useNavigate();
  const totalPrice = state?.totalPrice || 0;
  const userId     = state?.userId;
  const vehicles   = state?.vehicles || [];

  const [status, setStatus]           = useState(null);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData]       = useState({
    name: "", email: "", address: "", cardNumber: "", expiryDate: "", cvv: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus("warn");
    try {
      await api.post(`/users/${userId}/cart/checkout`);
      setIsSuccess(true);
      setStatus("success");
      setTimeout(() => navigate("/catalog"), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || "Payment failed. Please try again.";
      setIsSuccess(false);
      setStatus("danger");
      setFormData((prev) => ({ ...prev, _msg: msg }));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container">
      <div className="pay-grid">
        {/* Form */}
        <form className="pay-form" onSubmit={handlePayment}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
            Complete your purchase
          </h1>

          <div className="pay-section">
            <h3 className="pay-section__title">Personal Info</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label className="field">
                <span className="field__label">Full Name</span>
                <input className="input" name="name" value={formData.name} onChange={handleChange} required />
              </label>
              <label className="field">
                <span className="field__label">Email</span>
                <input className="input" type="email" name="email" value={formData.email} onChange={handleChange} required />
              </label>
              <label className="field">
                <span className="field__label">Billing Address</span>
                <input className="input" name="address" value={formData.address} onChange={handleChange} required />
              </label>
            </div>
          </div>

          <div className="pay-section">
            <h3 className="pay-section__title">Payment Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label className="field">
                <span className="field__label">Card Number</span>
                <input className="input" name="cardNumber" placeholder="1234 5678 9012 3456"
                  maxLength="16" value={formData.cardNumber} onChange={handleChange} required />
              </label>
              <div style={{ display: "flex", gap: 12 }}>
                <label className="field" style={{ flex: 1 }}>
                  <span className="field__label">Expiry</span>
                  <input className="input" name="expiryDate" placeholder="MM/YY" maxLength="5"
                    value={formData.expiryDate} onChange={handleChange} required />
                </label>
                <label className="field" style={{ flex: 1 }}>
                  <span className="field__label">CVV</span>
                  <input className="input" name="cvv" placeholder="123" maxLength="3"
                    value={formData.cvv} onChange={handleChange} required />
                </label>
              </div>
            </div>
          </div>

          {status === "warn"    && <div className="alert alert--warn">Processing payment…</div>}
          {status === "success" && <div className="alert alert--success">Payment successful! Redirecting…</div>}
          {status === "danger"  && <div className="alert alert--danger">{formData._msg}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <button type="button" className="btn btn--outline"
              onClick={() => navigate("/cart")} disabled={isProcessing || isSuccess}>
              Back to Cart
            </button>
            <button type="submit" className="btn btn--primary btn--lg"
              disabled={isProcessing || isSuccess} style={{ flex: 1 }}>
              {isProcessing ? "Processing…" : `Pay $${Number(totalPrice).toLocaleString()}`}
            </button>
          </div>
        </form>

        {/* Order summary */}
        <aside className="pay-summary">
          <h3>Order Summary</h3>
          {vehicles.length > 0 ? (
            vehicles.map((v) => (
              <div key={v.vehicleID} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0", borderBottom: "1px solid var(--color-yellow-line)", fontSize: 14
              }}>
                <span>
                  {v.brand} {v.model || v.shape}{" "}
                  <span style={{ color: "var(--color-fg-3)" }}>· {v.modelYear}</span>
                </span>
                <span style={{ fontWeight: 600 }}>${Number(v.price).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <p style={{ fontSize: 14, color: "var(--color-fg-3)" }}>No items to display.</p>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 18, fontWeight: 700 }}>
            <span>Total</span>
            <span>${Number(totalPrice).toLocaleString()}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-fg-3)", marginTop: 16 }}>
            30‑day return guarantee. Secure checkout.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Payment;
