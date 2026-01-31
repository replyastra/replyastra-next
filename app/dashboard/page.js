"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push("/login");
      else setUser(data.user);
    });
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
}
