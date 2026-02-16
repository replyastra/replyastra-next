// SAVE THIS FILE AT: app/(auth)/layout.js
// The (auth) folder name with brackets is a Next.js "Route Group"
// It hides the navbar and footer for all pages inside it
// URLs still work normally: /login /signup /dashboard

export default function AuthLayout({ children }) {
  return <>{children}</>;
}
