import { glassStyle } from "@/lib/styles";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      style={{
        ...glassStyle,
        background: "rgba(18,18,28,0.85)",
    border: "1px solid rgba(255,255,255,0.08)",
  }}
      className="rounded-5xl p-6 transition-all duration-300 hover:border-violet-400/30 hover:bg-white/5 "
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors group-hover:scale-105"
        style={{
          background: "rgba(99,102,241,0.1)",
          border: "1px solid rgba(99,102,241,0.55)",
        }}
      >
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}