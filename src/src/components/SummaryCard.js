// src/components/SummaryCard.js
import React from "react";

export default function SummaryCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: "#12141a",
        border: `1px solid ${accent}33`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 8,
        padding: "14px 20px",
        minWidth: 140,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "#6b7280",
          letterSpacing: 1.5,
          textTransform: "uppercase",
          marginBottom: 6,
          fontFamily: "monospace",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: accent,
          fontFamily: "monospace",
        }}
      >
        {value}
      </div>
    </div>
  );
}
