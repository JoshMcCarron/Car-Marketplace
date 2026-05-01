import React, { useEffect, useState } from "react";
import api from "../services/api";

const Stars = ({ rating }) => (
  <span className="review__stars">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ color: i <= rating ? "var(--color-yellow-press)" : "var(--color-n300)" }}>★</span>
    ))}
  </span>
);

const ReviewList = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get(`/vehicles/${vehicleId}/reviews`)
      .then((r) => setReviews(r.data))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [vehicleId]);

  if (reviews.length === 0) {
    return (
      <p style={{ color: "var(--color-fg-3)", fontSize: 14, margin: 0 }}>
        No reviews yet. Be the first to review this vehicle!
      </p>
    );
  }

  return (
    <div>
      {reviews.map((review, index) => {
        const name    = review.userName || review.userEmail || "Customer";
        const initial = name.charAt(0).toUpperCase();
        return (
          <div key={review.id ?? index} className="review">
            <div className="review__head">
              <div className="review__avatar">{initial}</div>
              <span className="review__name">{name}</span>
              <Stars rating={review.rating} />
            </div>
            <p style={{ margin: 0, color: "var(--color-fg-2)", lineHeight: 1.55, fontSize: 14 }}>
              {review.comment || "No comment provided."}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewList;
