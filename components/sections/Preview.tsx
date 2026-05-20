import { Brain } from "lucide-react";
import MockExpenseItem from "@/components/ui/MockExpenseItem";
import { glassStyle, gradientText } from "@/lib/styles";

export default function Preview() {
  return (
    <section id="preview" className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Clean, <span style={gradientText}>intuitive</span> dashboard
          </h2>
        </div>

        {/* Mock Dashboard */}
        <div style={{ ...glassStyle, borderRadius: "24px", padding: "24px" }}>
          {/* Week header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-gray-400 text-sm">This week</p>
              <p className="text-white text-3xl font-bold mt-1">Rs. 4,280</p>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={glassStyle}
            >
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-green-400 text-sm font-medium">
                12% under budget
              </span>
            </div>
          </div>

          {/* Expense rows */}
          <div className="mb-6">
            <MockExpenseItem
              category="Food and Dining"
              amount="Rs. 1,200"
              note="Swiggy, Zomato"
              color="bg-orange-500"
            />
            <MockExpenseItem
              category="Transport"
              amount="Rs. 680"
              note="Uber, Auto"
              color="bg-blue-500"
            />
            <MockExpenseItem
              category="Shopping"
              amount="Rs. 2,400"
              note="Amazon, Meesho"
              color="bg-purple-500"
            />
          </div>

          {/* AI Insight */}
          <div
            className="flex gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
            }}
          >
            <Brain className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-indigo-300 text-sm font-semibold mb-1">
                AI Insight
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your food spending is 28% higher than last week. Consider
                cooking at home 2 to 3 days to save around Rs. 400.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}