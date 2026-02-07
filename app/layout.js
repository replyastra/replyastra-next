import "./globals.css";

export const metadata = {
  title: "ReplyAstra",
  description: "AI-powered Instagram DM automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
