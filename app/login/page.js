export default function LoginPage() {
  return (
    <div className="auth-wrapper">
      <a href="/" className="back-link">← Back to Home</a>

      <div className="auth-card">
        <h2 className="auth-title">ReplyAstra</h2>
        <p className="auth-sub">Welcome back. Login to your dashboard.</p>

        <label>Email</label>
        <input type="email" placeholder="you@email.com" />

        <label>Password</label>
        <input type="password" placeholder="••••••••" />

        <div className="auth-row">
          <a href="/forgot-password">Forgot password?</a>
        </div>

        <button className="auth-btn">Login</button>

        <p className="auth-foot">
          Don’t have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
