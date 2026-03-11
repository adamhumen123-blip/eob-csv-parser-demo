# EOB → CSV Converter

An AI-powered web app that converts **Explanation of Benefits (EOB)** insurance documents into clean, structured CSV files — ready for reporting, billing audits, or analytics.

![EOB CSV Converter Screenshot](https://via.placeholder.com/900x500/0b0d12/00c896?text=EOB+%E2%86%92+CSV+Converter)

---

## Features

- **AI-Powered Parsing** — Paste any EOB text and Claude extracts all claim line items automatically
- **Structured Fields** — Organization, patient, claim ID, service date, provider, procedure codes, billed/allowed/paid amounts, patient responsibility, denial reasons
- **Status Detection** — Automatically classifies each line as `PAID`, `DENIED`, `PARTIAL`, or `PENDING`
- **Filter by Org & Status** — Drill down by payer or claim outcome
- **Summary Dashboard** — Total claims, billed amount, plan paid, and denial count at a glance
- **One-Click CSV Export** — RFC-4180 compliant CSV download

---

## Quick Start

### Prerequisites
- Node.js ≥ 16
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/eob-csv-converter.git
cd eob-csv-converter
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env and add your Anthropic API key:
# REACT_APP_ANTHROPIC_API_KEY=sk-ant-...
```

> **Security note:** The API key is used directly from the browser in development. For a production deployment, proxy API calls through your own backend to keep the key secret.

### Run locally

```bash
npm start
# Opens http://localhost:3000
```

### Build for production

```bash
npm run build
# Output in /build — deploy to any static host (Vercel, Netlify, GitHub Pages, etc.)
```

---

## Project Structure

```
eob-csv-converter/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ClaimsTable.js      # Data table with all extracted fields
│   │   ├── StatusBadge.js      # Colored PAID / DENIED / PARTIAL / PENDING badge
│   │   └── SummaryCard.js      # KPI summary card
│   ├── services/
│   │   └── claudeApi.js        # Anthropic API integration
│   ├── utils/
│   │   ├── csv.js              # toCsv() + downloadCsv() helpers
│   │   └── demoEob.js          # Sample EOB document for testing
│   ├── App.js                  # Main app shell, state management
│   └── index.js                # React entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## Extracted CSV Fields

| Field | Type | Description |
|---|---|---|
| `organization` | string | Insurance company / payer name |
| `patient_name` | string | Member / patient name |
| `claim_id` | string | Claim reference number |
| `service_date` | string | Date of service (MM/DD/YYYY) |
| `provider_name` | string | Treating provider or facility |
| `procedure_code` | string | CPT / HCPCS code |
| `procedure_description` | string | Human-readable service description |
| `billed_amount` | number | Amount charged by provider |
| `allowed_amount` | number | Contracted / negotiated rate |
| `plan_paid` | number | Amount paid by the insurance plan |
| `patient_responsibility` | number | Copay, coinsurance, or deductible owed |
| `status` | string | PAID / DENIED / PARTIAL / PENDING |
| `denial_reason` | string | Reason code or text if denied |
| `notes` | string | Any additional notes from the EOB |

---

## Deployment

The app is a standard Create React App and can be deployed to:

- **Vercel** — `vercel --prod`
- **Netlify** — drag & drop the `/build` folder
- **GitHub Pages** — add `"homepage"` to `package.json` then `npm run build`

For production, set your API key as an environment variable in your hosting platform and **never** expose it in client-side code. Consider adding a lightweight backend proxy.

---

## Tech Stack

- [React 18](https://react.dev/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- Plain CSS (no UI library required)
- Google Fonts: IBM Plex Mono + Syne

---

## License

MIT © 2024 — free to use, modify, and distribute.
