// app/layout.js
import "./globals.css";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "ReplyAstra - Automate Your Instagram DMs",
  description: "Automate Instagram DM replies with keyword triggers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
