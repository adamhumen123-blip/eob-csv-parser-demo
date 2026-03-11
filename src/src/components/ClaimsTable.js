// src/components/ClaimsTable.js
import React from "react";
import StatusBadge from "./StatusBadge";

const COLUMNS = [
  { key: "organization",         label: "Organization" },
  { key: "patient_name",         label: "Patient" },
  { key: "claim_id",             label: "Claim ID",    mono: true, color: "#60a5fa" },
  { key: "service_date",         label: "Date",        nowrap: true },
  { key: "provider_name",        label: "Provider" },
  { key: "procedure_code",       label: "Proc Code",   mono: true, color: "#a78bfa" },
  { key: "procedure_description",label: "Description", maxWidth: 180 },
  { key: "billed_amount",        label: "Billed",      money: true, color: "#e2e8f0" },
  { key: "allowed_amount",       label: "Allowed",     money: true },
  { key: "plan_paid",            label: "Plan Paid",   money: true, color: "#00c896" },
  { key: "patient_responsibility",label:"Pt. Resp.",   money: true, color: "#fbbf24" },
  { key: "status",               label: "Status",      badge: true },
  { key: "denial_reason",        label: "Denial Reason", maxWidth: 200, color: "#ff6b78" },
];

const fmt = (n) =>
  `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

export default function ClaimsTable({ rows }) {
  if (!rows.length)
    return (
      <div style={{ textAlign: "center", padding: 48, color: "#374151", fontSize: 12 }}>
        No records match the current filters.
      </div>
    );

  return (
    <div style={{ overflowX: "auto", borderRadius: 10, border: "1px solid #1e2330" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: "#12141a" }}>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "10px 12px",
                  textAlign: col.money ? "right" : "left",
                  color: "#4b5563",
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontSize: 10,
                  borderBottom: "1px solid #1e2330",
                  whiteSpace: "nowrap",
                  fontFamily: "monospace",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ cursor: "default" }}>
              {COLUMNS.map((col) => {
                const raw = row[col.key];
                const cellStyle = {
                  padding: "9px 12px",
                  borderBottom: "1px solid #0f1117",
                  color: col.color || "#9ca3af",
                  verticalAlign: "middle",
                  fontFamily: col.mono ? "monospace" : "inherit",
                  textAlign: col.money ? "right" : "left",
                  whiteSpace: col.nowrap ? "nowrap" : undefined,
                  maxWidth: col.maxWidth || undefined,
                  overflow: col.maxWidth ? "hidden" : undefined,
                  textOverflow: col.maxWidth ? "ellipsis" : undefined,
                };
                return (
                  <td key={col.key} style={cellStyle}>
                    {col.badge ? (
                      <StatusBadge status={raw} />
                    ) : col.money ? (
                      fmt(raw)
                    ) : (
                      raw || "—"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
