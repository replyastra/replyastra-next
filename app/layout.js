import Navbar from "./Navbar";
import Footer from "./Footer"; // This pulls in your perfect footer
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {/* This "children" is where your Contact Page or Home Page shows up */}
        <main>{children}</main> 
        
        {/* Adding this here makes it visible on ALL pages automatically */}
        <Footer /> 
      </body>
    </html>
  );
}
