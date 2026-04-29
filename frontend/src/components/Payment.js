import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalPrice = location.state?.totalPrice || 0;
  const userId = location.state?.userId;
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus("Processing payment...");

    try {
      await api.post(`/users/${userId}/cart/checkout`);
      setIsSuccess(true);
      setPaymentStatus("Payment successful! Redirecting...");
      setTimeout(() => navigate("/catalog"), 2000);
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data || "Payment failed. Please try again.";
      setIsSuccess(false);
      setPaymentStatus(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{
      maxWidth: "500px",
      margin: "40px auto",
      padding: "30px",
      backgroundColor: "#FFFFFF",
      borderRadius: "10px",
      border: "1px solid #D9D9D9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{
        color: "#335C67",
        marginBottom: "25px",
        paddingBottom: "10px",
        borderBottom: "1px solid #D9D9D9",
        fontSize: "24px"
      }}>
        Complete Your Purchase
      </h2>

      <div style={{
        backgroundColor: "#F5F5F5",
        padding: "15px",
        borderRadius: "5px",
        marginBottom: "25px",
        textAlign: "center"
      }}>
        <p style={{ margin: "0", color: "#666" }}>Total Amount Due</p>
        <p style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#9E2A2B",
          margin: "5px 0 0 0"
        }}>
          ${Number(totalPrice).toFixed(2)}
        </p>
      </div>

      <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <h3 style={{
            color: "#335C67",
            fontSize: "18px",
            marginBottom: "15px",
            paddingBottom: "5px",
            borderBottom: "1px solid #F0F0F0"
          }}>
            Personal Information
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>Billing Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
              />
            </div>
          </div>
        </div>

        <div>
          <h3 style={{
            color: "#335C67",
            fontSize: "18px",
            marginBottom: "15px",
            paddingBottom: "5px",
            borderBottom: "1px solid #F0F0F0"
          }}>
            Payment Details
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
              />
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: "1" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
                />
              </div>
              <div style={{ flex: "1" }}>
                <label style={{ display: "block", marginBottom: "5px", color: "#333", fontSize: "14px" }}>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  maxLength="3"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "5px", border: "1px solid #D9D9D9", fontSize: "16px" }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing || isSuccess}
          style={{
            padding: "15px",
            backgroundColor: "rgba(224, 159, 62, 0.88)",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: isProcessing || isSuccess ? "not-allowed" : "pointer",
            fontSize: "18px",
            fontWeight: "500",
            marginTop: "10px",
            transition: "background-color 0.2s",
          }}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/cart")}
          disabled={isProcessing || isSuccess}
          style={{
            padding: "12px",
            backgroundColor: "transparent",
            color: "#335C67",
            border: "1px solid #D9D9D9",
            borderRadius: "5px",
            cursor: isProcessing || isSuccess ? "not-allowed" : "pointer",
            fontSize: "16px",
          }}
        >
          Back to Cart
        </button>

        {paymentStatus && (
          <p style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: isSuccess ? "#E8F5E9" : "#FFF8E1",
            color: isSuccess ? "#2E7D32" : "#F57F17",
            borderRadius: "5px",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {paymentStatus}
          </p>
        )}
      </form>
    </div>
  );
};

export default Payment;
