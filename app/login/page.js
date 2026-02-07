"use client";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-white text-black rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-center text-gray-500 mb-6">
          Welcome back to ReplyAstra
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition"
          >
            Login
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-purple-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
