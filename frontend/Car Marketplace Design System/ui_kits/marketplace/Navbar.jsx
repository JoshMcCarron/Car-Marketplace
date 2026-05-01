function Navbar({ user, route, navigate, onLogout }) {
  if (route === "landing") return null;
  const link = (key, label) => (
    <button
      className={`nav__link ${route === key ? "nav__link--active" : ""}`}
      onClick={() => navigate(key)}
    >{label}</button>
  );
  return (
    <nav className="nav">
      <div className="container nav__inner">
        <div className="nav__brand" style={{ cursor: "pointer" }} onClick={() => navigate(user ? "catalog" : "landing")}>
          <div className="nav__mark">CM</div>
          <div className="nav__name">Car Marketplace</div>
        </div>
        <div className="nav__links">
          {link("catalog", "Catalog")}
          {link("cart", "Cart")}
          {link("loan", "Loan Calculator")}
          {user ? (
            <Button kind="primary" size="sm" style={{ marginLeft: 6 }} onClick={onLogout}>Logout</Button>
          ) : (
            <Button kind="primary" size="sm" style={{ marginLeft: 6 }} onClick={() => navigate("login")}>Login</Button>
          )}
        </div>
      </div>
    </nav>
  );
}
window.Navbar = Navbar;
