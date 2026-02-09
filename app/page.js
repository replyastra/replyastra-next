import Link from 'next/link'

export default function Home() {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="nav">
        <Link href="/" className="logo">REPLYASTRA</Link>
        <div className="nav-actions">
          <Link href="/login" className="login">Login</Link>
          <Link href="/signup" className="cta">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <span className="pill">✨ INSTAGRAM AUTOMATION</span>
        <h1>
          Grow your <span>Influence.</span>
        </h1>
        <p>Smart DM automation for modern creators.</p>
        
        <div className="buttons">
          <Link href="/signup" className="btn-dark">Join Waitlist →</Link>
          <Link href="#features" className="btn-light">Learn More</Link>
        </div>
      </section>

      {/* Feature Pills */}
      <div className="features">
        <div className="feature">🤖 AI Responses</div>
        <div className="feature">🎯 Lead Generation</div>
        <div className="feature">⚡ Comment to DM</div>
        <div className="feature">🔒 100% Safe</div>
      </div>

      {/* Detailed Features Section */}
      <section id="features" className="features-section">
        <h2>Everything you need to scale</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>AI DM Responses</h3>
            <p>Our AI understands intent and replies contextually, just like a human assistant.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Lead Generation</h3>
            <p>Automatically tag and export leads that express interest in your products or services.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Comment to DM</h3>
            <p>Automatically send a DM to anyone who comments a specific keyword on your posts.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>100% Safe & Approved</h3>
            <p>We use official Instagram Graph APIs to ensure your account remains safe and compliant.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Analytics Dashboard</h3>
            <p>Track every conversion, message sent, and growth metric in real-time.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Multi-Account Support</h3>
            <p>Manage all your brands from a single unified dashboard with ease.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Simple, Transparent Pricing</h2>
        <p className="subtitle">Choose the plan that's right for your business growth.</p>
        
        <div className="pricing-grid">
          {/* Free Plan */}
          <div className="pricing-card">
            <h3>Free Plan</h3>
            <div className="price">₹0</div>
            <p className="period">Perfect for small creators</p>
            <ul>
              <li>Limited DM automation</li>
              <li>Basic features</li>
              <li>1 Instagram account</li>
            </ul>
            <button className="pricing-btn outline">Get Started</button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card popular">
            <span className="popular-badge">Popular</span>
            <h3>Pro Plan</h3>
            <div className="price">₹299<span className="period">/month</span></div>
            <p className="period">For serious businesses</p>
            <ul>
              <li>Advanced DM automation</li>
              <li>AI replies</li>
              <li>Analytics dashboard</li>
              <li>Priority support</li>
            </ul>
            <button className="pricing-btn">Start Free Trial</button>
          </div>

          {/* Business Plan */}
          <div className="pricing-card">
            <h3>Business Plan</h3>
            <div className="price">₹599<span className="period">/month</span></div>
            <p className="period">Scale without limits</p>
            <ul>
              <li>Unlimited automation</li>
              <li>Multiple IG accounts</li>
              <li>Team access</li>
              <li>Premium support</li>
            </ul>
            <button className="pricing-btn outline">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Product</h4>
            <Link href="#features">Features</Link>
            <Link href="#pricing">Pricing</Link>
            <Link href="#">API</Link>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <Link href="#">About</Link>
            <Link href="#">Blog</Link>
            <Link href="#">Legal</Link>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <Link href="#">Help Center</Link>
            <Link href="#">Contact Us</Link>
            <Link href="#">Admin Panel</Link>
          </div>
        </div>
        
        <div className="footer-bottom">
          © 2026 ReplyAstra. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
