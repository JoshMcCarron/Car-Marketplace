function PaymentPage({ cart, navigate, onComplete }) {
  const [status, setStatus] = useState(null);
  const total = cart.reduce((s, v) => s + (v.onSale ? v.salePrice : v.price), 0);
  const submit = (e) => {
    e.preventDefault();
    setStatus("processing");
    setTimeout(() => { setStatus("success"); setTimeout(onComplete, 1200); }, 800);
  };
  return (
    <div className="container">
      <div className="pay-grid">
        <form className="pay-form" onSubmit={submit}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 20px" }}>Complete your purchase</h1>

          <div className="pay-section">
            <h3 className="pay-section__title">Personal Info</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Full Name"><input className="input" required defaultValue="Alex Rivera"/></Field>
              <Field label="Email"><input className="input" type="email" required defaultValue="alex@email.com"/></Field>
              <Field label="Billing Address"><input className="input" required defaultValue="123 Market St, Toronto"/></Field>
            </div>
          </div>

          <div className="pay-section">
            <h3 className="pay-section__title">Payment Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Card Number"><input className="input" maxLength="19" required defaultValue="4242 4242 4242 4242"/></Field>
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}><Field label="Expiry"><input className="input" maxLength="5" required defaultValue="08/28"/></Field></div>
                <div style={{ flex: 1 }}><Field label="CVV"><input className="input" maxLength="3" required defaultValue="123"/></Field></div>
              </div>
            </div>
          </div>

          {status === "processing" && <div className="alert alert--warn">Processing payment…</div>}
          {status === "success" && <div className="alert alert--success">Payment successful! Redirecting…</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
            <Button kind="outline" onClick={() => navigate("cart")} type="button">Back to Cart</Button>
            <Button kind="primary" size="lg" type="submit" disabled={status === "processing" || status === "success"} style={{ flex: 1 }}>
              Pay ${total.toLocaleString()}
            </Button>
          </div>
        </form>

        <aside className="pay-summary">
          <h3>Order Summary</h3>
          {cart.map(v => (
            <div key={v.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-yellow-line)", fontSize: 14 }}>
              <span>{v.brand} {v.model} <span style={{ color: "var(--color-fg-3)" }}>· {v.modelYear}</span></span>
              <span style={{ fontWeight: 600 }}>${(v.onSale ? v.salePrice : v.price).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontSize: 18, fontWeight: 700 }}>
            <span>Total</span><span>${total.toLocaleString()}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-fg-3)", marginTop: 16 }}>30‑day return guarantee. Secure checkout.</p>
        </aside>
      </div>
    </div>
  );
}
window.PaymentPage = PaymentPage;
