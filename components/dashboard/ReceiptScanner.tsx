"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

export type ScannedReceipt = {
  amount: number | null;
  category: string;
  note: string;
};

type Props = {
  onScanComplete: (data: ScannedReceipt) => void;
};

export default function ReceiptScanner({ onScanComplete }: Props) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    setError(null);
    setScanning(true);

    try {
      // Convert image to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          const result = reader.result as string;

          // Remove "data:image/jpeg;base64,"
          resolve(result.split(",")[1]);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });

      // Send to API
      const res = await fetch("/api/scan-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageBase64: base64,
        }),
      });

      if (!res.ok) {
        throw new Error("Receipt scan failed");
      }

      const data: ScannedReceipt = await res.json();

      // Send result back to parent
      onScanComplete(data);

    } catch (err) {
      console.error(err);

      setError("Could not scan receipt. Please enter manually.");
    } finally {
      setScanning(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      handleFile(file);
    }

    // Allow same file re-upload
    e.target.value = "";
  };

  return (
    <div className="mb-4">

      {/* Hidden Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Scan Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanning}
              className="
          w-full
          flex
          items-center
          justify-center
          gap-2
          px-4
          py-3
          rounded-xl
          text-sm
          font-medium
          transition-all
          duration-200
        "
        style={{
          background: scanning
            ? "rgba(239,68,68,0.12)"
            : "rgba(99,102,241,0.12)",

          border: `1px solid ${
            scanning
              ? "rgba(239,68,68,0.3)"
              : "rgba(99,102,241,0.3)"
          }`,

          color: scanning ? "#f87171" : "#818cf8",

          cursor: scanning ? "not-allowed" : "pointer",
        }}
      >
        {scanning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing receipt...
          </>
        ) : (
          <>
            <Camera className="w-4 h-4" />
            Scan Receipt
          </>
        )}
      </button>

      {/* Error */}
      {error && (
        <p
          className="mt-2 text-sm"
          style={{ color: "#f87171" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}