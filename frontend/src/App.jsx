import React, { useEffect, useState } from "react";

const API = "http://localhost:5001/api";

const categoryIcons = {
  skincare: "✦",
  fitness: "↗",
  coffee: "☕",
  "self-care": "♡",
  books: "◫"
};

function App() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [subscriptions, setSubscriptions] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    getPlans();
  }, []);

  useEffect(() => {
    if (user && token) getSubscriptions();
  }, [user, token]);

  async function getPlans(value = "") {
    try {
      const url = value
        ? `${API}/plans/search?keyword=${encodeURIComponent(value)}`
        : `${API}/plans`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) setPlans(data);
    } catch {
      alert("Could not connect to backend.");
    }
  }

  async function auth(type) {
    try {
      const response = await fetch(`${API}/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) return alert(data.message);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      setForm({ name: "", email: "", password: "" });
      setPage("home");
    } catch {
      alert("Could not connect to backend.");
    }
  }

  async function subscribe(plan) {
    if (!user) {
      setPage("login");
      return;
    }

    const response = await fetch(`${API}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        user: user.id,
        plan: plan._id,
        preferences: ["Standard preference"],
        billingCycle: "monthly"
      })
    });

    const data = await response.json();

    if (!response.ok) return alert(data.message);

    alert("Subscription created!");
    getSubscriptions();
    setPage("dashboard");
  }

  async function getSubscriptions() {
    const response = await fetch(
      `${API}/subscriptions/user/${user.id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();

    if (response.ok) setSubscriptions(data);
  }

  async function cancelSubscription(id) {
    const response = await fetch(
      `${API}/subscriptions/${id}/cancel`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();

    if (!response.ok) return alert(data.message);

    getSubscriptions();
  }

  async function trackShipment(id) {
    const response = await fetch(
      `${API}/shipments/subscription/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await response.json();

    if (!response.ok) return alert(data.message);

    if (!data[0]) return alert("No shipment found.");

    alert(
      `Tracking: ${data[0].trackingNumber}\nStatus: ${data[0].status}`
    );
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    setSubscriptions([]);
    setPage("home");
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <button className="brand" onClick={() => setPage("home")}>
          <span className="brand-mark">B</span>
          BOXDROP
        </button>

        <div className="nav-links">
          <button
            className={page === "home" ? "nav-active" : ""}
            onClick={() => setPage("home")}
          >
            Explore
          </button>

          {user ? (
            <>
              <button
                className={page === "dashboard" ? "nav-active" : ""}
                onClick={() => setPage("dashboard")}
              >
                Dashboard
              </button>
              <button className="logout-link" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-login" onClick={() => setPage("login")}>
              Login
            </button>
          )}
        </div>
      </nav>

      {page === "home" && (
        <main>
          <section className="hero">
            <div className="hero-glow glow-one" />
            <div className="hero-glow glow-two" />

            <div className="hero-content">
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                CURATED. PACKED. DELIVERED.
              </div>

              <h1>
                A better box,
                <br />
                <span>every month.</span>
              </h1>

              <p>
                Discover thoughtfully curated products matched to your
                interests, delivered straight to your door.
              </p>

              <div className="search-wrap">
                <span className="search-icon">⌕</span>
                <input
                  placeholder="Search skincare, coffee, fitness..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    getPlans(e.target.value);
                  }}
                />
                {search && (
                  <button
                    className="clear-search"
                    onClick={() => {
                      setSearch("");
                      getPlans();
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            <div className="hero-card">
              <div className="floating-tag tag-top">MONTHLY DROP</div>
              <div className="box-illustration">
                <div className="box-lid" />
                <div className="box-body">
                  <span>BOX</span>
                  <small>DROP</small>
                </div>
                <div className="box-ribbon" />
              </div>
              <div className="floating-tag tag-bottom">CURATED FOR YOU</div>
            </div>
          </section>

          <section className="trust-row">
            <div>
              <strong>04</strong>
              <span>Curated plans</span>
            </div>
            <div>
              <strong>01</strong>
              <span>Simple subscription</span>
            </div>
            <div>
              <strong>07</strong>
              <span>Day estimated delivery</span>
            </div>
          </section>

          <section className="plans-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">THE COLLECTION</p>
                <h2>Find your box.</h2>
              </div>
              <p>
                Pick a plan and make every month feel a little more exciting.
              </p>
            </div>

            <section className="plans">
              {plans.map((plan, index) => (
                <div className="card" key={plan._id}>
                  <div className="card-top">
                    <div className={`plan-icon icon-${index % 4}`}>
                      {categoryIcons[plan.category] || "✦"}
                    </div>
                    <span className="category">{plan.category}</span>
                  </div>

                  <h3>{plan.name}</h3>
                  <p className="card-description">{plan.description}</p>

                  <div className="price">
                    <span>₹{plan.price}</span>
                    <small>/ {plan.billingCycle}</small>
                  </div>

                  <div className="product-list">
                    {plan.products?.slice(0, 4).map((product) => (
                      <span key={product}>{product}</span>
                    ))}
                  </div>

                  <button className="card-button" onClick={() => subscribe(plan)}>
                    Choose this box
                    <span>→</span>
                  </button>
                </div>
              ))}

              {plans.length === 0 && (
                <div className="empty-state">
                  <div>⌕</div>
                  <h3>No plans found</h3>
                  <p>Try another search term.</p>
                </div>
              )}
            </section>
          </section>

          <section className="how-section">
            <div className="section-heading">
              <div>
                <p className="section-kicker">HOW IT WORKS</p>
                <h2>Three simple steps.</h2>
              </div>
            </div>

            <div className="steps">
              <div className="step">
                <span>01</span>
                <h3>Pick a plan</h3>
                <p>Choose the box that matches your interests.</p>
              </div>
              <div className="step">
                <span>02</span>
                <h3>Subscribe</h3>
                <p>Set your preference and start your monthly cycle.</p>
              </div>
              <div className="step">
                <span>03</span>
                <h3>Get the drop</h3>
                <p>Your shipment is created and ready to track.</p>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div>
              <div className="footer-brand">BOXDROP</div>
              <p>Curated products. Delivered monthly.</p>
            </div>
            <span>Case Study 97 · Subscription Box Service</span>
          </footer>
        </main>
      )}

      {(page === "login" || page === "register") && (
        <Auth
          title={page === "login" ? "Welcome back" : "Create your account"}
          form={form}
          setForm={setForm}
          submit={() => auth(page)}
          page={page}
          setPage={setPage}
        />
      )}

      {page === "dashboard" && user && (
        <main className="dashboard-page">
          <div className="dashboard-header">
            <div>
              <p className="section-kicker">YOUR BOXDROP</p>
              <h1>Welcome, {user.name}</h1>
              <p>Manage your subscriptions and track your deliveries.</p>
            </div>
            <div className="user-chip">
              <span>{user.name?.charAt(0).toUpperCase()}</span>
              {user.email}
            </div>
          </div>

          <div className="dashboard-stats">
            <div>
              <span>ACTIVE BOXES</span>
              <strong>
                {subscriptions.filter((s) => s.status === "active").length}
              </strong>
            </div>
            <div>
              <span>TOTAL SUBSCRIPTIONS</span>
              <strong>{subscriptions.length}</strong>
            </div>
            <div>
              <span>DELIVERY</span>
              <strong>~7 days</strong>
            </div>
          </div>

          <section className="subscription-area">
            <div className="section-heading">
              <div>
                <p className="section-kicker">MY SUBSCRIPTIONS</p>
                <h2>Your boxes.</h2>
              </div>
            </div>

            {subscriptions.length === 0 && (
              <div className="empty-dashboard">
                <div className="empty-box">□</div>
                <h3>No subscriptions yet</h3>
                <p>Explore the collection and choose your first box.</p>
                <button onClick={() => setPage("home")}>
                  Explore plans →
                </button>
              </div>
            )}

            <div className="subscription-list">
              {subscriptions.map((sub) => (
                <div className="subscription" key={sub._id}>
                  <div className="subscription-icon">BOX</div>

                  <div className="subscription-main">
                    <div className="subscription-title">
                      <h3>{sub.plan?.name}</h3>
                      <span className={`status status-${sub.status}`}>
                        {sub.status}
                      </span>
                    </div>

                    <p>
                      ₹{sub.plan?.price} / {sub.billingCycle} · Next billing{" "}
                      {new Date(sub.nextBillingDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="subscription-actions">
                    <button onClick={() => trackShipment(sub._id)}>
                      Track shipment
                    </button>

                    {sub.status === "active" && (
                      <button
                        className="danger"
                        onClick={() => cancelSubscription(sub._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

function Auth({ title, form, setForm, submit, page, setPage }) {
  const isRegister = page === "register";

  return (
    <main className="auth-page">
      <div className="auth-visual">
        <div className="auth-brand">BOXDROP</div>
        <div className="auth-visual-content">
          <p className="section-kicker">A BETTER MONTHLY RITUAL</p>
          <h1>
            Discover something
            <br />
            <span>worth opening.</span>
          </h1>
          <p>
            Join BoxDrop and turn your favorite interests into a curated
            monthly delivery.
          </p>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-card">
          <p className="section-kicker">{isRegister ? "GET STARTED" : "MEMBER LOGIN"}</p>
          <h1>{title}</h1>
          <p className="auth-subtitle">
            {isRegister
              ? "Create your BoxDrop account in a few seconds."
              : "Sign in to manage your monthly boxes."}
          </p>

          {isRegister && (
            <label>
              Name
              <input
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </label>

          <label>
            Password
            <input
              type="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </label>

          <button className="auth-submit" onClick={submit}>
            {isRegister ? "Create account" : "Sign in"}
            <span>→</span>
          </button>

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
            <button
              type="button"
              onClick={() =>
                setPage(isRegister ? "login" : "register")
              }
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default App;
