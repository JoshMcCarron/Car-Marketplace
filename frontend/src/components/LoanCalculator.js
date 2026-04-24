import React, { useState } from "react";

const LoanCalculator = () => {
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanDuration) * 12;
    const loanAmount = price - down;

    if (loanAmount <= 0 || isNaN(rate) || isNaN(months) || months <= 0) {
      alert("Please enter valid values.");
      return;
    }

    let payment;
    if (rate === 0) {
      payment = loanAmount / months;
    } else {
      payment =
        (loanAmount * rate * Math.pow(1 + rate, months)) /
        (Math.pow(1 + rate, months) - 1);
    }

    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "25px",
      borderRadius: "10px",
      border: "1px solid #D9D9D9",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      maxWidth: "500px",
      margin: "20px auto"
    }}>
      <h2 style={{
        color: "#335C67",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #D9D9D9"
      }}>
        Loan Calculator
      </h2>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Vehicle Price */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Vehicle Price ($)
          </label>
          <input
            type="number"
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Down Payment */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Down Payment ($)
          </label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Interest Rate */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Interest Rate (% per year)
          </label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.1"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Loan Duration */}
        <div>
          <label style={{
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Loan Duration (years)
          </label>
          <input
            type="number"
            value={loanDuration}
            onChange={(e) => setLoanDuration(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              fontSize: "16px"
            }}
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateLoan}
          style={{
            padding: "12px 20px",
            backgroundColor: "rgba(224, 159, 62, 0.88)",
            color: "#000",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            marginTop: "10px",
            transition: "background-color 0.2s",
            ":hover": {
              backgroundColor: "rgba(224, 159, 62, 1)"
            }
          }}
        >
          Calculate
        </button>

        {/* Results */}
        {monthlyPayment !== null && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#F5F5F5",
            borderRadius: "5px",
            textAlign: "center"
          }}>
            <h3 style={{
              color: "#335C67",
              margin: "0"
            }}>
              Estimated Monthly Payment: <span style={{ color: "#9E2A2B" }}>${monthlyPayment}</span>
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;