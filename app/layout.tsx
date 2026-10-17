import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FluencyLab | English in action",
  description: "Build your English from B1 to C2 with video, deliberate practice and real-world labs.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
