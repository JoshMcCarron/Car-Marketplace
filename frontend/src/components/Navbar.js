import React from "react";
import { Link } from "react-router-dom";
import logo from '../img/lebroncat.png'; 

function Navbar({ user, onLogout }) {
  return (
    <nav style={{ 
      backgroundColor: "#335C67", 
      padding: "10px 20px", 
      color: "white", 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      {/* Left side - Logo and Name */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{
          fontWeight: "bold",
          fontSize: "20px",
          marginRight: "20px"
        }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img 
              src={logo} 
              alt="Logo" 
              style={{
                height: "60px",  
                width: "auto",  
                marginRight: "10px"
              }}
            />
            <div style={{ 
              display: "inline-block",
              fontSize: "1.5rem",
              fontWeight: "bold"
            }}>
              Lebron James's Cars
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Navigation Links and Logout */}
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Navigation Links */}
        <div style={{ display: "flex" }}>
          <Link 
            to="/catalog" 
            style={{ 
              color: "white", 
              textDecoration: "none", 
              margin: "0 10px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Catalog
          </Link>
          <Link 
            to="/cart" 
            style={{ 
              color: "white", 
              textDecoration: "none", 
              margin: "0 10px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Cart
          </Link>
          <Link 
            to="/loan-calculator" 
            style={{ 
              color: "white", 
              textDecoration: "none", 
              margin: "0 10px",
              padding: "8px 12px",
              borderRadius: "4px",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255,255,255,0.2)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
          >
            Loan Calculator
          </Link>
        </div>

        {/* Logout button */}
        {user && (
          <button 
            onClick={onLogout} 
            style={{ 
              backgroundColor: "transparent",
              color: "white", 
              border: "1px solid white",
              borderRadius: "4px",
              padding: "8px 16px",
              cursor: "pointer", 
              fontSize: "16px",
              transition: "all 0.3s",
              marginLeft: "15px"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;