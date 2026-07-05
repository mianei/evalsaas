import type { DimensionKey, EvaluationReport, HireRating } from "./types";

export const EVALUATION_JSON_SCHEMA = {
  type: "object",
  required: [
    "overallScore",
    "rating",
    "dimensions",
    "followUps",
    "redFlags",
    "summary",
  ],
  properties: {
    overallScore: { type: "number", minimum: 1, maximum: 100 },
    rating: {
      type: "string",
      enum: ["Strong Hire", "Hire", "Weak Hire", "No Hire"],
    },
    dimensions: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        required: ["key", "score", "evidence"],
        properties: {
          key: {
            type: "string",
            enum: ["professional", "project", "communication", "fit", "growth"],
          },
          score: { type: "number", minimum: 1, maximum: 5 },
          evidence: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3,
          },
        },
      },
    },
    followUps: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      items: {
        type: "object",
        required: ["question", "focus", "expectedDirection"],
        properties: {
          question: { type: "string" },
          focus: { type: "string" },
          expectedDirection: { type: "string" },
        },
      },
    },
    redFlags: {
      type: "array",
      items: {
        type: "object",
        required: ["type", "description", "verificationMethod", "severity"],
        properties: {
          type: { type: "string" },
          description: { type: "string" },
          verificationMethod: { type: "string" },
          severity: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
    summary: { type: "string", minLength: 50, maxLength: 300 },
  },
};

const VALID_KEYS: DimensionKey[] = [
  "professional",
  "project",
  "communication",
  "fit",
  "growth",
];

const VALID_RATINGS: HireRating[] = [
  "Strong Hire",
  "Hire",
  "Weak Hire",
  "No Hire",
];

export function validateEvaluationReport(
  data: unknown
): data is Omit<EvaluationReport, "generatedAt" | "isMock"> {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  if (
    typeof obj.overallScore !== "number" ||
    obj.overallScore < 1 ||
    obj.overallScore > 100
  )
    return false;

  if (!VALID_RATINGS.includes(obj.rating as HireRating)) return false;

  if (!Array.isArray(obj.dimensions) || obj.dimensions.length !== 5)
    return false;

  const keys = new Set<string>();
  for (const dim of obj.dimensions) {
    if (!dim || typeof dim !== "object") return false;
    const d = dim as Record<string, unknown>;
    if (!VALID_KEYS.includes(d.key as DimensionKey)) return false;
    keys.add(d.key as string);
    if (typeof d.score !== "number" || d.score < 1 || d.score > 5) return false;
    if (!Array.isArray(d.evidence) || d.evidence.length === 0) return false;
  }
  if (keys.size !== 5) return false;

  if (!Array.isArray(obj.followUps) || obj.followUps.length < 3) return false;

  if (!Array.isArray(obj.redFlags)) return false;

  if (typeof obj.summary !== "string" || obj.summary.length < 20) return false;

  return true;
}

export function normalizeReport(
  raw: Omit<EvaluationReport, "generatedAt" | "isMock">
): EvaluationReport {
  return {
    ...raw,
    dimensions: raw.dimensions.map((d) => ({
      ...d,
      score: Math.round(Math.max(1, Math.min(5, d.score))),
    })),
    overallScore: Math.round(Math.max(1, Math.min(100, raw.overallScore))),
    followUps: raw.followUps.map((f, i) => ({
      ...f,
      id: `fu-${i + 1}`,
    })),
    redFlags: raw.redFlags.map((r, i) => ({
      ...r,
      id: `rf-${i + 1}`,
    })),
    generatedAt: new Date().toISOString(),
  };
}
