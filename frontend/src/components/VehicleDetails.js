import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [showCO2, setShowCO2] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetch(`http://18.214.94.81:8080/vehicles/${id}`)
      .then((response) => response.json())
      .then((data) => setVehicle(data))
      .catch((error) => console.error("Error fetching vehicle:", error));
  }, [id]);

  const handleAddToCart = () => {
    if (!user || !user.userId) {
      alert("Please log in to add items to the cart.");
      return;
    }

    setAddingToCart(true);

    fetch(`http://localhost:8080/users/${user.userId}/cart/${id}`, {
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
        setAddingToCart(false);
      });
  };

  if (!vehicle) return <div style={{ padding: "20px", textAlign: "center" }}>Loading vehicle details...</div>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      {/* Vehicle Header Section */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {/* Vehicle Image and Basic Info */}
        <div style={{ 
          display: "flex", 
          gap: "40px",
          flexWrap: "wrap"
        }}>
          {/* Vehicle Image */}
          <div style={{
            flex: "1",
            minWidth: "300px",
            height: "300px",
            backgroundColor: "#f5f5f5",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #D9D9D9"
          }}>
            <span style={{ color: "#999" }}>Vehicle Image</span>
          </div>

          {/* Vehicle Details */}
          <div style={{
            flex: "1",
            minWidth: "300px"
          }}>
            <h1 style={{ 
              color: "#335C67", 
              marginBottom: "15px",
              fontSize: "28px"
            }}>
              {vehicle.brand} {vehicle.model} {vehicle.modelYear}
            </h1>

            <div style={{ 
              backgroundColor: vehicle.onSale ? "#FFEBEE" : "#F5F5F5",
              padding: "15px",
              borderRadius: "5px",
              marginBottom: "20px",
              border: vehicle.onSale ? "1px solid #9E2A2B" : "1px solid #D9D9D9"
            }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ 
                  fontSize: "24px", 
                  fontWeight: "bold",
                  color: vehicle.onSale ? "#9E2A2B" : "#335C67"
                }}>
                  ${vehicle.price}
                </span>
                {vehicle.onSale && (
                  <span style={{
                    backgroundColor: "#9E2A2B",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "14px"
                  }}>
                    Hot Deal
                  </span>
                )}
              </div>
            </div>

            {/* Key Specifications */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "15px",
              marginBottom: "20px"
            }}>
              <div style={{ 
                backgroundColor: "#FFFFFF",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}>
                <div style={{ color: "#666", fontSize: "14px" }}>Shape</div>
                <div style={{ fontWeight: "500" }}>{vehicle.shape}</div>
              </div>
              <div style={{ 
                backgroundColor: "#FFFFFF",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}>
                <div style={{ color: "#666", fontSize: "14px" }}>History</div>
                <div style={{ fontWeight: "500" }}>{vehicle.vehicleHistory}</div>
              </div>
              <div style={{ 
                backgroundColor: "#FFFFFF",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}>
                <div style={{ color: "#666", fontSize: "14px" }}>Mileage</div>
                <div style={{ fontWeight: "500" }}>{vehicle.mileage} km</div>
              </div>
              
              {/* CO2 Emission - Special Styled Component */}
              <div 
                onClick={() => setShowCO2(!showCO2)}
                style={{ 
                  backgroundColor: showCO2 ? "#E3F2FD" : "#FFFFFF",
                  padding: "15px",
                  borderRadius: "5px",
                  border: showCO2 ? "1px solid #1976D2" : "1px solid #D9D9D9",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  ":hover": {
                    backgroundColor: showCO2 ? "#E3F2FD" : "#F5F5F5"
                  }
                }}
              >
                {showCO2 ? (
                  <>
                    <div style={{ color: "#1976D2", fontSize: "14px" }}>CO2 Emission</div>
                    <div style={{ fontWeight: "500", color: "#0D47A1" }}>{vehicle.co2Emission}</div>
                  </>
                ) : (
                  <div style={{ 
                    display: "flex", 
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%"
                  }}>
                    <div style={{ 
                      color: "#1976D2",
                      fontSize: "14px",
                      textAlign: "center",
                      marginBottom: "5px"
                    }}>
                      Wondering about
                    </div>
                    <div style={{ 
                      color: "#1976D2",
                      fontWeight: "bold",
                      textAlign: "center",
                      fontSize: "16px"
                    }}>
                      CO2 Emissions?
                    </div>
                    <div style={{ 
                      color: "#1976D2",
                      fontSize: "12px",
                      textAlign: "center",
                      marginTop: "5px"
                    }}>
                      Click to reveal
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{ 
                backgroundColor: "#FFFFFF",
                padding: "15px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9"
              }}>
                <div style={{ color: "#666", fontSize: "14px" }}>Fuel Usage</div>
                <div style={{ fontWeight: "500" }}>{vehicle.fuelUsage} L/100km</div>
              </div>
            </div>

            {/* Add to Cart Button */}
            {user && (
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                style={{
                  padding: "12px 25px",
                  backgroundColor: "rgba(224, 159, 62, 0.88)",
                  color: "#000",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "500",
                  transition: "background-color 0.2s",
                  ":hover": {
                    backgroundColor: "rgba(224, 159, 62, 1)"
                  }
                }}
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div style={{ 
          backgroundColor: "#FFFFFF",
          padding: "20px",
          borderRadius: "5px",
          border: "1px solid #D9D9D9",
          marginTop: "20px"
        }}>
          <h3 style={{ 
            color: "#335C67",
            marginBottom: "15px"
          }}>Vehicle Description</h3>
          <p style={{ lineHeight: "1.6" }}>
            {vehicle.description || "No description available for this vehicle."}
          </p>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ marginTop: "40px" }}>
        {/* Review Form */}
        {user && <ReviewForm vehicleId={id} userId={user.userId} onReviewAdded={() => window.location.reload()} />}

        {/* Review List */}
        <ReviewList vehicleId={id} />
      </div>
    </div>
  );
};

export default VehicleDetails;