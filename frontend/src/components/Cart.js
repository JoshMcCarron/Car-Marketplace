import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Cart = ({ user }) => {
  const [cart, setCart]       = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const userId = user?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    api.get(`/users/${user.userId}/cart`)
      .then((r) => setCart(r.data))
      .catch((err) => console.error("Error fetching cart:", err));
  }, [user]);

  const handleRemove = (vehicleId) => {
    setIsRemoving(true);
    api.delete(`/users/${userId}/cart/${vehicleId}`)
      .then((r) => setCart(r.data?.vehicles ? r.data : { vehicles: [], price: 0, noItems: 0 }))
      .catch((err) => console.error("Error removing item:", err))
      .finally(() => setIsRemoving(false));
  };

  const handleCheckout = () => {
    navigate("/payment", { state: { totalPrice: cart?.price || 0, userId, vehicles: cart?.vehicles || [] } });
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <div className="card" style={{ padding: 60, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ marginBottom: 12 }}>Your Cart</h2>
          <p style={{ color: "var(--color-fg-2)", marginBottom: 24 }}>Please log in to view your cart.</p>
        </div>
      </div>
    );
  }

  if (!cart) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <p style={{ color: "var(--color-fg-2)" }}>Loading cart…</p>
      </div>
    );
  }

  if (!cart.vehicles?.length) {
    return (
      <div className="container" style={{ padding: "60px 0" }}>
        <div className="card" style={{ padding: 60, textAlign: "center", maxWidth: 560, margin: "0 auto" }}>
          <h2 style={{ marginBottom: 8 }}>Your cart is empty</h2>
          <p style={{ color: "var(--color-fg-2)", marginBottom: 24 }}>
            Looks like you haven't added any vehicles yet.
          </p>
          <button className="btn btn--primary btn--lg" onClick={() => navigate("/catalog")}>
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "32px 0", maxWidth: 880, margin: "0 auto" }}>
      <h1 className="section-title">
        Your Cart ({cart.noItems} {cart.noItems === 1 ? "item" : "items"})
      </h1>

      <div className="card" style={{ padding: "8px 16px" }}>
        {cart.vehicles.map((v) => (
          <div key={v.vehicleID} className="cart-row">
            <div className="cart-row__thumb">🚗</div>
            <div className="cart-row__info">
              <h3 className="cart-row__title">{v.brand} {v.model || v.shape}</h3>
              <div className="cart-row__meta">{v.modelYear} · {v.mileage} km · {v.vehicleHistory}</div>
            </div>
            <div className="cart-row__price">${Number(v.price).toLocaleString()}</div>
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => handleRemove(v.vehicleID)}
              disabled={isRemoving}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="total-bar">
        <div>
          <div className="total-bar__label">Total</div>
          <div style={{ fontSize: 12, color: "var(--color-n400)", marginTop: 2 }}>Taxes &amp; fees included</div>
        </div>
        <div className="total-bar__price">${Number(cart.price).toLocaleString()}</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
        <button className="btn btn--outline" onClick={() => navigate("/catalog")}>
          Continue shopping
        </button>
        <button className="btn btn--primary btn--lg" onClick={handleCheckout}>
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
};

export default Cart;
