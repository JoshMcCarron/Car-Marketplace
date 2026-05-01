import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import api from "../services/api";
import { getVehicleImage } from "../img/vehicles/vehicleImages";

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle]   = useState(null);
  const [showCO2, setShowCO2]   = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState(null);
  const [reviewKey, setReviewKey] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    api.get(`/vehicles/${id}`)
      .then((r) => setVehicle(r.data))
      .catch((err) => console.error("Error fetching vehicle:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!user?.userId) {
      alert("Please log in to add items to the cart.");
      return;
    }
    setAddingToCart(true);
    api.post(`/users/${user.userId}/cart/${id}`)
      .then(() => {
        setCartMsg("success");
        setTimeout(() => setCartMsg(null), 2500);
      })
      .catch(() => setCartMsg("error"))
      .finally(() => setAddingToCart(false));
  };

  if (!vehicle) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <p style={{ color: "var(--color-fg-3)" }}>Loading vehicle details…</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      <div style={{ padding: "14px 0", color: "var(--color-fg-3)", fontSize: 13 }}>
        <span
          onClick={() => navigate("/catalog")}
          style={{ cursor: "pointer", borderBottom: "1px solid var(--color-border)" }}
        >
          Catalog
        </span>
        {" / "}
        <span>{vehicle.brand} {vehicle.shape || vehicle.model}</span>
      </div>

      <div className="detail-hero">
        <div className="detail-image">
          {getVehicleImage(vehicle.brand, vehicle.shape)
            ? <img
                src={getVehicleImage(vehicle.brand, vehicle.shape)}
                alt={`${vehicle.brand} ${vehicle.shape}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "var(--radius-lg)" }}
              />
            : <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-n400)" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/>
                  <circle cx="6.5" cy="16.5" r="2.5"/>
                  <circle cx="16.5" cy="16.5" r="2.5"/>
                </svg>
                {vehicle.brand} {vehicle.shape || vehicle.model}
              </span>
          }
        </div>

        <div>
          <div className="eyebrow">{vehicle.onSale ? "Hot Deal" : "Featured Vehicle"}</div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: "4px 0 20px", letterSpacing: "-0.01em", lineHeight: 1.15 }}>
            {vehicle.brand} {vehicle.shape || vehicle.model}{" "}
            <span style={{ color: "var(--color-fg-3)", fontWeight: 500 }}>{vehicle.modelYear}</span>
          </h1>

          <div className={`price-card${vehicle.onSale ? " price-card--sale" : ""}`}>
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                color: vehicle.onSale ? "var(--color-sale)" : "var(--color-fg-3)", marginBottom: 4,
              }}>
                {vehicle.onSale ? "Sale Price" : "Listing Price"}
              </div>
              <div className={`price-card__price${vehicle.onSale ? " price-card__price--sale" : ""}`}>
                ${Number(vehicle.price).toLocaleString()}
              </div>
            </div>
            {vehicle.onSale && <span className="badge badge--sale">🔥 Hot Deal</span>}
          </div>

          <div className="specs-grid">
            <div className="spec">
              <div className="spec__label">Body</div>
              <div className="spec__value">{vehicle.shape}</div>
            </div>
            <div className="spec">
              <div className="spec__label">History</div>
              <div className="spec__value">{vehicle.vehicleHistory}</div>
            </div>
            <div className="spec">
              <div className="spec__label">Mileage</div>
              <div className="spec__value">{Number(vehicle.mileage).toLocaleString()} km</div>
            </div>
            <div
              className="spec"
              style={{
                background: showCO2 ? "var(--color-yellow-soft)" : "var(--color-white)",
                borderColor: showCO2 ? "var(--color-yellow-line)" : "var(--color-border)",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => setShowCO2(!showCO2)}
            >
              <div className="spec__label">CO₂ Emission</div>
              <div className="spec__value" style={{ color: showCO2 ? "var(--color-fg-1)" : "var(--color-fg-3)" }}>
                {showCO2 ? vehicle.co2Emission : "Tap to reveal →"}
              </div>
            </div>
            <div className="spec">
              <div className="spec__label">Fuel Usage</div>
              <div className="spec__value">{vehicle.fuelUsage} L/100km</div>
            </div>
            <div className="spec">
              <div className="spec__label">Year</div>
              <div className="spec__value">{vehicle.modelYear}</div>
            </div>
          </div>

          {cartMsg === "success" && <div className="alert alert--success" style={{ marginBottom: 12 }}>Added to cart!</div>}
          {cartMsg === "error"   && <div className="alert alert--danger"  style={{ marginBottom: 12 }}>Could not add to cart.</div>}

          <button
            className="btn btn--primary btn--lg"
            onClick={handleAddToCart}
            disabled={addingToCart}
          >
            {addingToCart ? "Adding…" : `Add to Cart · $${Number(vehicle.price).toLocaleString()}`}
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 28, marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 12px" }}>About this vehicle</h2>
        <p style={{ color: "var(--color-fg-2)", lineHeight: 1.6, margin: 0 }}>
          {vehicle.description ||
            `A well-maintained ${vehicle.modelYear} ${vehicle.brand} ${vehicle.shape || vehicle.model} with ${Number(vehicle.mileage).toLocaleString()} km. ` +
            `History: ${vehicle.vehicleHistory}. Comes with full service records and a 30-day return guarantee.`}
        </p>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 20, margin: "0 0 20px" }}>Customer Reviews</h2>
        {user && (
          <ReviewForm
            vehicleId={id}
            userId={user.userId}
            onReviewAdded={() => setReviewKey((k) => k + 1)}
          />
        )}
        <ReviewList key={reviewKey} vehicleId={id} />
      </div>
    </div>
  );
};

export default VehicleDetails;
