import Link from "next/link";
import {ArrowRight} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { gradientText } from "@/lib/styles";

export default function Hero() {
    return (
        <section
      className="pt-36 pb-24 px-6"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 60%)",
      }}
    >
        <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Track Smarter <span style={gradientText}>with AI</span>
        </h1>
        {/* Subheadline */}
        <p className="text-gray-400 text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Log expenses by voice or text. Get weekly AI-powered financial
          insights, personalized savings tips, and smart budgeting advice.
        </p>
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
                href="/login"
                className="inline-flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200"
                style={{ boxShadow: "0 0 20px rgba(99,102,241,0.35)" }}
            >
             Start Tracking Now
             <ArrowRight className="w-5 h-5" />
            </Link>
        </div>
        </div>
    </section>
    );
}
