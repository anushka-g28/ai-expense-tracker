"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/firestore";
import { setGoal } from "@/lib/budgetGoals";

type Props = {
  uid: string;
  existingCategory?: string;
  existingLimit?: number;
  onClose: () => void;
  onSaved: () => void;
};

export default function SetBudgetModel({
  uid,
  existingCategory,
  existingLimit,
  onClose,
  onSaved,
}: Props) {
  const [category, setCategory] = useState(existingCategory ?? CATEGORIES[0]);
  const [limit, setLimit] = useState(existingLimit ? String(existingLimit) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!limit || Number(limit) <= 0) {
      setError("Enter a valid limit.");
      return;
    }
    setSaving(true);
    try {
      await setGoal(uid, category, Number(limit));
      onSaved();
      onClose();
    } catch {
      setError("Failed to save. Try again.");
      setSaving(false);
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  };

  const modal: React.CSSProperties = {
    background: "#111",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "24px",
    width: "100%",
    maxWidth: "360px",
    margin: "0 16px",
  };

  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.35)",
    fontSize: "11px",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "10px",
    padding: "10px 13px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "12px",
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <p style={{ color: "#fff", fontWeight: 600, fontSize: "14px", marginBottom: "18px" }}>
          {existingCategory ? "Edit Budget Limit" : "Set Budget Limit"}
        </p>

        <label style={labelStyle}>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!!existingCategory}
          style={{ ...inputStyle, cursor: existingCategory ? "not-allowed" : "pointer" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} style={{ background: "#111" }}>{c}</option>
          ))}
        </select>

        <label style={labelStyle}>Monthly Limit (₹)</label>
        <input
          type="number"
          placeholder="e.g. 5000"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "#f87171", fontSize: "12px", marginBottom: "10px" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "none",
              background: saving ? "rgba(99,102,241,0.3)" : "#6366f1",
              color: saving ? "rgba(255,255,255,0.4)" : "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
