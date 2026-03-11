// src/App.js
import React, { useState, useCallback, useRef } from "react";
import { parseEOB } from "./services/claudeApi";
import { toCsv, downloadCsv } from "./utils/csv";
import DEMO_EOB from "./utils/demoEob";
import SummaryCard from "./components/SummaryCard";
import ClaimsTable from "./components/ClaimsTable";

// ---------------------------------------------------------------------------
// Styles (global injection)
// ---------------------------------------------------------------------------
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0b0d12; color: #e2e8f0; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #12141a; }
  ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
  .drop-zone { transition: border-color .2s, background .2s; }
  .drop-zone:hover { border-color: #00c896 !important; background: rgba(0,200,150,.03) !important; cursor: pointer; }
  .btn-primary { cursor: pointer; background: linear-gradient(135deg,#00c896,#00a876); color: #0b0d12;
    border: none; border-radius: 6px; padding: 12px 32px; font-family: inherit; font-weight: 700;
    font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
    transition: opacity .2s, transform .1s; }
  .btn-primary:hover { opacity: .88; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: .35; cursor: not-allowed; transform: none; }
  .btn-outline { cursor: pointer; background: transparent; border: 1px solid #00c896; color: #00c896;
    border-radius: 6px; padding: 9px 22px; font-family: inherit; font-size: 11px; font-weight: 600;
    letter-spacing: 1px; text-transform: uppercase; transition: background .15s; }
  .btn-outline:hover { background: rgba(0,200,150,.1); }
  .btn-ghost { cursor: pointer; background: transparent; border: 1px solid #2d3748; color: #9ca3af;
    border-radius: 4px; padding: 5px 14px; font-family: inherit; font-size: 11px;
    letter-spacing: 1px; text-transform: uppercase; transition: all .15s; }
  .btn-ghost:hover { border-color: #4b5563; color: #e2e8f0; }
  .btn-ghost.active { background: rgba(0,200,150,.13); border-color: #00c896; color: #00c896; }
  .pulse { animation: pulse 1.6s ease-in-out infinite; }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
  tr:hover td { background: rgba(255,255,255,.025) !important; }
`;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const fmt = (n) =>
  "$" + Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2 });

const ALL = "ALL";
const STATUS_OPTIONS = [ALL, "PAID", "DENIED", "PARTIAL", "PENDING"];

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export default function App() {
  // API key state — reads from env first, falls back to user input
  const [apiKey, setApiKey] = useState(
    process.env.REACT_APP_ANTHROPIC_API_KEY || ""
  );
  const [eobText, setEobText] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterOrg, setFilterOrg] = useState(ALL);
  const [filterStatus, setFilterStatus] = useState(ALL);

  const fileInputRef = useRef();

  // ---- file handling -------------------------------------------------------
  const handleFile = useCallback(async (file) => {
    if (!file) return;
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      setEobText(await file.text());
    } else {
      setError("Only plain-text (.txt) EOB files are supported.");
    }
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  // ---- parse ---------------------------------------------------------------
  const handleParse = async () => {
    if (!apiKey.trim()) {
      setError("Please enter your Anthropic API key.");
      return;
    }
    if (!eobText.trim()) {
      setError("Please paste or upload an EOB document.");
      return;
    }
    setError("");
    setLoading(true);
    setRows([]);
    try {
      const data = await parseEOB(eobText, apiKey.trim());
      setRows(data);
      setFilterOrg(ALL);
      setFilterStatus(ALL);
    } catch (err) {
      setError("Parsing failed: " + err.message);
    }
    setLoading(false);
  };

  // ---- filtered rows -------------------------------------------------------
  const orgs = [ALL, ...new Set(rows.map((r) => r.organization).filter(Boolean))];

  const filtered = rows.filter((r) => {
    const orgOk = filterOrg === ALL || r.organization === filterOrg;
    const stOk = filterStatus === ALL || r.status === filterStatus;
    return orgOk && stOk;
  });

  // ---- summary stats -------------------------------------------------------
  const totalBilled = filtered.reduce((s, r) => s + (Number(r.billed_amount) || 0), 0);
  const totalPaid = filtered.reduce((s, r) => s + (Number(r.plan_paid) || 0), 0);
  const denialCount = filtered.filter((r) => r.status === "DENIED").length;

  // ---- CSV download --------------------------------------------------------
  const handleDownload = () => {
    const csv = toCsv(filtered);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `EOB_Export_${date}.csv`);
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  const showResults = rows.length > 0;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{ minHeight: "100vh", fontFamily: "'IBM Plex Mono', monospace" }}>
        {/* ── Header ── */}
        <header
          style={{
            borderBottom: "1px solid #1e2330",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 24,
                fontWeight: 800,
                color: "#fff",
                letterSpacing: -0.5,
              }}
            >
              EOB <span style={{ color: "#00c896" }}>→</span> CSV
            </h1>
            <p style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>
              Explanation of Benefits Converter
            </p>
          </div>
          <span style={{ fontSize: 10, color: "#2d3748", letterSpacing: 1 }}>
            AI-POWERED · STRUCTURED OUTPUT
          </span>
        </header>

        <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 24px" }}>

          {/* ── API Key ── */}
          {!showResults && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                Anthropic API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                style={{
                  width: "100%", maxWidth: 440,
                  background: "#12141a", border: "1px solid #1e2330", borderRadius: 8,
                  color: "#e2e8f0", padding: "10px 14px", fontSize: 13,
                  fontFamily: "monospace", outline: "none",
                }}
              />
              <p style={{ marginTop: 6, fontSize: 10, color: "#374151" }}>
                Or set <code style={{ color: "#00c896" }}>REACT_APP_ANTHROPIC_API_KEY</code> in your <code>.env</code> file.
              </p>
            </div>
          )}

          {/* ── Input area ── */}
          {!showResults && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Drop zone */}
              <div
                className="drop-zone"
                style={{ border: "1px dashed #2d3748", borderRadius: 10, padding: 36, textAlign: "center" }}
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,text/plain"
                  style={{ display: "none" }}
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div style={{ fontSize: 36, marginBottom: 10 }}>📄</div>
                <div style={{ color: "#6b7280", fontSize: 13 }}>Drop .txt EOB file here</div>
                <div style={{ color: "#374151", fontSize: 11, marginTop: 4 }}>or click to browse</div>
              </div>

              {/* Paste area */}
              <textarea
                value={eobText}
                onChange={(e) => setEobText(e.target.value)}
                placeholder={
                  "Paste EOB document text here…\n\nInclude: patient name, claim IDs, service dates,\n" +
                  "procedure codes, billed/allowed amounts,\npayments, denial reasons, and provider info."
                }
                style={{
                  width: "100%", minHeight: 180,
                  background: "#12141a", border: "1px solid #1e2330", borderRadius: 10,
                  color: "#9ca3af", padding: 16, fontSize: 12,
                  fontFamily: "monospace", resize: "vertical", outline: "none",
                }}
              />
            </div>
          )}

          {/* ── Actions ── */}
          {!showResults && (
            <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <button className="btn-primary" onClick={handleParse} disabled={loading}>
                {loading ? "⟳  PROCESSING…" : "⚡  PARSE EOB DOCUMENT"}
              </button>
              <button
                className="btn-ghost"
                onClick={() => { setEobText(DEMO_EOB); setError(""); }}
              >
                Load Demo EOB
              </button>
              {eobText && (
                <span style={{ fontSize: 11, color: "#374151" }}>
                  {eobText.length.toLocaleString()} chars loaded
                </span>
              )}
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div
              style={{
                background: "rgba(255,71,87,.1)", border: "1px solid #ff4757",
                borderRadius: 8, padding: "10px 16px", color: "#ff6b78",
                fontSize: 12, marginBottom: 16,
              }}
            >
              ⚠&nbsp; {error}
            </div>
          )}

          {/* ── Loading ── */}
          {loading && (
            <div style={{ textAlign: "center", padding: 60 }}>
              <div className="pulse" style={{ fontSize: 14, color: "#00c896", letterSpacing: 3 }}>
                PARSING EOB WITH AI…
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "#374151" }}>
                Extracting claims, amounts, and status codes
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {showResults && (
            <>
              {/* Summary */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
                <SummaryCard label="Total Claims"  value={filtered.length}     accent="#00c896" />
                <SummaryCard label="Total Billed"  value={fmt(totalBilled)}    accent="#60a5fa" />
                <SummaryCard label="Plan Paid"     value={fmt(totalPaid)}      accent="#a78bfa" />
                <SummaryCard label="Denials"       value={denialCount}         accent="#ff4757" />
              </div>

              {/* Filters + actions */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
                <span style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1 }}>ORG:</span>
                {orgs.map((o) => (
                  <button
                    key={o}
                    className={`btn-ghost${filterOrg === o ? " active" : ""}`}
                    onClick={() => setFilterOrg(o)}
                  >
                    {o === ALL ? "All" : o}
                  </button>
                ))}

                <span style={{ fontSize: 10, color: "#4b5563", letterSpacing: 1, marginLeft: 12 }}>STATUS:</span>
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    className={`btn-ghost${filterStatus === s ? " active" : ""}`}
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === ALL ? "All" : s}
                  </button>
                ))}

                <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                  <button className="btn-outline" onClick={handleDownload}>
                    ⬇&nbsp; Download CSV
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => { setRows([]); setEobText(""); setError(""); }}
                  >
                    ↩&nbsp; New Document
                  </button>
                </div>
              </div>

              <ClaimsTable rows={filtered} />

              <p style={{ marginTop: 10, fontSize: 10, color: "#374151" }}>
                Showing {filtered.length} of {rows.length} records
              </p>
            </>
          )}
        </main>
      </div>
    </>
  );
}
