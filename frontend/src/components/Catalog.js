import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Catalog = ({ user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [sortBy, setSortBy] = useState("price");
  const [sortOrder, setSortOrder] = useState("asc");
  const [addingToCart, setAddingToCart] = useState({});

  // Filter states
  const [brand, setBrand] = useState("");
  const [shape, setShape] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [showOnSale, setShowOnSale] = useState(null);

  // Available filter options
  const brandOptions = ["Toyota", "Honda", "Ford", "BMW", "Mercedes-Benz", "Tesla", "Nissan", "Hyundai", "Subaru"];
  const shapeOptions = ["Sedan", "Compact", "Wagon"];
  const yearOptions = [2020, 2021, 2022, 2023, 2024];

  const navigate = useNavigate();

  useEffect(() => {

    // Build query parameters
    const params = new URLSearchParams();

    // Add sort parameters
    params.append("sortBy", sortBy);
    params.append("direction", sortOrder);

    // Add filter parameters (only if they have values)
    if (brand) params.append("brand", brand);
    if (shape) params.append("shape", shape);
    if (modelYear) params.append("modelYear", modelYear);
    if (showOnSale !== null) params.append("onSale", showOnSale);

    // Make API request with all parameters
    fetch(`http://18.214.94.81:8080/vehicles?${params.toString()}`)

      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, [sortBy, sortOrder, brand, shape, modelYear, showOnSale]);

  const handleClick = (id) => {
    navigate(`/vehicle/${id}`);
  };

  const handleAddToCart = (vehicleID) => {
    if (!user || !user.userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    setAddingToCart((prev) => ({ ...prev, [vehicleID]: true }));

    fetch(`http://18.214.94.81:8080/users/${user.userId}/cart/${vehicleID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to add to cart");
        return response.json();
      })
      .then(() => {
        alert("Vehicle added to cart!");
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("Could not add to cart.");
      })
      .finally(() => {
        setAddingToCart((prev) => ({ ...prev, [vehicleID]: false }));
      });
  };

  const resetFilters = () => {
    setBrand("");
    setShape("");
    setModelYear("");
    setShowOnSale(null);
  };

  // Separate Hot Deals from other vehicles
  const hotDeals = vehicles.filter((vehicle) => vehicle.onSale);
  const regularVehicles = vehicles.filter((vehicle) => !vehicle.onSale);

  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px", padding: "0 20px" }}>
      {/* Filter and Sort Sidebar */}
      <div style={{ width: "250px", padding: "20px", border: "1px solid #D9D9D9", borderRadius: "10px", height: "fit-content" }}>
        <h3 style={{ color: "#335C67", marginBottom: "20px" }}>Filter & Sort Options</h3>

        {/* Filter Options */}
        <div style={{ marginBottom: "20px" }}>
          {/* Brand Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Brand: </label>
            <select 
              onChange={(e) => setBrand(e.target.value)} 
              value={brand}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}
            >
              <option value="">All Brands</option>
              {brandOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Shape Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Vehicle Type: </label>
            <select 
              onChange={(e) => setShape(e.target.value)} 
              value={shape}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}
            >
              <option value="">All Types</option>
              {shapeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Model Year Filter */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Year: </label>
            <select 
              onChange={(e) => setModelYear(e.target.value)} 
              value={modelYear}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}
            >
              <option value="">All Years</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* On Sale Filter */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Deals: </label>
            <select
              onChange={(e) => setShowOnSale(e.target.value === "" ? null : e.target.value === "true")}
              value={showOnSale === null ? "" : showOnSale.toString()}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}
            >
              <option value="">All Vehicles</option>
              <option value="true">Hot Deals Only</option>
              <option value="false">Regular Prices Only</option>
            </select>
          </div>
        </div>

        {/* Sort Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>Sort by: </label>
            <select 
              onChange={(e) => setSortBy(e.target.value)} 
              value={sortBy}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9",
                marginBottom: "10px"
              }}
            >
              <option value="price">Price</option>
              <option value="modelYear">Model Year</option>
              <option value="mileage">Mileage</option>
            </select>
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            style={{
              padding: "10px",
              backgroundColor: "#335C67",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginBottom: "10px"
            }}
          >
            {sortOrder === "asc" ? "⬆️ Ascending" : "⬇️ Descending"}
          </button>

          <button 
            onClick={resetFilters}
            style={{
              padding: "10px",
              backgroundColor: "#9E2A2B",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Vehicle Listings */}
      <div style={{ flex: 1 }}>
        <h2 style={{ color: "#335C67", marginBottom: "20px" }}>Car Catalog</h2>

        {/* Active Filters Display */}
        {(brand || shape || modelYear || showOnSale !== null) && (
          <div style={{ 
            marginBottom: "20px", 
            padding: "15px", 
            backgroundColor: "#f5f5f5", 
            borderRadius: "5px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center"
          }}>
            <strong style={{ marginRight: "10px" }}>Active Filters:</strong>
            {brand && (
              <span style={{ 
                backgroundColor: "#E0E0E0", 
                padding: "5px 10px", 
                borderRadius: "15px",
                fontSize: "14px"
              }}>
                Brand: {brand}
              </span>
            )}
            {shape && (
              <span style={{ 
                backgroundColor: "#E0E0E0", 
                padding: "5px 10px", 
                borderRadius: "15px",
                fontSize: "14px"
              }}>
                Type: {shape}
              </span>
            )}
            {modelYear && (
              <span style={{ 
                backgroundColor: "#E0E0E0", 
                padding: "5px 10px", 
                borderRadius: "15px",
                fontSize: "14px"
              }}>
                Year: {modelYear}
              </span>
            )}
            {showOnSale === true && (
              <span style={{ 
                backgroundColor: "#FFD6D6", 
                padding: "5px 10px", 
                borderRadius: "15px",
                fontSize: "14px",
                color: "#9E2A2B"
              }}>
                Hot Deals Only
              </span>
            )}
            {showOnSale === false && (
              <span style={{ 
                backgroundColor: "#E0E0E0", 
                padding: "5px 10px", 
                borderRadius: "15px",
                fontSize: "14px"
              }}>
                Regular Prices Only
              </span>
            )}
          </div>
        )}

        {/* Hot Deals Section */}
        {hotDeals.length > 0 && (
          <div style={{ marginBottom: "40px" }}>
            <h2 style={{ color: "#9E2A2B", marginBottom: "15px" }}>🔥 Hot Deals 🔥</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {hotDeals.map((vehicle) => (
                <div
                  key={vehicle.vehicleID}
                  style={{
                    background: "#FFFFFF",
                    border: "2px solid #9E2A2B",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    ":hover": {
                      transform: "translateY(-5px)"
                    }
                  }}
                >
                  <div style={{ 
                    height: "150px", 
                    backgroundColor: "#f5f5f5", 
                    borderBottom: "1px solid #D9D9D9"
                  }}>
                    {/* Placeholder for vehicle image */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#999",
                      fontSize: "14px"
                    }}>
                      Vehicle Image
                    </div>
                  </div>
                  <div style={{ padding: "15px" }}>
                    <h3 
                      onClick={() => handleClick(vehicle.vehicleID)} 
                      style={{ 
                        cursor: "pointer", 
                        color: "#335C67",
                        margin: "0 0 10px 0",
                        fontSize: "18px"
                      }}
                    >
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      marginBottom: "10px"
                    }}>
                      <span style={{ fontSize: "14px", color: "#666" }}>Year: {vehicle.modelYear}</span>
                      <span style={{ fontSize: "14px", color: "#666" }}>Mileage: {vehicle.mileage} km</span>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "15px"
                    }}>
                      <span style={{ 
                        fontSize: "16px", 
                        fontWeight: "bold",
                        color: "#9E2A2B"
                      }}>
                        ${vehicle.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(vehicle.vehicleID)}
                        disabled={addingToCart[vehicle.vehicleID]}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "rgba(224, 159, 62, 0.88)",
                          color: "#000",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          ":hover": {
                            backgroundColor: "rgba(224, 159, 62, 1)"
                          }
                        }}
                      >
                        {addingToCart[vehicle.vehicleID] ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Regular Vehicle List */}
        {regularVehicles.length > 0 && (
          <>
            <h2 style={{ color: "#335C67", marginBottom: "15px" }}>All Vehicles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
              {regularVehicles.map((vehicle) => (
                <div
                  key={vehicle.vehicleID}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #D9D9D9",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    ":hover": {
                      transform: "translateY(-5px)"
                    }
                  }}
                >
                  <div style={{ 
                    height: "150px", 
                    backgroundColor: "#f5f5f5", 
                    borderBottom: "1px solid #D9D9D9"
                  }}>
                    {/* Placeholder for vehicle image */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#999",
                      fontSize: "14px"
                    }}>
                      Vehicle Image
                    </div>
                  </div>
                  <div style={{ padding: "15px" }}>
                    <h3 
                      onClick={() => handleClick(vehicle.vehicleID)} 
                      style={{ 
                        cursor: "pointer", 
                        color: "#335C67",
                        margin: "0 0 10px 0",
                        fontSize: "18px"
                      }}
                    >
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      marginBottom: "10px"
                    }}>
                      <span style={{ fontSize: "14px", color: "#666" }}>Year: {vehicle.modelYear}</span>
                      <span style={{ fontSize: "14px", color: "#666" }}>Mileage: {vehicle.mileage} km</span>
                    </div>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "15px"
                    }}>
                      <span style={{ 
                        fontSize: "16px", 
                        fontWeight: "bold",
                        color: "#335C67"
                      }}>
                        ${vehicle.price}
                      </span>
                      <button
                        onClick={() => handleAddToCart(vehicle.vehicleID)}
                        disabled={addingToCart[vehicle.vehicleID]}
                        style={{
                          padding: "8px 15px",
                          backgroundColor: "rgba(224, 159, 62, 0.88)",
                          color: "#000",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "14px",
                          ":hover": {
                            backgroundColor: "rgba(224, 159, 62, 1)"
                          }
                        }}
                      >
                        {addingToCart[vehicle.vehicleID] ? "Adding..." : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* No Results Message */}
        {vehicles.length === 0 && (
          <div style={{ 
            padding: "40px", 
            textAlign: "center", 
            backgroundColor: "#f5f5f5", 
            borderRadius: "10px",
            marginTop: "20px"
          }}>
            <p style={{ fontSize: "18px", color: "#666" }}>No vehicles match your search criteria. Try adjusting your filters.</p>
            <button 
              onClick={resetFilters}
              style={{
                padding: "10px 20px",
                backgroundColor: "#335C67",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "15px"
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;