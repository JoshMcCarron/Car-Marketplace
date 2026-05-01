import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getVehicleImage } from "../img/vehicles/vehicleImages";

const BRANDS  = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Tesla", "Nissan", "Hyundai", "Subaru"];
const SHAPES  = ["Sedan", "SUV", "Truck", "Compact", "Wagon"];
const YEARS   = [2020, 2021, 2022, 2023, 2024];

function VehCard({ vehicle, onNavigate, onAddToCart, adding }) {
  const imgSrc = getVehicleImage(vehicle.brand, vehicle.shape);
  return (
    <div className={`veh-card${vehicle.onSale ? " veh-card--sale" : ""}`}>
      <div style={{ position: "relative" }} onClick={() => onNavigate(vehicle.vehicleID)}>
        <div className="veh-card__media">
          {imgSrc
            ? <img src={imgSrc} alt={`${vehicle.brand} ${vehicle.shape}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <span>🚗 {vehicle.brand} {vehicle.shape}</span>
          }
        </div>
        {vehicle.onSale && (
          <div className="veh-card__badge">
            <span className="badge badge--sale">🔥 Hot Deal</span>
          </div>
        )}
      </div>
      <div className="veh-card__body">
        <h3 className="veh-card__title" onClick={() => onNavigate(vehicle.vehicleID)}>
          {vehicle.brand} {vehicle.shape}
        </h3>
        <div className="veh-card__meta">
          {vehicle.modelYear} · {vehicle.mileage} km · {vehicle.vehicleHistory}
        </div>
        <div className="veh-card__foot">
          <span className={`veh-card__price${vehicle.onSale ? " veh-card__price--sale" : ""}`}>
            ${Number(vehicle.price).toLocaleString()}
          </span>
          <button
            className="btn btn--primary btn--sm"
            onClick={() => onAddToCart(vehicle.vehicleID)}
            disabled={adding}
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

const Catalog = ({ user }) => {
  const [vehicles, setVehicles]     = useState([]);
  const [sortBy, setSortBy]         = useState("price");
  const [sortOrder, setSortOrder]   = useState("asc");
  const [brand, setBrand]           = useState("");
  const [shape, setShape]           = useState("");
  const [modelYear, setModelYear]   = useState("");
  const [showOnSale, setShowOnSale] = useState(null);
  const [adding, setAdding]         = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ sortBy, direction: sortOrder });
    if (brand)    params.append("brand", brand);
    if (shape)    params.append("shape", shape);
    if (modelYear) params.append("modelYear", modelYear);
    if (showOnSale !== null) params.append("onSale", showOnSale);
    api.get(`/vehicles?${params}`)
      .then((r) => setVehicles(r.data))
      .catch((err) => console.error("Error fetching vehicles:", err));
  }, [sortBy, sortOrder, brand, shape, modelYear, showOnSale]);

  const handleAddToCart = (vehicleID) => {
    if (!user?.userId) {
      alert("Please log in to add items to the cart.");
      return;
    }
    setAdding((prev) => ({ ...prev, [vehicleID]: true }));
    api.post(`/users/${user.userId}/cart/${vehicleID}`)
      .then(() => alert("Vehicle added to cart!"))
      .catch(() => alert("Could not add to cart."))
      .finally(() => setAdding((prev) => ({ ...prev, [vehicleID]: false })));
  };

  const resetFilters = () => { setBrand(""); setShape(""); setModelYear(""); setShowOnSale(null); };
  const hasFilters = brand || shape || modelYear || showOnSale !== null;
  const hotDeals = vehicles.filter((v) => v.onSale);
  const regular  = vehicles.filter((v) => !v.onSale);

  return (
    <div className="container">
      <div className="cat">
        {/* Sidebar */}
        <aside className="filters">
          <h3>Filter &amp; Sort</h3>

          <label className="field">
            <span className="field__label">Brand</span>
            <select className="select" value={brand} onChange={(e) => setBrand(e.target.value)}>
              <option value="">All brands</option>
              {BRANDS.map((b) => <option key={b}>{b}</option>)}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Body Type</span>
            <select className="select" value={shape} onChange={(e) => setShape(e.target.value)}>
              <option value="">All types</option>
              {SHAPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Year</span>
            <select className="select" value={modelYear} onChange={(e) => setModelYear(e.target.value)}>
              <option value="">All years</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>

          <label className="field">
            <span className="field__label">Deals</span>
            <select
              className="select"
              value={showOnSale === null ? "" : showOnSale.toString()}
              onChange={(e) => setShowOnSale(e.target.value === "" ? null : e.target.value === "true")}
            >
              <option value="">All vehicles</option>
              <option value="true">Hot Deals only</option>
              <option value="false">Regular pricing</option>
            </select>
          </label>

          <div className="filter-divider" />

          <label className="field">
            <span className="field__label">Sort by</span>
            <select className="select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="price">Price</option>
              <option value="modelYear">Year</option>
              <option value="mileage">Mileage</option>
            </select>
          </label>

          <button className="btn btn--outline btn--sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </button>

          <button className="btn btn--ghost btn--sm" onClick={resetFilters}>
            Reset filters
          </button>
        </aside>

        {/* Main content */}
        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
            <h1 className="section-title" style={{ margin: 0 }}>Vehicle Catalog</h1>
            <span style={{ color: "var(--color-fg-3)", fontSize: 14 }}>{vehicles.length} results</span>
          </div>

          {hasFilters && (
            <div className="applied-filters">
              <span className="applied-filters__label">Active:</span>
              {brand     && <span className="chip">{brand} <span className="chip__x" onClick={() => setBrand("")}>×</span></span>}
              {shape     && <span className="chip">{shape} <span className="chip__x" onClick={() => setShape("")}>×</span></span>}
              {modelYear && <span className="chip">Year: {modelYear} <span className="chip__x" onClick={() => setModelYear("")}>×</span></span>}
              {showOnSale === true  && <span className="chip chip--danger">Hot Deals only <span className="chip__x" onClick={() => setShowOnSale(null)}>×</span></span>}
              {showOnSale === false && <span className="chip">Regular pricing <span className="chip__x" onClick={() => setShowOnSale(null)}>×</span></span>}
            </div>
          )}

          {hotDeals.length > 0 && (
            <div style={{ marginBottom: 36 }}>
              <h2 className="section-title" style={{ color: "var(--color-sale)" }}>🔥 Hot Deals</h2>
              <div className="veh-grid">
                {hotDeals.map((v) => (
                  <VehCard key={v.vehicleID} vehicle={v}
                    onNavigate={(id) => navigate(`/vehicle/${id}`)}
                    onAddToCart={handleAddToCart}
                    adding={adding[v.vehicleID]} />
                ))}
              </div>
            </div>
          )}

          {regular.length > 0 && (
            <>
              <h2 className="section-title">All Vehicles</h2>
              <div className="veh-grid">
                {regular.map((v) => (
                  <VehCard key={v.vehicleID} vehicle={v}
                    onNavigate={(id) => navigate(`/vehicle/${id}`)}
                    onAddToCart={handleAddToCart}
                    adding={adding[v.vehicleID]} />
                ))}
              </div>
            </>
          )}

          {vehicles.length === 0 && (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
              <p style={{ color: "var(--color-fg-2)", marginBottom: 16 }}>
                No vehicles match your filters. Try adjusting your search.
              </p>
              <button className="btn btn--dark" onClick={resetFilters}>Reset all filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Catalog;
