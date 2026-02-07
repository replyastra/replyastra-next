"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-extrabold text-purple-600 mb-2">
          Welcome to ReplyAstra 🚀
        </h1>

        <p className="text-gray-600 mb-6">
          Logged in as <span className="font-semibold">{user.email}</span>
        </p>

        {/* Dummy stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">DMs Automated</p>
            <p className="text-2xl font-bold text-purple-600">128</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500">Replies Today</p>
            <p className="text-2xl font-bold text-purple-600">24</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
