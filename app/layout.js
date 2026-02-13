import "./globals.css";
import Navbar from "./Navbar"; // Point to the app folder
import Footer from "./Footer"; // Point to the app folder

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc] text-gray-900">
        <Navbar />   {/* ✅ Always visible */}
        
        <main className="min-h-screen">
          {children}
        </main>

        <Footer />   {/* ✅ Always visible */}
      </body>
    </html>
  );
}
