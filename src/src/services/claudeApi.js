// src/services/claudeApi.js
// Calls the Anthropic Messages API to parse EOB text into structured JSON.
// The API key is read from the REACT_APP_ANTHROPIC_API_KEY environment variable.

const MODEL = "claude-sonnet-4-20250514";
const API_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `You are an expert insurance EOB (Explanation of Benefits) document parser.
Extract ALL claim line items from the provided EOB document and return ONLY a valid JSON array.
Do not include markdown fences, preamble, or any text outside the JSON array.

Each object in the array must have these exact fields:
- organization: string  (insurance company / payer name)
- patient_name: string
- claim_id: string
- service_date: string  (MM/DD/YYYY format)
- provider_name: string
- procedure_code: string
- procedure_description: string
- billed_amount: number
- allowed_amount: number
- plan_paid: number
- patient_responsibility: number
- status: string  ("PAID" | "DENIED" | "PARTIAL" | "PENDING")
- denial_reason: string  (empty string if not denied)
- notes: string

Return ONLY the JSON array. Use empty string or 0 for any missing fields.`;

/**
 * Parse an EOB document string into an array of structured claim objects.
 * @param {string} eobText  Raw EOB document text
 * @param {string} apiKey   Anthropic API key
 * @returns {Promise<Object[]>}
 */
export async function parseEOB(eobText, apiKey) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      // Remove the next header if you are using a proxy / backend that injects the key
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `Parse this EOB document:\n\n${eobText}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const raw = (data.content || []).map((b) => b.text || "").join("");
  const clean = raw.replace(/```json|```/gi, "").trim();

  const parsed = JSON.parse(clean);
  return Array.isArray(parsed) ? parsed : [parsed];
}
