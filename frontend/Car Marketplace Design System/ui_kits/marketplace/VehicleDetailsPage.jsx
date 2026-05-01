function VehicleDetailsPage({ vehicleId, navigate, onAddToCart }) {
  const v = window.MOCK_VEHICLES.find(x => x.id === vehicleId) || window.MOCK_VEHICLES[0];
  const [showCO2, setShowCO2] = useState(false);
  const price = v.onSale ? v.salePrice : v.price;
  return (
    <div className="container">
      <div style={{ padding: "16px 0", color: "var(--color-fg-3)", fontSize: 13 }}>
        <a onClick={() => navigate("catalog")} style={{ cursor:"pointer" }}>Catalog</a> / <span>{v.brand} {v.model}</span>
      </div>
      <div className="detail-hero">
        <div className="detail-image">
          <span style={{ display:"flex", alignItems:"center", gap:8 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>
            {v.brand} {v.model}
          </span>
        </div>
        <div>
          <div className="eyebrow">{v.onSale ? "Hot Deal" : "Featured Vehicle"}</div>
          <h1 style={{ fontSize: 36, fontWeight: 700, margin: "4px 0 16px", letterSpacing: "-0.01em" }}>
            {v.brand} {v.model} <span style={{ color: "var(--color-fg-3)", fontWeight: 500 }}>{v.modelYear}</span>
          </h1>

          <div className={`price-card ${v.onSale ? "price-card--sale" : ""}`}>
            <div>
              <div style={{ fontSize: 12, color: v.onSale ? "var(--color-sale)" : "var(--color-fg-3)", textTransform:"uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{v.onSale ? "Sale Price" : "Listing Price"}</div>
              <div className={`price-card__price ${v.onSale ? "price-card__price--sale" : ""}`}>${price.toLocaleString()}</div>
              {v.onSale && <div style={{ fontSize: 14, color: "var(--color-fg-3)", textDecoration: "line-through" }}>${v.price.toLocaleString()}</div>}
            </div>
            {v.onSale && <Badge kind="sale">🔥 Hot Deal</Badge>}
          </div>

          <div className="specs-grid" style={{ marginBottom: 24 }}>
            <div className="spec"><div className="spec__label">Body</div><div className="spec__value">{v.shape}</div></div>
            <div className="spec"><div className="spec__label">History</div><div className="spec__value">{v.history}</div></div>
            <div className="spec"><div className="spec__label">Mileage</div><div className="spec__value">{v.mileage.toLocaleString()} km</div></div>
            <div className="spec" style={{ background: showCO2 ? "var(--color-yellow-soft)" : "var(--color-white)", borderColor: showCO2 ? "var(--color-yellow-line)" : "var(--color-border)", cursor:"pointer" }} onClick={() => setShowCO2(!showCO2)}>
              <div className="spec__label">CO₂ Emission</div>
              <div className="spec__value">{showCO2 ? v.co2 : "Tap to reveal →"}</div>
            </div>
            <div className="spec"><div className="spec__label">Fuel Usage</div><div className="spec__value">{v.fuelUsage} L/100km</div></div>
            <div className="spec"><div className="spec__label">Year</div><div className="spec__value">{v.modelYear}</div></div>
          </div>

          <Button kind="primary" size="lg" onClick={() => onAddToCart(v)}>Add to Cart · ${price.toLocaleString()}</Button>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 12px" }}>About this vehicle</h2>
        <p style={{ color: "var(--color-fg-2)", lineHeight: 1.6, margin: 0 }}>
          A well‑maintained {v.modelYear} {v.brand} {v.model} in {v.shape.toLowerCase()} configuration.
          History: {v.history.toLowerCase()}. Comes with full service records and a 30‑day return guarantee.
        </p>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 16px" }}>Buyer Reviews · {window.MOCK_REVIEWS.length}</h2>
        {window.MOCK_REVIEWS.map(r => (
          <div key={r.id} className="review">
            <div className="review__head">
              <div className="review__avatar">{r.initial}</div>
              <div className="review__name">{r.author}</div>
              <Stars n={r.stars} />
            </div>
            <p style={{ margin: 0, color: "var(--color-fg-2)", lineHeight: 1.55, fontSize: 14 }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
window.VehicleDetailsPage = VehicleDetailsPage;
