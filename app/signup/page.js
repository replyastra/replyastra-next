"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>ReplyAstra</h1>
        <p style={subtitle}>Create your account</p>

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

        {error && <p style={errorText}>{error}</p>}

        <button style={btn} onClick={handleSignup}>
          Create account
        </button>

        <p style={switchText}>
          Already have an account?{" "}
          <span style={link} onClick={() => router.push("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
