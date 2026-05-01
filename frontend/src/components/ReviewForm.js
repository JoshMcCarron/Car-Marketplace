import React, { useState } from "react";
import api from "../services/api";

const ReviewForm = ({ vehicleId, userId, onReviewAdded }) => {
  const [rating, setRating]       = useState(5);
  const [comment, setComment]     = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]         = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) { setError("You must be logged in to leave a review."); return; }
    setIsSubmitting(true);
    setError("");
    try {
      await api.post(`/vehicles/${vehicleId}/reviews/${userId}`, {
        rating: Number(rating),
        comment,
      });
      setComment("");
      setRating(5);
      onReviewAdded();
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: "1px solid var(--color-border)" }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Write a Review</h3>
      {error && <p className="auth-card__error" style={{ marginBottom: 12 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label className="field" style={{ maxWidth: 220 }}>
          <span className="field__label">Rating</span>
          <select
            className="select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            {[5, 4, 3, 2, 1].map((s) => (
              <option key={s} value={s}>{Array(s).fill("★").join("")} ({s}/5)</option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Comment</span>
          <textarea
            className="input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            style={{ resize: "vertical", minHeight: 100 }}
            required
          />
        </label>

        <div>
          <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
            {isSubmitting ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
