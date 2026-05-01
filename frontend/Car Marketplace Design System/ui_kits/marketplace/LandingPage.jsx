function LandingPage({ navigate }) {
  return (
    <>
      <nav className="nav">
        <div className="container nav__inner">
          <div className="nav__brand"><div className="nav__mark">CM</div><div className="nav__name">Car Marketplace</div></div>
          <div className="nav__links">
            <Button kind="ghost" size="sm" onClick={() => navigate("login")} style={{ color: "#fff" }}>Login</Button>
            <Button kind="primary" size="sm" onClick={() => navigate("register")}>Register</Button>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">2,400+ vehicles · updated daily</div>
          <h1 className="hero__title">Find your <em>next</em> car<br/>without the runaround.</h1>
          <p className="hero__lede">Browse and purchase quality vehicles from trusted sellers. Transparent pricing, real history, instant chat support.</p>
          <div className="hero__ctas">
            <Button kind="primary" size="lg" onClick={() => navigate("catalog")}>Browse Catalog</Button>
            <Button kind="outline" size="lg" onClick={() => navigate("register")}>Create an Account</Button>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><span className="hero__stat-num">2,418</span><span className="hero__stat-label">Listings</span></div>
            <div className="hero__stat"><span className="hero__stat-num">9</span><span className="hero__stat-label">Brands</span></div>
            <div className="hero__stat"><span className="hero__stat-num">4.8★</span><span className="hero__stat-label">Buyer Rating</span></div>
            <div className="hero__stat"><span className="hero__stat-num">24/7</span><span className="hero__stat-label">Chat Support</span></div>
          </div>
        </div>
      </section>
      <section style={{ background: "var(--color-white)", padding: "80px 0" }}>
        <div className="container">
          <div className="eyebrow">Featured</div>
          <h2 className="section-title">This week's hot deals</h2>
          <div className="veh-grid">
            {window.MOCK_VEHICLES.filter(v => v.onSale).slice(0, 4).map(v => (
              <div key={v.id} className="veh-card veh-card--sale" onClick={() => navigate("login")}>
                <VehicleImage label={`${v.brand} ${v.model}`} />
                <div className="veh-card__badge"><Badge kind="sale">🔥 Hot Deal</Badge></div>
                <div className="veh-card__body">
                  <h3 className="veh-card__title">{v.brand} {v.model}</h3>
                  <div className="veh-card__meta">{v.modelYear} · {v.mileage.toLocaleString()} km</div>
                  <div className="veh-card__foot">
                    <div>
                      <span className="veh-card__price veh-card__price--sale">${v.salePrice.toLocaleString()}</span>
                      <span className="veh-card__strike">${v.price.toLocaleString()}</span>
                    </div>
                    <Button kind="primary" size="sm">View</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
window.LandingPage = LandingPage;
