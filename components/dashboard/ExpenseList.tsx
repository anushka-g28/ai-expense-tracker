// Displays all expenses as rows. 
"use client";
import {useState} from "react";
import { Expense, deleteExpense, CATEGORY_COLORS } from "@/lib/firestore";

interface Props {
  expenses: Expense[];
}

export default function ExpenseList({ expenses }: Props) {

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
  };

  // Empty state
  if (expenses.length === 0) {
    return (
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "16px",
        padding: "48px 24px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "28px", marginBottom: "10px" }}>🧾</p>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "13px" }}>
          No expenses yet. Add your first one above.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        padding: "13px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "11px",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          All expenses
        </span>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "12px" }}>
          {expenses.length} {expenses.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      {/* Rows */}
      {expenses.map((exp, i) => (
        <ExpenseRow
          key={exp.id}
          expense={exp}
          isLast={i === expenses.length - 1}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

function ExpenseRow({
  expense,
  isLast,
  onDelete,
}: {
  expense: Expense;
  isLast: boolean;
  onDelete: (id: string) => void;
}) {
  const [hovered,setHovered] = useState(false);
  const [deleteHovered,setDeleteHovered]  = useState(false); 

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 20px",
        borderBottom: isLast ? "none" : "1px solid rgba(255,255,255,0.04)",
        background: hovered ? "rgba(255,255,255,0.02)" : "transparent",
        transition: "background .15s",
      }}
    >
      {/* Left — dot, category, note */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: CATEGORY_COLORS[expense.category] ?? "#6b7280",
          flexShrink: 0,
        }} />
        <div>
          <p style={{ color: "#fff", fontSize: "13px", fontWeight: "500" }}>
            {expense.category}
          </p>
          {expense.note && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>
              {expense.note}
            </p>
          )}
        </div>
      </div>

      {/* Right — amount, delete */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
          ₹{expense.amount.toLocaleString("en-IN")}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          style={{
            background: "none",
            border: "none",
            color: deleteHovered ? "#f87171" : "rgba(255,255,255,0.15)",
            fontSize: "18px",
            cursor: "pointer",
            padding: "0 2px",
            lineHeight: 1,
            transition: "color .15s",
          }}
          title="Delete"
        >
          ×
        </button>
      </div>
    </div>
  );
}