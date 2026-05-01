import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();
  const linkClass = (path) =>
    `nav__link${pathname === path || pathname.startsWith(path + "/") ? " nav__link--active" : ""}`;

  return (
    <nav className="nav">
      <div className="container nav__inner">
        <Link to={user ? "/catalog" : "/"} className="nav__brand">
          <div className="nav__mark">CM</div>
          <div className="nav__name">Car Marketplace</div>
        </Link>
        <div className="nav__links">
          <Link to="/catalog" className={linkClass("/catalog")}>Catalog</Link>
          <Link to="/cart" className={linkClass("/cart")}>Cart</Link>
          <Link to="/loan-calculator" className={linkClass("/loan-calculator")}>Loan Calculator</Link>
          {user ? (
            <button className="btn btn--primary btn--sm" style={{ marginLeft: 6 }} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="btn btn--primary btn--sm" style={{ marginLeft: 6 }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
