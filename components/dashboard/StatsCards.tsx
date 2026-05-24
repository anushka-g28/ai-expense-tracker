// Shows 3 summary numbers — total, count, top category.
// Recalculates automatically whenever expenses change.

import { Expense, getTotalSpent, getTopCategory } from "@/lib/firestore";

interface Props {
  expenses: Expense[];
}

export default function StatsCards({ expenses }: Props) {
  const stats = [
    {
      label: "Total spent",
      value: `₹${getTotalSpent(expenses).toLocaleString("en-IN")}`,
    },
    {
      label: "Expenses",
      value: expenses.length.toString(),
    },
    {
      label: "Top category",
      value: getTopCategory(expenses),
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "10px",
      marginBottom: "20px",
    }}>
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "14px",
            padding: "16px 18px",
          }}
        >
          <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "11px",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}>
            {s.label}
          </p>
          <p style={{
            color: "#fff",
            fontSize: "20px",
            fontWeight: "700",
            letterSpacing: "-0.02em",
          }}>
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}