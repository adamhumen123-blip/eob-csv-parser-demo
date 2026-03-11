// src/components/StatusBadge.js
import React from "react";

const COLOR_MAP = {
  PAID: "#00c896",
  DENIED: "#ff4757",
  PARTIAL: "#ffa502",
  PENDING: "#747d8c",
};

export default function StatusBadge({ status }) {
  const color = COLOR_MAP[status] || COLOR_MAP.PENDING;
  return (
    <span
      style={{
        background: color,
        color: "#fff",
        borderRadius: 4,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}
    >
      {status || "UNKNOWN"}
    </span>
  );
}
