import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ user }) => {
  const [cart, setCart] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const userId = user?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log("No user found, skipping cart fetch.");
      return;
    }

    console.log(`Fetching cart for user ID: ${user.userId}`);

    fetch(`http://18.214.94.81:8080/users/${user.userId}/cart`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Cart data received:", data);
        setCart(data);
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, [user]);

  const handleRemove = (vehicleId) => {

    setIsProcessing(true);

    fetch(`http://18.214.94.81:8080/users/${userId}/cart/${vehicleId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((updatedCart) => {
        console.log("Updated cart after removal:", updatedCart);
        if (updatedCart?.vehicles) {
          setCart(updatedCart);
        } else {
          setCart({ vehicles: [], price: 0, noItems: 0 });
        }
      })
      .catch((err) => console.error("Error removing item:", err))
      .finally(() => setIsProcessing(false));
  };

  const handleCheckout = () => {

    setIsProcessing(true);

    fetch(`http://18.214.94.81:8080/users/${userId}/cart/checkout`, { method: "POST" })
      .then((res) => res.text())
      .then((message) => {
        alert(message);
        const totalPrice = cart?.price || 0;
        setCart({ vehicles: [], price: 0, noItems: 0 });
        navigate("/payment", { state: { totalPrice } });
      })
      .catch((err) => console.error("Error checking out:", err))
      .finally(() => setIsProcessing(false));
  };

  if (!user) {
    return (
      <div style={{
        backgroundColor: "#FFFFFF",
        padding: "30px",
        borderRadius: "10px",
        border: "1px solid #D9D9D9",
        textAlign: "center",
        maxWidth: "600px",
        margin: "20px auto"
      }}>
        <h2 style={{ color: "#335C67", marginBottom: "20px" }}>Your Cart</h2>
        <p style={{ fontSize: "18px" }}>Please log in to view your cart.</p>
      </div>
    );
  }

  if (!cart) return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "10px",
      border: "1px solid #D9D9D9",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto"
    }}>
      <p>Loading cart...</p>
    </div>
  );

  if (!cart?.vehicles || cart.vehicles.length === 0) return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "10px",
      border: "1px solid #D9D9D9",
      textAlign: "center",
      maxWidth: "600px",
      margin: "20px auto"
    }}>
      <h2 style={{ color: "#335C67", marginBottom: "20px" }}>Your Cart</h2>
      <p style={{ fontSize: "18px" }}>Your cart is empty.</p>
    </div>
  );

  return (
    <div style={{
      backgroundColor: "#FFFFFF",
      padding: "30px",
      borderRadius: "10px",
      border: "1px solid #D9D9D9",
      maxWidth: "800px",
      margin: "20px auto"
    }}>
      <h2 style={{ 
        color: "#335C67",
        marginBottom: "25px",
        paddingBottom: "10px",
        borderBottom: "1px solid #D9D9D9"
      }}>
        Your Cart ({cart.noItems} {cart.noItems === 1 ? 'item' : 'items'})
      </h2>
      
      <div style={{ marginBottom: "30px" }}>
        {cart.vehicles.map((vehicle) => (
          <div key={vehicle.vehicleID} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px",
            borderBottom: "1px solid #F0F0F0",
            ":last-child": {
              borderBottom: "none"
            }
          }}>
            <div>
              <h3 style={{ 
                color: "#335C67",
                margin: "0 0 5px 0",
                fontSize: "18px"
              }}>
                {vehicle.brand} {vehicle.model || vehicle.shape}
              </h3>
              <div style={{ display: "flex", gap: "20px" }}>
                <span style={{ color: "#666" }}>Year: {vehicle.modelYear}</span>
                <span style={{ color: "#666" }}>Mileage: {vehicle.mileage} km</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ 
                fontSize: "18px",
                fontWeight: "bold",
                color: "#9E2A2B",
                marginBottom: "10px"
              }}>
                ${vehicle.price}
              </div>
              <button
                onClick={() => handleRemove(vehicle.vehicleID)}
                disabled={isProcessing}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#F5F5F5",
                  color: "#9E2A2B",
                  border: "1px solid #D9D9D9",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  ":hover": {
                    backgroundColor: "#FFEBEE"
                  }
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#F5F5F5",
        borderRadius: "5px",
        marginBottom: "20px"
      }}>
        <h3 style={{ 
          color: "#335C67",
          margin: "0",
          fontSize: "20px"
        }}>
          Total Price
        </h3>
        <span style={{ 
          fontSize: "24px",
          fontWeight: "bold",
          color: "#9E2A2B"
        }}>
          ${cart.price}
        </span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        style={{
          width: "100%",
          padding: "15px",
          backgroundColor: "rgba(224, 159, 62, 0.88)",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "500",
          transition: "background-color 0.2s",
          ":hover": {
            backgroundColor: "rgba(224, 159, 62, 1)"
          }
        }}
      >
        {isProcessing ? "Processing..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default Cart;