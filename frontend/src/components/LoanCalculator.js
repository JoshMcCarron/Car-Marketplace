import React, { useState } from "react";

const LoanCalculator = () => {
  const [vehiclePrice, setVehiclePrice] = useState("");
  const [downPayment,  setDownPayment]  = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanDuration, setLoanDuration] = useState("");
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState("");

  const calculate = () => {
    setError("");
    const price  = parseFloat(vehiclePrice);
    const down   = parseFloat(downPayment)  || 0;
    const rate   = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(loanDuration)   * 12;
    const loan   = price - down;

    if (!price || price <= 0)         { setError("Enter a valid vehicle price.");    return; }
    if (loan <= 0)                    { setError("Down payment exceeds vehicle price."); return; }
    if (isNaN(months) || months <= 0) { setError("Enter a valid loan duration.");    return; }

    const monthly = rate === 0
      ? loan / months
      : (loan * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);

    setResult({
      monthly:  monthly.toFixed(2),
      total:    (monthly * months).toFixed(2),
      interest: (monthly * months - loan).toFixed(2),
    });
  };

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 600 }}>
      <h1 className="section-title">Loan Calculator</h1>
      <div className="card" style={{ padding: "28px 32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <label className="field">
            <span className="field__label">Vehicle Price ($)</span>
            <input
              className="input"
              type="number"
              min="0"
              placeholder="e.g. 35000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Down Payment ($)</span>
            <input
              className="input"
              type="number"
              min="0"
              placeholder="e.g. 5000"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Annual Interest Rate (%)</span>
            <input
              className="input"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 4.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </label>

          <label className="field">
            <span className="field__label">Loan Duration (years)</span>
            <input
              className="input"
              type="number"
              min="1"
              max="10"
              placeholder="e.g. 5"
              value={loanDuration}
              onChange={(e) => setLoanDuration(e.target.value)}
            />
          </label>

          {error && <div className="alert alert--danger">{error}</div>}

          <button className="btn btn--primary btn--lg" onClick={calculate}>
            Calculate
          </button>
        </div>

        {result && (
          <div style={{
            marginTop: 24, padding: "20px 24px",
            background: "var(--color-bg-tinted)", border: "1px solid var(--color-yellow-line)",
            borderRadius: "var(--radius-md)",
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-fg-3)", marginBottom: 12 }}>
              Estimate
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Monthly</div>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>${Number(result.monthly).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Total Cost</div>
                <div style={{ fontSize: 22, fontWeight: 700 }}>${Number(result.total).toLocaleString()}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--color-fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Interest</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--color-fg-2)" }}>${Number(result.interest).toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCalculator;
