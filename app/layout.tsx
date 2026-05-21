// AuthProvider wraps everything so every page can call useAuth()

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendAI — AI-Powered Expense Tracker",
  description:
    "Track your expenses smarter with AI insights, voice input, and weekly financial coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ background: "#0a0a0f" }} className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}