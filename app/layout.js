export const metadata = {
  title: "ReplyAstra – Instagram DM Automation",
  description: "Automate Instagram DMs and convert leads 24/7"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Inter, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
