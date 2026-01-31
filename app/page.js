import Link from "next/link";

export default function Home() {
  return (
    <main style={styles.main}>
      <h1 style={styles.title}>ReplyAstra</h1>
      <p style={styles.sub}>
        AI-powered Instagram DM automation for creators & businesses
      </p>

      <div style={styles.btns}>
        <Link href="/signup" style={styles.primary}>Get Started</Link>
        <Link href="/login" style={styles.secondary}>Login</Link>
      </div>
    </main>
  );
}

const styles = {
  main: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#6366f1,#a855f7)",
    color: "#fff",
    textAlign: "center"
  },
  title: { fontSize: 48, fontWeight: "bold" },
  sub: { maxWidth: 500, marginTop: 16 },
  btns: { marginTop: 40, display: "flex", gap: 16 },
  primary: {
    background: "#fff",
    color: "#6366f1",
    padding: "12px 24px",
    borderRadius: 8,
    textDecoration: "none"
  },
  secondary: {
    border: "1px solid #fff",
    padding: "12px 24px",
    borderRadius: 8,
    color: "#fff",
    textDecoration: "none"
  }
};
