import Navbar from "./Navbar";
import Footer from "./Footer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* This Navbar will now show on every page */}
        <Navbar />
        
        {/* This "children" represents your Home page, Contact page, etc. */}
        <main>{children}</main>
        
        {/* This Footer will now show on every page */}
        <Footer />
      </body>
    </html>
  );
}
