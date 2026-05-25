"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/authContext";
import { getAllGoals, deleteGoal, BudgetGoal } from "@/lib/budgetGoals";
import { getExpenses } from "@/lib/firestore"; // your existing function
import { BudgetAlert } from "@/app/api/check-budget-alerts/route";
import SetBudgetModel from "./SetBudgetModel";

export default function BudgetGoals() {
  const { user } = useAuth();
  const [alerts, setAlerts]       = useState<BudgetAlert[]>([]);
  const [goals, setGoals]         = useState<BudgetGoal[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing]     = useState<BudgetGoal | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // 1. Fetch goals from Firestore
    const allGoals = await getAllGoals(user.uid);
    setGoals(allGoals);

    if (allGoals.length === 0) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    // 2. Fetch this month's expenses
    const now = new Date();
    const expenses = await getExpenses(user.uid, now.getMonth(), now.getFullYear());

    // 3. Sum spending per category
    const spending: Record<string, number> = {};
    for (const e of expenses) {
      spending[e.category] = (spending[e.category] ?? 0) + e.amount;
    }

    // 4. Call alert API
    const res = await fetch("/api/check-budget-alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goals: allGoals, spending }),
    });
    const data: BudgetAlert[] = await res.json();
    setAlerts(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (category: string) => {
    if (!user) return;
    await deleteGoal(user.uid, category);
    load();
  };

  // ── Styles ────────────────────────────────────────────────────────────────

  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  };

  const levelColors = {
    over:    { bar: "#ef4444", bg: "rgba(239,68,68,0.15)",   text: "#f87171" },
    warning: { bar: "#f59e0b", bg: "rgba(245,158,11,0.15)",  text: "#fbbf24" },
    ok:      { bar: "#6366f1", bg: "rgba(99,102,241,0.15)",  text: "#a5b4fc" },
  };

  const alertBadge = (level: BudgetAlert["level"]) => {
    if (level === "over")    return { label: "Over limit",  color: "#f87171" };
    if (level === "warning") return { label: "Near limit",  color: "#fbbf24" };
    return null;
  };

  return (
    <div style={card}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600 }}>
          Budget Goals
        </p>
        <button
          onClick={() => { setEditing(null); setShowModal(true); }}
          style={{
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: "8px",
            color: "#a5b4fc",
            fontSize: "12px",
            fontWeight: 600,
            padding: "5px 12px",
            cursor: "pointer",
          }}
        >
          + Set Goal
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center", padding: "12px 0" }}>
          Loading…
        </p>
      )}

      {/* Empty state */}
      {!loading && goals.length === 0 && (
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center", padding: "12px 0" }}>
          No goals yet. Set a monthly limit for any category.
        </p>
      )}

      {/* Goal rows */}
      {!loading && alerts.map((a) => {
        const colors = levelColors[a.level];
        const badge  = alertBadge(a.level);
        const clampedPercent = Math.min(a.percent, 100);

        return (
          <div
            key={a.category}
            style={{
              background: colors.bg,
              border: `1px solid ${colors.bar}30`,
              borderRadius: "12px",
              padding: "12px 14px",
              marginBottom: "10px",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#fff", fontSize: "13px", fontWeight: 500 }}>
                  {a.category}
                </span>
                {badge && (
                  <span style={{
                    background: `${colors.bar}25`,
                    color: badge.color,
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: "20px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}>
                    {badge.label}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>
                  ₹{a.spent.toLocaleString()} / ₹{a.limit.toLocaleString()}
                </span>
                {/* Edit */}
                <button
                  onClick={() => {
                    setEditing(goals.find((g) => g.category === a.category) ?? null);
                    setShowModal(true);
                  }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}
                  title="Edit"
                >
                </button>
                {/* Delete */}
                <button
                  onClick={() => handleDelete(a.category)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.2)", fontSize: "12px" }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{
              height: "5px",
              background: "rgba(255,255,255,0.07)",
              borderRadius: "99px",
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${clampedPercent}%`,
                background: colors.bar,
                borderRadius: "99px",
                transition: "width 0.4s ease",
              }} />
            </div>

            {/* Percent label */}
            <p style={{ color: colors.text, fontSize: "11px", marginTop: "5px", textAlign: "right" }}>
              {a.percent}% used
            </p>
          </div>
        );
      })}

      {/* Modal */}
      {showModal && user && (
  <SetBudgetModel
    uid={user.uid}
    existingCategory={editing?.category}
    existingLimit={editing?.limit}
    onClose={() => setShowModal(false)}
    onSaved={() => {          
      load();
      setShowModal(false);   
    }}
  />
)}
    </div>
  );
}