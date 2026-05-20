import { PieChart } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="py-8 px-6"
      style={{ borderTop: "1px solid rgba(255,255,255,0.45)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-500 flex items-center justify-center">
            <PieChart className="w-3 h-3 text-white" />
          </div>
          <span className="text-gray-400 text-sm">SpendAI</span>
        </div>
      </div>
    </footer>
  );
}