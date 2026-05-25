// Uses the Web Speech API built into Chrome.
// Listens for speech, converts to text, parses amount + category.

"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/firestore";
import { Mic, MicOff } from "lucide-react";

interface VoiceButtonProps {
  onResult: (amount: string, category: string, note: string) => void;
}

// Try to find a category name in the spoken text
function parseCategory(text: string): string {
  const lower = text.toLowerCase();
  for (const cat of CATEGORIES) {
    if (lower.includes(cat.toLowerCase())) return cat;
  }
  // Common aliases
  if (lower.includes("eat") || lower.includes("lunch") ||
      lower.includes("dinner") || lower.includes("breakfast") ||
      lower.includes("coffee") || lower.includes("chai") ||
      lower.includes("restaurant") || lower.includes("zomato") ||
      lower.includes("swiggy")) return "Food";
  if (lower.includes("uber") || lower.includes("auto") ||
      lower.includes("bus") || lower.includes("metro") ||
      lower.includes("cab") || lower.includes("petrol")) return "Transport";
  if (lower.includes("amazon") || lower.includes("flipkart") ||
      lower.includes("clothes") || lower.includes("shirt") ||
      lower.includes("shoes")) return "Shopping";
  if (lower.includes("movie") || lower.includes("netflix") ||
      lower.includes("game") || lower.includes("spotify")) return "Entertainment";
  if (lower.includes("medicine") || lower.includes("doctor") ||
      lower.includes("hospital") || lower.includes("pharmacy")) return "Health";
  if (lower.includes("electricity") || lower.includes("rent") ||
      lower.includes("internet") || lower.includes("phone")) return "Bills";
  if (lower.includes("book") || lower.includes("course") ||
      lower.includes("school") || lower.includes("college")) return "Education";
  return "Other";
}

// Extract the first number found in the text
function parseAmount(text: string): string {
  const match = text.match(/\d+(\.\d+)?/);
  return match ? match[0] : "";
}

export default function VoiceButton({ onResult }: VoiceButtonProps) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const startListening = () => {
    setError("");
    setTranscript("");

    // Check if browser supports Speech Recognition
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: unknown })
        .webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice not supported. Use Chrome browser.");
      return;
    }

    const recognition = new (SpeechRecognition as any)();
    recognition.lang = "en-IN"; // Indian English for better rupee amount recognition
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: {
      results: { [key: number]: { [key: number]: { transcript: string } } };
    }) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);

      // Parse amount and category from spoken text
      const amount   = parseAmount(text);
      const category = parseCategory(text);

      // Send results back to the form
      onResult(amount, category, text);
    };

    recognition.onerror = (event: { error: string }) => {
      if (event.error === "no-speech") {
        setError("No speech detected. Try again.");
      } else if (event.error === "not-allowed") {
        setError("Microphone blocked. Allow mic access in browser.");
      } else {
        setError("Error: " + event.error);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  return (
    <div style={{ marginBottom: "14px" }}>
      {/* Mic Button */}
      <button
        onClick={startListening}
        disabled={listening}
        title='Say something like "Spent 250 on food"'
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          background: listening
            ? "rgba(239,68,68,0.15)"
            : "rgba(99,102,241,0.1)",
          border: `1px solid ${listening
            ? "rgba(239,68,68,0.4)"
            : "rgba(99,102,241,0.3)"}`,
          borderRadius: "10px",
          padding: "10px",
          color: listening ? "#f87171" : "#818cf8",
          fontSize: "13px",
          fontWeight: "500",
          cursor: listening ? "not-allowed" : "pointer",
          transition: "all .2s",
        }}
      >
        {/* Mic icon using unicode */}
        <span style={{ fontSize: "16px" }}>
            {listening ? (
            <MicOff size={16} />
            ) : (
            <Mic size={16} />
            )}
        </span>
        {listening ? "Listening... speak now" : 'Voice input — say "Spent 250 on food"'}
      </button>

      {/* Show what was heard */}
      {transcript && (
        <p style={{
          color: "rgba(255,255,255,0.4)",
          fontSize: "11px",
          marginTop: "6px",
          textAlign: "center",
        }}>
          Heard: &quot;{transcript}&quot;
        </p>
      )}

      {/* Error message */}
      {error && (
        <p style={{
          color: "#f87171",
          fontSize: "11px",
          marginTop: "6px",
          textAlign: "center",
        }}>
          {error}
        </p>
      )}
    </div>
  );
}