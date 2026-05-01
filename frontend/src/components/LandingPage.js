import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function LandingPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [hotDeals, setHotDeals] = useState([]);
  const [stats, setStats] = useState({ listings: null, brands: null, rating: null });

  useEffect(() => {
    if (user) navigate("/catalog");
  }, [user, navigate]);

  useEffect(() => {
    api.get("/vehicles")
      .then(async (r) => {
        const all = r.data;
        const listings = all.length;
        const brands   = new Set(all.map((v) => v.brand)).size;
        setStats((s) => ({ ...s, listings, brands }));
        setHotDeals(all.filter((v) => v.onSale).slice(0, 4));

        const reviewArrays = await Promise.all(
          all.map((v) =>
            api.get(`/vehicles/${v.vehicleID}/reviews`)
              .then((r) => r.data)
              .catch(() => [])
          )
        );
        const allReviews = reviewArrays.flat();
        if (allReviews.length > 0) {
          const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
          setStats((s) => ({ ...s, rating: avg.toFixed(1) }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="shell">
      {/* Landing-page nav (global nav is hidden on "/") */}
      <nav className="nav">
        <div className="container nav__inner">
          <div className="nav__brand" style={{ cursor: "default" }}>
            <div className="nav__mark">CM</div>
            <div className="nav__name">Car Marketplace</div>
          </div>
          <div className="nav__links">
            <Link to="/login" className="nav__link">Login</Link>
            <Link to="/register" className="btn btn--primary btn--sm" style={{ marginLeft: 6 }}>
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="eyebrow">{stats.listings ? `${stats.listings} vehicles` : "vehicles"} · updated daily</div>
          <h1 className="hero__title">
            Find your <em>next</em> car<br />without the runaround.
          </h1>
          <p className="hero__lede">
            Browse and purchase quality vehicles from trusted sellers. Transparent pricing,
            real history, instant chat support.
          </p>
          <div className="hero__ctas">
            <Link to="/login" className="btn btn--primary btn--lg">Browse Catalog</Link>
            <Link to="/register" className="btn btn--outline btn--lg">Create an Account</Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">{stats.listings ?? "—"}</span>
              <span className="hero__stat-label">Listings</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">{stats.brands ?? "—"}</span>
              <span className="hero__stat-label">Brands</span>
            </div>
            {stats.rating && (
              <div className="hero__stat">
                <span className="hero__stat-num">{stats.rating}★</span>
                <span className="hero__stat-label">Buyer Rating</span>
              </div>
            )}
            <div className="hero__stat">
              <span className="hero__stat-num">24/7</span>
              <span className="hero__stat-label">Chat Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hot deals */}
      {hotDeals.length > 0 && (
        <section style={{ background: "var(--color-white)", padding: "80px 0" }}>
          <div className="container">
            <div className="eyebrow">Featured</div>
            <h2 className="section-title">This week's hot deals</h2>
            <div className="veh-grid">
              {hotDeals.map((v) => (
                <Link to="/login" key={v.vehicleID} className="veh-card veh-card--sale" style={{ textDecoration: "none" }}>
                  <div className="veh-card__media">
                    <span>🚗 {v.brand} {v.shape}</span>
                    <div className="veh-card__badge">
                      <span className="badge badge--sale">🔥 Hot Deal</span>
                    </div>
                  </div>
                  <div className="veh-card__body">
                    <h3 className="veh-card__title">{v.brand} {v.shape}</h3>
                    <div className="veh-card__meta">{v.modelYear} · {v.mileage} km</div>
                    <div className="veh-card__foot">
                      <span className="veh-card__price veh-card__price--sale">
                        ${Number(v.price).toLocaleString()}
                      </span>
                      <span className="btn btn--primary btn--sm">View</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer__grid">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div className="nav__mark">CM</div>
                <span style={{ fontWeight: 800, fontSize: 22, letterSpacing: "-0.02em", color: "#fff" }}>
                  CarMarketplace
                </span>
              </div>
              <p style={{ color: "var(--color-n300)", fontSize: 14, lineHeight: 1.6, margin: 0, maxWidth: 320 }}>
                Browse and purchase quality vehicles. Trusted listings, transparent pricing.
              </p>
            </div>
            <div><h5>Shop</h5><ul><li>Catalog</li><li>Hot Deals</li><li>Loan Calculator</li></ul></div>
            <div><h5>Account</h5><ul><li>Cart</li><li>Orders</li><li>Login</li></ul></div>
            <div><h5>Help</h5><ul><li>Chat</li><li>FAQ</li><li>Contact</li></ul></div>
          </div>
          <div className="footer__low">
            <span>© 2026 Car Marketplace</span>
            <span>Made for the road.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
