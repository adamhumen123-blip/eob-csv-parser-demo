// src/utils/csv.js

/** Escape a single cell value for RFC-4180 CSV. */
function escapeCell(value) {
  const s = String(value ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}

/**
 * Convert an array of objects to a CSV string.
 * Column order follows the keys of the first row.
 */
export function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escapeCell(row[h])).join(",")),
  ].join("\n");
}

/**
 * Trigger a browser download of a CSV string.
 * @param {string} csvString
 * @param {string} [filename]
 */
export function downloadCsv(csvString, filename = "EOB_Export.csv") {
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
