export default function Home() {
  return (
    <div className="landing">

      {/* NAVBAR */}
      <div className="nav">
        <div className="logo">ReplyAstra</div>

        <div className="nav-actions">
          <a href="/login" className="login">Login</a>
          <a href="/signup" className="cta">Get Started</a>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <span className="pill">INTELLIGENT INSTAGRAM GROWTH</span>

        <h1>
          Fresh approach to <br />
          <span>DM Automation.</span>
        </h1>

        <p>
          Automate replies, capture leads, and manage conversations with a fast,
          reliable and scalable system.
        </p>

        <div className="buttons">
          <a href="/signup" className="btn-dark">Start Free Now</a>
          <a href="#features" className="btn-light">Explore Features</a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <div className="feature">🌿 Natural Flow<br />Smooth conversations</div>
        <div className="feature">🧠 Smart Logic<br />Rule-based replies</div>
        <div className="feature">🔒 Privacy First<br />Secure & compliant</div>
        <div className="feature">📊 Deep Insights<br />Real-time analytics</div>
      </section>

    </div>
  );
}
