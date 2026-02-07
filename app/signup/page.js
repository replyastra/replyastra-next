export default function SignupPage() {
  return (
    <div className="auth-wrapper">
      <a href="/" className="back-link">← Back to Home</a>

      <div className="auth-card">
        <h2 className="auth-title">ReplyAstra</h2>
        <p className="auth-sub">Create your account and start automating.</p>

        <label>Full Name</label>
        <input type="text" placeholder="Your name" />

        <label>Email</label>
        <input type="email" placeholder="you@email.com" />

        <label>Password</label>
        <input type="password" placeholder="Create password" />

        <button className="auth-btn">Create Account</button>

        <p className="auth-foot">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
