// app/layout.tsx
// The root layout wraps EVERY page in your app.
// We add AuthProvider here so every page can access the logged-in user.

import type { Metadata } from "next";
import { AuthProvider } from "@/lib/authContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpendAI — AI-Powered Expense Tracker",
  description:
    "Track your expenses smarter with AI-powered insights, voice input, and weekly financial coaching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="gradient-bg min-h-screen antialiased">
        {/* AuthProvider wraps everything so any child can call useAuth() */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}