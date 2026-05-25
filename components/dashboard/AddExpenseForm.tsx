"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/lib/authContext";
import { addExpense, CATEGORIES } from "@/lib/firestore";
import VoiceButton from "./VoiceButton";
import ReceiptScanner, { ScannedReceipt } from "@/components/dashboard/ReceiptScanner";

export default function AddExpenseForm() {
  const { user } = useAuth();
  const [amount,setAmount] = useState("");
  const [category,setCategory] = useState("Food");
  const [note, setNote] = useState("");
  const [btnText, setBtnText]  = useState("Add Expense");
  const [error, setError] = useState("");
  const saving = useRef(false);

  const [amountFocused, setAmountFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  const handleVoiceResult = (
    parsedAmount: string,
    parsedCategory: string,
    fullText: string
  ) => {
    if (parsedAmount)  setAmount(parsedAmount);
    if (parsedCategory) setCategory(parsedCategory);
    if (fullText) setNote(fullText);
  };

  const handleScanComplete = (data: ScannedReceipt) => {
  if (data.amount !== null) setAmount(String(data.amount));
  if (data.category)        setCategory(data.category);
  if (data.note)            setNote(data.note);
};

  const handleSubmit = async () => {
    if (!user || !amount || Number(amount) <= 0 || saving.current) return;
    saving.current = true;
    setBtnText("Saving...");
    setError("");
    try {
      await addExpense(user.uid, Number(amount), category, note);
      setAmount("");
      setNote("");
      setCategory("Food");
    } catch (err: unknown) {
      const e = err as { message?: string; code?: string };
      setError(e.message || "Failed to save.");
    }
    saving.current = false;
    setBtnText("Add Expense");
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${focused ? "rgba(99,102,241,0.6)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: "10px",
    padding: "10px 13px",
    color: "#fff",
    fontSize: "13px",
    outline: "none",
    transition: "border-color .15s",
    boxSizing: "border-box",
  });

  const labelStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.35)",
    fontSize: "11px",
    marginBottom: "6px",
    display: "block",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "16px",
      padding: "20px",
      marginBottom: "16px",
    }}>
      <p style={{
        color: "rgba(255,255,255,0.6)",
        fontSize: "13px",
        fontWeight: "600",
        marginBottom: "16px",
      }}>
        Add expense
      </p>

      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "8px",
          padding: "10px 12px",
          marginBottom: "12px",
          color: "#f87171",
          fontSize: "12px",
        }}>
          {error}
        </div>
      )}

      {/* Receipt Scanner */}
      <ReceiptScanner onScanComplete={handleScanComplete} />

      {/* Voice Button */}
      <VoiceButton onResult={handleVoiceResult} />

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "10px",
        marginBottom: "10px",
      }}>
        <div>
          <label style={labelStyle}>Amount (₹)</label>
          <input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onFocus={() => setAmountFocused(true)}
            onBlur={() => setAmountFocused(false)}
            style={inputStyle(amountFocused)}
          />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle(false), cursor: "pointer" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ background: "#111" }}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Note</label>
        <input
          type="text"
          placeholder="What was it for?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onFocus={() => setNoteFocused(true)}
          onBlur={() => setNoteFocused(false)}
          style={inputStyle(noteFocused)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={btnText === "Saving..." || !amount}
        style={{
          width: "100%",
          background: btnText === "Saving..." || !amount
            ? "rgba(99,102,241,0.3)"
            : "#6366f1",
          color: btnText === "Saving..." || !amount
            ? "rgba(255,255,255,0.4)"
            : "#fff",
          border: "none",
          borderRadius: "10px",
          padding: "11px",
          fontSize: "13px",
          fontWeight: "600",
          cursor: btnText === "Saving..." || !amount ? "not-allowed" : "pointer",
          transition: "background .15s",
        }}
      >
        {btnText}
      </button>
    </div>
  );
}