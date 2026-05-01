function LoginPage({ navigate, onLogin, mode = "login" }) {
  const [email, setEmail] = useState(mode === "login" ? "alex@example.com" : "");
  const [password, setPassword] = useState(mode === "login" ? "••••••••" : "");
  const [name, setName] = useState("");
  const isReg = mode === "register";
  const submit = (e) => { e.preventDefault(); onLogin({ name: name || "Alex", email }); };
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h2 className="auth-card__title">{isReg ? "Create your account" : "Welcome back!"}</h2>
        <p className="auth-card__lede">{isReg ? "Save vehicles, track orders, and chat with sellers." : "Sign in to access your cart and saved searches."}</p>
        <div className="auth-card__form">
          {isReg && (
            <Field label="Full Name">
              <input className="input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Alex Rivera" required />
            </Field>
          )}
          <Field label="Email Address">
            <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" required />
          </Field>
          <Field label="Password">
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </Field>
          <Button type="submit" kind="primary" size="lg" style={{ marginTop: 6 }}>
            {isReg ? "Create account" : "Login"}
          </Button>
        </div>
        <div className="auth-card__foot">
          {isReg
            ? <>Already have an account? <a onClick={() => navigate("login")}>Log in</a></>
            : <>Don't have an account? <a onClick={() => navigate("register")}>Sign up here</a></>}
        </div>
      </form>
    </div>
  );
}
window.LoginPage = LoginPage;
