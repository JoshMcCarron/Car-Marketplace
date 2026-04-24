import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const totalPrice = location.state?.totalPrice || 0;
  const [paymentStatus, setPaymentStatus] = useState(null);
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

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentStatus("Processing payment...");
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("Payment successful! Redirecting...");
      setTimeout(() => navigate("/catalog"), 2000);
      setIsProcessing(false);
    }, 1500);
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
          ${totalPrice.toFixed(2)}
        </p>
      </div>

      <form onSubmit={handlePayment} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Personal Information */}
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
              <label style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontSize: "14px"
              }}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #D9D9D9",
                  fontSize: "16px"
                }}
              />
            </div>
            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontSize: "14px"
              }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #D9D9D9",
                  fontSize: "16px"
                }}
              />
            </div>
            <div>
              <label style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontSize: "14px"
              }}>Billing Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #D9D9D9",
                  fontSize: "16px"
                }}
              />
            </div>
          </div>
        </div>

        {/* Payment Details */}
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
              <label style={{
                display: "block",
                marginBottom: "5px",
                color: "#333",
                fontSize: "14px"
              }}>Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                value={formData.cardNumber}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "5px",
                  border: "1px solid #D9D9D9",
                  fontSize: "16px"
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "15px" }}>
              <div style={{ flex: "1" }}>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                  fontSize: "14px"
                }}>Expiry Date</label>
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #D9D9D9",
                    fontSize: "16px"
                  }}
                />
              </div>
              <div style={{ flex: "1" }}>
                <label style={{
                  display: "block",
                  marginBottom: "5px",
                  color: "#333",
                  fontSize: "14px"
                }}>CVV</label>
                <input
                  type="text"
                  name="cvv"
                  placeholder="123"
                  maxLength="3"
                  value={formData.cvv}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "5px",
                    border: "1px solid #D9D9D9",
                    fontSize: "16px"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          style={{
            padding: "15px",
            backgroundColor: "rgba(224, 159, 62, 0.88)",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "500",
            marginTop: "10px",
            transition: "background-color 0.2s",
            ":hover": {
              backgroundColor: "rgba(224, 159, 62, 1)"
            }
          }}
        >
          {isProcessing ? "Processing..." : "Complete Payment"}
        </button>

        {paymentStatus && (
          <p style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: paymentStatus.includes("success") ? "#E8F5E9" : "#FFF8E1",
            color: paymentStatus.includes("success") ? "#2E7D32" : "#F57F17",
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