import StepItem from "../ui/StepItem";
import { gradientText } from "@/lib/styles";

const steps = [
    {
        step: "1",
        title: "Sign in with Google",
        desc: "User-friendly Google OAuth for secure access and personalized experience."
    },
    {
        step: "2",
        title: "Log expenses by voice or text",
        desc: "Just say 'Spent Rs.500 on groceries' and the AI parses and categorizes it."
    },
    {
        step: "3",
        title: "View real-time analytics",
        desc: "Watch your spending charts update instantly as you log."
    },
    {
        step: "4",
        title: "Get weekly AI insights",
        desc: "Gemini analyzes your spending and sends personalized tips to save more money."
    },
]
export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            How it <span style={gradientText}>works</span>
          </h2>
        </div>
        <div className="space-y-10">
            {steps.map((s) => (
              <StepItem key={s.step} {...s} />
            ))}
          </div>
        </div>
    </section>
    )
}