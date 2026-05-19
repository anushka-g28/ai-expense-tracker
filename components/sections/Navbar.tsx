import Link from "next/link";
import { PieChart } from "lucide-react";

export default function Navbar() {
    return (
        <nav 
            className="top-0 left-0 right-0 z-50"
            style={{
                background : "rgba(10,10,15,0.85)",
                borderBottom : "1px solid rgba(255,255,255,0.08)",
                backdropFilter : "blur(16px)",
                WebkitBackdropFilter : "blur(16px)",
            }}   
            >
             <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <PieChart className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">SpendAI</span>
        </Link>   

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          
            <a href="#features"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Features
          </a>
          
            <a href="#how-it-works"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            How It Works
          </a>
          
            <a href="#preview"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Preview
          </a>
        </div>

         {/* CTA */}
        <Link
          href="/login"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{ boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
        >
          Get Started
        </Link>
        </div>
            </nav>             
    )
}