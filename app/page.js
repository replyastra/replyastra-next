export default function HomePage() {
  return (
    <main className="landing">
      {/* Navbar */}
      <nav className="nav">
        <div className="logo">ReplyAstra</div>
        <div className="nav-actions">
          <a href="/login" className="login">Login</a>
          <a href="/signup" className="cta">Get Started</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <span className="pill">🌱 INTELLIGENT INSTAGRAM GROWTH</span>

        <h1>
          Fresh approach to <br />
          <span>DM Automation.</span>
        </h1>

        <p>
          ReplyAstra brings the elegance of iOS-style automation
          to your Instagram workflow. Simple. Powerful. Natural.
        </p>

        <div className="buttons">
          <a href="/signup" className="btn-dark">Start Free Now</a>
          <a href="#features" className="btn-light">Explore Features</a>
        </div>
      </section>

      {/* Feature Pills */}
      <section className="features">
        <div className="feature">🍀 Natural Flow</div>
        <div className="feature">🧩 Smart Logic</div>
        <div className="feature">🛡 Privacy First</div>
        <div className="feature">📊 Deep Insights</div>
      </section>
    </main>
  );
}
