const DESIRED_IMPROVEMENT_SCORES: Record<string, number> = {
  "כלל לא": 1,
  "במידה מועטה": 2,
  "במידה בינונית": 3,
  "במידה רבה": 4,
  "במידה רבה מאוד": 5,
};

// Returns 1-5, or null when the value is missing/unknown.
export function desiredImprovementToNumber(value: unknown): number | null {
  return DESIRED_IMPROVEMENT_SCORES[value as string] ?? null;
}
