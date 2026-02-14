import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Footer />

        {/* ❌ SOME EXTRA FOOTER BELOW */}
      </body>
    </html>
  );
}
