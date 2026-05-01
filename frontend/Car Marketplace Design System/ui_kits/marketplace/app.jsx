function App() {
  const [route, setRoute] = useState("landing");
  const [vehicleId, setVehicleId] = useState(1);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const navigate = (key, arg) => {
    if (key === "vehicle") setVehicleId(arg);
    setRoute(key);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const handleLogin = (u) => { setUser(u); setRoute("catalog"); };
  const handleLogout = () => { setUser(null); setCart([]); setRoute("landing"); };
  const addToCart = (v) => {
    if (!user) { setRoute("login"); return; }
    if (cart.find(x => x.id === v.id)) { showToast(`${v.brand} ${v.model} is already in your cart`); return; }
    setCart(prev => [...prev, v]);
    showToast(`Added ${v.brand} ${v.model} to cart`);
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(v => v.id !== id));
  const showToast = (text) => { setToast(text); setTimeout(() => setToast(null), 2000); };

  const screen = (() => {
    switch (route) {
      case "landing":  return <LandingPage navigate={navigate}/>;
      case "login":    return <LoginPage navigate={navigate} onLogin={handleLogin} mode="login"/>;
      case "register": return <LoginPage navigate={navigate} onLogin={handleLogin} mode="register"/>;
      case "catalog":  return <CatalogPage navigate={navigate} onAddToCart={addToCart}/>;
      case "vehicle":  return <VehicleDetailsPage vehicleId={vehicleId} navigate={navigate} onAddToCart={addToCart}/>;
      case "cart":     return <CartPage cart={cart} navigate={navigate} onRemove={removeFromCart}/>;
      case "payment":  return <PaymentPage cart={cart} navigate={navigate} onComplete={() => { setCart([]); navigate("catalog"); showToast("Order placed! 🎉"); }}/>;
      case "loan":     return <div className="container" style={{ padding: 60 }}><div className="card" style={{ padding: 40, textAlign:"center" }}><h2>Loan Calculator</h2><p style={{ color:"var(--color-fg-3)" }}>Out of scope for this kit recreation.</p></div></div>;
      default:         return <LandingPage navigate={navigate}/>;
    }
  })();

  return (
    <div className="shell">
      <Navbar user={user} route={route} navigate={navigate} onLogout={handleLogout}/>
      <main style={{ flex: 1 }}>{screen}</main>
      {route !== "landing" && route !== "login" && route !== "register" && <Footer/>}
      {user && <ChatWidget/>}
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "var(--color-black)", color: "var(--color-white)", padding: "12px 20px", borderRadius: 999, fontSize: 14, fontWeight: 500, boxShadow: "var(--shadow-lg)", zIndex: 100 }}>{toast}</div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
