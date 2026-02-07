"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>ReplyAstra</h1>
        <p style={subtitle}>Login to your account</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <div style={passwordWrap}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...input, marginBottom: 0 }}
          />
          <span
            style={eye}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <p
          style={forgot}
          onClick={() => router.push("/forgot-password")}
        >
          Forgot password?
        </p>

        {error && <p style={errorText}>{error}</p>}

        <button style={btn} onClick={handleLogin}>
          Login
        </button>

        <p style={switchText}>
          Don’t have an account?{" "}
          <span style={link} onClick={() => router.push("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const page = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#667eea,#764ba2)",
};

const card = {
  width: 380,
  background: "#fff",
  padding: 32,
  borderRadius: 14,
  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
};

const title = {
  textAlign: "center",
  fontSize: 28,
  fontWeight: "bold",
  color: "#4f46e5",
};

const subtitle = {
  textAlign: "center",
  marginBottom: 24,
  color: "#6b7280",
};

const input = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 15,
  color: "#111827",
};

const passwordWrap = {
  position: "relative",
  marginBottom: 10,
};

const eye = {
  position: "absolute",
  right: 12,
  top: 12,
  cursor: "pointer",
};

const forgot = {
  textAlign: "right",
  fontSize: 13,
  color: "#4f46e5",
  cursor: "pointer",
  marginBottom: 16,
};

const btn = {
  width: "100%",
  padding: 12,
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  fontSize: 16,
  cursor: "pointer",
};

const switchText = {
  marginTop: 18,
  textAlign: "center",
  fontSize: 14,
};

const link = {
  color: "#4f46e5",
  cursor: "pointer",
  fontWeight: "bold",
};

const errorText = {
  color: "red",
  fontSize: 13,
  marginBottom: 10,
};
