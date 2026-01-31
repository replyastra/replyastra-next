"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function signup() {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) setMsg(error.message);
    else {
      setMsg("Account created! Check email.");
      setTimeout(() => router.push("/login"), 1500);
    }
  }

  return (
    <div style={card}>
      <h2>Create Account</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={signup}>Sign Up</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}

const card = {
  maxWidth: 400,
  margin: "100px auto",
  display: "flex",
  flexDirection: "column",
  gap: 12
};
