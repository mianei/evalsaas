export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getEffectiveScore(
  dimensionKey: string,
  aiScore: number,
  overrides: { dimensionKey: string; newScore: number }[]
): number {
  const override = overrides.find((o) => o.dimensionKey === dimensionKey);
  return override ? override.newScore : aiScore;
}
