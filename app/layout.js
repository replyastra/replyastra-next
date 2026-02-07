import "./globals.css";

export const metadata = {
  title: "ReplyAstra",
  description: "AI powered DM automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
