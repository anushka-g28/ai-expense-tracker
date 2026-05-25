// Pie chart for category breakdown + Bar chart for daily spending.

"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Expense, CATEGORY_COLORS } from "@/lib/firestore";

interface Props {
  expenses: Expense[];
}
// Pie chart Data 

function buildPieData(expenses: Expense[]) {
  const totals: Record<string, number> = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
}
// Bar chart Data
function buildBarData(expenses: Expense[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const totals: Record<string, number> = {};

  // Initialize all 7 days to 0
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = days[d.getDay()];
    totals[label] = 0;
  }

  // Add expense amounts to their respective day
  expenses.forEach((e) => {
    const date = e.createdAt?.toDate ? e.createdAt.toDate() : new Date();
    const daysSince = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < 7) {
      const label = days[date.getDay()];
      totals[label] = (totals[label] || 0) + e.amount;
    }
  });

  return Object.entries(totals).map(([day, amount]) => ({ day, amount }));
}
//Custom Tooltip for Pie
const PieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(20,20,30,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "12px",
        color: "#fff",
      }}>
        <p style={{ fontWeight: 600 }}>{payload[0].name}</p>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

//Custom Tooltip for Bar
const BarTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(20,20,30,0.95)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "8px",
        padding: "8px 12px",
        fontSize: "12px",
        color: "#fff",
      }}>
        <p style={{ fontWeight: 600 }}>{label}</p>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  }
  return null;
};

//Main component
export default function Charts({ expenses }: Props) {
  if (expenses.length === 0) return null;

  const pieData = buildPieData(expenses);
  const barData = buildBarData(expenses);

  const cardStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  };

  const titleStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.6)",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "20px",
  };

  return (
    <>
      {/*PIE CHART*/}
      <div style={cardStyle}>
        <p style={titleStyle}>Spending by category</p>

        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={CATEGORY_COLORS[entry.name] ?? "#6b7280"}
                  opacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "8px",
          justifyContent: "center",
        }}>
          {pieData.map((entry) => (
            <div
              key={entry.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: CATEGORY_COLORS[entry.name] ?? "#6b7280",
                flexShrink: 0,
              }} />
              <span style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: "11px",
              }}>
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* BAR CHART  */}
      <div style={cardStyle}>
        <p style={titleStyle}>Daily spending - last 7 days</p>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={barData}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar
              dataKey="amount"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
              opacity={0.85}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}