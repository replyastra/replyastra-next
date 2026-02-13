import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "ReplyAstra",
  description: "Intelligent DM Automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#f8fafc]">
        <Navbar />
        <main className="pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
