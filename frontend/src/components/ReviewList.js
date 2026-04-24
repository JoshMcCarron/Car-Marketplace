import React, { useEffect, useState } from "react";

const ReviewList = ({ vehicleId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`http://18.214.94.81:8080/vehicles/${vehicleId}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error fetching reviews:", error));
  }, [vehicleId]);

  // Function to render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span 
          key={i}
          style={{
            color: i <= rating ? "rgba(224, 159, 62, 0.88)" : "#D9D9D9",
            fontSize: "20px",
            marginRight: "2px"
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h3 style={{ 
        color: "#335C67",
        fontSize: "22px",
        marginBottom: "20px",
        paddingBottom: "10px",
        borderBottom: "1px solid #D9D9D9"
      }}>
        Customer Reviews
      </h3>
      
      {reviews.length === 0 ? (
        <div style={{ 
          backgroundColor: "#F5F5F5",
          padding: "20px",
          borderRadius: "5px",
          textAlign: "center",
          color: "#666"
        }}>
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {reviews.map((review) => (
            <div 
              key={review.id} 
              style={{ 
                backgroundColor: "#FFFFFF",
                padding: "20px",
                borderRadius: "5px",
                border: "1px solid #D9D9D9",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {renderStars(review.rating)}
              </div>
              
              <p style={{ 
                margin: 0,
                lineHeight: "1.6",
                color: "#333"
              }}>
                {review.comment || "No comment provided."}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;