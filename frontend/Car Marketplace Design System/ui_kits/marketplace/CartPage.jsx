function CartPage({ cart, navigate, onRemove }) {
  const total = cart.reduce((s, v) => s + (v.onSale ? v.salePrice : v.price), 0);
  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <div className="card" style={{ padding: 60, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontSize: 28, margin: "0 0 8px" }}>Your cart is empty</h1>
          <p style={{ color: "var(--color-fg-2)", marginBottom: 24 }}>Looks like you haven't added any vehicles yet.</p>
          <Button kind="primary" size="lg" onClick={() => navigate("catalog")}>Browse Catalog</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="container" style={{ padding: "32px 0", maxWidth: 880 }}>
      <h1 className="section-title">Your Cart ({cart.length} {cart.length === 1 ? "item" : "items"})</h1>
      <div className="card" style={{ padding: "8px 16px" }}>
        {cart.map(v => (
          <div key={v.id} className="cart-row">
            <div className="cart-row__thumb"/>
            <div className="cart-row__info">
              <h3 className="cart-row__title">{v.brand} {v.model}</h3>
              <div className="cart-row__meta">{v.modelYear} · {v.mileage.toLocaleString()} km · {v.shape}</div>
            </div>
            <div className="cart-row__price">${(v.onSale ? v.salePrice : v.price).toLocaleString()}</div>
            <Button kind="ghost" size="sm" onClick={() => onRemove(v.id)}>Remove</Button>
          </div>
        ))}
      </div>
      <div className="total-bar">
        <div>
          <div className="total-bar__label">Total</div>
          <div style={{ fontSize: 12, color: "var(--color-n400)", marginTop: 2 }}>Includes taxes &amp; fees</div>
        </div>
        <div className="total-bar__price">${total.toLocaleString()}</div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
        <Button kind="outline" onClick={() => navigate("catalog")}>Continue shopping</Button>
        <Button kind="primary" size="lg" onClick={() => navigate("payment")}>Proceed to Checkout →</Button>
      </div>
    </div>
  );
}
window.CartPage = CartPage;
