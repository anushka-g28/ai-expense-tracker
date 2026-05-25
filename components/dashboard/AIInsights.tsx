// Sends expenses to our API route, gets Gemini insights, displays them.

"use client";

import { useState } from "react";
import { Expense } from "@/lib/firestore";
import { Sparkles, Brain } from "lucide-react";

interface Props {
  expenses: Expense[];
}

export default function AIInsights({ expenses }: Props) {
  const [insights, setInsights]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState(false);

  const handleGetInsights = async () => {
    if (expenses.length === 0) {
      setError("Add some expenses first before getting insights.");
      return;
    }

    setLoading(true);
    setError("");
    setInsights("");

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expenses }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setInsights(data.insights);
        setGenerated(true);
      }
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "16px" }}>

      {/* Get Insights Button */}
      <button
        onClick={handleGetInsights}
        disabled={loading}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background: loading
            ? "rgba(168,85,247,0.1)"
            : "rgba(168,85,247,0.15)",
          border: "1px solid rgba(168,85,247,0.3)",
          borderRadius: "12px",
          padding: "12px",
          color: "#c084fc",
          fontSize: "13px",
          fontWeight: "600",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all .2s",
          marginBottom: insights || error ? "12px" : "0",
        }}
      >
        <span style={{ fontSize: "16px" }}><Sparkles className="w-4 h-4 text-indigo-400" /></span>
        {loading
          ? "Analyzing your spending patterns..."
          : generated
          ? "Refresh Insights"
          : "Generate Smart Insights"}
      </button>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: "10px",
          padding: "12px 14px",
          color: "#f87171",
          fontSize: "13px",
        }}>
          {error}
        </div>
      )}

      {/* Loading animation */}
      {loading && (
        <div style={{
          background: "rgba(168,85,247,0.06)",
          border: "1px solid rgba(168,85,247,0.2)",
          borderRadius: "12px",
          padding: "20px",
          textAlign: "center",
        }}>
          <div style={{
            display: "flex",
            gap: "6px",
            justifyContent: "center",
            marginBottom: "10px",
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#c084fc",
                  animation: `pulse ${0.6 + i * 0.2}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>
          <p style={{ color: "rgba(192,132,252,0.6)", fontSize: "12px" }}>
            Analyzing {expenses.length} expenses...
          </p>
        </div>
      )}

      {/* AI Insights Result */}
      {insights && !loading && (
        <div style={{
          background: "rgba(168,85,247,0.06)",
          border: "1px solid rgba(168,85,247,0.2)",
          borderRadius: "12px",
          padding: "18px 20px",
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "14px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(168,85,247,0.15)",
          }}>
            <span style={{ fontSize: "18px" }}><Brain className="w-4 h-4 text-indigo-400" /></span>
            <div>
              <p style={{
                color: "#c084fc",
                fontSize: "13px",
                fontWeight: "600",
              }}>
                SpendAI smart Insights
              </p>
              <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>
                Based on your {expenses.length} expenses
              </p>
            </div>
          </div>

          {/* Insights text — render each line */}
          <div style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "13px",
            lineHeight: "1.8",
            whiteSpace: "pre-wrap",
          }}>
            {insights}
          </div>
        </div>
      )}

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          from { opacity: 0.3; transform: scale(0.8); }
          to   { opacity: 1;   transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}