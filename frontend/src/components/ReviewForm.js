import React, { useState } from "react";

const ReviewForm = ({ vehicleId, userId, onReviewAdded }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to render star rating options
  const renderStarOptions = () => {
    return [5, 4, 3, 2, 1].map((star) => (
      <option 
        key={star} 
        value={star}
        style={{
          color: "rgba(224, 159, 62, 0.88)",
          backgroundColor: "#FFFFFF"
        }}
      >
        {Array(star).fill("★").join("")}
      </option>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId) {
      alert("You must be logged in to leave a review.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://18.214.94.81:8080/vehicles/${vehicleId}/reviews/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      if (response.ok) {
        setComment("");
        setRating(5);
        onReviewAdded(); // Refresh reviews after adding a new one
      } else {
        throw new Error("Failed to submit review");
      }
    } catch (error) {
      console.error("Review submission error:", error);
      alert("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#FFFFFF",
      padding: "20px",
      borderRadius: "5px",
      border: "1px solid #D9D9D9",
      marginBottom: "30px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ 
        color: "#335C67",
        fontSize: "20px",
        marginBottom: "15px"
      }}>
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ 
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Rating:
          </label>
          <select 
            value={rating} 
            onChange={(e) => setRating(e.target.value)}
            style={{
              padding: "8px 12px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              backgroundColor: "#FFFFFF",
              fontSize: "16px",
              cursor: "pointer"
            }}
          >
            {renderStarOptions()}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ 
            display: "block",
            marginBottom: "5px",
            fontWeight: "500",
            color: "#333"
          }}>
            Comment:
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #D9D9D9",
              fontSize: "16px",
              resize: "vertical",
              minHeight: "100px"
            }}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
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
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;