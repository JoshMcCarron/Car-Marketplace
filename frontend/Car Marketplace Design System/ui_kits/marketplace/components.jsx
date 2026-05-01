// Reusable atoms shared across all screens.
const { useState } = React;

function Logo({ inverse, size = "md" }) {
  const big = size === "lg";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div className="nav__mark" style={big ? { width: 44, height: 44, fontSize: 18 } : null}>CM</div>
      <span style={{ fontWeight: 800, fontSize: big ? 22 : 18, letterSpacing: "-0.02em", color: inverse ? "#fff" : "var(--color-fg-1)" }}>
        CarMarketplace
      </span>
    </div>
  );
}

function Button({ kind = "primary", size, children, onClick, type, disabled, style }) {
  const cls = ["btn", `btn--${kind}`, size ? `btn--${size}` : ""].filter(Boolean).join(" ");
  return <button type={type || "button"} className={cls} onClick={onClick} disabled={disabled} style={style}>{children}</button>;
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  );
}

function Badge({ kind = "sale", children }) {
  return <span className={`badge badge--${kind}`}>{children}</span>;
}

function Chip({ children, danger, onRemove }) {
  return (
    <span className={`chip ${danger ? "chip--danger" : ""}`}>
      {children}
      {onRemove && <span className="chip__x" onClick={onRemove}>×</span>}
    </span>
  );
}

function Stars({ n }) {
  return <span className="review__stars">{"★★★★★".slice(0, n)}<span style={{ color: "var(--color-n300)" }}>{"★★★★★".slice(n)}</span></span>;
}

function VehicleImage({ label = "Vehicle Image", style }) {
  return (
    <div className="veh-card__media" style={style}>
      <span style={{ display:"flex", alignItems:"center", gap:6 }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>
        {label}
      </span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Logo inverse size="lg" />
            <p style={{ color: "var(--color-n300)", fontSize: 14, lineHeight: 1.6, marginTop: 14, maxWidth: 320 }}>
              Browse and purchase quality vehicles. Trusted listings, transparent pricing.
            </p>
          </div>
          <div><h5>Shop</h5><ul><li>Catalog</li><li>Hot Deals</li><li>Loan Calculator</li></ul></div>
          <div><h5>Account</h5><ul><li>Cart</li><li>Orders</li><li>Login</li></ul></div>
          <div><h5>Help</h5><ul><li>Chat</li><li>FAQ</li><li>Contact</li></ul></div>
        </div>
        <div className="footer__low"><span>© 2026 Car Marketplace</span><span>Made for the road.</span></div>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Button, Field, Badge, Chip, Stars, VehicleImage, Footer });
