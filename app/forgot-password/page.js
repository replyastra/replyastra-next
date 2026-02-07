"use client";
export const runtime = "edge";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMsg(error.message);
    else setMsg("Password reset email sent.");
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Reset Password</h1>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <button style={btn} onClick={handleReset}>
          Send reset link
        </button>

        {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
      </div>
    </div>
  );
}
