import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
