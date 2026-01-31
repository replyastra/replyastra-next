"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) setMsg(error.message);
    else router.push("/dashboard");
  }

  return (
    <div style={card}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
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
