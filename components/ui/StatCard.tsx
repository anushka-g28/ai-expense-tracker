import { gradientText } from "@/lib/styles";

interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div
        className="text-3xl md:text-4xl font-bold mb-1"
        style={gradientText}
      >
        {value}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}