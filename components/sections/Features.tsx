import { Mic, TrendingUp, Sparkles, BarChart3, Brain, ScanText } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";
import { gradientText } from "@/lib/styles";

const features = [
  {
    icon: Mic,
    title: "Voice Input",
    description:
      "Say 'Spent Rs.250 on coffee' and the app logs it automatically.",
  },
  {
    icon: Brain,
    title: "SpendAI financial coach",
    description: "Gemini analyzes spending and gives savings tips."
 },
 {
    icon: BarChart3,
    title: "Smart analytics",
    description: "Pie charts and graphs show where money goes."
 },
 {
   icon: Sparkles,
    title: "Weekly insights",
    description: "AI-generated budget tips and wasteful spending alerts every week."
 }, 
 {
  icon: ScanText,
  title: "AI Receipt Scanner",
  description:
    "Scan receipts instantly and auto-fill expense details using AI.",
},
{
  icon: TrendingUp,
  title: "Spending Trends",
  description:
    "Discover patterns in your daily and weekly spending behavior.",
},
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to{" "}
            <span style={gradientText}>spend wisely</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            A complete financial companion
          </p>
        </div>

        {/* 2-column grid */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
 
 