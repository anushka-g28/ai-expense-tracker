"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/authContext";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Sign in failed. Please try again.");
    }
  };

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
    </div>
  );
}

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#0a0a0f" }}>

      <div className="w-full max-w-sm text-center">

        <h1 className="text-3xl font-bold text-white mb-2">SpendAI</h1>
        <p className="text-gray-400 mb-10">Sign in to track your expenses</p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          Sign in with Google
        </button>

        {error && (
          <p className="text-red-400 text-sm mt-4">{error}</p>
        )}

        <p className="text-gray-600 text-sm mt-6">
          No account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}