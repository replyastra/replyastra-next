// app/(auth)/layout.js
// This file makes sure login, signup, dashboard pages
// do NOT show the navbar or footer from the root layout

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
